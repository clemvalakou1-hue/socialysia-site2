'use strict';
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const small=matchMedia('(max-width: 680px)');
 const ease='cubic-bezier(.22,.61,.36,1)';
 const menu=document.querySelector('.mobile-nav');
 if(menu)menu.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}
 });
 let observer;
 function chapters(){
  observer?.disconnect();
  if(reduce.matches||!('IntersectionObserver' in window))return;
  observer=new IntersectionObserver((entries)=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    entry.target.classList.add('chapter-seen');
    observer.unobserve(entry.target);
   }
  },{threshold:.12});
  document.querySelectorAll('.home .chapter:not(.chapter-seen)').forEach(chapter=>observer.observe(chapter));
 }
 reduce.addEventListener('change',chapters);
 chapters();

 function setup({play,stop,status,run,duration}){
  if(!play||!stop||!Element.prototype.animate)return;
  let active=[],timer,revision=0;
  const say=t=>{if(status)status.textContent=t;};
  function reset(message){
   revision++;clearTimeout(timer);
   active.forEach(animation=>animation.cancel());active=[];
   play.removeAttribute('aria-disabled');
   say(message);
  }
  function sync(){
   reset(reduce.matches?'Mouvements réduits : version fixe.':'Version fixe.');
   for(const b of [play,stop]){
    b.hidden=reduce.matches&&document.activeElement!==b;
    if(reduce.matches)b.setAttribute('aria-disabled','true');
    else b.removeAttribute('aria-disabled');
   }
  }
  for(const b of [play,stop])b.addEventListener('blur',()=>{if(reduce.matches)b.hidden=true;});
  stop.addEventListener('click',()=>{if(!reduce.matches)reset('Version fixe.');});
  play.addEventListener('click',()=>{
   if(reduce.matches||active.length)return;
   const id=++revision;
   const animate=(el,frames,ms,delay=0)=>{if(el)active.push(el.animate(frames,{duration:ms,delay,easing:ease,fill:'both'}));};
   run(animate);
   if(!active.length)return;
   play.setAttribute('aria-disabled','true');
   say('Animation en cours.');
   const done=()=>{if(revision===id)reset('Animation terminée.');};
   timer=setTimeout(done,duration+120);
   Promise.allSettled(active.map(a=>a.finished)).then(done);
  });
  reduce.addEventListener('change',sync);
  small.addEventListener('change',sync);
  sync();
 }
 const field=document.querySelector('#diagramme');
 if(field)setup({play:field.querySelector('.trace-button'),stop:field.querySelector('.trace-stop'),status:field.querySelector('[role=status]'),duration:1780,
  run(animate){
   const glow=[{boxShadow:'inset 0 0 0 2px #BE9861'},{boxShadow:'inset 0 0 0 2px transparent'}];
   field.querySelectorAll('.field-angles article').forEach((el,i)=>animate(el,glow,360,80*i));
   if(small.matches)animate(field.querySelector('.motion-rail'),[{transform:'scaleY(0)',opacity:1},{transform:'scaleY(1)',opacity:1,offset:.85},{transform:'scaleY(1)',opacity:0}],580,300);
   else animate(field.querySelector('.motion-path'),[{strokeDashoffset:100,opacity:1},{strokeDashoffset:0,opacity:1,offset:.85},{strokeDashoffset:0,opacity:0}],580,300);
   animate(field.querySelector('.diagram-bridge'),glow,360,780);
   animate(field.querySelector('.field-reading .source'),glow,480,940);
   animate(field.querySelector('.field-reading .discussion'),glow,480,1300);
  }
 });
})();
