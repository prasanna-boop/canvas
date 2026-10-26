# 2.1 The Cell — interactive tutor (MVP)

## What's in here
- `index.html` — the whole app: canvas, tutor, 3D models, lessons, quizzes and branching.
- `tutor.png` — the tutor avatar.
- `api/tutor.js` — a small server function that holds your Gemini key and answers students' questions.

## Deploy to Vercel
1. Push this folder to a GitHub repo, then in Vercel choose **Add New → Project** and import it.
   (Or install the Vercel CLI and run `vercel` inside this folder.)
2. In the project, open **Settings → Environment Variables** and add:
   - `GEMINI_API_KEY` = your Gemini API key
   - optional: `GEMINI_MODEL` (defaults to `gemini-flash-latest`)
3. Redeploy so the variable takes effect. Done.

The key stays on the server. It never appears in the page students load.

## Run it locally
`npx vercel dev` in this folder runs the page and the tutor function together.
Opening `index.html` directly works for everything except live questions.

## Editing the lesson
All lesson text, tutor lines, questions and revision content live in the `SECTIONS` array near the top of
`index.html`. Each section has `steps` (what the tutor says and what the 3D model does), `questions`
(each tagged with a `concept`), and `concepts` (the revision explanation and retry question used when a
student misses that concept).

## Before a wider rollout
- Add rate limiting to `api/tutor.js` (for example with Vercel's firewall rules) so the key can't be overused.
- The layout is built for laptops and tablets; phones work but the 3D models are small.
