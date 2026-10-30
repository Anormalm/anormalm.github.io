const packs = import.meta.glob('../locales/*.json');
export const loadLocale = async (code) => {
  if (code === 'en') return {};
  const loader = packs[`../locales/${code}.json`];
  if (!loader) throw new Error('Language pack unavailable');
  return (await loader()).default;
};
