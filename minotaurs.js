// Four LLM minotaur characters — richly illustrated SVG with animations.
// Talkie removed. Models: claude-sonnet-4-6, gpt-5.2, gemini-3-pro-preview, deepseek-v3

window.MODEL_KEYS = ['claude-sonnet-4-6', 'gpt-5.2', 'gemini-3-pro-preview', 'deepseek-v3'];

window.MINOTAURS = {
  'claude-sonnet-4-6': {
    label: 'Claude', archetype: 'The Philosopher',
    blurb: 'Thoughtful · Careful · Deliberate',
    fur: '#7c4dff', furHi: '#b08aff', furLo: '#4a1f99',
    skin: '#3a2266', skinHi: '#6a4aaa',
    horn: '#f0e8d0', hornDark: '#9c8860',
    cloth1: '#d4a020', cloth2: '#8b5e10',
    eye: '#ffe87a', trail: '#7c4dff', accessory: 'spectacles',
  },
  'gpt-5.2': {
    label: 'GPT-5.2', archetype: 'The Exec',
    blurb: 'Confident · Direct · Polished',
    fur: '#10a37f', furHi: '#44dca8', furLo: '#0a6e54',
    skin: '#0a4a3a', skinHi: '#1a7a60',
    horn: '#f0e8d0', hornDark: '#9c8860',
    cloth1: '#1a232c', cloth2: '#0a1218',
    eye: '#fff8d0', trail: '#10a37f', accessory: 'tie',
  },
  'gemini-3-pro-preview': {
    label: 'Gemini', archetype: 'The Polymath',
    blurb: 'Curious · Excitable · Resourceful',
    fur: '#4285f4', furHi: '#88bbff', furLo: '#1d56b5',
    skin: '#0e2a5e', skinHi: '#2a5aaa',
    horn: '#f0e8d0', hornDark: '#9c8860',
    cloth1: '#ea4335', cloth2: '#7a1a10',
    eye: '#fff8d0', trail: '#4285f4', accessory: 'satchel',
  },
  'deepseek-v3': {
    label: 'DeepSeek', archetype: 'The Shadow',
    blurb: 'Mysterious · Efficient · Silent',
    fur: '#243050', furHi: '#4a6aaa', furLo: '#0e1424',
    skin: '#0a0e18', skinHi: '#2a3a60',
    horn: '#0a1424', hornDark: '#000',
    cloth1: '#0a0e18', cloth2: '#000',
    eye: '#3a90e8', trail: '#1e3a5f', accessory: 'glow',
  },
};

function buildSVG(key, mode) {
  const m = window.MINOTAURS[key];
  const id = `mn${key.replace(/[^a-z0-9]/g,'')}-${mode}`;
  const compact = mode === 'token';
  const vb = compact ? '0 0 100 100' : '0 0 200 270';

  const animCSS = compact ? '' : `<style>
    @keyframes ${id}breath {
      0%,100%{transform:scaleY(1);transform-origin:center 200px}
      50%{transform:scaleY(1.018);transform-origin:center 200px}
    }
    @keyframes ${id}blink {
      0%,90%,100%{ry:0}96%{ry:11}
    }
    @keyframes ${id}sway {
      0%,100%{transform:rotate(-1.2deg)}
      50%{transform:rotate(1.2deg)}
    }
    .${id}-body{animation:${id}breath 3.4s ease-in-out infinite}
    .${id}-sway{animation:${id}sway 4.2s ease-in-out infinite;transform-origin:100px 270px}
  </style>`;

  const defs = `<defs>
    <radialGradient id="${id}fur" cx="38%" cy="28%" r="75%">
      <stop offset="0%" stop-color="${m.furHi}"/>
      <stop offset="48%" stop-color="${m.fur}"/>
      <stop offset="100%" stop-color="${m.furLo}"/>
    </radialGradient>
    <radialGradient id="${id}skin" cx="45%" cy="35%" r="70%">
      <stop offset="0%" stop-color="${m.skinHi}"/>
      <stop offset="100%" stop-color="${m.skin}"/>
    </radialGradient>
    <linearGradient id="${id}horn" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${m.horn}"/>
      <stop offset="100%" stop-color="${m.hornDark}"/>
    </linearGradient>
    <linearGradient id="${id}cloth" x1="0" y1="0" x2="0.1" y2="1">
      <stop offset="0%" stop-color="${m.cloth1}"/>
      <stop offset="100%" stop-color="${m.cloth2}"/>
    </linearGradient>
    <radialGradient id="${id}eye" cx="32%" cy="28%" r="65%">
      <stop offset="0%" stop-color="${m.eye}"/>
      <stop offset="70%" stop-color="${m.fur}"/>
      <stop offset="100%" stop-color="${m.furLo}"/>
    </radialGradient>
    <filter id="${id}ds"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${m.furLo}" flood-opacity="0.45"/></filter>
    <filter id="${id}glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="${id}sg"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;

  if (compact) {
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${defs}
      <path d="M10 88 Q50 74 90 88 L90 100 L10 100Z" fill="url(#${id}cloth)"/>
      <path d="M22 30 C6 18 2 2 8 -4 C18 8 28 20 34 30Z" fill="url(#${id}horn)"/>
      <path d="M78 30 C94 18 98 2 92 -4 C82 8 72 20 66 30Z" fill="url(#${id}horn)"/>
      <path d="M10 -2 Q16 12 24 26" stroke="${m.horn}" stroke-width="1.2" fill="none" opacity="0.8"/>
      <path d="M90 -2 Q84 12 76 26" stroke="${m.horn}" stroke-width="1.2" fill="none" opacity="0.8"/>
      <path d="M16 48 Q2 46 6 62 Q14 58 20 54Z" fill="url(#${id}fur)"/>
      <path d="M84 48 Q98 46 94 62 Q86 58 80 54Z" fill="url(#${id}fur)"/>
      <ellipse cx="12" cy="55" rx="2.5" ry="3.5" fill="${m.skin}" opacity="0.9"/>
      <ellipse cx="88" cy="55" rx="2.5" ry="3.5" fill="${m.skin}" opacity="0.9"/>
      <path d="M50 12 C72 12 84 28 84 48 C84 64 78 74 68 80 L62 84 Q50 88 38 84 L32 80 C22 74 16 64 16 48 C16 28 28 12 50 12Z" fill="url(#${id}fur)" filter="url(#${id}ds)"/>
      <ellipse cx="50" cy="34" rx="22" ry="10" fill="${m.furHi}" opacity="0.4"/>
      <path d="M34 56 Q50 52 66 56 Q70 72 60 80 Q50 84 40 80 Q30 72 34 56Z" fill="url(#${id}skin)"/>
      <ellipse cx="50" cy="61" rx="10" ry="4" fill="${m.skinHi}" opacity="0.3"/>
      <ellipse cx="44" cy="69" rx="2.8" ry="3.5" fill="#0a0405" opacity="0.9"/>
      <ellipse cx="56" cy="69" rx="2.8" ry="3.5" fill="#0a0405" opacity="0.9"/>
      <ellipse cx="43.5" cy="68" rx="1" ry="1.5" fill="${m.skinHi}" opacity="0.7"/>
      <ellipse cx="55.5" cy="68" rx="1" ry="1.5" fill="${m.skinHi}" opacity="0.7"/>
      <path d="M43 79 Q50 83 57 79" stroke="#0a0405" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="50" cy="75" rx="4.5" ry="2.8" fill="none" stroke="${m.cloth1}" stroke-width="2"/>
      <ellipse cx="36" cy="44" rx="7.5" ry="6.5" fill="#fff8e9"/>
      <ellipse cx="64" cy="44" rx="7.5" ry="6.5" fill="#fff8e9"/>
      <circle cx="36.5" cy="44.5" r="3.8" fill="url(#${id}eye)"/>
      <circle cx="64.5" cy="44.5" r="3.8" fill="url(#${id}eye)"/>
      <ellipse cx="37" cy="45" rx="1.8" ry="2.6" fill="#060408"/>
      <ellipse cx="65" cy="45" rx="1.8" ry="2.6" fill="#060408"/>
      <circle cx="34.5" cy="42.5" r="1.2" fill="white" opacity="0.95"/>
      <circle cx="62.5" cy="42.5" r="1.2" fill="white" opacity="0.95"/>
      <path d="M26 36 Q36 30 46 36" stroke="${m.furLo}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M54 36 Q64 30 74 36" stroke="${m.furLo}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      ${m.accessory==='glow'?`<circle cx="36.5" cy="44.5" r="6" fill="${m.eye}" opacity="0.3" filter="url(#${id}sg)"/><circle cx="64.5" cy="44.5" r="6" fill="${m.eye}" opacity="0.3" filter="url(#${id}sg)"/>`:''}
      ${m.accessory==='spectacles'?`<circle cx="36" cy="44" r="8.5" fill="none" stroke="${m.cloth1}" stroke-width="1.6"/><circle cx="64" cy="44" r="8.5" fill="none" stroke="${m.cloth1}" stroke-width="1.6"/><line x1="44.5" y1="44" x2="55.5" y2="44" stroke="${m.cloth1}" stroke-width="1.6"/>`:''}</svg>`;
  }

  // CARD — full body
  const spectacles = m.accessory==='spectacles'?`
    <circle cx="74" cy="84" r="15" fill="${m.cloth1}" opacity="0.1"/>
    <circle cx="74" cy="84" r="15" fill="none" stroke="${m.cloth1}" stroke-width="2.4"/>
    <circle cx="126" cy="84" r="15" fill="${m.cloth1}" opacity="0.1"/>
    <circle cx="126" cy="84" r="15" fill="none" stroke="${m.cloth1}" stroke-width="2.4"/>
    <line x1="89" y1="84" x2="111" y2="84" stroke="${m.cloth1}" stroke-width="2.4"/>
    <line x1="59" y1="83" x2="52" y2="82" stroke="${m.cloth1}" stroke-width="1.8"/>
    <line x1="141" y1="83" x2="148" y2="82" stroke="${m.cloth1}" stroke-width="1.8"/>`:'' ;

  const tie = m.accessory==='tie'?`
    <path d="M93 108 L107 108 L112 148 L100 178 L88 148Z" fill="${m.fur}" stroke="${m.furLo}" stroke-width="0.8"/>
    <path d="M93 108 L100 124 L107 108" stroke="${m.furLo}" stroke-width="1" fill="none"/>
    <path d="M82 102 L100 118 L118 102 L114 95 L100 108 L86 95Z" fill="#e8e8e8" opacity="0.9"/>`:'' ;

  const satchel = m.accessory==='satchel'?`
    <path d="M62 114 Q50 160 60 185" stroke="${m.cloth2}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="36" y="174" width="36" height="32" rx="5" fill="${m.cloth1}"/>
    <rect x="40" y="178" width="28" height="24" rx="3" fill="${m.cloth2}"/>
    <rect x="40" y="180" width="28" height="7" fill="${m.cloth1}" opacity="0.6"/>
    <rect x="51" y="176" width="8" height="5" rx="2" fill="${m.horn}"/>
    <rect x="68" y="168" width="5" height="16" rx="2" fill="#f0e2c4" transform="rotate(20,70,176)"/>
    <rect x="62" y="170" width="4" height="12" rx="1.5" fill="#c8e0f0" transform="rotate(-10,64,176)"/>`:'' ;

  const glow = m.accessory==='glow'?`
    <path d="M38 110 Q100 90 162 110 L158 210 Q100 228 42 210Z" fill="${m.cloth2}" opacity="0.96"/>
    <path d="M40 68 Q100 32 160 68 Q155 115 140 128 L60 128 Q45 115 40 68Z" fill="${m.cloth2}" opacity="0.9"/>
    <path d="M54 138 L68 138 L68 154 L86 154" stroke="${m.eye}" stroke-width="1.2" fill="none" opacity="0.8"/>
    <path d="M146 138 L132 138 L132 154 L114 154" stroke="${m.eye}" stroke-width="1.2" fill="none" opacity="0.8"/>
    <path d="M72 172 L94 172 L94 192" stroke="${m.eye}" stroke-width="1.2" fill="none" opacity="0.7"/>
    <path d="M128 172 L106 172 L106 192" stroke="${m.eye}" stroke-width="1.2" fill="none" opacity="0.7"/>
    <circle cx="68" cy="154" r="2.5" fill="${m.eye}" opacity="0.9" filter="url(#${id}glow)"/>
    <circle cx="132" cy="154" r="2.5" fill="${m.eye}" opacity="0.9" filter="url(#${id}glow)"/>
    <circle cx="94" cy="192" r="2.5" fill="${m.eye}" opacity="0.9" filter="url(#${id}glow)"/>
    <circle cx="106" cy="192" r="2.5" fill="${m.eye}" opacity="0.9" filter="url(#${id}glow)"/>`:'' ;

  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${animCSS}${defs}
  <ellipse cx="100" cy="262" rx="52" ry="7" fill="${m.furLo}" opacity="0.38"/>
  <g class="${id}-sway">
    <g class="${id}-body">
      <path d="M78 192 Q74 226 78 250 L94 250 Q94 224 92 196Z" fill="url(#${id}cloth)"/>
      <path d="M122 192 Q126 226 122 250 L106 250 Q106 224 108 196Z" fill="url(#${id}cloth)"/>
      <ellipse cx="86" cy="254" rx="12" ry="6" fill="${m.hornDark}"/>
      <ellipse cx="114" cy="254" rx="12" ry="6" fill="${m.hornDark}"/>
      <path d="M78 250 Q86 257 94 250" stroke="${m.hornDark}" stroke-width="2" fill="none"/>
      <path d="M106 250 Q114 257 122 250" stroke="${m.hornDark}" stroke-width="2" fill="none"/>
      <path d="M56 112 Q100 96 144 112 L152 204 Q100 218 48 204Z" fill="url(#${id}cloth)" filter="url(#${id}ds)"/>
      <path d="M86 112 Q100 128 114 112 Q110 130 100 136 Q90 130 86 112Z" fill="url(#${id}fur)"/>
      <path d="M60 118 Q68 136 66 188" stroke="${m.cloth1}" stroke-width="2" fill="none" opacity="0.3"/>
      <rect x="50" y="175" width="100" height="11" rx="3" fill="${m.cloth2}" opacity="0.8"/>
      <circle cx="100" cy="180" r="5" fill="${m.cloth1}" stroke="${m.horn}" stroke-width="1"/>
      <path d="M48 118 Q30 144 34 182 Q40 192 54 186 Q60 150 66 126Z" fill="url(#${id}fur)"/>
      <path d="M152 118 Q170 144 166 182 Q160 192 146 186 Q140 150 134 126Z" fill="url(#${id}fur)"/>
      <ellipse cx="42" cy="192" rx="11" ry="9" fill="${m.fur}"/>
      <ellipse cx="158" cy="192" rx="11" ry="9" fill="${m.fur}"/>
      <path d="M35 195 Q42 201 49 195" stroke="${m.furLo}" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M151 195 Q158 201 165 195" stroke="${m.furLo}" stroke-width="1" fill="none" opacity="0.5"/>
      ${glow}${satchel}${tie}
    </g>
    <!-- horns outside breathing group -->
    <path d="M54 54 C32 38 20 14 26 -2 Q38 14 56 36 Q60 46 58 56Z" fill="url(#${id}horn)" stroke="${m.hornDark}" stroke-width="1"/>
    <path d="M146 54 C168 38 180 14 174 -2 Q162 14 144 36 Q140 46 142 56Z" fill="url(#${id}horn)" stroke="${m.hornDark}" stroke-width="1"/>
    <path d="M28 2 Q40 22 54 44" stroke="${m.horn}" stroke-width="1.5" fill="none" opacity="0.8"/>
    <path d="M172 2 Q160 22 146 44" stroke="${m.horn}" stroke-width="1.5" fill="none" opacity="0.8"/>
    <!-- ears -->
    <path d="M46 86 Q22 80 28 106 Q40 100 56 94Z" fill="url(#${id}fur)"/>
    <path d="M154 86 Q178 80 172 106 Q160 100 144 94Z" fill="url(#${id}fur)"/>
    <ellipse cx="38" cy="96" rx="5" ry="7" fill="${m.skin}" opacity="0.85"/>
    <ellipse cx="162" cy="96" rx="5" ry="7" fill="${m.skin}" opacity="0.85"/>
    <!-- head -->
    <path d="M100 30 C142 30 162 56 162 88 C162 114 154 132 138 142 L128 148 Q114 155 100 155 Q86 155 72 148 L62 142 C46 132 38 114 38 88 C38 56 58 30 100 30Z" fill="url(#${id}fur)" filter="url(#${id}ds)"/>
    <ellipse cx="100" cy="56" rx="34" ry="16" fill="${m.furHi}" opacity="0.48"/>
    <path d="M82 38 Q100 22 118 38 Q114 50 100 52 Q86 50 82 38Z" fill="${m.furLo}" opacity="0.65"/>
    <ellipse cx="66" cy="108" rx="16" ry="12" fill="${m.furLo}" opacity="0.28"/>
    <ellipse cx="134" cy="108" rx="16" ry="12" fill="${m.furLo}" opacity="0.28"/>
    <!-- snout -->
    <path d="M68 108 Q100 102 132 108 Q140 136 124 148 Q112 155 100 155 Q88 155 76 148 Q60 136 68 108Z" fill="url(#${id}skin)"/>
    <path d="M76 112 Q100 108 124 112" stroke="${m.skinHi}" stroke-width="2" fill="none" opacity="0.45"/>
    <ellipse cx="87" cy="132" rx="5" ry="6.5" fill="#0a0405" opacity="0.9"/>
    <ellipse cx="113" cy="132" rx="5" ry="6.5" fill="#0a0405" opacity="0.9"/>
    <ellipse cx="86" cy="130" rx="1.5" ry="2" fill="${m.skinHi}" opacity="0.7"/>
    <ellipse cx="112" cy="130" rx="1.5" ry="2" fill="${m.skinHi}" opacity="0.7"/>
    <path d="M84 148 Q100 153 116 148" stroke="#0a0405" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M86 150 L83 160 L89 157Z" fill="#fffbe9"/>
    <path d="M114 150 L117 160 L111 157Z" fill="#fffbe9"/>
    <ellipse cx="100" cy="142" rx="9" ry="5" fill="none" stroke="${m.cloth1}" stroke-width="2.8"/>
    <!-- eyes -->
    <ellipse cx="73" cy="84" rx="13" ry="11" fill="#fff8e9"/>
    <ellipse cx="127" cy="84" rx="13" ry="11" fill="#fff8e9"/>
    <circle cx="74" cy="85" r="7.5" fill="url(#${id}eye)"/>
    <circle cx="128" cy="85" r="7.5" fill="url(#${id}eye)"/>
    <ellipse cx="74.5" cy="86" rx="3" ry="5" fill="#060408"/>
    <ellipse cx="128.5" cy="86" rx="3" ry="5" fill="#060408"/>
    <circle cx="71" cy="81" r="2.5" fill="white" opacity="0.95"/>
    <circle cx="125" cy="81" r="2.5" fill="white" opacity="0.95"/>
    <circle cx="73" cy="85" r="1" fill="white" opacity="0.5"/>
    <circle cx="127" cy="85" r="1" fill="white" opacity="0.5"/>
    <path d="M61 80 Q73 75 85 80" stroke="${m.furLo}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M115 80 Q127 75 139 80" stroke="${m.furLo}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
    <!-- brows -->
    <path d="M56 70 Q72 62 88 72" stroke="${m.furLo}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M112 72 Q128 62 144 70" stroke="${m.furLo}" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${spectacles}
    ${m.accessory==='glow'?`<circle cx="74" cy="85" r="10" fill="${m.eye}" opacity="0.25" filter="url(#${id}sg)"/><circle cx="128" cy="85" r="10" fill="${m.eye}" opacity="0.25" filter="url(#${id}sg)"/>`:''}
  </g>
</svg>`;
}

window.minotaurSVG = (key, mode='token') => buildSVG(key, mode);

window.minotaurTokens = {};
window.preloadMinotaurTokens = function() {
  return Promise.all(window.MODEL_KEYS.map(k =>
    new Promise(resolve => {
      const svg = buildSVG(k, 'token');
      const blob = new Blob([svg], {type:'image/svg+xml'});
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { window.minotaurTokens[k] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = url;
    })
  ));
};
