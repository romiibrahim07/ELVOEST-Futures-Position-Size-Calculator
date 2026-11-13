# ELVOEST Futures Position Size Calculator

A static, client-side PWA. No backend, account, database, paid API, trading fee or funding fee.

## Publish on GitHub Pages
1. Create a GitHub repository (for example `elvoest-calculator`).
2. Upload **all contents** of this folder to the repository root. Keep `index.html`, `manifest.webmanifest`, `sw.js`, and `icons/` in the same structure.
3. In GitHub: **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Open the published HTTPS URL once while online. The service worker caches the app shell for later offline use.

## Add to iPhone Home Screen
1. Open the published HTTPS URL in **Safari** (not an in-app browser).
2. Tap **Share**.
3. Choose **Add to Home Screen**, then tap **Add**.
4. Launch ELVOEST from the new Home Screen icon.

## Local behavior
- Save / Load / Reset affects only the four Account Settings fields.
- Saved settings use browser `localStorage` on the current device/browser.
- Trade parameters are not saved.
- The app has no network requests for calculations. Hosting is needed for the first visit and PWA installation; cached app shell can be opened offline afterwards.

## Calculation definitions
- Risk Amount = Balance × Risk %.
- Stop Loss Distance = |Entry − Stop Loss| / Entry.
- Position Size = Risk Amount / Stop Loss Distance.
- Quantity = Position Size / Entry.
- Required Margin = Position Size / Leverage.
- Margin Utilization = Required Margin / Balance × 100%.
- Potential Loss = Quantity × |Entry − Stop Loss|.
- Potential Profit = Quantity × |Take Profit − Entry|.
- ROI = Potential Profit / Required Margin × 100%.
- Risk/Reward is displayed as `1 : reward/risk`.

No trading fees or funding fees are included. Results are estimates and do not account for slippage, exchange-specific contract rules, liquidation, or maintenance margin.
