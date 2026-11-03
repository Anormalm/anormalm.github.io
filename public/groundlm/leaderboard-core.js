export const TASKS={weighted_shortest_path:'Weighted shortest path',shortest_path_count:'Shortest-path count',exact_walk_count:'Exact-walk count',triangle_count:'Triangle count',minimum_cut:'Minimum cut',constrained_reachability:'Constrained reachability'};
export const VARIANTS={original:'Original',repeat:'Identical repeat',neutral:'Neutral names',degree_aligned:'Degree-aligned names',degree_reversed:'Degree-reversed names',format_json:'JSON format',order_shuffled:'Shuffled order',distractor:'Disjoint distractor'};
export const percent=v=>v==null?'—':(100*v).toFixed(1)+'%';
export const money=v=>'$'+v.toFixed(2);
export const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function estimate(values){
 const n=values.length;if(!n)return {value:null,n:0,ci95:null};
 const p=values.reduce((a,b)=>a+b,0)/n,z=1.95996398454,d=1+z*z/n;
 const c=(p+z*z/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;
 return {value:p,n,ci95:[Math.max(0,c-h),Math.min(1,c+h)]};
}
export const returned=r=>r?.status==='ok';
export const parseable=r=>returned(r)&&r.parsed_answer!=null;
export function statusOf(r){return !returned(r)?'error':r.correct?'correct':r.finish_reason==='length'?'cutoff':r.parsed_answer==null?'invalid':'wrong';}
export function summarize(records){
 const rows=records.filter(returned),groups=new Map();
 for(const r of records){if(!groups.has(r.case_id))groups.set(r.case_id,{});groups.get(r.case_id)[r.variant]=r;}
 const agreement={},survival={},accuracies={};
 for(const variant of Object.keys(VARIANTS)){
  const pairs=[...groups.values()].filter(g=>parseable(g.original)&&parseable(g[variant]));
  agreement[variant]=estimate(pairs.map(g=>+(g.original.parsed_answer===g[variant].parsed_answer)));
  const initiallyCorrect=[...groups.values()].filter(g=>returned(g.original)&&g.original.correct&&returned(g[variant]));
  survival[variant]=estimate(initiallyCorrect.map(g=>+g[variant].correct));
  accuracies[variant]=estimate([...groups.values()].filter(g=>returned(g[variant])).map(g=>+g[variant].correct));
 }
 const counts={correct:0,wrong:0,invalid:0,cutoff:0,error:0};for(const r of records)counts[statusOf(r)]++;
 const latency=rows.map(r=>r.seconds).filter(Number.isFinite).sort((a,b)=>a-b);
 return {total:records.length,returned:rows.length,graphs:groups.size,counts,accuracy:rows.length?counts.correct/rows.length:null,
  original:accuracies.original,agreement,survival,accuracies,cost:records.reduce((s,r)=>s+(r.cost||0),0),
  cutoff:rows.length?counts.cutoff/rows.length:null,seconds:latency.length?(latency[Math.floor((latency.length-1)/2)]+latency[Math.ceil((latency.length-1)/2)])/2:null};
}
export function selectRecords(records,{task='all',size='all',variant='all',model}={}){
 return records.filter(r=>(!model||r.model===model)&&(task==='all'||r.task===task)&&(size==='all'||r.n===Number(size))&&(variant==='all'||r.variant===variant));
}
export function compareModels(data,filters={}){
 return data.models.map(m=>({...m,...summarize(selectRecords(data.records,{...filters,model:m.id}))}));
}
export function csv(rows){const cell=v=>'"'+String(v??'').replaceAll('"','""')+'"';return rows.map(r=>r.map(cell).join(',')).join('\n');}
