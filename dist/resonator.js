// Note light on smoked glass. This canvas never owns the playback clock.
(()=>{
const canvas=document.querySelector('#resonator');let previous=0,trails=[];const seen=new Map();
document.querySelector('#resetCamera').onclick=()=>{trails=[];seen.clear();};
window.drawResonator=(now,analyser,down,base)=>{
 const r=canvas.getBoundingClientRect(),w=r.width,h=r.height;if(!w||!h)return;
 const d=Math.min(window.devicePixelRatio||1,2);if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);}
 const c=canvas.getContext('2d');if(!c)return;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);
 const dt=Math.min(.05,(now-previous)/1000||0);previous=now;
 const isBlack=n=>[1,3,6,8,10].includes(n%12);let white=0;const positions=new Map();
 for(let n=base;n<base+61;n++){const b=isBlack(n),x=b?(white-.32)*w/36:white*w/36;positions.set(n,{x,width:w/36*(b?.6:1)});if(!b){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.strokeStyle='#ecd4a711';c.stroke();white++;}}
 const notes=new Set(down);if(typeof voices!=='undefined')voices.forEach(v=>{if(v.n!==undefined&&!v.released)notes.add(v.n)});
 notes.forEach(n=>{if(!seen.has(n)){const t={n,y:h-30,len:14,held:true};trails.push(t);seen.set(n,t)}});
 seen.forEach((t,n)=>{if(!notes.has(n)){t.held=false;seen.delete(n)}});
 trails.forEach(t=>{if(t.held)t.len=Math.min(h*.7,t.len+dt*62);else t.y-=dt*62;const p=positions.get(t.n);if(!p)return;c.fillStyle='#efd1a0';c.shadowColor='#e5b773';c.shadowBlur=12;c.beginPath();if(c.roundRect)c.roundRect(p.x+p.width*.3,t.y-t.len,p.width*.4,t.len,4);else c.rect(p.x+p.width*.3,t.y-t.len,p.width*.4,t.len);c.fill();});trails=trails.filter(t=>t.y>0);c.shadowBlur=0;
 c.strokeStyle='#dbc19855';c.beginPath();c.moveTo(0,h-1);c.lineTo(w,h-1);c.stroke();
};
})();
