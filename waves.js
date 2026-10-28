/* 3.2 Waves (Grade 9) */
(function(){
"use strict";
const K=window.KIT, {THREE,M,clay,metal,arrow,GY,pill,lead,svg,wavePath,INK,MUTED,OR}=K;

function partsSvg(st){
  const yc=230, Aa=90, lam=260, x0=60, x1=740, crest=x0+lam/4, trough=x0+3*lam/4, crest2=crest+lam; let extra='';
  if(st===0) extra=`${pill(crest,yc-Aa-36,'Crest')}${pill(trough,yc+Aa+40,'Trough','light')}`;
  if(st===1) extra=`<line x1="${crest}" y1="${yc}" x2="${crest}" y2="${yc-Aa+6}" stroke="${OR}" stroke-width="5"/><path d="M${crest-10} ${yc-Aa+18} L${crest} ${yc-Aa+2} L${crest+10} ${yc-Aa+18}" fill="none" stroke="${OR}" stroke-width="5" stroke-linejoin="round"/>${pill(crest-130,yc-45,'Amplitude','orange')}`;
  if(st===2) extra=`<path d="M${crest} ${yc-Aa-40} V${yc-Aa-20} M${crest} ${yc-Aa-30} H${crest2} M${crest2} ${yc-Aa-40} V${yc-Aa-20}" stroke="${OR}" stroke-width="5" fill="none"/>${pill((crest+crest2)/2,yc-Aa-68,'Wavelength','orange')}`;
  return svg(`<line x1="${x0}" y1="${yc}" x2="${x1}" y2="${yc}" stroke="#B9C1D3" stroke-width="3" stroke-dasharray="8 8"/>
    <path d="${wavePath(x0,x1,yc,Aa,lam)}" fill="none" stroke="#3D7BFF" stroke-width="9" stroke-linecap="round"/>${extra}
    ${st===0?`<text x="${x1}" y="${yc-12}" text-anchor="end" font-size="17" font-weight="600" fill="${MUTED}">resting line</text>`:''}`,'0 0 800 420');
}

const visuals={
rope:{kind:'3d',label:'3D model: a wave on a rope',cam:[0.3,1.4,7.4],target:[0,0.05,0],bounds:[[-3.3,-1.1,-0.4],[3.1,1.4,0.4]],
 steps:['Shake one end of a rope up and down. A wave travels along the rope.','Watch the orange dot. It only moves up and down. It does not travel along with the wave.','So a wave carries energy from one place to another, without carrying the rope with it. This kind of wave is called a transverse wave.','The high points of a wave are called crests. The low points are called troughs.'],
 build(c){
  const g=c.group, N=130, X0=-3, X1=3, Y=GY+1.3, A_=0.42, f=0.45, lam=2.0, k=2*Math.PI/lam; let tt=0;
  const rm=clay('#3D7BFF',{roughness:.45});
  const rope=new THREE.InstancedMesh(new THREE.SphereGeometry(0.065,12,10),rm,N); rope.castShadow=true; g.add(rope);
  const pole=M(new THREE.CylinderGeometry(0.07,0.07,2.4,20),clay('#2A2D3A')); pole.position.set(X0-0.15,Y,0); g.add(pole);
  const xm=X0+(X1-X0)*85/(N-1), mk=M(new THREE.SphereGeometry(0.13,20,16),clay('#FF5F00',{roughness:.35})); g.add(mk);
  const guide=M(new THREE.CylinderGeometry(0.014,0.014,2*A_+0.3,8),new THREE.MeshBasicMaterial({color:'#FF9A5C',transparent:true,opacity:.7}),false); guide.position.set(xm,Y,-0.02); g.add(guide);
  const arr=arrow([-1.3,Y+1.05,0],[1.5,Y+1.05,0]); g.add(arr);
  const yAt=x=>A_*Math.sin(k*(x-X0)-2*Math.PI*f*tt);
  const near=ph=>{ let x=(ph+2*Math.PI*f*tt)/k+X0; while(x>0.6) x-=lam; while(x<-1.4) x+=lam; return x; };
  const tW=c.tag('The wave travels this way','accent',()=>new THREE.Vector3(0.1,Y+1.22,0));
  const tD=c.tag('Only goes up and down','accent',()=>new THREE.Vector3(xm,Y+A_+0.38,0));
  const tE=c.tag('Energy moves along','accent',()=>new THREE.Vector3(0.1,Y+1.22,0));
  const tC=c.tag('Crest','',()=>{ const x=near(Math.PI/2); return new THREE.Vector3(x,Y+yAt(x)+0.22,0); });
  const tT=c.tag('Trough','light',()=>{ const x=near(3*Math.PI/2); return new THREE.Vector3(x,Y+yAt(x)-0.3,0); });
  const m4=new THREE.Matrix4();
  return { step(i){ tW.show=i===0; arr.visible=i===0||i===2; mk.visible=guide.visible=i===1||i===2; tD.show=i===1; tE.show=i===2; tC.show=tT.show=i===3; rm.color.set(i===1?'#A9C4FF':'#3D7BFF'); },
    update(dt){ tt+=dt; for(let i=0;i<N;i++){ const x=X0+(X1-X0)*i/(N-1); m4.makeTranslation(x,Y+yAt(x),0); rope.setMatrixAt(i,m4); } rope.instanceMatrix.needsUpdate=true; mk.position.set(xm,Y+yAt(xm),0); } };
 }},
spring:{kind:'3d',label:'3D model: a wave in a spring',cam:[0.5,1.8,8.4],target:[0,-0.05,0],bounds:[[-3.4,-0.7,-0.5],[3.4,0.9,0.5]],
 steps:['Now push and pull one end of a long spring. A different kind of wave travels along it.','In some places the coils bunch up. These are compressions. In other places they spread apart. These are rarefactions.','Watch the orange coil. It moves back and forth, in the same direction the wave travels. This kind of wave is called a longitudinal wave. Sound travels like this.'],
 build(c){
  const g=c.group, N=60, X0=-3, X1=3, Y=GY+1.05, sp=(X1-X0)/(N-1), A_=0.24, f=0.4, lam=2.4, k=2*Math.PI/lam; let tt=0;
  const ring=new THREE.TorusGeometry(0.36,0.026,10,48); ring.rotateY(Math.PI/2);
  const coils=new THREE.InstancedMesh(ring,metal('#AEB6C6',.3),N); coils.castShadow=true; g.add(coils);
  const HI=34, hl=M(ring,clay('#FF5F00',{roughness:.35})); hl.scale.setScalar(1.05); g.add(hl);
  const paddle=M(new THREE.RoundedBoxGeometry(0.12,1.0,1.0,3,0.04),clay('#4C5BD4')); g.add(paddle);
  const arr=arrow([-1.3,Y+0.95,0],[1.5,Y+0.95,0]); g.add(arr);
  const u=x0=>A_*Math.sin(k*(x0-X0)-2*Math.PI*f*tt);
  const at=ph=>{ let x0=(ph+2*Math.PI*f*tt)/k+X0; while(x0>1.4) x0-=lam; while(x0<-1.6) x0+=lam; return x0+u(x0); };
  const tW=c.tag('The wave travels this way','accent',()=>new THREE.Vector3(0.1,Y+1.12,0));
  const tC=c.tag('Bunched up: compression','',()=>new THREE.Vector3(at(Math.PI),Y+0.55,0));
  const tR=c.tag('Spread out: rarefaction','light',()=>new THREE.Vector3(at(0),Y-0.55,0)); tR.below=true;
  const tO=c.tag('Moves back and forth','accent',()=>new THREE.Vector3(X0+HI*sp+u(X0+HI*sp),Y+0.55,0));
  const m4=new THREE.Matrix4();
  return { step(i){ tW.show=arr.visible=i===0; tC.show=tR.show=i===1; hl.visible=tO.show=i===2; },
    update(dt){ tt+=dt; for(let i=0;i<N;i++){ const x0=X0+i*sp; m4.makeTranslation(x0+u(x0),Y,0); coils.setMatrixAt(i,m4); } coils.instanceMatrix.needsUpdate=true;
      const xh=X0+HI*sp; hl.position.set(xh+u(xh),Y,0); paddle.position.set(X0-0.2+u(X0),Y,0); } };
 }},
parts:{kind:'pic',label:'Picture: parts of a wave',
 steps:['The highest point of a wave is the crest. The lowest point is the trough.','The amplitude is how high the wave rises from its resting line. Bigger amplitude means a louder sound or a brighter light.','The wavelength is the distance from one crest to the next crest.','Wave speed = frequency × wavelength. A whistle making 400 waves per second, with a wavelength of 0.85 m, gives 400 × 0.85 = 340 metres per second.'],
 pics:[()=>partsSvg(0),()=>partsSvg(1),()=>partsSvg(2),()=>svg(`<rect x="60" y="70" width="680" height="300" rx="28" fill="#FFFFFF" stroke="#DDE2EC" stroke-width="3"/>
   <text x="400" y="150" text-anchor="middle" font-size="30" font-weight="800" fill="${INK}">speed = frequency × wavelength</text>
   <text x="400" y="235" text-anchor="middle" font-size="44" font-weight="800" fill="${INK}">400 × 0.85 = <tspan fill="${OR}">340 m/s</tspan></text>
   <text x="400" y="300" text-anchor="middle" font-size="20" font-weight="600" fill="${MUTED}">frequency: waves per second (Hz) · wavelength: metres</text>`,'0 0 800 440')]},
behave:{kind:'pic',label:'Picture: how waves behave',
 steps:['Waves bounce off surfaces. This is reflection. It’s why you hear an echo and see yourself in a mirror.','Waves bend when they pass from one material into another. This is refraction. It’s why a straw looks bent in a glass of water.','Waves spread out through gaps and around corners. This is diffraction. It’s why you can hear someone talking around a corner.','In one material with nothing in the way, waves travel in straight lines. Think of a torch beam.'],
 pics:[
  ()=>svg(`<rect x="560" y="70" width="34" height="330" rx="10" fill="#9FB0C6"/>${pill(577,45,'Mirror','light')}
    <defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="${OR}"/></marker></defs>
    <path d="M140 110 L360 176" stroke="${OR}" stroke-width="8" stroke-linecap="round" marker-end="url(#ah)"/><path d="M360 176 L556 235 L330 303" fill="none" stroke="${OR}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#ah)"/><path d="M330 303 L140 360" stroke="${OR}" stroke-width="8" stroke-linecap="round"/>
    ${pill(250,90,'Wave in','dark')}${pill(250,400,'Bounces back','orange')}`),
  ()=>svg(`<path d="M290 90 L310 400 Q312 420 332 420 H468 Q488 420 490 400 L510 90" fill="none" stroke="#9FB0C6" stroke-width="6" stroke-linejoin="round"/>
    <path d="M300 220 H500 L490 400 Q488 416 470 416 H330 Q312 416 310 400 Z" fill="#BFDFFF"/>
    <path d="M360 40 L430 220" stroke="#FF7FA8" stroke-width="18" stroke-linecap="round"/><path d="M405 220 L455 380" stroke="#FF7FA8" stroke-width="18" stroke-linecap="round"/>
    ${pill(640,220,'Water surface','light')}${lead(578,220,505,220)}${pill(160,300,'Looks bent here','orange')}${lead(245,300,425,300)}`),
  ()=>svg(`<rect x="372" y="40" width="40" height="160" rx="8" fill="#5A6072"/><rect x="372" y="280" width="40" height="160" rx="8" fill="#5A6072"/>
    ${[100,170,240,310].map(x=>`<line x1="${x}" y1="70" x2="${x}" y2="410" stroke="#3D7BFF" stroke-width="7" stroke-linecap="round"/>`).join('')}
    ${[70,140,210,280].map(r=>{ const dx=(412+r*0.5).toFixed(1), dy=r*0.866; return `<path d="M${dx} ${(240-dy).toFixed(1)} A${r} ${r} 0 0 1 ${dx} ${(240+dy).toFixed(1)}" fill="none" stroke="#3D7BFF" stroke-width="7" stroke-linecap="round"/>`; }).join('')}
    ${pill(392,240,'Gap','orange')}${pill(640,60,'Waves spread out','dark')}`),
  ()=>svg(`<rect x="70" y="200" width="120" height="70" rx="16" fill="#2A2D3A"/><rect x="180" y="190" width="40" height="90" rx="10" fill="#4C5BD4"/>
    <path d="M220 200 L720 120 L720 350 L220 270 Z" fill="#FFE27A" opacity=".55"/>
    ${[150,235,320].map(y=>`<line x1="230" y1="235" x2="720" y2="${y}" stroke="${OR}" stroke-width="5" stroke-linecap="round"/>`).join('')}
    ${pill(130,160,'Torch','light')}${pill(520,400,'Light goes in straight lines','orange')}`)
 ]}
};

const q=(concept,prompt,options,answer,explain)=>({concept,prompt,options,answer,explain});

window.LESSONS.waves={
 id:'waves', title:'3.2 Waves', grade:'Grade 9 · Force and energy', visuals,
 sections:[
 {id:'what', short:'Waves', title:'What is a wave?', visuals:['rope','spring'],
  lesson:`<h2>What is a wave?</h2>
   <p>A <b>wave</b> carries <b>energy</b> from one place to another, without carrying the material along with it.</p>
   <p>Examples: ripples on water, sound, earthquake shaking, and light.</p>
   <ul><li><b>Transverse waves</b>: the particles move up and down, at right angles to the wave. They have <b>crests</b> and <b>troughs</b>. Water ripples and light are transverse.</li>
   <li><b>Longitudinal waves</b>: the particles move back and forth, along the wave. They have <b>compressions</b> and <b>rarefactions</b>. Sound is longitudinal.</li></ul>`,
  intro:'Let’s find out what a wave really is. We’ll start with a rope.',
  outro:'So there are two kinds of wave: transverse, like the rope, and longitudinal, like the spring. Ready for some questions?',
  questions:[
   q('energy','What does a wave carry from place to place?',['Energy','Water','Air','The rope itself'],0,'A wave carries energy, not the material.'),
   q('transverse','In a transverse wave, the particles move…',['Up and down, at right angles to the wave','Back and forth along the wave','Along with the wave to the other end'],0,'Transverse wave particles move at right angles to the wave.'),
   q('longitudinal','Sound travelling through air is an example of a…',['Longitudinal wave','Transverse wave'],0,'Sound is a longitudinal wave.'),
   q('longitudinal','The bunched-up parts of a longitudinal wave are called…',['Compressions','Rarefactions','Crests','Troughs'],0,'Bunched-up parts are compressions.')
  ],
  concepts:{
   energy:{title:'What waves carry',show:['rope',2],say:'The wave moves along, but the rope stays where it is. What travels is energy.',
    retry:{prompt:'When a wave passes along a rope, what moves to the far end?',options:['Energy','The rope'],answer:0,explain:'Energy travels; the rope stays.'}},
   transverse:{title:'Transverse waves',show:['rope',1],say:'Watch the orange dot. It only goes up and down, at right angles to the direction the wave travels. That’s a transverse wave.',
    retry:{prompt:'Ripples on water are an example of a…',options:['Transverse wave','Longitudinal wave'],answer:0,explain:'Water ripples are transverse.'}},
   longitudinal:{title:'Longitudinal waves',show:['spring',1],say:'In a longitudinal wave, the coils bunch up into compressions and spread out into rarefactions, moving back and forth along the wave.',
    retry:{prompt:'The spread-out parts of a longitudinal wave are called…',options:['Rarefactions','Compressions'],answer:0,explain:'Spread-out parts are rarefactions.'}}
  }},
 {id:'parts', short:'Parts', title:'Parts of a wave', visuals:['parts'],
  lesson:`<h2>Parts of a wave</h2>
   <ul><li><b>Amplitude (A)</b>: how far the wave rises from its resting line, in metres.</li>
   <li><b>Wavelength (λ)</b>: the distance from one crest to the next, in metres.</li>
   <li><b>Frequency (f)</b>: how many waves pass each second, in hertz (Hz).</li>
   <li><b>Period (T)</b>: the time for one wave. T = 1 ÷ f.</li></ul>
   <div class="formula">wave speed (v) = frequency (f) × wavelength (λ)</div>`,
  intro:'Now let’s name the parts of a wave, and work out how fast a wave travels.',
  outro:'Remember: speed equals frequency times wavelength. Let’s practise.',
  questions:[
   q('amplitude','Amplitude is…',['How high the wave rises from its resting line','The distance from crest to crest','How many waves pass each second'],0,'Amplitude is the height from the resting line.'),
   q('wavelength','The distance from one crest to the next crest is the…',['Wavelength','Amplitude','Frequency'],0,'That distance is the wavelength.'),
   {concept:'speed',type:'number',unit:'m/s',prompt:'A wave has a frequency of 200 Hz and a wavelength of 1.5 m. What is its speed?',answer:300,explain:'v = f × λ = 200 × 1.5 = 300 m/s.'},
   q('frequency','Frequency is measured in…',['Hertz (Hz)','Metres (m)','Seconds (s)'],0,'Frequency is measured in hertz.')
  ],
  concepts:{
   amplitude:{title:'Amplitude',show:['parts',1],say:'Amplitude is the height from the resting line up to a crest. A bigger amplitude means a louder sound.',
    retry:{prompt:'A louder sound has a bigger…',options:['Amplitude','Wavelength'],answer:0,explain:'More amplitude means more energy, so a louder sound.'}},
   wavelength:{title:'Wavelength',show:['parts',2],say:'Wavelength is measured from one crest to the very next crest.',
    retry:{prompt:'Wavelength is measured in…',options:['Metres','Hertz'],answer:0,explain:'It’s a distance, so metres.'}},
   speed:{title:'Wave speed',show:['parts',3],say:'Multiply the frequency by the wavelength. For the whistle, 400 times 0.85 gives 340 metres per second.',
    retry:{type:'number',unit:'m/s',prompt:'Frequency 100 Hz, wavelength 2 m. What is the wave speed?',answer:200,explain:'100 × 2 = 200 m/s.'}},
   frequency:{title:'Frequency',fly:'lesson',say:'Frequency is how many waves pass a point each second. We measure it in hertz, written Hz.',
    retry:{prompt:'If 50 waves pass each second, the frequency is…',options:['50 Hz','50 m','50 s'],answer:0,explain:'50 waves per second is 50 Hz.'}}
  }},
 {id:'behave', short:'Behaviour', title:'How waves behave', visuals:['behave'],
  lesson:`<h2>How waves behave</h2>
   <ul><li><b>Reflection</b>: bouncing back off a surface (echoes, mirrors).</li><li><b>Refraction</b>: bending when going into a new material (a straw looks bent in water).</li>
   <li><b>Diffraction</b>: spreading through gaps and around corners.</li><li><b>Straight lines</b>: in one material with nothing in the way.</li></ul>
   <h3>Waves we use</h3>
   <ul><li>Medicine: ultrasound scans of babies, X-rays of broken bones.</li><li>Communication: radio waves and microwaves for phones and Wi-Fi; radar finds planes.</li>
   <li>Home and farms: microwave ovens; satellites and drones use waves to watch crops and weather (remote sensing).</li></ul>`,
  intro:'Last section: what waves do when they meet things in their way.',
  outro:'We use waves everywhere: ultrasound scans, X-rays, phones, microwave ovens and satellites. Let’s see what you remember.',
  questions:[
   q('reflection','Hearing an echo is an example of…',['Reflection','Refraction','Diffraction'],0,'An echo is sound bouncing back.'),
   q('refraction','A straw looks bent in a glass of water because of…',['Refraction','Reflection','Diffraction'],0,'Light bends as it passes from water into air.'),
   q('diffraction','You can hear a friend talking around a corner. This is…',['Diffraction','Reflection','Refraction'],0,'Sound spreads around the corner.'),
   q('uses','Which waves are used to see a baby before it is born?',['Ultrasound','X-rays','Microwaves'],0,'Ultrasound scans are safe for unborn babies.')
  ],
  concepts:{
   reflection:{title:'Reflection',show:['behave',0],say:'Reflection is a wave bouncing back off a surface, like sound off a wall or light off a mirror.',
    retry:{prompt:'Seeing yourself in a mirror is…',options:['Reflection','Diffraction'],answer:0,explain:'Light bounces off the mirror.'}},
   refraction:{title:'Refraction',show:['behave',1],say:'Refraction is bending. Light changes direction as it passes between water and air, so the straw looks bent.',
    retry:{prompt:'Refraction means a wave…',options:['Bends','Bounces back'],answer:0,explain:'Refraction is bending.'}},
   diffraction:{title:'Diffraction',show:['behave',2],say:'Diffraction is waves spreading out through a gap or around a corner.',
    retry:{prompt:'Waves spreading out after passing through a gap is…',options:['Diffraction','Reflection'],answer:0,explain:'That’s diffraction.'}},
   uses:{title:'Waves we use',fly:'lesson',say:'Doctors use ultrasound to see babies and X-rays to find broken bones. Phones use radio waves and microwaves.',
    retry:{prompt:'Which waves help doctors find a broken bone?',options:['X-rays','Ultrasound','Radio waves'],answer:0,explain:'X-rays pass through soft tissue but not bone.'}}
  }}
 ]
};
})();
