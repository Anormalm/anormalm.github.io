# Broad model-family graph pilot

New requests: **456/456**; matched Claude reference responses reused: **48**. New recorded/charged upper-bound cost: **US$12.4354** of the US$20 additional cap.

Six shared graph questions (three tasks, 32/64 nodes, first fixed seed per cell), each in four naming conditions. Each model has only six independent questions. This is a family-coverage pilot, not a precise ranking of frontier capabilities.

Across 504 scored slots, there are 47 completed numeric mistakes and 243 unsuccessful token cutoffs. Many low correct-answer rates are therefore resource-limit failures rather than completed incorrect judgments. Do not use this table as an equal-compute capability ranking.

Uncertain request charges are conservatively reserved at **US$0.031601** within the reported spending total. Provider-reported charges account for the rest; a timed-out request may ultimately have cost less than its reserved bound.

| Model | Correct / returned | Original | Completed wrong | Invalid | Cutoffs | API errors | New cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| x-ai/grok-4.7 | 24/24 | 6/6 | 0 | 0 | 0 | 0 | $2.8582 |
| qwen/qwen3.8-max-0902 | 4/24 | 1/6 | 0 | 0 | 20 | 0 | $1.1516 |
| openai/gpt-6.1-sol | 23/24 | 5/6 | 1 | 0 | 0 | 0 | $0.4144 |
| google/gemini-4-argon | 16/24 | 5/6 | 0 | 0 | 8 | 0 | $1.5574 |
| deepseek/deepseek-v4.1-flash-1017 | 4/24 | 1/6 | 0 | 0 | 20 | 0 | $0.0878 |
| moonshotai/kimi-k3.1-pro | 20/24 | 6/6 | 2 | 0 | 2 | 0 | $0.9055 |
| meta/muse-wonder | 18/24 | 4/6 | 0 | 0 | 6 | 0 | $3.1973 |
| z-ai/glm-5.3 | 8/24 | 3/6 | 7 | 1 | 8 | 0 | $0.2244 |
| xiaomi/mimo-v2.6-pro | 6/24 | 1/6 | 16 | 0 | 2 | 0 | $0.1149 |
| minimax/minimax-m3.1-flash | 10/24 | 3/6 | 0 | 1 | 13 | 0 | $0.0315 |
| stepfun/step-5-preview | 5/22 | 1/6 | 0 | 0 | 17 | 2 | $0.4770 |
| mistralai/mistral-large-4-0 | 6/24 | 1/6 | 0 | 0 | 18 | 0 | $0.3793 |
| nvidia/nemotron-3.5-super-vl | 4/24 | 1/6 | 0 | 0 | 20 | 0 | $0.0733 |
| inclusionai/ling-3.1-flash | 4/24 | 1/6 | 0 | 0 | 20 | 0 | $0.0439 |
| cohere/command-a-plus | 1/24 | 0/6 | 0 | 0 | 23 | 0 | $0.3047 |
| amazon/nova-2-lite-v1 | 3/24 | 1/6 | 1 | 0 | 20 | 0 | $0.4917 |
| ibm-granite/granite-4.2-8b | 1/24 | 0/6 | 0 | 0 | 23 | 0 | $0.0315 |
| google/gemma-4-31b-it | 1/24 | 1/6 | 0 | 0 | 23 | 0 | $0.0726 |
| meta-llama/llama-4-maverick | 4/24 | 1/6 | 19 | 1 | 0 | 0 | $0.0183 |
| anthropic/claude-sonnet-5.5 | 23/24 | 6/6 | 1 | 0 | 0 | 0 | reused |
| anthropic/claude-opus-5.5 | 24/24 | 6/6 | 0 | 0 | 0 | 0 | reused |

## Outcomes by task and naming condition

Counts below include cutoffs as unsuccessful responses. They are not accuracy conditional on finishing. Each task has two independent graphs, and each naming condition has six.

| Model | Shortest path /8 | Triangles /8 | Minimum cut /8 | Original /6 | Neutral /6 | Degree-aligned /6 | Reverse-degree /6 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| x-ai/grok-4.7 | 8 | 8 | 8 | 6 | 6 | 6 | 6 |
| qwen/qwen3.8-max-0902 | 4 | 0 | 0 | 1 | 1 | 1 | 1 |
| openai/gpt-6.1-sol | 7 | 8 | 8 | 5 | 6 | 6 | 6 |
| google/gemini-4-argon | 8 | 1 | 7 | 5 | 4 | 4 | 3 |
| deepseek/deepseek-v4.1-flash-1017 | 4 | 0 | 0 | 1 | 1 | 1 | 1 |
| moonshotai/kimi-k3.1-pro | 8 | 5 | 7 | 6 | 5 | 4 | 5 |
| meta/muse-wonder | 8 | 3 | 7 | 4 | 5 | 4 | 5 |
| z-ai/glm-5.3 | 6 | 1 | 1 | 3 | 2 | 2 | 1 |
| xiaomi/mimo-v2.6-pro | 5 | 0 | 1 | 1 | 2 | 1 | 2 |
| minimax/minimax-m3.1-flash | 7 | 2 | 1 | 3 | 4 | 2 | 1 |
| stepfun/step-5-preview | 5 | 0 | 0 | 1 | 1 | 2 | 1 |
| mistralai/mistral-large-4-0 | 6 | 0 | 0 | 1 | 2 | 2 | 1 |
| nvidia/nemotron-3.5-super-vl | 4 | 0 | 0 | 1 | 1 | 1 | 1 |
| inclusionai/ling-3.1-flash | 4 | 0 | 0 | 1 | 1 | 1 | 1 |
| cohere/command-a-plus | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| amazon/nova-2-lite-v1 | 3 | 0 | 0 | 1 | 1 | 0 | 1 |
| ibm-granite/granite-4.2-8b | 1 | 0 | 0 | 0 | 1 | 0 | 0 |
| google/gemma-4-31b-it | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| meta-llama/llama-4-maverick | 4 | 0 | 0 | 1 | 1 | 1 | 1 |
| anthropic/claude-sonnet-5.5 | 8 | 7 | 8 | 6 | 6 | 6 | 5 |
| anthropic/claude-opus-5.5 | 8 | 8 | 8 | 6 | 6 | 6 | 6 |

## Completed answer changes from correct originals

These are recorded paired observations with the same graph and question. Token cutoffs and invalid answers are omitted from this table. With one sample per prompt and provider-default sampling, the observations do not isolate semantic meaning from sampling variance or tokenization effects.

| Model | Case | Renaming | Correct original | Renamed answer |
| --- | --- | --- | ---: | ---: |
| moonshotai/kimi-k3.1-pro | replication-n64-triangle_count-r0 | neutral_relabel | 33 | 35 |
| moonshotai/kimi-k3.1-pro | replication-n32-minimum_cut-r0 | semantic_congruent | 34 | 31 |
| z-ai/glm-5.3 | replication-n32-triangle_count-r0 | neutral_relabel | 36 | 67 |
| z-ai/glm-5.3 | replication-n32-triangle_count-r0 | semantic_congruent | 36 | 53 |
| z-ai/glm-5.3 | replication-n64-minimum_cut-r0 | semantic_congruent | 28 | 17 |
| anthropic/claude-sonnet-5.5 | replication-n64-triangle_count-r0 | semantic_incongruent | 33 | 32 |

## Compute and availability audit

| Model | Maximum billed completion tokens | Responses above requested 8,192 | Failed provider attempts retained |
| --- | ---: | ---: | ---: |
| x-ai/grok-4.7 | 36156 | 22 | 0 |
| qwen/qwen3.8-max-0902 | 8192 | 0 | 0 |
| openai/gpt-6.1-sol | 4101 | 0 | 0 |
| google/gemini-4-argon | 8192 | 0 | 0 |
| deepseek/deepseek-v4.1-flash-1017 | 8192 | 0 | 0 |
| moonshotai/kimi-k3.1-pro | 8192 | 0 | 0 |
| meta/muse-wonder | 8327 | 6 | 0 |
| z-ai/glm-5.3 | 8192 | 0 | 0 |
| xiaomi/mimo-v2.6-pro | 8192 | 0 | 0 |
| minimax/minimax-m3.1-flash | 8192 | 0 | 0 |
| stepfun/step-5-preview | 8192 | 0 | 4 |
| mistralai/mistral-large-4-0 | 8192 | 0 | 0 |
| nvidia/nemotron-3.5-super-vl | 8192 | 0 | 0 |
| inclusionai/ling-3.1-flash | 8192 | 0 | 0 |
| cohere/command-a-plus | 8192 | 0 | 1 |
| amazon/nova-2-lite-v1 | 8192 | 0 | 0 |
| ibm-granite/granite-4.2-8b | 8192 | 0 | 0 |
| google/gemma-4-31b-it | 8192 | 0 | 0 |
| meta-llama/llama-4-maverick | 1324 | 0 | 0 |
| anthropic/claude-sonnet-5.5 | 7268 | 0 | 0 |
| anthropic/claude-opus-5.5 | 7261 | 0 | 0 |

The exact ground-truth certificates and every completed numeric mistake are in `evidence/`. Final coverage, serialized-graph equivalence, retry policy and spending checks are recorded by `finalize.py` in `spending_ledger.json`. Raw provider attempt history is preserved even when an infrastructure error is recovered.

## Selection and availability

Selection source: [Artificial Analysis model leaderboard](https://artificialanalysis.ai/leaderboards/models), checked 2026-11-02; model IDs and tariffs verified through the authenticated OpenRouter catalog. AA scores use its own reasoning settings; this experiment does not reproduce the AA evaluation or claim matching compute.

Fable is excluded. GPT-6 Astra is excluded for its Fable-like output tariff; GPT-6.1 Sol is the price-aware OpenAI frontier alternative. Gemini Carbon and Muse Wonder Full were absent from the router catalog: Argon and Muse Wonder are explicit available substitutes. Nova Lite, Granite, Gemma and Llama are family controls; they are not all claimed to be overall SOTA.

- `x-ai/grok-4.7`: AA high; newest listed Grok
- `qwen/qwen3.8-max-0902`: AA Max 0902 exact checkpoint
- `openai/gpt-6.1-sol`: AA max; price-aware frontier alternative to Astra
- `google/gemini-4-argon`: AA high; Carbon absent from router catalog
- `deepseek/deepseek-v4.1-flash-1017`: AA max; higher-ranked than older Pro
- `moonshotai/kimi-k3.1-pro`: AA listed leading Kimi
- `meta/muse-wonder`: AA max; Wonder Full absent from router catalog
- `z-ai/glm-5.3`: AA max; leading ranked GLM checkpoint
- `xiaomi/mimo-v2.6-pro`: AA listed Pro
- `minimax/minimax-m3.1-flash`: AA listed M3.1 Flash above older M3
- `stepfun/step-5-preview`: AA listed preview checkpoint
- `mistralai/mistral-large-4-0`: AA high; current Large
- `nvidia/nemotron-3.5-super-vl`: AA listed above older Ultra
- `inclusionai/ling-3.1-flash`: AA listed current Flash
- `cohere/command-a-plus`: Current ranked Cohere family representative
- `amazon/nova-2-lite-v1`: Latest available Nova generation; indexed Pro/Omni unavailable here
- `ibm-granite/granite-4.2-8b`: Current ranked available Granite
- `google/gemma-4-31b-it`: Open-weight Gemma family control; no matched index score recorded
- `meta-llama/llama-4-maverick`: Llama-family legacy control; not claimed as a frontier winner
- `anthropic/claude-sonnet-5.5`: Reused matched prompts, high reasoning effort, 8192 max tokens; historical provider routing differs.
- `anthropic/claude-opus-5.5`: Reused matched prompts, high reasoning effort, 8192 max tokens; historical provider routing differs.

## Interpretation

Provider recovery attempts: 3. Only infrastructure/provider failures may be attempted once more. Incorrect answers and token cutoffs are never retried. Scoring uses the first valid model response for each model/prompt; all failed attempts and their costs remain in the raw files and spending total.

Budget amendment: Grok exceeded the requested completion allowance because its visible-output limit excludes hidden reasoning. The guard paused at US$1.27; the original full-plan estimate was superseded. Future Grok calls reserve its full declared capacity plus the visible allowance. Original results and settings are retained. Grok must not be interpreted as receiving the same total-token cap as the other models. See budget_amendment.json and actual per-response usage.

Every request specifies max_tokens=8192. Most services apply this to reasoning plus visible output; Grok applies it only to visible output, so total compute is not matched. High reasoning effort is requested only when the catalog advertises an effort parameter; otherwise reasoning is enabled at its default when supported, or omitted for non-reasoning models. Temperature is omitted for all models. Settings, returned model identity, provider, latency, token usage and raw answers are retained.

Consistency excludes unparseable pairs; conditional survival treats an unparseable renamed answer as a failure among initially correct pairs. HTTP/provider failures are availability errors, not graph-reasoning mistakes. Cutoffs are not completed numeric errors. Explicit terminal JSON answers are parsed consistently for every model.

Provider prices are capped per request. Tier-aware reservations cover the maximum output allowance and a conservative input bound. An error blocks further automatic requests to that model; authentication/credit errors halt the batch. No automatic inference retries occur. Historical Claude references have identical prompts and requested reasoning/output budgets, but were collected earlier with different provider-routing preferences.

One response per prompt does not measure repeat variability. Degree-based names are not task-specific congruence, and semantic names change token length. All sampled questions are retained. Do not attribute a small score difference or a renamed-answer change solely to semantic meaning.

See `plan.json` for every selection, checkpoint, tariff, exclusion and frozen prompt hash; `results.jsonl` contains new immutable response records, `scored_results.json` adds re-scoring and Claude references, and `metrics.csv` provides the summary table.
