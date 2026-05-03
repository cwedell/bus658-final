// Main app controller: wires UI, state, animation loop.
(function(){
  const state = {
    mazes: window.MAZE_SPECS.map(window.parseMaze),
    results: {},   // results[model][maze] = record
    activeMaze: '6x6-1',
    activeModel: 'claude-sonnet-4-5',
    raceMode: true,
    speed: 400,
    playing: false,
    step: 0,
    cellPx: 56,
  };

  const $ = id => document.getElementById(id);

  function setStatus(text, kind = '') {
    const el = $('status');
    el.textContent = text;
    el.className = 'status-pill ' + kind;
  }

  // populate dropdowns + character strip
  function buildUI() {
    const sm = $('sel-maze');
    sm.innerHTML = state.mazes.map(m => `<option value="${m.name}">${m.name}  ·  optimal ${m.shortest}</option>`).join('');
    sm.value = state.activeMaze;

    const sM = $('sel-model');
    sM.innerHTML = window.MODEL_KEYS.map(k =>
      `<option value="${k}">${window.MINOTAURS[k].label} — ${window.MINOTAURS[k].archetype}</option>`).join('');
    sM.value = state.activeModel;

    // character strip
    $('char-strip').innerHTML = window.MODEL_KEYS.map(k => {
      const m = window.MINOTAURS[k];
      return `<div class="char-card" style="border-top-color:${m.fur}">
        ${window.minotaurSVG(k, 'card')}
        <div class="char-name">${m.label}</div>
        <div class="char-arch">${m.archetype}</div>
        <div class="char-blurb">${m.blurb}</div>
      </div>`;
    }).join('');
  }

  function activeMaze() {
    return state.mazes.find(m => m.name === state.activeMaze);
  }
  function activeRecord() {
    return state.results[state.activeModel] && state.results[state.activeModel][state.activeMaze];
  }

  let baseCanvas = null;
  function ensureBase() {
    const maze = activeMaze();
    if (!baseCanvas) baseCanvas = document.createElement('canvas');
    window.MazeRenderer.renderBase(baseCanvas, maze, state.cellPx);
  }

  function drawFrame() {
    const maze = activeMaze();
    const cnv = $('maze-canvas');
    cnv.width = baseCanvas.width;
    cnv.height = baseCanvas.height;
    const ctx = cnv.getContext('2d');
    // base
    ctx.drawImage(baseCanvas, 0, 0);

    // ideal path under everything
    const ideal = window.shortestPath(maze);
    window.MazeRenderer.drawIdealPath(ctx, ideal, state.cellPx);

    if (state.raceMode) {
      // Show ALL models simultaneously, each with its trail and minotaur
      // Draw trails (under all tokens)
      for (const k of window.MODEL_KEYS) {
        const r = state.results[k] && state.results[k][state.activeMaze];
        if (!r || !r.trajectory) continue;
        const isActive = k === state.activeModel;
        window.MazeRenderer.drawTrail(
          ctx, r.trajectory, state.cellPx,
          window.MINOTAURS[k].trail, isActive ? 0.95 : 0.55, state.step
        );
      }
      // Draw all minotaur tokens at their current step (with small offset to avoid overlap)
      const positions = {};
      for (const k of window.MODEL_KEYS) {
        const r = state.results[k] && state.results[k][state.activeMaze];
        if (!r || !r.trajectory) continue;
        const i = Math.min(state.step, r.trajectory.length - 1);
        const pos = r.trajectory[i];
        if (pos) positions[k] = { pos, finished: state.step >= r.trajectory.length - 1 };
      }
      // assign sub-cell offsets when overlapping
      const cellGroups = {};
      Object.entries(positions).forEach(([k, p]) => {
        const key = p.pos.join(',');
        cellGroups[key] = cellGroups[key] || [];
        cellGroups[key].push(k);
      });
      Object.entries(positions).forEach(([k, p]) => {
        const grp = cellGroups[p.pos.join(',')];
        const idx = grp.indexOf(k);
        const n = grp.length;
        const isActive = k === state.activeModel;
        window.MazeRenderer.drawMinotaur(ctx, k, p.pos, state.cellPx, {
          subIndex: idx, subTotal: n, scale: isActive ? 1.0 : 0.78, finished: p.finished
        });
      });
      const activeRec = activeRecord();
      const activePos = activeRec ? activeRec.trajectory[Math.min(state.step, activeRec.trajectory.length - 1)] : maze.start;
      updateSmellNeedle(maze, activePos);
      updateMetrics(activeRec);
    } else {
      // single-model mode (legacy)
      const rec = activeRecord();
      if (rec && rec.trajectory) {
        window.MazeRenderer.drawTrail(
          ctx, rec.trajectory, state.cellPx,
          window.MINOTAURS[state.activeModel].trail, 0.95, state.step
        );
        const pos = rec.trajectory[Math.min(state.step, rec.trajectory.length - 1)];
        if (pos) window.MazeRenderer.drawMinotaur(ctx, state.activeModel, pos, state.cellPx);
        updateSmellNeedle(maze, pos);
        updateMetrics(rec);
      } else {
        window.MazeRenderer.drawMinotaur(ctx, state.activeModel, maze.start, state.cellPx);
        updateSmellNeedle(maze, maze.start);
        updateMetrics(null);
      }
    }
  }

  function updateSmellNeedle(maze, pos) {
    if (!pos) return;
    const dx = maze.end[1] - pos[1];
    const dy = maze.end[0] - pos[0];
    const ang = Math.atan2(dx, -dy) * 180 / Math.PI;
    $('smell-needle').style.transform = `rotate(${ang}deg)`;
  }

  function updateMetrics(rec) {
    const maze = activeMaze();
    $('m-step').textContent = state.step;
    $('m-total').textContent = rec ? rec.steps : '—';
    $('m-opt').textContent = maze.shortest;
    $('m-eff').textContent = rec ? (rec.efficiency * 100).toFixed(0) + '%' : '—';
    const total = rec ? Math.max(1, rec.trajectory.length - 1) : 1;
    $('prog').style.width = `${Math.min(100, (state.step / total) * 100)}%`;

    const meta = $('maze-meta');
    const dest = window.DESTINATIONS[state.activeMaze];
    meta.textContent = `· ${maze.size}×${maze.size} · optimal ${maze.shortest} · destination ${dest ? dest.emoji + ' ' + dest.name : ''}`;
  }

  function refreshModelList() {
    const list = $('model-list');
    list.innerHTML = window.MODEL_KEYS.map(k => {
      const m = window.MINOTAURS[k];
      const r = state.results[k] && state.results[k][state.activeMaze];
      const hasData = !!r;
      const eff = r ? (r.efficiency * 100).toFixed(0) + '%' : '—';
      const steps = r ? r.steps : '—';
      const solved = r ? (r.solved ? '✓' : '✗') : '—';
      return `<div class="model-card ${k === state.activeModel ? 'active' : ''} ${hasData ? '' : 'no-data'}"
                   data-k="${k}" style="--accent:${m.fur}">
        <div class="model-token">${window.minotaurSVG(k, 'token')}</div>
        <div class="model-info">
          <div class="model-name" style="color:${m.fur}">${m.label}</div>
          <div class="model-arch">${steps} steps · ${solved}</div>
        </div>
        <div class="model-stats">
          <div class="model-stat-num">${eff}</div>
          <div class="model-stat-label">eff.</div>
        </div>
      </div>`;
    }).join('');
    list.querySelectorAll('.model-card').forEach(el => {
      el.addEventListener('click', () => {
        state.activeModel = el.dataset.k;
        $('sel-model').value = state.activeModel;
        state.step = 0;
        refreshAll();
      });
    });
  }

  function refreshAll() {
    ensureBase();
    refreshModelList();
    drawFrame();
    if (window.Charts) window.Charts.renderAll(state);
    const counts = window.MODEL_KEYS.filter(k => state.results[k] && Object.keys(state.results[k]).length).length;
    const totalCSVs = window.MODEL_KEYS.reduce((s, k) =>
      s + (state.results[k] ? Object.keys(state.results[k]).length : 0), 0);
    $('footer-stats').textContent = `${counts}/5 models · ${totalCSVs} runs loaded`;
  }

  // ── animation loop ──
  let timer = null;
  function maxStepsForRace() {
    if (state.raceMode) {
      let m = 0;
      for (const k of window.MODEL_KEYS) {
        const r = state.results[k] && state.results[k][state.activeMaze];
        if (r && r.trajectory) m = Math.max(m, r.trajectory.length - 1);
      }
      return m;
    } else {
      const r = activeRecord();
      return r && r.trajectory ? r.trajectory.length - 1 : 0;
    }
  }
  function tick() {
    const max = maxStepsForRace();
    if (max <= 0) { stop(); return; }
    if (state.step >= max) { stop(); return; }
    state.step++;
    drawFrame();
  }
  function play() {
    const max = maxStepsForRace();
    if (max <= 0) return;
    if (state.step >= max) state.step = 0;
    state.playing = true;
    $('btn-play').textContent = '❚❚ Pause';
    if (timer) clearInterval(timer);
    timer = setInterval(tick, state.speed);
  }
  function stop() {
    state.playing = false;
    $('btn-play').textContent = '▶ Play';
    if (timer) { clearInterval(timer); timer = null; }
  }
  function reset() {
    state.step = 0;
    drawFrame();
  }

  // ── controls wiring ──
  function wire() {
    $('sel-maze').addEventListener('change', e => {
      state.activeMaze = e.target.value;
      state.step = 0;
      stop();
      refreshAll();
    });
    $('sel-model').addEventListener('change', e => {
      state.activeModel = e.target.value;
      state.step = 0;
      stop();
      refreshAll();
    });
    $('btn-play').addEventListener('click', () => state.playing ? stop() : play());
    $('btn-reset').addEventListener('click', () => { stop(); reset(); });
    document.querySelectorAll('.speed-group button').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.speed-group button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        state.speed = +b.dataset.speed;
        if (state.playing) play();
      });
    });

    // upload zone
    const z = $('upload-zone'), inp = $('upload-input');
    z.addEventListener('click', () => inp.click());
    z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('dragover'); });
    z.addEventListener('dragleave', () => z.classList.remove('dragover'));
    z.addEventListener('drop', async e => {
      e.preventDefault(); z.classList.remove('dragover');
      const files = [...e.dataTransfer.files].filter(f => f.name.toLowerCase().endsWith('.csv'));
      await ingestFiles(files);
    });
    inp.addEventListener('change', async e => {
      await ingestFiles([...e.target.files]);
    });

    $('btn-reload').addEventListener('click', loadFromGithub);

    const raceBtn = $('btn-race');
    if (raceBtn) {
      raceBtn.addEventListener('click', () => {
        state.raceMode = !state.raceMode;
        raceBtn.classList.toggle('active', state.raceMode);
        raceBtn.textContent = state.raceMode ? '🏁 Race: ALL' : '🏁 Race: solo';
        state.step = 0;
        drawFrame();
      });
    }
  }

  async function ingestFiles(files) {
    if (!files.length) return;
    setStatus(`Parsing ${files.length} CSV…`);
    try {
      const fresh = await window.CSV.loadFiles(files);
      for (const k of Object.keys(fresh)) {
        state.results[k] = state.results[k] || {};
        Object.assign(state.results[k], fresh[k]);
      }
      setStatus(`Added ${files.length} CSV`, 'ok');
      refreshAll();
    } catch (e) {
      setStatus('Upload failed: ' + e.message, 'err');
    }
  }

  async function loadFromGithub() {
    $('loader').classList.remove('hidden');
    $('loader-text').textContent = 'Listing GitHub results folder…';
    setStatus('Loading from GitHub…');
    try {
      const { results, fileCount } = await window.CSV.loadAllFromGithub((d, t) => {
        $('loader-text').textContent = `Fetching CSVs… ${d}/${t}`;
      });
      state.results = results;
      const modelCount = Object.keys(results).length;
      if (fileCount === 0) {
        setStatus('No CSVs in GitHub yet — drop files here', 'err');
      } else {
        setStatus(`Loaded ${fileCount} CSV from GitHub`, 'ok');
      }
      refreshAll();
    } catch (e) {
      console.warn(e);
      setStatus('GitHub load failed — drop CSVs manually', 'err');
      refreshAll();
    } finally {
      $('loader').classList.add('hidden');
    }
  }

  // ── boot ──
  async function boot() {
    buildUI();
    wire();
    await window.preloadMinotaurTokens();
    refreshAll();
    loadFromGithub();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
