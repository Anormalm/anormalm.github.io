import {TASKS,VARIANTS,percent,money,csv,escapeHTML as esc} from './leaderboard-core.js';
import {OUTCOMES,historyRows,caseRows,pageRows} from './history-core.js';
import {download} from './leaderboard.js';
const $=s=>document.querySelector(s),taskName=t=>TASKS[t]||(t==='minimum_vertex_cover'?'Minimum vertex cover':t.replaceAll('_',' '));
let index,active=null,records=[],page=0;const cache=new Map();
async function loadJSON(path){if(!cache.has(path))cache.set(path,fetch(path).then(r=>{if(!r.ok)throw Error('Could not load the saved data.');return r.json();}).catch(e=>{cache.delete(path);throw e;}));return cache.get(path);}
const filters=()=>({model:$('#history-model').value,run:$('#history-run').value,stage:$('#history-stage').value,query:$('#history-search').value});
function settings(group,modelRun){return `${(modelRun?.max_tokens??group.max_tokens).toLocaleString()} tokens · ${modelRun?.reasoning??group.reasoning} reasoning`;}
function render(){const rows=historyRows(index,filters()),groups=new Map(index.groups.map(g=>[g.id,g]));
 $('#history-count').textContent=`${rows.length} model-run rows · each row retains its own graph sample and settings`;
 $('#history-rows').innerHTML=rows.map(r=>{const g=groups.get(r.run_id);return `<tr><th scope="row"><button class="model-button" data-run="${esc(r.run_id)}" data-model="${esc(r.model)}">${esc(r.name)} ↗</button><span class="metric-sub">${esc(g.label)}</span><span class="history-tag">${esc(g.stage)}${r.reused?' · reused subset':''}</span></th><td>${r.counts.correct}/${r.returned}<span class="metric-sub">${percent(r.returned?r.counts.correct/r.returned:null)} · ${r.graphs} graph questions</span></td><td class="${r.counts.wrong?'semantic-number':''}"><b>${r.counts.wrong}</b></td><td>${r.counts.cutoff}</td><td>${r.counts.invalid}</td><td>${r.counts.error}<span class="metric-sub">${r.provider_failure_attempts} failed attempts retained</span></td><td>${r.returned}/${r.slots}<span class="metric-sub">returned / recorded</span></td><td class="settings-cell">${esc(settings(g,r))}<span class="metric-sub">${g.sizes.join('/')} nodes${r.provider?' · '+esc(r.provider)+' · '+esc(r.precision.toUpperCase()):''}</span></td><td>${r.reused?'Reused':money(r.cost_usd)}<span class="metric-sub">${r.reused?'source: replication01':'all recorded attempts'}</span></td></tr>`;}).join('')||'<tr><td colspan="9" class="empty">No model-run rows match. Reset the filters to see the full record.</td></tr>';
 const p=new URLSearchParams();for(const [k,v] of Object.entries(filters()))if(v&&v!=='all')p.set(k==='query'?'q':k,v);history.replaceState(null,'',location.pathname+(p.size?'?'+p:'')+location.hash);
}
function renderCards(){
 $('#run-inventory').innerHTML=index.groups.map(g=>`<article class="info-card"><span class="tag">${esc(g.stage)} / ${esc(g.id)}</span><h3>${esc(g.label)}</h3><p><b>${g.slots} slots · ${g.models} ${g.models===1?'model':'models'} · ${g.graphs} graph questions</b><br>${esc(settings(g))}</p><p>${esc(g.note)}</p><button class="inventory-open" data-inventory="${esc(g.id)}">Show this run →</button> <a href="${esc(g.archive)}">Download source</a></article>`).join('');
}
async function openRun(runId,model){
 const group=index.groups.find(g=>g.id===runId);active={runId,model};page=0;$('#history-detail').hidden=false;$('#record-panel').hidden=true;$('#case-table').innerHTML='';$('#case-count').textContent='Loading saved responses…';
 $('#history-detail-heading').textContent=index.model_runs.find(r=>r.run_id===runId&&r.model===model).name+' · '+group.label;
 $('#history-detail-scope').textContent=group.note+' '+settings(group,index.model_runs.find(r=>r.run_id===runId&&r.model===model))+'. Sampling: '+group.sampling+'.';
 $('#history-detail-source').href=group.archive;$('#history-detail-source').textContent='Download this study’s complete source →';
 $('#history-detail').scrollIntoView({behavior:'smooth',block:'start'});$('#history-detail-close').focus({preventScroll:true});
 try{const loaded=await loadJSON('data/history/'+group.records_file);if(active?.runId!==runId||active?.model!==model)return;records=loaded;
  const rr=records.filter(r=>r.model===model),tasks=[...new Set(rr.map(r=>r.task))],sizes=[...new Set(rr.map(r=>r.n))].sort((a,b)=>a-b);
  $('#case-task').innerHTML='<option value="all">All tasks in this run</option>'+tasks.map(t=>`<option value="${esc(t)}">${esc(taskName(t))}</option>`).join('');
  $('#case-size').innerHTML='<option value="all">All graph sizes</option>'+sizes.map(n=>`<option value="${n}">${n} nodes</option>`).join('');$('#case-outcome').value='all';$('#case-search').value='';renderCases();
 }catch(e){$('#case-count').textContent=e.message+' Use the complete-source download.';}
}
const selectedCases=()=>active?caseRows(records,{model:active.model,task:$('#case-task').value,size:$('#case-size').value,outcome:$('#case-outcome').value,query:$('#case-search').value}):[];
function renderCases(){const rows=selectedCases(),pages=Math.max(1,Math.ceil(rows.length/25));page=Math.min(page,pages-1);
 $('#case-count').textContent=`${rows.length} matching saved responses · page ${page+1}/${pages} · 25 per page`;
 $('#case-table').innerHTML=pageRows(rows,page).map(r=>`<tr><th scope="row"><button class="model-button case-id" data-record="${esc(r.record_key)}">${esc(r.case_id)} ↗</button><span class="metric-sub">${esc(taskName(r.task))} · ${r.n} nodes</span></th><td>${esc(VARIANTS[r.variant]||r.variant)}</td><td>${r.ground_truth}</td><td>${r.parsed_answer==null?'—':r.parsed_answer}</td><td class="${r.outcome==='wrong'?'semantic-number':''}">${OUTCOMES[r.outcome]}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">No saved responses match these filters.</td></tr>';
 $('#case-prev').disabled=page===0;$('#case-next').disabled=page>=pages-1;
}
async function inspectRecord(key){const r=records.find(x=>x.record_key===key);if(!r)return;const current=active;$('#record-panel').hidden=false;$('#record-heading').textContent=r.id;$('#record-status').textContent=`${OUTCOMES[r.outcome]} · expected ${r.ground_truth} · parsed ${r.parsed_answer==null?'undefined':r.parsed_answer} · finish: ${r.finish_reason||'none'} · ${r.provider||'provider recorded in archive'}${r.completion_tokens!=null?' · '+r.completion_tokens.toLocaleString()+' reported completion tokens':''}`;
 $('#record-answer').textContent=r.text||'(No visible answer text returned.)';$('#record-prompt').textContent='Loading the exact saved prompt…';
 $('#record-panel').scrollIntoView({behavior:'smooth',block:'start'});
 try{const g=index.groups.find(g=>g.id===r.run_id);let prompt;
  if(g.id==='hard-v1'){const pp=await loadJSON('data/hard-v1/'+r.case_id+'.json');prompt=pp.find(p=>p.id===r.id)?.prompt;}
  else{const pp=await loadJSON('data/history/'+g.prompts_file);prompt=pp[r.id];}
  if(active!==current||$('#record-heading').textContent!==r.id)return;
  $('#record-prompt').textContent=prompt||'Exact prompt is included in the study archive.';
 }catch{$('#record-prompt').textContent='Could not load the prompt. It remains available in the complete study archive.';}
}
try{index=await loadJSON('data/history/index.json');$('#history-loading').hidden=true;$('#history-data').hidden=false;
 const models=[...new Map(index.model_runs.map(r=>[r.model,r.name])).entries()].sort((a,b)=>a[1].localeCompare(b[1]));
 $('#history-model').innerHTML='<option value="all">All tested models</option>'+models.map(([id,name])=>`<option value="${esc(id)}">${esc(name)}</option>`).join('');
 $('#history-run').innerHTML='<option value="all">All eight run groups</option>'+index.groups.map(g=>`<option value="${esc(g.id)}">${esc(g.label)}</option>`).join('');
 $('#history-stage').innerHTML='<option value="all">All stages</option>'+[...new Set(index.groups.map(g=>g.stage))].map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
 const p=new URLSearchParams(location.search);for(const id of ['model','run','stage']){const el=$('#history-'+id);if([...el.options].some(o=>o.value===p.get(id)))el.value=p.get(id);}$('#history-search').value=p.get('q')||'';
 for(const id of ['history-model','history-run','history-stage'])$('#'+id).addEventListener('change',render);$('#history-search').addEventListener('input',render);
 $('#history-reset').addEventListener('click',()=>{for(const id of ['history-model','history-run','history-stage'])$('#'+id).value='all';$('#history-search').value='';render();});
 $('#history-rows').addEventListener('click',e=>{const b=e.target.closest('[data-run]');if(b)openRun(b.dataset.run,b.dataset.model);});
 $('#run-inventory').addEventListener('click',e=>{const b=e.target.closest('[data-inventory]');if(b){$('#history-run').value=b.dataset.inventory;$('#history-stage').value=$('#history-model').value='all';$('#history-search').value='';render();$('#history-results').scrollIntoView({behavior:'smooth'});}});
 $('#history-detail-close').addEventListener('click',()=>{active=null;$('#history-detail').hidden=true;$('#history-model').focus();});
 for(const id of ['case-task','case-size','case-outcome'])$('#'+id).addEventListener('change',()=>{page=0;renderCases();});$('#case-search').addEventListener('input',()=>{page=0;renderCases();});
 $('#case-prev').addEventListener('click',()=>{page--;renderCases();});$('#case-next').addEventListener('click',()=>{page++;renderCases();});$('#case-table').addEventListener('click',e=>{const b=e.target.closest('[data-record]');if(b)inspectRecord(b.dataset.record);});
 $('#record-close').addEventListener('click',()=>{$('#record-panel').hidden=true;$('#case-search').focus();});
 $('#case-export').addEventListener('click',()=>download('groundlm-saved-responses.json',JSON.stringify({scope:active,filters:{task:$('#case-task').value,size:$('#case-size').value,outcome:$('#case-outcome').value},results:selectedCases()},null,2)));
 $('#history-export').addEventListener('click',()=>download('groundlm-model-run-history.csv',csv([['run','model','graphs','correct','returned','slots','completed_wrong','cutoffs','invalid_completed','api_errors','source_reused','new_cost_usd'],...historyRows(index,filters()).map(r=>[r.run_id,r.model,r.graphs,r.counts.correct,r.returned,r.slots,r.counts.wrong,r.counts.cutoff,r.counts.invalid,r.counts.error,r.reused,r.reused?null:r.cost_usd])]),'text/csv'));
 renderCards();render();
}catch{$('#history-loading').innerHTML='Could not load the run index. <a href="downloads/history/all-results.zip">Download all covered results</a>.';}
