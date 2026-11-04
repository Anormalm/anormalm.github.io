import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {summarize,selectRecords} from '../../public/misgraph/leaderboard-core.js';
process.chdir(fileURLToPath(new URL('../..',import.meta.url)));
const data=JSON.parse(fs.readFileSync('public/misgraph/data/family-pilot/leaderboard.json'));
const reference=JSON.parse(fs.readFileSync('public/misgraph/downloads/family-pilot/summary.json'));

test('all 21 tested families are visible with correct source counts and preserved failures',()=>{
 assert.equal(data.models.length,21);assert.equal(data.records.length,504);assert.equal(new Set(data.records.map(r=>r.case_id)).size,6);
 for(const m of data.models){const s=summarize(selectRecords(data.records,{model:m.id})),r=reference.models[m.id];assert.equal(s.total,24);assert.equal(s.returned,r.successful_responses);assert.equal(s.counts.correct,r.correct);assert.equal(s.counts.cutoff,r.cutoffs);assert.equal(s.counts.wrong,r.completed_numeric_wrong);assert.equal(s.counts.invalid,r.invalid_completed);assert.equal(s.counts.error,r.api_errors);assert.equal(s.original.n,r.original_n);assert.equal(s.original.value,r.original_correct/r.original_n);assert.ok(Math.abs(s.cost-r.new_cost_usd)<1e-9);}
});
test('Claude references match recorded results and are explicitly marked as historical',()=>{
 for(const [id,correct] of [['anthropic/claude-opus-5.5',24],['anthropic/claude-sonnet-5.5',23]]){const m=data.models.find(m=>m.id===id);assert.equal(m.correct,correct);assert.equal(m.reused,true);assert.equal(m.new_cost_usd,0);assert.equal(m.original_correct,6);assert.equal(m.original_n,6);}
 const sonnet=data.models.find(m=>m.id==='anthropic/claude-sonnet-5.5');assert.ok(sonnet.renaming.semantic_incongruent.flips.some(r=>r.expected===33&&r.answer===32));
});
test('pilot renaming denominators and scores match the original analyzer for every model',()=>{
 const conditions={neutral:'neutral_relabel',degree_aligned:'semantic_congruent',degree_reversed:'semantic_incongruent'};
 for(const m of data.models){const s=summarize(selectRecords(data.records,{model:m.id}));for(const [v,c] of Object.entries(conditions)){const r=m.renaming[c];assert.equal(s.agreement[v].value,r.consistency);assert.equal(s.agreement[v].n,r.pairs);assert.equal(s.survival[v].value,r.conditional_survival);assert.equal(s.survival[v].n,r.initially_correct_pairs);}}
});
test('pilot task and size filters preserve their own scope and never include Hard v1 observations',()=>{
 const hard=JSON.parse(fs.readFileSync('public/misgraph/data/hard-v1/leaderboard.json')),hardCases=new Set(hard.records.map(r=>r.case_id));
 assert.ok(data.records.every(r=>!hardCases.has(r.case_id)));assert.equal(new Set(data.records.map(r=>r.variant)).size,4);
 for(const m of data.models)for(const task of data.tasks)for(const n of [32,64]){const s=summarize(selectRecords(data.records,{model:m.id,task,size:String(n)}));assert.equal(s.total,4);assert.equal(s.graphs,1);}
});
