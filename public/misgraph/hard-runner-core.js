import {validateEndpoint} from './runner-core.js';
import {summarize} from './leaderboard-core.js';
export function selectCases(manifest,{profile='check',task='all',size='all'}={}){
 if(!['check','full'].includes(profile))throw Error('Unknown run size.');
 return manifest.cases.filter(c=>(profile==='full'||c.replicate===0)&&(task==='all'||c.task===task)&&(size==='all'||c.n===Number(size)));
}
// Match Hard v1's terminal JSON integer parser, without guessing from reasoning numbers.
export function parseHardAnswer(text){
 const plain=text.trim().replace(/^```(?:json)?\s*|\s*```$/g,'');
 const exact=/^\{\s*"answer"\s*:\s*(0|[1-9]\d*)\s*\}$/;
 const terminal=/\{\s*"answer"\s*:\s*(0|[1-9]\d*)\s*\}\s*(?:```)?\s*$/;
 const match=plain.match(exact)||text.trim().match(terminal);
 if(!match)return null;const n=Number(match[1]);return Number.isSafeInteger(n)?n:null;
}
export function hardRequest(config,manifest,prompt,signal){
 validateEndpoint(config.endpoint);if(!config.model?.trim())throw Error('Enter your model ID.');
 const headers={'Content-Type':'application/json'};
 if(config.key)headers[config.auth==='api-key'?'api-key':config.auth==='x-api-key'?'x-api-key':'Authorization']=config.auth==='api-key'||config.auth==='x-api-key'?config.key:'Bearer '+config.key;
 const body={model:config.model.trim(),messages:[{role:'system',content:manifest.system_prompt},{role:'user',content:prompt}],stream:false,[config.tokenField==='max_completion_tokens'?'max_completion_tokens':'max_tokens']:manifest.max_tokens};
 if(config.reasoning==='router-high')body.reasoning={effort:'high'};
 if(config.reasoning==='router-enabled')body.reasoning={enabled:true};
 if(config.reasoning==='high')body.reasoning_effort='high';
 if(config.provider?.trim())body.provider={only:[config.provider.trim()],allow_fallbacks:false,require_parameters:true};
 return {method:'POST',headers,body:JSON.stringify(body),signal,credentials:'omit',mode:'cors',redirect:'error',referrerPolicy:'no-referrer',cache:'no-store'};
}
const cleanNumber=n=>Number.isFinite(n)&&n>=0?n:null;
export async function runHard(prompts,config,manifest,{signal,fetchImpl=fetch,onUpdate=()=>{}}={}){
 hardRequest(config,manifest,'');
 const results=[];let next=0,failed=null,active=0;const local=new AbortController();const stop=()=>local.abort();
 if(signal?.aborted)stop();signal?.addEventListener('abort',stop,{once:true});
 const redact=s=>config.key?String(s).replaceAll(config.key,'[REDACTED]'):String(s);
 const emit=()=>onUpdate({results:[...results],active,total:prompts.length});
 async function worker(){while(!local.signal.aborted&&next<prompts.length){
  const p=prompts[next++],start=Date.now(),controller=new AbortController();let timedOut=false;
  const abort=()=>controller.abort();local.signal.addEventListener('abort',abort,{once:true});
  const timer=setTimeout(()=>{timedOut=true;controller.abort();},1800*1000);active++;emit();
  const base={id:p.id,case_id:p.case_id,task:p.task,n:p.n,variant:p.variant,model:config.model,ground_truth:p.ground_truth};
  try{
   const response=await fetchImpl(config.endpoint,hardRequest(config,manifest,p.prompt,controller.signal));
   if(!response.ok)throw Error('Service returned HTTP '+response.status+'. Check access, settings, or quota.');
   const body=await response.json(),choice=body?.choices?.[0];
   if(!choice?.message||!(typeof choice.message.content==='string'||choice.message.content==null))throw Error('Expected a chat-completions text response.');
   const answer_text=redact(choice.message.content??''),parsed_answer=parseHardAnswer(answer_text);
   const row={...base,status:'ok',answer_text,parsed_answer,correct:parsed_answer===p.ground_truth,finish_reason:choice.finish_reason==='length'?'length':choice.finish_reason==='stop'?'stop':'other',seconds:(Date.now()-start)/1000,cost:cleanNumber(body.usage?.cost)||0,reported_cost:cleanNumber(body.usage?.cost),usage:{prompt_tokens:cleanNumber(body.usage?.prompt_tokens),completion_tokens:cleanNumber(body.usage?.completion_tokens)},provider:typeof body.provider==='string'?redact(body.provider):null};
   results.push(row);
  }catch(e){
   const cancelled=local.signal.aborted&&!timedOut;
   const message=cancelled?'Cancelled; the provider may still bill the accepted request.':timedOut?'Request timed out; the provider may still bill the accepted request.':e instanceof TypeError?'Could not reach the service. Check its endpoint and CORS permissions.':e instanceof SyntaxError?'Service returned malformed JSON.':redact(e.message);
   results.push({...base,status:cancelled?'cancelled':'provider_error',parsed_answer:null,correct:false,finish_reason:null,seconds:(Date.now()-start)/1000,cost:0,error:message});
   if(!cancelled&&!failed){failed=message;local.abort();}
  }finally{clearTimeout(timer);local.signal.removeEventListener('abort',abort);active--;emit();}
 }}
 try{await Promise.all(Array.from({length:Math.min(4,Math.max(1,Number(config.concurrency)||1))},worker));}
 finally{signal?.removeEventListener('abort',stop);}
 results.sort((a,b)=>a.id.localeCompare(b.id));
 const report={version:manifest.version,created_utc:new Date().toISOString(),status:failed?'failed':signal?.aborted?'cancelled':'completed',error:failed,planned:prompts.length,attempted:results.length,config:{endpoint:config.endpoint,model:config.model,provider:config.provider||null,reasoning:config.reasoning,max_tokens:manifest.max_tokens,token_field:config.tokenField||'max_tokens',sampling:'service default',concurrency:config.concurrency},source_prompt_sha256:manifest.source_prompt_sha256,results,metrics:summarize(results),cost_note:'Reported usage costs only; absent usage cost and uncertain/accepted requests are not assumed free. Check your provider account.'};
 // Apply redaction to the whole export, including any provider-returned metadata.
 return JSON.parse(redact(JSON.stringify(report)));
}
