# Flowly — App Promo

1920×1080 · 20 s · 30 fps · H.264

**Render preview:** [`06_Renders/flowly-app-promo.mp4`](06_Renders/flowly-app-promo.mp4) · a browser version of the animation built from the storyboard lives in `02_Scripts/preview.html`.


## Quick start

1. Install the fonts from `04_Fonts/FONTS.md`.
2. Open **After Effects** (2020 or newer) → **File → Scripts → Run Script File…** → `02_Scripts/build_project.jsx`.
3. The script builds the whole project and saves **`01_Project/Flowly_AppPromo.aep`**, with the main comp already in the Render Queue (output → `06_Renders/`).
4. Add music (`05_Audio`), press **Render** — and export a GIF/MP4 for Upwork and Behance.

> Why a script and not only an .aep? An .aep is a binary file that's hard to review on GitHub. The script is readable code that rebuilds the exact project in any After Effects version — and it shows that I can automate AE with ExtendScript. After the first run, commit the generated .aep too (see the root README about Git LFS).

## Folder structure

```
01_Project/      .aep project file (created by the script)
02_Scripts/      build_project.jsx — builds the project
03_Assets/       Images, Footage, Vectors (logo SVG)
04_Fonts/        list of fonts with download links
05_Audio/        music / SFX
06_Renders/      final MP4 renders
07_Storyboard/   timing and scene description
```

## Project panel

- 01_Comps / Flowly_AppPromo_1920x1080 — main comp
- 02_Precomps / SC01_Problem, SC02_Product, SC03_Features, SC04_Endcard
- 02_Precomps / PRE_Dashboard_UI — the app interface (same design as the Flowly landing page)

## Techniques used

UI animation, animated counter (Source Text expression), staggered bar chart, checkmarks with trim paths, wiggle expression, nested precomps, push-in crossfades.

## Upwork portfolio text

- **Title:** SaaS App Promo Video — Flowly
- **Description:** 20-second product promo for a SaaS app: problem → animated product UI → key features → call to action. I designed the interface for the landing page and animated it in After Effects, so the video and the website share one visual system.
- **Skills:** After Effects · UI Animation · Explainer Video · SaaS · Motion Design

*Fictional brand, concept project for portfolio.*
