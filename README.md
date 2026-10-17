# Victoria — Design · Code · Motion

Portfolio of web design, front-end and motion design work.

| | Project | What it shows |
|---|---|---|
| 🌐 | [Flowly — SaaS landing](web/01-flowly-saas-landing/) | UX/UI, HTML/SCSS/JS, pricing toggle, tabs, validation |
| 🌐 | [Nordline — real estate landing](web/02-nordline-real-estate/) | Apartment filter, calculator, modal, phone mask |
| 🌐 | [Ledgerly — fintech SaaS](web/04-ledgerly-fintech-saas/) | Animated dashboard, GSAP scroll motion, pricing switch |
| 🌐 | [Memora — AI meeting notes](web/05-memora-ai-landing/) | Live transcript animation, stacking cards, horizontal scroll |
| 🌐 | [Routa — corporate rides app](web/06-routa-mobility-app/) | Route animation, scroll-driven phone screens |
| 🌐 | [Kubik — no-code builder](web/07-kubik-nocode-builder/) | Animated editor, responsive preview, 3D tilt cards |
| 🌐 | [Personal site](web/03-victoria-personal-site/) | Portfolio website, kinetic typography |
| 🎬 | [Flowly — logo reveal](motion/01-flowly-logo-reveal/) | After Effects: shape layers, mattes, expressions |
| 🎬 | [Glow Studio — Reel 9:16](motion/02-glow-studio-reel-9x16/) | Kinetic typography for Instagram Reels |
| 🎬 | [Flowly — app promo](motion/03-flowly-app-promo/) | UI animation, explainer structure |

Trained in UX/UI & landing pages, HTML/CSS/JS front-end and motion design in After Effects with practicing freelance mentors.

## Publish on GitHub Pages

```bash
git init
git lfs install            # for .aep and video files (see .gitattributes)
git add .
git commit -m "Portfolio: 7 websites + 3 motion projects"
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

Then **Settings → Pages → Source: Deploy from a branch → main / (root)**.
Your sites will be live at `https://<your-username>.github.io/portfolio/` (opens the personal site) and
`…/portfolio/web/01-flowly-saas-landing/` etc. Put these links into the Upwork portfolio items.

## Motion projects

Each motion folder has `02_Scripts/build_project.jsx`. Run it in After Effects (File → Scripts → Run Script File…) —
it builds the full project, saves the `.aep` into `01_Project/` and queues the render to `06_Renders/`.

*All brands are fictional; projects are created for the portfolio.*
