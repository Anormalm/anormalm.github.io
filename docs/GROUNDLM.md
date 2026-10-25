# GroundLM benchmark

Public URL: https://anormalm.com/groundlm/
Runner: https://anormalm.com/groundlm/evaluate.html

## Hosting

The complete static website lives in `public/groundlm/`. Vite copies this folder
unchanged into `dist/groundlm/`, alongside the existing portfolio. Relative links
and data fetches work under this subdirectory. The CV publication links to it.

The existing GitHub Pages workflow runs the benchmark tests, builds the portfolio,
and publishes `dist`. No server, deployment keys, DNS changes or separate hosting
service are needed. Changes are prepared on `groundlm-benchmark`; merging into
`main` triggers the standard deployment.

```sh
npm ci
npm run test:groundlm
npm run build
npm run preview
```

Visit `/groundlm/` on the preview server. Source provenance and the paper are
available through the benchmark's Reproduce page.

## Visitor-owned inference

Visitors supply a complete chat-completions URL, model ID and optional API key.
The browser sends prompts directly to that endpoint. Keys are not persisted,
included in exports, or sent to the portfolio's backend. Remote services require
HTTPS and must permit the `https://anormalm.com` origin through CORS, including
the selected Authorization, api-key or x-api-key header. Native Messages and
Responses APIs need a compatible gateway. Local model servers are best used
with a locally served copy of the benchmark.

Smoke/pilot/full runs support task and diagnostic selection, concurrency,
cancellation, partial metrics and downloadable raw results. Full four-diagnostic
runs send 16,800 requests. No requests occur before the visitor clicks Test or Run.

## Updating and checking

Copy the benchmark's static distribution into `public/groundlm/`; keep tests in
`tests/groundlm/` in sync. The fixture manifest records hashes and generator
versions. Never put API keys, `.env` files, local hosting credentials or private
run outputs in `public/`.

The runner tests cover request shape, mock HTTP inference, cancellation, timeouts,
quotas, concurrency, credential redaction, fixture identity and scoring. The main
portfolio's document-level CSP remains unchanged; it does not apply to these
separate HTML documents. The benchmark needs direct connections to visitors'
chosen model services.
