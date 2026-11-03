import {selectRecords,summarize} from './leaderboard-core.js';

export function cohortRows(protocol,data,filters={}){
    if(!protocol.protocol_id||!Array.isArray(protocol.registry))throw Error('Missing comparison protocol.');
    return protocol.registry.map(model=>{
        const eligible=model.status==='eligible'&&model.protocol_id===protocol.protocol_id;
        const rows=eligible?selectRecords(data.records,{...filters,model:model.id}):[];
        const metrics=eligible?summarize(rows):null;
        return {...model,eligible,metrics,cost_per_1000:metrics?.total?metrics.cost*1000/metrics.total:null};
    });
}
export function visibleRows(rows,{query='',status='all',precision='all',sort='original',ascending=false}={}){
    const q=query.trim().toLowerCase();
    const value=r=>sort==='original'?r.metrics?.original.value:sort==='survival'?r.metrics?.survival.degree_reversed.value:sort==='cutoff'?r.metrics?.cutoff:r.cost_per_1000;
    return rows.filter(r=>(status==='all'||(status==='eligible'?r.eligible:!r.eligible))&&(precision==='all'||r.precision===precision)&&[r.id,r.name,r.creator,r.endpoint||''].join(' ').toLowerCase().includes(q)).sort((a,b)=>{
        if(a.eligible!==b.eligible)return a.eligible?-1:1;
        const x=value(a),y=value(b);return x==null?y==null?a.name.localeCompare(b.name):1:y==null?-1:(x-y)*(ascending?1:-1)||a.name.localeCompare(b.name);
    });
}
export function expectedScope(protocol,{task='all',size='all'}={}){
    return protocol.policy.graphs*(task==='all'?1:1/protocol.policy.tasks.length)*(size==='all'?1:.5)*protocol.policy.variants.length;
}
export const metricValue=(row,key)=>!row.eligible?null:key==='original'?row.metrics.original.value:key==='survival'?row.metrics.survival.degree_reversed.value:key==='cutoff'?row.metrics.cutoff:row.cost_per_1000;
