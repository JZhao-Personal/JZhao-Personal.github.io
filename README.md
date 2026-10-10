# Jian Zhao · Personal homepage

Single-page academic homepage adapted from [Sen Li’s template](https://github.com/senli1073/academic-homepage-template).

Live site: https://jzhao-personal.github.io/

## Edit and preview

Edit `contents/*.md` for page content and `contents/config.yml` for sections and backgrounds. Run `python3 -m http.server 8765 --bind 127.0.0.1` and open http://127.0.0.1:8765/ to preview. No build step is required.

GitHub Pages publishes the repository root from the `main` branch. Pushing updates to `main` redeploys the site. `.nojekyll` keeps Markdown available for the client-side renderer.

Run checks with `node --test tests/*.test.js`.

## Assets and attribution

The original template’s MIT license and footer attribution are retained. Photographs, logos and fonts have separate rights:

- Body font: [LXGW 975 Yuan SC](https://github.com/lxgw/975Yuan), bundled under SIL OFL 1.1; see `static/assets/fonts/OFL.txt`. Headings use Avenir Next when installed, with system fallbacks.
- Background photo sources and public-domain/CC0 records: `static/assets/background/SOURCES.md`.
- Institution logo sources: `static/assets/institutions/SOURCES.md`.
- Profile photo supplied by Jian Zhao; not covered by the template license.
- Theme colors: `PALETTE.md`.

Citation labels are static and were checked on 2026-10-10. Bootstrap Icons and MathJax load from jsDelivr. Background order is randomized, with localStorage preventing consecutive visits from starting on the same photo where storage is available.
