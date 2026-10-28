// Vercel serverless function: POST /api/tutor
// Holds the Gemini API key on the server. Set GEMINI_API_KEY in Vercel → Settings → Environment Variables.
// Optional: GEMINI_MODEL (defaults to the auto-updating "gemini-flash-latest" alias).

const NOTES = {
  cell: `2.1 THE CELL (Grade 8 Integrated Science, Kenya CBE)

Introduction: A microscope lets us observe objects too small for the naked eye. In this substrand learners examine plant and animal cells under a light microscope, identify their main components, compare them, and calculate magnification.

Cells: All living things are made of basic structural and functional units called cells, like bricks in a wall. Unicellular organisms have one cell (e.g. bacteria, amoeba). Multicellular organisms have many cells (the human body has trillions). Cells need a microscope to be seen. The light microscope uses a beam of light to illuminate a specimen.

Slides: Temporary slide = single use. Permanent slide = sealed with a cover slip for long-term use. Onion epidermis wet mount: peel thin epidermis, cut 0.5 cm square, place in a drop of water on a slide, lower the cover slip at an angle with a mounted needle to avoid air bubbles, observe under low, medium and high power. Iodine solution makes structures clearer. Thin sections let light pass through. Mounting in water keeps the specimen moist. Stains (iodine) highlight the nucleus and cell wall. Cover slip holds the specimen flat and protects the objective lens. Safety: don't wet the microscope, don't touch lenses, don't remove a slide with high power in position, start and end with low power, don't force knobs, always use a cover slip, store dry and dust-free.

Plant cell (seen under light microscope): cell wall, cell membrane, nucleus, cytoplasm, vacuole, chloroplasts. Regular, fixed shape.
Animal cell: cell membrane, nucleus, cytoplasm. No cell wall, so irregular shape.

Functions:
- Cell wall: tough, rigid, outermost, only in plant cells, made of cellulose. Resists stretching, gives support and definite shape.
- Cell membrane: thin, flexible. Controls selective movement of substances into and out of the cell.
- Cytoplasm: jelly-like fluid. Site of chemical reactions.
- Nucleus: large, round, enclosed by nuclear membrane. Controls all cell activities, stores genetic information.
- Chloroplasts: contain green pigment chlorophyll. Site of photosynthesis; trap light energy to make food from carbon (IV) oxide and water.
- Vacuole: sac with cell sap (sugars, salts). Stores water, sugars, salts; maintains shape and support. Young plant cells: many small vacuoles; mature: one large central vacuole.

Comparison. Similar: both have cell membrane, nucleus, cytoplasm.
Differences (plant vs animal): shape regular/fixed vs irregular/flexible; cell wall present (cellulose) vs absent; chloroplasts present vs absent; vacuole large permanent central vs usually absent or small and temporary; size generally larger vs generally smaller; nucleus towards the edge vs central.

Magnification: how many times larger the image appears than the actual object. Objective lenses: low power (wide field of view to locate features), medium power (closer view), high power (fine detail).
Total magnification = eyepiece lens magnification × objective lens magnification. Written with × before the number, e.g. ×40 ("times forty").
Worked: eyepiece ×15, objective ×10 → ×150. Eyepiece ×15 with ×4, ×10, ×40 → ×60, ×150, ×600. Eyepiece ×10 with ×4, ×10, ×40 → ×40, ×100, ×400.`,
  movement: `2.2 MOVEMENT OF MATERIALS IN AND OUT OF THE CELL (Grade 8 Integrated Science, Kenya CBE)

Cells need water, oxygen and nutrients, and must remove wastes such as urea and carbon (IV) oxide. Materials move across the cell membrane mainly by diffusion and osmosis.

Diffusion: movement of particles from a region of high concentration to a region of low concentration. Happens in liquids and gases (e.g. ink or potassium manganate (VII) spreading in water).
Potato and iodine experiment: potato cubes (1-2 cm) in iodine solution for 10-15 minutes. Outer surface turns blue-black because iodine diffuses into the cells and reacts with starch. The centre of larger cubes stays pale because diffusion takes time.
Roles of diffusion: gaseous exchange in animals (lungs: oxygen diffuses from alveoli into blood and binds haemoglobin to form oxyhaemoglobin; carbon (IV) oxide diffuses from blood into alveoli). Gaseous exchange in plants (day: carbon (IV) oxide in through stomata, oxygen out; night: oxygen in, carbon (IV) oxide out through stomata and lenticels). Absorption of digested food (glucose, amino acids) in the ileum; mineral salts into root hairs. Transport of manufactured food into phloem. Transpiration (water vapour out through stomata). Excretion (e.g. Amoeba releases waste by diffusion). Pollination (scent diffuses through air to guide insects).

Osmosis. Solute + solvent = solution. Solute e.g. sugar or salt; solvent e.g. water. Dilute solution: little solute, high water concentration. Concentrated solution: lots of solute, low water concentration. Semi-permeable (selectively permeable) membrane: tiny pores let small molecules like water through but block large solute molecules like sugar.
Osmosis: net movement of water molecules from a region of higher water concentration (dilute solution) to lower water concentration (concentrated solution) across a semi-permeable membrane. Water moves both ways but net movement is towards the concentrated solution.
Potato cylinder experiment: 50 mm cylinders, 1 hour. In distilled water: average 53 mm (+3 mm), cells gain water, become turgid. In concentrated sugar solution: average 47 mm (-3 mm), cells lose water, become flaccid.
Visking tubing (artificial semi-permeable membrane): Case A sugar solution inside, water outside: tubing swells, becomes turgid, beaker level drops slightly. Case B water inside, sugar solution outside: tubing shrinks, becomes flaccid, beaker level rises.
Turgid: swollen, firm cell after taking in water. Flaccid: limp, soft cell after losing water.
Roles of osmosis: root hairs absorb water from soil; water moves cell to cell to the xylem; guard cells gain water and become turgid so stomata open, lose water and become flaccid so stomata close; turgor pressure supports seedlings and non-woody plants; reabsorption of water in kidney tubules; absorption of water in the large intestine; unicellular organisms absorb water.`,
  elements: `1.1 ELEMENTS AND COMPOUNDS (Grade 8 Integrated Science, Kenya CBE)

Matter is classified into mixtures (homogeneous, heterogeneous) and pure substances (elements, compounds).
Atom: smallest particle of an element that can take part in a chemical reaction.
Element: pure substance made of only one kind of atom; cannot be broken down by physical or chemical methods. Examples: copper, aluminium, iron, silver, oxygen, hydrogen.
Molecule: smallest unit of an element or compound that can exist independently; two or more atoms held together (e.g. oxygen molecule = two oxygen atoms).
Compound: two or more different elements chemically combined in fixed proportions; can be broken down chemically; properties differ from its elements. Examples: water H2O (two hydrogen, one oxygen), table salt NaCl (sodium and chlorine).

Chemical symbols: first letter always capital, any second letter lowercase.
From English names: Hydrogen H, Carbon C, Nitrogen N, Oxygen O, Neon Ne, Aluminium Al, Chlorine Cl (first and third letters).
From Latin names: Copper Cu (Cuprum), Iron Fe (Ferrum), Silver Ag (Argentum), Sodium Na (Natrium), Lead Pb (Plumbum), Gold Au (Aurum), Mercury Hg (Hydrargyrum).

Word equations: reactants on the left, products on the right. "+" means reacts with, "->" means to produce/form.
Hydrogen + Oxygen -> Water. Sodium + Chlorine -> Sodium chloride. Carbon + Oxygen -> Carbon dioxide. Copper + Oxygen -> Copper oxide. Aluminium + Oxygen -> Aluminium oxide.

Uses: gold and silver for jewellery, medals; copper for ornaments, coins and electrical wiring; iron mixed with carbon to make steel for vehicles, bridges, buildings, tools; aluminium (light, does not corrode) for sufurias, window frames, aircraft, foils; gold and silver in phone electronics; oxygen for hospital life support; sodium chloride and aluminium compounds in toothpaste, soap, deodorant; nitrogen compounds in fertilisers; petrol and diesel are hydrocarbons (carbon and hydrogen); salt seasons and preserves food; baking soda in baking; iron in meat, liver and beans for haemoglobin.
Economic value: scarce, durable, non-reactive, in-demand elements like gold and silver are expensive; abundant ones like aluminium and iron are cheaper but useful; water and salt are cheap but essential. Factors: availability, demand, cost of extraction, political stability, substitutes. Practice example: Bangle A KSh 7,000 vs Bangle B KSh 3,000 - the more expensive one is more likely gold.`,
  waves: `3.2 WAVES (Grade 9 Integrated Science, Kenya CBE)

A wave is a disturbance that transfers energy from one place to another without transferring matter. Particles vibrate about their rest positions but do not travel with the wave.
Generation: mechanical waves need a medium (stone in water makes ripples); seismic waves from earthquakes; sound waves from vibrating objects (vocal cords); electromagnetic waves from accelerating charges, need no medium, travel at 3 x 10^8 m/s.
Transverse waves: particles vibrate perpendicular (90 degrees) to the direction of travel; crests and troughs. Examples: water ripples, plucked string, all electromagnetic waves.
Longitudinal waves: particles vibrate parallel to the direction of travel; compressions (bunched) and rarefactions (spread). Examples: sound, slinky spring pushed and pulled.
Behaviours: reflection (bouncing back; angle of incidence = angle of reflection; echo, mirror); refraction (bending when passing into a new medium due to speed change; straw looks bent in water); diffraction (spreading through a narrow gap or around obstacles; hearing around a corner); rectilinear propagation (straight lines in a uniform medium).
Properties: amplitude A (m) maximum displacement from rest, more amplitude = more energy, louder or brighter; wavelength lambda (m) distance between two neighbouring crests or compressions; frequency f (Hz) waves passing a point per second; period T (s) time for one wave, T = 1/f; wave speed v (m/s).
Wave equation: v = f x lambda. Worked example: whistle 400 Hz, 0.85 m -> v = 340 m/s.
Remote sensing: detecting Earth's features from a distance with sensors on satellites, aircraft or drones using electromagnetic radiation that is reflected, absorbed or transmitted. Steps: energy source (sunlight or radar), interaction with target, sensor records, data sent to ground stations and processed, interpretation.
Applications: medicine (ultrasound images of organs and unborn babies; X-rays pass soft tissue but absorbed by bone; CT scans; MRI uses magnets and radio waves; radiotherapy with gamma rays; laser surgery); communication (radar uses microwaves to find aircraft, ships, rain; radio waves and microwaves for phones, Wi-Fi, satellites; drones and GPS); home and agriculture (microwave cooking heats water in food; agricultural remote sensing to monitor crops).`,
};

// The Cell lesson keeps its original set of model controls.
const CELL_ACTIONS = {
  highlight: ['wall','membrane','cytoplasm','nucleus','chloroplasts','vacuole','eyepiece','objective','stage','clips','slide','light'],
  show: ['plant','animal','microscope'],
  objective: ['4','10','40'],
  eyepiece: ['5','10','15'],
  compare: ['similar','shape','wall','chloro','vacuole','size','nucleus'],
};

function actionGuide(lesson, catalog) {
  if (lesson === 'cell') {
    return `You can control the 3D models on screen by returning actions (at most 2, only when they help):
- {"type":"highlight","target":one of ${CELL_ACTIONS.highlight.map(x => `"${x}"`).join(', ')}}
- {"type":"show","target":"plant" | "animal" | "microscope"}
- {"type":"objective","target":"4" | "10" | "40"}
- {"type":"eyepiece","target":"5" | "10" | "15"}
- {"type":"compare","target":${CELL_ACTIONS.compare.map(x => `"${x}"`).join(' | ')}}`;
  }
  const lines = catalog.map(v => v.steps.map((s, i) => `- "${v.id}:${i}": ${s}`).join('\n')).join('\n');
  return `You can show a visual on screen by returning at most 1 action {"type":"show","target":"<visual>:<step>"} when it helps. Choose from:\n${lines}`;
}

function cleanCatalog(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 20).filter(v => v && /^[a-z0-9_-]{1,40}$/i.test(v.id) && Array.isArray(v.steps))
    .map(v => ({ id: v.id, steps: v.steps.slice(0, 6).map(s => String(s).slice(0, 160)) }));
}

function allowed(lesson, catalog, a) {
  if (!a || typeof a.type !== 'string') return false;
  const t = String(a.target);
  if (lesson === 'cell') return !!CELL_ACTIONS[a.type] && CELL_ACTIONS[a.type].includes(t);
  if (a.type !== 'show') return false;
  const [id, step] = t.split(':');
  const v = catalog.find(x => x.id === id);
  return !!v && /^\d+$/.test(step) && +step < v.steps.length;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Use POST' }); return; }
  const key = process.env.GEMINI_API_KEY;
  if (!key) { res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  const lesson = NOTES[body.lesson] ? body.lesson : 'cell';
  const message = String(body.message || '').slice(0, 500).trim();
  if (!message) { res.status(400).json({ error: 'Empty message' }); return; }
  const context = body.context || {};
  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
  const catalog = cleanCatalog(body.catalog);

  const system = `You are the friendly tutor inside an interactive lesson for learners in Kenya.

Teach ONLY from these notes. If a learner asks about something outside them, say briefly that it isn't part of this topic and steer back. Never invent facts beyond the notes.

${NOTES[lesson]}

The learners are seeing this topic for the first time. Use warm, simple, everyday English for a 13-year-old. Explain new words when you use them. Keep replies to 1-3 short sentences (under 60 words). No markdown, no lists.

If the learner is in the middle of a quiz question, do NOT give the answer. Give a hint that points them to the right idea instead.

${actionGuide(lesson, catalog)}

Always reply with JSON: {"reply": string, "actions": [ ... ]}.`;

  const ctx = `Where the learner is now: section "${String(context.section || '').slice(0, 80)}", phase "${String(context.phase || '').slice(0, 20)}". ` +
    (context.lesson ? `Tutor last said: "${String(context.lesson).slice(0, 300)}". ` : '') +
    (context.question ? `They are answering this quiz question (do not reveal the answer): "${String(context.question).slice(0, 300)}".` : '');

  const contents = [
    ...history.map(h => ({ role: h.role === 'model' ? 'model' : 'user', parts: [{ text: String(h.text || '').slice(0, 600) }] })),
    { role: 'user', parts: [{ text: `${ctx}\n\nLearner: ${message}` }] },
  ];

  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              reply: { type: 'STRING' },
              actions: { type: 'ARRAY', items: { type: 'OBJECT', properties: { type: { type: 'STRING' }, target: { type: 'STRING' } }, required: ['type', 'target'] } },
            },
            required: ['reply', 'actions'],
          },
        },
      }),
    });
    const data = await r.json();
    if (!r.ok) { res.status(502).json({ error: (data.error && data.error.message) || 'Gemini request failed' }); return; }
    const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
    let out;
    try { out = JSON.parse(text.replace(/```json|```/g, '').trim()); } catch { out = { reply: text, actions: [] }; }
    const actions = (Array.isArray(out.actions) ? out.actions : [])
      .filter(a => allowed(lesson, catalog, a)).slice(0, 2)
      .map(a => ({ type: a.type, target: String(a.target) }));
    res.status(200).json({ reply: String(out.reply || '').slice(0, 600), actions });
  } catch (e) {
    res.status(500).json({ error: 'Could not reach Gemini' });
  }
};
