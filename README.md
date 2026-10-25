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
