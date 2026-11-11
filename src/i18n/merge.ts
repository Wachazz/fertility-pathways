type Json = unknown;
type Obj = Record<string, Json>;

const isObject = (v: Json): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

// Lists of sections or steps are matched by id, so a translation can list only some of them.
const isIdList = (v: Json): v is Obj[] => Array.isArray(v) && v.length > 0 && v.every((x) => isObject(x) && 'id' in x);

const byId = (list: Json, id: Json) => (Array.isArray(list) ? list.find((x) => isObject(x) && x.id === id) : undefined);

// Search words, not shown on screen. Translated words are added to the English ones.
const KEYWORDS = 'keywords';

// Missing keys in a translation fall back to English, so the app never shows a blank.
export function merge(base: Json, over: Json, key?: string): Json {
  if (over === undefined) return base;
  if (key === KEYWORDS && Array.isArray(base) && Array.isArray(over)) return [...base, ...over];
  if (isIdList(base)) return base.map((item) => merge(item, byId(over, item.id)));
  if (isObject(base) && isObject(over)) {
    const out: Obj = {};
    for (const k of Object.keys(base)) out[k] = merge(base[k], over[k], k);
    return out;
  }
  return over;
}

// True when every visible English text under this branch also exists in the translation.
export function isComplete(base: Json, over: Json): boolean {
  if (over === undefined) return false;
  if (isIdList(base)) return base.every((item) => isComplete(item, byId(over, item.id)));
  if (isObject(base) && isObject(over)) {
    return Object.keys(base)
      .filter((k) => !k.startsWith('_') && k !== KEYWORDS)
      .every((k) => isComplete(base[k], over[k]));
  }
  return true;
}
