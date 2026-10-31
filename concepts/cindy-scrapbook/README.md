# Scrapbook redesign concept

Static HTML + one shared stylesheet, no build step needed to *run* it (open index.html).
To edit styles: `scss/` -> compile `scss/main.scss` to `style.css` (`npx sass scss/main.scss style.css`).

- `scss/_vars.scss`   container width, breakpoints
- `scss/_mixins.scss` `adaptive-value($property, $start, $min, $type)` fluid-size formula (320px -> container)
- `scss/_base.scss`   colour tokens (`:root`), type, buttons
- `scss/_paper.scss`  scrapbook kit: tape, polaroid, sticker, stamp, paper card
- `scss/_layout.scss` nav, hero, sections, guide template
