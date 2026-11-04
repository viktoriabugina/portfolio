# Lumo — WordPress block theme (coffee roastery)

Live demo (static snapshot of the theme, GitHub Pages): https://viktoriabugina.github.io/portfolio/web/12-lumo-wordpress/

- Block theme, `theme.json` v3, patterns and templates for the home page, roasts archive and single roast, brew guides, visit page
- Custom post type `roast` with post meta (origin, process, altitude, notes) shown through Block Bindings, no page-builder plugin
- Styles and scripts built on a Gulp + Webpack + SCSS (BEM) pipeline: sources in `src/`, compiled files in `lumo/assets/`
- Montserrat and Inter, self-hosted
- Motion kept restrained: Lenis smooth scroll, headline reveal by words, photo parallax, block reveal, soft card tilt; respects `prefers-reduced-motion`
- Images in the demo are placeholders to be replaced by client photography

Install: copy `lumo/` into `wp-content/themes/` and activate.
