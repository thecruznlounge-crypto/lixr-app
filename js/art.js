/* Lixr — drink illustrations drawn as SVG, so every drink has a picture offline. */
(function () {
  let uid = 0;

  const GLASSES = {
    // interior path (liquid clip), outline path, level (y where liquid starts), extra (stem/base)
    rocks: {
      inner: 'M24 46 L76 46 L73 100 Q72 104 67 104 L33 104 Q28 104 27 100 Z',
      outline: 'M20 34 L80 34 L76 102 Q75 108 68 108 L32 108 Q25 108 24 102 Z',
      level: 46, ice: [[30, 52, -12], [50, 56, 14], [38, 74, 6], [58, 78, -18]], extra: ''
    },
    highball: {
      inner: 'M30 34 L70 34 L68 104 Q68 106 65 106 L35 106 Q32 106 32 104 Z',
      outline: 'M27 14 L73 14 L71 106 Q71 110 66 110 L34 110 Q29 110 29 106 Z',
      level: 34, ice: [[34, 40, -10], [50, 50, 12], [36, 64, 8], [52, 76, -14], [40, 88, 4]], extra: '', straw: true
    },
    coupe: {
      inner: 'M18 46 Q50 86 82 46 Z',
      outline: 'M12 40 Q50 96 88 40 Z',
      level: 46, ice: [], extra: '<path d="M50 72 L50 104" stroke-width="3"/><path d="M34 108 Q50 102 66 108" stroke-width="3"/>'
    },
    martini: {
      inner: 'M18 40 L82 40 L50 72 Z',
      outline: 'M10 32 L90 32 L50 78 Z',
      level: 40, ice: [], extra: '<path d="M50 78 L50 104" stroke-width="3"/><path d="M34 108 Q50 102 66 108" stroke-width="3"/>'
    },
    hurricane: {
      inner: 'M34 36 Q28 56 36 72 Q44 82 40 96 L60 96 Q56 82 64 72 Q72 56 66 36 Z',
      outline: 'M30 18 Q22 52 32 72 Q40 84 36 98 L64 98 Q60 84 68 72 Q78 52 70 18 Z',
      level: 36, ice: [], extra: '<path d="M50 98 L50 106" stroke-width="3"/><path d="M36 110 Q50 104 64 110" stroke-width="3"/>', straw: true
    },
    mug: {
      inner: 'M28 40 L68 40 L68 100 Q68 104 64 104 L32 104 Q28 104 28 100 Z',
      outline: 'M24 30 L72 30 L72 102 Q72 108 66 108 L30 108 Q24 108 24 102 Z',
      level: 40, ice: [], extra: '<path d="M72 46 Q90 48 88 66 Q86 82 72 82" stroke-width="4"/>'
    }
  };

  function garnish(type, g) {
    const top = g === 'coupe' || g === 'martini' ? 30 : 22;
    switch (type) {
      case 'pineapple':
        return `<g transform="translate(64 ${top - 14}) rotate(18)"><path d="M0 26 L14 0 L28 26 Z" fill="#F9C935"/><path d="M0 26 L28 26" stroke="#E0A010" stroke-width="3"/><path d="M14 0 L8 -12 M14 0 L14 -14 M14 0 L20 -12" stroke="#3FA34D" stroke-width="3" stroke-linecap="round"/></g><circle cx="70" cy="${top + 4}" r="6" fill="#E3172E"/><path d="M70 ${top - 2} Q72 ${top - 14} 80 ${top - 18}" stroke="#4E7A2A" stroke-width="2" fill="none"/>`;
      case 'lime':
        return `<g transform="translate(76 ${top + 4})"><circle r="15" fill="#7DBE2E"/><circle r="12" fill="#D9F28A"/><path d="M0 -12 L0 12 M-12 0 L12 0 M-8.5 -8.5 L8.5 8.5 M8.5 -8.5 L-8.5 8.5" stroke="#9CCB3E" stroke-width="1.5"/></g>`;
      case 'strawberry':
        return `<g transform="translate(76 ${top})"><path d="M-10 -4 Q-12 14 0 20 Q12 14 10 -4 Q0 -10 -10 -4 Z" fill="#E8233F"/><path d="M-9 -6 L-2 0 L0 -8 L2 0 L9 -6" stroke="#3FA34D" stroke-width="3" fill="none" stroke-linejoin="round"/><circle cx="-3" cy="6" r="1" fill="#FFD9A0"/><circle cx="4" cy="10" r="1" fill="#FFD9A0"/></g>`;
      case 'blackberry':
        return `<g transform="translate(72 ${top + 2})" fill="#2A0A3A">${[[-5, 0], [0, -4], [5, 0], [-3, 6], [3, 6], [0, 1]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" stroke="#5B2378" stroke-width="1"/>`).join('')}</g>`;
      case 'mint':
        return `<g transform="translate(58 ${top - 6})"><path d="M0 10 Q-14 0 -4 -14 Q6 -2 0 10 Z" fill="#3FA34D"/><path d="M4 12 Q20 4 14 -12 Q0 -2 4 12 Z" fill="#57C163"/></g>`;
      case 'cream':
        return `<path d="M${g === 'martini' ? 30 : 32} ${top + 10} Q38 ${top - 4} 50 ${top + 2} Q62 ${top - 6} ${g === 'martini' ? 70 : 68} ${top + 10} Z" fill="#F7EDE0"/><circle cx="50" cy="${top}" r="4" fill="#5A2E14"/>`;
      case 'beans':
        return [[42, 50], [50, 48], [58, 50]].map(p => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="3.2" ry="4.6" fill="#2B160A"/>`).join('');
      case 'dragonfruit':
        return `<g transform="translate(74 ${top + 2})"><circle r="13" fill="#FF3D8B"/><circle r="10" fill="#FFF1F6"/>${[[-4, -3], [3, -5], [5, 3], [-3, 5], [0, 0]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="1" fill="#222"/>`).join('')}</g>`;
      case 'orange':
        return `<g transform="translate(76 ${top + 4})"><circle r="15" fill="#F28C1A"/><circle r="12" fill="#FFD08A"/></g>`;
      case 'cherry':
        return `<circle cx="70" cy="${top + 4}" r="6" fill="#E3172E"/><path d="M70 ${top - 2} Q72 ${top - 14} 80 ${top - 18}" stroke="#4E7A2A" stroke-width="2" fill="none"/>`;
      default:
        return '';
    }
  }

  function drinkSVG(r, opts) {
    opts = opts || {};
    const id = 'lx' + (++uid);
    const g = GLASSES[r.glass] || GLASSES.rocks;
    const c1 = r.color || '#B45CFF';
    const c2 = r.color2 || '#5A12A0';
    const ice = g.ice.map(([x, y, a]) =>
      `<rect x="${x}" y="${y}" width="16" height="15" rx="3" transform="rotate(${a} ${x + 8} ${y + 8})" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>`).join('');
    const boba = r.garnish === 'boba'
      ? Array.from({ length: 14 }, (_, i) => `<circle cx="${36 + (i % 7) * 4.6}" cy="${100 - Math.floor(i / 7) * 5}" r="2.6" fill="#2A160E"/>`).join('')
      : '';
    const straw = g.straw ? `<path d="M58 ${g.level - 2} L70 -2" stroke="#F5F0FA" stroke-width="5" stroke-linecap="round"/><path d="M58 ${g.level - 2} L70 -2" stroke="${opts.accent || '#C03CF5'}" stroke-width="5" stroke-dasharray="4 5" stroke-linecap="round"/>` : '';
    return `<svg viewBox="0 -24 100 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${(r.name || 'Drink').replace(/"/g, '')}" class="${opts.cls || ''}">
<defs>
<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
<filter id="${id}f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
<clipPath id="${id}c"><path d="${g.inner}"/></clipPath>
</defs>
<path d="${g.inner}" fill="${c1}" opacity="0.55" filter="url(#${id}f)"/>
${straw}
<g clip-path="url(#${id}c)"><rect x="0" y="${g.level}" width="100" height="100" fill="url(#${id}g)"/>${ice}${boba}<rect x="${r.glass === 'coupe' || r.glass === 'martini' ? 26 : 30}" y="${g.level}" width="4" height="70" fill="rgba(255,255,255,0.25)"/></g>
<g fill="none" stroke="rgba(255,255,255,0.75)" stroke-linejoin="round" stroke-linecap="round"><path d="${g.outline}" stroke-width="2.4"/>${g.extra}</g>
${garnish(r.garnish, r.glass)}
</svg>`;
  }

  window.LixrArt = { drinkSVG };
})();
