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

## Visitor counts

The dashboard at `/visitors` shows recorded visits by UTC day, 7-day and 30-day totals, a 30-day daily average, country totals over 90 days, and a CSV export. It is also linked from `/node` and the command palette. Like the existing signal archive, it exposes aggregate counts publicly; it is not an authenticated admin page.

The counter records at most one visit per browser per UTC day using a local daily flag and a cross-tab browser lock where supported. Returning on another day counts again. These are approximate browser-day counts, not unique people: privacy opt-outs, blocked storage, browser data deletion, and automated traffic affect the result. `/visitors`, `/node`, and local previews do not send counts. The dashboard's exclusion switch uses the same local privacy preference as `/privacy`.

The Worker at `anormalm-signal-archive.hulifan55555.chatgpt.site` stores only daily counts and coarse country/map regions in D1, retaining 90 days. `/api/signals` returns the map summary plus daily totals. Its origin must stay in `index.html`'s `connect-src` policy. Run `npm run test:visitors` with Node 24 for the SQLite integration and recorder tests. Backend source is published separately through Sites; GitHub Pages deploys the frontend.

## Languages

All 32 language catalogs live in `src/locales/`. Each JSON file maps the English source message to its translation. Vite loads only the selected catalog; visitors stay on anormalm.com. For example, `/cv?lang=fr-FR` selects French and `/cv?lang=zh-CN` selects Simplified Chinese. Underscore aliases such as `en_US` are also accepted and normalized to `en-US`.

An explicit URL language takes priority, followed by the saved manual selection. Otherwise a country-only IP lookup selects an initial language, with English as the fallback. Only the language code is cached. See `src/lib/automaticLanguage.js` and the site's privacy page for the selection and data handling details.

When editing copy, update the matching key in every catalog. Preserve numbered placeholders such as `{0}` exactly. Keep proper names, project names, publication titles, code, and language-game sample phrases in their original form. The JSX runtime in `src/i18n/` translates visible text and accessibility labels while retaining component state and animation props; use `t()` explicitly for text composed outside JSX. Use `translate="no"` for protected text.

Run `npm run test:languages` before publishing. These checks verify locale selection, message coverage, and placeholders; they do not replace linguistic review. The catalogs are machine-assisted translations and remain editable for corrections. PDFs and external articles retain their original language.
