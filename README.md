# Anormalm — Personal Website

The source for [anormalm.com](https://anormalm.com), a personal portfolio covering research, engineering projects, writing, interactive experiments, and CV highlights.

## Local development

```bash
npm install
npm run dev
```

## Production build

The GroundLM benchmark is available at [/groundlm/](https://anormalm.com/groundlm/).
Visitors can run evaluations using their own model endpoint and API key.
See [GroundLM setup and deployment](docs/GROUNDLM.md).

```bash
npm run build
```

The site is built with React, Vite, Tailwind CSS, and Framer Motion. Pushes to `main` are deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml`.

## Languages

All 32 language catalogs live in `src/locales/`. Each JSON file maps the English source message to its translation. Vite loads only the selected catalog; visitors stay on anormalm.com. For example, `/cv?lang=fr-FR` selects French and `/cv?lang=zh-CN` selects Simplified Chinese. Underscore aliases such as `en_US` are also accepted and normalized to `en-US`.

An explicit URL language takes priority, followed by the saved manual selection. Otherwise a country-only IP lookup selects an initial language, with English as the fallback. Only the language code is cached. See `src/lib/automaticLanguage.js` and the site's privacy page for the selection and data handling details.

When editing copy, update the matching key in every catalog. Preserve numbered placeholders such as `{0}` exactly. Keep proper names, project names, publication titles, code, and language-game sample phrases in their original form. The JSX runtime in `src/i18n/` translates visible text and accessibility labels while retaining component state and animation props; use `t()` explicitly for text composed outside JSX. Use `translate="no"` for protected text.

Run `npm run test:languages` before publishing. These checks verify locale selection, message coverage, and placeholders; they do not replace linguistic review. The catalogs are machine-assisted translations and remain editable for corrections. PDFs and external articles retain their original language.
