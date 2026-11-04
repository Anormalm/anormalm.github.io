import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {cohortRows,visibleRows,expectedScope,metricValue} from '../../public/misgraph/standard-core.js';
process.chdir(fileURLToPath(new URL('../..',import.meta.url)));
const protocol=JSON.parse(fs.readFileSync('public/misgraph/data/protocol/standard.json'));
const data=JSON.parse(fs.readFileSync('public/misgraph/data/hard-v1/leaderboard.json'));

test('registry scores only five fully covered configurations; sixteen await the protocol',()=>{
 const rows=cohortRows(protocol,data);
 assert.equal(rows.length,21);assert.equal(rows.filter(r=>r.eligible).length,5);
 for(const r of rows){
  if(r.eligible){assert.equal(r.recorded_slots,960);assert.equal(r.metrics.total,960);assert.equal(r.metrics.original.n,120);assert.equal(r.usage_audit.above_requested_allowance,0);assert.equal(r.request_settings.max_tokens,16384);assert.equal(r.request_settings.provider.allow_fallbacks,false);assert.deepEqual(r.request_settings.provider.only,[r.endpoint]);assert.match(r.configuration_sha256,/^[a-f0-9]{64}$/);}
  else{assert.equal(r.metrics,null);assert.equal(r.cost_per_1000,null);assert.equal(metricValue(r,'original'),null);assert.equal(r.recorded_slots,0);}
 }
 assert.equal(rows.find(r=>r.id==='anthropic/claude-opus-5.5').eligible,false);
 assert.equal(protocol.expected_prompt_ids.length,960);
 assert.equal(new Set(protocol.expected_prompt_ids).size,960);
});
test('pending models never inherit historical records and protocol mismatch prevents scoring',()=>{
 const pending=protocol.registry.find(r=>r.status==='awaiting');
 const injected={...data,records:[...data.records,...data.records.filter(r=>r.model===data.models[0].id).map(r=>({...r,model:pending.id}))]};
 assert.equal(cohortRows(protocol,injected).find(r=>r.id===pending.id).metrics,null);
 const changed=structuredClone(protocol);changed.registry[0].protocol_id='different-policy';
 assert.equal(cohortRows(changed,data)[0].metrics,null);
});
test('shared task and size filters preserve paired denominators and cost normalization',()=>{
 for(const task of protocol.policy.tasks)for(const size of ['32','64']){
  assert.equal(expectedScope(protocol,{task,size}),80);
  for(const r of cohortRows(protocol,data,{task,size}).filter(r=>r.eligible)){
   assert.equal(r.metrics.total,80);assert.equal(r.metrics.original.n,10);
   assert.equal(r.cost_per_1000,r.metrics.cost*1000/80);
  }
 }
 assert.equal(expectedScope(protocol),960);
});
test('search, status, precision and metric sorting retain missing values',()=>{
 const rows=cohortRows(protocol,data);
 assert.equal(visibleRows(rows,{query:'claude'}).length,2);
 assert.equal(visibleRows(rows,{status:'eligible'}).length,5);
 assert.equal(visibleRows(rows,{status:'awaiting'}).length,16);
 assert.equal(visibleRows(rows,{precision:'unknown'}).length,1);
 const sorted=visibleRows(rows,{sort:'original'});
 assert.ok(sorted.slice(0,5).every(r=>r.eligible));assert.ok(sorted.slice(5).every(r=>!r.eligible));
 assert.ok(sorted.slice(1,5).every((r,i)=>r.metrics.original.value<=sorted[i].metrics.original.value));
});
test('main pages use the shared dashboard, preserve archive access and contain no old initialization target',()=>{
 for(const file of ['index.html','results.html']){
  const html=fs.readFileSync('public/misgraph/'+file,'utf8');assert.match(html,/standard-dashboard.js/);assert.match(html,/id="canonical-dashboard"/);assert.doesNotMatch(html,/id="dashboard"/);assert.match(html,/history.html/);assert.match(html,/Pending/);
 }
});


test('static release matches interactive metrics, costs and protocol without JavaScript',()=>{
 const expected=visibleRows(cohortRows(protocol,data),{status:'eligible',sort:'original'});
 for(const file of ['index.html','results.html']){
  const html=fs.readFileSync('public/misgraph/'+file,'utf8');
  assert.match(html,/<section id="static-leaderboard" class="section"/);
  assert.match(html,/<div id="canonical-dashboard" hidden>/);
  assert.ok(html.includes(protocol.protocol_sha256));
  const rows=[...html.matchAll(/<tr data-snapshot-model="([^"]+)">([\s\S]*?)<\/tr>/g)];
  assert.equal(rows.length,expected.length);
  for(let i=0;i<rows.length;i++){
   const r=expected[i],m=r.metrics;
   assert.equal(rows[i][1],r.id);
   const cells=[...rows[i][2].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(x=>x[1].replace(/<[^>]*>/g,''));
   assert.ok(cells[0].startsWith((100*m.original.value).toFixed(1)+'%'));
   assert.ok(cells[0].includes('n='+m.original.n));
   assert.ok(cells[1].startsWith((100*m.survival.degree_reversed.value).toFixed(1)+'%'));
   assert.ok(cells[1].includes('n='+m.survival.degree_reversed.n+' correct originals'));
   assert.ok(cells[2].startsWith((100*m.cutoff).toFixed(1)+'%'));
   assert.equal(cells[3],m.returned+'/960');
   assert.equal(cells[4],'$'+r.cost_per_1000.toFixed(2));
  }
 }
 const bib=fs.readFileSync('public/misgraph/downloads/hard-v1/citation.bib','utf8');
 assert.ok(bib.includes(protocol.protocol_sha256));
 assert.match(bib,/author = \{Hu, Lifan\}/);
 assert.match(bib,/Hard v1/);
});
