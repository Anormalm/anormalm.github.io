import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../public/misgraph/',import.meta.url));
const read=p=>fs.readFileSync(root+p,'utf8');
const data=JSON.parse(read('downloads/difficulty-v1/analysis.json'));

test('difficulty snapshot exposes correct static denominators without JavaScript',()=>{
 const html=read('difficulty.html');
 const table=html.match(/<table id="difficulty-results">([\s\S]*?)<\/table>/)[1];
 const rows=[...table.matchAll(/<tr><th scope="row">[\s\S]*?<\/tr>/g)].map(m=>m[0]);
 assert.equal(rows.length,data.models.length);
 data.models.forEach((m,i)=>{
  const c=m.coverage;
  assert.equal(c.correct+c.wrong+c.invalid+c.cutoff,c.recorded);
  const cells=[...rows[i].matchAll(/<td>(.*?)<\/td>/g)].map(m=>m[1]);
  const expected=['original','repeat','neutral','degree_reversed'].map(k=>{
   const v=m.conditions[k]; return v.recorded?`${v.correct}/${v.recorded}`:'—';
  });
  expected.push(c.recorded?`${c.cutoff}/${c.recorded}`:'—',`${c.recorded}/288`);
  assert.deepEqual(cells,expected);
 });
 assert.equal(data.models.reduce((s,m)=>s+m.coverage.recorded,0),2157);
 assert.equal(data.models.filter(m=>m.coverage.missing===0).length,5);
 assert.match(html,/None of the 18 planned contrasts passes Holm correction/);
 assert.match(html,/selected after looking at the results/);
 assert.ok(!html.includes('Loading results'));
});

test('study downloads match hashes and keep partial inference out of claims',()=>{
 const manifest=JSON.parse(read('downloads/difficulty-v1/manifest.json'));
 for(const [file,hash] of Object.entries(manifest)){
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'downloads/difficulty-v1/'+file)).digest('hex'),hash);
 }
 for(const c of data.contrasts){
  if(!c.complete_model_coverage)assert.equal(c.p_holm_18,null);
  else assert.ok(c.p_holm_18>=.05);
 }
 const audit=JSON.parse(read('downloads/difficulty-v1/claude-triangles.json'));
 assert.equal(audit.results.length,16);
 for(const r of audit.results){
  assert.equal(r.finish_reason,'stop');
  assert.equal(r.error,r.answer-r.independent_triangle_count);
  assert.equal(r.outcome,r.variant==='neutral'?'wrong':'correct');
 }
});

test('study navigation and public artifacts resolve, with causes labeled as hypotheses',()=>{
 for(const page of ['index.html','results.html','history.html','difficulty.html','analysis.html'])assert.match(read(page),/href="difficulty.html"/);
 for(const page of ['difficulty.html','analysis.html']){
  const html=read(page);
  for(const m of html.matchAll(/(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g)){
   if(/^(https?:|mailto:)/.test(m[1]))continue;
   assert.ok(fs.existsSync(root+m[1]),`${page}: ${m[1]}`);
  }
 }
 assert.match(read('analysis.html'),/hypotheses and proposed tests/);
 assert.match(read('analysis.html'),/not an established cause|does not prove/);
});
