from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8788
SOURCE = next(ROOT.glob("*.mp4"))
OUTPUT = ROOT / "yunnan-journey-family-compressed.mp4"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path == "/input.mp4":
            total = SOURCE.stat().st_size
            start, end = 0, total - 1
            header = self.headers.get("Range")
            if header and header.startswith("bytes="):
                spec = header[6:].split(",", 1)[0]
                left, right = (spec.split("-", 1) + [""])[:2]
                if left:
                    start = int(left)
                if right:
                    end = min(total - 1, int(right))
                else:
                    end = min(total - 1, start + 4 * 1024 * 1024 - 1)
                self.send_response(206)
                self.send_header("Content-Range", f"bytes {start}-{end}/{total}")
            else:
                self.send_response(200)
            self.send_header("Content-Type", "video/mp4")
            self.send_header("Content-Length", str(end - start + 1))
            self.send_header("Accept-Ranges", "bytes")
            self.end_headers()
            with SOURCE.open("rb") as stream:
                stream.seek(start)
                remaining = end - start + 1
                while remaining:
                    chunk = stream.read(min(1024 * 1024, remaining))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/upload":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", "0"))
        OUTPUT.write_bytes(self.rfile.read(length))
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"ok":true}')


print(f"source={SOURCE.name}", flush=True)
print(f"compress server http://127.0.0.1:{PORT}/compress.html", flush=True)
ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
