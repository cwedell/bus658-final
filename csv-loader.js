// CSV loading: GitHub repo discovery + drag-drop upload + parsing.
// Filename pattern: {model}_{maze}_{YYYYMMDD}_{HHMMSS}.csv
// Two formats supported:
//   A) Summary row: maze, size, solved, steps, shortest_path_length, efficiency,
//                   invalid_moves, revisits, unique_cells_visited, coverage,
//                   trajectory (JSON), moves (JSON)
//   B) Step-by-step: step, row/r, col/c, move/direction, legal, solved, efficiency

window.CSV = (function(){
  const REPO = 'cwedell/bus658-final';
  const BRANCH = 'master';
  const RESULTS_PATH = 'results';

  const MODEL_KEYS = ['claude-sonnet-4-5', 'gpt-5.2', 'gemini-3-pro-preview', 'deepseek-r1', 'talkie'];

  function parseFilename(fn) {
    // Strip extension, search for known model key prefix.
    const base = fn.replace(/\.csv$/i, '');
    let model = null;
    for (const k of MODEL_KEYS) {
      if (base.startsWith(k + '_')) { model = k; break; }
    }
    if (!model) {
      // Try generic split: lastpart of timestamp pattern
      const m = base.match(/^(.+?)_(\d?x\d|\dx\d)/i);
      if (m) model = m[1];
    }
    // maze name
    const mazeMatch = base.match(/(\dx\d-\d)/i);
    const maze = mazeMatch ? mazeMatch[1] : null;
    return { model, maze };
  }

  function safeJsonParse(s) {
    if (s == null) return null;
    if (typeof s !== 'string') return s;
    try {
      // Allow Python tuples [(0,0),(1,0)] -> JSON
      const cleaned = s.replace(/\(/g, '[').replace(/\)/g, ']').replace(/'/g, '"');
      return JSON.parse(cleaned);
    } catch (e) {
      return null;
    }
  }

  function normaliseRow(row, mazeData) {
    // Try to extract steps, solved, efficiency, trajectory, moves
    const out = {};
    out.steps = +row.steps || +row.step_count || 0;
    out.shortest = +row.shortest_path_length || mazeData?.shortest || null;
    out.efficiency = parseFloat(row.efficiency) || (out.shortest && out.steps ? out.shortest / out.steps : 0);
    out.solved = String(row.solved).toLowerCase() === 'true' || row.solved === true || row.solved === '1';
    out.invalid_moves = +row.invalid_moves || 0;
    out.revisits = +row.revisits || 0;
    out.coverage = parseFloat(row.coverage) || 0;
    out.unique_cells_visited = +row.unique_cells_visited || 0;
    const trajRaw = row.trajectory;
    const movesRaw = row.moves;
    out.trajectory = safeJsonParse(trajRaw);
    out.moves = safeJsonParse(movesRaw);
    return out;
  }

  // Parse a single CSV text into per-trial result records.
  function parseCSVText(text, fn) {
    let { model, maze } = parseFilename(fn);

    return new Promise(resolve => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (res) => {
          const rows = res.data;
          if (!rows.length) { resolve(null); return; }
          // If filename parsing failed, try to read from CSV columns
          if (!model && rows[0].model) {
            const m = String(rows[0].model).toLowerCase().trim();
            for (const k of MODEL_KEYS) {
              if (m === k.toLowerCase() || m.startsWith(k.toLowerCase())) { model = k; break; }
            }
            if (!model) model = m;
          }
          if (!maze && rows[0].maze) maze = String(rows[0].maze).trim();
          if (!model || !maze) { resolve(null); return; }
          const mazeSpec = window.MAZE_SPECS.find(m => m.name === maze);
          if (!mazeSpec) { resolve(null); return; }
          const mazeData = window.parseMaze(mazeSpec);
          // Detect format
          const cols = res.meta.fields.map(f => f.toLowerCase());
          const hasStepCol = cols.includes('step');
          const hasPosCol = cols.includes('row') && cols.includes('col');
          const hasMoveCol = cols.includes('move_taken') || cols.includes('move') || cols.includes('direction') || cols.includes('action');
          const hasTrajectoryCol = cols.includes('trajectory');
          // Step-by-step if multiple rows AND (step col or row+col cols)
          const isStep = rows.length > 1 && (hasStepCol || hasPosCol);
          const isSummary = !isStep && (cols.includes('steps') || cols.includes('efficiency') || hasTrajectoryCol);

          let record;
          if (isStep) {
            // Build trajectory + moves from each step row
            const moves = [];
            const traj = [];
            let solved = false;
            let eff = 0;
            let totalSteps = 0;
            let invalid = 0;
            for (const r of rows) {
              const rr = r.row != null ? +r.row : (r.r != null ? +r.r : null);
              const cc = r.col != null ? +r.col : (r.c != null ? +r.c : null);
              if (rr != null && cc != null && !isNaN(rr) && !isNaN(cc)) {
                traj.push([rr, cc]);
              }
              const moveRaw = (r.move_taken || r.move || r.direction || r.action || '').toString().trim();
              if (moveRaw && moveRaw !== '—' && moveRaw !== '-' && moveRaw !== '') {
                const dir = moveRaw.toUpperCase().charAt(0);
                if (['N','S','E','W'].includes(dir)) moves.push(dir);
              }
              if (r.solved != null) {
                const sv = String(r.solved).toLowerCase();
                if (sv === 'true' || sv === '1') solved = true;
              }
              if (r.efficiency) eff = parseFloat(r.efficiency) || eff;
              if (r.total_steps) totalSteps = +r.total_steps || totalSteps;
              const legalRaw = r.legal;
              if (legalRaw != null && String(legalRaw).toLowerCase() === 'false') invalid++;
            }
            // Compute revisits
            const seen = new Set();
            let rv = 0;
            for (const [rr, cc] of traj) {
              const k = rr + ',' + cc;
              if (seen.has(k)) rv++;
              seen.add(k);
            }
            record = {
              steps: totalSteps || moves.length || (traj.length - 1),
              shortest: mazeData.shortest,
              solved,
              efficiency: eff || (mazeData.shortest && (traj.length - 1) ? mazeData.shortest / (traj.length - 1) : 0),
              invalid_moves: invalid,
              revisits: rv,
              coverage: seen.size / (mazeData.size * mazeData.size),
              unique_cells_visited: seen.size,
              moves,
              trajectory: traj.length ? traj : [mazeData.start.slice()],
            };
          } else if (isSummary && rows.length === 1) {
            record = normaliseRow(rows[0], mazeData);
          } else if (isSummary && rows.length > 1) {
            const match = rows.find(r => (r.maze || '').toString().toLowerCase() === maze.toLowerCase()) || rows[0];
            record = normaliseRow(match, mazeData);
          } else {
            record = normaliseRow(rows[0] || {}, mazeData);
          }
          // If no trajectory but moves exist, reconstruct
          if ((!record.trajectory || !record.trajectory.length) && record.moves && record.moves.length) {
            record.trajectory = window.trajectoryFromMoves(mazeData, record.moves);
          }
          if (!record.trajectory || !record.trajectory.length) {
            record.trajectory = [mazeData.start.slice()];
          }
          // Compute revisits if missing
          if (!record.revisits && record.trajectory.length) {
            const seen = new Set();
            let rv = 0;
            for (const [r,c] of record.trajectory) {
              const k = r + ',' + c;
              if (seen.has(k)) rv++;
              seen.add(k);
            }
            record.revisits = rv;
            record.unique_cells_visited = seen.size;
            record.coverage = seen.size / (mazeData.size * mazeData.size);
          }
          resolve({ model, maze, record });
        }
      });
    });
  }

  // Load list of CSV files in github results folder via the GitHub API.
  // Falls back to git tree API (1 request, no per-file calls).
  async function listFromGithub() {
    // Try contents API first
    try {
      const url = `https://api.github.com/repos/${REPO}/contents/${RESULTS_PATH}?ref=${BRANCH}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.filter(f => f.name.toLowerCase().endsWith('.csv'));
      }
    } catch (e) {}
    // Fallback: git tree (gives all paths in one call)
    const tUrl = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
    const r = await fetch(tUrl);
    if (!r.ok) throw new Error('GitHub list failed: ' + r.status);
    const j = await r.json();
    return (j.tree || [])
      .filter(t => t.type === 'blob' &&
                   t.path.startsWith(RESULTS_PATH + '/') &&
                   t.path.toLowerCase().endsWith('.csv'))
      .map(t => ({ name: t.path.slice(RESULTS_PATH.length + 1),
                   download_url: `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${t.path}` }));
  }

  async function fetchCSVFile(file) {
    const url = file.download_url ||
      `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${RESULTS_PATH}/${file.name}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('CSV fetch failed: ' + file.name);
    const text = await res.text();
    return await parseCSVText(text, file.name);
  }

  async function loadAllFromGithub(onProgress) {
    const files = await listFromGithub();
    const out = {};
    let done = 0;
    // Concurrency limit
    const queue = [...files];
    const workers = Array(6).fill(0).map(async () => {
      while (queue.length) {
        const f = queue.shift();
        try {
          const result = await fetchCSVFile(f);
          if (result) {
            out[result.model] = out[result.model] || {};
            // If multiple CSVs for same maze/model, keep latest by filename timestamp
            const existing = out[result.model][result.maze];
            if (!existing || f.name > existing._fn) {
              out[result.model][result.maze] = { ...result.record, _fn: f.name };
            }
          }
        } catch (e) { /* skip */ }
        done++;
        onProgress && onProgress(done, files.length);
      }
    });
    await Promise.all(workers);
    return { results: out, fileCount: files.length };
  }

  async function loadFiles(fileList) {
    const out = {};
    for (const f of fileList) {
      const text = await f.text();
      const r = await parseCSVText(text, f.name);
      if (r) {
        out[r.model] = out[r.model] || {};
        out[r.model][r.maze] = r.record;
      }
    }
    return out;
  }

  return { parseCSVText, listFromGithub, loadAllFromGithub, loadFiles, parseFilename };
})();
