const fs = require('fs');
const https = require('https');
const raw = fs.readFileSync('new-app-build.json', 'utf8');
const start = raw.indexOf('[');
const builds = JSON.parse(raw.slice(start));
const url = builds[0] && builds[0].artifacts && builds[0].artifacts.buildUrl;
if (!url) { console.log('No download link found. Open expo.dev, go to your project, then Builds.'); process.exit(0); }
console.log('Build page:', builds[0].buildDetailsPageUrl || '');
const out = fs.createWriteStream('new-app/fertility-pathways-NEW-with-AI.apk');
const get = (u) => https.get(u, (r) => {
  if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return get(r.headers.location);
  r.pipe(out); out.on('finish', () => console.log('Saved new-app/fertility-pathways-NEW-with-AI.apk'));
});
get(url);
