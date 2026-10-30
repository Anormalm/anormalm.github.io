let messages = {};
let templates = [];
let activeCode = 'en';
const normalize = (text) => text.replace(/\s+/g, ' ').trim();
const escapePattern = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const activateLocale = (code, pack) => {
  activeCode = code;
  messages = pack;
  templates = Object.entries(pack).filter(([source]) => /\{\d+\}/.test(source)).map(([source, target]) => {
    const slots = [...source.matchAll(/\{(\d+)\}/g)].map((match) => match[1]);
    const pattern = source.split(/\{\d+\}/).map(escapePattern).join('(.*?)');
    return { pattern: new RegExp(`^${pattern}$`), slots, target, length: source.length };
  }).sort((left, right) => right.length - left.length);
};

export const translate = (value) => {
  if (activeCode === 'en' || typeof value !== 'string') return value;
  const source = normalize(value);
  if (!source) return value;
  let translated = Object.hasOwn(messages, source) ? messages[source] : null;
  if (!translated) {
    for (const template of templates) {
      const match = source.match(template.pattern);
      if (!match) continue;
      const slots = Object.fromEntries(template.slots.map((key, index) => [key, match[index + 1]]));
      translated = template.target.replace(/\{(\d+)\}/g, (token, key) => slots[key] ?? token);
      break;
    }
  }
  if (!translated) return value;
  return `${value.match(/^\s*/)[0]}${translated}${value.match(/\s*$/)[0]}`;
};

// Translate text at React element creation, leaving component identity, keys,
// refs, handlers, animation props and the DOM structure completely intact.
// The language context rerenders consumers after activating a loaded pack.
export const translateProps = (type, props) => {
  if (activeCode === 'en' || !props || props.translate === 'no' || ['code', 'pre', 'script', 'style'].includes(type)) return props;
  const translated = { ...props };
  const child = (value) => Array.isArray(value) ? value.map(child) : translate(value);
  if ('children' in props) translated.children = child(props.children);
  for (const key of ['aria-label', 'aria-valuetext', 'alt', 'placeholder']) {
    if (typeof props[key] === 'string') translated[key] = translate(props[key]);
  }
  if (typeof type === 'string' && typeof props.title === 'string') translated.title = translate(props.title);
  return translated;
};
