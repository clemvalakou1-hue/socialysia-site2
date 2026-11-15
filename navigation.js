'use strict';
(() => {
 const mobile=document.querySelector('.mobile-nav');
 if(mobile){
   const summary=mobile.querySelector('summary');
   document.addEventListener('pointerdown',e=>{
     if(!mobile.open||mobile.contains(e.target))return;
     if(mobile.contains(document.activeElement))summary.focus({preventScroll:true});
     mobile.open=false;
   });
   addEventListener('pageshow',()=>{mobile.open=false;});
 }
 function reveal(el){
   let opened=false;
   for(let parent=el?.parentElement;parent;parent=parent.parentElement){
     if(parent.tagName==='DETAILS'&&!parent.open){parent.open=true;opened=true;}
   }
   return opened;
 }
 function fragment(){
   let id;
   try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
   const target=document.getElementById(id);
   if(reveal(target))target.scrollIntoView({block:'start'});
 }
 fragment();
 addEventListener('hashchange',fragment);
 const index=document.querySelector('.ux-chapters');
 if(!index)return;
 const links=[...index.querySelectorAll('a')],targets=links.map(a=>document.getElementById(a.hash.slice(1)));
 const count=index.querySelector('.ux-count');
 let current=-2,pending=false;
 function track(){
   pending=false;
   const marker=Math.max(96,Math.min(innerHeight*.26,230));
   let i=-1;
   targets.forEach((el,j)=>{
     const box=el?.closest('details:not([open])')||el;
     if(box&&box.getBoundingClientRect().top<=marker)i=j;
   });
   if(i===current)return;
   current=i;
   links.forEach((a,j)=>i===j?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));
   count.textContent=i<0?'':String(i+1).padStart(2,'0')+' / '+String(links.length).padStart(2,'0');
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(track);}}
 links.forEach((a,j)=>a.addEventListener('click',e=>{
   const el=targets[j];
   if(!el||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   reveal(el);
   if(!el.hasAttribute('tabindex'))el.tabIndex=-1;
   el.focus({preventScroll:true});
   schedule();
 }));
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule,{passive:true});
 addEventListener('hashchange',schedule);
 document.addEventListener('toggle',schedule,true);
 addEventListener('pageshow',schedule);
 track();
})();
