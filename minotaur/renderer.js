// Cozy-town maze renderer — draws an ASCII maze as a top-down neighborhood.
// Walls = stone buildings. Paths = warm cobblestone. Start = house. End = food stall.

window.MazeRenderer = (function(){
  // Deterministic pseudo-random per cell so textures are stable.
  function hashRand(r, c, salt = 0) {
    let h = (r * 73856093) ^ (c * 19349663) ^ (salt * 83492791);
    h = (h ^ (h >>> 13)) * 1274126177;
    h = h ^ (h >>> 16);
    return ((h >>> 0) % 1000) / 1000;
  }

  // Palette
  const COL = {
    sky: '#1a140e',           // outer bg
    pathLight: '#d8c8a8',
    pathDark: '#cdb88f',
    pathGrout: '#a89570',
    pebble: '#9d8a64',
    wallTop: '#8b755e',
    wallSide: '#6b5840',
    wallDark: '#4a3c2a',
    wallSeam: '#332919',
    houseRoof: '#7a3a2a',
    houseRoofHi: '#a05038',
    houseWall: '#f0e2c4',
    houseDoor: '#5a3820',
  };

  function drawPathCell(ctx, x, y, s, r, c) {
    const checker = (r + c) % 2 === 0;
    ctx.fillStyle = checker ? COL.pathLight : COL.pathDark;
    ctx.fillRect(x, y, s, s);
    // grout lines
    ctx.strokeStyle = COL.pathGrout;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(x + s/2, y); ctx.lineTo(x + s/2, y + s);
    ctx.moveTo(x, y + s/2); ctx.lineTo(x + s, y + s/2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    // pebbles
    for (let i = 0; i < 3; i++) {
      const rx = hashRand(r, c, i*7) * (s - 6) + x + 3;
      const ry = hashRand(r, c, i*7+1) * (s - 6) + y + 3;
      const rs = 0.7 + hashRand(r, c, i*7+2) * 0.6;
      ctx.fillStyle = COL.pebble;
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.arc(rx, ry, rs, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawWallSegment(ctx, x, y, w, h, r, c) {
    // Stone building face
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, COL.wallTop);
    grad.addColorStop(1, COL.wallSide);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    // top edge highlight
    ctx.fillStyle = '#a08a6c';
    ctx.fillRect(x, y, w, Math.max(1, h * 0.12));
    // bottom shadow
    ctx.fillStyle = COL.wallDark;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x, y + h - Math.max(1, h * 0.15), w, Math.max(1, h * 0.15));
    ctx.globalAlpha = 1;
    // brick seams (subtle)
    ctx.strokeStyle = COL.wallSeam;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 0.5;
    const seamCount = Math.max(2, Math.floor(Math.max(w,h) / 12));
    for (let i = 1; i < seamCount; i++) {
      const sy = y + (i / seamCount) * h;
      ctx.beginPath(); ctx.moveTo(x, sy); ctx.lineTo(x + w, sy); ctx.stroke();
    }
    // small windows on larger blocks
    if (w > 30 && h > 30 && hashRand(r, c, 99) < 0.4) {
      const wx = x + w/2 - 4 + (hashRand(r, c, 17)-0.5)*6;
      const wy = y + h/2 - 4 + (hashRand(r, c, 23)-0.5)*6;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = '#3a3020';
      ctx.fillRect(wx, wy, 8, 8);
      ctx.fillStyle = '#e8c060';
      ctx.fillRect(wx+1.5, wy+1.5, 5, 5);
    }
    ctx.globalAlpha = 1;
  }

  function drawHouse(ctx, x, y, s) {
    // Cozy little house at start cell.
    const cx = x + s/2, cy = y + s/2;
    const w = s * 0.62, h = s * 0.55;
    const x0 = cx - w/2, y0 = cy - h/2 + 4;
    // walls
    ctx.fillStyle = COL.houseWall;
    ctx.fillRect(x0, y0, w, h);
    // roof
    ctx.fillStyle = COL.houseRoof;
    ctx.beginPath();
    ctx.moveTo(x0 - 3, y0);
    ctx.lineTo(cx, y0 - h*0.55);
    ctx.lineTo(x0 + w + 3, y0);
    ctx.closePath();
    ctx.fill();
    // roof highlight
    ctx.fillStyle = COL.houseRoofHi;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(x0 - 3, y0);
    ctx.lineTo(cx, y0 - h*0.55);
    ctx.lineTo(cx, y0);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    // door
    ctx.fillStyle = COL.houseDoor;
    ctx.fillRect(cx - 3, y0 + h - 8, 6, 8);
    // window
    ctx.fillStyle = '#3a3020';
    ctx.fillRect(x0 + 3, y0 + 4, 5, 5);
    ctx.fillStyle = '#e8c060';
    ctx.fillRect(x0 + 4, y0 + 5, 3, 3);
    // label
    ctx.fillStyle = '#fff8e0';
    ctx.font = `600 ${Math.max(8, s*0.16)}px ui-sans-serif, system-ui`;
    ctx.textAlign = 'center';
    ctx.fillText('home', cx, y + s - 3);
  }

  function drawStall(ctx, x, y, s, dest) {
    const cx = x + s/2, cy = y + s/2;
    const w = s * 0.78, h = s * 0.5;
    const x0 = cx - w/2, y0 = cy - h/2 + 4;
    // counter
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(x0, y0 + h*0.55, w, h*0.45);
    // awning
    ctx.fillStyle = dest.awning;
    ctx.beginPath();
    ctx.moveTo(x0 - 3, y0 + 6);
    ctx.lineTo(x0 + w + 3, y0 + 6);
    ctx.lineTo(x0 + w + 3, y0);
    ctx.lineTo(x0 - 3, y0);
    ctx.closePath();
    ctx.fill();
    // awning stripes
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    const stripes = 5;
    for (let i = 0; i < stripes; i+=2) {
      ctx.fillRect(x0 - 3 + (i / stripes) * (w + 6), y0, (w + 6)/stripes, 6);
    }
    // emoji icon
    ctx.font = `${Math.max(14, s*0.42)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dest.emoji, cx, cy + 4);
    ctx.textBaseline = 'alphabetic';
    // smell wisps
    ctx.strokeStyle = 'rgba(255,240,180,0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const sx = cx - 6 + i*6;
      ctx.moveTo(sx, y0 - 2);
      ctx.bezierCurveTo(sx-3, y0-6, sx+3, y0-10, sx, y0-14);
      ctx.stroke();
    }
    // label
    ctx.fillStyle = '#fff8e0';
    ctx.font = `600 ${Math.max(7, s*0.13)}px ui-sans-serif, system-ui`;
    ctx.textAlign = 'center';
    const short = dest.name.length > 14 ? dest.name.slice(0, 13) + '…' : dest.name;
    ctx.fillText(short, cx, y + s - 2);
  }

  // Main render — draws maze layout + start + end, but NOT trails or characters.
  function renderBase(canvas, maze, cellPx) {
    const ctx = canvas.getContext('2d');
    const size = maze.size;
    const total = size * cellPx;
    canvas.width = total;
    canvas.height = total;

    // background
    ctx.fillStyle = '#1f1810';
    ctx.fillRect(0, 0, total, total);

    // Pass 1: path cells everywhere
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        drawPathCell(ctx, c*cellPx, r*cellPx, cellPx, r, c);
      }
    }

    // Pass 2: walls between cells (interior walls only — render as thick segments)
    const wt = Math.max(6, cellPx * 0.22); // wall thickness
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const w = maze.walls[r][c];
        const x = c*cellPx, y = r*cellPx;
        // North wall
        if (w.n && r > 0) {
          drawWallSegment(ctx, x, y - wt/2, cellPx, wt, r, c);
        }
        // West wall
        if (w.w && c > 0) {
          drawWallSegment(ctx, x - wt/2, y, wt, cellPx, r, c);
        }
      }
    }

    // Pass 3: outer border as buildings
    drawWallSegment(ctx, -wt/2, -wt/2, total + wt, wt, 0, 0);
    drawWallSegment(ctx, -wt/2, total - wt/2, total + wt, wt, size, 0);
    drawWallSegment(ctx, -wt/2, -wt/2, wt, total + wt, 0, 0);
    drawWallSegment(ctx, total - wt/2, -wt/2, wt, total + wt, 0, size);

    // Start and End
    const sx = maze.start[1] * cellPx, sy = maze.start[0] * cellPx;
    const ex = maze.end[1] * cellPx, ey = maze.end[0] * cellPx;
    drawHouse(ctx, sx, sy, cellPx);
    const dest = window.DESTINATIONS[maze.name] || { name: maze.name, emoji: '🏠', awning: '#c8a030' };
    drawStall(ctx, ex, ey, cellPx, dest);
  }

  // Draw a model trail on top of base canvas
  function drawTrail(ctx, traj, cellPx, color, opacity = 1, upToStep = -1) {
    if (!traj || traj.length < 2) return;
    const stop = upToStep < 0 ? traj.length : Math.min(upToStep + 1, traj.length);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, cellPx * 0.12);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < stop; i++) {
      const [r,c] = traj[i];
      const x = c*cellPx + cellPx/2;
      const y = r*cellPx + cellPx/2;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Draw shortest-path "ideal" trail (dashed)
  function drawIdealPath(ctx, path, cellPx) {
    if (!path || path.length < 2) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,250,210,0.4)';
    ctx.lineWidth = Math.max(2, cellPx * 0.08);
    ctx.setLineDash([4, 4]);
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
      const [r,c] = path[i];
      const x = c*cellPx + cellPx/2;
      const y = r*cellPx + cellPx/2;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Draw minotaur token at trajectory position. opts: { subIndex, subTotal, scale, finished }
  function drawMinotaur(ctx, modelKey, pos, cellPx, opts = {}) {
    const img = window.minotaurTokens[modelKey];
    const [r, c] = pos;
    const x = c*cellPx, y = r*cellPx;
    const scale = opts.scale || 1;
    const subTotal = opts.subTotal || 1;
    const subIndex = opts.subIndex || 0;
    // Sub-cell offset: arrange up to N tokens around the cell center
    let dx = 0, dy = 0;
    if (subTotal > 1) {
      const ang = (subIndex / subTotal) * Math.PI * 2 - Math.PI/2;
      const rad = cellPx * 0.18;
      dx = Math.cos(ang) * rad;
      dy = Math.sin(ang) * rad;
    }
    const tokenSize = cellPx * 0.78 * scale;
    const cx = x + cellPx/2 + dx;
    const cy = y + cellPx/2 + dy;
    const tx = cx - tokenSize/2;
    const ty = cy - tokenSize/2;
    // Token glow ring (color-coded)
    const m = window.MINOTAURS[modelKey];
    if (m) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, tokenSize/2 + 2, 0, Math.PI*2);
      ctx.fillStyle = m.fur;
      ctx.globalAlpha = 0.25;
      ctx.fill();
      ctx.restore();
      // colored ring border
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, tokenSize/2, 0, Math.PI*2);
      ctx.strokeStyle = m.fur;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
    if (img && img.complete) {
      ctx.drawImage(img, tx, ty, tokenSize, tokenSize);
    } else {
      ctx.fillStyle = m ? m.fur : '#fff';
      ctx.beginPath();
      ctx.arc(cx, cy, tokenSize*0.4, 0, Math.PI*2);
      ctx.fill();
    }
    // finished crown
    if (opts.finished) {
      ctx.save();
      ctx.fillStyle = '#ffd24a';
      ctx.font = `${cellPx*0.32}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText('★', cx, ty - 2);
      ctx.restore();
    }
  }

  return { renderBase, drawTrail, drawIdealPath, drawMinotaur };
})();
