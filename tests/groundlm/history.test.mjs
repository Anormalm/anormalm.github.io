import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {historyRows,caseRows,pageRows} from '../../public/misgraph/history-core.js';
process.chdir(fileURLToPath(new URL('../..',import.meta.url)));
const read=p=>JSON.parse(fs.readFileSync('public/misgraph/'+p));
const index=read('data/history/index.json');
const rows=id=>read('data/history/'+id+'.json');
const byModel=(run,model)=>index.model_runs.find(r=>r.run_id===run&&r.model===model);

test('complete inventory covers all eight run groups without double-counting 48 reused Claude slots',()=>{
 assert.equal(index.groups.length,8);assert.equal(index.model_runs.length,37);
 assert.deepEqual(index.totals,{run_groups:8,displayed_slots:5664,new_slots:5616,reused_slots:48,new_provider_attempts:5690,returned_new_slots:5614,unresolved_api_slots:2,provider_failure_attempts:76,additional_attempts:74});
 assert.equal(index.model_runs.reduce((n,r)=>n+r.provider_attempts,0),5690);assert.equal(index.model_runs.reduce((n,r)=>n+r.provider_failure_attempts,0),76);
 assert.equal(index.groups.reduce((n,g)=>n+g.new_slots,0),5616);assert.equal(index.groups.reduce((n,g)=>n+g.slots,0)-48,5616);
 for(const g of index.groups){const rr=rows(g.id);assert.equal(rr.length,g.slots);assert.equal(new Set(rr.map(r=>r.record_key)).size,rr.length);assert.equal(index.model_runs.filter(r=>r.run_id===g.id).length,g.models);}
});
test('all earlier Claude run rows match the source answer-scored summaries',()=>{
 for(const id of ['pilot01','holdout01','holdout32','replication01','repeat_control01','optimization01']){
  const source=read('downloads/history/'+id+'-summary.json');
  for(const [model,m] of Object.entries(source.models)){const r=byModel(id,model);assert.equal(r.slots,m.requests);assert.equal(r.counts.correct,m.correct);assert.equal(r.counts.cutoff,m.truncated);assert.equal(r.counts.wrong,m.completed_wrong_cases.length);assert.equal(r.counts.error,m.errors);assert.ok(Math.abs(r.cost_usd-m.cost_usd)<1e-9);assert.equal(Object.values(r.counts).reduce((a,b)=>a+b,0),r.slots);}
 }
});
test('Opus development errors, seven holdout cutoffs and full replication failures stay visible',()=>{
 const opus='anthropic/claude-opus-5.5';assert.equal(historyRows(index,{model:opus}).length,7);
 const d=byModel('pilot01',opus);assert.deepEqual(d.counts,{correct:28,wrong:3,invalid:0,cutoff:17,error:0});
 const a=byModel('holdout01',opus),b=byModel('holdout32',opus);assert.equal(a.counts.correct+b.counts.correct,13);assert.equal(a.counts.cutoff+b.counts.cutoff,7);assert.equal(a.counts.wrong+b.counts.wrong,0);
 assert.equal(byModel('replication01',opus).counts.correct,91);assert.equal(byModel('replication01',opus).counts.cutoff,5);
 assert.equal(byModel('optimization01',opus).counts.cutoff,6);assert.equal(byModel('repeat_control01',opus).counts.correct,8);
 const errors=caseRows(rows('pilot01'),{model:opus,outcome:'wrong'});assert.equal(errors.length,3);assert.ok(errors.some(r=>r.ground_truth===12&&r.parsed_answer===13));
});
test('Claude pilot references preserve exact original response provenance and are never new observations',()=>{
 const replication=new Map(rows('replication01').map(r=>[r.model+'|'+r.id,r]));const references=rows('family-pilot').filter(r=>r.source_run==='replication01');assert.equal(references.length,48);
 for(const r of references){const original=replication.get(r.model+'|'+r.id);assert.ok(original);for(const k of ['text','parsed_answer','correct','ground_truth','finish_reason'])assert.equal(r[k],original[k]);}
 for(const r of index.model_runs.filter(r=>r.reused)){assert.equal(r.run_id,'family-pilot');assert.equal(r.cost_usd,0);}
 assert.ok(rows('repeat_control01').every(r=>r.source_run==='repeat_control01'&&r.variant==='repeat'));
});
test('history run filters and case pagination preserve every selected observation',()=>{
 assert.equal(historyRows(index,{stage:'Holdout'}).length,4);assert.equal(historyRows(index,{run:'optimization01'}).length,1);
 const matches=historyRows(index,{query:'sonnet'});assert.equal(matches.length,6);assert.ok(matches.every(r=>r.model==='anthropic/claude-sonnet-5.5'));
 const rr=caseRows(rows('hard-v1'),{model:'deepseek/deepseek-v4.1-flash-1017'});assert.equal(rr.length,960);
 const paged=Array.from({length:Math.ceil(rr.length/25)},(_,p)=>pageRows(rr,p)).flat();assert.equal(paged.length,960);assert.equal(new Set(paged.map(r=>r.record_key)).size,960);
 assert.equal(caseRows(rows('family-pilot'),{outcome:'error'}).length,2);
});
test('every inspectable record resolves to its exact prompt and retains a raw visible-answer field',()=>{
 for(const g of index.groups){const rr=rows(g.id),prompts=g.prompts_file?read('data/history/'+g.prompts_file):null;
  for(const r of rr){assert.equal(typeof r.text,'string');assert.ok(['correct','wrong','cutoff','invalid','error'].includes(r.outcome));
   if(prompts)assert.equal(typeof prompts[r.id],'string');
   else {const fixture=read('data/hard-v1/'+r.case_id+'.json');assert.ok(fixture.some(p=>p.id===r.id&&p.ground_truth===r.ground_truth));}
  }
 }
});
