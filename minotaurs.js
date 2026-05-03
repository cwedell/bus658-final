// Five game-style minotaur characters representing the LLMs.
// Detailed illustrated SVGs (full body, ~200x260 viewBox).
// Original art — no branded visual identity.

window.MINOTAURS = {
  'claude-sonnet-4-5': {
    label: 'Claude', archetype: 'The Philosopher',
    blurb: 'Thoughtful · Careful · Deliberate',
    fur: '#7c4dff', furHi: '#a070ff', furLo: '#4a1f99',
    skin: '#3a2266', skinHi: '#5a3a96',
    horn: '#f3e8c8', hornDark: '#9c8a5e',
    cloth1: '#d4a020', cloth2: '#8b5e10',
    eye: '#ffe87a',
    trail: '#7c4dff',
    accessory: 'spectacles',
  },
  'gpt-5.2': {
    label: 'GPT-5.2', archetype: 'The Exec',
    blurb: 'Confident · Direct · Polished',
    fur: '#10a37f', furHi: '#3ddca5', furLo: '#0a6e54',
    skin: '#0a4a3a', skinHi: '#1a7a60',
    horn: '#f3e8c8', hornDark: '#9c8a5e',
    cloth1: '#1a232c', cloth2: '#0a1218',
    eye: '#fff8d0',
    trail: '#10a37f',
    accessory: 'tie',
  },
  'gemini-3-pro-preview': {
    label: 'Gemini', archetype: 'The Polymath',
    blurb: 'Curious · Excitable · Resourceful',
    fur: '#4285f4', furHi: '#7eaffc', furLo: '#1d56b5',
    skin: '#0e2a5e', skinHi: '#1f4a96',
    horn: '#f3e8c8', hornDark: '#9c8a5e',
    cloth1: '#c84030', cloth2: '#883020',
    eye: '#fff8d0',
    trail: '#4285f4',
    accessory: 'satchel',
  },
  'deepseek-r1': {
    label: 'DeepSeek', archetype: 'The Shadow',
    blurb: 'Mysterious · Efficient · Silent',
    fur: '#243050', furHi: '#3e5a8a', furLo: '#0e1424',
    skin: '#0a0e18', skinHi: '#1a2440',
    horn: '#0a1424', hornDark: '#000',
    cloth1: '#0a0e18', cloth2: '#000',
    eye: '#3a90e8',
    trail: '#1e3a5f',
    accessory: 'glow',
  },
  'talkie': {
    label: 'Talkie', archetype: 'The Showman',
    blurb: 'Theatrical · Charming · Retrofuturist',
    fur: '#d4aa48', furHi: '#f0cc70', furLo: '#8b6914',
    skin: '#6a4a10', skinHi: '#a07820',
    horn: '#c89020', hornDark: '#704c10',
    cloth1: '#1a1410', cloth2: '#0a0805',
    eye: '#fff8d0',
    trail: '#8b6914',
    accessory: 'hat',
  },
};

// ── BUILDING BLOCKS ───────────────────────────────────────
// Reusable detailed minotaur body. Returns SVG markup.
function bodySVG(key, mode) {
  const m = window.MINOTAURS[key];
  const id = `mn-${key}-${mode}`;
  const compact = mode === 'token';
  // For token, show head and shoulders only (bigger head).
  const vb = compact ? '0 0 100 100' : '0 0 200 260';

  // Defs (shared)
  const defs = `<defs>
    <radialGradient id="${id}-fur" cx="0.42" cy="0.32" r="0.75">
      <stop offset="0" stop-color="${m.furHi}"/>
      <stop offset="0.55" stop-color="${m.fur}"/>
      <stop offset="1" stop-color="${m.furLo}"/>
    </radialGradient>
    <radialGradient id="${id}-skin" cx="0.5" cy="0.4" r="0.7">
      <stop offset="0" stop-color="${m.skinHi}"/>
      <stop offset="1" stop-color="${m.skin}"/>
    </radialGradient>
    <linearGradient id="${id}-horn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${m.horn}"/>
      <stop offset="1" stop-color="${m.hornDark}"/>
    </linearGradient>
    <linearGradient id="${id}-cloth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${m.cloth1}"/>
      <stop offset="1" stop-color="${m.cloth2}"/>
    </linearGradient>
    <filter id="${id}-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.2"/>
    </filter>
  </defs>`;

  // Token mode: just head + shoulders, centered
  if (compact) {
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
      ${defs}
      <!-- shadow -->
      <ellipse cx="50" cy="92" rx="30" ry="4" fill="#000" opacity="0.35"/>
      <!-- shoulders -->
      <path d="M18 86 Q50 76 82 86 L82 96 L18 96 Z"
            fill="url(#${id}-cloth)" stroke="#000" stroke-opacity="0.4" stroke-width="1.2"/>
      <!-- horns (back) -->
      <path d="M22 32 C8 22 4 6 8 -2 C18 8 28 22 34 30 Z"
            fill="url(#${id}-horn)" stroke="#000" stroke-opacity="0.5" stroke-width="1"/>
      <path d="M78 32 C92 22 96 6 92 -2 C82 8 72 22 66 30 Z"
            fill="url(#${id}-horn)" stroke="#000" stroke-opacity="0.5" stroke-width="1"/>
      <!-- horn highlights -->
      <path d="M12 4 Q16 14 22 26" stroke="${m.horn}" stroke-width="1.5" fill="none" opacity="0.9"/>
      <path d="M88 4 Q84 14 78 26" stroke="${m.horn}" stroke-width="1.5" fill="none" opacity="0.9"/>
      <!-- ears -->
      <path d="M16 50 Q4 50 8 64 Q14 60 20 56 Z" fill="${m.fur}" stroke="#000" stroke-opacity="0.4"/>
      <path d="M84 50 Q96 50 92 64 Q86 60 80 56 Z" fill="${m.fur}" stroke="#000" stroke-opacity="0.4"/>
      <ellipse cx="13" cy="56" rx="2" ry="3" fill="${m.skin}" opacity="0.7"/>
      <ellipse cx="87" cy="56" rx="2" ry="3" fill="${m.skin}" opacity="0.7"/>
      <!-- head shape -->
      <path d="M50 14 C70 14 82 28 82 46 C82 60 78 70 70 76
               L66 80 Q50 86 34 80 L30 76 C22 70 18 60 18 46 C18 28 30 14 50 14 Z"
            fill="url(#${id}-fur)" stroke="#000" stroke-opacity="0.5" stroke-width="1.2"/>
      <!-- forehead tuft -->
      <path d="M40 18 Q50 12 60 18 Q56 22 50 22 Q44 22 40 18 Z" fill="${m.furLo}" opacity="0.6"/>
      <!-- snout -->
      <path d="M34 56 Q50 54 66 56 Q70 70 60 76 Q50 80 40 76 Q30 70 34 56 Z"
            fill="url(#${id}-skin)" stroke="#000" stroke-opacity="0.45" stroke-width="1"/>
      <!-- nostrils -->
      <ellipse cx="44" cy="68" rx="2.2" ry="3" fill="#1a0a05" opacity="0.85"/>
      <ellipse cx="56" cy="68" rx="2.2" ry="3" fill="#1a0a05" opacity="0.85"/>
      <!-- mouth line -->
      <path d="M44 76 Q50 78 56 76" stroke="#1a0a05" stroke-width="1.3" fill="none" opacity="0.7"/>
      <!-- nose ring -->
      <ellipse cx="50" cy="73" rx="4" ry="2.5" fill="none" stroke="${m.cloth1}" stroke-width="1.6"/>
      <!-- eyes whites -->
      <ellipse cx="36" cy="44" rx="6" ry="5" fill="#fff8e9"/>
      <ellipse cx="64" cy="44" rx="6" ry="5" fill="#fff8e9"/>
      <!-- iris -->
      <circle cx="36.5" cy="45" r="3" fill="${m.eye}"/>
      <circle cx="64.5" cy="45" r="3" fill="${m.eye}"/>
      <!-- pupils -->
      <circle cx="37" cy="45.5" r="1.5" fill="#0a0805"/>
      <circle cx="65" cy="45.5" r="1.5" fill="#0a0805"/>
      <!-- eye shine -->
      <circle cx="35.5" cy="43.5" r="0.8" fill="#fff" opacity="0.9"/>
      <circle cx="63.5" cy="43.5" r="0.8" fill="#fff" opacity="0.9"/>
      <!-- brow -->
      <path d="M28 36 Q36 32 44 36" stroke="${m.furLo}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M56 36 Q64 32 72 36" stroke="${m.furLo}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      ${m.accessory === 'glow' ? `
        <circle cx="36.5" cy="45" r="4" fill="${m.eye}" opacity="0.4"/>
        <circle cx="64.5" cy="45" r="4" fill="${m.eye}" opacity="0.4"/>` : ''}
      ${m.accessory === 'spectacles' ? `
        <circle cx="36" cy="44" r="7" fill="none" stroke="${m.cloth1}" stroke-width="1.4"/>
        <circle cx="64" cy="44" r="7" fill="none" stroke="${m.cloth1}" stroke-width="1.4"/>
        <line x1="43" y1="44" x2="57" y2="44" stroke="${m.cloth1}" stroke-width="1.4"/>` : ''}
      ${m.accessory === 'hat' ? `
        <ellipse cx="50" cy="10" rx="32" ry="4" fill="#0a0805"/>
        <rect x="32" y="-8" width="36" height="14" rx="2" fill="#0a0805"/>
        <rect x="32" y="2" width="36" height="3" fill="${m.cloth1}" opacity="0.8"/>` : ''}
    </svg>`;
  }

  // Card mode — full body, much more illustrated
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">
    ${defs}
    <!-- ground shadow -->
    <ellipse cx="100" cy="252" rx="56" ry="6" fill="#000" opacity="0.45"/>

    <!-- LEGS -->
    <path d="M76 188 Q72 220 76 244 L92 244 Q92 218 90 192 Z"
          fill="url(#${id}-cloth)" stroke="#000" stroke-opacity="0.45" stroke-width="1.2"/>
    <path d="M124 188 Q128 220 124 244 L108 244 Q108 218 110 192 Z"
          fill="url(#${id}-cloth)" stroke="#000" stroke-opacity="0.45" stroke-width="1.2"/>
    <!-- HOOVES -->
    <ellipse cx="84" cy="248" rx="11" ry="5" fill="#0a0805"/>
    <ellipse cx="116" cy="248" rx="11" ry="5" fill="#0a0805"/>
    <path d="M76 244 Q84 250 92 244" stroke="${m.hornDark}" stroke-width="1.5" fill="none"/>
    <path d="M108 244 Q116 250 124 244" stroke="${m.hornDark}" stroke-width="1.5" fill="none"/>

    <!-- TORSO / OUTFIT -->
    <path d="M58 110 Q100 96 142 110 L150 200 Q100 212 50 200 Z"
          fill="url(#${id}-cloth)" stroke="#000" stroke-opacity="0.45" stroke-width="1.4"/>
    <!-- chest fur tuft -->
    <path d="M88 110 Q100 122 112 110 Q108 124 100 130 Q92 124 88 110 Z" fill="url(#${id}-fur)"/>
    <!-- belt / sash -->
    <rect x="52" y="170" width="96" height="10" fill="${m.cloth2}" opacity="0.7"/>
    <circle cx="100" cy="175" r="4" fill="${m.cloth1}" stroke="#000" stroke-opacity="0.4"/>
    <!-- highlights -->
    <path d="M62 116 Q70 130 68 180" stroke="${m.cloth1}" stroke-width="1.5" fill="none" opacity="0.4"/>

    <!-- ARMS -->
    <path d="M50 116 Q34 140 38 176 Q44 184 56 178 Q60 144 64 122 Z"
          fill="url(#${id}-fur)" stroke="#000" stroke-opacity="0.45" stroke-width="1.2"/>
    <path d="M150 116 Q166 140 162 176 Q156 184 144 178 Q140 144 136 122 Z"
          fill="url(#${id}-fur)" stroke="#000" stroke-opacity="0.45" stroke-width="1.2"/>
    <!-- hands -->
    <ellipse cx="46" cy="184" rx="9" ry="8" fill="${m.fur}" stroke="#000" stroke-opacity="0.45"/>
    <ellipse cx="154" cy="184" rx="9" ry="8" fill="${m.fur}" stroke="#000" stroke-opacity="0.45"/>
    <!-- finger details -->
    <path d="M40 188 L42 194 M46 190 L46 196 M52 188 L54 194" stroke="#000" stroke-opacity="0.4" stroke-width="0.8" fill="none"/>
    <path d="M148 188 L146 194 M154 190 L154 196 M160 188 L158 194" stroke="#000" stroke-opacity="0.4" stroke-width="0.8" fill="none"/>

    <!-- HORNS (back-most) -->
    <path d="M52 50 C32 36 22 14 28 -2 Q40 12 56 32 Q60 42 60 52 Z"
          fill="url(#${id}-horn)" stroke="#000" stroke-opacity="0.5" stroke-width="1.4"/>
    <path d="M148 50 C168 36 178 14 172 -2 Q160 12 144 32 Q140 42 140 52 Z"
          fill="url(#${id}-horn)" stroke="#000" stroke-opacity="0.5" stroke-width="1.4"/>
    <!-- horn ridges -->
    <path d="M30 4 Q40 22 54 42" stroke="${m.hornDark}" stroke-width="1" fill="none" opacity="0.6"/>
    <path d="M170 4 Q160 22 146 42" stroke="${m.hornDark}" stroke-width="1" fill="none" opacity="0.6"/>
    <path d="M34 8 Q42 24 52 38" stroke="${m.horn}" stroke-width="1" fill="none" opacity="0.95"/>
    <path d="M166 8 Q158 24 148 38" stroke="${m.horn}" stroke-width="1" fill="none" opacity="0.95"/>

    <!-- EARS -->
    <path d="M46 84 Q24 80 30 102 Q40 96 54 92 Z"
          fill="url(#${id}-fur)" stroke="#000" stroke-opacity="0.5"/>
    <path d="M154 84 Q176 80 170 102 Q160 96 146 92 Z"
          fill="url(#${id}-fur)" stroke="#000" stroke-opacity="0.5"/>
    <ellipse cx="40" cy="92" rx="4" ry="6" fill="${m.skin}" opacity="0.8"/>
    <ellipse cx="160" cy="92" rx="4" ry="6" fill="${m.skin}" opacity="0.8"/>

    <!-- HEAD -->
    <path d="M100 32 C138 32 158 56 158 86 C158 110 152 128 138 138
             L130 144 Q116 152 100 152 Q84 152 70 144 L62 138
             C48 128 42 110 42 86 C42 56 62 32 100 32 Z"
          fill="url(#${id}-fur)" stroke="#000" stroke-opacity="0.55" stroke-width="1.4"/>
    <!-- forehead dome highlight -->
    <ellipse cx="100" cy="58" rx="32" ry="14" fill="${m.furHi}" opacity="0.55"/>
    <!-- forehead tuft of fur -->
    <path d="M84 38 Q100 24 116 38 Q112 48 100 50 Q88 48 84 38 Z"
          fill="${m.furLo}" opacity="0.7"/>
    <!-- cheek shading -->
    <ellipse cx="68" cy="106" rx="14" ry="10" fill="${m.furLo}" opacity="0.35"/>
    <ellipse cx="132" cy="106" rx="14" ry="10" fill="${m.furLo}" opacity="0.35"/>

    <!-- SNOUT -->
    <path d="M70 108 Q100 104 130 108 Q138 132 124 142 Q112 150 100 150 Q88 150 76 142 Q62 132 70 108 Z"
          fill="url(#${id}-skin)" stroke="#000" stroke-opacity="0.5" stroke-width="1.2"/>
    <!-- snout center crease -->
    <path d="M100 108 Q100 130 100 144" stroke="#000" stroke-opacity="0.25" stroke-width="0.8" fill="none"/>
    <!-- nostrils -->
    <ellipse cx="88" cy="128" rx="4" ry="5" fill="#1a0a05" opacity="0.9"/>
    <ellipse cx="112" cy="128" rx="4" ry="5" fill="#1a0a05" opacity="0.9"/>
    <ellipse cx="87" cy="126" rx="1" ry="1.4" fill="${m.skinHi}" opacity="0.8"/>
    <ellipse cx="111" cy="126" rx="1" ry="1.4" fill="${m.skinHi}" opacity="0.8"/>
    <!-- mouth -->
    <path d="M86 144 Q100 148 114 144" stroke="#1a0a05" stroke-width="1.6" fill="none" opacity="0.85" stroke-linecap="round"/>
    <!-- teeth/tusks -->
    <path d="M88 144 L86 150 L90 148 Z" fill="#fffbe9"/>
    <path d="M112 144 L114 150 L110 148 Z" fill="#fffbe9"/>

    <!-- NOSE RING -->
    <ellipse cx="100" cy="138" rx="8" ry="4.5" fill="none" stroke="${m.cloth1}" stroke-width="2.4"/>
    <ellipse cx="100" cy="137" rx="8" ry="4.5" fill="none" stroke="${m.horn}" stroke-width="0.8" opacity="0.6"/>

    <!-- EYES -->
    <ellipse cx="74" cy="84" rx="11" ry="9" fill="#fff8e9" stroke="#000" stroke-opacity="0.4"/>
    <ellipse cx="126" cy="84" rx="11" ry="9" fill="#fff8e9" stroke="#000" stroke-opacity="0.4"/>
    <!-- iris -->
    <circle cx="75" cy="85" r="6" fill="${m.eye}"/>
    <circle cx="127" cy="85" r="6" fill="${m.eye}"/>
    <!-- pupil -->
    <ellipse cx="76" cy="86" rx="2.8" ry="3.4" fill="#0a0805"/>
    <ellipse cx="128" cy="86" rx="2.8" ry="3.4" fill="#0a0805"/>
    <!-- shine -->
    <circle cx="73" cy="82" r="1.8" fill="#fff" opacity="0.95"/>
    <circle cx="125" cy="82" r="1.8" fill="#fff" opacity="0.95"/>
    <!-- eyelid -->
    <path d="M64 80 Q74 76 84 80" stroke="${m.furLo}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M116 80 Q126 76 136 80" stroke="${m.furLo}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
    <!-- brow -->
    <path d="M58 70 Q72 64 86 72" stroke="${m.furLo}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M114 72 Q128 64 142 70" stroke="${m.furLo}" stroke-width="3.5" fill="none" stroke-linecap="round"/>

    ${m.accessory === 'spectacles' ? `
      <!-- round spectacles -->
      <circle cx="74" cy="84" r="14" fill="none" stroke="${m.cloth1}" stroke-width="2.2"/>
      <circle cx="126" cy="84" r="14" fill="none" stroke="${m.cloth1}" stroke-width="2.2"/>
      <line x1="88" y1="84" x2="112" y2="84" stroke="${m.cloth1}" stroke-width="2.2"/>
      <circle cx="74" cy="84" r="14" fill="${m.cloth1}" opacity="0.08"/>
      <circle cx="126" cy="84" r="14" fill="${m.cloth1}" opacity="0.08"/>` : ''}
    ${m.accessory === 'tie' ? `
      <!-- exec tie -->
      <path d="M94 110 L106 110 L110 130 L100 168 L90 130 Z" fill="${m.fur}" stroke="#000" stroke-opacity="0.5"/>
      <path d="M94 110 L100 122 L106 110" stroke="#000" stroke-opacity="0.4" fill="none"/>` : ''}
    ${m.accessory === 'satchel' ? `
      <!-- satchel strap + bag -->
      <path d="M64 116 Q100 152 138 142" stroke="${m.cloth1}" stroke-width="3" fill="none"/>
      <rect x="124" y="138" width="32" height="28" rx="3" fill="${m.cloth1}" stroke="#000" stroke-opacity="0.5"/>
      <rect x="128" y="142" width="24" height="6" fill="${m.cloth2}"/>
      <!-- rolled map sticking out -->
      <rect x="148" y="132" width="4" height="14" fill="#f0e2c4" transform="rotate(15 150 139)"/>` : ''}
    ${m.accessory === 'glow' ? `
      <!-- hood -->
      <path d="M40 60 Q100 16 160 60 Q156 100 142 116 L58 116 Q44 100 40 60 Z"
            fill="${m.cloth2}" opacity="0.92"/>
      <path d="M58 116 Q100 130 142 116 L150 200 Q100 212 50 200 Z"
            fill="${m.cloth2}" opacity="0.95"/>
      <!-- circuit glow lines -->
      <path d="M56 140 L66 140 L66 150 L80 150" stroke="${m.eye}" stroke-width="1" fill="none" opacity="0.8"/>
      <path d="M144 140 L134 140 L134 150 L120 150" stroke="${m.eye}" stroke-width="1" fill="none" opacity="0.8"/>
      <path d="M70 180 L90 180 L90 195" stroke="${m.eye}" stroke-width="1" fill="none" opacity="0.7"/>
      <path d="M130 180 L110 180 L110 195" stroke="${m.eye}" stroke-width="1" fill="none" opacity="0.7"/>
      <!-- eye glow -->
      <circle cx="75" cy="85" r="9" fill="${m.eye}" opacity="0.35"/>
      <circle cx="127" cy="85" r="9" fill="${m.eye}" opacity="0.35"/>` : ''}
    ${m.accessory === 'hat' ? `
      <!-- bowler hat -->
      <ellipse cx="100" cy="32" rx="56" ry="6" fill="#0a0805"/>
      <path d="M62 32 Q62 4 100 4 Q138 4 138 32 Z" fill="#0a0805"/>
      <rect x="62" y="22" width="76" height="6" fill="${m.cloth1}" opacity="0.7"/>
      <!-- moustache -->
      <path d="M76 132 Q88 138 100 132 Q112 138 124 132 Q116 142 100 140 Q84 142 76 132 Z"
            fill="${m.furLo}" opacity="0.85"/>
      <!-- bow tie -->
      <path d="M88 112 L82 102 L82 122 Z" fill="${m.cloth1}"/>
      <path d="M112 112 L118 102 L118 122 Z" fill="${m.cloth1}"/>
      <rect x="96" y="108" width="8" height="8" fill="${m.cloth1}"/>` : ''}
  </svg>`;
}

window.minotaurSVG = function(modelKey, mode = 'token') {
  return bodySVG(modelKey, mode);
};

// Token cache for canvas drawing
window.minotaurTokens = {};
window.preloadMinotaurTokens = function() {
  return Promise.all(Object.keys(window.MINOTAURS).map(k => {
    return new Promise(resolve => {
      const svg = window.minotaurSVG(k, 'token');
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { window.minotaurTokens[k] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = url;
    });
  }));
};

window.MODEL_KEYS = ['claude-sonnet-4-5', 'gpt-5.2', 'gemini-3-pro-preview', 'deepseek-r1', 'talkie'];
