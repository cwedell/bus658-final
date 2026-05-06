// minotaurs.js — Disney-style illustrated minotaur characters
// 4 models: claude-sonnet-4-6, gpt-5.2, gemini-3-pro-preview, deepseek-v3

window.MODEL_KEYS = ['claude-sonnet-4-6', 'gpt-5.2', 'gemini-3-pro-preview', 'deepseek-v3'];

window.MINOTAURS = {
  'claude-sonnet-4-6': {
    label: 'Claude', archetype: 'The Philosopher',
    blurb: 'Thoughtful · Careful · Deliberate',
    fur: '#8b5cf6', furHi: '#c4b5fd', furLo: '#4c1d95',
    skin: '#5b21b6', skinHi: '#8b5cf6', muzzle: '#6d28d9',
    horn: '#fef3c7', hornDk: '#92400e', nosering: '#f59e0b',
    cloth1: '#f59e0b', cloth2: '#92400e', eye: '#fbbf24',
    trail: '#8b5cf6', accessory: 'spectacles',
  },
  'gpt-5.2': {
    label: 'GPT-5.2', archetype: 'The Exec',
    blurb: 'Confident · Direct · Polished',
    fur: '#10b981', furHi: '#6ee7b7', furLo: '#064e3b',
    skin: '#047857', skinHi: '#10b981', muzzle: '#065f46',
    horn: '#fef3c7', hornDk: '#92400e', nosering: '#e5e7eb',
    cloth1: '#1f2937', cloth2: '#111827', eye: '#d1fae5',
    trail: '#10b981', accessory: 'tie',
  },
  'gemini-3-pro-preview': {
    label: 'Gemini', archetype: 'The Polymath',
    blurb: 'Curious · Excitable · Resourceful',
    fur: '#3b82f6', furHi: '#93c5fd', furLo: '#1e3a8a',
    skin: '#1d4ed8', skinHi: '#3b82f6', muzzle: '#1e40af',
    horn: '#fef3c7', hornDk: '#92400e', nosering: '#f59e0b',
    cloth1: '#ef4444', cloth2: '#7f1d1d', eye: '#bfdbfe',
    trail: '#3b82f6', accessory: 'satchel',
  },
  'deepseek-v3': {
    label: 'DeepSeek', archetype: 'The Shadow',
    blurb: 'Mysterious · Efficient · Silent',
    fur: '#334155', furHi: '#64748b', furLo: '#0f172a',
    skin: '#1e293b', skinHi: '#334155', muzzle: '#0f172a',
    horn: '#0f172a', hornDk: '#000', nosering: '#38bdf8',
    cloth1: '#0f172a', cloth2: '#000', eye: '#38bdf8',
    trail: '#1e3a5f', accessory: 'glow',
  },
};

// ─── Disney-style SVG builder ────────────────────────────────────────────────
// Each minotaur has: expressive large eyes, rounded stylised head,
// wide flat muzzle, curved horns, clear outfit silhouette,
// smooth CSS animations (breathing, tail-sway, eye-blink)

function buildSVG(key, mode) {
  const m = window.MINOTAURS[key];
  if (!m) return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>';
  const id = 'mn' + key.replace(/[^a-z0-9]/g, '') + mode;
  const compact = mode === 'token';

  if (compact) return buildToken(m, id);
  return buildCard(m, id, key);
}

function buildToken(m, id) {
  // Token: clean head-only view optimised for 32-56px canvas rendering
  return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${id}h" cx="40%" cy="30%" r="70%">
      <stop offset="0%" stop-color="${m.furHi}"/>
      <stop offset="60%" stop-color="${m.fur}"/>
      <stop offset="100%" stop-color="${m.furLo}"/>
    </radialGradient>
    <radialGradient id="${id}s" cx="45%" cy="35%" r="65%">
      <stop offset="0%" stop-color="${m.skinHi}"/>
      <stop offset="100%" stop-color="${m.muzzle}"/>
    </radialGradient>
  </defs>
  <!-- horns -->
  <path d="M18 22 C6 12 2 -2 8 -8 C18 6 24 18 26 26Z" fill="${m.horn}" stroke="${m.hornDk}" stroke-width="0.5"/>
  <path d="M62 22 C74 12 78 -2 72 -8 C62 6 56 18 54 26Z" fill="${m.horn}" stroke="${m.hornDk}" stroke-width="0.5"/>
  <!-- ears -->
  <path d="M12 36 C0 32 2 50 12 48 L18 42Z" fill="${m.fur}"/>
  <path d="M68 36 C80 32 78 50 68 48 L62 42Z" fill="${m.fur}"/>
  <ellipse cx="10" cy="43" rx="3" ry="4" fill="${m.skinHi}" opacity="0.7"/>
  <ellipse cx="70" cy="43" rx="3" ry="4" fill="${m.skinHi}" opacity="0.7"/>
  <!-- head -->
  <ellipse cx="40" cy="38" rx="28" ry="26" fill="url(#${id}h)"/>
  <!-- brow ridge -->
  <ellipse cx="40" cy="26" rx="18" ry="7" fill="${m.furHi}" opacity="0.45"/>
  <!-- muzzle -->
  <path d="M26 44 Q40 40 54 44 Q56 58 46 64 Q40 67 34 64 Q24 58 26 44Z" fill="url(#${id}s)"/>
  <ellipse cx="40" cy="49" rx="8" ry="3" fill="${m.furHi}" opacity="0.25"/>
  <!-- nostrils -->
  <ellipse cx="35" cy="54" rx="3" ry="3.5" fill="${m.furLo}" opacity="0.85"/>
  <ellipse cx="45" cy="54" rx="3" ry="3.5" fill="${m.furLo}" opacity="0.85"/>
  <ellipse cx="34.5" cy="53" rx="1" ry="1.5" fill="${m.skinHi}" opacity="0.6"/>
  <ellipse cx="44.5" cy="53" rx="1" ry="1.5" fill="${m.skinHi}" opacity="0.6"/>
  <!-- nose ring -->
  <ellipse cx="40" cy="59" rx="4.5" ry="2.5" fill="none" stroke="${m.nosering}" stroke-width="1.8"/>
  <!-- eyes — large Disney style -->
  <ellipse cx="28" cy="34" rx="9" ry="8" fill="white"/>
  <ellipse cx="52" cy="34" rx="9" ry="8" fill="white"/>
  <circle cx="29" cy="35" r="5.5" fill="${m.eye}"/>
  <circle cx="53" cy="35" r="5.5" fill="${m.eye}"/>
  <circle cx="30" cy="36" r="3" fill="${m.furLo}"/>
  <circle cx="54" cy="36" r="3" fill="${m.furLo}"/>
  <circle cx="27.5" cy="33" r="1.8" fill="white" opacity="0.95"/>
  <circle cx="51.5" cy="33" r="1.8" fill="white" opacity="0.95"/>
  <circle cx="29" cy="35.5" r="0.7" fill="white" opacity="0.5"/>
  <circle cx="53" cy="35.5" r="0.7" fill="white" opacity="0.5"/>
  <!-- brows -->
  <path d="M19 26 Q28 21 37 26" stroke="${m.furLo}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M43 26 Q52 21 61 26" stroke="${m.furLo}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  ${m.accessory === 'spectacles' ? `
    <circle cx="28" cy="34" r="9.5" fill="none" stroke="${m.cloth1}" stroke-width="1.4" opacity="0.9"/>
    <circle cx="52" cy="34" r="9.5" fill="none" stroke="${m.cloth1}" stroke-width="1.4" opacity="0.9"/>
    <line x1="37.5" y1="34" x2="42.5" y2="34" stroke="${m.cloth1}" stroke-width="1.4"/>` : ''}
  ${m.accessory === 'glow' ? `
    <circle cx="29" cy="35" r="8" fill="${m.eye}" opacity="0.2" style="filter:blur(3px)"/>
    <circle cx="53" cy="35" r="8" fill="${m.eye}" opacity="0.2" style="filter:blur(3px)"/>` : ''}
</svg>`;
}

function buildCard(m, id, key) {
  const animId = id + 'A';
  const css = `<style>
    @keyframes ${animId}breath {
      0%,100%{transform:translateY(0)} 40%{transform:translateY(-3px)} 60%{transform:translateY(-2px)}
    }
    @keyframes ${animId}blink {
      0%,88%,100%{transform:scaleY(1)} 92%{transform:scaleY(0.06)} 96%{transform:scaleY(1)}
    }
    @keyframes ${animId}tail {
      0%,100%{transform:rotate(-12deg)} 50%{transform:rotate(14deg)}
    }
    @keyframes ${animId}ear {
      0%,100%{transform:rotate(0deg)} 30%{transform:rotate(-6deg)} 60%{transform:rotate(4deg)}
    }
    .${animId}body { animation: ${animId}breath 2.8s ease-in-out infinite; transform-origin: 100px 260px; }
    .${animId}blink { animation: ${animId}blink 4.5s ease-in-out infinite; transform-origin: 74px 84px; }
    .${animId}blink2 { animation: ${animId}blink 4.5s ease-in-out infinite 0.06s; transform-origin: 126px 84px; }
    .${animId}tail { animation: ${animId}tail 1.8s ease-in-out infinite; transform-origin: 148px 178px; }
    .${animId}earL { animation: ${animId}ear 3.2s ease-in-out infinite; transform-origin: 42px 90px; }
    .${animId}earR { animation: ${animId}ear 3.2s ease-in-out infinite 0.4s; transform-origin: 158px 90px; }
  </style>`;

  const defs = `<defs>
    <radialGradient id="${id}fur" cx="38%" cy="28%" r="72%">
      <stop offset="0%" stop-color="${m.furHi}"/>
      <stop offset="50%" stop-color="${m.fur}"/>
      <stop offset="100%" stop-color="${m.furLo}"/>
    </radialGradient>
    <radialGradient id="${id}muz" cx="45%" cy="35%" r="68%">
      <stop offset="0%" stop-color="${m.skinHi}"/>
      <stop offset="100%" stop-color="${m.muzzle}"/>
    </radialGradient>
    <radialGradient id="${id}eye" cx="32%" cy="28%" r="65%">
      <stop offset="0%" stop-color="${m.eye}"/>
      <stop offset="65%" stop-color="${m.fur}"/>
      <stop offset="100%" stop-color="${m.furLo}"/>
    </radialGradient>
    <linearGradient id="${id}horn" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0%" stop-color="${m.horn}"/>
      <stop offset="100%" stop-color="${m.hornDk}"/>
    </linearGradient>
    <linearGradient id="${id}cloth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${m.cloth1}"/>
      <stop offset="100%" stop-color="${m.cloth2}"/>
    </linearGradient>
    <filter id="${id}glow">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="${id}ds">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${m.furLo}" flood-opacity="0.4"/>
    </filter>
  </defs>`;

  // Accessory: spectacles
  const specs = m.accessory === 'spectacles' ? `
    <g opacity="0.92">
      <circle cx="74" cy="84" r="16" fill="${m.cloth1}" fill-opacity="0.1" stroke="${m.cloth1}" stroke-width="2.2"/>
      <circle cx="126" cy="84" r="16" fill="${m.cloth1}" fill-opacity="0.1" stroke="${m.cloth1}" stroke-width="2.2"/>
      <path d="M90 84 L110 84" stroke="${m.cloth1}" stroke-width="2.2"/>
      <path d="M58 82 L52 80" stroke="${m.cloth1}" stroke-width="1.8"/>
      <path d="M142 82 L148 80" stroke="${m.cloth1}" stroke-width="1.8"/>
    </g>` : '';

  // Accessory: exec tie + collar
  const tie = m.accessory === 'tie' ? `
    <path d="M88 108 L100 122 L112 108 L108 98 L92 98Z" fill="#e5e7eb"/>
    <path d="M93 108 L100 170 L107 108 L104 122 L100 130 L96 122Z" fill="${m.fur}"/>
    <path d="M96 108 L100 115 L104 108" stroke="${m.furLo}" stroke-width="1" fill="none"/>` : '';

  // Accessory: satchel
  const satchel = m.accessory === 'satchel' ? `
    <path d="M62 118 Q45 165 55 195" stroke="${m.cloth2}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="32" y="183" width="38" height="34" rx="6" fill="${m.cloth1}"/>
    <rect x="36" y="187" width="30" height="26" rx="4" fill="${m.cloth2}"/>
    <rect x="52" y="183" width="8" height="5" rx="2" fill="${m.horn}"/>
    <path d="M36 194 L66 194" stroke="${m.furHi}" stroke-width="0.8" opacity="0.4"/>
    <rect x="67" y="176" width="5" height="18" rx="2" fill="#fef3c7" transform="rotate(18,69,185)"/>
    <rect x="60" y="178" width="4" height="14" rx="2" fill="#bfdbfe" transform="rotate(-8,62,185)"/>` : '';

  // Accessory: deepseek glow cloak
  const glow = m.accessory === 'glow' ? `
    <path d="M40 115 Q100 94 160 115 L156 215 Q100 232 44 215Z" fill="${m.cloth2}" opacity="0.95"/>
    <path d="M42 72 Q100 36 158 72 Q152 120 138 132 L62 132 Q48 120 42 72Z" fill="${m.cloth2}" opacity="0.9"/>
    <path d="M56 145 L70 145 L70 162 L88 162" stroke="${m.eye}" stroke-width="1.4" fill="none" opacity="0.85"/>
    <path d="M144 145 L130 145 L130 162 L112 162" stroke="${m.eye}" stroke-width="1.4" fill="none" opacity="0.85"/>
    <path d="M74 180 L94 180 L94 198" stroke="${m.eye}" stroke-width="1.4" fill="none" opacity="0.75"/>
    <path d="M126 180 L106 180 L106 198" stroke="${m.eye}" stroke-width="1.4" fill="none" opacity="0.75"/>
    <circle cx="70" cy="162" r="3" fill="${m.eye}" filter="url(#${id}glow)" opacity="0.95"/>
    <circle cx="130" cy="162" r="3" fill="${m.eye}" filter="url(#${id}glow)" opacity="0.95"/>
    <circle cx="94" cy="198" r="3" fill="${m.eye}" filter="url(#${id}glow)" opacity="0.95"/>
    <circle cx="106" cy="198" r="3" fill="${m.eye}" filter="url(#${id}glow)" opacity="0.95"/>` : '';

  return `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
${css}${defs}

<!-- ground shadow -->
<ellipse cx="100" cy="272" rx="52" ry="7" fill="${m.furLo}" opacity="0.35"/>

<g class="${animId}body">

<!-- TAIL -->
<path class="${animId}tail" d="M148 178 C158 168 168 172 162 184 C158 192 150 186 148 178Z" fill="${m.fur}" opacity="0.7"/>

<!-- LEGS -->
<path d="M80 195 Q76 232 80 256 L96 256 L96 200Z" fill="url(#${id}cloth)"/>
<path d="M120 195 Q124 232 120 256 L104 256 L104 200Z" fill="url(#${id}cloth)"/>
<!-- hooves -->
<path d="M74 252 Q84 262 96 256 L96 262 Q84 268 74 258Z" fill="${m.hornDk}"/>
<path d="M126 252 Q116 262 104 256 L104 262 Q116 268 126 258Z" fill="${m.hornDk}"/>

<!-- BODY -->
<path d="M58 115 Q100 98 142 115 L150 208 Q100 224 50 208Z" fill="url(#${id}cloth)" filter="url(#${id}ds)"/>
<!-- chest fur patch -->
<path d="M84 114 Q100 132 116 114 Q112 138 100 144 Q88 138 84 114Z" fill="url(#${id}fur)" opacity="0.8"/>

${glow}${satchel}${tie}

<!-- ARMS -->
<path d="M50 122 Q32 148 36 190 Q44 200 58 192 Q64 156 70 130Z" fill="url(#${id}fur)"/>
<path d="M150 122 Q168 148 164 190 Q156 200 142 192 Q136 156 130 130Z" fill="url(#${id}fur)"/>
<!-- hands — rounded Disney style -->
<path d="M32 188 Q30 202 40 206 Q52 208 56 196 Q58 188 50 183Z" fill="${m.fur}"/>
<path d="M168 188 Q170 202 160 206 Q148 208 144 196 Q142 188 150 183Z" fill="${m.fur}"/>
<!-- finger bumps -->
<circle cx="35" cy="202" r="4" fill="${m.fur}"/>
<circle cx="42" cy="205" r="4" fill="${m.fur}"/>
<circle cx="50" cy="204" r="4" fill="${m.fur}"/>
<circle cx="165" cy="202" r="4" fill="${m.fur}"/>
<circle cx="158" cy="205" r="4" fill="${m.fur}"/>
<circle cx="150" cy="204" r="4" fill="${m.fur}"/>

</g><!-- end body breath -->

<!-- HORNS — outside animation so they don't bob -->
<path d="M56 52 C34 36 22 10 30 -6 Q44 12 58 38 Q62 48 60 56Z" fill="url(#${id}horn)" stroke="${m.hornDk}" stroke-width="1"/>
<path d="M144 52 C166 36 178 10 170 -6 Q156 12 142 38 Q138 48 140 56Z" fill="url(#${id}horn)" stroke="${m.hornDk}" stroke-width="1"/>
<path d="M32 -4 Q44 16 56 44" stroke="${m.horn}" stroke-width="1.6" fill="none" opacity="0.75"/>
<path d="M168 -4 Q156 16 144 44" stroke="${m.horn}" stroke-width="1.6" fill="none" opacity="0.75"/>

<!-- EARS — with twitch animation -->
<g class="${animId}earL">
  <path d="M44 88 C22 80 20 110 34 108 L48 96Z" fill="${m.fur}" stroke="${m.furLo}" stroke-width="0.8"/>
  <path d="M34 98 Q28 104 32 108 Q38 104 42 98Z" fill="${m.skinHi}" opacity="0.75"/>
</g>
<g class="${animId}earR">
  <path d="M156 88 C178 80 180 110 166 108 L152 96Z" fill="${m.fur}" stroke="${m.furLo}" stroke-width="0.8"/>
  <path d="M166 98 Q172 104 168 108 Q162 104 158 98Z" fill="${m.skinHi}" opacity="0.75"/>
</g>

<!-- HEAD — large, rounded, Disney proportions -->
<path d="M100 26 C144 26 166 54 166 90 C166 118 156 138 138 148 L128 154 Q114 160 100 160 Q86 160 72 154 L62 148 C44 138 34 118 34 90 C34 54 56 26 100 26Z"
      fill="url(#${id}fur)" filter="url(#${id}ds)"/>
<!-- forehead shine -->
<ellipse cx="100" cy="52" rx="36" ry="16" fill="${m.furHi}" opacity="0.5"/>
<!-- forehead tuft -->
<path d="M80 38 C90 20 110 20 120 38 Q114 52 100 54 Q86 52 80 38Z" fill="${m.furLo}" opacity="0.65"/>
<!-- cheek roundness shading -->
<ellipse cx="62" cy="110" rx="18" ry="14" fill="${m.furLo}" opacity="0.22"/>
<ellipse cx="138" cy="110" rx="18" ry="14" fill="${m.furLo}" opacity="0.22"/>

<!-- MUZZLE — wide, rounded, Disney style -->
<path d="M64 106 Q100 98 136 106 Q144 134 128 148 Q114 158 100 158 Q86 158 72 148 Q56 134 64 106Z"
      fill="url(#${id}muz)"/>
<ellipse cx="100" cy="114" rx="24" ry="8" fill="${m.furHi}" opacity="0.28"/>
<!-- nostrils — big and expressive -->
<ellipse cx="88" cy="130" rx="6" ry="7" fill="${m.furLo}" opacity="0.9"/>
<ellipse cx="112" cy="130" rx="6" ry="7" fill="${m.furLo}" opacity="0.9"/>
<ellipse cx="87" cy="128" rx="2" ry="2.5" fill="${m.skinHi}" opacity="0.7"/>
<ellipse cx="111" cy="128" rx="2" ry="2.5" fill="${m.skinHi}" opacity="0.7"/>
<!-- happy mouth curve -->
<path d="M86 148 Q100 154 114 148" stroke="${m.furLo}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<!-- tiny teeth -->
<path d="M92 150 L94 155 L90 155Z" fill="white" opacity="0.7"/>
<path d="M108 150 L110 155 L106 155Z" fill="white" opacity="0.7"/>

<!-- NOSE RING -->
<path d="M89 142 Q100 148 111 142" fill="none" stroke="${m.nosering}" stroke-width="3.2" stroke-linecap="round"/>
<path d="M90 141 Q100 147 110 141" fill="none" stroke="${m.furHi}" stroke-width="0.8" opacity="0.4"/>

<!-- EYES — large expressive Disney eyes with thick lids -->
<!-- whites -->
<ellipse cx="74" cy="84" rx="15" ry="13" fill="white" stroke="${m.furLo}" stroke-width="0.8"/>
<ellipse cx="126" cy="84" rx="15" ry="13" fill="white" stroke="${m.furLo}" stroke-width="0.8"/>
<!-- iris -->
<circle cx="75" cy="85" r="9" fill="url(#${id}eye)"/>
<circle cx="127" cy="85" r="9" fill="url(#${id}eye)"/>
<!-- pupil — large round Disney -->
<circle cx="76" cy="86" r="5.5" fill="${m.furLo}"/>
<circle cx="128" cy="86" r="5.5" fill="${m.furLo}"/>
<!-- specular highlights — Disney signature -->
<circle cx="72" cy="81" r="3.2" fill="white" opacity="0.95"/>
<circle cx="124" cy="81" r="3.2" fill="white" opacity="0.95"/>
<circle cx="74" cy="86" r="1.3" fill="white" opacity="0.55"/>
<circle cx="126" cy="86" r="1.3" fill="white" opacity="0.55"/>
<!-- thick top eyelid -->
<path d="M59 78 Q74 70 89 78" stroke="${m.furLo}" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M111 78 Q126 70 141 78" stroke="${m.furLo}" stroke-width="4" fill="none" stroke-linecap="round"/>
<!-- eyelid shine -->
<path d="M62 76 Q74 70 86 76" stroke="${m.furHi}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.4"/>
<path d="M114 76 Q126 70 138 76" stroke="${m.furHi}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.4"/>
<!-- animated blink lids -->
<ellipse class="${animId}blink"  cx="74"  cy="84" rx="15" ry="0.1" fill="url(#${id}fur)"/>
<ellipse class="${animId}blink2" cx="126" cy="84" rx="15" ry="0.1" fill="url(#${id}fur)"/>

${specs}
${m.accessory === 'glow' ? `
  <circle cx="75" cy="85" r="12" fill="${m.eye}" opacity="0.22" filter="url(#${id}glow)"/>
  <circle cx="127" cy="85" r="12" fill="${m.eye}" opacity="0.22" filter="url(#${id}glow)"/>` : ''}

<!-- BROWS — thick expressive Disney brows -->
<path d="M56 68 Q74 58 92 70" stroke="${m.furLo}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
<path d="M108 70 Q126 58 144 68" stroke="${m.furLo}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
<!-- brow sheen -->
<path d="M58 67 Q74 59 90 69" stroke="${m.furHi}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.35"/>
<path d="M110 69 Q126 59 142 67" stroke="${m.furHi}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.35"/>

</svg>`;
}

window.minotaurSVG = (key, mode) => buildSVG(key, mode || 'token');

// Token image cache for canvas rendering
window.minotaurTokens = {};
window.preloadMinotaurTokens = function() {
  return Promise.all(window.MODEL_KEYS.map(k =>
    new Promise(resolve => {
      const svg = buildSVG(k, 'token');
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { window.minotaurTokens[k] = img; resolve(); };
      img.onerror = () => resolve();
      img.src = url;
    })
  ));
};
