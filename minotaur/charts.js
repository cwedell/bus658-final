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

  function getResults(state){return state.activeTab==='smell'?state.smell:state.baseline;}
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

  function buildStepsVsOptimal(state) {
    const labels = window.MAZE_SPECS.map(m => m.name);
    const optimal = {
      label: 'Optimal',
      data: window.MAZE_SPECS.map(m => m.shortest),
      borderColor: 'rgba(60,80,40,0.45)',
      borderDash: [4, 4],
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.05,
    };
    const datasets = [optimal, ...window.MODEL_KEYS.map(k => ({
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


  const COMMON_OPTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#3a5a2a', font: { family: 'DM Sans, sans-serif', size: 11 } },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#2a4a1a',
        bodyColor: '#4a6a3a',
        borderColor: '#b8d4a0',
        borderWidth: 1,
      },
    },
    scales: {
      x: { ticks: { color: '#5a7a4a', font: { family: 'DM Sans, sans-serif', size: 11 } }, grid: { color: 'rgba(90,120,70,0.1)' } },
      y: { ticks: { color: '#5a7a4a', font: { family: 'DM Sans, sans-serif', size: 11 } }, grid: { color: 'rgba(90,120,70,0.1)' } },
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
            angleLines: { color: 'rgba(90,120,70,0.2)' },
            grid: { color: 'rgba(90,120,70,0.2)' },
            pointLabels: { color: '#3a5a2a', font: { family: 'DM Sans, sans-serif', size: 9 } },
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

  }

  return { renderAll, destroyAll };
})();
