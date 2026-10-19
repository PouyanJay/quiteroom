// All auxiliary controls live on the instrument's glass surface.
(()=>{
const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],stand=q('.music-stand');let returnFocus=null;const history=[];
const icon=path=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
const hidePanels=()=>all('.glass-panel[open]').forEach(d=>d.removeAttribute('open'));
const closePanels=()=>{hidePanels();history.length=0;stand.classList.remove('panel-open');if(returnFocus?.isConnected)returnFocus.focus?.();};
function backPanel(){const previous=history.pop();if(!previous){closePanels();return;}hidePanels();previous.panel.setAttribute('open','');stand.classList.add('panel-open');previous.trigger?.focus?.();}
function openPanel(panel,trigger){const current=q('.glass-panel[open]');if(current&&current!==panel)history.push({panel:current,trigger});else if(!current){history.length=0;returnFocus=trigger||document.activeElement;}hidePanels();panel.setAttribute('open','');stand.classList.add('panel-open');panel.querySelector('.glass-back')?.focus?.();}
function register(panel){panel.classList.add('glass-panel');panel.setAttribute('aria-modal','false');stand.append(panel);const close=panel.querySelector('.close');close.className='screen-dismiss';close.innerHTML=icon('M6 6l12 12M18 6 6 18');close.removeAttribute('title');close.onclick=closePanels;const back=document.createElement('button');back.type='button';back.className='glass-back glass-icon';back.setAttribute('aria-label','Back');back.title='Back';back.innerHTML=icon('M19 12H5m6-6-6 6 6 6');back.onclick=backPanel;panel.prepend(back);}
all('dialog').forEach(register);
q('#soundPicker').onclick=()=>openPanel(q('#soundDialog'),q('#soundPicker'));
q('#help').onclick=()=>openPanel(q('#helpDialog'),q('#help'));
q('#import').onclick=()=>openPanel(q('#importDialog'),q('#import'));
const settings=document.createElement('dialog');settings.id='keyboardDialog';settings.innerHTML='<button class="close" aria-label="Close keyboard settings">×</button><h2>Keyboard</h2><p>Play with your mouse, touch, or computer keys A–L and W–P.</p>';settings.append(q('.keyboard-toolbar'),q('#midi'));register(settings);
const settingButton=document.createElement('button');settingButton.id='keyboardSettings';settingButton.className='glass-icon';settingButton.setAttribute('aria-label','Keyboard settings and MIDI');settingButton.title='Keyboard settings & MIDI';settingButton.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 7h16M4 17h16M8 4v6m8 4v6"/></svg>';settingButton.onclick=()=>openPanel(settings,settingButton);
const bar=document.createElement('div');bar.className='glass-bar';const caption=document.createElement('span');caption.className='glass-caption';caption.textContent='Make room for music.';bar.append(caption,q('.learn-tools'));
const actions=document.createElement('div');actions.className='glass-actions';const soundButton=document.createElement('button');soundButton.className='glass-icon';soundButton.title='Instruments & sound';soundButton.setAttribute('aria-label','Instruments and sound');soundButton.innerHTML='<svg><use href="#i-piano"/></svg>';soundButton.onclick=()=>openPanel(q('#soundDialog'),soundButton);actions.append(soundButton,settingButton,q('#import'),q('#help'));bar.append(actions);stand.prepend(bar);
q('#help').className='glass-icon';q('#import').className='glass-icon';
const sd=q('#soundDialog');sd.querySelector('h2').textContent='Instruments & sound';const soundBody=document.createElement('div');soundBody.className='glass-sound-body';soundBody.append(q('#instruments'),q('.sound-controls'));sd.append(soundBody);const soundFoot=document.createElement('div');soundFoot.className='glass-sound-foot';soundFoot.append(q('#sustain'),q('.volume'));sd.append(soundFoot);
// Tone, Space and Volume share one aligned control column.
const volumeBox=q('.volume'),volumeLabel=document.createElement('div');volumeLabel.className='labelrow';const vl=document.createElement('label');vl.htmlFor='volume';vl.textContent='Volume';volumeLabel.append(vl,q('#volumeText'));q('.sound-controls').append(volumeLabel,q('#volume'));volumeBox.remove();
const roomTools=q('.room-tools');roomTools.append(q('#import'),q('#help'),q('#fullscreen'));q('.heading-actions')?.remove();
const full=q('#fullscreen');full.className='glass-icon';
function syncFullscreen(){const active=!!(document.fullscreenElement||document.webkitFullscreenElement||document.body.classList.contains('expanded-room'));full.innerHTML=icon(active?'M9 3v6H3m18 0h-6V3M3 15h6v6m6 0v-6h6':'M9 3H3v6m12-6h6v6M3 15v6h6m6 0h6v-6');full.title=active?'Exit expanded view':'Full screen';full.setAttribute('aria-label',full.title);full.setAttribute('aria-pressed',String(active));}
full.onclick=async()=>{if(document.body.classList.contains('expanded-room')){document.body.classList.remove('expanded-room');syncFullscreen();return;}try{if(document.fullscreenElement||document.webkitFullscreenElement){const exit=document.exitFullscreen||document.webkitExitFullscreen;await exit.call(document);}else{const request=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;if(!request)throw Error('Fullscreen unavailable');await request.call(document.documentElement);}}catch{document.body.classList.add('expanded-room');toast('Expanded view enabled. For browser fullscreen, use your browser’s full-screen command.');}syncFullscreen();};
document.addEventListener('fullscreenchange',syncFullscreen);document.addEventListener('webkitfullscreenchange',syncFullscreen);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('expanded-room')){document.body.classList.remove('expanded-room');syncFullscreen();}});syncFullscreen();
// Compact controls share the glass header and leave the screen unobstructed.
const soundHeader=document.createElement('div');soundHeader.className='glass-sound-header';sd.insertBefore(soundHeader,sd.querySelector('h2'));soundHeader.append(sd.querySelector('h2'),q('#sustain'));soundFoot.remove();
const picker=q('#soundPicker');picker.innerHTML=icon('M5 5h4v4H5zM15 5h4v4h-4zM5 15h4v4H5zM15 15h4v4h-4z')+'<span id="railSound" hidden></span>';picker.setAttribute('aria-label','All instruments');picker.title='All instruments';picker.onclick=()=>openPanel(sd,picker);
const upload=q('#importDialog');upload.querySelector('h2').textContent='Import';upload.querySelectorAll('p,.import-info').forEach(el=>el.remove());q('#dropzone strong').textContent='Import a song';q('#dropzone span').hidden=true;q('#file').setAttribute('aria-label','Import a MIDI or audio file');q('#dropzone').title='Choose a MIDI or audio file, or drop it here';
// Keep native selects as the data source, but present every choice on the glass.
const choices=document.createElement('dialog');choices.id='choiceDialog';choices.innerHTML='<button class="close" aria-label="Close choices">×</button><h2></h2><div class="glass-choices"></div>';register(choices);
function enhanceSelect(id,title){const select=q('#'+id);if(!select)return;select.classList.add('glass-native-source');select.tabIndex=-1;select.setAttribute('aria-hidden','true');const button=document.createElement('button');button.type='button';button.className='glass-select';button.id=id+'Button';button.setAttribute('aria-haspopup','dialog');select.after(button);
const sync=()=>{const option=[...select.options].find(o=>o.value===select.value);button.replaceChildren();const label=document.createElement('span');label.textContent=(id==='speed'?'Speed · ':'')+(option?.textContent||title);button.append(label);button.insertAdjacentHTML('beforeend',icon('m9 5 7 7-7 7'));button.setAttribute('aria-label',title+': '+(option?.textContent||''));};sync();select.addEventListener('change',sync);
button.onclick=()=>{choices.querySelector('h2').textContent=title;const list=choices.querySelector('.glass-choices');list.replaceChildren();[...select.options].forEach(option=>{const item=document.createElement('button');item.type='button';item.className='glass-choice';item.textContent=option.textContent;item.insertAdjacentHTML('beforeend',icon('m5 12 4 4L19 6'));item.setAttribute('aria-pressed',String(option.value===select.value));item.onclick=()=>{[...select.options].forEach(o=>{if(o===option)o.setAttribute('selected','');else o.removeAttribute('selected');});select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));sync();backPanel();};list.append(item)});openPanel(choices,button);};}
enhanceSelect('songSelect','Choose a piece');enhanceSelect('speed','Practice speed');enhanceSelect('noteLength','Note length');
// The physical glass is the screen: no floating toolbar or exposed dropdowns.
const learnActions=document.createElement('div');learnActions.className='learn-direct-actions';learnActions.setAttribute('role','group');learnActions.setAttribute('aria-label','Learning controls');
for(const [id,label,path] of [['waitMode','Wait for me','M8 5v14M16 5v14'],['listenMode','Listen','M4 14v-3a8 8 0 0 1 16 0v3M4 12h3v8H4zM17 12h3v8h-3z']]){const button=q('#'+id);button.className='glass-icon'+(button.classList.contains('active')?' active':'');button.innerHTML=icon(path);button.title=label;button.setAttribute('aria-label',label);learnActions.append(button);}bar.prepend(learnActions);
const sources=q('.learn-tools');sources.hidden=true;sources.classList.add('learn-control-sources');stand.append(sources);
const piece=document.createElement('button');piece.id='pieceAction';piece.className='glass-icon';piece.title='Choose a piece';piece.setAttribute('aria-label','Choose a piece');piece.innerHTML='<svg viewBox="0 0 24 24"><path d="M9 17V5l11-2v12M9 8l11-2"/><ellipse cx="6" cy="17" rx="3" ry="2"/><ellipse cx="17" cy="15" rx="3" ry="2"/></svg>';piece.onclick=()=>q('#songSelectButton').click();
const practiceAction=document.createElement('button');practiceAction.id='practiceAction';practiceAction.className='glass-icon';practiceAction.title='Practice speed';practiceAction.setAttribute('aria-label','Practice speed');practiceAction.innerHTML='<svg viewBox="0 0 24 24"><path d="M8 3h8l4 18H4ZM12 16l6-10M8 17h8"/></svg>';practiceAction.onclick=()=>q('#speedButton').click();
learnActions.prepend(piece);actions.prepend(practiceAction);
q('#help').innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01"/></svg>';
function updateCaption(){const option=[...q('#songSelect').options].find(o=>o.value===q('#songSelect').value);caption.textContent=document.body.dataset.mode==='learn'?(option?.textContent||'Practice'):document.body.dataset.mode==='sequence'?'Your arrangement':'Live performance';}
updateCaption();q('#songSelect').addEventListener('change',updateCaption);all('nav button').forEach(b=>b.addEventListener('click',updateCaption));
all('nav button').forEach(b=>b.addEventListener('click',closePanels));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&q('.glass-panel[open]')){backPanel();e.preventDefault();}});
q('#octaveDown').innerHTML=icon('M5 12h14');q('#octaveUp').innerHTML=icon('M5 12h14M12 5v14');
// One compact sequencer toolbar above a full-height, octave-sized roll.
const sequence=q('#sequenceView'),sequenceTools=q('.sequence-tools');const lengthSource=document.createElement('div');lengthSource.hidden=true;lengthSource.append(q('#noteLength'),q('#noteLengthButton'),q('#clearTrack'));sequence.append(lengthSource);sequenceTools.replaceChildren();sequenceTools.append(q('#tracks'));
const editActions=document.createElement('div');editActions.className='sequence-actions';
function seqButton(id,label,path,handler){let button=q('#'+id);if(!button){button=document.createElement('button');button.id=id;}button.className='glass-icon';button.type='button';button.title=label;button.setAttribute('aria-label',label);button.innerHTML=icon(path);if(handler)button.onclick=handler;editActions.append(button);return button;}
seqButton('sequenceDown','Lower octave','m6 9 6 6 6-6',()=>{sequenceTop=Math.max(35,sequenceTop-12);renderRoll();});
const range=document.createElement('span');range.id='sequenceRange';editActions.append(range);
seqButton('sequenceUp','Higher octave','m6 15 6-6 6 6',()=>{sequenceTop=Math.min(95,sequenceTop+12);renderRoll();});
seqButton('sequenceLength','Note length','M7 16V4l10-1v11M7 7l10-1M7 16c0 3-5 4-5 1s5-4 5-1m10-2c0 3-5 4-5 1s5-4 5-1',()=>q('#noteLengthButton').click());
seqButton('undo','Undo','M9 5 3 11l6 6M3 11h11a6 6 0 0 1 6 6');
seqButton('clearTrack','Clear selected track','M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7');
seqButton('exportMidi','Export MIDI','M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4');
const settingsTray=document.createElement('div');settingsTray.className='sequence-settings';
editActions.id='sequenceSettingsActions';editActions.inert=true;editActions.setAttribute('aria-hidden','true');
const gear=document.createElement('button');gear.id='sequenceSettingsToggle';gear.type='button';gear.className='glass-icon sequence-gear';gear.title='Sequencer settings';gear.setAttribute('aria-label','Sequencer settings');gear.setAttribute('aria-controls',editActions.id);gear.setAttribute('aria-expanded','false');gear.innerHTML=icon('m9 3-.6 2.3-2 .9-2.1-.6-2 3.4 1.6 1.7v2.6L2.3 15l2 3.4 2.1-.6 2 .9L9 21h4l.6-2.3 2-.9 2.1.6 2-3.4-1.6-1.7v-2.6l1.6-1.7-2-3.4-2.1.6-2-.9L13 3Z M14.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0');
function toggleSequenceSettings(open){settingsTray.classList.toggle('is-open',open);gear.setAttribute('aria-expanded',String(open));editActions.inert=!open;editActions.setAttribute('aria-hidden',String(!open));}
gear.onclick=()=>{toggleSequenceTracks(false);toggleSequenceSettings(gear.getAttribute('aria-expanded')!=='true');};settingsTray.addEventListener('keydown',e=>{if(e.key==='Escape'){toggleSequenceSettings(false);gear.focus();e.stopPropagation();}});
const tracksTray=document.createElement('div');tracksTray.className='sequence-settings sequence-tracks';
const trackActions=document.createElement('div');trackActions.id='sequenceTrackActions';trackActions.className='sequence-actions';trackActions.append(q('#tracks'));
const record=q('#record');record.className='glass-icon';record.innerHTML=icon('M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0');trackActions.append(record);
const tracksToggle=document.createElement('button');tracksToggle.id='sequenceTracksToggle';tracksToggle.type='button';tracksToggle.className='glass-icon';tracksToggle.title='Tracks';tracksToggle.setAttribute('aria-label','Tracks');tracksToggle.setAttribute('aria-controls',trackActions.id);tracksToggle.innerHTML=icon('M3 5h18M3 12h18M3 19h18M7 3v4m10 3v4M9 17v4');
function toggleSequenceTracks(open){tracksTray.classList.toggle('is-open',open);tracksToggle.setAttribute('aria-expanded',String(open));trackActions.inert=!open;trackActions.setAttribute('aria-hidden',String(!open));}
tracksToggle.onclick=()=>{toggleSequenceSettings(false);toggleSequenceTracks(tracksToggle.getAttribute('aria-expanded')!=='true');};
tracksTray.addEventListener('keydown',e=>{if(e.key==='Escape'){toggleSequenceTracks(false);tracksToggle.focus();e.stopPropagation();}});
toggleSequenceTracks(false);tracksTray.append(tracksToggle,trackActions);
sequenceTools.remove();settingsTray.append(gear,editActions);bar.prepend(tracksTray,settingsTray);q('.sequence-footer').remove();
const beats=document.createElement('div');beats.className='sequence-beats';beats.innerHTML='<span></span>'+Array.from({length:16},(_,i)=>'<span>'+(i%2===0?i/2+1:'·')+'</span>').join('');q('.roll-container').before(beats);renderRoll();
// Reveal only the pitch under the pointer or keyboard focus.
const roll=q('#pianoRoll');
function clearPitch(){roll.querySelectorAll('.pitch-hover').forEach(el=>el.classList.remove('pitch-hover'));}
function revealPitch(event){const cell=event.target.closest?.('.roll-cell,.pitch-label');if(!cell)return;clearPitch();let label=cell;while(label&&!label.classList.contains('pitch-label'))label=label.previousElementSibling;label?.classList.add('pitch-hover');}
roll.addEventListener('pointerover',revealPitch);roll.addEventListener('pointerleave',clearPitch);roll.addEventListener('focusin',revealPitch);roll.addEventListener('focusout',clearPitch);
// Show playback time only at the handle on hover, drag, or keyboard focus.
const seek=q('#seek'),progress=q('.session-progress'),tip=document.createElement('span');tip.className='seek-time-tip';tip.setAttribute('aria-hidden','true');progress.append(tip);
function positionSeekTip(){const ratio=(+seek.value-+seek.min)/(+seek.max-+seek.min||1);tip.style.left=`calc(${ratio*100}% + ${(0.5-ratio)*10}px)`;tip.textContent=q('#elapsed').textContent;}
seek.addEventListener('pointermove',e=>{const rect=seek.getBoundingClientRect(),ratio=(+seek.value-+seek.min)/(+seek.max-+seek.min||1),x=rect.left+5+ratio*(rect.width-10);progress.classList.toggle('handle-hover',Math.abs(e.clientX-x)<14);positionSeekTip();});
seek.addEventListener('pointerleave',()=>progress.classList.remove('handle-hover'));seek.addEventListener('input',positionSeekTip);seek.addEventListener('focus',positionSeekTip);
const previousUpdateSeek=updateSeek;updateSeek=function(){previousUpdateSeek();positionSeekTip();};positionSeekTip();
// Closing an import dialog from the existing importer also clears panel styling.
all('.glass-panel').forEach(panel=>panel.addEventListener('close',()=>{if(!q('.glass-panel[open]'))closePanels();}));
})();
