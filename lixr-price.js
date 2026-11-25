/* Lixr price comparison: what a drink costs at a bar vs. making it at home.
   Prices are typical US estimates. Users can enter their own bar price and store prices;
   those are saved on the device (localStorage lixrBarPrices / lixrPrices). */
(function () {
  // Each rule: pattern, label, pack shown to the user, pack price ($), pack size in fl oz, optional price per single item.
  const R = (re, label, pack, price, oz, each) => ({ re, label, pack, price, oz, each });
  const RULES = [
    R(/^(ice|crushed ice|water|warm water|salt|sugar|brown sugar|cinnamon|nutmeg)$/, 'free', '', 0, 1),
    R(/vodka/, 'vodka', '750 ml bottle', 20, 25.4),
    R(/\brum\b/, 'rum', '750 ml bottle', 18, 25.4),
    R(/tequila/, 'tequila', '750 ml bottle', 25, 25.4),
    R(/\bgin\b/, 'gin', '750 ml bottle', 22, 25.4),
    R(/bourbon|whiske?y/, 'whiskey', '750 ml bottle', 30, 25.4),
    R(/cognac|brandy/, 'cognac', '750 ml bottle', 35, 25.4),
    R(/triple sec|cura[cç]ao/, 'orange liqueur', '750 ml bottle', 15, 25.4),
    R(/coffee liqueur/, 'coffee liqueur', '750 ml bottle', 22, 25.4),
    R(/campari|aperitif/, 'red bitter aperitif', '750 ml bottle', 28, 25.4),
    R(/vermouth/, 'vermouth', '750 ml bottle', 15, 25.4),
    R(/liqueur/, 'liqueur', '750 ml bottle', 22, 25.4),
    R(/sparkling wine|prosecco|champagne|\bwine\b/, 'sparkling wine', '750 ml bottle', 14, 25.4),
    R(/bitters/, 'bitters', '4 oz bottle', 10, 4),
    R(/\b(lime|lemon)\b/, 'limes / lemons', '1 lb bag (about 8 oz juice)', 3, 8, 0.4),
    R(/orange juice/, 'orange juice', '52 oz carton', 4.5, 52),
    R(/pineapple juice/, 'pineapple juice', '46 oz can', 3.5, 46),
    R(/cranberry juice/, 'cranberry juice', '64 oz bottle', 4, 64),
    R(/white grape juice/, 'white grape juice', '64 oz bottle', 4.5, 64),
    R(/coconut water/, 'coconut water', '33 oz carton', 4, 33),
    R(/juice or pur[eé]e|pur[eé]e|nectar|\bjuice\b/, 'fruit juice or purée', '32 oz bottle', 4, 32),
    R(/pieces|strawberr|blueberr|banana|mango|watermelon|cucumber/, 'fresh or frozen fruit', '1 lb bag', 4, 16, 0.3),
    R(/\bmint\b/, 'mint', 'bunch (about 30 leaves)', 2, 30, 0.07),
    R(/cream of coconut|coconut cream/, 'cream of coconut', '15 oz can', 3.5, 15),
    R(/coconut milk/, 'coconut milk', '13.5 oz can', 2.5, 13.5),
    R(/condensed milk|evaporated milk/, 'canned milk', '14 oz can', 2.5, 14),
    R(/oat milk|rice milk/, 'oat / rice milk', '64 oz carton', 4.5, 64),
    R(/ice cream/, 'vanilla ice cream', '48 oz tub', 5, 48),
    R(/whipped cream/, 'whipped cream', '13 oz can', 4, 13),
    R(/\bmilk\b|half-and-half|\bcream\b/, 'milk', '1 gallon', 4, 128),
    R(/yogurt/, 'yogurt', '32 oz tub', 4, 32),
    R(/espresso/, 'espresso', 'per shot (home brewed)', 0.4, 1),
    R(/coffee/, 'coffee', '12 oz bag (about 100 oz brewed)', 12, 100),
    R(/matcha/, 'matcha', '30 g tin (about 15 tsp)', 20, 2.5),
    R(/\btea\b|hibiscus|mauby|purple corn/, 'tea', 'box (about 160 oz brewed)', 10, 160),
    R(/simple syrup|brown sugar syrup|cinnamon syrup|ginger syrup/, 'homemade syrup', 'homemade (sugar + water)', 1, 20),
    R(/chocolate syrup/, 'chocolate syrup', '24 oz bottle', 3.5, 24),
    R(/maple syrup/, 'maple syrup', '12 oz bottle', 8, 12),
    R(/honey/, 'honey', '12 oz bottle', 5, 12),
    R(/agave/, 'agave syrup', '23 oz bottle', 6, 23),
    R(/syrup|caramel|grenadine/, 'flavored syrup', '25 oz bottle', 10, 25),
    R(/tonic/, 'tonic water', '1 liter bottle', 3, 33.8),
    R(/ginger beer/, 'ginger beer', '4-pack of 12 oz', 6, 48),
    R(/soda water|sparkling water|club soda/, 'sparkling water', '1 liter bottle', 1.5, 33.8),
    R(/soda|cola/, 'soda', '2 liter bottle', 2.5, 67.6),
    R(/peanut butter/, 'peanut butter', '16 oz jar', 3.5, 16),
    R(/cookies/, 'sandwich cookies', 'pack (about 6 cups)', 4.5, 48, 0.15),
    R(/tamarind/, 'tamarind concentrate', '8 oz jar', 4, 8),
    R(/ginger/, 'fresh ginger', 'knob (about 4 oz juice)', 1.5, 4, 0.3),
    R(/vanilla/, 'vanilla extract', '2 oz bottle', 6, 2)
  ];
  const FALLBACK = { label: 'other', pack: 'estimate', price: 0.25, oz: 1, unknown: true };
  const TO_OZ = { oz: 1, ml: 1 / 29.57, cup: 8, cups: 8, tbsp: 0.5, tsp: 1 / 6, dash: 0.03, dashes: 0.03, pinch: 0.01, scoop: 4, scoops: 4, shot: 1, shots: 1 };
  const COUNT = ['', 'each', 'whole', 'slice', 'slices', 'leaf', 'leaves', 'piece', 'pieces', 'wedge'];
  const BAR = { 'Cocktail': 14, 'Mocktail': 8, 'Coffee': 6, 'Coffee & more': 7, 'Tea': 6, 'Smoothie': 8, 'Milkshake': 8, 'Frozen drink': 11, 'Juice & lemonade': 6, 'Wellness drink': 8, 'Caribbean': 9, 'Energy drink': 6, 'Specialty': 9 };

  const load = (k) => { try { return JSON.parse(localStorage[k] || '{}'); } catch (e) { return {}; } };
  let barPrices = load('lixrBarPrices'), myPrices = load('lixrPrices'), editingPrice = false;
  const save = () => { localStorage.lixrBarPrices = JSON.stringify(barPrices); localStorage.lixrPrices = JSON.stringify(myPrices); };
  const money = (n) => '$' + (Math.round(n * 100) / 100).toFixed(2);

  function ruleFor(name) {
    const n = String(name || '').toLowerCase();
    return RULES.find(r => r.re.test(n)) || FALLBACK;
  }
  function packPrice(rule) { return rule.label in myPrices ? myPrices[rule.label] : rule.price; }
  function costOf(ing) {
    const [amt, unit, name] = ing;
    const rule = ruleFor(name), price = packPrice(rule);
    if (!price || !(amt > 0)) return { rule, cost: 0 };
    const u = String(unit || '').toLowerCase().trim();
    let cost;
    if (COUNT.includes(u) && rule.each != null) cost = amt * rule.each * (rule.label in myPrices ? price / rule.price : 1);
    else cost = amt * (TO_OZ[u] != null ? TO_OZ[u] : 1) * (price / rule.oz);
    return { rule, cost };
  }
  function barPriceOf(r) {
    if (barPrices[r.id] > 0) return { price: barPrices[r.id], src: 'yours' };
    if (r.barPrice > 0) return { price: r.barPrice, src: 'menu' };
    return { price: BAR[r.type] || 9, src: 'typical' };
  }

  function panel(r) {
    const lines = r.ingredients.map(i => Object.assign({ i }, costOf(i)));
    const home = lines.reduce((t, l) => t + l.cost, 0) * serves;
    const bp = barPriceOf(r), bar = bp.price * serves;
    const saveAmt = bar - home, pct = bar > 0 ? Math.round(saveAmt / bar * 100) : 0;
    const per = serves > 1 ? ` for ${serves}` : '';
    const srcNote = { yours: 'your price', menu: 'from the menu', typical: 'typical price' }[bp.src];
    if (editingPrice) {
      const rules = [...new Map(lines.filter(l => l.rule !== FALLBACK && l.rule.price > 0).map(l => [l.rule.label, l.rule])).values()];
      return `<div class="panel" id="pricePanel"><strong>Edit prices</strong>
        <label>What you pay for this drink out ($)<input id="pBar" type="number" min="0" step="0.25" inputmode="decimal" value="${bp.price}"></label>
        <p class="muted">What you pay at your store:</p>
        ${rules.map(x => `<label>${esc(x.label)} · ${esc(x.pack)} ($)<input data-price="${esc(x.label)}" type="number" min="0" step="0.25" inputmode="decimal" value="${packPrice(x)}"></label>`).join('')}
        <div class="row"><button class="primary" onclick="lixrSavePrices()">Save prices</button><button onclick="lixrResetPrices()">Reset to estimates</button><button onclick="lixrEditPrices(false)">Cancel</button></div></div>`;
    }
    return `<div class="panel" id="pricePanel"><div class="row" style="justify-content:space-between"><strong>Price comparison</strong><button onclick="lixrEditPrices(true)">Edit prices</button></div>
      <div class="row" style="justify-content:space-between;flex-wrap:nowrap;text-align:center;margin:12px 0">
        <div style="flex:1"><small class="muted">At a bar${per}</small><div style="font-size:22px;font-weight:800">${money(bar)}</div><small class="muted">${srcNote}</small></div>
        <div style="flex:1"><small class="muted">Make at home${per}</small><div style="font-size:22px;font-weight:800">~${money(home)}</div><small class="muted">estimate</small></div>
        <div style="flex:1"><small class="muted">You save</small><div style="font-size:22px;font-weight:800;color:#dc4dff">${saveAmt > 0 ? money(saveAmt) : '$0.00'}</div><small class="muted">${saveAmt > 0 ? pct + '%' : 'about the same'}</small></div>
      </div>
      <details><summary class="muted">Cost per ingredient</summary>${lines.map(l => `<div class="row" style="justify-content:space-between"><span>${esc(l.i[2])}</span><span class="muted">${l.cost ? money(l.cost * serves) : '—'}${l.rule.unknown ? ' (est.)' : ''}</span></div>`).join('')}</details>
      <p class="muted" style="margin:10px 0 0">Home cost counts only what goes in the glass, not the whole bottle. Estimates use typical US prices; tap Edit prices to use yours.</p></div>`;
  }

  window.lixrEditPrices = (on) => { editingPrice = on; render(); const p = document.getElementById('pricePanel'); p && p.scrollIntoView({ block: 'center' }); };
  window.lixrSavePrices = () => {
    const b = parseFloat(document.getElementById('pBar').value);
    if (b > 0) barPrices[current.id] = b; else delete barPrices[current.id];
    document.querySelectorAll('#pricePanel [data-price]').forEach(inp => {
      const label = inp.dataset.price, v = parseFloat(inp.value), rule = RULES.find(x => x.label === label);
      if (rule && v >= 0 && v !== rule.price) myPrices[label] = v; else delete myPrices[label];
    });
    save(); lixrEditPrices(false);
  };
  window.lixrResetPrices = () => {
    delete barPrices[current.id];
    document.querySelectorAll('#pricePanel [data-price]').forEach(inp => delete myPrices[inp.dataset.price]);
    save(); lixrEditPrices(false);
  };

  const baseRender = window.render;
  window.render = function () {
    if (page !== 'Detail') editingPrice = false;
    baseRender();
    if (page === 'Detail' && current && Array.isArray(current.ingredients)) {
      const first = document.querySelector('#app .panel');
      if (first) first.insertAdjacentHTML('afterend', panel(current));
    }
  };
  render();
})();
