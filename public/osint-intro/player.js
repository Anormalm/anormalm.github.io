/* One owner for video playback. Each clip is muted, non-looping and holds its end. */
(function(){
  function currentVideo(){return Reveal.getCurrentSlide()?.querySelector('video.scene');}
  function showFallback(video){const button=video.parentElement.querySelector('.play-fallback');button.hidden=false;button.onclick=e=>{e.stopPropagation();video.play().then(()=>button.hidden=true).catch(()=>{});};}
  function startSlide(){
    document.querySelectorAll('video.scene').forEach(v=>v.pause());
    document.querySelectorAll('.play-fallback').forEach(b=>b.hidden=true);
    const v=currentVideo();if(!v)return;
    v.muted=true;v.loop=false;v.currentTime=0;
    v.play().catch(error=>{if(error.name!=='AbortError' && v===currentVideo() && v.paused && !v.ended)showFallback(v);});
  }
  function togglePlayback(){const v=currentVideo();if(!v)return;if(v.paused){if(v.ended)v.currentTime=0;v.play().catch(error=>{if(error.name!=='AbortError' && v===currentVideo() && v.paused && !v.ended)showFallback(v);});}else v.pause();}
  document.querySelectorAll('video.scene').forEach(v=>v.addEventListener('playing',()=>{v.parentElement.querySelector('.play-fallback').hidden=true;}));
  Reveal.initialize({width:1280,height:720,margin:.02,minScale:.1,maxScale:2,
    controls:false,progress:false,center:false,transition:'none',backgroundTransition:'none',
    hash:true,slideNumber:'c/t',autoSlide:0,autoPlayMedia:false,viewDistance:1,
    scrollActivationWidth:null,plugins:[RevealNotes],keyboard:{32:togglePlayback}
  }).then(startSlide);
  Reveal.on('slidechanged',startSlide);
  document.querySelector('.slides').addEventListener('click',e=>{
    if(e.target.closest('a,button,input,textarea')||Reveal.isOverview())return;
    Reveal.next();
  });
})();
