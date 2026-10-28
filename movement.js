/* 2.2 Movement of materials in and out of the cell (Grade 8) */
(function(){
"use strict";
const K=window.KIT, {THREE,M,clay,glassMat,liquidMat,arrow,beaker,poreTexture,gauss,tween,lerp,ease,clamp,GY,pill,lead,svg,testTube,beakerSvg,INK,MUTED,OR}=K;

const visuals={
/* ---------- 3D: diffusion ---------- */
diffusion:{kind:'3d',label:'3D model: diffusion',cam:[2.6,2.4,4.6],target:[0,-0.15,0],
 steps:['This is a beaker of plain water.','We add one drop of purple dye. All of its tiny particles start crowded in one spot.','Watch the particles spread out to where there are fewer of them. This spreading is called diffusion.'],
 build(c){
  const g=c.group,R=1.1,H=2.2; const bk=beaker(R,H); bk.position.y=GY; g.add(bk);
  const w=M(new THREE.CylinderGeometry(R-0.05,R*0.97-0.05,H*0.78,56),liquidMat('#BFDFFF',.35),false); w.position.y=GY+0.06+H*0.39; w.renderOrder=2; g.add(w);
  const N=70, inst=new THREE.InstancedMesh(new THREE.SphereGeometry(0.075,16,12),clay('#8E2DE2',{roughness:.35}),N); inst.castShadow=true; g.add(inst);
  const P=[], top=GY+0.06+H*0.78-0.1, bot=GY+0.15, RR=R-0.16, m4=new THREE.Matrix4(); let run=false;
  function reset(){ P.length=0; for(let i=0;i<N;i++){ const a=Math.random()*6.283, r=Math.sqrt(Math.random())*0.16; P.push(new THREE.Vector3(Math.cos(a)*r,top-Math.random()*0.22,Math.sin(a)*r)); } }
  reset();
  const tg=c.tag('Crowded here','accent',()=>new THREE.Vector3(0,top+0.3,0));
  return { step(i){ inst.visible=i>0; tg.show=i===1; reset(); run=i>=2; },
    update(dt){ if(run){ const s=Math.sqrt(dt)*0.33; for(const p of P){ p.x+=gauss()*s; p.y+=gauss()*s*0.8; p.z+=gauss()*s; const rr=Math.hypot(p.x,p.z); if(rr>RR){p.x*=RR/rr;p.z*=RR/rr;} p.y=clamp(p.y,bot,top); } }
      P.forEach((p,i)=>{ m4.makeTranslation(p.x,p.y,p.z); inst.setMatrixAt(i,m4); }); inst.instanceMatrix.needsUpdate=true; } };
 }},

/* ---------- picture: potato in iodine ---------- */
potato:{kind:'pic',label:'Picture: potato in iodine',
 steps:['A cube of potato is placed in brown iodine solution for about 15 minutes.','Cut the cube open. The outside has turned blue-black because iodine moved in. The middle is still pale because the iodine hasn’t reached it yet.'],
 pics:[
  ()=>svg(`${beakerSvg(260,90,280,320,'#C98A3E',230)}
    <g transform="translate(345 250)"><path d="M0 30 L30 0 H140 L110 30 Z" fill="#FFF3CF"/><path d="M110 30 L140 0 V110 L110 140 Z" fill="#D9C38A"/><rect x="0" y="30" width="110" height="110" fill="#F2E2B0"/></g>
    ${lead(590,200,525,240)}${pill(665,200,'Iodine solution')}${lead(200,330,345,330)}${pill(150,330,'Potato cube','light')}`),
  ()=>svg(`<rect x="170" y="130" width="200" height="200" rx="18" fill="#23234A"/><rect x="204" y="164" width="132" height="132" rx="10" fill="#F2E2B0"/>
    <rect x="430" y="130" width="200" height="200" rx="18" fill="#23234A"/><rect x="464" y="164" width="132" height="132" rx="10" fill="#F2E2B0"/>
    <text x="400" y="380" text-anchor="middle" font-size="18" font-weight="600" fill="${MUTED}">The two halves of the cut cube</text>
    ${lead(270,80,270,150)}${pill(270,70,'Blue-black outside','dark')}${lead(530,80,530,230)}${pill(530,70,'Pale middle','orange')}`)
 ]},

/* ---------- 3D: osmosis ---------- */
osmosis:{kind:'3d',label:'3D model: osmosis',cam:[0.3,1.9,6.4],target:[0,-0.3,0],
 steps:['A thin sheet with tiny holes separates two liquids. On the left is plain water. On the right is sugary water.','Small water particles (blue) can slip through the holes. Big sugar particles (orange) are too large to get through.','Over time, more water moves into the sugary side, so its level rises. This movement of water through the sheet is called osmosis.'],
 build(c){
  const g=c.group, BX=1.9, BZ=0.65, base=GY+0.12, H0=1.0;
  const box=M(new THREE.BoxGeometry(4,2.0,1.4),glassMat(),false); box.position.y=GY+1.0; box.renderOrder=3; g.add(box);
  const mem=M(new THREE.BoxGeometry(0.05,1.96,1.36),new THREE.MeshStandardMaterial({map:poreTexture(),roughness:.7,envMapIntensity:0}),false); mem.position.y=GY+1.0; g.add(mem);
  const volL=M(new THREE.BoxGeometry(1.93,1,1.34),liquidMat('#BFDFFF',.38),false), volR=M(new THREE.BoxGeometry(1.93,1,1.34),liquidMat('#F7DFA0',.42),false);
  volL.renderOrder=volR.renderOrder=2; g.add(volL,volR);
  const lv={L:1,R:1};
  const setVol=()=>{ [[volL,-0.98,lv.L],[volR,0.98,lv.R]].forEach(([m,x,l])=>{ m.scale.y=H0*l; m.position.set(x,base+H0*l/2,0); }); };
  const wm=clay('#3D9BFF',{roughness:.35}), sm=clay('#FFB020',{roughness:.4}), W=[], S=[];
  function mk(side,mat,r,speed,arr){ const m=M(new THREE.SphereGeometry(r,18,14),mat); g.add(m); arr.push({m,r,speed,p:new THREE.Vector3(side*(0.2+Math.random()*1.5),Math.random()*0.7,(Math.random()*2-1)*(BZ-r)),v:new THREE.Vector3(gauss(),gauss(),gauss()).setLength(speed)}); }
  let run=false, bias=false, lvTween=null;
  function reset(){ [...W,...S].forEach(q=>g.remove(q.m)); W.length=S.length=0; for(let i=0;i<22;i++) mk(-1,wm,0.08,0.55,W); for(let i=0;i<10;i++) mk(1,wm,0.08,0.55,W); for(let i=0;i<6;i++) mk(1,sm,0.17,0.25,S); lv.L=lv.R=1; setVol(); }
  reset();
  const tMem=c.tag('Thin sheet with tiny holes','accent',()=>new THREE.Vector3(0,GY+2.2,0));
  const tL=c.tag('Plain water','light',()=>new THREE.Vector3(-1,GY+0.02,0.7)), tR=c.tag('Sugary water','light',()=>new THREE.Vector3(1,GY+0.02,0.7)); tL.below=tR.below=true;
  const arr=arrow([-0.55,GY+2.35,0.75],[0.6,GY+2.35,0.75]); g.add(arr);
  const tA=c.tag('Water moves this way','accent',()=>new THREE.Vector3(0,GY+2.5,0.75));
  function stepP(q,dt,blocked){
    q.v.x+=gauss()*dt*q.speed*2; q.v.y+=gauss()*dt*q.speed*2; q.v.z+=gauss()*dt*q.speed*2; q.v.setLength(q.speed);
    const ox=q.p.x; q.p.addScaledVector(q.v,dt);
    const lx=BX-q.r; if(q.p.x>lx){q.p.x=lx;q.v.x*=-1;} if(q.p.x<-lx){q.p.x=-lx;q.v.x*=-1;}
    if(Math.abs(q.p.z)>BZ-q.r){q.p.z=Math.sign(q.p.z)*(BZ-q.r);q.v.z*=-1;}
    const top=H0*(q.p.x<0?lv.L:lv.R)-q.r-0.02; if(q.p.y>top){q.p.y=top;q.v.y=-Math.abs(q.v.y);} if(q.p.y<q.r){q.p.y=q.r;q.v.y=Math.abs(q.v.y);}
    const lim=q.r+0.03, cross=(ox<0&&q.p.x>-lim)||(ox>0&&q.p.x<lim);
    if(cross&&(blocked||(bias&&ox>0&&Math.random()<0.75))){ if(ox<0){ q.p.x=-lim; q.v.x=-Math.abs(q.v.x);} else { q.p.x=lim; q.v.x=Math.abs(q.v.x);} }
  }
  return {
    step(i){ tMem.show=i===0; arr.visible=tA.show=i===2; run=i>0; bias=i===2; if(lvTween) lvTween.dead=true;
      if(i<2){ lv.L=lv.R=1; setVol(); }
      if(i===2){ const f={...lv}; lvTween=tween(7000,t=>{ lv.L=lerp(f.L,0.74,t); lv.R=lerp(f.R,1.26,t); setVol(); }); } },
    update(dt){ const d=Math.min(dt,0.05); if(run){ W.forEach(q=>stepP(q,d,false)); S.forEach(q=>stepP(q,d,true)); } [...W,...S].forEach(q=>q.m.position.set(q.p.x,base+q.p.y,q.p.z)); }
  };
 }},

/* ---------- picture: potato strips ---------- */
strips:{kind:'pic',label:'Picture: potato strips',
 steps:['Two potato strips, both 50 mm long, go into two test tubes. One has plain water. The other has sugary water.','After one hour, the strip in plain water took in water and grew to 53 mm. It feels firm. The strip in sugary water lost water and shrank to 47 mm. It feels soft.'],
 pics:[0,1].map(st=>()=>{ const L=st?[191,169]:[180,180], lab=st?['53 mm · firm','47 mm · soft']:['50 mm','50 mm'];
  return svg(`${testTube(300,70,420,96,'#CFE8FF',130)}${testTube(500,70,420,96,'#F7DFA0',130)}
   <rect x="284" y="${404-L[0]}" width="32" height="${L[0]}" rx="9" fill="${st?'#FFEFC0':'#F2E2B0'}" stroke="#C9B37A" stroke-width="3"/>
   <rect x="484" y="${404-L[1]}" width="32" height="${L[1]}" rx="9" fill="${st?'#D9C48F':'#F2E2B0'}" stroke="#C9B37A" stroke-width="3"/>
   ${pill(300,455,'Plain water','light')}${pill(500,455,'Sugary water','light')}
   ${lead(190,404-L[0]/2,282,404-L[0]/2)}${pill(130,404-L[0]/2,lab[0],st?'orange':'dark')}
   ${lead(610,404-L[1]/2,518,404-L[1]/2)}${pill(st?690:665,404-L[1]/2,lab[1],st?'orange':'dark')}`,'0 0 800 490'); })},

/* ---------- picture: visking tubing ---------- */
visking:{kind:'pic',label:'Picture: Visking tubing',
 steps:['Visking tubing is like a bag with tiny holes. Bag A holds sugary water and sits in plain water. Bag B holds plain water and sits in sugary water.','Water moves towards the sugary side. Bag A takes in water and swells. Bag B loses water and shrinks.'],
 pics:[0,1].map(st=>()=>{ const wA=st?100:66, wB=st?40:66, lA=st?205:220, lB=st?235:220;
  return svg(`<line x1="150" y1="88" x2="370" y2="88" stroke="#9FB0C6" stroke-width="7" stroke-linecap="round"/><line x1="430" y1="88" x2="650" y2="88" stroke="#9FB0C6" stroke-width="7" stroke-linecap="round"/>
   ${beakerSvg(160,110,200,300,'#CFE8FF',lA)}${beakerSvg(440,110,200,300,'#F7DFA0',lB)}
   <line x1="260" y1="88" x2="260" y2="180" stroke="#8A7F6A" stroke-width="3"/><line x1="540" y1="88" x2="540" y2="180" stroke="#8A7F6A" stroke-width="3"/>
   <rect x="${260-wA/2}" y="180" width="${wA}" height="170" rx="${wA/2}" fill="#F2B85B" stroke="#C98A2B" stroke-width="3"/>
   <rect x="${540-wB/2}" y="${st?190:180}" width="${wB}" height="${st?150:170}" rx="${wB/2}" fill="#8CC6FF" stroke="#4E8FD6" stroke-width="3"/>
   ${pill(260,40,'A: sugary inside','light')}${pill(540,40,'B: plain water inside','light')}
   ${st?pill(260,450,'Swells','orange')+pill(540,450,'Shrinks','orange'):''}`,'0 0 800 480'); })},

/* ---------- 3D: firm and soft cell ---------- */
cell:{kind:'3d',label:'3D model: a plant cell',cam:[3.4,3.4,4.6],target:[0,-0.15,0],
 steps:['This plant cell is full of water. It is swollen and firm, pushing on its wall. We call this turgid.','When the cell loses water, it shrinks and goes soft. We call this flaccid.','When it gets water again, it swells back. This is what keeps plants standing up straight.'],
 build(c){
  const g=c.group, RB=THREE.RoundedBoxGeometry, clip=new THREE.Plane(new THREE.Vector3(0,-1,0),0.15);
  const cut=(col,o={})=>clay(col,Object.assign({clippingPlanes:[clip],clipShadows:true,side:THREE.DoubleSide},o));
  g.add(M(new RB(3.3,1.95,1.95,6,0.38),cut('#8BCF4A')));
  const inner=new THREE.Group(); g.add(inner);
  inner.add(M(new RB(3.06,1.72,1.72,6,0.3),cut('#FF7FA8'))); inner.add(M(new RB(3.0,1.66,1.66,6,0.28),cut('#FFE9A8',{roughness:.7})));
  const vac=M(new RB(1.95,1.12,1.12,6,0.45),cut('#7CC6FF',{roughness:.42})); vac.position.x=0.2; inner.add(vac);
  const nuc=M(new THREE.SphereGeometry(0.32,40,28),clay('#5867F0')); nuc.position.set(-1.12,0.02,0.12); inner.add(nuc);
  let s=1, tw=null; const ts=c.tag('','accent',()=>new THREE.Vector3(0.2,0.9,0));
  const apply=()=>{ inner.scale.set(0.92+0.08*s,0.88+0.12*s,0.88+0.12*s); vac.scale.set(0.5+0.5*s,0.55+0.45*s,0.55+0.45*s); ts.el.textContent=s>0.5?'Firm: turgid':'Soft: flaccid'; };
  apply();
  const go=to=>{ if(tw) tw.dead=true; const f=s; tw=tween(1600,t=>{ s=lerp(f,to,ease(t)); apply(); }); };
  return { step(i){ if(tw) tw.dead=true; if(i===0){ s=1; apply(); } if(i===1){ s=1; apply(); go(0); } if(i===2){ s=0; apply(); go(1); } } };
 }},

/* ---------- picture: guard cells ---------- */
guard:{kind:'pic',label:'Picture: guard cells',
 steps:['Leaves have tiny holes called stomata. Two guard cells sit around each hole. When they are full of water, they bend apart and the hole opens.','When the guard cells lose water, they go soft and straighten, and the hole closes.'],
 pics:[()=>guardSvg(true),()=>guardSvg(false)]}
};

function guardSvg(open){
  const g=open?52:6, cx=400;
  const cell=s=>{ const ox=cx+s*g, out=cx+s*(g+110);
    return `<path d="M${cx} 92 C${out} 100 ${out} 380 ${cx} 388 C${ox} 330 ${ox} 150 ${cx} 92 Z" fill="#7ED36A" stroke="#3E8F35" stroke-width="4"/>
      ${[150,205,260,315].map((y,i)=>`<ellipse cx="${cx+s*(g+40+(i%2)*14)}" cy="${y+12}" rx="11" ry="8" fill="#1E9E5A"/>`).join('')}`; };
  const bg=Array.from({length:4},(_,r)=>Array.from({length:5},(_,k)=>`<rect x="${k*170-(r%2)*85+10}" y="${r*120+12}" width="150" height="100" rx="28" fill="#E5F6D8" stroke="#C3E6AA" stroke-width="3"/>`).join('')).join('');
  return svg(`${bg}<path d="M${cx} 92 C${cx-g} 150 ${cx-g} 330 ${cx} 388 C${cx+g} 330 ${cx+g} 150 ${cx} 92 Z" fill="#2A2D3A"/>${cell(-1)}${cell(1)}
    ${lead(180,150,320,200)}${pill(140,140,'Guard cell','light')}${lead(620,330,cx+4,280)}${pill(650,345,open?'Hole open':'Hole closed','orange')}`);
}

const q=(concept,prompt,options,answer,explain)=>({concept,prompt,options,answer,explain});

window.LESSONS.movement={
 id:'movement', title:'2.2 Movement of materials', grade:'Grade 8 · Living things and the environment', visuals,
 sections:[
 {id:'diff', short:'Diffusion', title:'Diffusion', visuals:['diffusion','potato'],
  lesson:`<h2>Moving in and out of cells</h2>
   <p>Every cell needs things like <b>water, oxygen and food</b>. It also has to get rid of <b>waste</b>, like carbon (IV) oxide.</p>
   <p>These materials move through the cell membrane in two main ways: <b>diffusion</b> and <b>osmosis</b>.</p>
   <p><b>Diffusion</b> is when particles spread from a place where they are crowded (high concentration) to a place where there are fewer (low concentration).</p>
   <p>It happens in liquids and in gases.</p>`,
  intro:'Every cell needs water, oxygen and food, and it must get rid of waste. Let’s see how these materials move. First up: diffusion.',
  outro:'Diffusion is happening inside you right now. In your lungs, oxygen moves from the air into your blood, where there is less of it. Ready for some questions?',
  questions:[
   q('def','What is diffusion?',['Particles spreading from where they are crowded to where there are fewer','Particles moving from where there are few to where they are crowded','Particles staying still in one place'],0,'Diffusion is particles moving from a high concentration to a low concentration.'),
   q('potato','A potato cube sits in iodine. Why does its outside turn blue-black first?',['Iodine moved into the outside cells first','The potato was already blue-black','Water moved out of the potato'],0,'Iodine diffuses in from the outside, so the outer cells change colour first.'),
   q('lungs','In your lungs, why does oxygen move from the air into your blood?',['There is more oxygen in the air than in the blood','There is more oxygen in the blood than in the air','The heart sucks it in'],0,'Oxygen diffuses from where there is more of it (the air) to where there is less (the blood).'),
   q('def','Diffusion can happen in…',['Liquids and gases','Solids only','Nothing but water'],0,'Diffusion happens in liquids and gases.')
  ],
  concepts:{
   def:{title:'What diffusion is',show:['diffusion',2],say:'Watch the purple particles again. They start crowded together and spread out to where there are fewer of them. That spreading is diffusion.',
    retry:{prompt:'Purple dye spreads through water until the colour is even. This is called…',options:['Diffusion','Melting','Freezing'],answer:0,explain:'That spreading is diffusion.'}},
   potato:{title:'The potato cube',show:['potato',1],say:'Iodine starts outside the potato, where there is lots of it. It moves into the cells from the outside, so the outside changes first and the middle stays pale.',
    retry:{prompt:'Why is the middle of a big potato cube still pale after 15 minutes in iodine?',options:['The iodine hasn’t reached it yet','The middle has no cells','Iodine can’t move'],answer:0,explain:'Diffusion takes time to reach the inside.'}},
   lungs:{title:'Diffusion in your lungs',show:['diffusion',2],say:'Remember: particles move from where there are many to where there are few. The air in your lungs has lots of oxygen and your blood has less, so oxygen moves into your blood.',
    retry:{prompt:'Carbon (IV) oxide moves from your blood into your lungs. Where is there more carbon (IV) oxide?',options:['In the blood','In the lungs'],answer:0,explain:'It moves from the blood, where there is more, to the lungs, where there is less.'}}
  }},
 {id:'osm', short:'Osmosis', title:'Osmosis', visuals:['osmosis','strips','visking'],
  lesson:`<h2>Osmosis</h2>
   <p>When sugar dissolves in water, it makes a <b>solution</b>. The sugar is the <b>solute</b> and the water is the <b>solvent</b>.</p>
   <ul><li>A <b>dilute</b> solution has a little sugar and lots of water.</li><li>A <b>concentrated</b> solution has lots of sugar and less water.</li></ul>
   <p>A <b>semi-permeable membrane</b> has tiny holes. Small water particles get through; big sugar particles don’t.</p>
   <p><b>Osmosis</b> is the movement of water through a semi-permeable membrane, from the dilute side to the concentrated side.</p>`,
  intro:'Now a special kind of movement that is only about water. It’s called osmosis.',
  outro:'So water always moves towards the sugary side. Ready to test yourself?',
  questions:[
   q('def','Osmosis is the movement of…',['Water through a thin sheet with tiny holes, towards the sugary side','Sugar through a sheet, towards the plain water','Any particle from crowded to less crowded'],0,'Osmosis is about water moving through a semi-permeable membrane towards the more concentrated side.'),
   q('membrane','Why can’t sugar particles pass through a semi-permeable membrane?',['They are too big for the tiny holes','They are too small','They don’t move at all'],0,'Sugar particles are too large for the pores.'),
   q('strips','A 50 mm potato strip is left in plain water for an hour. What is its new length most likely to be?',['53 mm','47 mm','50 mm'],0,'Water moves into the potato cells, so the strip grows.'),
   q('visking','Bag A holds sugary water and sits in plain water. What happens to bag A?',['It swells','It shrinks','Nothing happens'],0,'Water moves into the bag, towards the sugary side, so it swells.')
  ],
  concepts:{
   def:{title:'What osmosis is',show:['osmosis',2],say:'Watch the level on the sugary side rise. Water moves through the thin sheet towards the sugary side. That is osmosis.',
    retry:{prompt:'In osmosis, which particles move through the membrane?',options:['Water','Sugar','Salt'],answer:0,explain:'Osmosis is the movement of water.'}},
   membrane:{title:'The thin sheet with holes',show:['osmosis',1],say:'Look at the size of the particles. The small blue water particles fit through the tiny holes. The big orange sugar particles don’t.',
    retry:{prompt:'Which particles can pass through a semi-permeable membrane?',options:['Small ones like water','Big ones like sugar'],answer:0,explain:'Only small particles like water get through.'}},
   strips:{title:'The potato strips',show:['strips',1],say:'In plain water, water moves into the potato cells, so the strip grows to 53 mm. In sugary water, water moves out, so it shrinks to 47 mm.',
    retry:{prompt:'A potato strip is left in sugary water. What happens to it?',options:['It gets shorter and softer','It gets longer and firmer'],answer:0,explain:'Water leaves the cells, so it shrinks.'}},
   visking:{title:'The two bags',show:['visking',1],say:'Water always moves towards the sugary side. Bag A has sugar inside, so water moves in and it swells. Bag B has sugar outside, so water moves out and it shrinks.',
    retry:{prompt:'Bag B holds plain water and sits in sugary water. What happens?',options:['It shrinks','It swells'],answer:0,explain:'Water moves out of the bag towards the sugary side.'}}
  }},
 {id:'turg', short:'Firm and soft', title:'Turgid and flaccid cells', visuals:['cell','guard'],
  lesson:`<h2>Turgid and flaccid</h2>
   <ul><li><b>Turgid</b>: a cell that has taken in water by osmosis. It is swollen and firm.</li><li><b>Flaccid</b>: a cell that has lost water. It is soft and limp.</li></ul>
   <p>Osmosis is important for living things:</p>
   <ul><li>Root hairs take in water from the soil.</li><li>Guard cells open and close the tiny holes (stomata) in leaves.</li><li>Turgid cells keep soft stems and leaves upright.</li><li>Your kidneys and large intestine take water back into your blood.</li></ul>`,
  intro:'Finally, let’s see what happens to cells when they gain or lose water.',
  outro:'Osmosis also helps roots take in water from the soil, and helps your kidneys hold on to water. Let’s check what you remember.',
  questions:[
   q('turgid','A plant cell has taken in lots of water and feels firm. It is…',['Turgid','Flaccid','Dry'],0,'A swollen, firm cell is turgid.'),
   q('flaccid','A cell that has lost water and gone soft is…',['Flaccid','Turgid','Frozen'],0,'A soft, limp cell is flaccid.'),
   q('stomata','When guard cells gain water, the stoma (tiny hole)…',['Opens','Closes','Disappears'],0,'Turgid guard cells bend apart, so the hole opens.'),
   q('roots','How do root hair cells take in water from the soil?',['By osmosis','By photosynthesis','By pumping it with muscles'],0,'Water moves into root hairs by osmosis.')
  ],
  concepts:{
   turgid:{title:'Turgid cells',show:['cell',0],say:'Here the cell is full of water. It swells and pushes against its wall, so it feels firm. That’s turgid.',
    retry:{prompt:'Which word means swollen and firm with water?',options:['Turgid','Flaccid'],answer:0,explain:'Turgid means swollen and firm.'}},
   flaccid:{title:'Flaccid cells',show:['cell',1],say:'Watch the cell lose water. It shrinks and goes soft. That’s flaccid.',
    retry:{prompt:'A leaf wilts on a hot day because its cells lost water. Its cells are…',options:['Flaccid','Turgid'],answer:0,explain:'Cells that lose water become flaccid.'}},
   stomata:{title:'Guard cells',show:['guard',0],say:'When guard cells fill with water, they bend apart and the hole opens. When they lose water, they straighten and the hole closes.',
    retry:{prompt:'Guard cells lose water. What happens to the stoma?',options:['It closes','It opens'],answer:0,explain:'Flaccid guard cells close the hole.'}},
   roots:{title:'How roots take in water',show:['osmosis',2],say:'Root hair cells have less water inside than the soil around them, so water moves into the root by osmosis, just like the level rising here.',
    retry:{prompt:'Water moves into root hairs because the soil has…',options:['More water than the root cells','Less water than the root cells'],answer:0,explain:'Water moves from where there is more to where there is less, across the membrane.'}}
  }}
 ]
};
})();
