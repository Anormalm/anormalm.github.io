export const SYSTEM_PROMPT='You are a precise graph reasoning assistant. Answer graph questions based only on the provided graph description. Give your final answer clearly.';
export const DIAGNOSTICS=['format_stability','order_sensitivity','isomorphism_consistency','distractor_robustness'];
export function selectGraphs(manifest,profile){
 if(!['smoke','pilot','full'].includes(profile))throw new Error('Unknown run size.');
 if(profile==='full')return manifest.graphs;
 const seen=new Set();return manifest.graphs.filter(g=>{if(seen.has(g.nodes))return false;seen.add(g.nodes);return true;});
}
export const queryKey=r=>r.base_key||r.group_key;
export function makePlan(records,{profile='smoke',tasks,diagnostics}){
 if(!tasks?.length||!diagnostics?.length)throw new Error('Select at least one task and one audit.');
 if(diagnostics.some(d=>!DIAGNOSTICS.includes(d)))throw new Error('Unknown audit.');
 const first=new Map(),groups=new Map();
 for(const r of records){if(!tasks.includes(r.task)||!diagnostics.includes(r.diagnostic))continue;
  const key=queryKey(r),bucket=r.graph_id+'|'+r.task;
  if(!first.has(bucket))first.set(bucket,key);
  if(profile==='smoke'&&first.get(bucket)!==key)continue;
  if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);
 }
 return [...groups.values()].flat().map((r,i)=>({...r,request_id:i}));
}
// Mirrors the released Python extract_answer, including its documented heuristics.
export function parseAnswer(text,task){
 text=text.trim();let section=text;const lower=text.toLowerCase();
 for(const marker of ['final answer:','answer:','result:','conclusion:']){const i=lower.lastIndexOf(marker);if(i>=0){section=text.slice(i+marker.length).trim();break;}}
 const s=section.toLowerCase();
 if(task==='shortest_path'){
  for(const re of [/(?:length|distance|steps|edges)\s+(?:is|of|=)\s+(\d+)/,/\b(\d+)\s+(?:edges?|steps?|hops?)\b/,/^(\d+)/]){const m=s.match(re);if(m)return m[1];}
  return [...section.matchAll(/\b(\d+)\b/g)].at(-1)?.[1]||'unclear';
 }
 const first=s.split(/\s+/)[0].replace(/[.,;!]+$/,'');if(['yes','no'].includes(first))return first;
 if(/\banswer is\s+yes\b/.test(s))return 'yes';if(/\banswer is\s+no\b/.test(s))return 'no';
 if(task==='connectivity'&&/\bthere is (?:a |no )?path\b/.test(s))return /\bthere is no path\b/.test(s)?'no':'yes';
 if(task==='triangle_detection'&&/\bdoes (?:not |n't )?participate\b/.test(s))return /\bdoes not participate\b|\bdoesn't participate\b/.test(s)?'no':'yes';
 if(task==='common_neighbor'&&/\bdo(?:es)? (?:not |n't )?share\b/.test(s))return /\bdo not share\b|\bdo not have\b|\bno common\b/.test(s)?'no':'yes';
 let yes=s.lastIndexOf('yes'),no=s.lastIndexOf('no');
 if(yes<0||! /\byes\b/.test(s.slice(yes)))yes=-1;if(no<0||! /\bno\b/.test(s.slice(no)))no=-1;
 return yes<0&&no<0?'unclear':yes>no?'yes':'no';
}
export function validateEndpoint(value){
 let u;try{u=new URL(value);}catch{throw new Error('Enter a complete chat-completions endpoint URL.');}
 const loopback=['localhost','127.0.0.1','[::1]'].includes(u.hostname);
 if(u.protocol!=='https:'&&!(u.protocol==='http:'&&loopback))throw new Error('Use HTTPS, or HTTP on localhost for a local model server.');
 if(u.username||u.password||u.search||u.hash)throw new Error('Put the API key in its own field; the endpoint must not contain credentials, query parameters or fragments.');
 return u.href;
}
export function requestOptions(config,prompt,signal){
 const headers={'Content-Type':'application/json'};
 if(config.apiKey){if(config.auth==='api-key')headers['api-key']=config.apiKey;else if(config.auth==='x-api-key')headers['x-api-key']=config.apiKey;else headers.Authorization='Bearer '+config.apiKey;}
 if(!config.model?.trim())throw new Error('Enter your service’s model ID.');
 const body={model:config.model.trim(),messages:[{role:'system',content:SYSTEM_PROMPT},{role:'user',content:prompt}],stream:false};
 if(config.temperature!==null)body.temperature=config.temperature??0;
 if(config.tokenField!=='omit')body[config.tokenField==='max_completion_tokens'?'max_completion_tokens':'max_tokens']=config.maxTokens||256;
 if(config.reasoningEffort&&config.reasoningEffort!=='default')body.reasoning_effort=config.reasoningEffort;
 return {method:'POST',headers,body:JSON.stringify(body),signal,mode:'cors',credentials:'omit',redirect:'error',cache:'no-store',referrerPolicy:'no-referrer'};
}
function safeError(status){return ({400:'Request settings were rejected. Check the model, temperature and token parameter.',401:'Authentication failed. Check your key and auth header.',403:'Access denied. Check model access and browser-origin permissions.',404:'Endpoint or model not found. Use the full chat-completions URL.',429:'Rate limit or quota reached. The run stopped without automatic retries.'})[status]||`Service returned HTTP ${status}. The run stopped.`;}
export async function complete(config,prompt,{signal,fetchImpl=fetch}={}){
 const endpoint=validateEndpoint(config.endpoint),controller=new AbortController();
 const abort=()=>controller.abort();if(signal?.aborted)abort();signal?.addEventListener('abort',abort,{once:true});
 let timedOut=false;const timer=setTimeout(()=>{timedOut=true;controller.abort();},(config.timeoutSeconds||60)*1000);
 try{
  const response=await fetchImpl(endpoint,requestOptions(config,prompt,controller.signal));
  if(!response.ok){const e=new Error(safeError(response.status));e.status=response.status;throw e;}
  let body;try{body=await response.json();}catch{throw new Error('The service did not return a JSON chat-completions response.');}
  const content=body?.choices?.[0]?.message?.content;
  if(typeof content!=='string')throw new Error('No text in choices[0].message.content. This runner requires a chat-completions-compatible service.');
  // Never include the configured credential in displayed or exported model output.
  const text=config.apiKey?content.replaceAll(config.apiKey,'[REDACTED]'):content;
  const usage=body.usage||{};
  return {text,usage:{prompt_tokens:Number.isFinite(usage.prompt_tokens)?usage.prompt_tokens:0,completion_tokens:Number.isFinite(usage.completion_tokens)?usage.completion_tokens:0},finish_reason:body.choices[0].finish_reason==='length'?'length':body.choices[0].finish_reason==='stop'?'stop':'other'};
 }catch(e){
  if(signal?.aborted)throw new DOMException('Cancelled','AbortError');
  if(timedOut)throw new Error('Request timed out. The run stopped; your provider may still bill an accepted request.');
  if(e instanceof TypeError)throw new Error('Could not reach the service. Check the URL, network, and whether its CORS policy allows this website.');
  throw e;
 }finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}
export async function runPlan(plan,config,{signal,onUpdate=()=>{},fetchImpl=fetch}={}){
 validateEndpoint(config.endpoint);requestOptions(config,'');
 const local=new AbortController();const cancel=()=>local.abort();if(signal?.aborted)cancel();signal?.addEventListener('abort',cancel,{once:true});
 const results=[];let index=0,active=0,failure=null;
 const emit=()=>onUpdate({completed:results.filter(r=>r.status==='ok').length,attempted:results.length,active,total:plan.length,results:[...results]});
 async function worker(){while(!local.signal.aborted&&index<plan.length){const r=plan[index++];active++;emit();const started=Date.now();
   try{const out=await complete(config,r.prompt,{signal:local.signal,fetchImpl});results.push({...r,status:'ok',model_answer:out.text,parsed_answer:parseAnswer(out.text,r.task),usage:out.usage,finish_reason:out.finish_reason,latency_ms:Date.now()-started});}
   catch(e){const aborted=e.name==='AbortError';results.push({...r,status:aborted?'cancelled':'error',error:aborted?'Request cancelled':e.message,latency_ms:Date.now()-started});if(!aborted&&!failure){failure=e.message;local.abort();}}
   finally{active--;emit();}
 }}
 try{await Promise.all(Array.from({length:Math.max(1,Math.min(4,Number(config.concurrency)||1))},worker));}
 finally{signal?.removeEventListener('abort',cancel);}
 return {status:failure?'failed':signal?.aborted?'cancelled':'completed',error:failure,planned:plan.length,results:results.sort((a,b)=>a.request_id-b.request_id)};
}
const stat=values=>({value:values.length?values.reduce((a,b)=>a+b,0)/values.length:null,n:values.length});
export function scoreRun(records){
 const ok=records.filter(r=>r.status==='ok'),groups=new Map(),base=new Map();
 for(const r of ok){const key=r.diagnostic+'|'+queryKey(r);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);
  if((r.diagnostic==='format_stability'&&r.format==='edge_list')||(r.diagnostic==='isomorphism_consistency'&&r.perturbation==='original')||(r.diagnostic==='order_sensitivity'&&r.ordering==='canonical')||(r.diagnostic==='distractor_robustness'&&r.perturbation==='no_distractor')){
   const k=queryKey(r);if(!base.has(k)||r.diagnostic==='format_stability')base.set(k,r);
  }
 }
 const scores={FS:[],OS:[],IC_N:[],IC_M:[],DR:[],CF_M:[]},excluded={FS:0,OS:0,IC_N:0,IC_M:0,DR:0};
 function pair(key,a,b,flip=false){if(!a||!b)return;if(a.parsed_answer==='unclear'||b.parsed_answer==='unclear'){excluded[key]++;return;}scores[key].push(Number(flip?a.parsed_answer!==b.parsed_answer:a.parsed_answer===b.parsed_answer));}
 for(const rows of groups.values()){const d=rows[0].diagnostic;
  if(d==='format_stability'){for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++)pair('FS',rows[i],rows[j]);}
  if(d==='order_sensitivity'){const b=rows.find(r=>r.ordering==='canonical');for(const r of rows)if(r.ordering!=='canonical')pair('OS',b,r,true);}
  if(d==='distractor_robustness'){const b=rows.find(r=>r.perturbation==='no_distractor');for(const r of rows)if(r.perturbation!=='no_distractor')pair('DR',b,r);}
  if(d==='isomorphism_consistency'){
   const b=rows.find(r=>r.perturbation==='original'),n=rows.find(r=>r.perturbation==='neutral_relabel'),m=rows.find(r=>r.perturbation==='misleading_relabel');
   pair('IC_N',b,n);pair('IC_M',b,m);
   if(b&&m&&b.parsed_answer===String(b.ground_truth))scores.CF_M.push(Number(m.parsed_answer===String(b.ground_truth)));
  }
 }
 const metrics=Object.fromEntries(Object.entries(scores).map(([k,v])=>[k,stat(v)]));
 metrics.accuracy=stat([...base.values()].map(r=>Number(r.parsed_answer===String(r.ground_truth))));
 metrics.semantic_gap={value:metrics.IC_N.value===null||metrics.IC_M.value===null?null:metrics.IC_N.value-metrics.IC_M.value};
 return {metrics,excluded_unclear_pairs:excluded,successful_requests:ok.length,failed_requests:records.filter(r=>r.status==='error').length,cancelled_requests:records.filter(r=>r.status==='cancelled').length,unclear_answers:ok.filter(r=>r.parsed_answer==='unclear').length,truncated_answers:ok.filter(r=>r.finish_reason==='length').length,usage:ok.reduce((s,r)=>({prompt_tokens:s.prompt_tokens+(r.usage?.prompt_tokens||0),completion_tokens:s.completion_tokens+(r.usage?.completion_tokens||0)}),{prompt_tokens:0,completion_tokens:0})};
}
