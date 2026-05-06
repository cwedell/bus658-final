// charts.js — fixed efficiency accounting + baseline reference lines

window.Charts = (function () {
  const inst = {};

  // Exact values from notebook execution
  // Random baseline: max_steps = 6 * size^2, 0% solve rate
  // Non-backtracking: all 15 solved
  const RANDOM_STEPS    = { 6: 216,  7: 294,  8: 384  };  // = 6*size^2
  const NB_STEPS_PER_MAZE = {   // per-maze actual steps from notebook cell 17 output
    '6x6-1': 34, '6x6-2': 29, '6x6-3': 34, '6x6-4': 42, '6x6-5': 59,
    '7x7-1': 76, '7x7-2': 41, '7x7-3': 39, '7x7-4': 78, '7x7-5': 77,
    '8x8-1': 91, '8x8-2': 82, '8x8-3': 92, '8x8-4': 70, '8x8-5': 90,
  };
  const NB_EFF_BY_SIZE  = { 6: 0.728, 7: 0.614, 8: 0.526 }; // mean eff non-backtracking

  function col(k) { return (window.MINOTAURS[k] && window.MINOTAURS[k].fur) || '#888'; }
  function lbl(k) { return (window.MINOTAURS[k] && window.MINOTAURS[k].label) || k; }

  function destroy() {
    Object.keys(inst).forEach(k => { try { inst[k] && inst[k].destroy(); } catch(e){} inst[k] = null; });
  }

  function getRes(state) {
    if (state.activeTab === 'smell') return state.smell || {};
    return state.baseline || state.results || {};
  }

  function getRec(res, k, name) {
    return (res[k] && res[k][name]) || null;
  }

  function meanArr(arr) {
    const v = arr.filter(x => x != null && isFinite(x));
    return v.length ? v.reduce((a,b)=>a+b,0)/v.length : null;
  }

  // Efficiency: INCLUDE zeros for unsolved (as per your correction)
  function effForRec(r) {
    if (!r) return null;
    if (!r.solved) return 0;
    return r.efficiency > 0 ? r.efficiency : (r.shortest && r.steps ? r.shortest / r.steps : 0);
  }

  // ── CHART 1: Efficiency by maze size (with baselines) ──
  function buildEffBySize(res) {
    const sizes = [6,7,8];
    const modelDatasets = window.MODEL_KEYS.map(k => ({
      label: lbl(k),
      data: sizes.map(sz => meanArr(
        (window.MAZE_SPECS||[]).filter(m=>m.size===sz)
          .map(m => effForRec(getRec(res,k,m.name)))
      )),
      borderColor: col(k), backgroundColor: col(k)+'28',
      tension: 0.35, borderWidth: 2.5, pointRadius: 6,
      pointBackgroundColor: col(k), spanGaps: true, fill: false,
    }));

    // Non-backtracking baseline
    modelDatasets.push({
      label: 'Non-backtracking baseline',
      data: sizes.map(sz => NB_EFF_BY_SIZE[sz]),
      borderColor: '#64748b', borderDash: [6,3], borderWidth: 2,
      pointRadius: 4, pointStyle: 'triangle',
      pointBackgroundColor: '#64748b', fill: false, tension: 0.1,
    });
    // Random baseline (0 solve = 0 efficiency)
    modelDatasets.push({
      label: 'Random baseline (0% solve)',
      data: sizes.map(() => 0),
      borderColor: '#94a3b8', borderDash: [3,3], borderWidth: 1.5,
      pointRadius: 0, fill: false, tension: 0,
    });

    return { labels: sizes.map(s=>s+'×'+s), datasets: modelDatasets };
  }

  // ── CHART 2: Solve rate ──
  function buildSolveRate(res) {
    const sizes = [6,7,8];
    const ds = window.MODEL_KEYS.map(k => ({
      label: lbl(k),
      data: sizes.map(sz => {
        const recs = (window.MAZE_SPECS||[]).filter(m=>m.size===sz)
          .map(m=>getRec(res,k,m.name)).filter(Boolean);
        return recs.length ? recs.filter(r=>r.solved).length/recs.length : null;
      }),
      backgroundColor: col(k)+'bb', borderColor: col(k), borderWidth: 1.5, borderRadius: 4,
    }));
    // Non-backtracking 100%
    ds.push({ label:'Non-backtracking (100%)', data: sizes.map(()=>1),
      type:'line', borderColor:'#64748b', borderDash:[6,3], borderWidth:2,
      pointRadius:0, fill:false, tension:0 });
    return { labels: sizes.map(s=>s+'×'+s), datasets: ds };
  }

  // ── CHART 3: Steps vs optimal with baselines ──
  function buildStepsVsOptimal(res) {
    const mazes = window.MAZE_SPECS || [];
    const ds = [
      // BFS optimal
      { label:'BFS Optimal', data: mazes.map(m=>m.shortest),
        borderColor:'rgba(16,185,129,0.7)', borderDash:[5,4], borderWidth:2,
        pointRadius:0, fill:false, tension:0.1 },
      // Random baseline (max_steps = 6*size^2, capped at that value)
      { label:'Random (max steps, 0% solve)', data: mazes.map(m=>6*m.size*m.size),
        borderColor:'#94a3b8', borderDash:[3,3], borderWidth:1.8,
        pointRadius:0, fill:false, tension:0, borderDashOffset:0 },
      // Non-backtracking baseline
      { label:'Non-backtracking baseline', data: mazes.map(m=>NB_STEPS_PER_MAZE[m.name]||null),
        borderColor:'#64748b', borderDash:[6,3], borderWidth:2,
        pointRadius:3, pointStyle:'triangle', pointBackgroundColor:'#64748b',
        fill:false, tension:0.2, spanGaps:true },
    ];
    // LLM models
    window.MODEL_KEYS.forEach(k => ds.push({
      label: lbl(k),
      data: mazes.map(m => { const r=getRec(res,k,m.name); return r?r.steps:null; }),
      borderColor: col(k), backgroundColor: col(k)+'1a', borderWidth: 2.5,
      pointRadius: 4, tension: 0.2, spanGaps: true, fill: false,
    }));
    return { labels: mazes.map(m=>m.name), datasets: ds };
  }

  // ── CHART 4: Decision quality radar ──
  function buildRadar(res) {
    const mazes = window.MAZE_SPECS || [];
    return {
      labels: mazes.map(m=>m.name),
      datasets: window.MODEL_KEYS.map(k => ({
        label: lbl(k),
        data: mazes.map(m => { const r=getRec(res,k,m.name); return Math.min(1,Math.max(0,effForRec(r)||0)); }),
        borderColor: col(k), backgroundColor: col(k)+'1e', borderWidth: 2,
        pointRadius: 2, pointBackgroundColor: col(k),
      })),
    };
  }

  // ── CHART 5: Backtrack ratio ──
  function buildBacktrack(res) {
    const sizes = [6,7,8];
    return {
      labels: sizes.map(s=>s+'×'+s),
      datasets: window.MODEL_KEYS.map(k => ({
        label: lbl(k),
        data: sizes.map(sz => meanArr(
          (window.MAZE_SPECS||[]).filter(m=>m.size===sz)
            .map(m=>getRec(res,k,m.name))
            .filter(r=>r&&r.steps>0).map(r=>(r.revisits||0)/r.steps)
        )),
        backgroundColor: col(k)+'bb', borderColor: col(k), borderWidth: 1.5, borderRadius: 4,
      })),
    };
  }

  // ── SHARED OPTS ──
  const FONT = { family: 'DM Sans, Inter, sans-serif', size: 11 };
  const PLUGINS = {
    legend: { position:'bottom', labels: { color:'#3a5a2a', font:FONT, boxWidth:12, padding:10 } },
    tooltip: { backgroundColor:'#fff', titleColor:'#1e3a12', bodyColor:'#3a5a2a', borderColor:'#b8d4a0', borderWidth:1, padding:9 },
  };
  const SCALES_XY = {
    x: { ticks:{color:'#5a7a4a',font:FONT}, grid:{color:'rgba(90,120,70,0.12)'} },
    y: { ticks:{color:'#5a7a4a',font:FONT}, grid:{color:'rgba(90,120,70,0.12)'}, beginAtZero:true },
  };
  function opts(extra) {
    return { responsive:true, maintainAspectRatio:false, animation:{duration:500}, plugins:PLUGINS, scales:SCALES_XY, ...extra };
  }

  // ── RENDER ──
  function renderAll(state) {
    destroy();
    const res = getRes(state);
    const tab = state.activeTab==='smell'?'Smellovision':'Baseline';

    let total = 0;
    (window.MODEL_KEYS||[]).forEach(k => total += Object.keys(res[k]||{}).length);
    console.log('[Charts]', tab, total, 'records');

    const dbg = document.getElementById('debug-panel');
    if (dbg) {
      dbg.textContent = `[${tab}] ${total} records\n` +
        (window.MODEL_KEYS||[]).map(k => {
          const recs=res[k]||{}, mazes=Object.keys(recs);
          if(!mazes.length) return `  ${k}: NO DATA`;
          const s=recs[mazes[0]];
          return `  ${k}: ${mazes.length} mazes | ${mazes[0]}: solved=${s.solved} steps=${s.steps} eff=${(+s.efficiency||0).toFixed(3)}`;
        }).join('\n');
      dbg.style.display = 'block';
    }

    function ctx(id) { const e=document.getElementById(id); return e?e.getContext('2d'):null; }

    if (total===0) {
      ['chart-eff','chart-solve','chart-steps','chart-radar','chart-bt'].forEach(id=>{
        const c=ctx(id); if(!c)return;
        c.clearRect(0,0,999,999);
        c.fillStyle='#8aaa7a'; c.font='13px DM Sans,sans-serif';
        c.textAlign='center'; c.textBaseline='middle';
        const el=document.getElementById(id);
        c.fillText('No '+tab+' data loaded', (el.parentElement||el).offsetWidth/2||200, (el.parentElement||el).offsetHeight/2||110);
      });
      return;
    }

    const c1=ctx('chart-eff');
    if(c1) inst.eff = new Chart(c1,{type:'line',data:buildEffBySize(res),options:opts({
      scales:{...SCALES_XY,y:{...SCALES_XY.y,min:0,max:1,title:{display:true,text:'Mean Efficiency (0=unsolved)',color:'#5a7a4a',font:FONT}}}
    })});

    const c2=ctx('chart-solve');
    if(c2) inst.solve = new Chart(c2,{type:'bar',data:buildSolveRate(res),options:opts({
      scales:{...SCALES_XY,y:{...SCALES_XY.y,min:0,max:1,title:{display:true,text:'Solve Rate',color:'#5a7a4a',font:FONT}}}
    })});

    const c3=ctx('chart-steps');
    if(c3) inst.steps = new Chart(c3,{type:'line',data:buildStepsVsOptimal(res),options:opts({
      scales:{...SCALES_XY,y:{...SCALES_XY.y,title:{display:true,text:'Steps Taken',color:'#5a7a4a',font:FONT}}}
    })});

    const c4=ctx('chart-radar');
    if(c4) inst.radar = new Chart(c4,{type:'radar',data:buildRadar(res),options:{
      responsive:true,maintainAspectRatio:false,animation:{duration:500},plugins:PLUGINS,
      scales:{r:{min:0,max:1,angleLines:{color:'rgba(90,120,70,0.2)'},grid:{color:'rgba(90,120,70,0.2)'},
        pointLabels:{color:'#3a5a2a',font:{size:9}},ticks:{display:false}}}
    }});

    const c5=ctx('chart-bt');
    if(c5) inst.bt = new Chart(c5,{type:'bar',data:buildBacktrack(res),options:opts({
      scales:{...SCALES_XY,y:{...SCALES_XY.y,title:{display:true,text:'Revisit Ratio',color:'#5a7a4a',font:FONT}}}
    })});
  }

  return { renderAll, destroyAll: destroy };
})();
