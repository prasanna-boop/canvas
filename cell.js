/* 2.1 The Cell (Grade 8) */
(function(){
"use strict";
const K=window.KIT, {THREE,rand,tween,ease,GY,esc}=K;
const C={wall:'#8BCF4A',membrane:'#FF7FA8',cyto:'#FFE9A8',nucleus:'#5867F0',chloro:'#1E9E5A',vacuole:'#7CC6FF',
  frame:'#4C5BD4',dark:'#2A2D3A',light:'#E8EBF2',knob:'#FFB020',silver:'#C7CCD8',lens4:'#FF5A5F',lens10:'#FFC531',lens40:'#3DA5FF',lamp:'#FFE27A'};
const INFO={
  wall:{name:'Cell wall',color:C.wall,what:'Tough, rigid outermost layer found only in plant cells. Made of cellulose.',does:'Resists stretching, gives mechanical support and a definite shape to the cell.'},
  membrane:{name:'Cell membrane',color:C.membrane,what:'Thin, flexible membrane enclosing the cell contents.',does:'Controls the selective movement of substances into and out of the cell.'},
  cytoplasm:{name:'Cytoplasm',color:C.cyto,what:'Jelly-like fluid inside the cell membrane.',does:'Site where chemical reactions take place.'},
  nucleus:{name:'Nucleus',color:C.nucleus,what:'Large round structure enclosed by a nuclear membrane.',does:'Controls all cell activities and stores genetic information passed from generation to generation.'},
  chloroplasts:{name:'Chloroplasts',color:C.chloro,what:'Structures containing the green pigment chlorophyll.',does:'Sites of photosynthesis: trap light energy to make food from carbon (IV) oxide and water.'},
  vacuole:{name:'Vacuole',color:C.vacuole,what:'Large, permanent central sac filled with cell sap (sugars and salts).',does:'Stores water, sugars and salts; helps keep the cell’s shape and gives support.'},
  eyepiece:{name:'Eyepiece lens',color:C.dark,what:'The lens you look through. Its power is marked on it, for example ×15.',does:'Magnifies the image. Total magnification = eyepiece × objective.'},
  objective:{name:'Objective lenses',color:C.lens10,what:'Three lenses: low power, medium power and high power.',does:'Low power gives a wide view to find features, medium a closer view, high power fine detail.'},
  stage:{name:'Stage',color:C.dark,what:'Flat platform where the slide is placed.',does:'Holds the slide in the path of the light.'},
  clips:{name:'Stage clips',color:C.silver,what:'Two clips on the stage.',does:'Secure the slide so it doesn’t move.'},
  slide:{name:'Slide and cover slip',color:C.vacuole,what:'Glass slide with a thin specimen, covered by a cover slip.',does:'The cover slip holds the specimen flat and protects the objective lens from moisture.'},
  light:{name:'Light source',color:C.lamp,what:'Lamp below the stage.',does:'Shines a beam of light up through the specimen.'}
};
const OBJ=[{mag:4,len:0.28,color:C.lens4},{mag:10,len:0.36,color:C.lens10},{mag:40,len:0.46,color:C.lens40}], EYE=[5,10,15];
const FEATURES={
  similar:{label:'Shared parts',plant:'Membrane, nucleus, cytoplasm',animal:'Membrane, nucleus, cytoplasm',parts:['plant.membrane','plant.cytoplasm','plant.nucleus','animal.membrane','animal.cytoplasm','animal.nucleus']},
  shape:{label:'Shape',plant:'Regular, fixed shape',animal:'Irregular, flexible shape',parts:['plant.wall','animal.membrane']},
  wall:{label:'Cell wall',plant:'Present (cellulose)',animal:'Absent',parts:['plant.wall']},
  chloro:{label:'Chloroplasts',plant:'Present',animal:'Absent',parts:['plant.chloroplasts']},
  vacuole:{label:'Vacuole',plant:'Large, permanent, central',animal:'Usually absent',parts:['plant.vacuole']},
  size:{label:'Size',plant:'Generally larger',animal:'Generally smaller',parts:['plant.wall','animal.membrane']},
  nucleus:{label:'Nucleus position',plant:'Towards the edge',animal:'Central',parts:['plant.nucleus','animal.nucleus']}
};

/* ---------- builders ---------- */
function kit(c){
  const mat=(color,o={},cut=false)=>{ const m=new THREE.MeshStandardMaterial(Object.assign({color,roughness:.5,metalness:0,envMapIntensity:0},o)); if(cut){ m.clippingPlanes=[c.clip]; m.clipShadows=true; m.side=THREE.DoubleSide; } return m; };
  const mesh=(geo,m,id,info)=>{ const x=new THREE.Mesh(geo,m); x.castShadow=true; x.receiveShadow=true; if(id) c.part(x,id,info); return x; };
  const info=(px,key,anchor,g,over)=>Object.assign({},INFO[key],{prefix:px,key,anchor:new THREE.Vector3(...anchor),group:g},over||{});
  return {mat,mesh,info};
}
function buildPlant(c,g,px){
  const {mat,mesh,info}=kit(c), RB=THREE.RoundedBoxGeometry, P=k=>px+'.'+k;
  g.add(mesh(new RB(3.3,1.95,1.95,6,0.38),mat(C.wall,{},true),P('wall'),info(px,'wall',[1.6,0.15,0.95],g)));
  g.add(mesh(new RB(3.06,1.72,1.72,6,0.3),mat(C.membrane,{},true),P('membrane'),info(px,'membrane',[1.38,0.15,0.62],g)));
  g.add(mesh(new RB(3.0,1.66,1.66,6,0.28),mat(C.cyto,{roughness:.7},true),P('cytoplasm'),info(px,'cytoplasm',[0.6,-0.3,0.7],g)));
  const v=mesh(new RB(1.95,1.12,1.12,6,0.45),mat(C.vacuole,{roughness:.42},true),P('vacuole'),info(px,'vacuole',[0.2,0.15,0],g)); v.position.x=0.2; g.add(v);
  const n=mesh(new THREE.SphereGeometry(0.32,48,32),mat(C.nucleus),P('nucleus'),info(px,'nucleus',[-1.12,0.38,0.12],g,{what:'Large round structure enclosed by a nuclear membrane. In a plant cell it sits towards the edge.'})); n.position.set(-1.12,0.02,0.12); g.add(n);
  const cm=mat(C.chloro,{roughness:.45},true), cg=new THREE.CapsuleGeometry(0.11,0.2,6,14), r=rand(7), spots=[];
  for(let i=0;i<40&&spots.length<26;i++){ const f=i%4, x=-1.2+r()*2.55; const p=[[x,-0.66,(r()-.5)*1.1],[x,0.66,(r()-.5)*1.1],[x,(r()-.5)*1.1,0.66],[x,(r()-.5)*1.1,-0.66]][f];
    const vv=new THREE.Vector3(...p); if(vv.distanceTo(n.position)<0.55||spots.some(s=>s.distanceTo(vv)<0.32)) continue; spots.push(vv); }
  [[-1.32,0.35,-0.3],[1.33,-0.2,0.25],[1.33,0.3,-0.2],[-1.32,-0.4,-0.1]].forEach(p=>spots.push(new THREE.Vector3(...p)));
  const chInfo=info(px,'chloroplasts',[0.9,-0.1,-0.66],g);
  spots.forEach(s=>{ const m=mesh(cg,cm,P('chloroplasts'),chInfo); m.position.copy(s); m.rotation.set(r()*3,r()*3,r()*3); m.scale.set(1,1,.62); g.add(m); });
}
function buildAnimal(c,g,px){
  const {mat,mesh,info}=kit(c), P=k=>px+'.'+k;
  const blob=s=>{ const geo=new THREE.SphereGeometry(1.3*s,120,80), p=geo.attributes.position, v=new THREE.Vector3();
    for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); const n=v.clone().normalize(); const d=1+0.09*Math.sin(3.1*n.x+1.3)*Math.sin(2.6*n.z+0.4)+0.06*Math.sin(4.7*n.y+2.2*n.x)+0.05*Math.cos(5.3*n.z-1.1); v.multiplyScalar(d); v.y*=0.72; v.x*=1.08; p.setXYZ(i,v.x,v.y,v.z); }
    geo.computeVertexNormals(); return geo; };
  g.add(mesh(blob(1),mat(C.membrane,{},true),P('membrane'),info(px,'membrane',[1.1,0.15,0.6],g,{what:'Thin, flexible membrane enclosing the cell. With no cell wall, the shape is irregular.'})));
  g.add(mesh(blob(0.955),mat(C.cyto,{roughness:.7},true),P('cytoplasm'),info(px,'cytoplasm',[0.55,-0.35,0.55],g)));
  g.add(mesh(new THREE.SphereGeometry(0.4,48,32),mat(C.nucleus),P('nucleus'),info(px,'nucleus',[0,0.45,0],g,{what:'Large round structure enclosed by a nuclear membrane. In an animal cell it sits near the centre.'})));
}
function buildScope(c,g){
  const {mat,mesh,info}=kit(c), RB=THREE.RoundedBoxGeometry, P=k=>'scope.'+k, I=(k,a)=>info('scope',k,a,g);
  const frameM=mat(C.frame);
  const base=mesh(new RB(1.6,0.28,1.9,4,0.12),frameM); base.position.set(0,0.14,0.1); g.add(base);
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0.2,-0.6),new THREE.Vector3(0,1.1,-0.66),new THREE.Vector3(0,2.1,-0.55),new THREE.Vector3(0,2.7,-0.28)]);
  g.add(mesh(new THREE.TubeGeometry(curve,48,0.16,24,false),frameM));
  const cap=mesh(new THREE.SphereGeometry(0.16,24,16),frameM); cap.position.set(0,2.7,-0.28); g.add(cap);
  const stM=mat(C.dark,{roughness:.4}), stI=I('stage',[0.72,1.32,0.6]);
  const st=mesh(new RB(1.5,0.1,1.3,4,0.05),stM,P('stage'),stI); st.position.set(0,1.25,0.15); g.add(st);
  const sa=mesh(new RB(0.32,0.12,0.5,3,0.04),stM,P('stage'),stI); sa.position.set(0,1.22,-0.42); g.add(sa);
  const hole=mesh(new THREE.CylinderGeometry(0.11,0.11,0.102,32),new THREE.MeshBasicMaterial({color:C.lamp})); hole.position.set(0,1.25,0.15); g.add(hole);
  const cM=mat(C.silver,{metalness:.35,roughness:.35}), cI=I('clips',[0.42,1.36,0.15]);
  [-0.42,0.42].forEach(x=>{ const k=mesh(new RB(0.32,0.035,0.09,2,0.015),cM,P('clips'),cI); k.position.set(x,1.33,0.15); g.add(k); });
  const sI=I('slide',[-0.2,1.35,0.3]);
  const s=mesh(new THREE.BoxGeometry(1.05,0.02,0.34),mat(C.vacuole,{transparent:true,opacity:.55,roughness:.15}),P('slide'),sI); s.position.set(0,1.31,0.15); s.castShadow=false; g.add(s);
  const sp=mesh(new THREE.BoxGeometry(0.22,0.006,0.22),mat('#B07CF0'),P('slide'),sI); sp.position.set(0,1.323,0.15); g.add(sp);
  const lI=I('light',[0,0.5,0.4]);
  const lamp=mesh(new THREE.CylinderGeometry(0.2,0.24,0.18,40),mat(C.dark),P('light'),lI); lamp.position.set(0,0.37,0.15); g.add(lamp);
  const glowM=mat(C.lamp,{emissive:new THREE.Color(C.lamp),emissiveIntensity:.35}); glowM.userData.glow=C.lamp;
  const glow=mesh(new THREE.CylinderGeometry(0.15,0.15,0.02,40),glowM,P('light'),lI); glow.position.set(0,0.47,0.15); g.add(glow);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.15,0.74,32,1,true),new THREE.MeshBasicMaterial({color:C.lamp,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide}));
  beam.position.set(0,0.85,0.15); beam.userData.noPick=true; g.add(beam);
  const kM=mat(C.knob,{flatShading:true});
  [-1,1].forEach(sx=>{ const k=mesh(new THREE.CylinderGeometry(0.26,0.26,0.1,18),kM); k.rotation.z=Math.PI/2; k.position.set(sx*0.22,1.62,-0.63); g.add(k);
    const f=mesh(new THREE.CylinderGeometry(0.14,0.14,0.08,14),kM); f.rotation.z=Math.PI/2; f.position.set(sx*0.31,1.62,-0.63); g.add(f); });
  const tM=mat(C.light);
  const tube=mesh(new THREE.CylinderGeometry(0.17,0.17,0.78,40),tM); tube.position.set(0,2.5,0.15); g.add(tube);
  const conn=mesh(new RB(0.3,0.42,0.38,3,0.08),tM); conn.position.set(0,2.55,-0.12); g.add(conn);
  const eM=mat(C.dark,{roughness:.35}), eI=I('eyepiece',[0,3.25,0.15]);
  const e1=mesh(new THREE.CylinderGeometry(0.13,0.13,0.3,40),eM,P('eyepiece'),eI); e1.position.set(0,3.04,0.15); g.add(e1);
  const e2=mesh(new THREE.CylinderGeometry(0.15,0.15,0.05,40),eM,P('eyepiece'),eI); e2.position.set(0,3.2,0.15); g.add(e2);
  const turret=new THREE.Group(); turret.position.set(0,2.06,-0.05); g.add(turret);
  turret.add(mesh(new THREE.CylinderGeometry(0.36,0.3,0.13,48),mat(C.dark,{roughness:.35})));
  const oM=mat(C.light), oI=I('objective',[0,1.7,0.42]);
  OBJ.forEach((o,i)=>{ const a=i*2*Math.PI/3, gg=new THREE.Group(); gg.position.set(Math.sin(a)*0.2,-0.065,Math.cos(a)*0.2); turret.add(gg);
    const b=mesh(new THREE.CylinderGeometry(0.075,0.06,o.len,32),oM,P('objective'),oI); b.position.y=-o.len/2; b.userData.lens=i; gg.add(b);
    const bd=mesh(new THREE.CylinderGeometry(0.079,0.079,0.045,32),mat(o.color),P('objective'),oI); bd.position.y=-o.len*0.38; bd.userData.lens=i; gg.add(bd); });
  return turret;
}
function drawLens(cv,mag){
  const ctx=cv.getContext('2d'), W=cv.width, H=cv.height, cw=0.42*mag*1.7, ch=cw*0.38, rr=rand(3);
  ctx.fillStyle='#FBF3DA'; ctx.fillRect(0,0,W,H); ctx.save(); ctx.translate(W/2,H/2);
  const rows=Math.ceil(H/ch)+4, cols=Math.ceil(W/cw)+4;
  for(let r=-(rows/2|0);r<=rows/2;r++){ const off=(r%2)*cw*0.5;
    for(let c=-(cols/2|0);c<=cols/2;c++){ const x=c*cw+off-cw/2, y=r*ch-ch/2;
      ctx.fillStyle=`hsl(${42+rr()*8} 80% ${86+rr()*5}%)`; ctx.fillRect(x,y,cw,ch); ctx.lineWidth=Math.max(1.2,cw*0.035); ctx.strokeStyle='#B98A3E'; ctx.strokeRect(x,y,cw,ch);
      ctx.fillStyle='#7A4B12'; ctx.beginPath(); ctx.ellipse(x+cw*(0.15+rr()*0.7),y+ch*(rr()<.5?0.28:0.72),Math.max(1.5,cw*0.06),Math.max(1.2,ch*0.13),0,0,Math.PI*2); ctx.fill(); } }
  ctx.restore();
  const g=ctx.createRadialGradient(W/2,H/2,W*0.3,W/2,H/2,W*0.52); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.45)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
}
const infoHtml=p=>p?`<div class="name"><span class="sw" style="background:${p.color}"></span>${esc(p.name)}</div><p><span class="k">What it is</span>${esc(p.what)}</p><p><span class="k">What it does</span>${esc(p.does)}</p>`:`<p class="empty">Click a part on the model to see what it does.</p>`;

/* ---------- visuals ---------- */
const visuals={
cells:{kind:'3d',label:'3D model: plant and animal cells',panel:true,w:1120,h:560,autoRotate:true,cam:[3.6,3.5,4.6],target:[0,-0.1,0],
 build(c){
  c.clip.constant=0.15;
  const gp=new THREE.Group(), ga=new THREE.Group(); c.group.add(gp,ga); buildPlant(c,gp,'plant'); buildAnimal(c,ga,'animal'); ga.visible=false;
  c.panel.innerHTML=`<div><div class="lbl">Cell</div><div class="seg" data-r="w"><button data-w="plant" aria-pressed="true">Plant</button><button data-w="animal" aria-pressed="false">Animal</button></div></div>
    <div><div class="lbl"><span style="color:inherit;font-weight:700">Look inside</span></div><input data-r="cut" type="range" min="0" max="1" step="0.01" value="1" aria-label="Look inside"></div>
    <div class="info"></div><div class="chips"></div>`;
  const P=s=>c.panel.querySelector(s), info=P('.info'), chips=P('.chips'), seg=P('[data-r=w]'); let cur='plant';
  const api={
    show(w){ cur=w; gp.visible=w==='plant'; ga.visible=w==='animal'; c.highlight([]);
      seg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.w===w));
      chips.innerHTML=Object.entries(INFO).slice(0,6).filter(([k])=>w==='plant'||['membrane','cytoplasm','nucleus'].includes(k)).map(([k,v])=>`<button class="chip" data-id="${w}.${k}"><i style="background:${v.color}"></i>${v.name}</button>`).join(''); },
    highlight(ids){ c.highlight(ids); },
    setCut(v){ const f=c.clip.constant, t=2.6-v*2.45; tween(800,k=>{ c.clip.constant=f+(t-f)*ease(k); }); },
    current:()=>cur
  };
  c.onSelect=id=>{ info.innerHTML=infoHtml(id&&this_parts(id)); chips.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x.dataset.id===id)); };
  const this_parts=id=>{ const k=id.split('.')[1]; return Object.assign({},INFO[k],k==='nucleus'?{what:id.startsWith('plant')?'Large round structure enclosed by a nuclear membrane. In a plant cell it sits towards the edge.':'Large round structure enclosed by a nuclear membrane. In an animal cell it sits near the centre.'}:{}); };
  seg.addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) api.show(b.dataset.w); });
  P('[data-r=cut]').addEventListener('input',e=>{ c.clip.constant=2.6-(+e.target.value)*2.45; });
  chips.addEventListener('click',e=>{ const b=e.target.closest('.chip'); if(b) c.highlight([b.dataset.id]); });
  api.show('plant'); info.innerHTML=infoHtml(null);
  return api;
 }},
compare:{kind:'3d',label:'3D model: side by side',panel:true,w:1180,h:540,cam:[0.4,4.3,7.9],target:[0,-0.3,0],
 build(c){
  c.clip.constant=0.15;
  const gp=new THREE.Group(), ga=new THREE.Group(); gp.position.x=-1.95; ga.position.x=2.0; c.group.add(gp,ga); buildPlant(c,gp,'plant'); buildAnimal(c,ga,'animal');
  c.panel.innerHTML=`<div><div class="lbl">Compare</div><div class="feat">${Object.entries(FEATURES).map(([k,f])=>`<button data-f="${k}" aria-pressed="false">${f.label}</button>`).join('')}</div></div>`;
  const feat=c.panel.querySelector('.feat');
  const api={ feature(k){ const f=FEATURES[k]; if(!f) return; c.highlight(f.parts,[{pos:[-1.95,1.35,0],text:'Plant: '+f.plant},{pos:[2.0,1.25,0],text:'Animal: '+f.animal}]); feat.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===k)); },
    highlight(ids){ c.highlight(ids); } };
  feat.addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) api.feature(b.dataset.f); });
  c.highlight([],[{pos:[-1.95,1.35,0],text:'Plant cell'},{pos:[2.0,1.25,0],text:'Animal cell'}]);
  return api;
 }},
scope:{kind:'3d',label:'3D model: light microscope',panel:true,w:1160,h:600,cam:[3.9,2.4,5.0],target:[0,0.35,0],
 build(c){
  const g=new THREE.Group(); g.position.y=GY; c.group.add(g); const turret=buildScope(c,g); const st={obj:0,eye:2};
  c.panel.innerHTML=`<div class="lens"><div class="lens-wrap"><canvas width="360" height="360" aria-label="View of onion cells through the microscope"></canvas></div><div class="calc"></div></div>
    <div><div class="lbl">Objective lens</div><div class="seg" data-r="obj">${OBJ.map((o,i)=>`<button data-i="${i}">×${o.mag}</button>`).join('')}</div></div>
    <div><div class="lbl">Eyepiece lens</div><div class="seg" data-r="eye">${EYE.map((m,i)=>`<button data-i="${i}">×${m}</button>`).join('')}</div></div><div class="info"></div>`;
  const P=s=>c.panel.querySelector(s), cv=P('canvas'), calc=P('.calc'), so=P('[data-r=obj]'), se=P('[data-r=eye]'), info=P('.info');
  const refresh=()=>{ so.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===st.obj)); se.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===st.eye));
    const t=EYE[st.eye]*OBJ[st.obj].mag; calc.innerHTML=`${EYE[st.eye]} × ${OBJ[st.obj].mag} = <b>×${t}</b>`; drawLens(cv,t); };
  const api={
    setObjective(i){ const from=turret.rotation.y; let to=-i*2*Math.PI/3; while(to-from>Math.PI) to-=2*Math.PI; while(from-to>Math.PI) to+=2*Math.PI; st.obj=i; tween(600,t=>{ turret.rotation.y=from+(to-from)*ease(t); }); refresh(); },
    setEyepiece(i){ st.eye=i; refresh(); }, highlight(ids){ c.highlight(ids); } };
  so.addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) api.setObjective(+b.dataset.i); });
  se.addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) api.setEyepiece(+b.dataset.i); });
  c.onSelect=id=>{ info.innerHTML=infoHtml(id&&INFO[id.split('.')[1]]); };
  c.onPick=o=>{ if(o&&o.userData.lens!==undefined) api.setObjective(o.userData.lens); return false; };
  refresh(); info.innerHTML=infoHtml(null);
  return api;
 }}
};

const hl=(vid,ids,extra)=>V=>{ extra&&extra(V[vid]); V[vid].highlight(ids); };

window.LESSONS.cell={
 id:'cell', title:'2.1 The Cell', grade:'Grade 8 · Living things and the environment', visuals,
 applyAction(a,V,sec){
  const t=a.target, scopeKeys=['eyepiece','objective','stage','clips','slide','light'];
  if(a.type==='highlight'){
    if(scopeKeys.includes(t)){ V.scope.highlight(['scope.'+t]); return 'scope'; }
    if(sec.id==='compare'){ V.compare.highlight(['plant.'+t,'animal.'+t]); return 'compare'; }
    const which=(['wall','chloroplasts','vacuole'].includes(t)||V.cells.current()==='plant')?'plant':'animal'; if(which!==V.cells.current()) V.cells.show(which); V.cells.highlight([`${which}.${t}`]); return 'cells';
  }
  if(a.type==='show'){ if(t==='microscope') return 'scope'; V.cells.show(t); return 'cells'; }
  if(a.type==='objective'){ V.scope.setObjective([4,10,40].indexOf(+t)); return 'scope'; }
  if(a.type==='eyepiece'){ V.scope.setEyepiece([5,10,15].indexOf(+t)); return 'scope'; }
  if(a.type==='compare'){ V.compare.feature(t); return 'compare'; }
 },
 sections:[
 {id:'cells', short:'Cells', title:'Plant and animal cells', visuals:['cells'],
  lesson:`<h2>Cells: the building blocks of life</h2>
    <p>Think of a brick wall. Its basic building block is a single brick. In the same way, all living things are made of basic units called <b>cells</b>.</p>
    <ul><li><b>Unicellular</b> organisms have one cell, like bacteria or amoeba.</li><li><b>Multicellular</b> organisms have many cells. Your body has trillions.</li></ul>
    <p>Cells are too small to see with the naked eye. A <b>light microscope</b> uses a beam of light to show them.</p>
    <p>Under a light microscope, a <b>plant cell</b> shows a cell wall, cell membrane, nucleus, cytoplasm, vacuole and chloroplasts. An <b>animal cell</b> shows a cell membrane, nucleus and cytoplasm.</p>`,
  steps:[
    {fly:'lesson', say:'Hi! I’m your tutor, and today we’re exploring the cell. You can drag the canvas to look around any time. Press Next when you’re ready.'},
    {fly:'lesson', say:'Think of a brick wall. Its building block is a single brick. In the same way, every living thing is built from cells.'},
    {fly:'lesson', say:'Some living things, like bacteria and amoeba, are just one cell. They’re unicellular. You’re multicellular: your body has trillions of cells.'},
    {fly:'cells', say:'Cells are too small to see with your eyes, so we use a light microscope. Here’s a plant cell, cut open so we can look inside. Drag it to turn it.', act:V=>{ V.cells.show('plant'); V.cells.setCut(1); }},
    {fly:'cells', say:'The tough outer layer is the cell wall. It’s made of cellulose and gives the plant cell a definite shape and support. Only plant cells have one.', act:hl('cells',['plant.wall'],v=>v.show('plant'))},
    {fly:'cells', say:'Just inside it is the cell membrane. It’s thin and flexible, and it controls which substances move into and out of the cell.', act:hl('cells',['plant.membrane'],v=>v.show('plant'))},
    {fly:'cells', say:'The jelly-like fluid filling the cell is the cytoplasm. This is where the cell’s chemical reactions happen.', act:hl('cells',['plant.cytoplasm'],v=>v.show('plant'))},
    {fly:'cells', say:'This round structure is the nucleus. It controls everything the cell does and stores genetic information. In a plant cell it sits towards the edge.', act:hl('cells',['plant.nucleus'],v=>v.show('plant'))},
    {fly:'cells', say:'These green structures are chloroplasts. They contain chlorophyll, which traps sunlight so the plant can make food by photosynthesis.', act:hl('cells',['plant.chloroplasts'],v=>v.show('plant'))},
    {fly:'cells', say:'And this big sac is the vacuole, full of cell sap. It stores water, sugars and salts and helps the cell keep its shape. Young plant cells have many small vacuoles; mature ones have one large vacuole.', act:hl('cells',['plant.vacuole'],v=>v.show('plant'))},
    {fly:'cells', say:'Now here’s an animal cell. Can you spot what’s missing?', act:V=>{ V.cells.show('animal'); }},
    {fly:'cells', say:'It only has a cell membrane, cytoplasm and a nucleus. With no cell wall, its shape is irregular.', act:hl('cells',['animal.membrane','animal.cytoplasm','animal.nucleus'],v=>v.show('animal'))},
    {fly:'cells', say:'Click any part to review it. When you’re ready, let’s see what you remember.', next:'Start the quiz'}
  ],
  questions:[
    {concept:'nucleus', prompt:'Which cell part contains genetic material and controls all the cell’s activities?', options:['Cytoplasm','Nucleus','Vacuole','Cell membrane'], answer:1, explain:'The nucleus is the control centre and stores genetic information.'},
    {concept:'membrane', prompt:'Which part controls what moves into and out of the cell?', options:['Cell wall','Chloroplast','Cell membrane','Cytoplasm'], answer:2, explain:'The cell membrane controls the selective movement of substances in and out.'},
    {concept:'chloro', prompt:'In green plants, which structures contain chlorophyll and carry out photosynthesis?', options:['Chloroplasts','Vacuoles','Nuclei','Cell walls'], answer:0, explain:'Chloroplasts contain chlorophyll, which traps light energy to make food.'},
    {concept:'wall', prompt:'The cell wall of a plant cell is made of…', options:['Chlorophyll','Cell sap','Cellulose','Cytoplasm'], answer:2, explain:'The cell wall is made of cellulose, which makes it tough and rigid.'}
  ],
  concepts:{
    nucleus:{title:'The nucleus', fly:'cells', say:'Let’s look at the nucleus again. It’s the cell’s control centre: it directs everything the cell does and stores the genetic information passed from parents to offspring.', act:hl('cells',['plant.nucleus'],v=>v.show('plant')),
      retry:{prompt:'A learner sees a large, round structure with its own membrane. It stores genetic information. What is it?', options:['Vacuole','Chloroplast','Nucleus'], answer:2, explain:'That’s the nucleus.'}},
    membrane:{title:'The cell membrane', fly:'cells', say:'Here’s the cell membrane. It’s thin and flexible, and it works like a gatekeeper, choosing which substances get in and out.', act:hl('cells',['plant.membrane'],v=>v.show('plant')),
      retry:{prompt:'Which part is thin and flexible, and selectively lets substances in and out?', options:['Cell membrane','Cell wall','Cytoplasm'], answer:0, explain:'The cell membrane is the selective gatekeeper.'}},
    chloro:{title:'Chloroplasts', fly:'cells', say:'These green chloroplasts hold chlorophyll. Chlorophyll traps light energy from the sun so the plant can make food from carbon (IV) oxide and water.', act:hl('cells',['plant.chloroplasts'],v=>v.show('plant')),
      retry:{prompt:'What does chlorophyll inside chloroplasts trap?', options:['Water','Light energy','Cell sap'], answer:1, explain:'Chlorophyll traps light energy for photosynthesis.'}},
    wall:{title:'The cell wall', fly:'cells', say:'The cell wall is the tough outer layer of plant cells. It’s made of cellulose, which gives the cell support and a fixed shape.', act:hl('cells',['plant.wall'],v=>v.show('plant')),
      retry:{prompt:'Which part gives a plant cell its definite shape and resists stretching?', options:['Vacuole','Cell wall','Nucleus'], answer:1, explain:'The rigid, cellulose cell wall does this.'}}
  }},
 {id:'compare', short:'Compare', title:'Comparing plant and animal cells', visuals:['compare'],
  lesson:`<h2>Plant vs animal cells</h2>
    <p><b>Both</b> have a cell membrane, a nucleus and cytoplasm.</p>
    <table class="cmp"><tr><th>Feature</th><th>Plant cell</th><th>Animal cell</th></tr>
    <tr><td>Shape</td><td>Regular, fixed</td><td>Irregular, flexible</td></tr><tr><td>Cell wall</td><td>Present (cellulose)</td><td>Absent</td></tr>
    <tr><td>Chloroplasts</td><td>Present</td><td>Absent</td></tr><tr><td>Vacuole</td><td>Large, permanent, central</td><td>Usually absent; small and temporary if present</td></tr>
    <tr><td>Size</td><td>Generally larger</td><td>Generally smaller</td></tr><tr><td>Nucleus</td><td>Towards the edge</td><td>Central</td></tr></table>`,
  steps:[
    {fly:'lesson', say:'Great work! Now let’s compare plant and animal cells. Here’s the summary table from your notes.'},
    {fly:'compare', say:'Here they are side by side. First, what they share: both have a cell membrane, a nucleus and cytoplasm.', act:V=>V.compare.feature('similar')},
    {fly:'compare', say:'Shape: the rigid cell wall gives plant cells a regular, fixed shape. Animal cells are irregular.', act:V=>V.compare.feature('shape')},
    {fly:'compare', say:'Cell wall: present in plant cells, absent in animal cells.', act:V=>V.compare.feature('wall')},
    {fly:'compare', say:'Chloroplasts: found in the green parts of plants, but never in animal cells.', act:V=>V.compare.feature('chloro')},
    {fly:'compare', say:'Vacuole: plant cells have a large, permanent central vacuole. Animal cells usually have none, and if they do, it’s small and temporary.', act:V=>V.compare.feature('vacuole')},
    {fly:'compare', say:'Size: plant cells are generally larger than animal cells.', act:V=>V.compare.feature('size')},
    {fly:'compare', say:'And the nucleus: towards the edge in a plant cell, near the centre in an animal cell.', act:V=>V.compare.feature('nucleus')},
    {fly:'compare', say:'Use the buttons to flip between features. Ready for some questions?', next:'Start the quiz'}
  ],
  questions:[
    {concept:'identify', prompt:'A learner in Nakuru sees a cell membrane, nucleus and cytoplasm, but no cell wall or chloroplasts. Which cell is it?', options:['Plant cell','Animal cell'], answer:1, explain:'No cell wall and no chloroplasts means it’s an animal cell.'},
    {concept:'similar', prompt:'Which three structures are found in BOTH plant and animal cells?', options:['Cell wall, nucleus, cytoplasm','Cell membrane, chloroplasts, vacuole','Cell membrane, nucleus, cytoplasm','Cell wall, vacuole, nucleus'], answer:2, explain:'Both have a cell membrane, a nucleus and cytoplasm.'},
    {concept:'nucpos', prompt:'Where is the nucleus usually found in a plant cell?', options:['In the centre','Towards the edge','Outside the cell wall'], answer:1, explain:'In plant cells, the nucleus sits towards the edge.'},
    {concept:'vacuole', prompt:'Which statement about vacuoles is correct?', options:['Animal cells have a large central vacuole','Plant cells have a large, permanent central vacuole','Neither cell has a vacuole'], answer:1, explain:'Plant cells have a large, permanent central vacuole.'}
  ],
  concepts:{
    identify:{title:'Telling the cells apart', fly:'compare', say:'The quickest clue is the cell wall and chloroplasts. If you see them, it’s a plant cell. If they’re missing, it’s an animal cell.', act:V=>V.compare.feature('wall'),
      retry:{prompt:'Another learner sees a cell wall, chloroplasts and a large vacuole. Which cell is it?', options:['Plant cell','Animal cell'], answer:0, explain:'Cell wall and chloroplasts mean a plant cell.'}},
    similar:{title:'What both cells share', fly:'compare', say:'Look at the highlighted parts. Both cells have a cell membrane, a nucleus and cytoplasm. Those are the three things they share.', act:V=>V.compare.feature('similar'),
      retry:{prompt:'Which structure is found in BOTH plant and animal cells?', options:['Cell wall','Nucleus','Chloroplast'], answer:1, explain:'The nucleus is in both.'}},
    nucpos:{title:'Where the nucleus sits', fly:'compare', say:'In a plant cell, the big vacuole pushes the nucleus towards the edge. In an animal cell, the nucleus sits near the centre.', act:V=>V.compare.feature('nucleus'),
      retry:{prompt:'Where is the nucleus usually found in an animal cell?', options:['Towards the edge','Near the centre'], answer:1, explain:'Animal cells have a central nucleus.'}},
    vacuole:{title:'Vacuoles', fly:'compare', say:'Plant cells have one large, permanent vacuole in the middle. Animal cells usually have none, or only small, temporary ones.', act:V=>V.compare.feature('vacuole'),
      retry:{prompt:'Which cell usually has a large, permanent central vacuole?', options:['Plant cell','Animal cell'], answer:0, explain:'That’s the plant cell.'}}
  }},
 {id:'mag', short:'Magnify', title:'Magnification', visuals:['scope'],
  lesson:`<h2>Magnification</h2>
    <p><b>Magnification</b> is how many times larger an image looks compared to the real object.</p>
    <ul><li><b>Low power</b> objective: wide view to find features.</li><li><b>Medium power</b>: closer view, moderate detail.</li><li><b>High power</b>: fine detail.</li></ul>
    <div class="formula">Total magnification = eyepiece lens × objective lens</div>
    <p>Example: an eyepiece of ×15 and an objective of ×10 give 15 × 10 = <b>×150</b>. The image is 150 times larger than the specimen.</p>`,
  steps:[
    {fly:'lesson', say:'Last section: magnification. It tells us how many times larger an image looks compared to the real object.'},
    {fly:'scope', say:'Here’s a light microscope. A beam of light shines up from below, through the specimen on the slide.', act:hl('scope',['scope.light','scope.slide'])},
    {fly:'scope', say:'The slide sits on the stage, held still by the stage clips.', act:hl('scope',['scope.stage','scope.clips'])},
    {fly:'scope', say:'There are three objective lenses. Low power gives a wide view, so you can find what you’re looking for. Look at the onion cells in the circle.', act:hl('scope',['scope.objective'],v=>v.setObjective(0))},
    {fly:'scope', say:'Medium power gives a closer view with more detail.', act:hl('scope',['scope.objective'],v=>v.setObjective(1))},
    {fly:'scope', say:'High power shows the finest detail.', act:hl('scope',['scope.objective'],v=>v.setObjective(2))},
    {fly:'scope', say:'You look through the eyepiece lens at the top. It magnifies too.', act:hl('scope',['scope.eyepiece'])},
    {fly:'scope', say:'So total magnification is eyepiece times objective. With a ×15 eyepiece and a ×10 objective, that’s 15 × 10 = ×150.', act:V=>{ V.scope.setEyepiece(2); V.scope.setObjective(1); V.scope.highlight(['scope.eyepiece','scope.objective']); }},
    {fly:'scope', say:'Try switching lenses and watch the numbers change. Then let’s practise.', next:'Start the quiz'}
  ],
  questions:[
    {concept:'lenses', prompt:'Which objective lens gives a wide field of view for locating features?', options:['Low power','Medium power','High power'], answer:0, explain:'Low power gives the widest view.'},
    {concept:'formula', type:'number', prefix:'×', prompt:'An eyepiece of ×15 is used with a ×40 objective lens. What is the total magnification?', answer:600, explain:'15 × 40 = ×600.'},
    {concept:'reverse', type:'number', prefix:'×', prompt:'The total magnification is ×400 and the objective lens is ×40. What is the eyepiece magnification?', answer:10, explain:'400 ÷ 40 = 10, so the eyepiece is ×10.'},
    {concept:'reverse', type:'number', prefix:'×', prompt:'Cheek cells are viewed with a ×12 eyepiece. The total magnification is ×480. What is the objective lens magnification?', answer:40, explain:'480 ÷ 12 = 40, so the objective is ×40.'}
  ],
  concepts:{
    lenses:{title:'The three objective lenses', fly:'scope', say:'Watch the circle as I switch lenses. Low power shows a wide area. Medium power is closer. High power shows the finest detail.', act:V=>{ V.scope.highlight(['scope.objective']); V.scope.setObjective(0); setTimeout(()=>V.scope.setObjective(2),1600); },
      retry:{prompt:'Which objective lens shows the finest detail?', options:['Low power','High power'], answer:1, explain:'High power shows fine detail.'}},
    formula:{title:'Total magnification', fly:'scope', say:'Multiply the two lenses: eyepiece times objective. Here, 15 × 40 gives ×600.', act:V=>{ V.scope.setEyepiece(2); V.scope.setObjective(2); V.scope.highlight(['scope.eyepiece','scope.objective']); },
      retry:{type:'number', prefix:'×', prompt:'Eyepiece ×10, objective ×10. What is the total magnification?', answer:100, explain:'10 × 10 = ×100.'}},
    reverse:{title:'Working backwards', fly:'scope', say:'If you know the total and one lens, divide. Total ÷ objective gives the eyepiece. Total ÷ eyepiece gives the objective.', act:V=>{ V.scope.setEyepiece(1); V.scope.setObjective(2); V.scope.highlight(['scope.eyepiece','scope.objective']); },
      retry:{type:'number', prefix:'×', prompt:'Total magnification is ×150 and the eyepiece is ×15. What is the objective lens?', answer:10, explain:'150 ÷ 15 = 10, so the objective is ×10.'}}
  }}
 ]
};
})();
