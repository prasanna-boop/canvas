# Interactive science lessons (MVP)

Four lessons run on one shared engine:

- 2.1 The Cell (Grade 8)
- 2.2 Movement of materials in and out of the cell (Grade 8)
- 1.1 Elements and compounds (Grade 8)
- 3.2 Waves (Grade 9)

Switch lessons with the menu at the top of the screen, or link straight to one with
`?lesson=cell`, `?lesson=movement`, `?lesson=elements` or `?lesson=waves`.

## What's in the folder

- `index.html`: the engine (canvas, tutor, quizzes, revision, lesson switcher).
- `engine/kit.js`: shared building blocks for 3D models and flat pictures.
- `lessons/*.js`: one file per lesson, with its lesson cards, visuals, tutor lines, questions and revision.
- `api/tutor.js`: the server function that holds your Gemini key and keeps the live tutor to each lesson's notes.
- `tutor.png`: the tutor avatar.

## Deploy to Vercel

1. Push this folder to your GitHub repo (the contents, so `index.html` sits at the top level).
2. In Vercel, choose **Add New → Project** and import the repo.
3. Under **Settings → Environment Variables**, add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`, default `gemini-flash-latest`).
4. Redeploy. Every push to GitHub redeploys automatically after that.

The key stays on the server and never reaches students' browsers.

## Run it locally

- Without the live tutor: `python3 -m http.server 8000` in this folder, then open http://localhost:8000
- With the live tutor: `npx vercel dev` in this folder, with a `.env` file containing `GEMINI_API_KEY=...` (never commit that file).

## Adding or editing a lesson

Copy one of the files in `lessons/`, change the content, add a `<script>` tag for it in `index.html`,
and add its id to the `ORDER` list near the top of the engine script. Each section lists its `visuals`,
its `questions` (each tagged with a `concept`) and its `concepts` (the revision explanation and retry question).
Visuals with `steps` are walked through automatically by the tutor. Also add the lesson's notes to
`NOTES` in `api/tutor.js` so the live tutor stays on topic.

## Before a wider rollout

- Add rate limiting to the tutor function (for example with Vercel's firewall rules) so the key can't be overused.
- Built for laptops and tablets. Phones work, but the visuals are small.
