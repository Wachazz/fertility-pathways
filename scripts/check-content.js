// Fails if sn.json or nd.json has keys that are not in en.json (usually a typo that
// would silently never show), and lists English keys each translation is still missing.
const path = require('path');
const content = (code) => require(path.join(__dirname, '..', 'content', `${code}.json`));

const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
const isIdList = (v) => Array.isArray(v) && v.length > 0 && v.every((x) => isObject(x) && 'id' in x);

// Walks both trees the same way the app merges them: objects by key, section lists by id.
function compare(base, over, at, extra, missing) {
  if (isIdList(base)) {
    const ids = new Set(base.map((x) => x.id));
    for (const item of Array.isArray(over) ? over : []) {
      if (!ids.has(item.id)) extra.push(`${at}[id=${item.id}]`);
    }
    for (const item of base) {
      const match = Array.isArray(over) ? over.find((x) => x.id === item.id) : undefined;
      compare(item, match, `${at}[id=${item.id}]`, extra, missing);
    }
    return;
  }
  if (isObject(base)) {
    const o = isObject(over) ? over : {};
    for (const key of Object.keys(o)) {
      if (!(key in base) && !key.startsWith('_')) extra.push(`${at}.${key}`);
    }
    for (const key of Object.keys(base)) {
      if (key.startsWith('_') || key === 'keywords') continue;
      compare(base[key], o[key], `${at}.${key}`, extra, missing);
    }
    return;
  }
  if (over === undefined) missing.push(at);
}

const en = content('en');
let failed = false;

for (const code of ['sn', 'nd']) {
  const extra = [];
  const missing = [];
  compare(en, content(code), code, extra, missing);
  if (extra.length) {
    failed = true;
    console.error(`\n${code}.json has ${extra.length} key(s) that are not in en.json:`);
    for (const k of extra) console.error(`  ✗ ${k}`);
  }
  console.log(`\n${code}.json: ${missing.length} English text(s) not translated yet (shown in English).`);
  for (const k of missing) console.log(`  · ${k}`);
}

if (failed) {
  console.error('\ncheck:content failed. Fix or remove the keys above.');
  process.exit(1);
}
console.log('\ncheck:content passed.');
