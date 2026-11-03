import {TASKS,percent,escapeHTML as esc,summarize} from './leaderboard-core.js';
import {selectCases,runHard} from './hard-runner-core.js';
import {download} from './leaderboard.js';
const $=s=>document.querySelector(s);let manifest,controller,report=null,running=false;
const options=()=>({profile:$('#profile').value,task:$('#run-task').value,size:$('#run-size').value});
const config=()=>({endpoint:$('#endpoint').value.trim(),model:$('#model').value.trim(),key:$('#key').value,provider:$('#provider').value.trim(),auth:$('#auth').value,reasoning:$('#reasoning').value,tokenField:$('#token-field').value,concurrency:Number($('#concurrency').value)});
function plan(){if(!manifest)return;const cases=selectCases(manifest,options());$('#run-count').textContent=`${cases.length} ${cases.length===1?'graph':'graphs'} · ${cases.length*8} requests`;$('#run-start').disabled=running||!$('#cost-consent').checked||!cases.length;}
function display(results,total,active=0){const s=summarize(results);$('#progress').max=total||1;$('#progress').value=results.length;$('#run-status').textContent=`${results.length}/${total} requests recorded · ${active} active · ${s.returned} returned model responses`;
 $('#run-metrics').innerHTML=`<div><span>All-condition accuracy</span><strong>${percent(s.accuracy)}</strong><span>${s.counts.correct} / ${s.returned} returned</span></div><div><span>Original accuracy</span><strong>${percent(s.original.value)}</strong><span>n = ${s.original.n} graphs</span></div><div><span>Renaming survival</span><strong>${percent(s.survival.degree_reversed.value)}</strong><span>n = ${s.survival.degree_reversed.n} correct originals</span></div><div><span>Token cutoffs</span><strong>${s.counts.cutoff}</strong><span>${s.counts.error} failed/cancelled requests</span></div>`;
 $('#run-log').textContent=results.slice(-12).map(r=>`${r.id}\n${r.status==='ok'?(r.correct?'Correct':r.finish_reason==='length'?'Token cutoff':r.parsed_answer==null?'Invalid answer':'Numeric error'):(r.error||r.status)}`).join('\n\n');
}
async function fixtures(cases){return (await Promise.all(cases.map(async c=>{const r=await fetch('data/hard-v1/'+c.file);if(!r.ok)throw Error('Could not load a frozen prompt fixture.');const bytes=await r.arrayBuffer();const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');if(hash!==c.sha256)throw Error('Fixture hash mismatch. Reload before running.');return JSON.parse(new TextDecoder().decode(bytes));}))).flat();}
$('#hard-run-form').addEventListener('submit',async e=>{e.preventDefault();if(running||!manifest)return;
 const cfg=config(),cases=selectCases(manifest,options());if(!$('#cost-consent').checked||!cases.length)return;
 report=null;running=true;controller=new AbortController();$('#run-error').hidden=true;$('#run-progress').hidden=false;$('#run-export').disabled=true;$('#run-stop').disabled=false;document.querySelectorAll('form fieldset').forEach(el=>el.disabled=true);$('#cost-consent').disabled=true;plan();
 try{display([],cases.length*8);$('#run-status').textContent='Loading and checking frozen prompt hashes…';const pp=await fixtures(cases);if(controller.signal.aborted)throw Error('Stopped before inference.');
  report=await runHard(pp,cfg,manifest,{signal:controller.signal,onUpdate:({results,total,active})=>display(results,total,active)});report.scope=options();report.fixtures=cases.map(c=>({id:c.id,sha256:c.sha256}));
  $('#run-status').textContent=`Run ${report.status}: ${report.attempted}/${report.planned} requests recorded. Download your results. These remain local to this browser.`;
  $('#run-export').disabled=false;
 }catch(error){$('#run-error').textContent=error.message;$('#run-error').hidden=false;}
 finally{running=false;$('#run-stop').disabled=true;document.querySelectorAll('form fieldset').forEach(el=>el.disabled=false);$('#cost-consent').disabled=false;$('#cost-consent').checked=false;plan();}
});
$('#run-stop').addEventListener('click',()=>{controller?.abort();$('#run-stop').disabled=true;$('#run-status').textContent='Stopping. Accepted requests may still be billed by the service.';});
$('#run-export').addEventListener('click',()=>{if(report)download('groundlm-hard-v1-my-run.json',JSON.stringify(report,null,2));});
for(const id of ['profile','run-task','run-size','cost-consent'])$('#'+id).addEventListener('change',plan);
window.addEventListener('pagehide',()=>{controller?.abort();$('#key').value='';});
$('#run-task').innerHTML='<option value="all">All six tasks</option>'+Object.entries(TASKS).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join('');
try{const r=await fetch('data/hard-v1/manifest.json');if(!r.ok)throw Error();manifest=await r.json();plan();}catch{$('#run-error').textContent='Could not load the benchmark manifest. Reload the page or download the release to run locally.';$('#run-error').hidden=false;}
