# Lixr — See It · Clone It · Mix It

Lixr lets you clone any drink: scan a menu, snap a photo or describe a drink, and get a recipe you can make at home. It's a vanilla JS PWA with no build step.

- **Works offline:** the app, the 14-drink library, and your saved recipes, favorites and collections all work offline. Describe falls back to matching against the library when you're offline.
- **One-tap install:** Android and desktop get an Install button. iPhone shows a short "Add to Home Screen" guide.
- **Play Store ready:** see `play/PLAY-STORE.md`.
- **Mobile and tablet:** layouts adapt from phones up to tablets and desktop.
- **Themes:** Dark (default), Light or Auto, under Profile → Theme or the ☰ menu.
- **My Bar:** add what you have at home and see "What can I make?", ranked by how many ingredients you already own. Each recipe shows "You have 3 of 4" with "In bar" tags.
- **Shopping list:** one tap adds a drink's missing ingredients. You can share the list, then move checked items into My Bar after you shop.
- **Your own recipes:** write a new drink, or **Customize** any library or AI drink, which saves your own copy. The editor shows a live preview of the drink as you pick the glass, garnish and colors. You can edit or delete your own recipes, and share them by link.
- **21+ check:** on first launch, users choose 21+ or mocktails only. Cocktail clones have a Cocktail/Mocktail switch.

## Files
```
index.html            App shell
css/app.css           Styles and both themes
js/data.js            Built-in drink library (edit this to add drinks)
js/art.js             Drink illustrations drawn as SVG (no photos needed)
js/app.js             App logic, routing, camera, storage, sharing
sw.js                 Service worker (offline). Bump VERSION when you deploy changes
manifest.webmanifest  Install info, icons and shortcuts
privacy.html          Privacy policy (fill in [DATE] and [YOUR EMAIL])
icons/  fonts/        Icons and Poppins font (SIL Open Font License)
screens/              Store and install screenshots
api/                  PHP AI proxy for cPanel hosting
functions/api/        The same AI proxy for Cloudflare Pages
.well-known/          assetlinks.json for the Play Store app
play/                 Play Store guide, TWA config, icon, feature graphic
.htaccess  _headers   Server settings for cPanel and Cloudflare Pages
```

## Deploy on Cloudflare Pages (like your other apps)
1. Push this folder to a GitHub repo (for example `lixr-app`), then go to Cloudflare → Workers & Pages → Create → Pages → connect the repo.
2. Framework preset: **None**. Build command: *(empty)*. Output directory: `/`.
3. Settings → Variables and Secrets: add `ANTHROPIC_API_KEY` (as a secret) and `ALLOWED_ORIGINS` = `https://lixr.app,https://www.lixr.app`.
4. Optional: create a KV namespace and bind it as `LIXR_KV`. This turns on the per-visitor hourly limit and stores reports.
5. Custom domains: add `lixr.app`.

On Cloudflare, the `functions/api/*.js` files handle `/api/clone` and `/api/report`. The `api/*.php` files are only for cPanel and do nothing there.

## Deploy as a Cloudflare Worker (the newer "Import a repository" flow)
If Cloudflare made a **Worker** (the build runs `npx wrangler deploy`), the repo is ready for that too. `wrangler.jsonc` serves the static files, and `worker.js` handles `/api/clone` and `/api/report`.
1. Build command: *(empty)*. Deploy command: `npx wrangler deploy`. Root directory: `/`.
2. Worker → Settings → Variables and Secrets: add `ANTHROPIC_API_KEY` (Secret) and `ALLOWED_ORIGINS` (Text). These are runtime variables, not build variables.
3. Worker → Settings → Domains & Routes: add `lixr.app` as a custom domain.

## Deploy on cPanel
1. Upload everything to `public_html` (or the domain's folder) with File Manager, including `.htaccess` and `.well-known`. Turn on "Show hidden files" so you can see them.
2. Copy `api/config.sample.php` to `api/config.php`, then add your Anthropic API key and domain.
3. The server needs PHP 7.4+ with cURL, which is standard on cPanel.

## AI cloning
- The browser calls `/api/clone`, which adds your key on the server and calls Anthropic's API. The key never reaches the browser.
- Actions: `menu` (photo of a menu, returns up to 8 drinks), `photo` (one drink), `describe` (text).
- The model defaults to `claude-sonnet-5-5`. You can change it in `config.php` or the `LIXR_MODEL` variable.
- AI recipes are checked and cleaned in the browser before they're shown, and every AI clone has **Report this result**.

## Sharing
Library drinks share a normal link. AI clones and your own recipes share a link with the recipe packed into the URL, so it opens in Lixr without any server storage.

## Updating
Change files, then bump `VERSION` in `sw.js`. Installed apps show "A new version of Lixr is ready — Refresh".

## Adding drinks to the library
Add an entry to `js/data.js`. `glass` is one of rocks, highball, coupe, martini, hurricane or mug. `garnish` is one of pineapple, lime, strawberry, blackberry, mint, cream, beans, dragonfruit, orange, cherry, boba or none. `color` and `color2` are the top and bottom liquid colors. Add the new drink's id to the trending list in `js/app.js` if you want it on Home. Bump `VERSION` in `sw.js` when you're done.
