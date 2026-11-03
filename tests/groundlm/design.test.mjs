import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {DEMO_NODES,DEMO_EDGES,demoLabels,labeledEdges} from '../../public/groundlm/graph-identity.js';
process.chdir(fileURLToPath(new URL('../..',import.meta.url)));

test('interactive renaming preserves every edge and has no duplicate identifiers',()=>{
 assert.equal(DEMO_NODES.length,6);assert.equal(DEMO_EDGES.length,8);
 for(const semantic of [false,true]){
  const labels=demoLabels(semantic);
  assert.equal(new Set(labels).size,6);
  assert.deepEqual(labeledEdges(semantic).map(pair=>pair.map(name=>labels.indexOf(name))),DEMO_EDGES);
 }
 assert.notDeepEqual(demoLabels(false),demoLabels(true));
});
test('all research pages retain resource navigation and self-hosted licensed type',()=>{
 for(const file of ['index','results','history','pilot','methodology','run']){
  const html=fs.readFileSync('public/groundlm/'+file+'.html','utf8');
  assert.match(html,/research.css/);assert.match(html,/site-ui.js/);assert.match(html,/class="resource-menu"/);
  for(const route of ['pilot.html','paper-results.html','benchmark.html','reproduce.html'])assert.ok(html.includes(route));
 }
 for(const font of ['archivo','source-sans-3']){
  assert.equal(fs.readFileSync('public/groundlm/assets/fonts/'+font+'-latin.woff2').subarray(0,4).toString(),'wOF2');
  assert.match(fs.readFileSync('public/groundlm/assets/fonts/'+font+'-OFL.txt','utf8'),/SIL OPEN FONT LICENSE/);
 }
});
