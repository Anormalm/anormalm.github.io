# GroundLM Hard v1 reference evaluation

Collection complete: **True**. Slots: **4800/4800**. Recorded cost/upper bound: **US$17.4451 / US$27.00**.

120 fresh independent graphs, six tasks, 32/64 nodes, eight conditions including an identical-input repeat. The active scope contains 5 endpoint configurations. Endpoints and inference settings were frozen before collection. An optional weak control may be admitted later using remaining budget, without inspecting answer quality. Endpoint precision is named explicitly. The earlier 21-model pilot is separate and is not represented as a full leaderboard.

| Configuration | Slots | Correct | Completed wrong | Invalid | Cutoffs | Provider errors | Cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| deepseek/deepseek-v4.1-flash-1017 (fp4; sail-research/fp4) | 960/960 | 633 | 19 | 0 | 308 | 0 | $1.5468 |
| z-ai/glm-5.3 (fp8; baidu/fp8) | 960/960 | 568 | 20 | 0 | 372 | 0 | $9.0384 |
| minimax/minimax-m3.1-flash (fp8; tenstorrent/fp8) | 960/960 | 630 | 121 | 3 | 206 | 0 | $1.5174 |
| inclusionai/ling-3.1-flash (unknown; novita) | 960/960 | 356 | 7 | 0 | 597 | 0 | $2.9508 |
| ibm-granite/granite-4.2-8b (bf16; coreweave/bf16) | 960/960 | 98 | 0 | 0 | 862 | 0 | $2.3917 |

## Structural diagnostics

Each rate below includes its actual graph denominator. Agreement requires two parseable answers; survival requires a correct original and a returned counterpart. Invalid/cutoff counterparts fail survival; API errors are excluded and exposed through coverage. Small parseable subsets must not be read as broad invariance. A repeat measures response variation without changing the input.

| Configuration | Original accuracy | Neutral agreement | Reversed-name agreement | Reversed-name survival | Repeat agreement |
| --- | ---: | ---: | ---: | ---: | ---: |
| deepseek/deepseek-v4.1-flash-1017 | 73.3% (120) | 93.6% (78) | 98.5% (66) | 73.9% (88) | 94.0% (83) |
| z-ai/glm-5.3 | 63.3% (120) | 94.2% (69) | 93.8% (65) | 80.3% (76) | 95.9% (73) |
| minimax/minimax-m3.1-flash | 67.5% (120) | 75.9% (87) | 76.7% (86) | 81.5% (81) | 81.5% (92) |
| inclusionai/ling-3.1-flash | 39.2% (120) | 100.0% (37) | 100.0% (36) | 76.6% (47) | 100.0% (42) |
| ibm-granite/granite-4.2-8b | 12.5% (120) | 100.0% (9) | 100.0% (8) | 53.3% (15) | 100.0% (12) |

## Interpretation and reproducibility

Confidence intervals use graph cases, never the eight correlated variants as independent observations. Binary rates include Wilson intervals plus the stratified bootstrap interval; the matched semantic gap uses the same parseable triples and a stratified graph bootstrap. Perfect bootstrap samples can be degenerate, so Wilson intervals remain visible.

The main run requests high reasoning effort when available, 16,384 max_tokens and no tools. Sampling settings are omitted for all endpoints. Different tokenizers, reasoning implementations and endpoint quantization prevent equal-compute claims. Names encode degree alignment, not verified task roles; naming interventions also change tokenization. Distractors are query-equivalent additions, not graph isomorphisms.

The reachability construction is a balanced controlled bridge test. Layered graphs provide shortest-path-count questions; the other numeric tasks use connected random graphs. This release tests these stated synthetic graph families and sizes; it does not establish natural-graph generalization.

Raw attempts and the launch journal are immutable. Provider failures may normally be recovered once. The user approved one additional infrastructure-only attempt for exactly eight named slots after a network interruption; the approval, cost bound and affected IDs are recorded in runs/recovery_exception_plan.json. No wrong answer, invalid model answer or token cutoff is retried. No earlier pilot observations are counted in this release. See data/manifest.json, validation.json, run_plan.json and collection_scope.json for the frozen protocol.
