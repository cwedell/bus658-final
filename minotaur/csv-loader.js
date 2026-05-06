// csv-loader.js — complete rewrite, bulletproof
// Reads from: results/ (baseline) and smelly_results/ (smellovision)
// Model keys as they appear in filenames: claude-sonnet-4-6, gpt-5.2, gemini-3-pro-preview, deepseek-v3

window.CSV = (function () {

  const REPO   = 'cwedell/bus658-final';
  const BRANCH = 'master';
  const FOLDERS = ['results', 'smelly_results'];

  // Map any filename prefix → canonical display key used in window.MINOTAURS
  const KEY_MAP = {
    'claude-sonnet-4-6':    'claude-sonnet-4-6',
    'claude-sonnet-4-5':    'claude-sonnet-4-6',  // treat as same
    'claude-sonnet':        'claude-sonnet-4-6',
    'claude':               'claude-sonnet-4-6',
    'gpt-5.2':              'gpt-5.2',
    'gpt-5':                'gpt-5.2',
    'gpt':                  'gpt-5.2',
    'gemini-3-pro-preview': 'gemini-3-pro-preview',
    'gemini-3-pro':         'gemini-3-pro-preview',
    'gemini-3':             'gemini-3-pro-preview',
    'gemini':               'gemini-3-pro-preview',
    'deepseek-v3':          'deepseek-v3',
    'deepseek-r1':          'deepseek-v3',         // treat as same
    'deepseek':             'deepseek-v3',
    'talkie':               null,                  // removed — skip
  };

  // Sorted longest-first so e.g. "gemini-3-pro-preview" matches before "gemini"
  const KEY_PREFIXES = Object.keys(KEY_MAP).sort((a, b) => b.length - a.length);

  // Parse filename → { model (canonical), maze, isSmellovision }
  function parseFilename(filename, folder) {
    const base = filename.replace(/\.csv$/i, '').toLowerCase();
    let model = null;
    for (const prefix of KEY_PREFIXES) {
      if (base.startsWith(prefix + '_') || base === prefix) {
        model = KEY_MAP[prefix];
        break;
      }
    }
    // Fallback: grab everything before the maze-size token
    if (!model) {
      const m = base.match(/^(.+?)_(\d+x\d+-\d+)/i);
      if (m) model = KEY_MAP[m[1]] || m[1];
    }
    if (!model) return null; // skip unknown / removed models

    const mazeMatch = base.match(/(\d+x\d+-\d+)/i);
    const maze = mazeMatch ? mazeMatch[1] : null;
    if (!maze) return null;

    return { model, maze, isSmellovision: folder === 'smelly_results' };
  }

  // Safely parse JSON that may use Python tuple syntax: (0,1) → [0,1]
  function safeJSON(s) {
    if (s == null || s === '') return null;
    if (typeof s !== 'string') return s;
    try { return JSON.parse(s); } catch (_) {}
    try { return JSON.parse(s.replace(/\(/g, '[').replace(/\)/g, ']').replace(/'/g, '"')); } catch (_) {}
    return null;
  }

  // Build a record from a single summary row
  function recordFromRow(row, mazeSpec) {
    // Normalise keys to lowercase for case-insensitive column access
    const R = {};
    for (const [k, v] of Object.entries(row)) R[k.toLowerCase().trim()] = v;

    const steps    = +(R.steps || R.step_count || R.total_steps || 0);
    const shortest = +(R.shortest_path_length || R.shortest || (mazeSpec && mazeSpec.shortest) || 0);
    const solvedRaw = String(R.solved || '').toLowerCase();
    const solved   = solvedRaw === 'true' || solvedRaw === '1' || solvedRaw === 'yes';
    let efficiency = parseFloat(R.efficiency) || 0;
    if (!efficiency && solved && steps > 0 && shortest > 0) efficiency = shortest / steps;
    if (!solved) efficiency = 0; // penalise non-solves

    const trajectory = safeJSON(R.trajectory) || null;
    const moves      = safeJSON(R.moves)      || null;

    return {
      steps, shortest, solved, efficiency,
      invalid_moves: +(R.invalid_moves || 0),
      revisits:      +(R.revisits || 0),
      coverage:      parseFloat(R.coverage) || 0,
      unique_cells_visited: +(R.unique_cells_visited || 0),
      trajectory, moves,
    };
  }

  // Build a record from step-by-step rows (one row per move)
  function recordFromSteps(rows, mazeSpec) {
    const traj = [], moves = [];
    let solved = false, efficiency = 0, steps = 0, invalid = 0;

    for (const rawRow of rows) {
      const row = {};
      for (const [k, v] of Object.entries(rawRow)) row[k.toLowerCase().trim()] = v;

      const r = +(row.row ?? row.r ?? row.pos_row ?? NaN);
      const c = +(row.col ?? row.c ?? row.pos_col ?? NaN);
      if (!isNaN(r) && !isNaN(c)) traj.push([r, c]);

      const mv = String(row.move_taken || row.move || row.direction || row.action || '').trim().toUpperCase();
      if (['N','S','E','W'].includes(mv[0])) moves.push(mv[0]);

      const sv = String(row.solved || '').toLowerCase();
      if (sv === 'true' || sv === '1') solved = true;
      if (row.efficiency) efficiency = parseFloat(row.efficiency) || efficiency;
      if (row.total_steps) steps = +row.total_steps || steps;
      const legal = String(row.legal || '').toLowerCase();
      if (legal === 'false' || legal === '0') invalid++;
    }

    steps = steps || moves.length || Math.max(0, traj.length - 1);
    const shortest = (mazeSpec && mazeSpec.shortest) || 0;
    if (!efficiency && solved && steps > 0 && shortest > 0) efficiency = shortest / steps;
    if (!solved) efficiency = 0;

    const seen = new Set(); let revisits = 0;
    for (const [r,c] of traj) { const k=`${r},${c}`; if(seen.has(k))revisits++; seen.add(k); }

    return {
      steps, shortest, solved, efficiency,
      invalid_moves: invalid, revisits,
      unique_cells_visited: seen.size,
      coverage: seen.size / ((mazeSpec && mazeSpec.size * mazeSpec.size) || 1),
      trajectory: traj.length ? traj : null,
      moves: moves.length ? moves : null,
    };
  }

  // Main CSV text parser
  function parseCSVText(text, filename, folder) {
    const parsed = parseFilename(filename, folder || '');
    if (!parsed) return Promise.resolve(null);
    const { model, maze, isSmellovision } = parsed;

    return new Promise(resolve => {
      Papa.parse(text.trim(), {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete(res) {
          const rows = res.data;
          if (!rows || !rows.length) { resolve(null); return; }

          // Find matching maze spec for shortest-path reference
          const mazeSpec = (window.MAZE_SPECS || []).find(m => m.name === maze);

          // Detect format: step-by-step vs summary
          const fields = (res.meta.fields || []).map(f => f.toLowerCase().trim());
          const hasPos  = fields.some(f => f === 'row' || f === 'r' || f === 'pos_row');
          const hasStep = fields.includes('step');
          const isStepByStep = rows.length > 1 && (hasPos || hasStep);

          let record;
          if (isStepByStep) {
            record = recordFromSteps(rows, mazeSpec);
          } else {
            // Summary: could be 1 row or multiple (find the one matching this maze)
            let targetRow = rows[0];
            if (rows.length > 1) {
              const match = rows.find(r => {
                const mz = String(r.maze || r.Maze || '').toLowerCase();
                return mz === maze.toLowerCase();
              });
              if (match) targetRow = match;
            }
            record = recordFromRow(targetRow, mazeSpec);
          }

          // Reconstruct trajectory from moves if missing
          if ((!record.trajectory || !record.trajectory.length) && record.moves && record.moves.length && mazeSpec) {
            const parsedMaze = window.parseMaze(mazeSpec);
            record.trajectory = window.trajectoryFromMoves(parsedMaze, record.moves);
          }
          if (!record.trajectory || !record.trajectory.length) {
            if (mazeSpec) {
              const pm = window.parseMaze(mazeSpec);
              record.trajectory = [pm.start.slice()];
            }
          }

          resolve({ model, maze, isSmellovision, record });
        },
        error() { resolve(null); }
      });
    });
  }

  // List all CSVs from both folders via GitHub git tree API
  async function listFromGithub() {
    const url = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('GitHub tree API failed: ' + res.status);
    const json = await res.json();

    const files = [];
    for (const item of (json.tree || [])) {
      if (item.type !== 'blob' || !item.path.toLowerCase().endsWith('.csv')) continue;
      const folder = FOLDERS.find(f => item.path.startsWith(f + '/'));
      if (!folder) continue;
      const name = item.path.slice(folder.length + 1);
      files.push({
        name, folder,
        url: `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${item.path}`,
      });
    }
    return files;
  }

  // Fetch one CSV file
  async function fetchOne(file) {
    const res = await fetch(file.url);
    if (!res.ok) return null;
    const text = await res.text();
    return parseCSVText(text, file.name, file.folder);
  }

  // Load all from GitHub with concurrency
  async function loadAllFromGithub(onProgress) {
    const files = await listFromGithub();
    const baseline = {}, smell = {};
    let done = 0;
    const queue = [...files];

    const worker = async () => {
      while (queue.length) {
        const f = queue.shift();
        try {
          const result = await fetchOne(f);
          if (result && result.model && result.maze) {
            const bucket = result.isSmellovision ? smell : baseline;
            if (!bucket[result.model]) bucket[result.model] = {};
            // Keep latest by filename if duplicate
            const existing = bucket[result.model][result.maze];
            if (!existing || f.name > (existing._fn || '')) {
              bucket[result.model][result.maze] = { ...result.record, _fn: f.name };
            }
          }
        } catch (e) { console.warn('CSV fetch error:', f.name, e); }
        done++;
        if (onProgress) onProgress(done, files.length);
      }
    };

    await Promise.all(Array(6).fill(0).map(worker));
    console.log(`[CSV] Loaded: baseline=${JSON.stringify(Object.fromEntries(Object.entries(baseline).map(([k,v])=>[k,Object.keys(v).length])))} smell=${JSON.stringify(Object.fromEntries(Object.entries(smell).map(([k,v])=>[k,Object.keys(v).length])))}`);
    return { baseline, smell, fileCount: files.length };
  }

  // Load from drag-dropped files
  async function loadFiles(fileList) {
    const baseline = {}, smell = {};
    for (const f of fileList) {
      try {
        const text  = await f.text();
        const folder = f.name.toLowerCase().includes('smell') ? 'smelly_results' : 'results';
        const result = await parseCSVText(text, f.name, folder);
        if (result && result.model && result.maze) {
          const bucket = result.isSmellovision ? smell : baseline;
          if (!bucket[result.model]) bucket[result.model] = {};
          bucket[result.model][result.maze] = result.record;
        }
      } catch(e) { console.warn('File parse error:', f.name, e); }
    }
    return { baseline, smell };
  }

  return { parseCSVText, loadAllFromGithub, loadFiles, parseFilename };

})();
