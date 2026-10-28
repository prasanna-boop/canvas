/* Shared toolkit used by the engine and every lesson file. */
(function(){
"use strict";
const THREE = window.THREE;
THREE.ColorManagement.legacyMode = false;
const K = { THREE, GY: -1.2 };
window.LESSONS = window.LESSONS || {};

K.esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
K.ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
K.clamp = (v,a,b) => Math.max(a, Math.min(b, v));
K.lerp = (a,b,t) => a+(b-a)*t;
K.rand = seed => function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
K.gauss = () => (Math.random()+Math.random()+Math.random()-1.5)*1.4;

/* tweens are stepped by the engine's animation loop */
K.tweens = [];
K.tween = (dur, fn, done) => { const tw={t0:performance.now(), dur:Math.max(1,dur), fn, done}; K.tweens.push(tw); return tw; };
K.stepTweens = now => { for(let i=K.tweens.length-1;i>=0;i--){ const tw=K.tweens[i]; if(tw.dead){ K.tweens.splice(i,1); continue; } const t=Math.min(1,(now-tw.t0)/tw.dur); tw.fn(t); if(t>=1){ K.tweens.splice(i,1); tw.done&&tw.done(); } } };

/* ---------- 3D materials and shapes ---------- */
K.clay = (color, o={}) => new THREE.MeshStandardMaterial(Object.assign({color, roughness:.5, metalness:0, envMapIntensity:0}, o));
K.metal = (color, rough=.3) => new THREE.MeshStandardMaterial({color, metalness:1, roughness:rough, envMapIntensity:1.1});
K.glassMat = () => new THREE.MeshStandardMaterial({color:'#DCEBFF', transparent:true, opacity:.2, roughness:.08, depthWrite:false, side:THREE.DoubleSide, envMapIntensity:0});
K.liquidMat = (c, o) => new THREE.MeshStandardMaterial({color:c, transparent:true, opacity:o, roughness:.15, depthWrite:false, envMapIntensity:0});
K.M = (geo, mat, shadow=true) => { const m=new THREE.Mesh(geo, mat); m.castShadow=shadow; m.receiveShadow=true; return m; };
K.arrow = (a, b, color='#FF5F00', r=0.04) => {
  const g=new THREE.Group(), A=new THREE.Vector3(...a), B=new THREE.Vector3(...b), d=B.clone().sub(A), L=d.length(), mt=K.clay(color,{roughness:.4}), head=Math.min(0.3, L*0.35);
  const sh=K.M(new THREE.CylinderGeometry(r,r,L-head,16), mt); sh.position.y=(L-head)/2; g.add(sh);
  const cn=K.M(new THREE.ConeGeometry(r*3.2,head,20), mt); cn.position.y=L-head/2; g.add(cn);
  g.position.copy(A); g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), d.normalize()); return g;
};
K.beaker = (r, h) => {
  const g=new THREE.Group(), gm=K.glassMat();
  const wall=K.M(new THREE.CylinderGeometry(r,r*0.97,h,56,1,true), gm, false); wall.position.y=h/2; wall.renderOrder=3; g.add(wall);
  const base=K.M(new THREE.CylinderGeometry(r*0.97,r*0.97,0.05,56), gm, false); base.position.y=0.025; base.renderOrder=3; g.add(base);
  const lip=K.M(new THREE.TorusGeometry(r,0.025,10,64), K.glassMat(), false); lip.rotation.x=Math.PI/2; lip.position.y=h; g.add(lip);
  return g;
};
K.poreTexture = () => {
  const c=document.createElement('canvas'); c.width=c.height=128; const x=c.getContext('2d');
  x.fillStyle='#FFC2D6'; x.fillRect(0,0,128,128); x.fillStyle='#E0447A';
  for(let i=12;i<128;i+=26) for(let j=12;j<128;j+=26){ x.beginPath(); x.arc(i,j,4.5,0,6.3); x.fill(); }
  const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(2,2); return t;
};

/* ---------- flat picture (SVG) helpers ---------- */
K.INK='#1A1D29'; K.MUTED='#5A6072'; K.OR='#FF5F00';
K.pill = (x, y, text, kind='dark') => {
  const w=text.length*10.6+30, bg=kind==='orange'?K.OR:kind==='light'?'#FFFFFF':K.INK, fg=kind==='light'?K.INK:'#FFFFFF';
  return `<g><rect x="${x-w/2}" y="${y-19}" width="${w}" height="38" rx="12" fill="${bg}" ${kind==='light'?'stroke="#DDE2EC" stroke-width="2"':''}/><text x="${x}" y="${y+6}" text-anchor="middle" font-size="19" font-weight="700" fill="${fg}">${K.esc(text)}</text></g>`;
};
K.lead = (x1,y1,x2,y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${K.INK}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="2 6"/><circle cx="${x2}" cy="${y2}" r="5" fill="${K.INK}"/>`;
K.svg = (body, vb='0 0 800 480') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" font-family="Outfit, system-ui, sans-serif" role="img" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
K.wavePath = (x0,x1,yc,A,lam,phase=0) => { let d=''; for(let x=x0;x<=x1;x+=3){ const y=yc-A*Math.sin(2*Math.PI*(x-x0)/lam+phase); d+=(d?'L':'M')+x.toFixed(1)+' '+y.toFixed(1); } return d; };
K.testTube = (x,top,bot,w,liq,liqTop) => { const r=w/2;
  return `<path d="M${x-r} ${liqTop} V${bot-r} a${r} ${r} 0 0 0 ${w} 0 V${liqTop} Z" fill="${liq}"/>
  <path d="M${x-r} ${top} V${bot-r} a${r} ${r} 0 0 0 ${w} 0 V${top}" fill="none" stroke="#9FB0C6" stroke-width="5" stroke-linecap="round"/>`; };
K.beakerSvg = (x,y,w,h,liq,level) => `<rect x="${x+4}" y="${y+h-level}" width="${w-8}" height="${level-4}" rx="14" fill="${liq}"/>
  <path d="M${x} ${y} V${y+h-18} q0 18 18 18 H${x+w-18} q18 0 18 -18 V${y}" fill="none" stroke="#9FB0C6" stroke-width="5" stroke-linecap="round"/>`;
K.dot = (x,y,r,c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="rgba(0,0,0,.15)" stroke-width="2"/>`;

window.KIT = K;
})();
