import {selectGraphs,makePlan,queryKey,validateEndpoint,complete,runPlan,scoreRun,DIAGNOSTICS} from './runner-core.js';
const $=id=>document.getElementById(id),form=$('run-form');
let manifest,plan=[],generation=0,busy=false,testing=false,controller,report=null;
const cache=new Map(),names={accuracy:'Baseline accuracy',IC_N:'Neutral consistency',IC_M:'Semantic consistency',CF_M:'Correct answers surviving renaming',semantic_gap:'Semantic gap',FS:'Format stability',OS:'Order sensitivity',DR:'Distractor robustness'};
const checked=name=>[...form.querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value);
function scope(){return {profile:$('profile').value,tasks:checked('task'),diagnostics:checked('audit')};}
function configuration(){return {endpoint:validateEndpoint($('endpoint').value.trim()),model:$('model').value.trim(),apiKey:$('api-key').value,auth:$('auth').value,maxTokens:Number($('max-tokens').value),tokenField:$('token-field').value,temperature:$('temperature').value==='omit'?null:0,reasoningEffort:$('reasoning').value,concurrency:Number($('concurrency').value),timeoutSeconds:Number($('timeout').value)};}
function error(message=''){$('run-error').hidden=!message;$('run-error').textContent=message;}
function buttons(){ $('start-run').disabled=busy||!plan.length;$('test-connection').disabled=busy||!plan.length;$('stop-run').disabled=!busy; }
function budget(){const cap=$('token-field').value==='omit'?'Output limit: service default.':`Configured output budget: up to ${(plan.length*Number($('max-tokens').value)).toLocaleString()} tokens, plus input tokens.`;
 $('plan-detail').textContent=plan.length?`${new Set(plan.map(queryKey)).size.toLocaleString()} queries on ${new Set(plan.map(r=>r.graph_id)).size} graphs. ${cap}`:'';
 $('destination').textContent=$('endpoint').value.trim()?`Destination: ${$('endpoint').value.trim()}`:'Enter an endpoint above. Nothing is sent until you click Test or Run.';
}
async function prepare(){const current=++generation;plan=[];buttons();error();$('plan-count').textContent='Loading protocol...';
 try{if(!manifest)throw new Error('Benchmark data is not loaded yet.');const selection=scope(),graphs=selectGraphs(manifest,selection.profile);let cursor=0;
  await Promise.all(Array.from({length:6},async()=>{while(cursor<graphs.length){const g=graphs[cursor++];if(!cache.has(g.id)){const response=await fetch('data/benchmark/'+g.file);if(!response.ok)throw new Error('Could not load graph fixtures. Reload the page.');cache.set(g.id,await response.json());}}}));
  if(current!==generation)return;plan=makePlan(graphs.flatMap(g=>cache.get(g.id)),selection);if(!plan.length)throw new Error('No prompts match this selection.');$('plan-count').textContent=`${plan.length.toLocaleString()} model requests`;budget();
 }catch(e){if(current===generation){$('plan-count').textContent='Choose a valid scope';error(e.message);}}finally{if(current===generation)buttons();}
}
function setBusy(value){busy=value;$('run-settings').disabled=value;buttons();}
function download(name,data,type='application/json'){const blob=new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function render(records){const score=scoreRun(records),root=$('run-metrics');root.replaceChildren();const grid=document.createElement('div');grid.className='metric-grid';
 for(const [key,label] of Object.entries(names)){const m=score.metrics[key];if(key!=='accuracy'&&m.value===null)continue;const tile=document.createElement('div');tile.className='metric-tile'+(['CF_M','IC_M','semantic_gap'].includes(key)?' semantic':'');const title=document.createElement('span'),value=document.createElement('strong'),detail=document.createElement('small');title.textContent=label;value.textContent=m.value===null?'Waiting':(m.value*100).toFixed(1)+(key==='semantic_gap'?' pts':'%');detail.textContent=key==='semantic_gap'?'Neutral minus semantic consistency':`n = ${m.n.toLocaleString()} ${key==='accuracy'||key==='CF_M'?'answers':'comparisons'}`;tile.append(title,value,detail);grid.append(tile);}
 root.append(grid);const note=document.createElement('p');note.className='small';note.textContent=`${score.unclear_answers} unclear outputs · ${score.truncated_answers} token-limited outputs · ${score.failed_requests} failed requests. Tokens reported by service: ${score.usage.prompt_tokens.toLocaleString()} input + ${score.usage.completion_tokens.toLocaleString()} output.`;root.append(note);
 const log=document.createElement('div');log.className='run-log';for(const r of records.slice(-6)){const line=document.createElement('div');line.textContent=`#${r.request_id+1} ${r.task} / ${r.perturbation||r.format||r.ordering}: ${r.status==='ok'?r.parsed_answer:r.status}`;log.append(line);}root.append(log);return score;
}
$('clear-key').addEventListener('click',()=>{$('api-key').value='';$('connection-status').textContent='Key cleared.';});
form.addEventListener('change',e=>{if(e.target.matches('#profile,[name="task"],[name="audit"]'))prepare();else budget();});
$('endpoint').addEventListener('input',budget);
$('stop-run').addEventListener('click',()=>{controller?.abort();$(testing?'connection-status':'run-progress').textContent='Stopping active requests...';});
$('test-connection').addEventListener('click',async()=>{if(!form.reportValidity())return;error();let config;try{config=configuration();}catch(e){error(e.message);return;}
 controller=new AbortController();testing=true;setBusy(true);$('connection-status').textContent='Sending one graph prompt...';
 try{const out=await complete(config,plan[0].prompt,{signal:controller.signal});$('connection-status').textContent=`Connected. Received ${out.text.length} characters. This one-request check is not part of your benchmark results.`;}catch(e){$('connection-status').textContent=e.name==='AbortError'?'Connection test cancelled.':e.message;}finally{config.apiKey='';testing=false;setBusy(false);}
});
form.addEventListener('submit',async e=>{e.preventDefault();if(busy||!plan.length||!form.reportValidity())return;error();let config;try{config=configuration();}catch(e){error(e.message);return;}
 const selected=scope(),runPlanSnapshot=[...plan],started=new Date().toISOString();controller=new AbortController();report=null;$('export-actions').hidden=true;setBusy(true);$('run-state').textContent='Running';$('progress').max=plan.length;let lastRender=0;
 try{const result=await runPlan(runPlanSnapshot,config,{signal:controller.signal,onUpdate:update=>{$('progress').value=update.attempted;$('run-progress').textContent=`${update.completed.toLocaleString()} successful / ${update.total.toLocaleString()} planned · ${update.active} active`;if(Date.now()-lastRender>700){render(update.results);lastRender=Date.now();}}});
  const summary=render(result.results),{apiKey,...publicConfiguration}=config;
  report={schema_version:1,protocol:{version:manifest.version,seed:manifest.seed,source:manifest.source,source_sha256:manifest.source_sha256,query_identity:manifest.query_identity,graphs:selectGraphs(manifest,selected.profile),numpy:manifest.numpy,networkx:manifest.networkx},scope:selected,configuration:publicConfiguration,started_at:started,finished_at:new Date().toISOString(),...result,summary,per_task:Object.fromEntries(selected.tasks.map(task=>[task,scoreRun(result.results.filter(r=>r.task===task))]))};
  $('run-state').textContent=result.status;$('run-progress').textContent=`${config.model} / ${result.status==='completed'?'Complete':'Partial run'}: ${summary.successful_requests.toLocaleString()} successful requests out of ${result.planned.toLocaleString()} planned. Metrics use available answers.`;if(result.error)error(result.error);
  $('export-actions').hidden=false;$('native-exports').replaceChildren();
  for(const diagnostic of selected.diagnostics){const button=document.createElement('button');button.className='text-button native-export';button.textContent=`Python audit file: ${diagnostic.replaceAll('_',' ')}`;button.addEventListener('click',()=>download(`results_browser_${diagnostic}.json`,report.results.filter(r=>r.diagnostic===diagnostic&&r.status==='ok')));$('native-exports').append(button);}
 }catch(e){error(e.message);$('run-state').textContent='Failed';}finally{config.apiKey='';setBusy(false);}
});
$('download-run').addEventListener('click',()=>{if(report)download('groundlm-run.json',report);});
$('download-csv').addEventListener('click',()=>{if(!report)return;const lines=['metric,value,denominator',...Object.entries(report.summary.metrics).map(([k,v])=>[k,v.value??'',v.n??''].join(','))];download('groundlm-metrics.csv',lines.join('\r\n'),'text/csv');});
window.addEventListener('pagehide',()=>{$('api-key').value='';controller?.abort();});
window.addEventListener('beforeunload',e=>{if(busy){e.preventDefault();e.returnValue='';}});
try{const response=await fetch('data/benchmark/manifest.json');if(!response.ok)throw new Error('Could not load the benchmark manifest. Serve the site over HTTP and reload.');manifest=await response.json();await prepare();}catch(e){error(e.message);$('plan-count').textContent='Protocol unavailable';}
