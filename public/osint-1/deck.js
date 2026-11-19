/* Click builds are explicit states. There is no autoplay or looping media. */
(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const stage = document.querySelector('#stage');
  const panel = document.querySelector('#notes-panel');
  let slide = 0, step = 0;
  const max = i => Number(slides[i].dataset.max);
  function fit() {
    const scale = Math.min(innerWidth / 1280, (innerHeight - 32) / 720);
    stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
  }
  document.querySelectorAll('.draw').forEach(p => {
    p.style.setProperty('--path-length', String(p.getTotalLength()));
  });
  function notes() {
    document.querySelector('#notes-title').textContent = `${slide + 1}. ${slides[slide].querySelector('h1').textContent}`;
    document.querySelector('#notes-text').textContent = slides[slide].querySelector('.speaker-note').textContent;
    document.querySelector('#notes-build').textContent = `Build ${step} of ${max(slide)}. Right advances one build; Left reverses it.`;
  }
  function show(i, j, hash = true) {
    slide = Math.max(0, Math.min(slides.length - 1, i));
    step = Math.max(0, Math.min(max(slide), j));
    // Hide the outgoing scene before revealing the next scene's initial state.
    slides.forEach((s, k) => { if (k !== slide) s.hidden = true; });
    const current = slides[slide];
    current.dataset.step = String(step);
    current.querySelectorAll('[data-at]').forEach(el => el.classList.toggle('shown', Number(el.dataset.at) <= step));
    current.hidden = false;
    document.querySelector('#position').textContent = `${String(slide + 1).padStart(2, '0')} / ${slides.length}`;
    document.querySelector('#builds').innerHTML = Array.from({length:max(slide)}, (_, k) => `<span class="dot ${k < step ? 'on' : ''}"></span>`).join('');
    document.querySelector('#builds').setAttribute('aria-label', `Build ${step} of ${max(slide)}`);
    document.querySelector('#progress').style.width = `${100 * (slide + (max(slide) ? step / max(slide) : 1)) / slides.length}%`;
    if (hash) history.replaceState(null, '', `#${slide + 1}/${step}`);
    notes();
  }
  function next() { if (step < max(slide)) show(slide, step + 1); else if (slide < slides.length - 1) show(slide + 1, 0); }
  function previous() { if (step) show(slide, step - 1); else if (slide) show(slide - 1, max(slide - 1)); }
  function toggleNotes() {
    panel.hidden = !panel.hidden;
    document.querySelector('#notes-toggle').setAttribute('aria-pressed', String(!panel.hidden));
  }
  document.querySelector('#notes-toggle').addEventListener('click', toggleNotes);
  document.querySelector('#notes-close').addEventListener('click', () => { panel.hidden = true; document.querySelector('#notes-toggle').setAttribute('aria-pressed', 'false'); });
  stage.addEventListener('click', e => { if (!e.target.closest('a,button,input,textarea,select') && panel.hidden) next(); });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest('a,button') && (e.key === ' ' || e.key === 'Enter')) return;
    if (['ArrowRight',' ','PageDown','ArrowLeft','PageUp','Home','End'].includes(e.key)) e.preventDefault();
    if (['ArrowRight',' ','PageDown'].includes(e.key)) next();
    if (['ArrowLeft','PageUp'].includes(e.key)) previous();
    if (e.key === 'Home') show(0,0);
    if (e.key === 'End') show(slides.length - 1, max(slides.length - 1));
    if (e.key.toLowerCase() === 'n') toggleNotes();
    if (e.key === 'Escape' && !panel.hidden) toggleNotes();
    if (e.key.toLowerCase() === 'f') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.().catch(() => {}); }
  });
  let touch;
  stage.addEventListener('touchstart', e => { if (!e.target.closest('a,button')) touch = e.changedTouches[0]; }, {passive:true});
  stage.addEventListener('touchend', e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.clientX;
    if (Math.abs(dx) > 60) { e.preventDefault(); dx < 0 ? next() : previous(); }
    touch = null;
  }, {passive:false});
  function readHash() { const m = location.hash.match(/^#(\d+)(?:\/(\d+))?$/); show(m ? +m[1] - 1 : 0, m ? +(m[2] || 0) : 0); }
  addEventListener('hashchange', readHash);
  addEventListener('resize', fit);
  window.deck = { show, next, previous, count: slides.length, state: () => ({slide,step,max:max(slide)}), exportAll: () => { document.body.classList.add('print'); slides.forEach(s => {s.hidden=false;s.querySelectorAll('[data-at]').forEach(el=>el.classList.add('shown'));}); } };
  fit(); readHash();
})();
