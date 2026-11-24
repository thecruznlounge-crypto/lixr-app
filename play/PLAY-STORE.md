# Putting Lixr on Google Play

Lixr goes on the Play Store as a **Trusted Web Activity (TWA)**: a small Android app that opens your live site full screen. Updates you deploy to the site show up in the app right away, so no new store release is needed.

## Before you start
1. Lixr is live on HTTPS at `https://lixr.app` (or your domain), with the AI set up (see README).
2. Open the site in Chrome on your phone, then check that **Install** works and that the app opens offline after one visit.
3. Fill in the `[DATE]` and `[YOUR EMAIL]` placeholders in `privacy.html`.

## Option A — PWABuilder (easiest, no installs)
1. Go to **pwabuilder.com**, enter `https://lixr.app`, then click **Package for stores → Android**.
2. Package ID: `app.lixr.twa`. App name: `Lixr — Clone Any Drink`. Launcher name: `Lixr`.
3. Signing key: **Create new**. Download the zip and keep the `signing.keystore` and `signing-key-info.txt` somewhere safe, since you need them for every update.
4. In the zip, open `assetlinks.json` and copy its contents into `.well-known/assetlinks.json` on your site.
5. Upload the `.aab` file to Play Console.

## Option B — Bubblewrap CLI
```
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://lixr.app/manifest.webmanifest
# or start from play/twa-manifest.json in this folder
bubblewrap build
```
This creates `app-release-bundle.aab`. Upload that file to Play Console.

## Link the app to your site (required, or Chrome's address bar shows in the app)
1. Play Console → your app → **Setup → App integrity → App signing**, then copy the **SHA-256 certificate fingerprint**.
2. Paste it into `.well-known/assetlinks.json` in place of `REPLACE_WITH_YOUR_PLAY_APP_SIGNING_SHA256`. Keep the package name `app.lixr.twa`.
3. Deploy, then check that `https://lixr.app/.well-known/assetlinks.json` opens as JSON.

## Play Console checklist
- **App category:** Food & Drink.
- **Content rating:** Lixr references alcohol, so answer *yes* to alcohol in the IARC questionnaire. Expect a Teen or Mature rating. Lixr already has a 21+ check and a mocktails-only mode.
- **Target audience:** 18+ (or 21+). Do not select children's age groups.
- **AI-generated content:** Lixr clones are AI-generated. Play requires a way to report offensive output, and the **Report this result** button on every AI clone covers this.
- **Data safety form:**
  - Photos: *collected* (sent to the server to create the recipe), *not shared* for advertising, *not stored*, processed ephemerally, encrypted in transit.
  - App activity / other user content: reports, which users send voluntarily.
  - No location, contacts, accounts or advertising ID.
- **Privacy policy URL:** `https://lixr.app/privacy.html`
- **Camera permission:** the TWA uses Chrome's camera permission, so you don't need to declare anything extra.
- **Trademarks:** keep brand names out of the app's store text and screenshots. The library recipes use generic names, and the AI is told not to put brands in drink names.

## Store listing assets (in `play/`)
- `play-icon-512.png`: the 512×512 icon.
- `feature-graphic.png`: the 1024×500 feature graphic.
- `screens/`: phone and tablet screenshots, in light and dark themes.

## Updating
Deploy the site and users get the change on their next open. To change the app's name, icon or package details, bump `appVersionCode` in `twa-manifest.json`, rebuild the bundle and upload it.
