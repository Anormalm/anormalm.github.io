import './graph-identity.js';
import {TASKS,VARIANTS,percent,money,escapeHTML as esc,selectRecords,summarize,csv} from './leaderboard-core.js';
import {cohortRows,visibleRows,expectedScope} from './standard-core.js';
import {download} from './leaderboard.js';
const $=s=>document.querySelector(s);
let protocol,data,sort='original',ascending=false,page=0;const selected=new Set();
const scope=()=>({task:$('#standard-task').value,size:$('#standard-size').value});
const options=()=>({query:$('#standard-search').value,status:$('#standard-status').value,precision:$('#standard-precision').value,sort,ascending});
const allRows=()=>cohortRows(protocol,data,scope());
const shownRows=()=>visibleRows(allRows(),options());
const interval=m=>m?.ci95?`${percent(m.ci95[0])}–${percent(m.ci95[1])}`:'—';
function modelCell(r){return `<div class="model-cell"><input type="checkbox" data-select="${esc(r.id)}" aria-label="Compare ${esc(r.name)}" ${selected.has(r.id)?'checked':''} ${r.eligible?'':'disabled'}><span class="model-icon">${esc(r.initials)}</span><div><button class="model-button" data-model="${esc(r.id)}">${esc(r.name)}</button><small>${esc(r.eligible?r.endpoint:r.creator)}${r.precision?' · '+esc(r.precision.toUpperCase()):''}</small><span class="cohort-status ${r.eligible?'ready':''}">${r.eligible?'Evaluated':r.status==='review'?'Needs review':'Not yet scored'}</span></div></div>`;}
function render(){
 const rows=shownRows(),perModel=expectedScope(protocol,scope()),pages=Math.max(1,Math.ceil(rows.length/10));page=Math.min(page,pages-1);
 const evaluated=rows.filter(r=>r.eligible),pending=rows.length-evaluated.length;
 $('#standard-count').textContent=pending?`${evaluated.length} evaluated · ${pending} not yet scored`:`${evaluated.length} evaluated configurations · ${perModel.toLocaleString()} responses each`;
 $('#advanced-filters').querySelector('summary').textContent=(options().status!=='eligible'||options().precision!=='all')?'More filters · active':'More filters';
 $('#standard-rows').innerHTML=rows.slice(page*10,(page+1)*10).map(r=>{
  if(!r.eligible)return `<tr class="awaiting-row"><th scope="row">${modelCell(r)}</th><td>—</td><td>—</td><td>—</td><td>0/${perModel}</td><td>—</td></tr>`;
  const m=r.metrics;return `<tr><th scope="row">${modelCell(r)}</th><td><span class="metric-main">${percent(m.original.value)}</span><span class="metric-sub">n=${m.original.n}</span></td><td><span class="metric-main semantic-number">${percent(m.survival.degree_reversed.value)}</span><span class="metric-sub">n=${m.survival.degree_reversed.n}</span></td><td><span class="metric-main">${percent(m.cutoff)}</span><span class="metric-sub">${m.counts.cutoff}/${m.returned}</span></td><td><span class="metric-main">${m.returned}/${perModel}</span></td><td><span class="metric-main">${money(r.cost_per_1000)}</span></td></tr>`;
 }).join('')||'<tr><td colspan="6" class="empty">No models match these filters. Reset them to see the full list.</td></tr>';
 $('#standard-page').textContent=`${page+1} / ${pages}`;$('#standard-prev').disabled=page===0;$('#standard-next').disabled=page>=pages-1;
 document.querySelectorAll('[data-standard-sort]').forEach(b=>b.closest('th').setAttribute('aria-sort',b.dataset.standardSort===sort?ascending?'ascending':'descending':'none'));
 $('#standard-compare').disabled=selected.size<2;$('#standard-compare').textContent=`Compare selected (${selected.size})`;
 renderCharts(evaluated);renderHeatmap(evaluated);
 const params=new URLSearchParams();for(const [k,v] of Object.entries(scope()))if(v!=='all')params.set(k,v);if(options().query)params.set('q',options().query);if(options().status!=='eligible')params.set('status',options().status);if(options().precision!=='all')params.set('precision',options().precision);
 history.replaceState(null,'',location.pathname+(params.size?'?'+params:'')+location.hash);
}
function renderCharts(rows){
 $('#standard-chart-count').textContent=`${rows.length} evaluated models`;
 $('#standard-accuracy-chart').innerHTML=rows.map(r=>{const m=r.metrics.original,low=m.ci95?.[0]||0,high=m.ci95?.[1]||0;return `<div class="chart-row"><div class="chart-name">${esc(r.name)}<small>${esc(r.precision.toUpperCase())} · n=${m.n}</small></div><div class="interval-track" role="img" aria-label="${esc(r.name)} original accuracy ${percent(m.value)}, 95 percent interval ${interval(m)}"><span class="accuracy-fill" style="width:${100*(m.value||0)}%"></span><span class="confidence-range" style="left:${100*low}%;width:${100*(high-low)}%"></span><span class="confidence-dot" style="left:${100*(m.value||0)}%"></span></div><strong class="chart-value">${percent(m.value)}</strong></div>`;}).join('')||'<p class="empty">No evaluated models match these filters.</p>';
 if(!rows.length){$('#standard-cost-chart').innerHTML='<p class="empty">No evaluated models match these filters.</p>';return;}
 const max=Math.max(...rows.map(r=>r.cost_per_1000))*1.25||1,x=v=>48+360*v/max,y=v=>210-170*v;
 $('#standard-cost-chart').innerHTML=`<svg viewBox="0 0 470 260" role="img" aria-label="Original accuracy versus recorded evaluation cost per 1000 matched queries"><title>Accuracy and cost for the selected questions</title>${[0,.25,.5,.75,1].map(v=>`<path d="M48 ${y(v)}H420" stroke="#e1e7eb"/><text x="39" y="${y(v)+4}" text-anchor="end" fill="#657783" font-size="10">${100*v}%</text>`).join('')}<path d="M48 35V210H420" fill="none" stroke="#aebdc7"/>${[0,max/2,max].map(v=>`<text x="${x(v)}" y="229" text-anchor="middle" fill="#657783" font-size="10">${money(v)}</text>`).join('')}${rows.map(r=>`<g><circle cx="${x(r.cost_per_1000)}" cy="${y(r.metrics.original.value||0)}" r="5" fill="#132e43" stroke="white" stroke-width="1.5"><title>${esc(r.name)}: ${percent(r.metrics.original.value)}, ${money(r.cost_per_1000)} per 1000 queries</title></circle><text x="${x(r.cost_per_1000)+8}" y="${y(r.metrics.original.value||0)-7}" fill="#132e43" font-size="10">${esc(r.initials)}</text></g>`).join('')}<text x="235" y="251" text-anchor="middle" fill="#657783" font-size="11">Cost, including uncertain charges per 1,000 queries</text></svg><div class="scatter-key">${rows.map(r=>`<span><b>${esc(r.initials)}</b> ${esc(r.name)}</span>`).join('')}</div>`;
}
function renderHeatmap(rows){
 const tasks=scope().task==='all'?Object.keys(TASKS):[scope().task];
 $('#standard-task-matrix').innerHTML=`<caption>Accuracy on the original questions</caption><thead><tr><th>Configuration</th>${tasks.map(t=>`<th>${esc(TASKS[t])}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${esc(r.name)}</th>${tasks.map(t=>{const m=summarize(selectRecords(data.records,{model:r.id,task:t,size:scope().size,variant:'original'})),value=m.accuracy||0;return `<td style="background:rgba(19,46,67,${.04+.82*value});color:${value>.6?'white':'#172b3a'}">${percent(m.accuracy)}<small>${m.counts.correct}/${m.returned}</small></td>`;}).join('')}</tr>`).join('')}</tbody>`;
}
function openDetail(id){const r=allRows().find(r=>r.id===id);$('#standard-detail').hidden=false;
 if(!r.eligible){
  $('#standard-detail-body').innerHTML=`<div class="eyebrow">Not yet scored on Hard v1</div><h2>${esc(r.name)}</h2><p>This model is listed for ${esc(protocol.label)}, but its ${protocol.policy.requests_per_model} evaluation responses have not been collected under these settings.</p><div class="notice"><b>You can still explore its earlier results.</b> Its history includes pilot, development and holdout runs. Those use different questions or settings, so they do not count as Hard v1 scores.</div><div class="run-actions"><a class="button" href="${esc(r.history_url)}">View all recorded ${esc(r.name)} results</a><a class="button secondary" href="run.html">Run Hard v1 with your API</a></div><p>Target: ${protocol.policy.graphs} graph questions · six tasks · eight variants · ${protocol.policy.max_tokens.toLocaleString()} requested completion tokens · ${esc(protocol.policy.reasoning_policy)}.</p>`;
 }else{
  const m=r.metrics,reasoning=r.request_settings.reasoning?JSON.stringify(r.request_settings.reasoning):'omitted';
  $('#standard-detail-body').innerHTML=`<div class="eyebrow">Hard v1 results / ${esc(protocol.protocol_id)}</div><h2>${esc(r.name)}</h2><p>${esc(r.id)} · ${esc(r.endpoint)} · ${esc(r.precision.toUpperCase())} precision</p><div class="metric-grid"><div><span>Original accuracy</span><strong>${percent(m.original.value)}</strong><span>95% Wilson ${interval(m.original)} · n=${m.original.n}</span></div><div><span>Renaming survival</span><strong>${percent(m.survival.degree_reversed.value)}</strong><span>95% Wilson ${interval(m.survival.degree_reversed)} · n=${m.survival.degree_reversed.n}</span></div><div><span>All-variant accuracy</span><strong>${percent(m.accuracy)}</strong><span>${m.counts.correct}/${m.returned} responses across related questions</span></div><div><span>Token cutoffs</span><strong>${m.counts.cutoff}</strong><span>${m.counts.wrong} wrong numeric answers · ${m.counts.invalid} invalid</span></div></div><p>Cost for these results: ${money(m.cost)}, including retries and upper estimates for unconfirmed charges.</p><h3>Inference settings</h3><p>Completion limit: 16,384 tokens. Reasoning: <code>${esc(reasoning)}</code>. Default sampling, no tools. The longest reported response used ${r.usage_audit.max_reported_completion_tokens.toLocaleString()} completion tokens; ${r.usage_audit.above_requested_allowance} responses exceeded the requested limit. Models differ in how they reason and count tokens.</p><h3>Results by condition · current filters</h3><div class="table-scroll"><table><thead><tr><th>Condition</th><th>Accuracy</th><th>Agreement</th><th>Correct-answer survival</th></tr></thead><tbody>${Object.entries(VARIANTS).map(([v,label])=>`<tr><th scope="row">${label}</th><td>${percent(m.accuracies[v].value)}<span class="metric-sub">n=${m.accuracies[v].n}</span></td><td>${v==='original'?'—':percent(m.agreement[v].value)+`<span class="metric-sub">n=${m.agreement[v].n} pairs with readable answers</span>`}</td><td>${v==='original'?'—':percent(m.survival[v].value)+`<span class="metric-sub">n=${m.survival[v].n} initially correct answers</span>`}</td></tr>`).join('')}</tbody></table></div><div class="download-links"><a href="history.html?model=${encodeURIComponent(r.id)}&amp;run=hard-v1">Inspect saved Hard v1 responses</a><a href="${esc(r.history_url)}">All earlier runs for this model</a><a href="data/protocol/standard.json">Protocol and eligibility audit</a></div>`;
 }
 $('#standard-detail').scrollIntoView({behavior:'smooth',block:'start'});$('#standard-detail-close').focus({preventScroll:true});
}
function compare(){const rows=allRows().filter(r=>r.eligible&&selected.has(r.id));$('#standard-detail').hidden=false;
 $('#standard-detail-body').innerHTML=`<div class="eyebrow">Same protocol / same selected questions</div><h2>Compare configurations</h2><div class="comparison-grid">${rows.map(r=>`<article><h3>${esc(r.name)}</h3><p>${esc(r.endpoint)} · ${esc(r.precision.toUpperCase())}</p><p>Original accuracy <b>${percent(r.metrics.original.value)}</b> · n=${r.metrics.original.n}<br>95% Wilson ${interval(r.metrics.original)}</p><p>Renaming survival <b>${percent(r.metrics.survival.degree_reversed.value)}</b> · n=${r.metrics.survival.degree_reversed.n}</p><p>Cutoffs ${r.metrics.counts.cutoff}/${r.metrics.returned} · cost ${money(r.cost_per_1000)} per 1,000 queries</p></article>`).join('')}</div>`;
 $('#standard-detail').scrollIntoView({behavior:'smooth'});$('#standard-detail-close').focus({preventScroll:true});
}
function filterChange(){page=0;selected.clear();$('#standard-detail').hidden=true;render();}
async function start(){
 $('#standard-loading').hidden=false;
 try{
 const responses=await Promise.all([fetch('data/protocol/standard.json',{signal:AbortSignal.timeout(15000)}),fetch('data/hard-v1/leaderboard.json',{signal:AbortSignal.timeout(15000)})]);if(responses.some(r=>!r.ok))throw Error();[protocol,data]=await Promise.all(responses.map(r=>r.json()));
 if(!Array.isArray(data.records)||!data.records.length||!Array.isArray(protocol.registry)||!protocol.registry.length)throw Error('Invalid release data');
 $('#protocol-id').textContent=protocol.protocol_id;$('#protocol-fingerprint').textContent=protocol.protocol_sha256;
 $('#standard-task').innerHTML='<option value="all">All six tasks</option>'+Object.entries(TASKS).map(([id,name])=>`<option value="${id}">${esc(name)}</option>`).join('');
 const p=new URLSearchParams(location.search);$('#standard-search').value=p.get('q')||'';for(const [param,id] of [['task','standard-task'],['size','standard-size'],['status','standard-status'],['precision','standard-precision']]){const el=$('#'+id);if([...el.options].some(o=>o.value===p.get(param)))el.value=p.get(param);}
 const filters=$('#advanced-filters');document.addEventListener('click',e=>{if(filters.open&&!filters.contains(e.target))filters.open=false;});filters.addEventListener('keydown',e=>{if(e.key==='Escape'){filters.open=false;filters.querySelector('summary').focus();}});
 if(p.has('status')||p.has('precision'))$('#advanced-filters').open=true;
 for(const id of ['standard-task','standard-size','standard-status','standard-precision'])$('#'+id).addEventListener('change',filterChange);$('#standard-search').addEventListener('input',filterChange);
 $('#standard-reset').addEventListener('click',()=>{for(const id of ['standard-task','standard-size','standard-status','standard-precision'])$('#'+id).value=id==='standard-status'?'eligible':'all';$('#standard-search').value='';$('#advanced-filters').open=false;filterChange();});
 document.querySelectorAll('[data-standard-sort]').forEach(b=>b.addEventListener('click',()=>{ascending=sort===b.dataset.standardSort?!ascending:['cutoff','cost'].includes(b.dataset.standardSort);sort=b.dataset.standardSort;page=0;render();}));
 $('#standard-prev').addEventListener('click',()=>{page--;render();});$('#standard-next').addEventListener('click',()=>{page++;render();});
 $('#standard-rows').addEventListener('click',e=>{const b=e.target.closest('[data-model]');if(b)openDetail(b.dataset.model);});$('#standard-rows').addEventListener('change',e=>{if(e.target.matches('[data-select]')){if(e.target.checked)selected.add(e.target.dataset.select);else selected.delete(e.target.dataset.select);render();}});
 $('#standard-compare').addEventListener('click',compare);$('#standard-detail-close').addEventListener('click',()=>{$('#standard-detail').hidden=true;$('#standard-search').focus();});
 $('#standard-export').addEventListener('click',()=>download('misgraph-shared-protocol.csv',csv([['protocol_id','model','provider','precision','status','task','nodes','original_accuracy','original_n_graphs','survival','survival_n_graphs','cutoff_rate','returned_slots','expected_slots','recorded_cost_per_1000_usd'],...shownRows().map(r=>[protocol.protocol_id,r.id,r.endpoint,r.precision,r.status,scope().task,scope().size,r.metrics?.original.value,r.metrics?.original.n,r.metrics?.survival.degree_reversed.value,r.metrics?.survival.degree_reversed.n,r.metrics?.cutoff,r.metrics?.returned??0,expectedScope(protocol,scope()),r.cost_per_1000])]),'text/csv'));
 render();
 $('#standard-loading').hidden=true;$('#static-leaderboard').hidden=true;$('#canonical-dashboard').hidden=false;
 const anchor=location.hash.slice(1);if(['leaderboard','performance','task-results'].includes(anchor))document.getElementById(anchor)?.scrollIntoView({block:'start'});
 }catch{
 $('#canonical-dashboard').hidden=true;$('#static-leaderboard').hidden=false;$('#standard-loading').hidden=false;
 $('#standard-loading').innerHTML='We could not load the interactive view. You can still read the full Hard v1 results below. <button type="button" id="standard-retry">Retry</button>';
 $('#standard-retry').addEventListener('click',()=>location.reload());
 }}
start();
