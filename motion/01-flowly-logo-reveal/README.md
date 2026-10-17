# Flowly — Logo Reveal

1920×1080 · 6 s · 30 fps · H.264

## Quick start

1. Install the fonts from `04_Fonts/FONTS.md`.
2. Open **After Effects** (2020 or newer) → **File → Scripts → Run Script File…** → `02_Scripts/build_project.jsx`.
3. The script builds the whole project and saves **`01_Project/Flowly_LogoReveal.aep`**, with the main comp already in the Render Queue (output → `06_Renders/`).
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

- 01_Comps / Flowly_LogoReveal_1920x1080 — main comp
- 02_Precomps / PRE_Logo_Mark — 3 bars + ring burst

## Techniques used

shape layers, bottom-anchored scale with overshoot, track matte reveal, trim paths, text animator (word reveal), parenting to a camera-push null, expressions (sine "breathing").

## Upwork portfolio text

- **Title:** Logo Animation — Flowly (SaaS brand)
- **Description:** Animated logo reveal for a SaaS product: the bar-chart logo mark grows in, the wordmark slides out through a matte and the tagline types in. Built in After Effects with shape layers, track mattes, trim paths and expressions. Delivered as MP4 + editable .aep.
- **Skills:** After Effects · Logo Animation · Motion Graphics · Shape Animation

*Fictional brand, concept project for portfolio.*
