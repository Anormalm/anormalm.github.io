import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../public/misgraph/',import.meta.url));
const read=p=>fs.readFileSync(root+p,'utf8');
const dir='downloads/triangle-v1/';
const summary=JSON.parse(read(dir+'summary.json'));
const rows=read(dir+'scores.csv').trim().split(/\r?\n/).slice(1).map(line=>{
 const [id,variant,truth,answer,correct,outcome]=line.split(',');
 return {id,variant,truth:+truth,answer:+answer,correct:+correct,outcome};
});

test('triangle public scores reproduce the paired result and complete coverage',()=>{
 assert.equal(rows.length,576);
 assert.equal(new Set(rows.map(r=>r.id)).size,96);
 assert.equal(new Set(rows.map(r=>`${r.id}/${r.variant}`)).size,576);
 const graphs=JSON.parse(read(dir+'graphs.json'));
 for(const g of graphs){
  const edge=new Set(g.edges.flatMap(([a,b])=>[`${a},${b}`,`${b},${a}`]));
  let triangles=0;
  for(let a=0;a<32;a++)for(let b=a+1;b<32;b++)for(let c=b+1;c<32;c++){
   if(edge.has(`${a},${b}`)&&edge.has(`${b},${c}`)&&edge.has(`${a},${c}`))triangles++;
  }
  assert.equal(triangles,g.answer);
  for(const r of rows.filter(r=>r.id===g.id)){
   assert.equal(r.truth,g.answer);
   assert.equal(r.correct,Number(r.answer===g.answer));
   assert.equal(r.outcome,r.correct?'correct':'wrong');
  }
 }
 let losses=0,gains=0;
 for(const id of new Set(rows.map(r=>r.id))){
  const a=rows.find(r=>r.id===id&&r.variant==='original_0');
  const b=rows.find(r=>r.id===id&&r.variant==='neutral_0');
  losses+=a.correct===1&&b.correct===0;
  gains+=a.correct===0&&b.correct===1;
 }
 assert.equal(losses,summary.analysis.losses);
 assert.equal(gains,summary.analysis.gains);
 assert.equal(100*(gains-losses)/96,summary.analysis.primary_delta_pp);
 for(const [variant,v] of Object.entries(summary.variants)){
  assert.equal(rows.filter(r=>r.variant===variant&&r.correct).length,v.correct);
 }
});

test('triangle results are static, accessible and linked with scoped claims',()=>{
 const html=read('triangle.html');
 assert.ok(!html.includes('Loading results'));
 assert.ok(!/<!-- [A-Z_]+ -->/.test(html));
 for(const variant of ['original_0','neutral_0']){
  const v=summary.variants[variant];
  assert.ok(html.includes(`<td>${v.correct} / ${v.n}</td><td>${(100*v.correct/v.n).toFixed(1)}%</td>`));
 }
 assert.match(html,/secondary analysis is exploratory/);
 assert.match(html,/does not identify the model’s internal failure mechanism/);
 assert.match(html,/zero|0<\/b> cutoffs/);
 assert.match(html,/<caption>/);
 assert.match(read('study.css'),/repeating-linear-gradient/);
 for(const page of ['index.html','results.html','history.html','difficulty.html','analysis.html'])assert.ok(read(page).includes('href="triangle.html"'));
 for(const m of html.matchAll(/(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g)){
  if(/^(https?:|mailto:)/.test(m[1]))continue;
  assert.ok(fs.existsSync(root+m[1]),m[1]);
 }
});

test('triangle downloads verify and exclude private provider payloads',()=>{
 const manifest=JSON.parse(read(dir+'manifest.json'));
 assert.deepEqual(Object.keys(manifest).sort(),['graphs.json','protocol.json','scores.csv','summary.json']);
 for(const [file,hash] of Object.entries(manifest)){
  const data=fs.readFileSync(root+dir+file);
  assert.equal(crypto.createHash('sha256').update(data).digest('hex'),hash);
  assert.ok(!/reasoning_details|api_key|authorization":|"response":|"choices":|sk-or-v1-/.test(data.toString()),file);
 }
 assert.equal(summary.final_review.outstanding_reservations_usd,'0');
 assert.equal(summary.analysis.outcomes.cutoff,0);
});
