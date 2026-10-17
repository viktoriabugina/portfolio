# Glow Studio — Beauty Reel 9:16

1080×1920 · 15 s · 30 fps · H.264 (Instagram Reels / TikTok)

**Render preview:** [`06_Renders/glow-studio-reel.mp4`](06_Renders/glow-studio-reel.mp4) · a browser version of the animation built from the storyboard lives in `02_Scripts/preview.html`.


## Quick start

1. Install the fonts from `04_Fonts/FONTS.md`.
2. Open **After Effects** (2020 or newer) → **File → Scripts → Run Script File…** → `02_Scripts/build_project.jsx`.
3. The script builds the whole project and saves **`01_Project/GlowStudio_Reel.aep`**, with the main comp already in the Render Queue (output → `06_Renders/`).
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

- 01_Comps / GlowStudio_Reel_1080x1920 — main comp (scenes + wipes)
- 02_Precomps / SC01_Intro … SC05_Endcard — one precomp per scene
- GUIDE_Reels_Safe_Zones — guide layer showing Instagram UI zones (not rendered)

## Techniques used

kinetic typography (per-character text animators), scene precomps, wipe transitions, trim-path circle draw, parented price rows, pulsing CTA expression, safe-zone guide layer.

## Upwork portfolio text

- **Title:** Instagram Reel — Glow Studio beauty salon
- **Description:** 15-second kinetic-typography Reel for a beauty salon: brand intro, services, first-visit offer, price list and a call to action. Built in After Effects with scene precomps, text animators and wipe transitions, respecting Reels safe zones.
- **Skills:** After Effects · Instagram Reels · Kinetic Typography · Social Media Video

*Fictional brand, concept project for portfolio.*
