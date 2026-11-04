export const tasks=['connectivity','shortest_path','triangle_detection','common_neighbor'];
export const models=[
 {name:'DeepSeek-V4-Flash',family:'DeepSeek',accuracy:98.9,format:2.5,order:1.8,gap:26.8,distractor:2.6,cfm:72.9},
 {name:'gpt-5.4-mini',family:'OpenAI',accuracy:93.6,format:8.4,order:4.6,gap:15.2,distractor:6.6,cfm:53.3},
 {name:'Llama-4-Scout',family:'Meta',accuracy:68.9,format:25.9,order:14.2,gap:9.1,distractor:30.6,cfm:65.8},
 {name:'Qwen3.6-35B-A3B',family:'Qwen',accuracy:54.1,format:32.5,order:8.6,gap:6.1,distractor:31.8,cfm:57.5}
];
export const edges=[[0,1],[1,2],[0,2],[2,3],[3,4]];
export const positions=[[65,150],[180,60],[220,220],[360,180],[475,280]];
export function labels(semantic=false){
 const names=Array.from({length:5},(_,i)=>`X${i+1}`);
 if(semantic){const rank=[0,1,2,3,4].sort((a,b)=>neighbors(b).length-neighbors(a).length||a-b);rank.forEach((id,i)=>names[id]=['Hub','Center','Bridge','Anchor','Core'][i]);}
 return names;
}
export function neighbors(v){return edges.filter(e=>e.includes(v)).map(e=>e[0]===v?e[1]:e[0]);}
export function shortestPath(a,b){const q=[[a]],seen=new Set([a]);while(q.length){const p=q.shift(),v=p.at(-1);if(v===b)return p;for(const n of neighbors(v)){if(!seen.has(n)){seen.add(n);q.push([...p,n]);}}}return null;}
export function answer(task,a=0,b=4){
 if(task==='shortest_path')return String(shortestPath(a,b)?.length-1);
 if(task==='connectivity')return shortestPath(a,b)?'yes':'no';
 if(task==='common_neighbor')return neighbors(a).some(x=>neighbors(b).includes(x))?'yes':'no';
 if(task==='triangle_detection'){const ns=neighbors(a);return ns.some((v,i)=>ns.slice(i+1).some(w=>neighbors(v).includes(w)))?'yes':'no';}
 throw new Error('Unknown task');
}
export function serialize({format='edge',semantic=false,reverse=false,a=0,b=4,task='shortest_path'}={}){
 const ns=labels(semantic),es=(reverse?[...edges].reverse():edges).map(([x,y])=>[ns[x],ns[y]]);
 let graph;
 if(format==='json')graph=JSON.stringify({nodes:ns,edges:es},null,2);
 else if(format==='adjacency')graph=ns.map((n,i)=>`${n}: ${neighbors(i).map(x=>ns[x]).join(', ')}`).join('\n');
 else if(format==='language')graph=es.map(([x,y])=>`${x} is connected to ${y}.`).join(' ');
 else graph=es.map(([x,y])=>`${x} -- ${y}`).join('\n');
 const question={shortest_path:`How many edges are in the shortest path from ${ns[a]} to ${ns[b]}?`,connectivity:`Is there a path from ${ns[a]} to ${ns[b]}?`,triangle_detection:`Does ${ns[a]} participate in a triangle?`,common_neighbor:`Do ${ns[a]} and ${ns[b]} share a neighbor?`}[task];
 return `Undirected graph:\n${graph}\n\nQuestion: ${question}\nReturn ${task==='shortest_path'?'an integer':'yes or no'}.`;
}
const ratio=(n,d)=>d?n/d:null;
function summarize(rows){
 let correct=0,retained=0,neutralPairs=0,semanticPairs=0,neutralSame=0,semanticSame=0,unclear=0;
 for(const r of rows){
  if(r.original===r.ground_truth){correct++;if(r.semantic===r.ground_truth)retained++;}
  if([r.original,r.neutral,r.semantic].includes('unclear'))unclear++;
  if(r.original!=='unclear'&&r.neutral!=='unclear'){neutralPairs++;neutralSame+=Number(r.original===r.neutral);}
  if(r.original!=='unclear'&&r.semantic!=='unclear'){semanticPairs++;semanticSame+=Number(r.original===r.semantic);}
 }
 const icN=ratio(neutralSame,neutralPairs),icM=ratio(semanticSame,semanticPairs);
 return {queries:rows.length,correct,retained,accuracy:ratio(correct,rows.length),cfm:ratio(retained,correct),ic_neutral:icN,ic_semantic:icM,semantic_gap:icN===null||icM===null?null:icN-icM,neutral_pairs:neutralPairs,semantic_pairs:semanticPairs,queries_with_unclear:unclear};
}
export function evaluate(value){
 if(!Array.isArray(value)||!value.length)throw new Error('Provide a non-empty JSON array of paired-answer records.');
 if(value.length>50000)throw new Error('Use at most 50,000 records per evaluation.');
 const seen=new Set();
 const rows=value.map((r,i)=>{
  const loc=`Record ${i+1}`;
  if(!r||typeof r!=='object'||Array.isArray(r))throw new Error(`${loc}: expected an object.`);
  if(typeof r.id!=='string'||!r.id.trim()||r.id.length>200)throw new Error(`${loc}: id must be a non-empty string (max 200 characters).`);
  if(seen.has(r.id))throw new Error(`${loc}: duplicate id "${r.id}".`);seen.add(r.id);
  if(!tasks.includes(r.task))throw new Error(`${loc}: unknown task.`);
  const out={id:r.id,task:r.task};
  for(const k of ['ground_truth','original','neutral','semantic']){
   if(typeof r[k]!=='string'&&typeof r[k]!=='number')throw new Error(`${loc}: ${k} must be a parsed answer.`);
   const v=String(r[k]).trim().toLowerCase();
   const valid=r.task==='shortest_path'?/^(0|[1-9]\d*)$/.test(v)&&Number.isSafeInteger(Number(v)):['yes','no'].includes(v);
   if(!valid&&!(k!=='ground_truth'&&v==='unclear'))throw new Error(`${loc}: invalid ${k}; use ${r.task==='shortest_path'?'a nonnegative integer':'yes or no'}${k==='ground_truth'?'':' or unclear'}.`);
   out[k]=v;
  }
  return out;
 });
 return {schema_version:1,method:'Browser paired-answer audit; parsed answers, complete triples',...summarize(rows),per_task:Object.fromEntries(tasks.filter(t=>rows.some(r=>r.task===t)).map(t=>[t,summarize(rows.filter(r=>r.task===t))]))};
}
export const sample=[
 {id:'demo-path-1',task:'shortest_path',ground_truth:'3',original:'3',neutral:'3',semantic:'2'},
 {id:'demo-path-2',task:'shortest_path',ground_truth:'2',original:'2',neutral:'2',semantic:'2'},
 {id:'demo-connectivity',task:'connectivity',ground_truth:'yes',original:'yes',neutral:'yes',semantic:'yes'},
 {id:'demo-triangle',task:'triangle_detection',ground_truth:'no',original:'yes',neutral:'no',semantic:'no'},
 {id:'demo-neighbor',task:'common_neighbor',ground_truth:'yes',original:'yes',neutral:'yes',semantic:'unclear'}
];
