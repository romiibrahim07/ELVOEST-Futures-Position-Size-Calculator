# ELVOEST Personal Trading Tools

A free, local-first, multi-page PWA for personal use.

## Pages
- `/` — Landing page
- `/calculators/futures/` — Futures Position Size Calculator
- `/calculators/compounding/` — Compounding Calculator with interactive growth chart

## Deploy to GitHub Pages
Upload the contents of this folder to the root of your GitHub repository. In Settings → Pages, select Deploy from a branch, `main`, and `/(root)`.

## Notes
- No backend, login, paid API, or database.
- Compounding is a mathematical projection. Each period applies the percentage return to the current balance, then adds the optional deposit.
- Futures calculator retains its original sizing formulas and local account settings.
- PWA offline caching is provided by `sw.js`.
