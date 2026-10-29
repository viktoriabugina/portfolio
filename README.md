# BV Studio by Victoria — Design · Code · Motion

Portfolio of web design, front-end and motion design work.

**Live site:** https://viktoriabugina.github.io/portfolio/ · **Hire me:** [Upwork](https://www.upwork.com/freelancers/~0108ed036a1d592a49)

| | Project | What it shows |
|---|---|---|
| 🌐 | [Flowly — SaaS landing](web/01-flowly-saas-landing/) | UX/UI, HTML/SCSS/JS, pricing toggle, tabs, validation |
| 🌐 | [Nordline — real estate landing](web/02-nordline-real-estate/) | Apartment filter, calculator, modal, phone mask |
| 🌐 | [Ledgerly — fintech SaaS](web/04-ledgerly-fintech-saas/) | Animated dashboard, GSAP scroll motion, pricing switch |
| 🌐 | [Memora — AI meeting notes](web/05-memora-ai-landing/) | Live transcript animation, stacking cards, horizontal scroll |
| 🌐 | [Routa — corporate rides app](web/06-routa-mobility-app/) | Route animation, scroll-driven phone screens |
| 🌐 | [Kubik — no-code builder](web/07-kubik-nocode-builder/) | Animated editor, responsive preview, 3D tilt cards |
| 🌐 | [Norvela — medical equipment site](web/08-norvela-diagnostics/) | Static HTML/SCSS/JS on Gulp + Webpack, Turnstile-protected form, Cloudflare Pages Function |
| 🌐 | [Matoa — store layout](web/09-matoa-store-layout/) | Figma to code (training), product slider, adaptive cards, mobile accordion |
| 🌐 | [Somna — DTC advertorial and listicle](web/10-somna-dtc-advertorial/) | Mobile-first pre-sell pages: offer box, bundle picker, sticky mobile CTA |
| 🌐 | [Personal site](web/03-victoria-personal-site/) | Portfolio website, kinetic typography |
| 🎬 | [Flowly — logo reveal](motion/01-flowly-logo-reveal/) | After Effects: shape layers, mattes, expressions |
| 🎬 | [Glow Studio — Reel 9:16](motion/02-glow-studio-reel-9x16/) | Kinetic typography for Instagram Reels |
| 🎬 | [Flowly — app promo](motion/03-flowly-app-promo/) | UI animation, explainer structure |
| 🎬 | [Zesta — logo animation](motion/04-zesta-logo-animation/) | Squash & stretch, shape morph, letter bounce |
| 🎬 | [Nordhaus — logo animation](motion/05-nordhaus-logo-animation/) | Trim-path line draw, fill wipe, lockup |
| 🎬 | [Petalé — logo animation](motion/06-petale-logo-animation/) | Petal bloom with overshoot, swash draw |
| ✦ | [BV Studio — own brand identity](brand/bv-studio/) + [logo animation](motion/07-bv-studio-logo-animation/) | Monoline monogram, lockup, app icon, trim-path draw |

Trained in UX/UI & landing pages, HTML/CSS/JS front-end and motion design in After Effects with practicing freelance mentors.

## Publish on GitHub Pages

```bash
git init
git lfs install            # for .aep and video files (see .gitattributes)
git add .
git commit -m "Portfolio: 7 websites + 6 motion projects"
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

*BV Studio is my own brand. All other brands are fictional and created for the portfolio, except Matoa, a training layout of a real brand's mockup (not affiliated).*
