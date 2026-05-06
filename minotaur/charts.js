// Six Chart.js charts. Each takes the global state {results, mazes}.
// MODEL_KEYS, MINOTAURS expected on window.

window.Charts = (function(){
  const charts = {};

  function modelColor(k) {
    return (window.MINOTAURS[k] && window.MINOTAURS[k].fur) || '#888';
  }
  function modelLabel(k) {
    return (window.MINOTAURS[k] && window.MINOTAURS[k].label) || k;
  }

  function destroyAll() {
    for (const k of Object.keys(charts)) {
      if (charts[k]) { charts[k].destroy(); charts[k] = null; }
    }
  }

  // helpers
  function meanBy(xs, fn) {
    const ys = xs.map(fn).filter(v => v != null && !Number.isNaN(v));
    if (!ys.length) return null;
    return ys.reduce((a,b)=>a+b,0) / ys.length;
  }

  function getResults(state) {
    return state.activeTab === 'smell' ? (state.smellResults || {}) : (state.results || {});
  }
  function buildEfficiencyBySize(state) {
    const sizes = [6, 7, 8];
    const datasets = window.MODEL_KEYS.map(k => {
      const data = sizes.map(sz => {
        const recs = window.MAZE_SPECS
          .filter(m => m.size === sz)
          .map(m => getResults(state)[k] && getResults(state)[k][m.name])
          .filter(Boolean);
        const v = meanBy(recs, r => r.solved ? r.efficiency : 0);
        return v;
      });
      return {
        label: modelLabel(k),
        data,
        borderColor: modelColor(k),
        backgroundColor: modelColor(k) + '33',
        tension: 0.3,
        borderWidth: 2.5,
        pointRadius: 5,
        pointBackgroundColor: modelColor(k),
      };
    });
    return { labels: sizes.map(s => `${s}×${s}`), datasets };
  }

  function buildSolveRate(state) {
    const sizes = [6, 7, 8];
    const datasets = window.MODEL_KEYS.map(k => ({
      label: modelLabel(k),
      data: sizes.map(sz => {
        const recs = window.MAZE_SPECS
          .filter(m => m.size === sz)
          .map(m => getResults(state)[k] && getResults(state)[k][m.name])
          .filter(Boolean);
        if (!recs.length) return null;
        return recs.filter(r => r.solved).length / recs.length;
      }),
      backgroundColor: modelColor(k),
      borderColor: modelColor(k),
      borderWidth: 1,
    }));
    return { labels: sizes.map(s => `${s}×${s}`), datasets };
  }

  // Random baseline steps from notebook: max_steps = 6 * size^2
  const RANDOM_STEPS_PER_MAZE = {
    '6x6-1':216,'6x6-2':216,'6x6-3':216,'6x6-4':216,'6x6-5':216,
    '7x7-1':294,'7x7-2':294,'7x7-3':294,'7x7-4':294,'7x7-5':294,
    '8x8-1':384,'8x8-2':384,'8x8-3':384,'8x8-4':384,'8x8-5':384,
  };
  // Non-backtracking baseline steps from notebook cell 17
  const NB_STEPS_PER_MAZE = {
    '6x6-1':34,'6x6-2':29,'6x6-3':34,'6x6-4':42,'6x6-5':59,
    '7x7-1':76,'7x7-2':41,'7x7-3':39,'7x7-4':78,'7x7-5':77,
    '8x8-1':91,'8x8-2':82,'8x8-3':92,'8x8-4':70,'8x8-5':90,
  };
  function buildStepsVsOptimal(state) {
    const labels = window.MAZE_SPECS.map(m => m.name);
    const optimal = {
      label: 'Optimal (BFS)',
      data: window.MAZE_SPECS.map(m => m.shortest),
      borderColor: 'rgba(16,185,129,0.7)',
      borderDash: [4, 4],
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.05,
    };
    const randomBaseline = {
      label: 'Random baseline',
      data: window.MAZE_SPECS.map(m => RANDOM_STEPS_PER_MAZE[m.name] || null),
      borderColor: '#94a3b8',
      borderDash: [3, 3],
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0,
    };
    const nbBaseline = {
      label: 'Non-backtracking baseline',
      data: window.MAZE_SPECS.map(m => NB_STEPS_PER_MAZE[m.name] || null),
      borderColor: '#64748b',
      borderDash: [6, 3],
      borderWidth: 1.8,
      pointRadius: 3,
      pointStyle: 'triangle',
      pointBackgroundColor: '#64748b',
      tension: 0.2,
      spanGaps: true,
    };
    const datasets = [optimal, randomBaseline, nbBaseline, ...window.MODEL_KEYS.map(k => ({
      label: modelLabel(k),
      data: window.MAZE_SPECS.map(m => {
        const r = getResults(state)[k] && getResults(state)[k][m.name];
        return r ? r.steps : null;
      }),
      borderColor: modelColor(k),
      backgroundColor: modelColor(k) + '33',
      borderWidth: 2,
      pointRadius: 3,
      tension: 0.2,
      spanGaps: true,
    }))];
    return { labels, datasets };
  }

  function buildRadar(state) {
    const labels = window.MAZE_SPECS.map(m => m.name);
    const datasets = window.MODEL_KEYS.map(k => ({
      label: modelLabel(k),
      data: window.MAZE_SPECS.map(m => {
        const r = getResults(state)[k] && getResults(state)[k][m.name];
        return r ? Math.max(0, r.efficiency) : 0;
      }),
      borderColor: modelColor(k),
      backgroundColor: modelColor(k) + '22',
      borderWidth: 1.5,
      pointRadius: 2,
    }));
    return { labels, datasets };
  }

  function buildBacktrack(state) {
    const sizes = [6, 7, 8];
    const datasets = window.MODEL_KEYS.map(k => ({
      label: modelLabel(k),
      data: sizes.map(sz => {
        const recs = window.MAZE_SPECS
          .filter(m => m.size === sz)
          .map(m => getResults(state)[k] && getResults(state)[k][m.name])
          .filter(Boolean);
        return meanBy(recs, r => r.steps ? r.revisits / r.steps : 0);
      }),
      backgroundColor: modelColor(k),
    }));
    return { labels: sizes.map(s => `${s}×${s}`), datasets };
  }

  function buildScatter(state) {
    const datasets = window.MODEL_KEYS.map(k => {
      const pts = [];
      for (const m of window.MAZE_SPECS) {
        const r = getResults(state)[k] && getResults(state)[k][m.name];
        if (!r) continue;
        // x = invalid_moves rate (proxy for ignoring smell), y = efficiency
        const invRate = r.steps ? r.invalid_moves / r.steps : 0;
        pts.push({ x: invRate, y: r.efficiency, maze: m.name });
      }
      return {
        label: modelLabel(k),
        data: pts,
        backgroundColor: modelColor(k),
        borderColor: modelColor(k),
        pointRadius: 5,
        pointHoverRadius: 7,
      };
    });
    return { datasets };
  }

  const COMMON_OPTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#3a5a2a', font: { family: 'Inter, sans-serif', size: 11 } },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e3a12',
        bodyColor: '#3a5a2a',
        borderColor: '#b8d4a0',
        borderWidth: 1,
      },
    },
    scales: {
      x: { ticks: { color: '#5a7a4a', font: { family: 'Inter, sans-serif', size: 11 } }, grid: { color: 'rgba(90,120,70,0.12)' } },
      y: { ticks: { color: '#5a7a4a', font: { family: 'Inter, sans-serif', size: 11 } }, grid: { color: 'rgba(90,120,70,0.12)' } },
    },
  };

  function renderAll(state) {
    destroyAll();
    const ctx = id => document.getElementById(id).getContext('2d');

    charts.eff = new Chart(ctx('chart-eff'), {
      type: 'line',
      data: buildEfficiencyBySize(state),
      options: { ...COMMON_OPTS, scales: { ...COMMON_OPTS.scales,
        y: { ...COMMON_OPTS.scales.y, beginAtZero: true, max: 1, title: { display: true, text: 'Mean efficiency', color: '#a89570' } } } },
    });

    charts.solve = new Chart(ctx('chart-solve'), {
      type: 'bar',
      data: buildSolveRate(state),
      options: { ...COMMON_OPTS, scales: { ...COMMON_OPTS.scales,
        y: { ...COMMON_OPTS.scales.y, beginAtZero: true, max: 1, title: { display: true, text: 'Solve rate', color: '#a89570' } } } },
    });

    charts.steps = new Chart(ctx('chart-steps'), {
      type: 'line',
      data: buildStepsVsOptimal(state),
      options: { ...COMMON_OPTS, scales: { ...COMMON_OPTS.scales,
        y: { ...COMMON_OPTS.scales.y, beginAtZero: true, title: { display: true, text: 'Steps taken', color: '#a89570' } } } },
    });

    charts.radar = new Chart(ctx('chart-radar'), {
      type: 'radar',
      data: buildRadar(state),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: COMMON_OPTS.plugins,
        scales: {
          r: {
            angleLines: { color: 'rgba(90,120,70,0.18)' },
            grid: { color: 'rgba(90,120,70,0.18)' },
            pointLabels: { color: '#3a5a2a', font: { family: 'Inter, sans-serif', size: 9 } },
            ticks: { display: false, beginAtZero: true, max: 1 },
            min: 0, max: 1,
          },
        },
      },
    });

    charts.bt = new Chart(ctx('chart-bt'), {
      type: 'bar',
      data: buildBacktrack(state),
      options: { ...COMMON_OPTS, scales: { ...COMMON_OPTS.scales,
        y: { ...COMMON_OPTS.scales.y, beginAtZero: true, title: { display: true, text: 'Revisit ratio', color: '#a89570' } } } },
    });
    // scatter chart removed
}

  return { renderAll, destroyAll };
})();
