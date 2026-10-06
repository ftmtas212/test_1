from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8777


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path != "/upload":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", "0"))
        payload = self.rfile.read(length)
        output = ROOT / "yunnan-journey-timeline-2026-10.webm"
        output.write_bytes(payload)
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(b'{"ok":true}')


if __name__ == "__main__":
    print(f"Serving recorder at http://127.0.0.1:{PORT}/timeline-recorder.html", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
