import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {summarize,selectRecords,compareModels,csv,estimate} from '../../public/groundlm/leaderboard-core.js';
import {parseHardAnswer,selectCases,hardRequest,runHard} from '../../public/groundlm/hard-runner-core.js';
process.chdir(fileURLToPath(new URL('../..',import.meta.url)));
const data=JSON.parse(fs.readFileSync('public/groundlm/data/hard-v1/leaderboard.json'));
const reference=JSON.parse(fs.readFileSync('public/groundlm/downloads/hard-v1/summary.json'));
const manifest=JSON.parse(fs.readFileSync('public/groundlm/data/hard-v1/manifest.json'));
const fixtures=()=>manifest.cases.flatMap(c=>JSON.parse(fs.readFileSync('public/groundlm/data/hard-v1/'+c.file)));
const cfg={endpoint:'http://127.0.0.1:8000/v1/chat/completions',model:'local-model',key:'dummy-secret',reasoning:'default',concurrency:1};

test('dashboard matches every authoritative model count, cost and paired diagnostic',()=>{
 assert.equal(data.records.length,4800);assert.equal(new Set(data.records.map(r=>r.id+'|'+r.model)).size,4800);
 for(const m of compareModels(data)){
  const expected=reference.models[m.id];assert.equal(m.total,960);assert.equal(m.counts.correct,expected.correct);assert.equal(m.counts.cutoff,expected.cutoffs);assert.equal(m.counts.wrong,expected.completed_numeric_wrong);assert.equal(m.counts.invalid,expected.invalid_completed);assert.equal(m.counts.error,0);assert.ok(Math.abs(m.cost-expected.cost_usd)<1e-9);
  for(const [v,metric] of Object.entries(m.accuracies)){assert.equal(metric.value,expected.metrics['accuracy_'+v].value);assert.equal(metric.n,expected.metrics['accuracy_'+v].n_graphs);}
  for(const v of manifest.variants.filter(v=>v!=='original'))for(const kind of ['agreement','survival']){assert.equal(m[kind][v].value,expected.metrics[kind+'_'+v].value);assert.equal(m[kind][v].n,expected.metrics[kind+'_'+v].n_graphs);}
 }
});
test('filters retain independent graph groups and exact task/size denominators',()=>{
 for(const task of manifest.tasks)for(const n of [32,64]){
  const rows=compareModels(data,{task,size:String(n)});for(const m of rows){assert.equal(m.total,80);assert.equal(m.graphs,10);assert.equal(m.original.n,10);}
 }
 assert.equal(selectRecords(data.records,{task:'triangle_count',size:'32',model:data.models[0].id}).length,80);
 assert.equal(estimate([]).value,null);assert.ok(estimate([1,1,1]).ci95[0]<1);
});
test('invalid and cutoff partners fail survival but do not enter agreement',()=>{
 const base={case_id:'c',status:'ok',variant:'original',correct:true,parsed_answer:3,cost:0};
 const s=summarize([base,{...base,variant:'degree_reversed',correct:false,parsed_answer:null,finish_reason:'length'}]);
 assert.equal(s.survival.degree_reversed.value,0);assert.equal(s.survival.degree_reversed.n,1);assert.equal(s.agreement.degree_reversed.value,null);
 const error=summarize([base,{...base,variant:'degree_reversed',status:'provider_error'}]);assert.equal(error.survival.degree_reversed.value,null);
});
test('frozen fixture hashes, counts and unchanged repeats are intact',()=>{
 assert.equal(manifest.cases.length,120);assert.equal(selectCases(manifest).length,12);assert.equal(selectCases(manifest,{profile:'full'}).length,120);
 assert.equal(selectCases(manifest,{profile:'full',task:'minimum_cut',size:'32'}).length,10);
 for(const c of manifest.cases){const bytes=fs.readFileSync('public/groundlm/data/hard-v1/'+c.file);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),c.sha256);const rows=JSON.parse(bytes);assert.equal(rows.length,8);assert.equal(rows.find(r=>r.variant==='repeat').prompt,rows.find(r=>r.variant==='original').prompt);assert.equal(new Set(rows.map(r=>r.ground_truth)).size,1);assert.ok(Number.isSafeInteger(rows[0].ground_truth));}
});
test('Hard v1 parser requires terminal nonnegative integer JSON',()=>{
 for(const text of ['{"answer":3}','```json\n{"answer":3}\n```','Reasoning 99.\n{"answer":3}'])assert.equal(parseHardAnswer(text),3);
 for(const text of ['3','The answer is 3','{"answer":true}','{"answer":3.5}','{"answer":3,"answer":4}','{"answer":-1}','{"answer":01}','{"answer":1e3}','{"answer":3} trailing','{"answer":9007199254740993}'])assert.equal(parseHardAnswer(text),null,text);
});
test('requests preserve frozen system prompt and token limit; never send answers or temperature',()=>{
 const prompt=fixtures()[0],request=hardRequest({...cfg,reasoning:'router-high',provider:'provider/fp4'},manifest,prompt.prompt);const body=JSON.parse(request.body);
 assert.equal(body.messages[0].content,manifest.system_prompt);assert.equal(body.messages[1].content,prompt.prompt);assert.equal(body.max_tokens,16384);assert.deepEqual(body.reasoning,{effort:'high'});assert.deepEqual(body.provider.only,['provider/fp4']);assert.equal(body.provider.allow_fallbacks,false);assert.ok(!('temperature' in body));assert.ok(!('ground_truth' in body));assert.equal(request.credentials,'omit');assert.equal(request.redirect,'error');
 assert.throws(()=>hardRequest({...cfg,endpoint:'https://host/?key=secret'},manifest,'x'));
});
test('BYOK runner sends real HTTP, scores output and excludes credentials from its export',async()=>{
 const p=fixtures()[0];let received;const server=http.createServer(async(req,res)=>{let body='';for await(const c of req)body+=c;received={body:JSON.parse(body),auth:req.headers.authorization};res.setHeader('Content-Type','application/json');res.end(JSON.stringify({choices:[{message:{content:cfg.key+'\n{"answer":'+p.ground_truth+'}'},finish_reason:'stop'}],provider:cfg.key,usage:{cost:.001}}));});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{const result=await runHard([p],{...cfg,endpoint:`http://127.0.0.1:${server.address().port}/v1/chat/completions`},manifest);assert.equal(result.status,'completed');assert.equal(result.results[0].correct,true);assert.equal(received.body.messages[1].content,p.prompt);assert.equal(received.auth,'Bearer '+cfg.key);assert.ok(!JSON.stringify(result).includes(cfg.key));}finally{await new Promise(resolve=>server.close(resolve));}
});
test('provider errors stop scheduling; wrong, invalid and cutoff answers are never retried',async()=>{
 const pp=fixtures().slice(0,4);let calls=0;
 const failed=await runHard(pp,cfg,manifest,{fetchImpl:async()=>{calls++;return new Response(cfg.key,{status:429});}});assert.equal(calls,1);assert.equal(failed.status,'failed');assert.equal(failed.attempted,1);assert.ok(!JSON.stringify(failed).includes(cfg.key));
 calls=0;const done=await runHard(pp,cfg,manifest,{fetchImpl:async()=>{calls++;return new Response(JSON.stringify({choices:[{message:{content:calls===1?'not JSON':'{"answer":9999999}'},finish_reason:calls===2?'length':'stop'}]}));}});assert.equal(calls,4);assert.equal(done.results.length,4);assert.equal(done.metrics.counts.invalid,1);assert.equal(done.metrics.counts.cutoff,1);assert.equal(done.metrics.counts.wrong,2);
});
test('cancellation preserves completed work without scheduling the rest',async()=>{
 const abort=new AbortController();let calls=0;const result=await runHard(fixtures().slice(0,4),cfg,manifest,{signal:abort.signal,fetchImpl:async()=>{calls++;if(calls===2){abort.abort();throw new DOMException('stop','AbortError');}return new Response(JSON.stringify({choices:[{message:{content:'{"answer":1}'},finish_reason:'stop'}]}));}});assert.equal(calls,2);assert.equal(result.status,'cancelled');assert.equal(result.results.filter(r=>r.status==='ok').length,1);
});
test('CSV safely quotes model and provider fields',()=>{assert.equal(csv([['a,b','a"b',null]]),'"a,b","a""b",""');});
