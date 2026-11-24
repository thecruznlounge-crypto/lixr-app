/* Lixr AI add-on: connects Scan, Photo and Describe to the AI clone service (/api/clone).
   Loaded after the main script; keeps the app's existing screens and layout.
   If the AI can't be reached, it falls back to the original local recipe search. */
(function () {
  let lastImage = null; // base64 JPEG of the last captured photo
  const localMatch = window.match;

  function toJpeg(file) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1568 / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        res(c.toDataURL('image/jpeg', 0.85).split(',')[1]);
      };
      img.onerror = () => rej(new Error('That file isn’t an image Lixr can read.'));
      img.src = URL.createObjectURL(file);
    });
  }

  window.preview = function (el) {
    const f = el.files && el.files[0];
    if (!f) return;
    $('#preview').src = URL.createObjectURL(f);
    lastImage = null;
    toJpeg(f).then(b => { lastImage = b; }).catch(e => { $('#matches').textContent = e.message; });
  };

  const TYPE = { cocktail: 'Cocktail', mocktail: 'Mocktail', coffee: 'Coffee & more', boba: 'Coffee & more' };
  function pickImg(hex) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
    if (!m) return 'hero.jpg';
    const [r, g, b] = m.slice(1).map(x => parseInt(x, 16));
    if (b > r && b > g) return 'blue.jpg';
    if (r > 150 && g < 120) return 'berry.jpg';
    if (r > g && g > b && r < 200) return 'choc.jpg';
    return 'hero.jpg';
  }
  const s = (v, n) => String(v == null ? '' : v).slice(0, n);
  function convert(x) {
    if (!x || !x.name || !Array.isArray(x.ingredients) || !Array.isArray(x.steps)) return null;
    const ingredients = x.ingredients.slice(0, 20).map(i => [i && isFinite(Number(i.amt)) && i.amt !== null ? Number(i.amt) : 0, s(i && i.unit, 12), s(i && i.item, 80)]).filter(i => i[2]);
    const steps = x.steps.slice(0, 12).map(t => s(t, 240)).filter(Boolean);
    if (!ingredients.length || !steps.length) return null;
    return { id: 'ai' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ai: true, match: s(x.match, 20) || 'Close match',
      name: s(x.name, 60), type: TYPE[x.cat] || 'Cocktail', desc: s(x.desc, 280), img: pickImg(x.color2 || x.color), ingredients, steps };
  }

  window.match = async function () {
    const q = ($('#desc') && $('#desc').value || '').trim();
    const action = mode === 'Scan' ? 'menu' : mode === 'Photo' ? 'photo' : 'describe';
    const out = $('#matches');
    if (action !== 'describe' && !lastImage) { out.textContent = 'Take or upload a photo first.'; return; }
    if (action === 'describe' && q.length < 3) { out.textContent = 'Enter a drink name or description.'; return; }
    if (!navigator.onLine) { out.innerHTML = '<p class="muted">You’re offline, so here are local matches.</p>'; if (q) localMatch(); return; }
    out.innerHTML = `<p class="muted">${action === 'menu' ? 'Reading the menu…' : action === 'photo' ? 'Looking at your drink…' : 'Mixing up your recipe…'}</p>`;
    try {
      const res = await fetch('/api/clone', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, query: q, image: action === 'describe' ? undefined : lastImage }) });
      let data = null; try { data = await res.json(); } catch (e) {}
      if (!res.ok) throw new Error((data && data.error) || 'The clone service had a problem.');
      const list = (data.recipes || []).map(convert).filter(Boolean);
      if (!list.length) { out.innerHTML = `<p>${esc(data.message || 'No clone found. Try a clearer photo or more detail.')}</p>`; return; }
      list.forEach(r => custom.push(r)); persist();
      if (list.length === 1) { detail(list[0].id); return; }
      out.innerHTML = '<h2>Drinks on this menu</h2><div class="cards">' + list.map(card).join('') + '</div>';
    } catch (e) {
      out.innerHTML = `<p class="muted">${esc(e.message)}${q ? ' Showing local matches instead.' : ''}</p>`;
      if (q) { const keep = out.innerHTML; localMatch(); out.insertAdjacentHTML('afterbegin', keep); }
    }
  };

  // "Report this result" on AI clones (Google Play requires a way to report AI content).
  const baseRender = window.render;
  window.render = function () {
    baseRender();
    // Items with no amount (like "Ice") show without a leading 0.
    if (page === 'Detail') document.querySelectorAll('#app label.check').forEach(l => {
      const t = l.lastChild; if (t && t.nodeType === 3 && /^\s*0\s/.test(t.nodeValue)) t.nodeValue = ' ' + t.nodeValue.replace(/^\s*0\s+/, '').trim();
    });
    if (page === 'Detail' && current && current.ai) {
      const app = $('#app');
      app.querySelector('h1').insertAdjacentHTML('afterend', `<small>AI clone · ${esc(current.match)}</small>`);
      app.insertAdjacentHTML('beforeend', '<p><button onclick="reportAI()">Report this result</button></p><p class="muted">AI clones are best guesses. Taste and adjust.</p>');
    }
  };
  window.reportAI = async function () {
    const reason = prompt('What went wrong with this clone? (wrong drink, unsafe, offensive, other)');
    if (reason === null) return;
    try {
      const r = await fetch('/api/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: current.name, reason: reason.slice(0, 60), recipe: current }) });
      alert(r.ok ? 'Thanks. Your report was sent.' : 'Couldn’t send the report. Try again later.');
    } catch (e) { alert('Couldn’t send the report. Try again when you’re online.'); }
  };
})();
