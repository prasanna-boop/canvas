/* 1.1 Elements and compounds (Grade 8) */
(function(){
"use strict";
const K=window.KIT, {THREE,M,clay,metal,glassMat,tween,ease,GY,pill,svg,dot,esc,INK,MUTED,OR}=K;
const COL={Cu:'#C87533',O:'#FF5A5F',H:'#FFFFFF'};

function symCards(list,col,showLatin){
  const n=list.length, w=150, gap=24, x0=400-(n*w+(n-1)*gap)/2;
  return list.map((e,i)=>{ const x=x0+i*(w+gap), sym=e[0];
    const s=sym.length>1?`<tspan fill="${col}">${sym[0]}</tspan><tspan fill="${OR}">${sym.slice(1)}</tspan>`:`<tspan fill="${col}">${sym}</tspan>`;
    return `<rect x="${x}" y="130" width="${w}" height="${showLatin?210:180}" rx="22" fill="#FFFFFF" stroke="${col}" stroke-width="4"/>
      <text x="${x+w/2}" y="225" text-anchor="middle" font-size="72" font-weight="800">${s}</text>
      <text x="${x+w/2}" y="280" text-anchor="middle" font-size="22" font-weight="700" fill="${INK}">${esc(e[1])}</text>
      ${showLatin?`<text x="${x+w/2}" y="318" text-anchor="middle" font-size="17" font-weight="600" fill="${MUTED}">from “${esc(e[2])}”</text>`:''}`; }).join('');
}
function eqSvg(items,labels){
  const box=(x,w,name,icon)=>`<rect x="${x}" y="150" width="${w}" height="170" rx="24" fill="#FFFFFF" stroke="#DDE2EC" stroke-width="3"/>${icon(x+w/2)}<text x="${x+w/2}" y="295" text-anchor="middle" font-size="22" font-weight="800" fill="${INK}">${esc(name)}</text>`;
  const sym=(x,t)=>`<text x="${x}" y="250" text-anchor="middle" font-size="54" font-weight="800" fill="${INK}">${t}</text>`;
  const [a,b,p]=items;
  return svg(`${box(40,190,a[0],a[1])}${sym(265,'+')}${box(300,190,b[0],b[1])}${sym(535,'→')}${box(570,190,p[0],p[1])}
    ${labels?`<path d="M50 345 V360 H480 V345" fill="none" stroke="${OR}" stroke-width="4"/>${pill(265,395,'Reactants: what we start with','orange')}<path d="M580 345 V360 H750 V345" fill="none" stroke="${INK}" stroke-width="4"/>${pill(665,435,'Product: what is made','dark')}`:''}`,'0 0 800 470');
}
const H2=x=>dot(x-16,215,22,'#FFFFFF')+dot(x+16,215,22,'#FFFFFF'), O2=x=>dot(x-20,215,26,'#FF5A5F')+dot(x+20,215,26,'#FF5A5F');
const H2O=x=>dot(x,208,28,'#FF5A5F')+dot(x-28,232,18,'#FFFFFF')+dot(x+28,232,18,'#FFFFFF');

const visuals={
particles:{kind:'3d',label:'3D model: atoms to compounds',w:760,cam:[0,1.6,5.6],target:[0,-0.15,0],bounds:[[-1.05,-1.2,-1.05],[1.05,0.95,1.05]],
 steps:['Everything is made of tiny particles called atoms. Here is one atom of copper.','Copper is an element. An element is made of only one kind of atom. Every atom here is copper.','Some atoms join together in small groups called molecules. Here, two oxygen atoms (red) join to make each oxygen molecule.','When different kinds of atoms join, we get a compound. Water is a compound: two hydrogen atoms (white) joined to one oxygen atom (red).'],
 build(c){
  const g=c.group, cy=GY+1.05, sg=new THREE.SphereGeometry(1,32,24);
  const box=M(new THREE.BoxGeometry(2,2,2),glassMat(),false); box.position.y=cy; box.renderOrder=3; g.add(box);
  let content=new THREE.Group(); g.add(content); const floaters=[];
  const at=(sym,r,pos,par)=>{ const m=M(sg,clay(sym==='Cu'?'#D9894E':COL[sym],{roughness:sym==='Cu'?.28:.35})); m.scale.setScalar(r); m.position.set(...pos); par.add(m); return m; };
  const tg=c.tag('','accent',()=>new THREE.Vector3(0,cy+1.3,0));
  function fill(i){
    g.remove(content); content=new THREE.Group(); content.position.y=cy; g.add(content); floaters.length=0;
    if(i===0){ at('Cu',0.45,[0,0,0],content); tg.el.textContent='One atom'; }
    if(i===1){ for(let a=-1;a<=1;a+=2) for(let b=-1;b<=1;b+=2) for(let d=-1;d<=1;d+=2) at('Cu',0.27,[a*.32,b*.32,d*.32],content); tg.el.textContent='Element: copper'; }
    if(i===2){ [[-0.45,0.4,0],[0.45,0.35,0.2],[-0.35,-0.45,0.2],[0.4,-0.4,-0.2]].forEach(p=>{ const m=new THREE.Group(); at('O',0.2,[-0.17,0,0],m); at('O',0.2,[0.17,0,0],m); m.position.set(...p); m.rotation.set(Math.random(),Math.random(),Math.random()); content.add(m); floaters.push(m); }); tg.el.textContent='Molecules: oxygen'; }
    if(i===3){ [[-0.45,0.4,0],[0.45,0.35,0.2],[-0.35,-0.45,0.2],[0.45,-0.42,-0.2]].forEach(p=>{ const m=new THREE.Group(); at('O',0.22,[0,0,0],m); at('H',0.14,[-0.22,-0.17,0],m); at('H',0.14,[0.22,-0.17,0],m); m.position.set(...p); m.rotation.y=Math.random()*3; content.add(m); floaters.push(m); }); tg.el.textContent='Compound: water'; }
    content.scale.setScalar(0.01); tween(500,t=>content.scale.setScalar(Math.max(0.01,ease(t))));
  }
  return { step(i){ fill(i); }, update(dt,t){ floaters.forEach((m,k)=>{ m.rotation.y+=dt*0.4; m.position.y+=Math.sin(t*1.2+k*1.7)*0.0015; }); } };
 }},
symbols:{kind:'pic',label:'Picture: chemical symbols',
 steps:['Every element has a short symbol. Often it is just the first letter of its name, written as a capital.','Some symbols use two letters. The first is always a capital and the second is always small.','A few symbols come from old Latin names. Iron’s Latin name is Ferrum, so its symbol is Fe.'],
 pics:[()=>svg(symCards([['H','Hydrogen'],['C','Carbon'],['N','Nitrogen'],['O','Oxygen']],'#4C5BD4')),
       ()=>svg(symCards([['Ne','Neon'],['Al','Aluminium'],['Cl','Chlorine']],'#4C5BD4')),
       ()=>svg(symCards([['Fe','Iron','Ferrum'],['Cu','Copper','Cuprum'],['Na','Sodium','Natrium'],['Au','Gold','Aurum']],'#E8650A',true))]},
equations:{kind:'pic',label:'Picture: word equations',
 steps:['When elements react, they join to make a new substance. Hydrogen and oxygen react to make water.','We write this as a word equation. The plus sign means “reacts with” and the arrow means “to make”.','Another example: sodium reacts with chlorine to make sodium chloride, which is table salt.'],
 pics:[()=>eqSvg([['Hydrogen',H2],['Oxygen',O2],['Water',H2O]]),()=>eqSvg([['Hydrogen',H2],['Oxygen',O2],['Water',H2O]],true),
       ()=>eqSvg([['Sodium',x=>dot(x,215,34,'#A86CF0')],['Chlorine',x=>dot(x,215,32,'#55C25A')],['Sodium chloride',x=>dot(x-20,215,30,'#A86CF0')+dot(x+24,215,28,'#55C25A')]])]},
bangles:{kind:'pic',label:'Picture: value of metals',
 steps:['Two bangles are for sale. Bangle A costs KSh 7,000. Bangle B costs KSh 3,000.','Metals that are rare and long-lasting, like gold, cost more. Common metals, like iron and aluminium, cost less.'],
 pics:[0,1].map(st=>()=>svg(`<defs><linearGradient id="gA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE08A"/><stop offset="1" stop-color="#D49A1F"/></linearGradient>
   <linearGradient id="gB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F6FA"/><stop offset="1" stop-color="#9EA6B5"/></linearGradient></defs>
   <rect x="90" y="330" width="620" height="60" rx="24" fill="#4B2E5C"/>
   <ellipse cx="235" cy="230" rx="100" ry="112" fill="none" stroke="url(#gA)" stroke-width="28"/><ellipse cx="565" cy="230" rx="100" ry="112" fill="none" stroke="url(#gB)" stroke-width="28"/>
   ${pill(235,70,'A · KSh 7,000')}${pill(565,70,'B · KSh 3,000')}
   ${st?pill(235,430,'Rare: costs more','orange')+pill(565,430,'Common: costs less','light'):''}`,'0 0 800 470'))}
};

const q=(concept,prompt,options,answer,explain)=>({concept,prompt,options,answer,explain});

window.LESSONS.elements={
 id:'elements', title:'1.1 Elements and compounds', grade:'Grade 8 · Mixtures, elements and compounds', visuals,
 sections:[
 {id:'atoms', short:'Atoms', title:'Atoms, elements and compounds', visuals:['particles'],
  lesson:`<h2>What is everything made of?</h2>
   <p>All matter is either a <b>mixture</b> or a <b>pure substance</b>. Pure substances are <b>elements</b> or <b>compounds</b>.</p>
   <ul><li><b>Atom</b>: the smallest particle of an element that can take part in a chemical reaction.</li>
   <li><b>Element</b>: made of only one kind of atom, like copper, iron, oxygen or gold.</li>
   <li><b>Molecule</b>: two or more atoms joined together.</li>
   <li><b>Compound</b>: two or more different elements joined chemically, like water or table salt.</li></ul>`,
  intro:'Let’s start with the tiny building blocks of everything around you.',
  questions:[
   q('atom','What is the smallest particle of an element that can take part in a chemical reaction?',['An atom','A molecule','A compound','A mixture'],0,'An atom is the smallest particle of an element.'),
   q('element','Which of these is an element?',['Gold','Water','Sodium chloride','Carbon dioxide'],0,'Gold is made of only one kind of atom.'),
   q('compound','Water is a compound because…',['It is made of two different elements joined together','It has only one kind of atom','It is a metal'],0,'Water is hydrogen and oxygen joined chemically.'),
   q('molecule','Two oxygen atoms joined together make an oxygen…',['Molecule','Compound','Mixture'],0,'Atoms joined in a small group make a molecule.')
  ],
  concepts:{
   atom:{title:'Atoms',show:['particles',0],say:'An atom is the tiniest particle of an element. Everything is built from atoms like this one.',
    retry:{prompt:'Everything is built from tiny particles called…',options:['Atoms','Cells','Crystals'],answer:0,explain:'Atoms are the building blocks of matter.'}},
   element:{title:'Elements',show:['particles',1],say:'An element has only one kind of atom. Every atom in this box is copper, so copper is an element.',
    retry:{prompt:'Which of these is an element?',options:['Iron','Table salt','Water'],answer:0,explain:'Iron is made of only iron atoms.'}},
   compound:{title:'Compounds',show:['particles',3],say:'A compound has different kinds of atoms joined together. In water, hydrogen and oxygen atoms are joined.',
    retry:{prompt:'Which of these is a compound?',options:['Water','Gold','Oxygen'],answer:0,explain:'Water is made of two different elements joined.'}},
   molecule:{title:'Molecules',show:['particles',2],say:'When atoms join into a small group, that group is a molecule. Two oxygen atoms make one oxygen molecule.',
    retry:{prompt:'A small group of atoms joined together is a…',options:['Molecule','Mixture','Solution'],answer:0,explain:'That’s a molecule.'}}
  }},
 {id:'sym', short:'Symbols', title:'Chemical symbols', visuals:['symbols'],
  lesson:`<h2>Chemical symbols</h2>
   <p>Every element has a short <b>symbol</b> that scientists everywhere understand.</p>
   <ul><li>The first letter is always a <b>capital</b>. Any second letter is <b>small</b>: Na, not NA.</li>
   <li>Many come from the English name: H for hydrogen, C for carbon, Al for aluminium.</li>
   <li>Some come from Latin names: Fe (Ferrum, iron), Cu (Cuprum, copper), Na (Natrium, sodium), Pb (Plumbum, lead), Au (Aurum, gold), Ag (Argentum, silver), Hg (Hydrargyrum, mercury).</li></ul>`,
  intro:'Scientists use short symbols for elements, like a shared code. Let’s learn how they work.',
  questions:[
   q('english','Which element has the symbol C?',['Carbon','Copper','Chlorine','Calcium'],0,'C is the first letter of Carbon.'),
   q('latin','Cherorot sees Pb written on an old car battery. Which element is this?',['Lead','Gold','Iron','Silver'],0,'Pb comes from Plumbum, the Latin name for lead.'),
   q('rule','Which symbol is written correctly?',['Na','NA','na','nA'],0,'First letter capital, second letter small.'),
   q('latin','Mwenda’s light bulb contains mercury. What is its symbol?',['Hg','Me','Mr','Hy'],0,'Hg comes from Hydrargyrum, the Latin name for mercury.')
  ],
  concepts:{
   english:{title:'Symbols from English names',show:['symbols',0],say:'Many symbols are just the first letter of the element’s English name. C is carbon, O is oxygen.',
    retry:{prompt:'What is the symbol for oxygen?',options:['O','Ox','X'],answer:0,explain:'O, the first letter of Oxygen.'}},
   latin:{title:'Symbols from Latin names',show:['symbols',2],say:'Some symbols come from old Latin names. Iron is Ferrum, so Fe. Lead is Plumbum, so Pb.',
    retry:{prompt:'Iron’s Latin name is Ferrum. What is its symbol?',options:['Fe','Ir','In'],answer:0,explain:'Fe, from Ferrum.'}},
   rule:{title:'Capital and small letters',show:['symbols',1],say:'The first letter is always a capital. If there’s a second letter, it’s always small.',
    retry:{prompt:'Which is the correct way to write the symbol for aluminium?',options:['Al','AL','al'],answer:0,explain:'Capital A, small l.'}}
  }},
 {id:'eq', short:'Equations', title:'Word equations and uses', visuals:['equations','bangles'],
  lesson:`<h2>Word equations</h2>
   <p>When elements react, they make a new substance. We show this with a <b>word equation</b>:</p>
   <div class="formula">Hydrogen + Oxygen → Water</div>
   <p>Starting substances (left) are <b>reactants</b>. What is made (right) is the <b>product</b>.</p>
   <h3>Everyday uses</h3>
   <ul><li>Gold and silver: jewellery. Copper: electric wires.</li><li>Iron: steel for bridges and tools. Aluminium: light pans and window frames.</li><li>Oxygen: life support in hospitals. Nitrogen: fertilisers.</li></ul>
   <p>Rare, long-lasting elements like gold cost more than common ones like iron.</p>`,
  intro:'Now let’s see what happens when elements react, and how we use them every day.',
  outro:'Elements are everywhere: copper in wires, oxygen in hospitals, iron in buildings. Let’s check what you remember.',
  questions:[
   q('equation','Complete the word equation: Hydrogen + Oxygen → ___',['Water','Carbon dioxide','Table salt'],0,'Hydrogen and oxygen react to make water.'),
   q('reactants','In a word equation, the substances on the left of the arrow are the…',['Reactants','Products','Symbols'],0,'Reactants are what we start with.'),
   q('uses','Mwanaisha is put on life support in hospital. Which element helps her breathe?',['Oxygen','Nitrogen','Hydrogen','Carbon'],0,'Hospitals give oxygen to patients who struggle to breathe.'),
   q('value','Bangle A costs KSh 7,000 and Bangle B costs KSh 3,000. Which is more likely to be gold?',['Bangle A','Bangle B'],0,'Gold is rare and long-lasting, so it costs more.')
  ],
  concepts:{
   equation:{title:'Word equations',show:['equations',0],say:'Hydrogen and oxygen react to make water. We write: hydrogen plus oxygen makes water.',
    retry:{prompt:'Sodium + Chlorine → ___',options:['Sodium chloride','Water','Oxygen'],answer:0,explain:'Sodium and chlorine make sodium chloride, table salt.'}},
   reactants:{title:'Reactants and products',show:['equations',1],say:'Reactants are what we start with, on the left. The product is what is made, on the right.',
    retry:{prompt:'In Carbon + Oxygen → Carbon dioxide, what is the product?',options:['Carbon dioxide','Carbon','Oxygen'],answer:0,explain:'The product is on the right of the arrow.'}},
   uses:{title:'Uses of elements',fly:'lesson',say:'Each element has its uses. Oxygen helps patients breathe, copper carries electricity in wires, and nitrogen helps crops grow.',
    retry:{prompt:'Which element is used in electric wires?',options:['Copper','Gold','Oxygen'],answer:0,explain:'Copper carries electricity well.'}},
   value:{title:'Why some metals cost more',show:['bangles',1],say:'Rare metals that last a long time, like gold, cost more. Common metals cost less.',
    retry:{prompt:'Why is gold expensive?',options:['It is rare and long-lasting','It is very common','It rusts quickly'],answer:0,explain:'Scarcity and durability make it valuable.'}}
  }}
 ]
};
})();
