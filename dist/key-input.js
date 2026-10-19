// Route physical input using the visible keys' screen coordinates. The input
// path is independent of CSS 3D stacking and any transparent overlay above it.
(()=>{
const pointers=new Map();
function keyAt(x,y){
 if(!Number.isFinite(x)||!Number.isFinite(y))return null;
 const keys=[...document.querySelectorAll('#keyboard .key')];
 // Raised black keys take priority over the white key underneath.
 for(const blackKeys of [true,false])for(const key of keys){
  if(key.classList.contains('black')!==blackKeys)continue;
  const r=key.getBoundingClientRect();
  if(r.width>0&&r.height>0&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)return key;
 }
 return null;
}
function isControl(e){return !!e.target?.closest?.('.control-rail,.glass-panel,.glass-bar,.room-tools,#sequenceView');}
function release(id){const source=pointers.get(id);if(source){noteOff(source);pointers.delete(id);}}
document.addEventListener('pointerdown',e=>{
 if(isControl(e)||e.button!==undefined&&e.button!==0)return;
 const key=keyAt(e.clientX,e.clientY);if(!key)return;
 e.preventDefault();e.stopImmediatePropagation();
 const id=e.pointerId??0,source='screen:'+id;
 release(id);
 try{noteOn(Number(key.dataset.note),source);pointers.set(id,source);}
 catch(error){console.error('Piano input failed',error);toast('Unable to start sound: '+error.message);}
},true);
for(const type of ['pointerup','pointercancel'])document.addEventListener(type,e=>{
 if(!pointers.has(e.pointerId??0))return;
 release(e.pointerId??0);e.preventDefault();e.stopImmediatePropagation();
},true);
// Avoid a second synthesized note from the compatibility click after release.
document.addEventListener('click',e=>{
 if(!isControl(e)&&e.detail>0&&keyAt(e.clientX,e.clientY)){e.preventDefault();e.stopImmediatePropagation();}
},true);
window.addEventListener('blur',()=>{for(const id of [...pointers.keys()])release(id);});
})();
