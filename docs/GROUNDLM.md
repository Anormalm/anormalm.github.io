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

## Hard v1 index (3 November 2026)

The homepage is the completed Hard v1 leaderboard: five pinned endpoint
configurations, 120 graphs, six tasks and 4800 returned responses. Search,
filter by task/node size/precision, sort metrics, compare configurations,
and open model details with graph-level intervals and pair denominators.
Accuracy, original accuracy, renaming survival, cutoff rate and recorded
cost/upper bounds are separate metrics. Task heatmaps cover the full release.

The Hard v1 visitor-owned runner is `run.html` (96-request workflow check or
960-request full benchmark before task/size filtering). It verifies fixture
hashes and sends exact prompts directly to the visitor's selected service.
No automatic retries, storage of keys, upload or leaderboard submission occurs.
`evaluate.html` still runs the original paper protocol; `paper-results.html`
retains that study's table. The studies are not combined.

`data/hard-v1/leaderboard.json` is a compact scored snapshot, and the split
fixtures/manifest are under the same directory. `downloads/hard-v1/` includes
the verified release ZIP, reference summary, CSV, report and final audit.
The new tests verify all public reference metrics against that summary,
fixture hashes, parsing, inference request settings, local HTTP, cancellation,
no-retry behavior and credential redaction. No paid APIs are used by tests.


The 21-model family pilot is published separately at `pilot.html`, linked prominently
from the homepage study tabs. It includes matched historical Claude Opus 5.5 and
Sonnet 5.5 responses (24 each), 19 newly queried model configurations, 504 slots,
502 returned model responses, six graphs, three tasks and four naming conditions.
Search/sort, task and size filters, model details, CSV and full pilot downloads
are available. Claude cost cells say Reused; their earlier inference is not claimed
to have been free. Grok compute differences and two Step API failures remain visible.
The pilot is never pooled with Hard v1. All 36 benchmark-site tests pass.


## Complete results archive

`history.html` indexes all eight saved run groups: Claude development, the two
higher-budget holdouts, full replication, unchanged-input repeat control,
optimization, family comparison, and Hard v1. The original paper remains a
separate reported study linked from the archive. There are 37 model-run rows,
5616 collected slots, and 48 reused Claude references (5664 displayed slots).
The 5690 provider attempts include 76 failure attempts and 74 additional attempts;
two Step slots remain unresolved. The model-run table retains requested settings,
provider/precision where recorded, completed numeric errors, invalid completed
answers, token cutoffs and infrastructure failures separately.

Select a row to inspect every selected saved slot, filter by task, size and
outcome, page through responses, view exact saved user prompts and visible
answers, and export filtered results. Data loads on demand by run group.
Opus's development errors, seven combined holdout cutoffs and five replication
cutoffs are visible alongside the matched 24/24 subset. Pilot model details
link to the full model history; the study switch and navigation link all views.

`downloads/history/all-results.zip` contains all three source study archives,
the original paper and reported metrics, the complete index and model-run CSV.
The Claude archive preserves raw/scored results, reports, source, settings,
paired analyses and evidence. Configs include inference identity and creation
time; account credit snapshots are excluded. The 48 reused records are checked
against the original replication answers and are not added to inference totals.
Legacy raw hashes still match their frozen spending ledger. No inference was
executed to prepare these pages.


## Shared-protocol main dashboard

The default dashboard lists all 21 tested models in a versioned Hard v1 / 16K
registry. Five complete configurations are eligible; sixteen await matched
collection. Earlier scores remain in the model history. Eligibility audits
coverage, model/provider identity, exact native settings and completion usage.
`data/protocol/standard.json` fingerprints the dataset, prompts, system,
scorer and request policy, with per-configuration identities. Sampling uses
provider defaults; high reasoning is requested where supported. This is a
common request policy, not a claim of equal native compute.

Search, coverage, precision, task and size filters apply to the comparison
table, graph-level accuracy intervals, cost scatterplot and task heatmap.
The CSV retains missing scores as blank; comparisons accept only eligible rows.
Historical Claude errors and cutoffs remain linked from the registry. All raw
releases, fixtures and historical scores are unchanged. No paid inference was
launched for this website change. A read-only 15,360-slot extension plan is
retained locally for budget review and is not authorized for execution.

Design references: Artificial Analysis methodology, HELM and Inspect log viewer.


## Visual refresh

A shared research workspace replaces the space-consuming sidebar with a resource
menu, expands the comparison table, and improves type sizes and visual hierarchy.
The local graph illustration changes identifiers while preserving all eight
edges. It sends no model requests and does not display a model prediction.

Archivo and Source Sans 3 are self-hosted with their SIL licenses and source
metadata. Resources supports keyboard Escape and outside-click dismissal;
visible focus and reduced-motion rules are provided. The paper pages share the
same type and palette. Benchmark fixtures, raw archives, metrics, request settings
and active calibration collectors are outside the scope of this visual change.
