// charts.js — robust Chart.js rendering with full debug logging
// Reads from state.baseline[model][maze] and state.smell[model][maze]

window.Charts = (function () {
  const instances = {};

  function destroy() {
    Object.keys(instances).forEach(k => {
      if (instances[k]) { try { instances[k].destroy(); } catch(e){} instances[k] = null; }
    });
  }

  function col(k) { return (window.MINOTAURS[k] && window.MINOTAURS[k].fur) || '#888'; }
  function lbl(k) { return (window.MINOTAURS[k] && window.MINOTAURS[k].label) || k; }

  function getResults(state) {
    if (state.activeTab === 'smell') return state.smell || {};
    return state.baseline || state.results || {};
  }

  function mean(arr) {
    const valid = arr.filter(v => v != null && isFinite(v));
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  }

  function getRec(results, k, mazeName) {
    return (results[k] && results[k][mazeName]) || null;
  }

  function efficiencyBySize(results) {
    const sizes = [6, 7, 8];
    return {
      labels: sizes.map(s => s + 'x' + s),
      datasets: window.MODEL_KEYS.map(k => ({
        label: lbl(k),
        data: sizes.map(sz => mean(
          (window.MAZE_SPECS || []).filter(m => m.size === sz)
            .map(m => getRec(results, k, m.name))
            .filter(r => r && r.solved && r.efficiency > 0)
            .map(r => r.efficiency)
        )),
        borderColor: col(k), backgroundColor: col(k) + '30',
        tension: 0.35, borderWidth: 2.5, pointRadius: 5,
        pointBackgroundColor: col(k), spanGaps: true, fill: false,
      })),
    };
  }

  function solveRate(results) {
    const sizes = [6, 7, 8];
    return {
      labels: sizes.map(s => s + 'x' + s),
      datasets: window.MODEL_KEYS.map(k => ({
        label: lbl(k),
        data: sizes.map(sz => {
          const recs = (window.MAZE_SPECS || []).filter(m => m.size === sz)
            .map(m => getRec(results, k, m.name)).filter(Boolean);
          return recs.length ? recs.filter(r => r.solved).length / recs.length : null;
        }),
        backgroundColor: col(k) + 'bb', borderColor: col(k), borderWidth: 1.5, borderRadius: 4,
      })),
    };
  }

  function stepsVsOptimal(results) {
    const mazes = window.MAZE_SPECS || [];
    return {
      labels: mazes.map(m => m.name),
      datasets: [
        { label: 'Optimal', data: mazes.map(m => m.shortest),
          borderColor: 'rgba(80,100,60,0.5)', borderDash: [5,4], borderWidth: 2,
          pointRadius: 0, tension: 0.1, fill: false },
        ...window.MODEL_KEYS.map(k => ({
          label: lbl(k),
          data: mazes.map(m => { const r = getRec(results, k, m.name); return r ? r.steps : null; }),
          borderColor: col(k), backgroundColor: col(k) + '22', borderWidth: 2,
          pointRadius: 3, tension: 0.2, spanGaps: true, fill: false,
        })),
      ],
    };
  }

  function decisionRadar(results) {
    const mazes = window.MAZE_SPECS || [];
    return {
      labels: mazes.map(m => m.name),
      datasets: window.MODEL_KEYS.map(k => ({
        label: lbl(k),
        data: mazes.map(m => { const r = getRec(results, k, m.name); return r && r.efficiency > 0 ? Math.min(1, r.efficiency) : 0; }),
        borderColor: col(k), backgroundColor: col(k) + '1e', borderWidth: 2,
        pointRadius: 2, pointBackgroundColor: col(k),
      })),
    };
  }

  function backtrackRatio(results) {
    const sizes = [6, 7, 8];
    return {
      labels: sizes.map(s => s + 'x' + s),
      datasets: window.MODEL_KEYS.map(k => ({
        label: lbl(k),
        data: sizes.map(sz => mean(
          (window.MAZE_SPECS || []).filter(m => m.size === sz)
            .map(m => getRec(results, k, m.name))
            .filter(r => r && r.steps > 0)
            .map(r => (r.revisits || 0) / r.steps)
        )),
        backgroundColor: col(k) + 'bb', borderColor: col(k), borderWidth: 1.5, borderRadius: 4,
      })),
    };
  }

  const FONT = { family: 'DM Sans, Inter, sans-serif', size: 11 };
  const BASE_PLUGINS = {
    legend: { position: 'bottom', labels: { color: '#3a5a2a', font: FONT, boxWidth: 12, padding: 12 } },
    tooltip: {
      backgroundColor: '#fff', titleColor: '#1e3a12', bodyColor: '#3a5a2a',
      borderColor: '#b8d4a0', borderWidth: 1, padding: 9,
    },
  };
  const BASE_SCALES = {
    x: { ticks: { color: '#5a7a4a', font: FONT }, grid: { color: 'rgba(90,120,70,0.12)' } },
    y: { ticks: { color: '#5a7a4a', font: FONT }, grid: { color: 'rgba(90,120,70,0.12)' }, beginAtZero: true },
  };

  function lineOpts(yLabel, max) {
    const y = { ...BASE_SCALES.y, title: { display: !!yLabel, text: yLabel || '', color: '#5a7a4a', font: FONT } };
    if (max != null) y.max = max;
    return { responsive: true, maintainAspectRatio: false, animation: { duration: 500 }, plugins: BASE_PLUGINS, scales: { x: BASE_SCALES.x, y } };
  }
  function barOpts(yLabel, max) { return lineOpts(yLabel, max); }
  function radarOpts() {
    return {
      responsive: true, maintainAspectRatio: false, animation: { duration: 500 }, plugins: BASE_PLUGINS,
      scales: { r: { min: 0, max: 1, angleLines: { color: 'rgba(90,120,70,0.2)' }, grid: { color: 'rgba(90,120,70,0.2)' }, pointLabels: { color: '#3a5a2a', font: { size: 9 } }, ticks: { display: false } } },
    };
  }

  function noDataMsg(canvasId, tabName) {
    const el = document.getElementById(canvasId);
    if (!el) return;
    const ctx2d = el.getContext('2d');
    ctx2d.clearRect(0, 0, el.width, el.height);
    ctx2d.fillStyle = '#8aaa7a';
    ctx2d.font = '13px DM Sans, sans-serif';
    ctx2d.textAlign = 'center';
    ctx2d.textBaseline = 'middle';
    ctx2d.fillText('No ' + tabName + ' data loaded yet', el.parentElement.offsetWidth / 2, el.parentElement.offsetHeight / 2);
  }

  function renderAll(state) {
    destroy();

    const results = getResults(state);
    const tabName = state.activeTab === 'smell' ? 'Smellovision' : 'Baseline';

    // Count records
    let total = 0;
    const summary = {};
    (window.MODEL_KEYS || []).forEach(k => {
      const n = Object.keys(results[k] || {}).length;
      summary[k] = n; total += n;
    });
    console.log('[Charts] tab=' + tabName + ' records=' + total, summary);

    // Update debug info
    const dbg = document.getElementById('debug-panel');
    if (dbg) {
      dbg.textContent = '[' + tabName + '] ' + total + ' records loaded\n' +
        (window.MODEL_KEYS || []).map(k => {
          const recs = results[k] || {};
          const mazes = Object.keys(recs);
          if (!mazes.length) return '  ' + k + ': NO DATA';
          const s = recs[mazes[0]];
          return '  ' + k + ': ' + mazes.length + ' mazes | ' + mazes[0] + ': solved=' + s.solved + ' steps=' + s.steps + ' eff=' + (+s.efficiency || 0).toFixed(3);
        }).join('\n');
      dbg.style.display = 'block';
    }

    if (total === 0) {
      ['chart-eff','chart-solve','chart-steps','chart-radar','chart-bt'].forEach(id => noDataMsg(id, tabName));
      return;
    }

    function ctx(id) { const el = document.getElementById(id); return el ? el.getContext('2d') : null; }

    const c1 = ctx('chart-eff');
    if (c1) instances.eff = new Chart(c1, { type: 'line', data: efficiencyBySize(results), options: lineOpts('Efficiency', 1) });

    const c2 = ctx('chart-solve');
    if (c2) instances.solve = new Chart(c2, { type: 'bar', data: solveRate(results), options: barOpts('Solve Rate', 1) });

    const c3 = ctx('chart-steps');
    if (c3) instances.steps = new Chart(c3, { type: 'line', data: stepsVsOptimal(results), options: lineOpts('Steps') });

    const c4 = ctx('chart-radar');
    if (c4) instances.radar = new Chart(c4, { type: 'radar', data: decisionRadar(results), options: radarOpts() });

    const c5 = ctx('chart-bt');
    if (c5) instances.bt = new Chart(c5, { type: 'bar', data: backtrackRatio(results), options: barOpts('Revisit Ratio') });
  }

  return { renderAll, destroyAll: destroy };
})();
