import test from 'node:test';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../..',import.meta.url)));
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {evaluate,sample,answer,labels,serialize,shortestPath,models} from '../../public/groundlm/engine.js';

test('paired metrics use correct denominators and count unclear survival as failure',()=>{
 const r=evaluate(sample);
 assert.equal(r.queries,5);assert.equal(r.accuracy,.8);assert.equal(r.correct,4);
 assert.equal(r.retained,2);assert.equal(r.cfm,.5);
 assert.equal(r.ic_neutral,.8);assert.equal(r.ic_semantic,.5);
 assert.ok(Math.abs(r.semantic_gap-.3)<1e-12);
 assert.equal(r.semantic_pairs,4);assert.equal(r.queries_with_unclear,1);
 assert.equal(r.per_task.shortest_path.cfm,.5);
});
test('empty denominators remain undefined, not zero or perfect',()=>{
 const r=evaluate([{id:'x',task:'connectivity',ground_truth:'yes',original:'unclear',neutral:'no',semantic:'unclear'}]);
 assert.equal(r.cfm,null);assert.equal(r.ic_neutral,null);assert.equal(r.ic_semantic,null);assert.equal(r.semantic_gap,null);
 assert.equal(r.accuracy,0);
});
test('baseline wrong answers are excluded from conditional survival',()=>{
 const r=evaluate([{id:'x',task:'connectivity',ground_truth:'yes',original:'no',neutral:'no',semantic:'yes'}]);
 assert.equal(r.retained,0);assert.equal(r.cfm,null);assert.equal(r.ic_neutral,1);assert.equal(r.ic_semantic,0);
});
test('schema rejects missing, duplicate, malformed and non-finite answers',()=>{
 for(const bad of [[],{},[sample[0],sample[0]],[{...sample[0],semantic:undefined}],[{...sample[0],task:'made_up'}],[{...sample[0],ground_truth:'unclear'}],[{...sample[0],original:'The answer is 3'}],[{...sample[0],original:Infinity}],[{...sample[0],original:-1}]])assert.throws(()=>evaluate(bad));
});
test('case and whitespace normalization, numeric path answers',()=>{
 assert.equal(evaluate([{id:'x',task:'connectivity',ground_truth:'YES',original:' yes ',neutral:'yes',semantic:'YES'}]).cfm,1);
 assert.equal(evaluate([{id:'x',task:'shortest_path',ground_truth:3,original:3,neutral:'3',semantic:3}]).cfm,1);
});
test('symbolic tasks on the demo graph are correct',()=>{
 assert.deepEqual(shortestPath(0,4),[0,2,3,4]);assert.equal(answer('shortest_path',0,4),'3');assert.equal(answer('shortest_path',2,2),'0');
 assert.equal(answer('connectivity',0,4),'yes');assert.equal(answer('triangle_detection',0),'yes');assert.equal(answer('triangle_detection',4),'no');
 assert.equal(answer('common_neighbor',0,4),'no');assert.equal(answer('common_neighbor',0,3),'yes');
});
test('degree-ranked semantic labels remap both endpoints, structure stays intact',()=>{
 assert.deepEqual(labels(true),['Center','Bridge','Hub','Anchor','Core']);
 const prompt=serialize({semantic:true,format:'json'});
 assert.ok(prompt.includes('from Center to Core'));assert.ok(!prompt.includes('X1'));
 const graph=JSON.parse(prompt.split('Undirected graph:\n')[1].split('\n\nQuestion:')[0]);
 assert.equal(graph.nodes.length,5);assert.equal(graph.edges.length,5);
 assert.ok(serialize({format:'adjacency'}).includes('X3: X2, X1, X4'));
});
test('reported results match checked-in downloads and four selected models',()=>{
 assert.deepEqual(JSON.parse(fs.readFileSync('public/groundlm/downloads/reported-results.json')).models,models);
 assert.equal(models.length,4);assert.equal(models[0].cfm,72.9);assert.equal(models[3].gap,6.1);
});
test('all local HTML links, assets and fragment targets resolve',()=>{
 const files=fs.readdirSync('public/groundlm').filter(f=>f.endsWith('.html'));assert.equal(files.length,6);
 for(const f of files){const html=fs.readFileSync('public/groundlm/'+f,'utf8');assert.ok(html.includes('id="main"'));
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(?:https?:|mailto:|data:)/.test(url))continue;
   const [target,hash]=url.split('#'),dest=path.join('public/groundlm',target||f);assert.ok(fs.existsSync(dest),`${f}: ${url}`);
   if(hash){const content=fs.readFileSync(dest,'utf8');assert.ok(content.includes(`id="${hash}"`),`${f}: missing ${hash}`);}
  }
 }
});
