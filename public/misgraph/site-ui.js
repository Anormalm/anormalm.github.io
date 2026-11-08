const menu=document.querySelector('.resource-menu');
if(menu){
 document.addEventListener('click',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false;});
 menu.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
}
function revealLinkedDetails(){
 let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 const target=document.getElementById(id);if(!target)return;
 let detail=target.closest('details');if(!detail)return;
 while(detail){detail.open=true;detail=detail.parentElement?.closest('details');}
 target.scrollIntoView({block:'start'});
}
window.addEventListener('hashchange',revealLinkedDetails);
revealLinkedDetails();

const copyCitation=document.querySelector('#copy-citation');
if(copyCitation){
 copyCitation.hidden=false;
 copyCitation.addEventListener('click',async()=>{
  const status=document.querySelector('#citation-status');
  try{
   await navigator.clipboard.writeText(document.querySelector('#release-bibtex').textContent);
   status.textContent='BibTeX copied.';
  }catch{
   status.textContent='Copying did not work. Select the citation above to copy it, or download the BibTeX file.';
  }
 });
}
