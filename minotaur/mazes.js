// 15 mazes from condition_b notebook. Each entry: name, size, shortest, ascii.
// ASCII grid is (2*size+1) x (2*size+1). Cells at (2r+1, 2c+1).
window.MAZE_SPECS = [
  { name: '6x6-1', size: 6, shortest: 26, ascii:
`# ### #######
#S  #E      #
### # ##### #
# # # #   # #
# # ### # # #
# #   # # # #
# ### # # # #
# #   # #   #
# # ### ### #
#   #   #   #
# ### ### ###
#     #     #
#############` },
  { name: '6x6-2', size: 6, shortest: 27, ascii:
`# ######### #
#S  #     #E#
### ### # # #
# #   # #   #
# ### # ### #
# #   #   # #
# # ##### ###
# # #   #   #
# # # # ### #
# # # #   # #
# # # ### # #
#     #     #
#############` },
  { name: '6x6-3', size: 6, shortest: 30, ascii:
`# ###########
#S#         #
# ### ##### #
#   #   #   #
### ### # ###
# #   # # # #
# ### # # # #
# #   # # # #
# # ### # # #
#   #   #   #
# ### ##### #
#     #E    #
####### #####` },
  { name: '6x6-4', size: 6, shortest: 24, ascii:
`# ###########
#S      #   #
####### # # #
#     # # # #
# ##### ### #
# #   #   # #
# # # ### # #
#   #   #   #
# ### ##### #
# # #       #
# # #########
#          E#
########### #` },
  { name: '6x6-5', size: 6, shortest: 29, ascii:
`# ###########
#S#   #     #
# # # # # # #
#   # # # # #
##### ### # #
#   #     # #
# ######### #
#           #
# ###########
# #     #  E 
# ### # ### #
#     #     #
#############` },
  { name: '7x7-1', size: 7, shortest: 38, ascii:
`# #############
#S  #         #
### # ####### #
# # #       # #
# # ####### # #
# #       # #E 
# ####### # ###
#         #   #
# ########### #
# #       #   #
# ### ### # # #
#   # # #   # #
### # # ##### #
#     #       #
###############` },
  { name: '7x7-2', size: 7, shortest: 33, ascii:
`# #############
#S#           #
# # ####### # #
# # #       # #
# ### ####### #
# #   #     # #
# # ### # ### #
#   #   # #   #
##### ##### ###
# #         # #
# # ######### #
#   #         #
# ####### ### #
#         #E  #
########### ###` },
  { name: '7x7-3', size: 7, shortest: 33, ascii:
`# ##### #######
#S    #E      #
##### # ##### #
# #   # #     #
# # ### # #####
# #   # #     #
# ### # ##### #
# #   #     # #
# # ##### ### #
#   #   # #   #
# ### # ### # #
#     # #   # #
####### # ### #
#         #   #
###############` },
  { name: '7x7-4', size: 7, shortest: 40, ascii:
`# #############
#S#           #
# ######### # #
#   #       # #
### # ####### #
 E#   #     # #
# ##### ### # #
#     #   #   #
# ####### #####
# #     # #   #
# # ### # # # #
#   #   #   # #
# ### ####### #
#   #         #
###############` },
  { name: '7x7-5', size: 7, shortest: 36, ascii:
`# ### #########
#S#  E#       #
# # ### ##### #
# #   # # #   #
# ### # # # ###
#   #   # #   #
### # ### ### #
# # #       # #
# # ####### # #
# # #   #   # #
# # # # ### # #
#   # #   # # #
# ### ### ### #
#     #       #
###############` },
  { name: '8x8-1', size: 8, shortest: 45, ascii:
`# # #############
#S#E  #   #     #
# ### # # # ### #
# #   # #     # #
# # ### ####### #
# #   # #   #   #
# ### # # # # # #
#   #   # # # # #
### # ### # # # #
#   #     # # # #
# ######### # ###
#     #   # #   #
##### # # ##### #
#   #   # #   # #
# # ##### # # # #
# #         #   #
#################` },
  { name: '8x8-2', size: 8, shortest: 45, ascii:
`# ###############
#S#             #
# ##### ####### #
# #     #     # #
# # ##### ##### #
#   # #     #   #
##### # ### # ###
 E  #   #   # # #
### # ### # # # #
#   # #   # # # #
# # # # ##### # #
# # # # #     # #
# ### # # ##### #
# #   # # #     #
# # ### # ### # #
#     #       # #
#################` },
  { name: '8x8-3', size: 8, shortest: 50, ascii:
`# ###############
#S        #     #
######### # # # #
#   #     # # #E 
# # # ####### ###
# # # #     #   #
# ### # ### ### #
#   # # # #   # #
# # # # # ### # #
# #   # #     # #
# ##### # ##### #
#   #   # #     #
### # ### # ### #
# # # # # #   # #
# # # # # ### # #
#     #       # #
#################` },
  { name: '8x8-4', size: 8, shortest: 39, ascii:
`# ######### #####
#S    #   #E    #
##### # # ##### #
#     # #       #
# ##### ####### #
#   #       #   #
### ### ### #####
# #   # # #     #
# ### # # ##### #
# #   #     #   #
# # ######### ###
# #         #   #
# ######### ### #
#         #     #
# ### ######### #
#   #           #
#################` },
  { name: '8x8-5', size: 8, shortest: 48, ascii:
`# ### ###########
#S  #E      #   #
### ##### # # # #
#   #   # # # # #
# ### # # ### # #
#     # # #   # #
####### # # ### #
#   #   # #   # #
# # # ### # ### #
# #   #     #   #
# ########### # #
#   #         # #
### # ######### #
#   # #       # #
# ### # ##### # #
#     #     #   #
#################` },
];

// Per-maze food destination
window.DESTINATIONS = {
  '6x6-1': { name: "Rosa's Tacos",        emoji: '🌮', awning: '#e86030' },
  '6x6-2': { name: "Creamy Boys",          emoji: '🍦', awning: '#60a8e0' },
  '6x6-3': { name: "The Rusty Mug",        emoji: '🍺', awning: '#8b5e2a' },
  '6x6-4': { name: "Sal's Pizzeria",       emoji: '🍕', awning: '#c03820' },
  '6x6-5': { name: "Cozy Kettle Diner",    emoji: '☕', awning: '#6b4020' },
  '7x7-1': { name: "Breadworks Bakery",    emoji: '🥐', awning: '#c89030' },
  '7x7-2': { name: "Noodle Nook",          emoji: '🍜', awning: '#c06820' },
  '7x7-3': { name: "Sunrise Diner",        emoji: '🧇', awning: '#e09020' },
  '7x7-4': { name: "Harbor Sushi",         emoji: '🍣', awning: '#1a6080' },
  '7x7-5': { name: "Big Benny's Burgers",  emoji: '🍔', awning: '#8b4010' },
  '8x8-1': { name: "Pappy's Smokehouse",   emoji: '🥩', awning: '#6b2010' },
  '8x8-2': { name: "Sugar Shack Donuts",   emoji: '🍩', awning: '#c04878' },
  '8x8-3': { name: "The Wrap Spot",        emoji: '🌯', awning: '#207840' },
  '8x8-4': { name: "Garden & Fork",        emoji: '🥗', awning: '#3a6820' },
  '8x8-5': { name: "Falafel Corner",       emoji: '🧆', awning: '#b07820' },
};

// Parse ASCII maze into a cell graph.
// Returns { name, size, shortest, start:[r,c], end:[r,c],
//           walls: 2D array per cell of {n,s,e,w} (true = wall) }
window.parseMaze = function(spec) {
  const lines = spec.ascii.split('\n');
  const size = spec.size;
  const walls = [];
  let start = null, end = null;
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      const ar = 2 * r + 1, ac = 2 * c + 1;
      const ch = lines[ar][ac];
      if (ch === 'S') start = [r, c];
      if (ch === 'E') end = [r, c];
      // Wall north: row 2r, col 2c+1.  South: row 2r+2, col 2c+1.
      // West: row 2r+1, col 2c.        East: row 2r+1, col 2c+2.
      const cellW = {
        n: lines[2*r][2*c+1] === '#',
        s: lines[2*r+2][2*c+1] === '#',
        w: lines[2*r+1][2*c] === '#',
        e: lines[2*r+1][2*c+2] === '#',
      };
      // Treat exterior openings as walls (per legal_moves logic — agent can't exit)
      if (r === 0) cellW.n = true;
      if (r === size-1) cellW.s = true;
      if (c === 0) cellW.w = true;
      if (c === size-1) cellW.e = true;
      row.push(cellW);
    }
    walls.push(row);
  }
  return { name: spec.name, size, shortest: spec.shortest, start, end, walls, ascii: spec.ascii };
};

// BFS shortest path from start to end -> array of [r,c]
window.shortestPath = function(maze) {
  const { size, start, end, walls } = maze;
  const key = ([r,c]) => r*size+c;
  const prev = new Map();
  const seen = new Set([key(start)]);
  const q = [start];
  while (q.length) {
    const cur = q.shift();
    if (cur[0] === end[0] && cur[1] === end[1]) break;
    const [r,c] = cur;
    const w = walls[r][c];
    const nbrs = [];
    if (!w.n && r > 0) nbrs.push([r-1,c]);
    if (!w.s && r < size-1) nbrs.push([r+1,c]);
    if (!w.e && c < size-1) nbrs.push([r,c+1]);
    if (!w.w && c > 0) nbrs.push([r,c-1]);
    for (const n of nbrs) {
      if (!seen.has(key(n))) {
        seen.add(key(n));
        prev.set(key(n), cur);
        q.push(n);
      }
    }
  }
  // Reconstruct
  const path = [];
  let cur = end;
  while (cur) {
    path.unshift(cur);
    if (cur[0]===start[0] && cur[1]===start[1]) break;
    cur = prev.get(key(cur));
    if (!cur) return null;
  }
  return path;
};

// Build trajectory from moves array given starting position and walls
window.trajectoryFromMoves = function(maze, moves) {
  const traj = [maze.start.slice()];
  let [r, c] = maze.start;
  const dirs = { N: [-1,0], S: [1,0], E: [0,1], W: [0,-1] };
  for (const m of moves) {
    const d = dirs[m];
    if (!d) continue;
    const w = maze.walls[r] && maze.walls[r][c];
    if (!w) break;
    if (m === 'N' && w.n) continue;
    if (m === 'S' && w.s) continue;
    if (m === 'E' && w.e) continue;
    if (m === 'W' && w.w) continue;
    r += d[0]; c += d[1];
    if (r < 0 || c < 0 || r >= maze.size || c >= maze.size) break;
    traj.push([r,c]);
  }
  return traj;
};
