import test from 'node:test';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../..',import.meta.url)));
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import http from 'node:http';
import {selectGraphs,makePlan,queryKey,parseAnswer,validateEndpoint,requestOptions,complete,runPlan,scoreRun,DIAGNOSTICS} from '../../public/groundlm/runner-core.js';
const manifest=JSON.parse(fs.readFileSync('public/groundlm/data/benchmark/manifest.json'));
const all=manifest.graphs.flatMap(g=>JSON.parse(fs.readFileSync('public/groundlm/data/benchmark/'+g.file)));
const tasks=['connectivity','shortest_path','triangle_detection','common_neighbor'];
const fixtures=profile=>{const ids=new Set(selectGraphs(manifest,profile).map(g=>g.id));return all.filter(r=>ids.has(r.graph_id));};
const plan=(profile='smoke',diagnostics=['isomorphism_consistency'])=>makePlan(fixtures(profile),{profile,tasks,diagnostics});
const correct=rows=>rows.map(r=>({...r,status:'ok',parsed_answer:String(r.ground_truth),model_answer:'Final answer: '+r.ground_truth}));
const config={endpoint:'https://service.example/v1/chat/completions',model:'test-model',apiKey:'dummy-secret',temperature:0,maxTokens:256,concurrency:1};
const response=text=>new Response(JSON.stringify({choices:[{message:{content:text},finish_reason:'stop'}],usage:{prompt_tokens:10,completion_tokens:5}}));

test('all 100 fixtures match hashes and all scope counts are exact',()=>{
 assert.equal(manifest.graphs.length,100);assert.equal(all.length,16800);
 for(const g of manifest.graphs)assert.equal(crypto.createHash('sha256').update(fs.readFileSync('public/groundlm/data/benchmark/'+g.file)).digest('hex'),g.sha256);
 for(const [profile,ic,total] of [['smoke',60,280],['pilot',180,840],['full',3600,16800]]){assert.equal(plan(profile).length,ic);assert.equal(plan(profile,DIAGNOSTICS).length,total);}
 assert.equal(new Set(plan('full').map(queryKey)).size,1200);
 assert.equal(makePlan(fixtures('smoke'),{profile:'smoke',tasks:['shortest_path'],diagnostics:['isomorphism_consistency']}).length,15);
 assert.throws(()=>makePlan([],{tasks:[],diagnostics:DIAGNOSTICS}));
});
test('repeated sampled questions retain distinct groups and balanced variants',()=>{
 const groups=new Map();for(const r of all){const k=r.diagnostic+'|'+queryKey(r);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r);}
 for(const rows of groups.values()){const d=rows[0].diagnostic;assert.equal(rows.length,['format_stability','distractor_robustness'].includes(d)?4:3);}
 assert.equal(groups.size,4800);
});
test('perfect full audit has correct denominators and no canonical self-comparisons',()=>{
 const m=scoreRun(correct(plan('full',DIAGNOSTICS))).metrics;
 assert.deepEqual(m.accuracy,{value:1,n:1200});assert.deepEqual(m.FS,{value:1,n:7200});assert.deepEqual(m.OS,{value:0,n:2400});assert.deepEqual(m.DR,{value:1,n:3600});assert.deepEqual(m.CF_M,{value:1,n:1200});assert.equal(m.semantic_gap.value,0);
});
test('unclear semantic answers fail survival but are excluded from consistency',()=>{
 const rows=correct(plan());rows.find(r=>r.perturbation==='misleading_relabel').parsed_answer='unclear';
 const s=scoreRun(rows);assert.deepEqual(s.metrics.CF_M,{value:19/20,n:20});assert.deepEqual(s.metrics.IC_M,{value:1,n:19});assert.equal(s.excluded_unclear_pairs.IC_M,1);
});
test('failed requests do not become wrong predictions or completed comparisons',()=>{
 const rows=correct(plan());rows[0].status='error';const s=scoreRun(rows);assert.equal(s.metrics.accuracy.n,19);assert.equal(s.metrics.accuracy.value,1);assert.equal(s.metrics.CF_M.n,19);assert.equal(s.failed_requests,1);
 const empty=scoreRun([]);assert.equal(empty.metrics.accuracy.value,null);assert.equal(empty.metrics.semantic_gap.value,null);
});
test('parsing follows explicit final answers and task-specific heuristics',()=>{
 for(const [text,task,answer] of [['Initially yes. Final answer: No.','connectivity','no'],['distance is 3','shortest_path','3'],['5 hops','shortest_path','5'],['Unknown','shortest_path','unclear'],['There is no path','connectivity','no'],['The node does not participate','triangle_detection','no'],['They do share a neighbor','common_neighbor','yes'],['','connectivity','unclear']])assert.equal(parseAnswer(text,task),answer);
});
test('requests contain only inference inputs, explicit configuration and key header',()=>{
 const o=requestOptions(config,'graph prompt');const b=JSON.parse(o.body);assert.equal(o.headers.Authorization,'Bearer dummy-secret');assert.equal(b.model,'test-model');assert.equal(b.messages.length,2);assert.equal(b.messages[1].content,'graph prompt');assert.equal(b.max_tokens,256);assert.equal(b.temperature,0);assert.equal(o.redirect,'error');assert.equal(o.credentials,'omit');assert.ok(!o.body.includes(config.apiKey));assert.ok(!('ground_truth'in b));
 const alt=requestOptions({...config,auth:'api-key',temperature:null,tokenField:'max_completion_tokens',reasoningEffort:'low'},'x');const body=JSON.parse(alt.body);assert.equal(alt.headers['api-key'],config.apiKey);assert.equal(body.max_completion_tokens,256);assert.ok(!('temperature'in body));assert.equal(body.reasoning_effort,'low');
 assert.ok(!('max_tokens'in JSON.parse(requestOptions({...config,tokenField:'omit'},'x').body)));
});
test('endpoint validation accepts TLS and loopback only, with no URL credentials',()=>{
 for(const value of ['https://service.example/v1/chat/completions','http://localhost:8000/v1/chat/completions','http://127.0.0.1:11434/v1/chat/completions'])assert.ok(validateEndpoint(value));
 for(const value of ['http://service.example','https://user:pass@service.example','https://service.example?key=secret','https://service.example#key','not a URL'])assert.throws(()=>validateEndpoint(value));
});
test('actual local HTTP service receives a benchmark request; exported responses redact key',async()=>{
 let received;const server=http.createServer(async(req,res)=>{let data='';for await(const chunk of req)data+=chunk;received={headers:req.headers,body:JSON.parse(data)};res.setHeader('Content-Type','application/json');res.end(JSON.stringify({choices:[{message:{content:'Final answer: yes '+config.apiKey},finish_reason:'stop'}]}));});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{const result=await runPlan(plan().slice(0,1),{...config,endpoint:`http://127.0.0.1:${server.address().port}/v1/chat/completions`});assert.equal(result.status,'completed');assert.equal(received.headers.authorization,'Bearer '+config.apiKey);assert.equal(received.body.messages[1].content,plan()[0].prompt);assert.ok(!JSON.stringify(result).includes(config.apiKey));assert.ok(result.results[0].model_answer.includes('[REDACTED]'));}finally{await new Promise(resolve=>server.close(resolve));}
});
test('quota failures stop scheduling and never retry or expose provider error body',async()=>{
 let calls=0;const result=await runPlan(plan(),config,{fetchImpl:async()=>{calls++;return new Response('secret body '+config.apiKey,{status:429});}});assert.equal(calls,1);assert.equal(result.status,'failed');assert.equal(result.results[0].status,'error');assert.ok(!JSON.stringify(result).includes(config.apiKey));assert.equal(scoreRun(result.results).metrics.accuracy.n,0);
});
test('cancellation aborts active work and preserves successful partial results',async()=>{
 const abort=new AbortController();let calls=0;const result=await runPlan(plan(),config,{signal:abort.signal,fetchImpl:async()=>{calls++;if(calls===2){abort.abort();throw new DOMException('Cancelled','AbortError');}return response('Final answer: yes');}});assert.equal(calls,2);assert.equal(result.status,'cancelled');assert.equal(result.results.filter(r=>r.status==='ok').length,1);
});
test('request timeout and incompatible responses produce actionable errors',async()=>{
 await assert.rejects(()=>complete({...config,timeoutSeconds:.01},'x',{fetchImpl:async(url,opts)=>new Promise((resolve,reject)=>opts.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))))}),/timed out/);
 await assert.rejects(()=>complete(config,'x',{fetchImpl:async()=>new Response('not json')}),/JSON/);
 await assert.rejects(()=>complete(config,'x',{fetchImpl:async()=>new Response('{}')}),/chat-completions/);
});
test('concurrency stays within configured bound',async()=>{
 let active=0,peak=0;const result=await runPlan(plan().slice(0,9),{...config,concurrency:3},{fetchImpl:async()=>{active++;peak=Math.max(peak,active);await new Promise(r=>setTimeout(r,5));active--;return response('Final answer: yes');}});assert.equal(peak,3);assert.equal(result.results.length,9);
});
