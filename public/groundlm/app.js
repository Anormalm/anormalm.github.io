import {models,edges,positions,labels,shortestPath,answer,serialize,evaluate,sample} from './engine.js';
const $=s=>document.querySelector(s);
let toastTimer;
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000);}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('Copied to clipboard.');}catch{toast('Clipboard unavailable. Select and copy the text.');}}
function download(name,text,type='application/json'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('.menu').addEventListener('click',()=>{const open=$('.menu').getAttribute('aria-expanded')!=='true';$('.menu').setAttribute('aria-expanded',String(open));$('.menu').setAttribute('aria-label',open?'Close navigation':'Open navigation');$('.header nav').classList.toggle('open',open);});
document.querySelectorAll('.copy-code').forEach(b=>b.addEventListener('click',()=>copy(b.nextElementSibling.textContent)));
const keys=['accuracy','format','order','gap','distractor','cfm'];
if($('#result-rows')){
 const render=()=>{const key=$('#sort').value;const sorted=[...models].sort((a,b)=>(a[key]-b[key])*(key==='accuracy'||key==='cfm'?-1:1));
 $('#result-rows').innerHTML=sorted.map(m=>'<tr><th scope="row"><span class="model-name">'+m.name+'</span><span class="model-family">'+m.family+'</span></th>'+keys.map(k=>{const vals=models.map(x=>x[k]),high=['accuracy','cfm'].includes(k),best=high?Math.max(...vals):Math.min(...vals),bad=high?100-m[k]:m[k],maxBad=Math.max(...vals.map(x=>high?100-x:x)),alpha=.045+.26*bad/maxBad;return '<td><span class="result-value" style="background:rgba('+(['gap','cfm'].includes(k)?'179,78,38':'9,46,70')+','+alpha+')">'+(m[k]===best?'<b>':'')+m[k].toFixed(1)+(m[k]===best?'</b>':'')+'</span></td>';}).join('')+'</tr>').join('');};
 $('#sort').addEventListener('change',render);render();
 $('#download-results').addEventListener('click',()=>download('groundlm-reported-results.csv',['model,accuracy_percent,format_instability_percent,order_sensitivity_percent,semantic_gap_points,distractor_susceptibility_percent,conditional_faithfulness_percent',...models.map(m=>[m.name,...keys.map(k=>m[k])].join(','))].join('\n'),'text/csv'));
}
if($('#live-graph')){
 let semantic=false;let a=0,b=4;
 function render(){const ns=labels(semantic),task=$('#task').value;for(const [id,val] of [['source',a],['target',b]]){$('#'+id).innerHTML=ns.map((s,i)=>`<option value="${i}">${s}</option>`).join('');$('#'+id).value=String(val);}$('#target').disabled=task==='triangle_detection';
 const path=task==='shortest_path'?shortestPath(a,b):[];
 const line=edges.map(([x,y])=>{const hi=path.some((n,i)=>i&&((path[i-1]===x&&n===y)||(path[i-1]===y&&n===x)));return `<line x1="${positions[x][0]}" y1="${positions[x][1]}" x2="${positions[y][0]}" y2="${positions[y][1]}" stroke="${hi?'#b34e26':'#a4b7bd'}" stroke-width="${hi?4:2}"/>`;}).join('');
 $('#live-graph').innerHTML='<title>Same undirected graph with '+(semantic?'semantic':'neutral')+' node names</title>'+line+positions.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${semantic?36:28}" fill="#fafbf8" stroke="${semantic?'#b34e26':'#123348'}" stroke-width="2"/><text x="${x}" y="${y}" dy=".35em" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="15" fill="#123348">${ns[i]}</text>`).join('');
 const prompt=serialize({format:$('#format').value,semantic,a,b,task});$('#prompt').textContent=prompt;$('#live-question').textContent=prompt.split('Question: ')[1].split('\n')[0];$('#oracle-answer').textContent=answer(task,a,b)+(task==='shortest_path'?' edges':'');$('#name-mode').textContent=semantic?'Semantic identifiers':'Neutral identifiers';$('#rename').textContent=semantic?'Use neutral names':'Use semantic names';$('#rename').setAttribute('aria-pressed',String(semantic));}
 $('#rename').addEventListener('click',()=>{semantic=!semantic;render();});$('#task').addEventListener('change',render);$('#format').addEventListener('change',render);$('#source').addEventListener('change',e=>{a=Number(e.target.value);render();});$('#target').addEventListener('change',e=>{b=Number(e.target.value);render();});$('#copy-prompt').addEventListener('click',()=>copy($('#prompt').textContent));render();
}
if($('#evaluate')){
 let report=null,illustrative=false;
 const empty=$('#evaluation-output').innerHTML;
 function resetReport(){report=null;$('#export-evaluation').disabled=true;$('#evaluation-output').innerHTML=empty;$('#eval-error').hidden=true;}
 function error(msg){$('#eval-error').textContent=msg;$('#eval-error').hidden=false;}
 $('#load-sample').addEventListener('click',()=>{resetReport();$('#json-input').value=JSON.stringify(sample,null,2);illustrative=true;$('#input-status').textContent='Illustrative synthetic example loaded. These are not recorded model outputs.';});
 $('#json-input').addEventListener('input',()=>{resetReport();illustrative=false;$('#input-status').textContent='Edited input. Evaluate to refresh the metrics.';});
 $('#file-input').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;resetReport();if(f.size>10*1024*1024){error('File exceeds the 10 MB limit.');return;}try{$('#json-input').value=await f.text();illustrative=false;$('#input-status').textContent=`Loaded ${f.name}. Data stays in this browser.`;}catch{error('The file could not be read. Choose a valid JSON file.');}});
 $('#clear-input').addEventListener('click',()=>{resetReport();$('#json-input').value='';$('#file-input').value='';illustrative=false;$('#input-status').textContent='No file loaded.';});
 const percent=v=>v===null?'N/A':(v*100).toFixed(1)+'%';
 $('#evaluate').addEventListener('click',()=>{resetReport();try{const raw=$('#json-input').value;if(new Blob([raw]).size>10*1024*1024)throw new Error('Input exceeds the 10 MB limit.');const data=JSON.parse(raw);report={...evaluate(data),input_kind:illustrative?'illustrative synthetic example':'user-supplied parsed predictions'};
 const stats=[['Baseline accuracy',percent(report.accuracy),''],['Correct-answer survival / CF_M',percent(report.cfm),'semantic'],['Neutral consistency',percent(report.ic_neutral),''],['Semantic consistency',percent(report.ic_semantic),'semantic'],['Semantic gap',report.semantic_gap===null?'N/A':(report.semantic_gap*100).toFixed(1)+' pp','semantic'],['Queries evaluated',String(report.queries),'']];
 $('#evaluation-output').innerHTML=(illustrative?'<p class="note">Illustrative example (not model benchmark results)</p>':'')+'<div class="evaluation-stats">'+stats.map(([l,v,c])=>`<div class="${c}"><span>${l}</span><strong>${v}</strong></div>`).join('')+'</div>'+`<p class="eval-counts">${report.retained} / ${report.correct} initially correct answers retained.<br>Consistency uses ${report.neutral_pairs} neutral pairs and ${report.semantic_pairs} semantic pairs.<br>${report.queries_with_unclear} queries contain at least one unclear prediction.</p>`+'<div class="table-scroll"><table class="task-results"><caption>Per-task results from uploaded parsed predictions.</caption><thead><tr><th>Task</th><th>Queries</th><th>Accuracy</th><th>CF<sub>M</sub></th></tr></thead><tbody>'+Object.entries(report.per_task).map(([t,s])=>`<tr><th scope="row">${t.replaceAll('_',' ')}</th><td>${s.queries}</td><td>${percent(s.accuracy)}</td><td>${percent(s.cfm)}</td></tr>`).join('')+'</tbody></table></div>';
 $('#export-evaluation').disabled=false;
 }catch(e){error(e instanceof SyntaxError?'Invalid JSON. Check quotes, commas and brackets.':e.message);}});
 $('#export-evaluation').addEventListener('click',()=>{if(report)download('groundlm-paired-audit.json',JSON.stringify(report,null,2));});
}
