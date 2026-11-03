export const OUTCOMES={correct:'Correct',wrong:'Completed numeric error',invalid:'Invalid completed answer',cutoff:'Token cutoff',error:'API / provider error'};
export function historyRows(index,{model='all',run='all',stage='all',query=''}={}){
 const groups=new Map(index.groups.map(g=>[g.id,g]));const q=query.trim().toLowerCase();
 return index.model_runs.filter(r=>(model==='all'||r.model===model)&&(run==='all'||r.run_id===run)&&(stage==='all'||groups.get(r.run_id).stage===stage)&&[r.name,r.model,groups.get(r.run_id).label].join(' ').toLowerCase().includes(q));
}
export function caseRows(rows,{model,task='all',size='all',outcome='all',query=''}={}){
 const q=query.trim().toLowerCase();return rows.filter(r=>(!model||r.model===model)&&(task==='all'||r.task===task)&&(size==='all'||r.n===Number(size))&&(outcome==='all'||r.outcome===outcome)&&[r.id,r.case_id,r.variant].join(' ').toLowerCase().includes(q));
}
export const pageRows=(rows,page,size=25)=>rows.slice(page*size,(page+1)*size);
