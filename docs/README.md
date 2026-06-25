# Building a Second Brain with Agentic AI

An interactive, self-contained e-learning course — plain HTML/CSS/JS, no build step and no dependencies.

**Audience:** people who want to build their own second-brain AI agent · **Duration:** ~10 minutes
Built on Gagné's Nine Events of Instruction, after Andrej Karpathy's *LLM Wiki* pattern and Hermes Agent (Nous Research).

## Files
| File | Purpose |
|------|---------|
| `index.html` | The course (entry point). 6 decision points, 3 activities, 4 branching endings, recovery paths, live build diagram, light/dark + text-size controls. |
| `overview.html` | The course map: branching logic, recovery loops, and Gagné signposts. Linked from the course's "Map" button. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (skip Jekyll). |
| `second-brain-course-site.zip` | Downloadable copy of the site. |

## Deploy to GitHub Pages
1. Put `index.html`, `overview.html`, and `.nojekyll` at the location Pages serves from — the repo **root**, or a **`/docs`** folder, or this folder if you point Pages at it.
2. Repo **Settings → Pages → Source**: pick your branch and the matching folder.
3. Open the published URL — `index.html` loads automatically; the "Map" button opens `overview.html`.

Keep `index.html` and `overview.html` in the same folder so their relative links work. No server or internet required; narration uses the browser's built-in speech, and theme/text-size preferences use `localStorage`.
