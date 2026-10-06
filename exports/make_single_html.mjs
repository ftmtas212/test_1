import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../public/', import.meta.url);
const [index, siteCss, leafletCss, leafletJs, itinerary, app] = await Promise.all([
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('styles.css', root), 'utf8'),
  readFile(new URL('vendor/leaflet.css', root), 'utf8'),
  readFile(new URL('vendor/leaflet.js', root), 'utf8'),
  readFile(new URL('itinerary.js', root), 'utf8'),
  readFile(new URL('app.js', root), 'utf8'),
]);

const itineraryInline = itinerary
  .replace(/^export\s+(?=const|function)/gm, '')
  .replace(/\r?\nexport\s+/g, '\n');
const appInline = app.replace(/^import[^;]+;\s*/m, '');
const safeLeafletJs = leafletJs.replaceAll('</script', '<\\/script');
const result = index
  .replace('<link rel="stylesheet" href="vendor/leaflet.css">', `<style id="leaflet-css">\n${leafletCss}\n</style>`)
  .replace('<link rel="stylesheet" href="styles.css">', `<style id="site-css">\n${siteCss}\n</style>`)
  .replace('<script type="module" src="app.js"></script>', '')
  .replace('<script src="vendor/leaflet.js"></script>', `<script>\n${safeLeafletJs}\n</script>\n<script>\n${itineraryInline}\n${appInline}\n</script>`);

await writeFile(new URL('山河之間-雲南十日旅程-單一檔案.html', import.meta.url), result, 'utf8');
console.log(`wrote ${Buffer.byteLength(result, 'utf8')} bytes`);
