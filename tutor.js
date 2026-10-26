// Vercel serverless function: POST /api/tutor
// Keeps the Gemini API key on the server. Set GEMINI_API_KEY in Vercel → Settings → Environment Variables.
// Optional: GEMINI_MODEL (defaults to the auto-updating "gemini-flash-latest" alias).

const NOTES = `
2.1 THE CELL (Grade 8 Integrated Science, Kenya CBE)

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
Worked: eyepiece ×15, objective ×10 → ×150. Eyepiece ×15 with ×4, ×10, ×40 → ×60, ×150, ×600. Eyepiece ×10 with ×4, ×10, ×40 → ×40, ×100, ×400.
`;

const SYSTEM = `You are the friendly tutor inside an interactive lesson for Grade 8 learners in Kenya. The topic is "2.1 The Cell".

Teach ONLY from these notes. If a learner asks about something outside them (for example mitochondria or ribosomes), say briefly that it isn't part of this topic and steer back. Never invent facts beyond the notes.

${NOTES}

Style: warm, encouraging, simple English for a 13-year-old. Keep replies to 1-3 short sentences (under 60 words). No markdown, no lists.

If the learner is in the middle of a quiz question, do NOT give the answer. Give a hint that points them to the right idea instead.

You can control the 3D models on screen by returning actions. Use at most 2 actions, and only when they help the explanation:
- {"type":"highlight","target":one of "wall","membrane","cytoplasm","nucleus","chloroplasts","vacuole","eyepiece","objective","stage","clips","slide","light"}
- {"type":"show","target":"plant" | "animal" | "microscope"}
- {"type":"objective","target":"4" | "10" | "40"}
- {"type":"eyepiece","target":"5" | "10" | "15"}
- {"type":"compare","target":"similar" | "shape" | "wall" | "chloro" | "vacuole" | "size" | "nucleus"}

Always reply with JSON: {"reply": string, "actions": [ ... ]}.`;

const ALLOWED = {
  highlight: ['wall','membrane','cytoplasm','nucleus','chloroplasts','vacuole','eyepiece','objective','stage','clips','slide','light'],
  show: ['plant','animal','microscope'],
  objective: ['4','10','40'],
  eyepiece: ['5','10','15'],
  compare: ['similar','shape','wall','chloro','vacuole','size','nucleus'],
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Use POST' }); return; }
  const key = process.env.GEMINI_API_KEY;
  if (!key) { res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const message = String((body && body.message) || '').slice(0, 500).trim();
  if (!message) { res.status(400).json({ error: 'Empty message' }); return; }
  const context = body.context || {};
  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

  const ctx = `Where the learner is now: section "${String(context.section || '').slice(0,80)}", ` +
    `phase "${String(context.phase || '').slice(0,20)}". ` +
    (context.lesson ? `Tutor last said: "${String(context.lesson).slice(0,300)}". ` : '') +
    (context.question ? `They are answering this quiz question (do not reveal the answer): "${String(context.question).slice(0,300)}".` : '');

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
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents,
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              reply: { type: 'STRING' },
              actions: { type: 'ARRAY', items: { type: 'OBJECT', properties: {
                type: { type: 'STRING', enum: Object.keys(ALLOWED) },
                target: { type: 'STRING' } }, required: ['type','target'] } },
            },
            required: ['reply','actions'],
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
      .filter(a => a && ALLOWED[a.type] && ALLOWED[a.type].includes(String(a.target)))
      .slice(0, 2)
      .map(a => ({ type: a.type, target: String(a.target) }));
    res.status(200).json({ reply: String(out.reply || '').slice(0, 600), actions });
  } catch (e) {
    res.status(500).json({ error: 'Could not reach Gemini' });
  }
};
