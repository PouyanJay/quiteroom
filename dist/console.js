// Arrange the real controls on the Quiet Room instrument before binding audio.
(()=>{
const q=s=>document.querySelector(s), panel=q('.instrument-panel');
const stand=document.createElement('div');stand.className='music-stand';
['playView','sequenceView','learnView'].forEach(id=>stand.append(q('#'+id)));
const rail=document.createElement('div');rail.className='control-rail';
const transport=q('.transport');rail.append(transport);
const sound=document.createElement('button');sound.id='soundPicker';sound.className='sound-picker';sound.setAttribute('aria-label','Choose instrument and sound settings');sound.innerHTML='<svg><use href="#i-piano"/></svg><span id="railSound">Studio piano</span><span>⌄</span>';rail.append(sound,q('nav'));
const drawer=document.createElement('dialog');drawer.id='soundDialog';drawer.innerHTML='<button class="close" aria-label="Close sound settings">×</button><span class="eyebrow">YOUR INSTRUMENT</span><h2>Find your sound.</h2>';drawer.append(q('#instruments'),q('.sound-controls'),q('#sustain'),transport.querySelector('.volume'));document.body.append(drawer);
sound.onclick=()=>drawer.showModal();
const tools=document.createElement('div');tools.className='room-tools';tools.append(q('#midi'),q('.heading-actions'));
const full=document.createElement('button');full.id='fullscreen';full.className='icon-button';full.title='Full screen';full.setAttribute('aria-label','Full screen');full.innerHTML='⛶';tools.append(full);full.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{full.title='Full screen unavailable';}};
q('header').append(tools);q('.brand').innerHTML='<span>QUIET ROOM</span><small>ATELIER</small>';
q('aside').remove();q('.panel-top').hidden=true;
panel.prepend(stand);stand.after(rail);['play','learn','sequence'].forEach(m=>q('nav').append(q('nav [data-mode="'+m+'"]')));panel.append(q('.keyboard-toolbar')); // settings live below the keys
q('#import').innerHTML='<svg><use href="#i-upload"/></svg>';q('#import').setAttribute('aria-label','Import song');q('#import').title='Import song';
const art=q('.play-art');const canvas=document.createElement('canvas');canvas.id='resonator';canvas.setAttribute('aria-label','Live notes on the music stand');art.append(canvas);
const label=document.createElement('div');label.className='stand-caption';label.innerHTML='<span id="visualNote">Make room for music.</span><button id="resetCamera" aria-label="Clear note trails" title="Clear note trails">↺</button>';art.append(label);
const seek=document.createElement('div');seek.className='session-progress';seek.innerHTML='<input id="seek" type="range" min="0" max="8" step="0.01" value="0" aria-label="Playback position"><div><span id="elapsed">0:00</span><span id="duration">0:05</span></div>';transport.append(seek);
q('.keyboard-toolbar .eyebrow').textContent='OCTAVE';q('.desktop-hint').textContent='A–L / W–P';q('#labels').checked=false;
const stage=document.createElement('div');stage.className='quiet-stage';stage.append(q('header'),q('main'));document.body.prepend(stage);
q('.brand').innerHTML='<span>QUIET ROOM</span>';
const piano=document.createElement('button');piano.id='quickPiano';piano.className='quick-sound active';piano.innerHTML='<svg><use href="#i-piano"/></svg><span>Piano</span>';piano.title='Studio piano';
const guitar=document.createElement('button');guitar.id='quickGuitar';guitar.className='quick-sound';guitar.innerHTML='<svg viewBox="0 0 24 24"><path d="M15 3l6 3-6 8c2 4-1 7-4 7-5 0-8-5-5-8 2-2 4-1 5-1zM10 15l8-10"/></svg><span>Guitar</span>';guitar.title='Nylon guitar';
const sounds=document.createElement('div');sounds.className='quick-sounds';rail.insertBefore(sounds,sound);sounds.append(piano,guitar,sound);
piano.onclick=()=>q('[data-instrument="0"]').click();guitar.onclick=()=>q('[data-instrument="1"]').click();
sound.title='All instruments & sound settings';
document.body.dataset.mode='play';
})();
