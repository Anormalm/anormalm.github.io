// A local illustration of relabeling. It makes no model or API requests.
export const DEMO_NODES=Object.freeze([[80,80],[230,48],[360,100],[345,215],[190,230],[70,195]].map(Object.freeze));
export const DEMO_EDGES=Object.freeze([[0,1],[0,5],[1,2],[1,4],[2,3],[2,4],[3,4],[4,5]].map(Object.freeze));
export const demoLabels=semantic=>semantic?['Leaf','Hub','Core','Tip','Bridge','Center']:['X1','X2','X3','X4','X5','X6'];
export const labeledEdges=semantic=>{const names=demoLabels(semantic);return DEMO_EDGES.map(([a,b])=>[names[a],names[b]]);};

function start(){
 const figure=document.querySelector('#identity-figure');if(!figure)return;
 const svg=figure.querySelector('svg'),toggle=figure.querySelector('button');
 let semantic=false;
 function render(){
  const names=demoLabels(semantic);
  figure.classList.toggle('is-semantic',semantic);
  toggle.setAttribute('aria-pressed',String(semantic));
  toggle.textContent=semantic?'Restore neutral names':'Rename nodes';
  svg.setAttribute('aria-label',`Six-node graph with eight unchanged edges. Node identifiers: ${names.join(', ')}.`);
  svg.innerHTML=`<title>Renaming preserves the graph</title><g class="identity-edges">${DEMO_EDGES.map(([a,b])=>`<line x1="${DEMO_NODES[a][0]}" y1="${DEMO_NODES[a][1]}" x2="${DEMO_NODES[b][0]}" y2="${DEMO_NODES[b][1]}"/>`).join('')}</g>${DEMO_NODES.map(([x,y],i)=>`<g class="identity-node" transform="translate(${x},${y})"><circle r="29"/><text text-anchor="middle" dominant-baseline="central">${names[i]}</text></g>`).join('')}`;
  figure.querySelector('#identity-mode').textContent=semantic?'Semantic identifiers. The graph is unchanged.':'Neutral identifiers. Six nodes, eight edges.';
  figure.querySelector('#identity-serialization').textContent=labeledEdges(semantic).slice(0,3).map(([a,b])=>`${a} ↔ ${b}`).join(', ')+' + 5 edges';
 }
 toggle.addEventListener('click',()=>{semantic=!semantic;render();});render();
}
if(typeof document!=='undefined')start();
