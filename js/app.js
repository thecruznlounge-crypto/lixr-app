/* Lixr — app logic. Vanilla JS, no build step. */
(function () {
  'use strict';

  const LIB = window.LIXR_LIBRARY;
  const CATS = window.LIXR_CATS;
  const { drinkSVG } = window.LixrArt;
  const API = 'api/clone';
  const REPORT_API = 'api/report';
  const VERSION = '1.1.0';
  const $ = (s, el = document) => el.querySelector(s);
  const view = $('#view');

  // ---------- Icons ----------
  const I = {
    menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    camera: '<svg viewBox="0 0 24 24"><path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    photo: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/></svg>',
    keys: '<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></svg>',
    glass: '<svg viewBox="0 0 24 24"><path d="M4 4h16l-8 9z"/><path d="M12 13v7M8 20h8"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v7h14v-7"/></svg>',
    flash: '<svg viewBox="0 0 24 24"><path d="M13 2L5 14h6l-1 8 8-12h-6z"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 14h7M9 17h5"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 19h14"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/></svg>',
    compass: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
    folder: '<svg viewBox="0 0 24 24"><path d="M3 6h7l2 2h9v11H3z"/></svg>',
    flag: '<svg viewBox="0 0 24 24"><path d="M5 21V4h11l-2 4 2 4H5"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  const LOGO_X = '<svg viewBox="0 0 48 62" aria-hidden="true"><path d="M7 10L24 34L41 10Z" fill="var(--brand)" opacity="0.35"/><path d="M4 8h40" stroke="var(--brand)" stroke-width="6" stroke-linecap="round"/><path d="M7 10L41 58M41 10L7 58" stroke="var(--brand)" stroke-width="7" stroke-linecap="round"/><circle cx="37" cy="3" r="3" fill="var(--brand)"/></svg>';
  const LOGO = `<div class="logo" role="img" aria-label="Lixr"><span>Li</span>${LOGO_X}<span>r</span></div>`;

  // ---------- Storage ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('lixr.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('lixr.' + k, JSON.stringify(v)); } catch (e) { toast('Storage is full. Remove some saved drinks.'); } }
  };
  const settings = Object.assign({ theme: 'dark', units: 'oz', mode: 'all', age: null, seenActivity: 0 }, store.get('settings', {}));
  const db = {
    recipes: store.get('recipes', {}),   // AI and shared recipes, by id
    saved: store.get('saved', []),
    favs: store.get('favs', []),
    collections: store.get('collections', []),
    history: store.get('history', []),   // [{id, at}]
    bar: store.get('bar', []),           // ingredients the user has at home (normalized)
    shop: store.get('shop', [])          // shopping list [{id, item, done}]
  };
  const save = (k) => store.set(k, k === 'settings' ? settings : db[k]);

  // ---------- Helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function getRecipe(id) { return LIB.find(r => r.id === id) || db.recipes[id] || null; }
  const mocktailOnly = () => settings.mode === 'mocktail';
  // ---------- My Bar matching ----------
  const STAPLES = ['ice', 'crushed ice', 'water'];
  function norm(s) {
    return String(s || '').toLowerCase().replace(/\(.*?\)/g, ' ')
      .replace(/\b(fresh|freshly|chilled|cooled|cold|hulled|cooked|warm|for the glass|optional|ground|whole)\b/g, ' ')
      .replace(/\b(slices?|leaves|pieces|sprigs?|wedges?)\b/g, ' ')
      .replace(/[^a-z0-9\u00e0-\u00ff ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const reEsc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const isStaple = item => STAPLES.includes(norm(item));
  function inBar(item) {
    const n = norm(item);
    if (!n || isStaple(item)) return true;
    return db.bar.some(b => new RegExp('\\b' + reEsc(b) + '\\b').test(n) || new RegExp('\\b' + reEsc(n) + '\\b').test(b));
  }
  function barStats(ings) {
    const real = ings.filter(i => !isStaple(i.item));
    const missing = real.filter(i => !inBar(i.item));
    return { have: real.length - missing.length, total: real.length, missing };
  }
  function partFor(r) { return (mocktailOnly() && r.cat === 'cocktail' && r.mocktail) ? r.mocktail : r; }

  function visibleLib() { return LIB.filter(r => !mocktailOnly() || r.cat !== 'cocktail' || r.mocktail); }
  const FR = [[0, ''], [0.25, '¼'], [0.333, '⅓'], [0.5, '½'], [0.667, '⅔'], [0.75, '¾'], [1, '']];
  function frac(n) {
    let w = Math.floor(n), f = n - w, best = FR[0], d = 9;
    FR.forEach(p => { const dd = Math.abs(f - p[0]); if (dd < d) { d = dd; best = p; } });
    if (best[0] === 1) { w += 1; best = FR[0]; }
    if (d > 0.09) return String(Math.round(n * 10) / 10);
    return (w ? w + (best[1] ? ' ' : '') : '') + best[1] || '0';
  }
  function fmtAmt(i, scale) {
    if (i.amt == null || i.amt === '') return '';
    let a = Number(i.amt) * scale, u = i.unit || '';
    if (!isFinite(a)) return esc(String(i.amt));
    if (u === 'oz' && settings.units === 'ml') return Math.max(5, Math.round(a * 29.5735 / 5) * 5) + ' ml';
    let s = frac(a);
    if (u === 'shots' && a === 1) u = 'shot';
    return s + (u ? ' ' + u : '');
  }
  function toast(msg, action) {
    const t = $('#toast');
    t.innerHTML = esc(msg) + (action ? ` <button type="button">${esc(action.label)}</button>` : '');
    if (action) t.querySelector('button').onclick = () => { action.fn(); t.classList.remove('show'); };
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), action ? 8000 : 2800);
  }
  function uid(p) { return p + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  // ---------- Theme ----------
  const mql = matchMedia('(prefers-color-scheme: light)');
  function applyTheme() {
    let t = settings.theme;
    if (t === 'system') t = mql.matches ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    $('#themeColor').setAttribute('content', t === 'light' ? '#F7F2FB' : '#0B0710');
  }
  mql.addEventListener && mql.addEventListener('change', () => settings.theme === 'system' && applyTheme());
  applyTheme();

  // ---------- Sheet / drawer ----------
  let lastFocus = null;
  function openSheet(html, label) {
    lastFocus = document.activeElement;
    const sh = $('#sheet');
    sh.innerHTML = '<div class="grab"></div>' + html;
    sh.setAttribute('aria-label', label || 'Dialog');
    sh.hidden = false; $('#scrim').hidden = false;
    const f = sh.querySelector('input, textarea, button, a'); f && f.focus();
  }
  function closeSheet() {
    $('#sheet').hidden = true; $('#drawer').hidden = true; $('#scrim').hidden = true;
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  $('#scrim').addEventListener('click', closeSheet);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#scrim').hidden) closeSheet(); });

  function openDrawer() {
    lastFocus = document.activeElement;
    const d = $('#drawer');
    const light = document.documentElement.dataset.theme === 'light';
    d.innerHTML = `${LOGO}
      <a href="#/home">${I.home}Home</a>
      <a href="#/clone/scan">${I.camera}Clone a Drink</a>
      <a href="#/discover">${I.compass}Discover</a>
      <a href="#/recipes">${I.glass}My Recipes</a>
      <a href="#/favorites">${I.heart}Favorites</a>
      <a href="#/recipes/collections">${I.folder}Collections</a>
      <a href="#/recipes/bar">${I.list}My Bar &amp; Shopping</a>
      <a href="#/edit/new">${I.plus}New recipe</a>
      <a href="#/profile">${I.user}Profile &amp; Settings</a>
      <button class="item" type="button" data-act="toggle-theme">${light ? I.moon : I.sun}${light ? 'Dark theme' : 'Light theme'}</button>
      ${canInstall() ? `<button class="item" type="button" data-act="install">${I.download}Install Lixr</button>` : ''}
      <a href="privacy.html">${I.shield}Privacy</a>`;
    d.hidden = false; $('#scrim').hidden = false;
    d.querySelector('a').focus();
  }

  // ---------- Install ----------
  let deferredPrompt = null;
  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; if (route().name === 'home') render(); });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; toast('Lixr is installed.'); render(); });
  const canInstall = () => !isStandalone() && (deferredPrompt || isIOS);
  async function install() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(() => {});
      deferredPrompt = null; render();
    } else if (isIOS) {
      openSheet(`<h2>Install Lixr</h2><p>On iPhone or iPad:</p>
        <ol class="steps"><li>Tap the Share button in Safari.</li><li>Choose “Add to Home Screen”.</li><li>Tap “Add”. Lixr opens full screen, even offline.</li></ol>
        <button class="btn wide" type="button" data-act="close" style="margin-top:16px">Got it</button>`, 'Install Lixr');
    }
  }

  // ---------- Router ----------
  function route() {
    const h = (location.hash || '#/home').slice(2).split('/');
    return { name: h[0] || 'home', a: h[1] ? decodeURIComponent(h[1]) : '', b: h[2] ? decodeURIComponent(h[2]) : '' };
  }
  const TAB_OF = { home: 'home', discover: 'discover', recipes: 'recipes', collection: 'recipes', edit: 'recipes', favorites: 'favorites', profile: 'profile' };
  const NO_TABS = ['clone'];
  let current = null;

  function render() {
    const r = route();
    if (current === 'clone' && r.name !== 'clone') stopCamera();
    current = r.name;
    document.body.classList.toggle('hide-tabs', NO_TABS.includes(r.name));
    view.className = r.name === 'clone' ? 'flush no-tabs' : '';
    document.querySelectorAll('.tabbar a').forEach(a => {
      if (a.dataset.tab === TAB_OF[r.name]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const fn = VIEWS[r.name] || VIEWS.home;
    view.innerHTML = fn(r);
    after[r.name] && after[r.name](r);
  }
  window.addEventListener('hashchange', () => {
    $('#sheet').hidden = true; $('#drawer').hidden = true; $('#scrim').hidden = true;
    render(); window.scrollTo(0, 0); view.focus({ preventScroll: true });
  });
  // Turn the camera off when the app is in the background, back on when it returns.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopCamera();
    else if (current === 'clone' && route().a !== 'describe' && !$('.viewfinder img.still')) startCamera();
  });

  // ---------- Card helpers ----------
  function cardHTML(r, sub) {
    const isFav = db.favs.includes(r.id);
    const name = esc(r.name);
    const label = sub != null ? sub : r.source === 'custom' ? 'My recipe' : (mocktailOnly() && r.cat === 'cocktail' ? 'Mocktail' : 'Clone');
    return `<a class="card" href="#/r/${encodeURIComponent(r.id)}"><div class="art">${drinkSVG(r)}</div>
      ${isFav ? `<span class="heart" aria-label="Favorite">${I.heart}</span>` : ''}
      <div class="label">${name}<small>${esc(label)}</small></div></a>`;
  }
  function rowHTML(r, extra) {
    return `<a class="row" href="#/r/${encodeURIComponent(r.id)}"><div class="thumb">${drinkSVG(r)}</div>
      <div class="grow"><div class="t">${esc(r.name)}</div><div class="s">${esc(extra || catLabel(r))}</div></div>${I.chev}</a>`;
  }
  const catLabel = r => (CATS.find(c => c.id === r.cat) || { label: 'Drink' }).label.replace(/s$/, '') + ({ ai: ' · Your clone', custom: ' · My recipe', shared: ' · Shared' }[r.source] || '');
  function emptyHTML(icon, title, text, cta) {
    return `<div class="empty-state">${icon}<h3>${esc(title)}</h3><p>${esc(text)}</p>${cta || ''}</div>`;
  }
  function hasActivity() {
    return !!swWaiting || db.history.some(h => h.at > settings.seenActivity);
  }

  // ---------- Views ----------
  const HERO = { name: 'Clone any drink', glass: 'rocks', color: '#C46BFF', color2: '#5A0A8C', garnish: 'lime' };
  const VIEWS = {
    home() {
      const trending = ['blue-wave', 'strawberry-cognac-smash', 'chocolate-martini'].map(getRecipe);
      return `<div class="wrap">
      <header class="topbar">
        <button class="iconbtn" type="button" aria-label="Menu" data-act="drawer">${I.menu}</button>
        <div class="brand">${LOGO}<div class="tagline">See It · Clone It · Mix It</div></div>
        <button class="iconbtn" type="button" aria-label="Activity" data-act="activity">${I.bell}${hasActivity() ? '<span class="dot"></span>' : ''}</button>
      </header>
      <section class="hero" aria-labelledby="heroT">
        <div class="hero-copy">
          <h2 id="heroT">Clone<br>Any Drink</h2>
          <p>Scan a menu, snap a photo, or describe a drink and get a matchable recipe.</p>
          <a class="btn" href="#/clone/scan">Clone a Drink ${I.arrow}</a>
        </div>
        <div class="hero-art" aria-hidden="true">${drinkSVG(HERO)}</div>
      </section>
      <nav class="tiles" aria-label="Ways to clone">
        <a class="tile" href="#/clone/scan">${I.camera}Scan Menu</a>
        <a class="tile" href="#/clone/photo">${I.photo}Photo Clone</a>
        <a class="tile" href="#/clone/describe">${I.keys}Describe It</a>
      </nav>
      ${canInstall() && !store.get('installDismissed', false) ? `<div class="row" style="margin-top:14px">
        <div class="thumb" style="display:grid;place-items:center;padding:0">${LOGO_X.replace('<svg', '<svg style="width:30px;height:38px"')}</div>
        <div class="grow"><div class="t">Install Lixr</div><div class="s">One tap. Works offline.</div></div>
        <button class="btn small" type="button" data-act="install">Install</button>
        <button class="iconbtn" type="button" aria-label="Dismiss" data-act="dismiss-install">${I.x}</button></div>` : ''}
      <div class="sechead"><h2>Trending Clones</h2><a href="#/discover">View All ${I.chev}</a></div>
      <div class="cards">${trending.map(r => cardHTML(r)).join('')}</div>
      </div>`;
    },

    clone(r) {
      const mode = ['scan', 'photo', 'describe'].includes(r.a) ? r.a : 'scan';
      const tabs = [['scan', 'Scan'], ['photo', 'Photo'], ['describe', 'Describe']]
        .map(([k, l]) => `<button type="button" role="tab" aria-selected="${k === mode}" data-act="mode" data-mode="${k}">${l}</button>`).join('');
      const head = `<div class="clone-head"><div class="subbar">
          <a class="iconbtn" href="#/home" aria-label="Back">${I.back}</a><h1>Scan &amp; Clone</h1><span></span></div>
          <div class="seg" role="tablist" aria-label="Clone method">${tabs}</div></div>`;
      if (mode === 'describe') {
        const ex = mocktailOnly()
          ? ['Pink mango dragon fruit refresher', 'Iced brown sugar espresso', 'Virgin piña colada', 'Taro milk tea with boba']
          : ['Blue tropical rum drink', 'Spicy cucumber margarita', 'Iced brown sugar espresso', 'Chocolate martini'];
        return `<div class="clone-wrap">${head}<div class="describe wrap" style="width:100%">
          <div class="field"><label for="desc">Describe the drink</label>
          <textarea id="desc" class="input" rows="5" maxlength="400" placeholder="e.g. A pink drink with vodka, dragon fruit and lime I had at a rooftop bar"></textarea></div>
          <div class="examples">${ex.map(e => `<button class="chip" type="button" data-act="example" data-q="${esc(e)}">${esc(e)}</button>`).join('')}</div>
          <button class="btn wide" type="button" data-act="describe">Clone It ${I.arrow}</button>
          <p class="note">${navigator.onLine ? 'Lixr builds a recipe from your description. Add the bar or flavors you remember for a closer match.' : 'You’re offline, so Lixr will match your description against the built-in recipe library.'}</p>
        </div></div>`;
      }
      const hint = mode === 'scan' ? 'Point your camera at a drink menu to clone a recipe.' : 'Point your camera at the drink and snap a photo.';
      return `<div class="clone-wrap">${head}
        <div class="viewfinder" id="vf">
          <div class="empty" id="camEmpty" hidden><div>${I.camera}<p>Camera is off. Tap the button below to take a photo, or pick one from your gallery.</p></div></div>
          <video id="cam" playsinline muted autoplay aria-label="Camera preview"></video>
          <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
          <div class="hint">${mode === 'scan' ? I.doc : I.photo}<span>${hint}</span></div>
        </div>
        <div class="camctl">
          <button class="iconbtn" type="button" aria-label="Choose from gallery" data-act="gallery">${I.photo}</button>
          <button class="shutter" type="button" aria-label="${mode === 'scan' ? 'Scan menu' : 'Take photo'}" data-act="shutter"><span></span></button>
          <button class="iconbtn" type="button" aria-label="Flash" data-act="torch" id="torchBtn" style="visibility:hidden">${I.flash}</button>
        </div></div>`;
    },

    r(r) {
      const rec = getRecipe(r.a);
      if (!rec) return `<div class="wrap">${subbar('Clone Results')}${emptyHTML(I.glass, 'Recipe not found', 'It may have been removed from this device.', '<a class="btn" href="#/home">Go home</a>')}</div>`;
      const st = resultState(rec);
      const part = st.mock && rec.mocktail ? rec.mocktail : rec;
      const isFav = db.favs.includes(rec.id), isSaved = db.saved.includes(rec.id);
      const showToggle = rec.mocktail && rec.cat === 'cocktail' && !mocktailOnly();
      const blocked = mocktailOnly() && rec.cat === 'cocktail' && !rec.mocktail;
      const match = { ai: rec.match || 'Close match', custom: 'My recipe', shared: 'Shared recipe' }[rec.source] || 'Lixr recipe';
      const suffix = ['custom', 'shared'].includes(rec.source) ? '' : ' <span>(Clone)</span>';
      const desc = st.mock && rec.mocktail && rec.mocktail.desc ? rec.mocktail.desc : rec.desc;
      const name = rec.name + (st.mock && rec.cat === 'cocktail' ? ' Mocktail' : '');
      return `<div class="wrap" style="max-width:1100px">
        <div class="subbar"><a class="iconbtn" href="#/home" data-act="back" aria-label="Back">${I.back}</a><h1>Clone Results</h1>
        <button class="iconbtn" type="button" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}" aria-pressed="${isFav}" data-act="fav" data-id="${esc(rec.id)}">${isFav ? I.heart.replace('<svg', '<svg style="fill:var(--brand);stroke:var(--brand)"') : I.heart}</button></div>
        <div class="result-grid">
        <div class="result-art"><div class="art">${drinkSVG(st.mock && rec.mocktail && rec.mocktail.color ? Object.assign({}, rec, { color: rec.mocktail.color, color2: rec.mocktail.color2 || rec.color2 }) : rec)}</div></div>
        <div>
        <div class="title-row"><h2>${esc(name)}${suffix}</h2><span class="pill">${esc(match)}</span></div>
        <p class="desc">${esc(desc)}</p>
        ${showToggle ? `<div class="seg" style="margin-top:14px" role="group" aria-label="Version">
          <button type="button" aria-pressed="${!st.mock}" data-act="ver" data-v="0">Cocktail</button>
          <button type="button" aria-pressed="${st.mock}" data-act="ver" data-v="1">Mocktail</button></div>` : ''}
        ${blocked ? `<div class="panel"><h3>Mocktail version needed</h3><p class="note" style="margin:8px 0 12px">You’re in mocktails-only mode, and this clone only has an alcoholic version.</p>
          <button class="btn small" type="button" data-act="make-mock" data-id="${esc(rec.id)}">Make a mocktail version</button></div>` : `
        <section class="panel" aria-labelledby="ingT">
          <div class="panel-head"><h3 id="ingT">Ingredients</h3>
            <div class="serves"><button type="button" aria-label="Fewer servings" data-act="serves" data-d="-1">−</button><span>Serves ${st.serves}</span><button type="button" aria-label="More servings" data-act="serves" data-d="1">+</button></div></div>
          ${db.bar.length ? (() => { const bs = barStats(part.ingredients); return `<div class="barline"><span>${bs.missing.length ? `You have ${bs.have} of ${bs.total} in your bar` : 'You have everything in your bar'}</span>${bs.missing.length ? `<button class="linkbtn" type="button" data-act="shop-missing" data-id="${esc(rec.id)}">Add ${bs.missing.length} missing to shopping list</button>` : ''}</div>`; })() : ''}
          <ul class="ing">${part.ingredients.map(i => `<li><label><input type="checkbox" aria-label="Got it"><span>${fmtAmt(i, st.serves) ? `<b>${fmtAmt(i, st.serves)}</b> ` : ''}${esc(i.item)}${db.bar.length && !isStaple(i.item) && inBar(i.item) ? ' <em class="have">In bar</em>' : ''}</span></label></li>`).join('')}</ul>
          ${db.bar.length ? '' : `<button class="linkbtn" type="button" data-act="shop-missing" data-id="${esc(rec.id)}" data-all="1">Add ingredients to shopping list</button>`}
        </section>
        <section class="panel" aria-labelledby="stT"><h3 id="stT">Instructions</h3>
          <ol class="steps">${part.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></section>`}
        <div class="actions">
          <button class="btn wide" type="button" data-act="save" data-id="${esc(rec.id)}">${I.glass}${isSaved ? 'Saved to My Recipes' : 'Save Recipe'}</button>
          <button class="iconbtn" type="button" aria-label="Share recipe" data-act="share" data-id="${esc(rec.id)}">${I.share}</button>
        </div>
        <div style="display:flex;gap:18px;flex-wrap:wrap">
          <button class="linkbtn" type="button" data-act="add-col" data-id="${esc(rec.id)}">Add to collection</button>
          ${rec.source === 'custom' ? `<a class="linkbtn" href="#/edit/${encodeURIComponent(rec.id)}">Edit</a><button class="linkbtn" type="button" data-act="del-recipe" data-id="${esc(rec.id)}">Delete</button>`
            : `<a class="linkbtn" href="#/edit/${encodeURIComponent(rec.id)}">Customize</a>`}
          ${rec.source === 'ai' ? `<button class="linkbtn" type="button" data-act="report" data-id="${esc(rec.id)}">Report this result</button>` : ''}
        </div>
        ${rec.source === 'ai' ? '<p class="note">AI clones are best guesses from what Lixr could see or read. Taste and adjust.</p>' : ''}
        ${rec.cat === 'cocktail' && !st.mock ? '<p class="note">Please drink responsibly. 21+ only.</p>' : ''}
        </div></div></div>`;
    },

    discover(r) {
      const cat = CATS.some(c => c.id === r.a) ? r.a : 'all';
      const cats = mocktailOnly() ? CATS.filter(c => c.id !== 'cocktail') : CATS;
      return `<div class="wrap">${subbar('Discover', true)}
        <label class="search">${I.search}<span class="sr">Search drinks</span><input id="q" type="search" placeholder="Search drinks or ingredients" autocomplete="off" value="${esc(discoverQ)}"></label>
        <div class="chips" role="group" aria-label="Category" style="margin-top:12px">${cats.map(c => `<button class="chip" type="button" aria-pressed="${c.id === cat}" data-act="cat" data-cat="${c.id}">${c.label}</button>`).join('')}</div>
        <div class="cards grid" id="results" style="margin-top:10px">${discoverResults(cat)}</div></div>`;
    },

    recipes(r) {
      const tab = ['collections', 'bar'].includes(r.a) ? r.a : 'saved';
      const segs = `<div class="seg" role="tablist" aria-label="My Recipes" style="margin-bottom:16px">
        <button type="button" role="tab" aria-selected="${tab === 'saved'}" data-act="go" data-href="#/recipes">Saved</button>
        <button type="button" role="tab" aria-selected="${tab === 'collections'}" data-act="go" data-href="#/recipes/collections">Collections</button>
        <button type="button" role="tab" aria-selected="${tab === 'bar'}" data-act="go" data-href="#/recipes/bar">My Bar</button></div>`;
      if (tab === 'bar') return `<div class="wrap">${subbar('My Recipes', true)}${segs}${barView()}</div>`;
      if (tab === 'saved') {
        const list = db.saved.map(getRecipe).filter(Boolean);
        return `<div class="wrap">${subbar('My Recipes', true)}${segs}
          <a class="btn ghost wide" href="#/edit/new" style="margin-bottom:14px">${I.plus}New recipe</a>
          ${list.length ? `<div class="cards grid">${list.map(x => cardHTML(x)).join('')}</div>`
            : emptyHTML(I.glass, 'No saved recipes yet', 'Clone a drink and tap Save Recipe, or write your own.', '<a class="btn" href="#/clone/scan">Clone a Drink</a>')}</div>`;
      }
      return `<div class="wrap">${subbar('My Recipes', true)}${segs}
        <button class="btn ghost wide" type="button" data-act="new-col" style="margin-bottom:14px">${I.plus}New collection</button>
        ${db.collections.length ? `<div class="rows">${db.collections.map(c => `<a class="row" href="#/collection/${encodeURIComponent(c.id)}">
          <div class="thumb" style="display:grid;place-items:center;padding:0">${c.ids.length ? drinkSVG(getRecipe(c.ids[0]) || HERO) : I.folder}</div>
          <div class="grow"><div class="t">${esc(c.name)}</div><div class="s">${c.ids.length} drink${c.ids.length === 1 ? '' : 's'}</div></div>${I.chev}</a>`).join('')}</div>`
          : emptyHTML(I.folder, 'No collections yet', 'Group drinks for a party, a season or your home bar.')}</div>`;
    },

    collection(r) {
      const c = db.collections.find(x => x.id === r.a);
      if (!c) { location.hash = '#/recipes/collections'; return ''; }
      const list = c.ids.map(getRecipe).filter(Boolean);
      return `<div class="wrap"><div class="subbar"><a class="iconbtn" href="#/recipes/collections" aria-label="Back">${I.back}</a><h1>${esc(c.name)}</h1><span></span></div>
        ${list.length ? `<div class="cards grid">${list.map(x => cardHTML(x)).join('')}</div>` : emptyHTML(I.folder, 'This collection is empty', 'Open any drink and tap “Add to collection”.')}
        <div style="display:flex;gap:18px;margin-top:16px"><button class="linkbtn" type="button" data-act="rename-col" data-id="${esc(c.id)}">Rename</button>
        <button class="linkbtn" type="button" data-act="del-col" data-id="${esc(c.id)}">Delete collection</button></div></div>`;
    },

    favorites() {
      const list = db.favs.map(getRecipe).filter(Boolean);
      return `<div class="wrap">${subbar('Favorites', true)}
        ${list.length ? `<div class="cards grid">${list.map(x => cardHTML(x)).join('')}</div>`
          : emptyHTML(I.heart, 'No favorites yet', 'Tap the heart on any drink to keep it here.', '<a class="btn" href="#/discover">Discover drinks</a>')}</div>`;
    },

    profile() {
      const segBtns = (key, opts) => opts.map(([v, l]) => `<button type="button" aria-pressed="${settings[key] === v}" data-act="set" data-k="${key}" data-v="${v}">${l}</button>`).join('');
      return `<div class="wrap">${subbar('Profile', true)}
        <div class="row" style="cursor:default"><div class="thumb" style="display:grid;place-items:center;padding:0">${LOGO_X.replace('<svg', '<svg style="width:30px;height:38px"')}</div>
          <div class="grow"><div class="t">Your bar</div><div class="s">${db.saved.length} saved · ${db.favs.length} favorites · ${db.bar.length} in bar</div></div></div>
        <div class="set-group"><h3>Appearance</h3>
          <div class="set"><div><div class="k">Theme</div></div><div class="seg" role="group" aria-label="Theme">${segBtns('theme', [['dark', 'Dark'], ['light', 'Light'], ['system', 'Auto']])}</div></div></div>
        <div class="set-group"><h3>Recipes</h3>
          <div class="set"><div><div class="k">Units</div></div><div class="seg" role="group" aria-label="Units">${segBtns('units', [['oz', 'oz'], ['ml', 'ml']])}</div></div>
          <div class="set"><div><div class="k">Drinks</div><div class="v">Mocktails only hides alcohol</div></div><div class="seg" role="group" aria-label="Drinks">${segBtns('mode', [['all', 'All'], ['mocktail', 'Mocktails']])}</div></div></div>
        <div class="set-group"><h3>App</h3>
          ${canInstall() ? `<div class="set"><div><div class="k">Install Lixr</div><div class="v">One tap, works offline</div></div><button class="btn small" type="button" data-act="install">Install</button></div>` : ''}
          <div class="set"><div><div class="k">Privacy</div><div class="v">Your recipes stay on this device</div></div><a class="btn small ghost" href="privacy.html">Read</a></div>
          <div class="set"><div><div class="k">Clear my data</div><div class="v">Removes saved drinks and settings</div></div><button class="btn small ghost" type="button" data-act="clear">Clear</button></div>
          <p class="note" style="text-align:center;margin-top:16px">Lixr ${VERSION} · Please drink responsibly.</p></div></div>`;
    },

    s(r) { importShared(r.a); return `<div class="wrap">${subbar('Opening recipe')}<div class="empty-state"><p>Opening shared recipe…</p></div></div>`; }
  };

  // ---------- My Bar & shopping list ----------
  function barView() {
    const counts = {};
    visibleLib().forEach(r => partFor(r).ingredients.forEach(i => { const n = norm(i.item); if (n && !isStaple(i.item) && n.split(' ').length <= 3) counts[n] = (counts[n] || 0) + 1; }));
    const sugg = Object.keys(counts).filter(n => !db.bar.includes(n)).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b)).slice(0, 12);
    const pool = visibleLib().concat(db.saved.map(getRecipe).filter(x => x && !LIB.includes(x)))
      .filter((x, i, a) => a.indexOf(x) === i && (!mocktailOnly() || x.cat !== 'cocktail' || x.mocktail));
    const ranked = pool.map(x => ({ x, s: barStats(partFor(x).ingredients) })).sort((a, b) => a.s.missing.length - b.s.missing.length || b.s.have - a.s.have).slice(0, 12);
    const left = db.shop.filter(i => !i.done).length, done = db.shop.length - left;
    return `<section class="panel" aria-labelledby="barT" style="margin-top:0">
        <div class="panel-head"><h3 id="barT">What’s in your bar</h3><span class="note">${db.bar.length} item${db.bar.length === 1 ? '' : 's'}</span></div>
        <form class="addline" data-form="bar"><label class="sr" for="barIn">Add an ingredient</label><input id="barIn" class="input" maxlength="40" placeholder="e.g. white rum, limes, mint" autocomplete="off"><button class="btn small" type="submit">Add</button></form>
        ${db.bar.length ? `<div class="tags">${db.bar.map(b => `<button class="tag" type="button" data-act="bar-remove" data-v="${esc(b)}" aria-label="Remove ${esc(b)}">${esc(b)} ${I.x}</button>`).join('')}</div>` : '<p class="note" style="margin:10px 0 0">Add what you have at home and Lixr shows what you can make.</p>'}
        ${sugg.length ? `<p class="note" style="margin:14px 0 6px">Quick add</p><div class="chips wrapchips">${sugg.map(n => `<button class="chip" type="button" data-act="bar-add" data-v="${esc(n)}">+ ${esc(n)}</button>`).join('')}</div>` : ''}
      </section>
      ${db.bar.length ? `<div class="sechead"><h2>What can I make?</h2></div><div class="rows">${ranked.map(({ x, s }) =>
        rowHTML(x, s.missing.length ? `Have ${s.have} of ${s.total} · need ${s.missing.slice(0, 2).map(i => norm(i.item)).join(', ')}${s.missing.length > 2 ? '…' : ''}` : 'You can make this now')).join('')}</div>` : ''}
      <section class="panel" aria-labelledby="shopT" style="margin-top:22px">
        <div class="panel-head"><h3 id="shopT">Shopping list</h3><span class="note">${left} to buy</span></div>
        <form class="addline" data-form="shop"><label class="sr" for="shopIn">Add to shopping list</label><input id="shopIn" class="input" maxlength="60" placeholder="Add an item" autocomplete="off"><button class="btn small" type="submit">Add</button></form>
        ${db.shop.length ? `<ul class="ing" style="margin-top:8px">${db.shop.map(i => `<li><label><input type="checkbox" data-act="shop-toggle" data-id="${esc(i.id)}" ${i.done ? 'checked' : ''}><span>${esc(i.item)}</span></label></li>`).join('')}</ul>
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            ${done ? `<button class="linkbtn" type="button" data-act="shop-to-bar">Move ${done} checked to My Bar</button><button class="linkbtn" type="button" data-act="shop-clear">Clear checked</button>` : ''}
            <button class="linkbtn" type="button" data-act="shop-share">Share list</button></div>`
          : '<p class="note" style="margin:10px 0 0">Open any drink and add its missing ingredients here.</p>'}
      </section>`;
  }
  function addShop(items) {
    let n = 0;
    items.forEach(item => { if (!db.shop.some(s => !s.done && norm(s.item) === norm(item))) { db.shop.push({ id: uid('s'), item: String(item).slice(0, 60), done: false }); n++; } });
    save('shop'); return n;
  }

  // ---------- Recipe editor ----------
  const UNITS = ['oz', 'ml', 'tsp', 'tbsp', 'cup', 'dash', 'pinch', 'shots', ''];
  const GARNISH_LABELS = { none: 'None', lime: 'Lime wheel', orange: 'Orange wheel', pineapple: 'Pineapple', cherry: 'Cherry', strawberry: 'Strawberry', blackberry: 'Blackberry', mint: 'Mint', cream: 'Whipped cream', beans: 'Coffee beans', dragonfruit: 'Dragon fruit', boba: 'Boba pearls' };
  function amtText(a) { return a == null ? '' : frac(a); }
  function parseAmt(t) {
    t = String(t || '').trim().replace('½', ' 1/2').replace('¼', ' 1/4').replace('¾', ' 3/4').replace('⅓', ' 1/3').replace('⅔', ' 2/3').trim();
    if (!t) return null;
    let total = 0;
    for (const part of t.split(/\s+/)) {
      const m = part.match(/^(\d+)\/(\d+)$/);
      const v = m ? Number(m[1]) / Number(m[2]) : Number(part.replace(',', '.'));
      if (!isFinite(v) || v < 0) return NaN;
      total += v;
    }
    return Math.round(total * 1000) / 1000;
  }
  function ingRow(i) {
    i = i || { amt: null, unit: 'oz', item: '' };
    return `<div class="ingrow"><input class="input" name="amt" inputmode="decimal" placeholder="1 1/2" aria-label="Amount" value="${esc(amtText(i.amt))}">
      <select class="input" name="unit" aria-label="Unit">${UNITS.concat(UNITS.includes(i.unit) ? [] : [i.unit]).map(u => `<option value="${esc(u)}" ${u === (i.unit || '') ? 'selected' : ''}>${u ? esc(u) : '—'}</option>`).join('')}</select>
      <input class="input" name="item" placeholder="Ingredient" aria-label="Ingredient" maxlength="80" value="${esc(i.item)}">
      <button class="iconbtn" type="button" data-act="ing-del" aria-label="Remove ingredient">${I.x}</button></div>`;
  }
  let editing = null;
  VIEWS.edit = function (r) {
    const src = r.a && r.a !== 'new' ? getRecipe(r.a) : null;
    const inPlace = src && src.source === 'custom';
    const base = src ? JSON.parse(JSON.stringify(src.mocktail && partFor(src) === src.mocktail ? Object.assign({}, src, src.mocktail, { cat: 'mocktail', mocktail: null }) : src)) : null;
    editing = { id: inPlace ? src.id : null, from: src && !inPlace ? src.id : null, mocktail: inPlace ? src.mocktail || null : null };
    const d = base || { name: '', desc: '', cat: mocktailOnly() ? 'mocktail' : 'cocktail', glass: 'rocks', garnish: 'lime', color: '#C46BFF', color2: '#5A0A8C', serves: 1, ingredients: [{ amt: 2, unit: 'oz', item: '' }, { amt: 1, unit: 'oz', item: '' }, { amt: null, unit: '', item: 'Ice' }], steps: [] };
    const title = inPlace ? 'Edit recipe' : src ? 'Customize' : 'New recipe';
    const cats = (mocktailOnly() ? CATS.filter(c => c.id !== 'cocktail' && c.id !== 'all') : CATS.filter(c => c.id !== 'all'));
    return `<div class="wrap"><div class="subbar"><a class="iconbtn" href="#/recipes" data-act="back" aria-label="Back">${I.back}</a><h1>${title}</h1><span></span></div>
      ${src && !inPlace ? `<p class="note" style="text-align:center;margin:0 0 8px">Your changes save as your own copy. The original stays as it is.</p>` : ''}
      <form id="editForm" class="editor" novalidate>
        <div class="ed-preview" id="edArt" aria-hidden="true">${drinkSVG(d)}</div>
        <div class="field"><label for="edName">Name</label><input id="edName" class="input" name="name" maxlength="60" required value="${esc(src && !inPlace ? d.name + ' (My version)' : d.name)}"></div>
        <div class="field"><label for="edDesc">Short description</label><input id="edDesc" class="input" name="desc" maxlength="200" placeholder="How does it taste?" value="${esc(d.desc || '')}"></div>
        <div class="ed-grid">
          <div class="field"><label for="edCat">Type</label><select id="edCat" class="input" name="cat">${cats.map(c => `<option value="${c.id}" ${c.id === d.cat ? 'selected' : ''}>${c.label.replace(/s$/, '')}</option>`).join('')}</select></div>
          <div class="field"><label for="edServes">Serves</label><input id="edServes" class="input" name="serves" type="number" min="1" max="12" value="${d.serves || 1}"></div>
          <div class="field"><label for="edGlass">Glass</label><select id="edGlass" class="input" name="glass">${['rocks', 'highball', 'coupe', 'martini', 'hurricane', 'mug'].map(g => `<option value="${g}" ${g === d.glass ? 'selected' : ''}>${g[0].toUpperCase() + g.slice(1)}</option>`).join('')}</select></div>
          <div class="field"><label for="edGarnish">Garnish</label><select id="edGarnish" class="input" name="garnish">${Object.keys(GARNISH_LABELS).map(g => `<option value="${g}" ${g === d.garnish ? 'selected' : ''}>${GARNISH_LABELS[g]}</option>`).join('')}</select></div>
          <div class="field"><label for="edC1">Top color</label><input id="edC1" class="input color" name="color" type="color" value="${esc(d.color || '#C46BFF')}"></div>
          <div class="field"><label for="edC2">Bottom color</label><input id="edC2" class="input color" name="color2" type="color" value="${esc(d.color2 || '#5A0A8C')}"></div>
        </div>
        <fieldset class="field"><legend>Ingredients</legend><div id="ingRows">${d.ingredients.map(ingRow).join('')}</div>
          <button class="btn ghost small" type="button" data-act="ing-add" style="margin-top:8px">${I.plus}Add ingredient</button></fieldset>
        <div class="field"><label for="edSteps">Steps, one per line</label><textarea id="edSteps" class="input" name="steps" rows="6" maxlength="1500" placeholder="Fill a shaker with ice.&#10;Add everything and shake.">${esc((d.steps || []).join('\n'))}</textarea></div>
        <p class="note" id="edErr" role="alert"></p>
        <button class="btn wide" type="submit">${inPlace ? 'Save changes' : 'Save recipe'}</button>
      </form></div>`;
  };
  function readEditor() {
    const f = $('#editForm');
    const v = n => f.elements[n].value;
    const ingredients = [...f.querySelectorAll('.ingrow')].map(row => ({ amt: parseAmt(row.querySelector('[name=amt]').value), unit: row.querySelector('[name=unit]').value, item: row.querySelector('[name=item]').value.trim() })).filter(i => i.item);
    return {
      name: v('name').trim(), desc: v('desc').trim(), cat: v('cat'), glass: v('glass'), garnish: v('garnish'), color: v('color'), color2: v('color2'),
      serves: Math.min(12, Math.max(1, parseInt(v('serves'), 10) || 1)),
      ingredients, steps: v('steps').split('\n').map(x => x.trim()).filter(Boolean)
    };
  }
  function saveEditor() {
    const d = readEditor(), err = $('#edErr');
    if (!d.name) { err.textContent = 'Give your recipe a name.'; $('#edName').focus(); return; }
    if (!d.ingredients.length) { err.textContent = 'Add at least one ingredient.'; return; }
    if (d.ingredients.some(i => Number.isNaN(i.amt))) { err.textContent = 'Use numbers for amounts, like 2, 0.5 or 1 1/2.'; return; }
    if (!d.steps.length) { err.textContent = 'Add at least one step.'; $('#edSteps').focus(); return; }
    const id = editing.id || uid('my');
    const prev = db.recipes[id] || {};
    const r = Object.assign({}, prev, d, { id, source: 'custom', match: null, created: prev.created || Date.now(), updated: Date.now(), tags: prev.tags || [] });
    r.mocktail = d.cat === 'cocktail' ? (editing.mocktail || null) : null;
    if (!r.mocktail) delete r.mocktail;
    db.recipes[id] = r; save('recipes');
    if (!db.saved.includes(id)) { db.saved.unshift(id); save('saved'); }
    toast(editing.id ? 'Changes saved.' : 'Saved to My Recipes.');
    location.replace('#/r/' + encodeURIComponent(id));
  }

  function subbar(title, withMenu) {
    return `<div class="subbar">${withMenu ? `<button class="iconbtn" type="button" aria-label="Menu" data-act="drawer">${I.menu}</button>` : `<a class="iconbtn" href="#/home" aria-label="Back">${I.back}</a>`}<h1>${esc(title)}</h1><span></span></div>`;
  }

  // ---------- Discover ----------
  let discoverQ = '';
  function discoverResults(cat) {
    const q = discoverQ.trim().toLowerCase();
    const mine = db.history.map(h => getRecipe(h.id)).filter(Boolean).filter((x, i, a) => a.indexOf(x) === i);
    let list = visibleLib().concat(mine.filter(x => !mocktailOnly() || x.cat !== 'cocktail' || x.mocktail));
    if (cat !== 'all') list = list.filter(x => cat === 'mocktail' ? (x.cat === 'mocktail' || (x.mocktail && mocktailOnly())) : x.cat === cat);
    if (q) list = list.filter(x => (x.name + ' ' + (x.tags || []).join(' ') + ' ' + x.ingredients.map(i => i.item).join(' ')).toLowerCase().includes(q));
    return list.length ? list.map(x => cardHTML(x)).join('') : `<div style="grid-column:1/-1">${emptyHTML(I.search, 'No drinks found', 'Try another word, or clone it instead.', '<a class="btn" href="#/clone/describe">Describe a drink</a>')}</div>`;
  }

  // ---------- Result state ----------
  const resultStates = {};
  function resultState(rec) {
    if (!resultStates[rec.id]) resultStates[rec.id] = { serves: Math.min(12, Math.max(1, rec.serves || 1)), mock: mocktailOnly() || rec.cat === 'mocktail' };
    if (mocktailOnly()) resultStates[rec.id].mock = true;
    return resultStates[rec.id];
  }

  // ---------- Camera ----------
  let stream = null, torchOn = false;
  async function startCamera() {
    const video = $('#cam'), empty = $('#camEmpty');
    if (!video) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { video.hidden = true; empty.hidden = false; return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      if (current !== 'clone') { stopCamera(); return; }
      video.srcObject = stream;
      const track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities ? track.getCapabilities() : {};
      if (caps.torch) $('#torchBtn').style.visibility = 'visible';
    } catch (e) {
      video.hidden = true; empty.hidden = false;
    }
  }
  function stopCamera() { if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; torchOn = false; } }
  function grabFrame() {
    const v = $('#cam');
    if (!stream || !v || !v.videoWidth) return null;
    return toJpeg(v, v.videoWidth, v.videoHeight);
  }
  function toJpeg(src, w, h) {
    const max = 1568, k = Math.min(1, max / Math.max(w, h));
    const c = document.createElement('canvas');
    c.width = Math.round(w * k); c.height = Math.round(h * k);
    c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.85);
  }
  function fileToJpeg(file) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => { res(toJpeg(img, img.naturalWidth, img.naturalHeight)); URL.revokeObjectURL(img.src); };
      img.onerror = () => rej(new Error('That file isn’t an image Lixr can read.'));
      img.src = URL.createObjectURL(file);
    });
  }
  function showStill(dataUrl) {
    const vf = $('#vf'); if (!vf) return;
    let img = vf.querySelector('img.still');
    if (!img) { img = document.createElement('img'); img.className = 'still'; img.alt = 'Captured photo'; vf.prepend(img); }
    img.src = dataUrl;
  }
  ['#filePick', '#fileCapture'].forEach(sel => $(sel).addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f) return;
    try { const d = await fileToJpeg(f); showStill(d); cloneImage(d); } catch (err) { toast(err.message); }
  }));

  // ---------- Cloning ----------
  function busy(msg) {
    let b = $('.busy');
    if (!msg) { b && b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.className = 'busy'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
    b.innerHTML = `<div><div class="ring"></div><div style="font-size:18px;font-weight:600">${esc(msg)}</div><div style="opacity:.75;margin-top:6px">This usually takes a few seconds.</div></div>`;
  }
  async function callAPI(body) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 60000);
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal });
      let data = null; try { data = await res.json(); } catch (e) {}
      if (!res.ok) throw new Error((data && data.error) || 'Lixr couldn’t reach the clone service. Try again in a moment.');
      return data;
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('That took too long. Check your connection and try again.');
      if (e instanceof TypeError) throw Object.assign(new Error('Lixr couldn’t reach the clone service.'), { offline: true });
      throw e;
    } finally { clearTimeout(t); }
  }
  const GLASS_OK = ['rocks', 'highball', 'coupe', 'martini', 'hurricane', 'mug'];
  const GARNISH_OK = ['pineapple', 'lime', 'strawberry', 'blackberry', 'mint', 'cream', 'beans', 'dragonfruit', 'orange', 'cherry', 'boba', 'none'];
  const hex = (c, d) => /^#[0-9a-fA-F]{6}$/.test(c || '') ? c : d;
  const str = (s, n) => String(s == null ? '' : s).slice(0, n);
  function cleanParts(o) {
    return {
      ingredients: (Array.isArray(o.ingredients) ? o.ingredients : []).slice(0, 20).map(i => ({
        amt: i && i.amt != null && i.amt !== '' && isFinite(Number(i.amt)) ? Number(i.amt) : null,
        unit: str(i && i.unit, 12), item: str(i && i.item, 80)
      })).filter(i => i.item),
      steps: (Array.isArray(o.steps) ? o.steps : []).slice(0, 12).map(s => str(s, 240)).filter(Boolean)
    };
  }
  function cleanRecipe(x, shared) {
    if (!x || typeof x !== 'object') return null;
    const base = cleanParts(x);
    if (!x.name || !base.ingredients.length || !base.steps.length) return null;
    const r = Object.assign({
      id: uid(shared ? 'sh' : 'ai'), source: shared && x.source !== 'ai' ? 'shared' : 'ai', name: str(x.name, 60), desc: str(x.desc || x.description, 280),
      cat: ['cocktail', 'mocktail', 'coffee', 'boba'].includes(x.cat) ? x.cat : 'cocktail',
      glass: GLASS_OK.includes(x.glass) ? x.glass : 'rocks', garnish: GARNISH_OK.includes(x.garnish) ? x.garnish : 'none',
      color: hex(x.color, '#C46BFF'), color2: hex(x.color2, '#5A0A8C'),
      match: ['Exact match', 'Close match', 'Inspired by'].includes(x.match) ? x.match : (shared && x.source !== 'ai' ? null : 'Close match'),
      serves: Math.min(12, Math.max(1, parseInt(x.serves, 10) || 1)),
      tags: (Array.isArray(x.tags) ? x.tags : []).slice(0, 10).map(t => str(t, 24)),
      created: Date.now()
    }, base);
    if (x.mocktail && typeof x.mocktail === 'object') {
      const m = cleanParts(x.mocktail);
      if (m.ingredients.length && m.steps.length) r.mocktail = Object.assign(m, { desc: str(x.mocktail.desc, 280), color: hex(x.mocktail.color, null), color2: hex(x.mocktail.color2, null) });
    }
    return r;
  }
  function keep(r) {
    db.recipes[r.id] = r; save('recipes');
    db.history.unshift({ id: r.id, at: Date.now() });
    db.history = db.history.slice(0, 40); save('history');
    pruneRecipes();
  }
  function pruneRecipes() {
    // Keep AI recipes that are saved, favorited, in a collection or in recent history.
    const keepIds = new Set([...db.saved, ...db.favs, ...db.history.map(h => h.id), ...db.collections.flatMap(c => c.ids)]);
    let changed = false;
    Object.keys(db.recipes).forEach(id => { if (!keepIds.has(id) && db.recipes[id].source !== 'custom') { delete db.recipes[id]; changed = true; } });
    changed && save('recipes');
  }

  async function cloneImage(dataUrl) {
    const mode = route().a === 'photo' ? 'photo' : 'menu';
    if (!navigator.onLine) { toast('You’re offline. Photo clones need a connection, so try Describe or browse Discover.'); return; }
    busy(mode === 'menu' ? 'Reading the menu…' : 'Looking at your drink…');
    try {
      const data = await callAPI({ action: mode, image: dataUrl.split(',')[1], mocktailOnly: mocktailOnly() });
      handleCloneResponse(data, mode);
    } catch (e) {
      toast(e.offline ? 'Lixr couldn’t connect. Check your connection, or try Describe offline.' : e.message);
    } finally { busy(null); }
  }
  async function cloneText(q, opts) {
    q = (q || '').trim();
    if (q.length < 3) { toast('Describe the drink in a few words first.'); return; }
    if (!navigator.onLine) return localMatch(q);
    busy('Mixing up your recipe…');
    try {
      const data = await callAPI({ action: 'describe', query: q, mocktailOnly: mocktailOnly() || !!(opts && opts.mock) });
      handleCloneResponse(data, 'describe');
    } catch (e) {
      if (e.offline || /not configured/i.test(e.message)) { busy(null); localMatch(q, true); return; }
      toast(e.message);
    } finally { busy(null); }
  }
  function handleCloneResponse(data, mode) {
    const list = ((data && data.recipes) || []).map(cleanRecipe).filter(Boolean);
    if (!list.length) { toast(data && data.message ? data.message : (mode === 'menu' ? 'Lixr couldn’t find drinks on that menu. Try a closer, brighter photo.' : 'Lixr couldn’t clone that one. Try a clearer photo or describe it.')); return; }
    list.forEach(keep);
    if (list.length === 1) { location.hash = '#/r/' + encodeURIComponent(list[0].id); return; }
    openSheet(`<h2>Drinks on this menu</h2><p>Pick one to see its clone. All ${list.length} are in your recent clones.</p>
      <div class="rows">${list.map(r => rowHTML(r, r.desc)).join('')}</div>`, 'Drinks on this menu');
    $('#sheet').querySelectorAll('a.row').forEach(a => a.addEventListener('click', closeSheet));
  }
  function localMatch(q, fellBack) {
    const words = q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    const scored = visibleLib().map(r => {
      const name = r.name.toLowerCase(), tags = (r.tags || []).join(' '), ing = r.ingredients.map(i => i.item).join(' ').toLowerCase();
      let s = 0; words.forEach(w => { if (name.includes(w)) s += 3; if (tags.includes(w)) s += 2; if (ing.includes(w)) s += 1; });
      return { r, s };
    }).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 5);
    const why = fellBack ? 'Lixr couldn’t reach the clone service, so these are the closest recipes in the built-in library.' : 'You’re offline, so these are the closest recipes in the built-in library.';
    if (!scored.length) { openSheet(`<h2>No close match offline</h2><p>${why} Nothing matched “${esc(q)}”. Try again when you’re back online.</p><button class="btn wide" type="button" data-act="close">OK</button>`, 'No match'); return; }
    openSheet(`<h2>Closest matches</h2><p>${why}</p><div class="rows">${scored.map(x => rowHTML(x.r)).join('')}</div>`, 'Closest matches');
    $('#sheet').querySelectorAll('a.row').forEach(a => a.addEventListener('click', closeSheet));
  }

  // ---------- Sharing ----------
  const b64u = {
    enc: bytes => { let s = ''; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); },
    dec: str => { const s = atob(str.replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(s, c => c.charCodeAt(0)); }
  };
  async function pack(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    if (window.CompressionStream) {
      const cs = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
      return 'z.' + b64u.enc(new Uint8Array(await new Response(cs).arrayBuffer()));
    }
    return 'j.' + b64u.enc(bytes);
  }
  async function unpack(s) {
    const [k, d] = [s.slice(0, 2), s.slice(2)];
    let bytes = b64u.dec(d);
    if (k === 'z.') {
      if (!window.DecompressionStream) throw new Error('This browser can’t open shared recipes.');
      const ds = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      bytes = new Uint8Array(await new Response(ds).arrayBuffer());
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  async function share(id) {
    const r = getRecipe(id); if (!r) return;
    let url;
    if (!LIB.includes(r)) {
      const { name, desc, cat, glass, garnish, color, color2, ingredients, steps, mocktail, match, serves, tags, source } = r;
      url = location.origin + location.pathname + '#/s/' + await pack({ name, desc, cat, glass, garnish, color, color2, ingredients, steps, mocktail, match, serves, tags, source: source === 'ai' ? 'ai' : 'custom' });
    } else url = location.origin + location.pathname + '#/r/' + encodeURIComponent(r.id);
    const part = partFor(r);
    const lines = part.ingredients.map(i => '• ' + (fmtAmt(i, 1) ? fmtAmt(i, 1) + ' ' : '') + i.item).join('\n');
    const data = { title: r.name + (r.source === 'custom' ? '' : ' (Clone)') + ' · Lixr', text: 'Make ' + r.name + ' at home with Lixr:\n' + lines + '\n', url };
    if (navigator.share) { try { await navigator.share(data); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(url); toast('Link copied.'); } catch (e) { prompt('Copy this link:', url); }
  }
  async function importShared(s) {
    try {
      const r = cleanRecipe(await unpack(s), true);
      if (!r) throw new Error();
      keep(r);
      location.replace('#/r/' + encodeURIComponent(r.id));
    } catch (e) { toast('That shared link is broken or incomplete.'); location.replace('#/home'); }
  }

  // ---------- Collections ----------
  function newCollection(thenAddId) {
    openSheet(`<h2>New collection</h2><div class="stack"><label class="sr" for="colName">Collection name</label>
      <input id="colName" class="input" maxlength="40" placeholder="e.g. Saturday party">
      <button class="btn wide" type="button" data-act="create-col" data-add="${esc(thenAddId || '')}">Create</button></div>`, 'New collection');
  }
  function addToCollection(id) {
    if (!db.collections.length) return newCollection(id);
    openSheet(`<h2>Add to collection</h2><div class="rows">${db.collections.map(c => `<button class="row" type="button" data-act="col-toggle" data-col="${esc(c.id)}" data-id="${esc(id)}">
      <div class="grow"><div class="t">${esc(c.name)}</div><div class="s">${c.ids.includes(id) ? 'Added · tap to remove' : c.ids.length + ' drinks'}</div></div>${c.ids.includes(id) ? I.glass : I.plus}</button>`).join('')}</div>
      <button class="btn ghost wide" type="button" data-act="new-col" data-add="${esc(id)}" style="margin-top:12px">${I.plus}New collection</button>`, 'Add to collection');
  }

  // ---------- Activity ----------
  function showActivity() {
    settings.seenActivity = Date.now(); save('settings');
    const recent = db.history.slice(0, 8).map(h => getRecipe(h.id)).filter(Boolean);
    openSheet(`<h2>Activity</h2>
      ${swWaiting ? `<div class="set"><div><div class="k">Update ready</div><div class="v">A new version of Lixr is ready.</div></div><button class="btn small" type="button" data-act="update">Refresh</button></div>` : ''}
      ${recent.length ? `<p>Your recent clones</p><div class="rows">${recent.map(r => rowHTML(r)).join('')}</div>` : '<p>Your recent clones will show up here.</p>'}`, 'Activity');
    $('#sheet').querySelectorAll('a.row').forEach(a => a.addEventListener('click', closeSheet));
    const dot = $('.topbar .dot'); dot && !swWaiting && dot.remove();
  }

  // ---------- Report ----------
  function report(id) {
    const reasons = ['Wrong drink', 'Unsafe or harmful', 'Offensive content', 'Recipe doesn’t work', 'Something else'];
    openSheet(`<h2>Report this result</h2><p>Tell us what went wrong with this AI clone.</p>
      <div class="stack" role="radiogroup" aria-label="Reason">${reasons.map((r, i) => `<label class="set" style="margin:0;cursor:pointer"><span class="k">${esc(r)}</span><input type="radio" name="rr" value="${esc(r)}" ${i === 0 ? 'checked' : ''}></label>`).join('')}
      <label class="sr" for="rnote">Details</label><textarea id="rnote" class="input" rows="3" maxlength="300" placeholder="Details (optional)"></textarea>
      <button class="btn wide" type="button" data-act="send-report" data-id="${esc(id)}">Send report</button></div>`, 'Report');
  }
  async function sendReport(id) {
    const r = getRecipe(id);
    const reason = ($('#sheet input[name=rr]:checked') || {}).value || 'Other';
    const note = ($('#rnote') || {}).value || '';
    closeSheet();
    try {
      const res = await fetch(REPORT_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: r && r.name, reason, note, recipe: r }) });
      if (!res.ok) throw new Error();
      toast('Thanks. Your report was sent.');
    } catch (e) { toast('Couldn’t send the report. Try again when you’re online.'); }
  }

  // ---------- Age gate ----------
  function ageGate(onDone) {
    const g = document.createElement('div');
    g.className = 'gate'; g.setAttribute('role', 'dialog'); g.setAttribute('aria-modal', 'true'); g.setAttribute('aria-labelledby', 'gateT');
    g.innerHTML = `<div class="inner">${LOGO}<h1 id="gateT" style="margin:0;font-size:24px">Are you 21 or older?</h1>
      <p>Lixr includes cocktail recipes with alcohol. You can still use it for mocktails, coffee and boba if you’re under 21.</p>
      <button class="btn wide" type="button" data-g="yes">I’m 21 or older</button>
      <button class="btn ghost wide" type="button" data-g="no">Show mocktails only</button>
      <p class="note">You can change this later in Profile.</p></div>`;
    document.body.appendChild(g);
    g.querySelector('button').focus();
    g.addEventListener('click', e => {
      const b = e.target.closest('[data-g]'); if (!b) return;
      settings.age = b.dataset.g === 'yes'; settings.mode = settings.age ? 'all' : 'mocktail'; save('settings');
      g.remove(); onDone && onDone();
    });
  }

  // ---------- Events ----------
  document.addEventListener('click', async e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const act = el.dataset.act, id = el.dataset.id;
    switch (act) {
      case 'drawer': openDrawer(); break;
      case 'close': closeSheet(); break;
      case 'activity': showActivity(); break;
      case 'install': closeSheet(); install(); break;
      case 'dismiss-install': store.set('installDismissed', true); render(); break;
      case 'toggle-theme': settings.theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; save('settings'); applyTheme(); closeSheet(); render(); break;
      case 'go': location.hash = el.dataset.href; break;
      case 'back': e.preventDefault(); if (history.length > 1) history.back(); else location.hash = '#/home'; break;
      case 'mode': location.replace('#/clone/' + el.dataset.mode); break;
      case 'shutter': {
        const d = grabFrame();
        if (d) { showStill(d); cloneImage(d); } else $('#fileCapture').click();
        break;
      }
      case 'gallery': $('#filePick').click(); break;
      case 'torch': {
        if (!stream) break;
        torchOn = !torchOn;
        try { await stream.getVideoTracks()[0].applyConstraints({ advanced: [{ torch: torchOn }] }); el.setAttribute('aria-pressed', torchOn); } catch (err) { toast('Flash isn’t available on this camera.'); }
        break;
      }
      case 'example': $('#desc').value = el.dataset.q; $('#desc').focus(); break;
      case 'describe': cloneText($('#desc').value); break;
      case 'make-mock': { const r = getRecipe(id); cloneText('Mocktail version of ' + r.name + ': ' + (r.desc || ''), { mock: true }); break; }
      case 'fav': {
        const i = db.favs.indexOf(id);
        i >= 0 ? db.favs.splice(i, 1) : db.favs.unshift(id); save('favs');
        toast(i >= 0 ? 'Removed from favorites.' : 'Added to favorites.'); render(); break;
      }
      case 'save': {
        const i = db.saved.indexOf(id);
        if (i >= 0) { db.saved.splice(i, 1); toast('Removed from My Recipes.'); } else { db.saved.unshift(id); toast('Saved to My Recipes.'); }
        save('saved'); pruneRecipes(); render(); break;
      }
      case 'share': share(id); break;
      case 'ver': { const r = getRecipe(route().a); resultState(r).mock = el.dataset.v === '1'; render(); break; }
      case 'serves': { const r = getRecipe(route().a); const s = resultState(r); s.serves = Math.min(12, Math.max(1, s.serves + Number(el.dataset.d))); render(); break; }
      case 'add-col': addToCollection(id); break;
      case 'new-col': newCollection(el.dataset.add); break;
      case 'create-col': {
        const n = ($('#colName').value || '').trim();
        if (!n) { $('#colName').focus(); break; }
        const c = { id: uid('c'), name: n.slice(0, 40), ids: el.dataset.add ? [el.dataset.add] : [] };
        db.collections.unshift(c); save('collections'); closeSheet();
        toast(el.dataset.add ? 'Added to “' + c.name + '”.' : 'Collection created.'); render(); break;
      }
      case 'col-toggle': {
        const c = db.collections.find(x => x.id === el.dataset.col); if (!c) break;
        const i = c.ids.indexOf(id); i >= 0 ? c.ids.splice(i, 1) : c.ids.unshift(id);
        save('collections'); pruneRecipes(); closeSheet(); toast(i >= 0 ? 'Removed from “' + c.name + '”.' : 'Added to “' + c.name + '”.'); break;
      }
      case 'rename-col': {
        const c = db.collections.find(x => x.id === id); if (!c) break;
        openSheet(`<h2>Rename collection</h2><div class="stack"><label class="sr" for="colName">Name</label><input id="colName" class="input" maxlength="40" value="${esc(c.name)}">
          <button class="btn wide" type="button" data-act="do-rename" data-id="${esc(id)}">Save</button></div>`, 'Rename'); break;
      }
      case 'do-rename': { const c = db.collections.find(x => x.id === id); const n = ($('#colName').value || '').trim(); if (c && n) { c.name = n.slice(0, 40); save('collections'); } closeSheet(); render(); break; }
      case 'del-col': {
        openSheet(`<h2>Delete this collection?</h2><p>The drinks stay in your recipes.</p><div class="stack"><button class="btn wide" type="button" data-act="do-del-col" data-id="${esc(id)}">Delete</button><button class="btn ghost wide" type="button" data-act="close">Cancel</button></div>`, 'Delete collection'); break;
      }
      case 'do-del-col': db.collections = db.collections.filter(x => x.id !== id); save('collections'); pruneRecipes(); closeSheet(); location.hash = '#/recipes/collections'; break;
      case 'cat': location.replace('#/discover/' + el.dataset.cat); break;
      case 'bar-add': { const v = norm(el.dataset.v); if (v && !db.bar.includes(v)) { db.bar.push(v); save('bar'); } render(); break; }
      case 'bar-remove': db.bar = db.bar.filter(b => b !== el.dataset.v); save('bar'); render(); break;
      case 'shop-missing': {
        const r = getRecipe(id); if (!r) break;
        const part = (resultState(r).mock && r.mocktail) ? r.mocktail : r;
        const items = (el.dataset.all ? part.ingredients.filter(i => !isStaple(i.item)) : barStats(part.ingredients).missing).map(i => i.item);
        const n = addShop(items);
        toast(n ? `Added ${n} to your shopping list.` : 'Already on your shopping list.', { label: 'View', fn: () => { location.hash = '#/recipes/bar'; } });
        break;
      }
      case 'shop-toggle': { const it = db.shop.find(x => x.id === id); if (it) { it.done = el.checked; save('shop'); render(); } break; }
      case 'shop-clear': db.shop = db.shop.filter(x => !x.done); save('shop'); render(); break;
      case 'shop-to-bar': {
        db.shop.filter(x => x.done).forEach(x => { const v = norm(x.item); if (v && !db.bar.includes(v)) db.bar.push(v); });
        db.shop = db.shop.filter(x => !x.done); save('shop'); save('bar'); toast('Moved to My Bar.'); render(); break;
      }
      case 'shop-share': {
        const text = 'Lixr shopping list\n' + db.shop.filter(x => !x.done).map(x => '• ' + x.item).join('\n');
        if (navigator.share) { try { await navigator.share({ title: 'Lixr shopping list', text }); } catch (err) {} }
        else { try { await navigator.clipboard.writeText(text); toast('List copied.'); } catch (err) { prompt('Copy your list:', text); } }
        break;
      }
      case 'ing-add': { $('#ingRows').insertAdjacentHTML('beforeend', ingRow()); const rows = document.querySelectorAll('.ingrow'); rows[rows.length - 1].querySelector('[name=amt]').focus(); break; }
      case 'ing-del': { const rows = document.querySelectorAll('.ingrow'); if (rows.length > 1) el.closest('.ingrow').remove(); else el.closest('.ingrow').querySelectorAll('input').forEach(i => i.value = ''); break; }
      case 'del-recipe': {
        openSheet(`<h2>Delete this recipe?</h2><p>This removes your recipe from this device.</p><div class="stack"><button class="btn wide" type="button" data-act="do-del-recipe" data-id="${esc(id)}">Delete</button><button class="btn ghost wide" type="button" data-act="close">Cancel</button></div>`, 'Delete recipe'); break;
      }
      case 'do-del-recipe': {
        delete db.recipes[id]; save('recipes');
        db.saved = db.saved.filter(x => x !== id); db.favs = db.favs.filter(x => x !== id); db.history = db.history.filter(h => h.id !== id);
        db.collections.forEach(c => { c.ids = c.ids.filter(x => x !== id); });
        ['saved', 'favs', 'history', 'collections'].forEach(save);
        closeSheet(); toast('Recipe deleted.'); location.replace('#/recipes'); break;
      }
      case 'report': report(id); break;
      case 'send-report': sendReport(id); break;
      case 'update': swWaiting && swWaiting.postMessage({ type: 'SKIP_WAITING' }); break;
      case 'set': {
        const k = el.dataset.k, v = el.dataset.v;
        if (k === 'mode' && v === 'all' && settings.age !== true) {
          openSheet(`<h2>Are you 21 or older?</h2><p>Showing cocktails means showing recipes with alcohol.</p><div class="stack">
            <button class="btn wide" type="button" data-act="confirm-age">I’m 21 or older</button><button class="btn ghost wide" type="button" data-act="close">Keep mocktails only</button></div>`, 'Age check');
          break;
        }
        settings[k] = v; save('settings'); if (k === 'theme') applyTheme(); render(); break;
      }
      case 'confirm-age': settings.age = true; settings.mode = 'all'; save('settings'); closeSheet(); render(); break;
      case 'clear': {
        openSheet(`<h2>Clear all Lixr data?</h2><p>This removes saved recipes, favorites, collections and settings from this device.</p><div class="stack">
          <button class="btn wide" type="button" data-act="do-clear">Clear everything</button><button class="btn ghost wide" type="button" data-act="close">Cancel</button></div>`, 'Clear data'); break;
      }
      case 'do-clear': Object.keys(localStorage).filter(k => k.startsWith('lixr.')).forEach(k => localStorage.removeItem(k)); location.replace(location.pathname); break;
    }
  });
  document.addEventListener('submit', e => {
    const f = e.target.closest('form[data-form]'); if (!f) return;
    e.preventDefault();
    const inp = f.querySelector('input'); const v = inp.value.trim(); if (!v) { inp.focus(); return; }
    if (f.dataset.form === 'bar') { v.split(',').map(norm).filter(Boolean).forEach(x => { if (!db.bar.includes(x)) db.bar.push(x); }); save('bar'); }
    else addShop([v]);
    render(); const again = $(f.dataset.form === 'bar' ? '#barIn' : '#shopIn'); again && again.focus();
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'q') { discoverQ = e.target.value; const cat = route().a || 'all'; $('#results').innerHTML = discoverResults(CATS.some(c => c.id === cat) ? cat : 'all'); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.id === 'colName') { const b = $('#sheet [data-act="create-col"], #sheet [data-act="do-rename"]'); b && b.click(); }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && e.target.id === 'desc') cloneText(e.target.value);
  });

  const after = {
    edit() {
      const f = $('#editForm');
      f.addEventListener('submit', e => { e.preventDefault(); saveEditor(); });
      f.addEventListener('input', e => {
        if (['glass', 'garnish', 'color', 'color2', 'name'].includes(e.target.name)) {
          const d = readEditor(); $('#edArt').innerHTML = drinkSVG(d);
        }
      });
      f.addEventListener('change', e => { if (['glass', 'garnish'].includes(e.target.name)) $('#edArt').innerHTML = drinkSVG(readEditor()); });
    },
    clone(r) { if (r.a !== 'describe') startCamera(); else setTimeout(() => $('#desc') && $('#desc').focus(), 50); }
  };

  // ---------- Offline / online ----------
  window.addEventListener('online', () => toast('You’re back online.'));
  window.addEventListener('offline', () => toast('You’re offline. Your recipes and the library still work.'));

  // ---------- Service worker ----------
  let swWaiting = null;
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').then(reg => {
      const ready = w => { swWaiting = w; toast('A new version of Lixr is ready.', { label: 'Refresh', fn: () => w.postMessage({ type: 'SKIP_WAITING' }) }); if (route().name === 'home') render(); };
      if (reg.waiting && navigator.serviceWorker.controller) ready(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        nw && nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) ready(nw); });
      });
    }).catch(() => {});
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
  }

  // ---------- Start ----------
  if (!location.hash) history.replaceState(null, '', '#/home');
  render();
  if (settings.age === null) ageGate(render);

  // For testing in a browser console.
  window.__lixr = { settings, db, cleanRecipe, handleCloneResponse };
})();
