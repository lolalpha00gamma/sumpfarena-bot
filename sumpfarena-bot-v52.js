/* sumpfarena-bot-v48.js
 * GENERATED from sumpfarena-sim brain modules (kind=v48).
 * Do not hand-edit policy here; change brain.js and re-run build-bundle.js.
 */
(function () {
  "use strict";
  var TOP = window;
  function alreadyRunningAny(w) {
    if (!w) return false;
    if (w.__SB_RUNNING_ANY) return true;
    try {
      var tm = w.__SB_TIMERS;
      if (tm && (tm.raf || tm.ui || tm.ov)) return true;
    } catch (eA) {}
    try {
      if (w.__SB && w.__SB.state && w.__SB.state !== "stopped" && !/^stopped/.test(w.__SB.state)) return true;
    } catch (eB) {}
    return false;
  }
  try {
    if (alreadyRunningAny(TOP) || (TOP.top && TOP.top !== TOP && alreadyRunningAny(TOP.top))) {
      try { console.log("[SB] already running, skip"); } catch (eS) {}
      return;
    }
  } catch (e0) {}
  try { TOP.__SB_RUNNING_ANY = 1; } catch (e0b) {}
  try { if (TOP.top && TOP.top !== TOP) TOP.top.__SB_RUNNING_ANY = 1; } catch (e0c) {}
  try { TOP.__SB_INSTANCE = "48"; } catch (e0d) {}
  try { if (TOP.top && TOP.top !== TOP) TOP.top.__SB_INSTANCE = "48"; } catch (e0e) {}
  var GEN = (TOP.__SB_GEN || 0) + 1;
  try { TOP.__SB_GEN = GEN; } catch (e) {}
  try { if (TOP.top && TOP.top !== TOP) TOP.top.__SB_GEN = GEN; } catch (e2) {}
var __cjs = {};
function __def(id, fn) { __cjs[id] = { fn: fn, inited: false, mod: { exports: {} } }; }
function __require(id) {
  id = String(id).replace(/^\.\//, "");
  var rec = __cjs[id];
  if (!rec) throw new Error("bundle missing module " + id);
  if (!rec.inited) {
    rec.inited = true;
    rec.fn(rec.mod.exports, rec.mod, __require);
  }
  return rec.mod.exports;
}
__def("grid", function (exports, module, require) {
"use strict";

const walk = {
  "cell_size": 3,
  "grid": {
    "width": 45,
    "height": 45,
    "origin": -67.5,
    "index_formula": "floor((x+67.5)/3)"
  },
  "player_walkable_cell_centers": [
    {
      "x": 0.0,
      "z": -36.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": -36.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -33.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": -33.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": -30.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": -30.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -30.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": -30.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": -30.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": -21.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": 21.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": 27.0,
      "z": -27.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": -24.0,
      "logic": "SPAWNPOWERUP"
    },
    {
      "x": -21.0,
      "z": -24.0,
      "logic": "TRAPSPIKES"
    },
    {
      "x": -18.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": -15.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": -9.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": 9.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": 15.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": 18.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": 21.0,
      "z": -24.0,
      "logic": "TRAPSPIKES"
    },
    {
      "x": 24.0,
      "z": -24.0,
      "logic": "SPAWNPOWERUP"
    },
    {
      "x": 27.0,
      "z": -24.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": -21.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": -21.0,
      "logic": "TRAPSPIKES"
    },
    {
      "x": -21.0,
      "z": -21.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": -21.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": -21.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -21.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": -21.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": -21.0,
      "logic": null
    },
    {
      "x": 21.0,
      "z": -21.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": -21.0,
      "logic": "TRAPSPIKES"
    },
    {
      "x": 27.0,
      "z": -21.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": -18.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -18.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": -18.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": -15.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -15.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": -15.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": -9.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": 9.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": -12.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": -9.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": -9.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": -9.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -9.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": -9.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": -9.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": -9.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": 27.0,
      "z": -6.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": -21.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": -9.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": 9.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": 21.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": 27.0,
      "z": -3.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": 0.0,
      "logic": "SPAWNHEALTHPACK"
    },
    {
      "x": -21.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": -18.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": -15.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": -9.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": 0.0,
      "logic": "START"
    },
    {
      "x": 3.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": 9.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": 15.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": 18.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": 21.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": 0.0,
      "logic": "SPAWNHEALTHPACK"
    },
    {
      "x": 27.0,
      "z": 0.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": -21.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": -9.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": 9.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": 21.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": 27.0,
      "z": 3.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": 27.0,
      "z": 6.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": 9.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": 9.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": 9.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": 9.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": 9.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": 9.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": 9.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": -9.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": 9.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": 12.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": 15.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": 15.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": 15.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": 18.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": 18.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": 18.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": 21.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": 21.0,
      "logic": "TRAPSPIKES"
    },
    {
      "x": -21.0,
      "z": 21.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": 21.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": 21.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": 21.0,
      "logic": null
    },
    {
      "x": 21.0,
      "z": 21.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": 21.0,
      "logic": "TRAPSPIKES"
    },
    {
      "x": 27.0,
      "z": 21.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": 24.0,
      "logic": "SPAWNPOWERUP"
    },
    {
      "x": -21.0,
      "z": 24.0,
      "logic": "TRAPSPIKES"
    },
    {
      "x": -18.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": -15.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": -12.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": -9.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": 24.0,
      "logic": "SPAWNHEALTHPACK"
    },
    {
      "x": 3.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": 9.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": 12.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": 15.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": 18.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": 21.0,
      "z": 24.0,
      "logic": "TRAPSPIKES"
    },
    {
      "x": 24.0,
      "z": 24.0,
      "logic": "SPAWNPOWERUP"
    },
    {
      "x": 27.0,
      "z": 24.0,
      "logic": null
    },
    {
      "x": -27.0,
      "z": 27.0,
      "logic": null
    },
    {
      "x": -24.0,
      "z": 27.0,
      "logic": null
    },
    {
      "x": -21.0,
      "z": 27.0,
      "logic": null
    },
    {
      "x": -6.0,
      "z": 27.0,
      "logic": null
    },
    {
      "x": -3.0,
      "z": 27.0,
      "logic": null
    },
    {
      "x": 0.0,
      "z": 27.0,
      "logic": null
    },
    {
      "x": 3.0,
      "z": 27.0,
      "logic": null
    },
    {
      "x": 6.0,
      "z": 27.0,
      "logic": null
    },
    {
      "x": 21.0,
      "z": 27.0,
      "logic": null
    },
    {
      "x": 24.0,
      "z": 27.0,
      "logic": null
    },
    {
      "x": 27.0,
      "z": 27.0,
      "logic": null
    }
  ],
  "aabb_centers": {
    "xmin": -27.0,
    "xmax": 27.0,
    "zmin": -36.0,
    "zmax": 27.0
  },
  "aabb_extents": {
    "xmin": -28.5,
    "xmax": 28.5,
    "zmin": -37.5,
    "zmax": 28.5
  }
};
const ORIGIN = -67.5;
const CELL = 3;

const walkable = new Set();
for (const c of walk.player_walkable_cell_centers) {
  walkable.add(c.x.toFixed(1) + "," + c.z.toFixed(1));
}

function cellIndex(x) {
  return Math.floor((x - ORIGIN) / CELL);
}
function cellCenter(ix) {
  return CELL * ix + ORIGIN + CELL / 2;
}
function cellOf(x, z) {
  const ix = cellIndex(x), iz = cellIndex(z);
  return [cellCenter(ix), cellCenter(iz), ix, iz];
}
function isPb(x, z) {
  const c = cellOf(x, z);
  return walkable.has(c[0].toFixed(1) + "," + c[1].toFixed(1));
}
function hasNeighbor(cx, cz, dx, dz) {
  return walkable.has((cx + dx).toFixed(1) + "," + (cz + dz).toFixed(1));
}
function isNarrowPlank(cx, cz) {
  // 1-cell-wide: no lateral neighbour along the minor axis
  const horiz = hasNeighbor(cx, cz, 3, 0) || hasNeighbor(cx, cz, -3, 0);
  const vert = hasNeighbor(cx, cz, 0, 3) || hasNeighbor(cx, cz, 0, -3);
  if (horiz && !vert) return "h"; // travel along x, narrow in z (z=±24 lanes)
  if (vert && !horiz) return "v"; // travel along z, narrow in x (x=±24 lanes)
  return null;
}


const CENTERS = [];
for (const key of walkable) {
  const [x, z] = key.split(",").map(Number);
  CENTERS.push([x, z]);
}
const N4D = [[3, 0], [-3, 0], [0, 3], [0, -3]];
function neighbors4(cx, cz) {
  const out = [];
  for (const d of N4D) {
    const nx = cx + d[0], nz = cz + d[1];
    if (walkable.has(nx.toFixed(1) + "," + nz.toFixed(1))) out.push([nx, nz]);
  }
  return out;
}
function keyOf(cx, cz) { return cx.toFixed(1) + "," + cz.toFixed(1); }

// Game Pa()/T(): 8-connected, diagonals cost 1.4 and only if both
// adjacent cardinals are walkable (no corner-cutting through solids).
function neighbors8(cx, cz) {
  const out = [];
  const card = {};
  for (const d of N4D) {
    const nx = cx + d[0], nz = cz + d[1];
    const ok = walkable.has(nx.toFixed(1) + "," + nz.toFixed(1));
    card[d[0] + "," + d[1]] = ok;
    if (ok) out.push([nx, nz, 1]);
  }
  for (const [dx, dz] of [[3, 3], [3, -3], [-3, 3], [-3, -3]]) {
    if (card[dx + ",0"] && card["0," + dz] && walkable.has((cx + dx).toFixed(1) + "," + (cz + dz).toFixed(1))) {
      out.push([cx + dx, cz + dz, 1.4]);
    }
  }
  return out;
}

module.exports = { walkable, cellOf, cellIndex, cellCenter, isPb, isNarrowPlank, hasNeighbor, CELL, ORIGIN, CENTERS, neighbors4, neighbors8, N4D, keyOf };


});

__def("ring", function (exports, module, require) {
"use strict";

const PLAN_PAIRS = "24,0,24,-3,24,-6,24,-9,24,-12,24,-15,24,-18,24,-21,24,-24,21,-24,18,-24,15,-24,12,-24,9,-24,6,-24,3,-24,0,-24,-3,-24,-6,-24,-9,-24,-12,-24,-15,-24,-18,-24,-21,-24,-24,-24,-24,-21,-24,-18,-24,-15,-24,-12,-24,-9,-24,-6,-24,-3,-24,0,-24,3,-24,6,-24,9,-24,12,-24,15,-24,18,-24,21,-24,24,-21,24,-18,24,-15,24,-12,24,-9,24,-6,24,-3,24,0,24,3,24,6,24,9,24,12,24,15,24,18,24,21,24,24,24,24,21,24,18,24,15,24,12,24,9,24,6,24,3".split(",");
const PLAN_TAGS = "noodle,path,path,path,path,path,path,spike,blade,spike,path,path,path,path,path,path,path,path,path,path,path,path,path,spike,blade,spike,path,path,path,path,path,path,noodle,path,path,path,path,path,path,spike,blade,spike,path,path,path,path,dart,path,noodle,path,dart,path,path,path,path,spike,blade,spike,path,path,path,path,path,path".split(",");

const RING = [];
for (let i = 0; i < PLAN_PAIRS.length; i += 2) {
  RING.push([+PLAN_PAIRS[i], +PLAN_PAIRS[i + 1], PLAN_TAGS[i / 2] || "path"]);
}

function ringCell(i) {
  const n = RING.length;
  return RING[(((i % n) + n) % n)];
}

function ringIndexNear(x, z) {
  let best = 0, bestD = 1e9;
  for (let i = 0; i < RING.length; i++) {
    const d = Math.hypot(RING[i][0] - x, RING[i][1] - z);
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

module.exports = { RING, ringCell, ringIndexNear };

});

__def("physics", function (exports, module, require) {
"use strict";

const { isPb } = require("grid");

// Exact game model (app.beautified.js k.te):
//   fe.setFromAxisAngle(Y, 0.0174533 * -(ka - 90 + k.level.Ka.rotation.y))
//   forward = (0,0,1) applied to fe
//   delta = forward * dt * k.Ah
// k.Ah = 8. No acceleration / inertia; heading is instant with keys.
// k.level.Ka.rotation.y = k.S.Tc(5) = 5° in RADIANS (~0.087266), then added
// into a *degree* expression — effective extra yaw is only ~0.087°, not 5°.
const SPEED = 8;
const YAW_RAD = 5 * Math.PI / 180;
const DEG2RAD = 0.0174533;
const DT = 1 / 60;
const KB_LERP = 5; // T.lerp(0, 5*dt)
const PLAYER_KB = 9;
const PLAYER_IFRAMES = 1;

function kaFromKeys(keys) {
  const up = !!keys.ArrowUp, down = !!keys.ArrowDown, left = !!keys.ArrowLeft, right = !!keys.ArrowRight;
  if (up && left) return 225;
  if (up && right) return 315;
  if (down && left) return 125; // game typo (not 135)
  if (down && right) return 45;
  if (up && !down) return 270;
  if (down && !up) return 90;
  if (left && !right) return 180;
  if (right && !left) return 0;
  return null;
}

function worldDirFromKa(ka, yawRad) {
  if (yawRad == null) yawRad = YAW_RAD;
  const theta = DEG2RAD * -(ka - 90 + yawRad);
  return [Math.sin(theta), Math.cos(theta)];
}

function lerpKnockback(Tx, Tz, dt) {
  const a = Math.min(1, KB_LERP * dt);
  return [Tx * (1 - a), Tz * (1 - a)];
}

function step(px, pz, keys, dt, knock) {
  const ka = kaFromKeys(keys);
  let vx = 0, vz = 0;
  if (ka != null) {
    const d = worldDirFromKa(ka);
    vx = d[0] * SPEED;
    vz = d[1] * SPEED;
  }
  let Tx = 0, Tz = 0;
  if (knock) {
    vx += knock.Tx || 0;
    vz += knock.Tz || 0;
    const L = lerpKnockback(knock.Tx || 0, knock.Tz || 0, dt);
    Tx = L[0]; Tz = L[1];
  }
  const nx = px + vx * dt;
  const nz = pz + vz * dt;
  const fallen = !isPb(nx, nz);
  return { x: nx, z: nz, ka, vx, vz, fallen, Tx, Tz };
}

module.exports = {
  SPEED, YAW_RAD, DEG2RAD, DT, kaFromKeys, worldDirFromKa, step,
  lerpKnockback, PLAYER_KB, PLAYER_IFRAMES, KB_LERP
};

});

__def("traps", function (exports, module, require) {
"use strict";

const { cellOf, isPb } = require("grid");

// Verified in app.beautified.js logic_trapSpikes / logic_trapDart and FINDINGS.md.
const SPIKE_PADS = [
  [24, -21], [21, -24], [-21, -24], [-24, -21],
  [-24,  21], [-21,  24], [ 21,  24], [ 24,  21]
];
const SPIKE_SET = new Set(SPIKE_PADS.map((p) => p[0] + "," + p[1]));
// Player Db(pad, pad, 1.5): hits when distanceTo(pad) < 1 + 1.5 = 2.5, and
// the floor-cell's sb is that trap (isSpikeCell). ya window is tick 900-1000.
const SPIKE_HIT_R = 2.5;
const SPIKE_SAFE_R = 3.3; // 2.5 + one 0.8 hitch step
// Pedestals are Xa (not walkable). Code-literal muzzle is local +Z after y = _z+π,
// which points outward and therefore crosses the outer ring on three sides.
const DART_PEDESTALS = [
  { x:  6, z: 21, fx:  0, fz:  1 },
  { x: -6, z: 21, fx:  0, fz:  1 },
  { x: -21, z: -6, fx: -1, fz:  0 },
  { x: -21, z:  6, fx: -1, fz:  0 },
  { x:  21, z:  6, fx:  1, fz:  0 },
  { x:  21, z: -6, fx:  1, fz:  0 }
];
const DART_XA = new Set(DART_PEDESTALS.map((p) => p.x + "," + p.z));

function onDartLane(x, z) {
  // North z>+18 at x=±6, east x>+18 at z=±6, west x<-18 at z=±6. No south dart.
  return (Math.abs(Math.abs(x) - 6) < 1.8 && z > 18) ||
    (Math.abs(Math.abs(z) - 6) < 1.8 && Math.abs(x) > 18);
}


const TICK_SPEED = 400;
const PERIOD = 2.5;
const SPIKE_UP_TICK = 900;
const SPIKE_END_TICK = 1000;
const DART_FIRE_TICK = 500;
const DART_SPEED = 20;
const DART_RADIUS = 1.55;
const DART_LIFE = 5;

function isSpikeCell(x, z) {
  const c = cellOf(x, z);
  return SPIKE_SET.has(c[0] + "," + c[1]);
}

function spikePadOf(x, z) {
  const c = cellOf(x, z);
  return SPIKE_SET.has(c[0] + "," + c[1]) ? [c[0], c[1]] : null;
}
function nearestPad(x, z) {
  let best = null, bd = 99;
  for (const p of SPIKE_PADS) {
    const d = Math.hypot(p[0] - x, p[1] - z);
    if (d < bd) { bd = d; best = p; }
  }
  return { pad: best, dist: bd };
}
function inSpikeRadius(x, z, r) {
  return nearestPad(x, z).dist < (r == null ? SPIKE_HIT_R : r);
}
function isXaCell(x, z) {
  const c = cellOf(x, z);
  return DART_XA.has(c[0] + "," + c[1]);
}

function tickOf(t, timeScale) {
  // tick starts at 0 on round start (k.kf). tick += dt * 400 * timeScale (Zeitklingen).
  // Spike: reset to 0 at 1000. Dart: fire at 500, reset+rearm at 1000.
  const raw = (t * TICK_SPEED * (timeScale == null ? 1 : timeScale));
  return raw - Math.floor(raw / 1000) * 1000;
}

function spikesUp(t, timeScale) {
  const tick = tickOf(t, timeScale);
  return tick >= SPIKE_UP_TICK && tick < SPIKE_END_TICK;
}

function safeTimeRemaining(t, timeScale) {
  const tick = tickOf(t, timeScale);
  if (tick >= SPIKE_UP_TICK) return 0;
  return (SPIKE_UP_TICK - tick) / TICK_SPEED;
}

function timeUntilUp(t, timeScale) {
  const tick = tickOf(t, timeScale);
  if (tick >= SPIKE_UP_TICK) return 0;
  return (SPIKE_UP_TICK - tick) / TICK_SPEED;
}

function spikeWindowHits(t, enterEta, leaveEta, timeScale) {
  const tick = tickOf(t, timeScale);
  const a = tick + Math.max(0, enterEta) * TICK_SPEED;
  const b = tick + Math.max(enterEta, leaveEta) * TICK_SPEED;
  for (let w = Math.floor(a / 1000) * 1000 + SPIKE_UP_TICK; w < b; w += 1000) {
    if (b > w && a < w + 100) return true;
  }
  return false;
}

function createTraps() {
  const darts = [];
  let dartArmed = true;

  function reset() {
    darts.length = 0;
    dartArmed = true;
  }

  function update(t, dt, timeScale) {
    const ts = timeScale == null ? 1 : timeScale;
    const tick = tickOf(t, ts);
    // Fire once per cycle when tick crosses 500 with ya armed. We detect by
    // previous-tick approximation: after fire, ya=false until reset at 1000.
    if (tick >= SPIKE_END_TICK - 1e-6) dartArmed = true;
    if (dartArmed && tick >= DART_FIRE_TICK && tick < DART_FIRE_TICK + TICK_SPEED * dt * ts + 1) {
      dartArmed = false;
      for (const p of DART_PEDESTALS) {
        darts.push({ x: p.x, z: p.z, fx: p.fx, fz: p.fz, life: DART_LIFE, speed: DART_SPEED });
      }
    }
    for (let i = darts.length - 1; i >= 0; i--) {
      const d = darts[i];
      d.x += d.fx * d.speed * dt * ts;
      d.z += d.fz * d.speed * dt * ts;
      d.life -= dt * ts;
      if (d.life <= 0) darts.splice(i, 1);
    }
  }

  function hitPlayer(px, pz) {
    for (let i = darts.length - 1; i >= 0; i--) {
      const d = darts[i];
      if (Math.hypot(d.x - px, d.z - pz) < DART_RADIUS) {
        darts.splice(i, 1);
        return d;
      }
    }
    return null;
  }

  function hitEnemy(ex, ez, radius) {
    const r = DART_RADIUS + 0.5 * (radius || 1);
    for (let i = darts.length - 1; i >= 0; i--) {
      const d = darts[i];
      if (Math.hypot(d.x - ex, d.z - ez) < r) {
        darts.splice(i, 1);
        return d;
      }
    }
    return null;
  }

  function nearest(px, pz) {
    let best = 99, hit = null;
    for (const d of darts) {
      const dist = Math.hypot(d.x - px, d.z - pz);
      if (dist < best) { best = dist; hit = d; }
    }
    return { dist: best, dart: hit };
  }

  function threatAt(x, z, eta, t, timeScale) {
    eta = eta || 0;
    for (const d of darts) {
      const px = d.x + d.fx * d.speed * eta;
      const pz = d.z + d.fz * d.speed * eta;
      const along = (x - px) * d.fx + (z - pz) * d.fz;
      const side = Math.abs((x - px) * (-d.fz) + (z - pz) * d.fx);
      if (along > -2 && along < 8 && side < 2.0) return true;
    }
    const tick = tickOf(t, timeScale) % 1000;
    const fireIn = ((DART_FIRE_TICK - tick + 1000) % 1000) / TICK_SPEED;
    const sinceFire = tick >= DART_FIRE_TICK ? (tick - DART_FIRE_TICK) / TICK_SPEED : 99;
    // Upcoming fire OR in-flight dart already covering the ring (~0.15s travel, 1.55 radius).
    if (onDartLane(x, z) && (fireIn < 0.40 + eta || sinceFire < 0.40 + eta)) return true;
    return false;
  }

  return {
    reset, update, hitPlayer, hitEnemy, nearest, threatAt, onDartLane,
    darts, tickOf: (t, ts) => tickOf(t, ts)
  };
}

module.exports = {
  SPIKE_PADS, SPIKE_SET, SPIKE_HIT_R, SPIKE_SAFE_R, DART_PEDESTALS, TICK_SPEED, PERIOD,
  isSpikeCell, spikePadOf, nearestPad, inSpikeRadius, isXaCell, tickOf, spikesUp, safeTimeRemaining,
  timeUntilUp, spikeWindowHits, createTraps, DART_SPEED, DART_RADIUS, onDartLane
};

});

__def("controller", function (exports, module, require) {
"use strict";

const { isPb, cellOf, isNarrowPlank } = require("grid");
const { worldDirFromKa, kaFromKeys, YAW_RAD, SPEED } = require("physics");
const { RING, ringCell, ringIndexNear } = require("ring");

const DIRS = [
  { ka: 0, keys: { ArrowRight: 1 } },
  { ka: 45, keys: { ArrowRight: 1, ArrowDown: 1 } },
  { ka: 90, keys: { ArrowDown: 1 } },
  { ka: 125, keys: { ArrowDown: 1, ArrowLeft: 1 } },
  { ka: 180, keys: { ArrowLeft: 1 } },
  { ka: 225, keys: { ArrowLeft: 1, ArrowUp: 1 } },
  { ka: 270, keys: { ArrowUp: 1 } },
  { ka: 315, keys: { ArrowUp: 1, ArrowRight: 1 } }
];

function keysFromDir(idx) {
  const d = DIRS[idx].keys;
  return {
    ArrowUp: !!d.ArrowUp,
    ArrowDown: !!d.ArrowDown,
    ArrowLeft: !!d.ArrowLeft,
    ArrowRight: !!d.ArrowRight
  };
}

/* -------------------- v23 (verbatim steering) -------------------- */
function createV23() {
  const COS20 = 0.9397;
  const MIN_HOLD = 0.35;
  const ARRIVE = 0.8;
  let curDir = 0, holdUntil = 0, wi = 0, loopDir = 1;
  let guardUntil = 0, antiT = 0, antiX = 0, antiZ = 0;
  let velX = 0, velZ = 0, prevX = null, prevZ = null, prevT = 0;

  function chooseKa(vx, vz, t0, force) {
    const len = Math.hypot(vx, vz) || 1;
    vx /= len; vz /= len;
    let best = 0, bestDot = -2, i, d, dot;
    for (i = 0; i < DIRS.length; i++) {
      d = worldDirFromKa(DIRS[i].ka, YAW_RAD);
      dot = d[0] * vx + d[1] * vz;
      if (dot > bestDot) { bestDot = dot; best = i; }
    }
    if (!force && t0 < holdUntil) return curDir;
    if (!force) {
      d = worldDirFromKa(DIRS[curDir].ka, YAW_RAD);
      dot = d[0] * vx + d[1] * vz;
      if (dot + 1e-6 >= bestDot * COS20 ||
          Math.acos(Math.max(-1, Math.min(1, dot))) - Math.acos(Math.max(-1, Math.min(1, bestDot))) < 20 * Math.PI / 180) {
        return curDir;
      }
    }
    if (best !== curDir) holdUntil = t0 + MIN_HOLD;
    curDir = best;
    return curDir;
  }

  function safetyBad(px, pz) {
    const predX = px + velX * 0.25, predZ = pz + velZ * 0.25;
    const pts = [
      [predX, predZ],
      [predX + 0.9, predZ + 0.9],
      [predX + 0.9, predZ - 0.9],
      [predX - 0.9, predZ + 0.9],
      [predX - 0.9, predZ - 0.9]
    ];
    for (let i = 0; i < pts.length; i++) if (!isPb(pts[i][0], pts[i][1])) return true;
    return false;
  }

  function reset(opt) {
    wi = opt.wi != null ? opt.wi : ringIndexNear(opt.x, opt.z);
    loopDir = opt.loopDir || 1;
    curDir = 0; holdUntil = 0; guardUntil = 0;
    antiT = 0; antiX = opt.x; antiZ = opt.z;
    velX = 0; velZ = 0; prevX = opt.x; prevZ = opt.z; prevT = opt.t || 0;
  }

  function step(px, pz, t0) {
    if (prevX != null) {
      const dt = Math.max(0.008, t0 - prevT);
      velX = (px - prevX) / dt;
      velZ = (pz - prevZ) / dt;
    }
    prevX = px; prevZ = pz; prevT = t0;

    const cur = ringCell(wi);
    if (cur && Math.hypot(cur[0] - px, cur[1] - pz) < ARRIVE) {
      wi = ((wi + loopDir) % RING.length + RING.length) % RING.length;
    }
    let tx = ringCell(wi)[0], tz = ringCell(wi)[1];

    if (safetyBad(px, pz) || !isPb(px, pz)) guardUntil = t0 + 0.2;
    if (t0 < guardUntil) {
      let safeT = ringCell(wi);
      const nearI = ringIndexNear(px, pz);
      const nearC = ringCell(nearI);
      if (Math.hypot(nearC[0] - px, nearC[1] - pz) < Math.hypot(safeT[0] - px, safeT[1] - pz) + 0.4) safeT = nearC;
      tx = safeT[0]; tz = safeT[1];
    }

    let vx = tx - px, vz = tz - pz;
    const stepLen = Math.hypot(vx, vz) || 1;
    const nextX = px + (vx / stepLen) * 0.8;
    const nextZ = pz + (vz / stepLen) * 0.8;
    if (!isPb(nextX, nextZ)) {
      const pull = ringCell(ringIndexNear(px, pz));
      vx = pull[0] - px; vz = pull[1] - pz;
    }
    let idx = chooseKa(vx, vz, t0, false);

    // anti-stuck (v23): displacement < 0.8 over 0.6 s → advance wp
    if (!antiT) { antiT = t0; antiX = px; antiZ = pz; }
    if (t0 - antiT >= 0.6) {
      const disp = Math.hypot(px - antiX, pz - antiZ);
      if (disp < 0.8) {
        holdUntil = 0;
        wi = ((wi + loopDir) % RING.length + RING.length) % RING.length;
        const nt = ringCell(wi);
        idx = chooseKa(nt[0] - px, nt[1] - pz, t0, true);
      }
      antiT = t0; antiX = px; antiZ = pz;
    }

    const keys = keysFromDir(idx);
    return { keys, ka: DIRS[idx].ka, wi, tx, tz, loopDir };
  }

  function reverse() {
    loopDir *= -1;
    wi = ((wi + loopDir) % RING.length + RING.length) % RING.length;
    holdUntil = 0;
  }

  return { reset, step, reverse, name: "v23", getWi: () => wi, getDir: () => loopDir };
}

/* -------------------- v24 (sim-validated centre-line follower) -------------------- */
function createV24() {
  const ARRIVE = 0.55;
  const CTE_ON = 0.22;
  const CTE_OFF = 0.12;
  let wi = 0, loopDir = 1;
  let antiT = 0, antiX = 0, antiZ = 0;
  let latKey = null;

  function reset(opt) {
    wi = opt.wi != null ? opt.wi : ringIndexNear(opt.x, opt.z);
    loopDir = opt.loopDir || 1;
    antiT = 0; antiX = opt.x; antiZ = opt.z;
    latKey = null;
  }

  function project(px, pz, ax, az, bx, bz) {
    const dx = bx - ax, dz = bz - az, L = Math.hypot(dx, dz) || 1;
    const ux = dx / L, uz = dz / L;
    const pxp = -uz, pzp = ux;
    const t = ((px - ax) * ux + (pz - az) * uz) / L; // unclamped
    const tC = t < 0 ? 0 : t > 1 ? 1 : t;
    const cx = ax + ux * L * tC, cz = az + uz * L * tC;
    const cte = (px - ax) * pxp + (pz - az) * pzp;
    return { ux, uz, pxp, pzp, cte, cx, cz, L, t, remain: (1 - t) * L };
  }

  function cardinalAlong(ux, uz) {
    if (Math.abs(ux) >= Math.abs(uz)) return ux >= 0 ? { ArrowRight: true } : { ArrowLeft: true };
    return uz >= 0 ? { ArrowDown: true } : { ArrowUp: true };
  }

  function lateralTowardCenter(cte, pxp, pzp) {
    if (Math.abs(cte) < CTE_OFF) return null;
    const vx = -pxp * Math.sign(cte), vz = -pzp * Math.sign(cte);
    if (Math.abs(vx) >= Math.abs(vz)) return vx >= 0 ? "ArrowRight" : "ArrowLeft";
    return vz >= 0 ? "ArrowDown" : "ArrowUp";
  }

  function wouldFall(px, pz, keys, horizon) {
    const ka = kaFromKeys(keys);
    if (ka == null) return !isPb(px, pz);
    const d = worldDirFromKa(ka, YAW_RAD);
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const t = horizon * i / steps;
      if (!isPb(px + d[0] * SPEED * t, pz + d[1] * SPEED * t)) return true;
    }
    return false;
  }

  function emptyKeys() {
    return { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
  }

  function step(px, pz, t0) {
    const n = RING.length;
    // Advance when we reach OR pass the waypoint along the segment (not only hypot).
    for (let g = 0; g < 6; g++) {
      const prev = ringCell(wi - loopDir);
      const next = ringCell(wi);
      const pr = project(px, pz, prev[0], prev[1], next[0], next[1]);
      const dist = Math.hypot(next[0] - px, next[1] - pz);
      if (dist < ARRIVE || pr.t >= 0.92) {
        wi = ((wi + loopDir) % n + n) % n;
        continue;
      }
      break;
    }

    const prev = ringCell(wi - loopDir);
    const next = ringCell(wi);
    const pr = project(px, pz, prev[0], prev[1], next[0], next[1]);

    const keys = emptyKeys();
    Object.assign(keys, cardinalAlong(pr.ux, pr.uz));

    if (Math.abs(pr.cte) > CTE_ON) latKey = lateralTowardCenter(pr.cte, pr.pxp, pr.pzp);
    else if (Math.abs(pr.cte) < CTE_OFF) latKey = null;
    if (latKey) keys[latKey] = true;

    if (wouldFall(px, pz, keys, 0.20)) {
      if (latKey) { keys[latKey] = false; latKey = null; }
    }
    if (wouldFall(px, pz, keys, 0.20)) {
      const opp = lateralTowardCenter(pr.cte || 0.3, pr.pxp, pr.pzp);
      if (opp) {
        keys[opp] = true;
        if (wouldFall(px, pz, keys, 0.20)) keys[opp] = false;
        else latKey = opp;
      }
    }
    // Last resort: if even the pure along-track key would leave pb, hold still for a frame
    // (should be rare; usually means we are already on the edge — step toward centre only).
    if (wouldFall(px, pz, keys, 0.12)) {
      const only = emptyKeys();
      const toC = cardinalAlong(pr.cx - px || pr.ux, pr.cz - pz || pr.uz);
      // prefer a key toward the centreline / cell centre
      const cx = next[0], cz = next[1];
      const toward = emptyKeys();
      if (Math.abs(cx - px) >= Math.abs(cz - pz)) {
        if (cx - px > 0.08) toward.ArrowRight = true;
        else if (cx - px < -0.08) toward.ArrowLeft = true;
      } else {
        if (cz - pz > 0.08) toward.ArrowDown = true;
        else if (cz - pz < -0.08) toward.ArrowUp = true;
      }
      if (!wouldFall(px, pz, toward, 0.12)) Object.assign(keys, emptyKeys(), toward);
    }

    if (!antiT) { antiT = t0; antiX = px; antiZ = pz; }
    if (t0 - antiT >= 0.6) {
      if (Math.hypot(px - antiX, pz - antiZ) < 0.8) {
        wi = ((wi + loopDir) % n + n) % n;
      }
      antiT = t0; antiX = px; antiZ = pz;
    }

    return { keys, ka: kaFromKeys(keys), wi, tx: next[0], tz: next[1], loopDir, cte: pr.cte };
  }

  function reverse() {
    loopDir *= -1;
    wi = ((wi + loopDir) % RING.length + RING.length) % RING.length;
    latKey = null;
  }

  return { reset, step, reverse, name: "v24", getWi: () => wi, getDir: () => loopDir };
}

function create(name) {
  return name === "v24" ? createV24() : createV23();
}

module.exports = { create, createV23, createV24, DIRS };

});

__def("brain", function (exports, module, require) {
"use strict";

const { cellOf, isPb, neighbors4, isNarrowPlank } = require("grid");
const { RING, ringCell, ringIndexNear } = require("ring");
const { createV24, createV23 } = require("controller");
const { isSpikeCell, spikeWindowHits, spikesUp, safeTimeRemaining, inSpikeRadius, nearestPad, SPIKE_HIT_R, SPIKE_SAFE_R, onDartLane } = require("traps");
const { SPEED } = require("physics");

const ARRIVE = 0.55;

function emptyKeys() {
  return { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
}

function tagOf(i) {
  return (ringCell(i)[2] || "path");
}

function isClusterTag(tag) {
  return tag === "spike" || tag === "blade";
}

/** Consecutive spike/blade cells starting at `wi` in direction `dir` (inclusive if those tags). */
function clusterFrom(wi, dir) {
  const n = RING.length;
  const cells = [];
  let i = ((wi % n) + n) % n;
  // if current target is not in a cluster, no cluster
  if (!isClusterTag(tagOf(i))) return { indices: [], start: i, exit: i, dist: 0 };
  let guard = 0;
  while (isClusterTag(tagOf(i)) && guard++ < 8) {
    cells.push(i);
    i = ((i + dir) % n + n) % n;
  }
  return { indices: cells, start: cells[0], exit: i, dist: cells.length * 3 };
}

function distAlongRing(px, pz, fromI, toI, dir) {
  const n = RING.length;
  let d = Math.hypot(ringCell(fromI)[0] - px, ringCell(fromI)[1] - pz);
  let i = fromI;
  let guard = 0;
  while (i !== toI && guard++ < n) {
    const nI = ((i + dir) % n + n) % n;
    const a = ringCell(i), b = ringCell(nI);
    d += Math.hypot(b[0] - a[0], b[1] - a[1]);
    i = nI;
  }
  // subtract because first term already counted px->fromI, but if we are before fromI
  // a better estimate: project later. This is an upper bound.
  return d;
}

function alongDir(from, to, start, dir) {
  const n = RING.length;
  return ((to - start) * dir + n * 8) % n;
}

function nextCluster(px, pz, wi, dir) {
  const n = RING.length;
  const here = ringIndexNear(px, pz);
  let start = null;
  if (isSpikeCell(px, pz) || isClusterTag(tagOf(here))) {
    let j = here;
    let g = 0;
    while (isClusterTag(tagOf(((j - dir) % n + n) % n)) && g++ < 8) {
      j = ((j - dir) % n + n) % n;
    }
    start = j;
  } else {
    let j = here;
    let g = 0;
    while (!isClusterTag(tagOf(j)) && g++ < n) j = ((j + dir) % n + n) % n;
    if (isClusterTag(tagOf(j))) start = j;
  }
  const cl = start == null ? { indices: [], start: 0, exit: 0 } : clusterFrom(start, dir);
  if (!cl.indices.length) return { time: 0, cluster: cl, etaEnter: 0, inside: false };
  const hereOff = alongDir(start, here, start, dir);
  let path = 0, cx = px, cz = pz;
  const seq = [];
  for (const idx of cl.indices) {
    const off = alongDir(start, idx, start, dir);
    if (isSpikeCell(px, pz) || isClusterTag(tagOf(here))) {
      if (off <= hereOff) continue; // already at or past this cell
    }
    seq.push(idx);
  }
  seq.push(cl.exit);
  for (const idx of seq) {
    const c = ringCell(idx);
    path += Math.hypot(c[0] - cx, c[1] - cz);
    cx = c[0]; cz = c[1];
  }
  const first = ringCell(cl.start);
  const etaEnter = Math.hypot(first[0] - px, first[1] - pz) / SPEED;
  const inside = isSpikeCell(px, pz) || isClusterTag(tagOf(here));
  return { time: path / SPEED, cluster: cl, etaEnter, etaExit: path / SPEED, inside };
}

function timeToClearCluster(px, pz, wi, dir) {
  return nextCluster(px, pz, wi, dir);
}

function prePathCells(clusterStart, dir) {
  const n = RING.length;
  const out = [];
  let j = ((clusterStart - dir) % n + n) % n;
  let g = 0;
  while (out.length < 2 && g++ < 10) {
    if (!isClusterTag(tagOf(j))) out.push(j);
    j = ((j - dir) % n + n) % n;
  }
  return out;
}

function enemiesNear(view, px, pz, r) {
  return (view.enemies || []).filter((e) => Math.hypot(e.x - px, e.z - pz) <= r);
}

function enemyAhead(px, pz, tx, tz, enemies, distMax) {
  const dx = tx - px, dz = tz - pz;
  const L = Math.hypot(dx, dz) || 1;
  const ux = dx / L, uz = dz / L;
  const cosA = Math.cos(45 * Math.PI / 180);
  let best = null, bestD = 1e9;
  for (const e of enemies) {
    const ex = e.x - px, ez = e.z - pz;
    const d = Math.hypot(ex, ez);
    if (d > distMax || d < 0.01) continue;
    if ((ex * ux + ez * uz) / d >= cosA && d < bestD) { bestD = d; best = e; }
  }
  return best;
}

function enemyBehind(px, pz, tx, tz, enemies, distMax) {
  const dx = tx - px, dz = tz - pz;
  const L = Math.hypot(dx, dz) || 1;
  const ux = dx / L, uz = dz / L;
  let best = null, bestD = 1e9;
  for (const e of enemies) {
    const ex = e.x - px, ez = e.z - pz;
    const d = Math.hypot(ex, ez);
    if (d > distMax || d < 0.01) continue;
    if (ex * ux + ez * uz < 0 && d < bestD) { bestD = d; best = e; }
  }
  return best;
}

function innerSafeCell(px, pz, enemies, view) {
  const c = cellOf(px, pz);
  const nbs = neighbors4(c[0], c[1]);
  let best = null, bestH = Math.hypot(px, pz);
  for (const n of nbs) {
    const h = Math.hypot(n[0], n[1]);
    if (h >= bestH - 0.2) continue;
    if (isSpikeCell(n[0], n[1]) && (view.spikesUp || view.safeTime < 0.4)) continue;
    let blocked = false;
    for (const e of enemies) {
      if (Math.hypot(e.x - n[0], e.z - n[1]) < 1.6) { blocked = true; break; }
    }
    if (!blocked) { best = n; bestH = h; }
  }
  return best;
}

function wrapSteer(steer, tx, tz, state) {
  // Temporarily aim the v24 centre-line follower at (tx,tz) by stepping
  // with a fake waypoint: we run the raw follower via a small helper below.
  return { tx, tz, state };
}

/* ---- v24 high-level (faithful port of the live bot's spike/enemy policy) ---- */
function createV24Brain() {
  const steer = createV24();
  let loopDir = 1, wi = 0;
  let reverseUntil = 0, holdYieldUntil = 0;
  let stateName = "loop";

  function reset(opt) {
    loopDir = opt.loopDir || 1;
    wi = opt.wi || 0;
    reverseUntil = 0;
    holdYieldUntil = 0;
    stateName = "loop";
    steer.reset(opt);
  }

  function step(px, pz, t0, view) {
    view = view || { enemies: [], hp: 5, fireballs: [], noodles: [], heldBlade: -1, safeTime: 2, spikesUp: false, spikeTick: 0, threatAt: () => false };
    const n = RING.length;
    // advance waypoints (same as v24)
    for (let g = 0; g < 6; g++) {
      const prev = ringCell(wi - loopDir);
      const next = ringCell(wi);
      const dx = next[0] - prev[0], dz = next[1] - prev[1];
      const L = Math.hypot(dx, dz) || 1;
      const t = ((px - prev[0]) * dx + (pz - prev[1]) * dz) / (L * L);
      const dist = Math.hypot(next[0] - px, next[1] - pz);
      if (dist < ARRIVE || t >= 0.92) {
        wi = ((wi + loopDir) % n + n) % n;
        continue;
      }
      break;
    }

    let tx = ringCell(wi)[0], tz = ringCell(wi)[1];
    const enemies = view.enemies || [];
    const ahead = enemyAhead(px, pz, tx, tz, enemies, 4);
    const behind = enemyBehind(px, pz, tx, tz, enemies, 5);
    let useBlade = false, attack = false;
    stateName = "loop";

    if (ahead && behind) {
      const inner = innerSafeCell(px, pz, enemies, view);
      if (inner) { tx = inner[0]; tz = inner[1]; }
      stateName = "yield";
      holdYieldUntil = t0 + 0.9;
      if (view.heldBlade >= 0) useBlade = true;
    } else if (t0 < holdYieldUntil) {
      stateName = "yield";
    } else if (ahead) {
      if (t0 >= reverseUntil) {
        loopDir *= -1;
        reverseUntil = t0 + 1.8;
        wi = ((wi + loopDir) % n + n) % n;
        tx = ringCell(wi)[0]; tz = ringCell(wi)[1];
        stateName = "reverse";
      } else {
        stateName = "reverse";
      }
    } else if (t0 < reverseUntil) {
      stateName = "reverse";
    }

    // v24 spike policy (single-pad look-ahead + "run off" if already on pad)
    const hereSpike = isSpikeCell(px, pz);
    const tgtSpike = isSpikeCell(tx, tz);
    const dist = Math.hypot(tx - px, tz - pz);
    const eta = dist / 8;
    const wait = (hereSpike || tgtSpike) && (
      hereSpike
        ? (spikeWindowHits(view.trapTime != null ? view.trapTime : t0, 0, 0.4) || view.spikesUp)
        : spikeWindowHits(view.trapTime != null ? view.trapTime : t0, eta, eta + 0.4)
    );
    if (hereSpike && (view.spikesUp || spikeWindowHits(view.trapTime != null ? view.trapTime : t0, 0, 0.35))) {
      wi = ((wi + loopDir) % n + n) % n;
      tx = ringCell(wi)[0]; tz = ringCell(wi)[1];
    } else if (wait || (view.threatAt && view.threatAt(tx, tz, eta))) {
      const back1 = ringCell(wi - loopDir);
      const back2 = ringCell(wi - 2 * loopDir);
      const d1 = Math.hypot(back1[0] - px, back1[1] - pz);
      if (d1 < 0.7) { tx = back2[0]; tz = back2[1]; }
      else { tx = back1[0]; tz = back1[1]; }
      stateName = "time-spike";
    }

    // noodle if HP < max and bowl within 5 (v24)
    if (view.hp < view.hpMax) {
      let best = null, bd = 1e9;
      for (const b of (view.noodles || [])) {
        const d = Math.hypot(b.x - px, b.z - pz);
        if (d < 5 && d < bd && isPb(b.x, b.z)) { bd = d; best = b; }
      }
      if (best) { tx = best.x; tz = best.z; stateName = "noodle"; }
    }

    if (view.heldBlade >= 0) {
      const nd = enemies.reduce((m, e) => Math.min(m, Math.hypot(e.x - px, e.z - pz)), 99);
      if (nd <= 2 && view.hp <= 2) useBlade = true;
    }

    // drive steering toward (tx,tz) by temporarily setting wi to a ring cell near target
    // Use a dedicated seek: create a one-shot follow via steer internals.
    const keys = seekKeys(steer, px, pz, tx, tz, t0, wi, loopDir);
    return { keys, wi, loopDir, tx, tz, state: stateName, useBlade, attack, fx: tx - px, fz: tz - pz };
  }

  function reverse() {
    loopDir *= -1;
    wi = ((wi + loopDir) % RING.length + RING.length) % RING.length;
    steer.reverse();
  }

  return { reset, step, reverse, name: "v24", getWi: () => wi, getDir: () => loopDir };
}

/* Follow the v24 centre-line steering toward an arbitrary target. */
function seekKeys(steer, px, pz, tx, tz, t0, wi, loopDir) {
  // The v24 stepper advances wi itself; we don't want that. Reuse its math
  // by constructing keys the same way as createV24 (duplicated lightly).
  return followTo(px, pz, tx, tz, loopDir, wi);
}

const { kaFromKeys, worldDirFromKa, YAW_RAD, SPEED: SPD } = require("physics");

function project(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az;
  const L2 = dx * dx + dz * dz || 1;
  const t = ((px - ax) * dx + (pz - az) * dz) / L2;
  const cx = ax + dx * t, cz = az + dz * t;
  const L = Math.sqrt(L2);
  const ux = dx / L, uz = dz / L;
  const pxp = -uz, pzp = ux;
  const cte = (px - ax) * pxp + (pz - az) * pzp;
  return { t, cx, cz, ux, uz, cte, pxp, pzp };
}
function cardinalAlong(ux, uz) {
  const keys = emptyKeys();
  if (Math.abs(ux) >= Math.abs(uz)) {
    if (ux >= 0) keys.ArrowRight = true; else keys.ArrowLeft = true;
  } else {
    if (uz >= 0) keys.ArrowDown = true; else keys.ArrowUp = true;
  }
  return keys;
}
function wouldFall(px, pz, keys, horizon) {
  const ka = kaFromKeys(keys);
  if (ka == null) return !isPb(px, pz);
  const d = worldDirFromKa(ka, YAW_RAD);
  for (let i = 1; i <= 10; i++) {
    const t = horizon * i / 10;
    if (!isPb(px + d[0] * SPD * t, pz + d[1] * SPD * t)) return true;
  }
  return false;
}
// Also reject a single 0.1s Euler step (live rAF hitch / low FPS).
function wouldFallLag(px, pz, keys, horizon) {
  if (wouldFall(px, pz, keys, horizon == null ? 0.5 : horizon)) return true;
  const ka = kaFromKeys(keys);
  if (ka == null) return !isPb(px, pz);
  const d = worldDirFromKa(ka, YAW_RAD);
  return !isPb(px + d[0] * SPD * 0.1, pz + d[1] * SPD * 0.1);
}

let _latKey = null;
function followTo(px, pz, tx, tz, loopDir, wi, from) {
  let ax, az;
  if (from) { ax = from[0]; az = from[1]; }
  else {
    const prev = ringCell(wi - (loopDir || 1));
    ax = prev[0]; az = prev[1];
    if (Math.hypot(tx - ax, tz - az) < 0.2) { ax = px; az = pz; }
    else {
      const pr0 = project(px, pz, ax, az, tx, tz);
      if (Math.abs(pr0.cte) > 3.5 || pr0.t < -0.15 || pr0.t > 1.2) { ax = px; az = pz; }
    }
  }
  const pr = project(px, pz, ax, az, tx, tz);
  const keys = emptyKeys();
  Object.assign(keys, cardinalAlong(pr.ux, pr.uz));
  const CTE_ON = 0.22, CTE_OFF = 0.12;
  if (Math.abs(pr.cte) > CTE_ON) {
    // lateral toward centre
    const wantX = -pr.pxp * Math.sign(pr.cte || 1);
    const wantZ = -pr.pzp * Math.sign(pr.cte || 1);
    if (Math.abs(wantX) >= Math.abs(wantZ)) _latKey = wantX >= 0 ? "ArrowRight" : "ArrowLeft";
    else _latKey = wantZ >= 0 ? "ArrowDown" : "ArrowUp";
  } else if (Math.abs(pr.cte) < CTE_OFF) _latKey = null;
  if (_latKey) keys[_latKey] = true;
  if (wouldFall(px, pz, keys, 0.28) && _latKey) { keys[_latKey] = false; _latKey = null; }
  if (wouldFall(px, pz, keys, 0.12)) {
    const toward = emptyKeys();
    if (Math.abs(tx - px) >= Math.abs(tz - pz)) {
      if (tx - px > 0.08) toward.ArrowRight = true;
      else if (tx - px < -0.08) toward.ArrowLeft = true;
    } else {
      if (tz - pz > 0.08) toward.ArrowDown = true;
      else if (tz - pz < -0.08) toward.ArrowUp = true;
    }
    if (!wouldFall(px, pz, toward, 0.12)) {
      keys.ArrowUp = toward.ArrowUp;
      keys.ArrowDown = toward.ArrowDown;
      keys.ArrowLeft = toward.ArrowLeft;
      keys.ArrowRight = toward.ArrowRight;
    }
  }
  if (keys.ArrowUp && keys.ArrowDown) { keys.ArrowUp = false; keys.ArrowDown = false; }
  if (keys.ArrowLeft && keys.ArrowRight) { keys.ArrowLeft = false; keys.ArrowRight = false; }
  if (from) {
    const axisX = Math.abs(tx - px) >= Math.abs(tz - pz);
    if (axisX) { keys.ArrowUp = false; keys.ArrowDown = false; }
    else { keys.ArrowLeft = false; keys.ArrowRight = false; }
  }
  if (!keys.ArrowUp && !keys.ArrowDown && !keys.ArrowLeft && !keys.ArrowRight) {
    const toward = emptyKeys();
    if (Math.abs(tx - px) >= Math.abs(tz - pz)) {
      if (tx - px > 0.12) toward.ArrowRight = true;
      else if (tx - px < -0.12) toward.ArrowLeft = true;
    } else {
      if (tz - pz > 0.12) toward.ArrowDown = true;
      else if (tz - pz < -0.12) toward.ArrowUp = true;
    }
    if (!wouldFall(px, pz, toward, 0.12)) Object.assign(keys, toward);
  }
  return keys;
}

/* ---- v25: cluster-wide spike gating, smarter reverse, noodles, blade, trap-shove ---- */
function createV25Brain() {
  const steer = createV24(); // same centre-line steering
  let loopDir = 1, wi = 0;
  let reverseUntil = 0, holdYieldUntil = 0;
  let stateName = "loop";
  let shuttleToB = true;
  let lastBladeAt = -99;
  let committed = false;
  let commitExit = -1;

  function reset(opt) {
    loopDir = opt.loopDir || 1;
    wi = opt.wi || 0;
    reverseUntil = 0;
    holdYieldUntil = 0;
    stateName = "loop";
    shuttleToB = true;
    lastBladeAt = -99;
    committed = false;
    commitExit = -1;
    steer.reset(opt);
  }

  function prePadCells(clusterStart, dir) {
    const n = RING.length;
    const a = ((clusterStart - dir) % n + n) % n;
    const b = ((clusterStart - 2 * dir) % n + n) % n;
    return [ringCell(a), ringCell(b)];
  }

  function pathSafeTo(px, pz, tx, tz, view) {
    const dist = Math.hypot(tx - px, tz - pz);
    const eta = dist / SPEED;
    if (isSpikeCell(tx, tz) || isSpikeCell(px, pz)) {
      if (view.spikesUp || view.safeTime < eta + 0.35) return false;
    }
    if (view.threatAt && view.threatAt(tx, tz, eta)) return false;
    // sample midpoints
    const steps = Math.max(2, Math.ceil(dist / 3));
    for (let i = 1; i <= steps; i++) {
      const x = px + (tx - px) * i / steps, z = pz + (tz - pz) * i / steps;
      if (!isPb(x, z)) return false;
      if (isSpikeCell(x, z) && (view.spikesUp || view.safeTime < eta * (i / steps) + 0.25)) return false;
    }
    return true;
  }

  function step(px, pz, t0, view) {
    view = view || { enemies: [], hp: 5, hpMax: 5, fireballs: [], noodles: [], heldBlade: -1, safeTime: 2, spikesUp: false, threatAt: () => false };
    const n = RING.length;
    const trapT = view.trapTime != null ? view.trapTime : t0;
    const safe = view.safeTime != null ? view.safeTime : safeTimeRemaining(trapT);

    for (let g = 0; g < 6; g++) {
      const prev = ringCell(wi - loopDir);
      const next = ringCell(wi);
      const dx = next[0] - prev[0], dz = next[1] - prev[1];
      const L = Math.hypot(dx, dz) || 1;
      const t = ((px - prev[0]) * dx + (pz - prev[1]) * dz) / (L * L);
      if (Math.hypot(next[0] - px, next[1] - pz) < ARRIVE || t >= 0.92) {
        wi = ((wi + loopDir) % n + n) % n;
        continue;
      }
      break;
    }

    let tx = ringCell(wi)[0], tz = ringCell(wi)[1];
    const enemies = view.enemies || [];
    let useBlade = false, attack = false;
    stateName = "loop";

    // --- spike cluster gating (the main fix) ---
    const info = nextCluster(px, pz, wi, loopDir);
    const onPad = isSpikeCell(px, pz);
    const margin = 0.20;
    const hereI = ringIndexNear(px, pz);
    let seekFrom = null; // when set, followTo seeks from the player to tx
    if (committed) {
      const exitC = ringCell(commitExit);
      const past = Math.hypot(exitC[0] - px, exitC[1] - pz) < 1.0 ||
          (!onPad && !isClusterTag(tagOf(hereI)) && hereI === commitExit) ||
          (!onPad && !isClusterTag(tagOf(hereI)) &&
           alongDir(info.cluster.start || 0, hereI, info.cluster.start || 0, loopDir) >=
           alongDir(info.cluster.start || 0, commitExit, info.cluster.start || 0, loopDir));
      if (past) {
        committed = false;
        commitExit = -1;
      }
    }
    const canClearNow = info.cluster.indices.length === 0 || (!view.spikesUp && safe >= info.time + margin);
    if (!committed && info.cluster.indices.length > 0) {
      const pres = prePathCells(info.cluster.start, loopDir);
      const iA = pres[0] != null ? pres[0] : ((info.cluster.start - loopDir) % n + n) % n;
      const iB = pres[1] != null ? pres[1] : iA;
      const A = ringCell(iA); // closer to the pad
      const B = ringCell(iB); // further staging cell
      const timeToA = Math.hypot(A[0] - px, A[1] - pz) / SPEED;
      const timeToB = Math.hypot(B[0] - px, B[1] - pz) / SPEED;
      const firstPad = ringCell(info.cluster.start);
      const nearStage = Math.hypot(B[0] - px, B[1] - pz) < 1.2 || Math.hypot(A[0] - px, A[1] - pz) < 1.2;
      const etaEnter = info.etaEnter;
      const clusterFar = etaEnter > safe + 0.25; // won't reach the pad this window
      const pulseIn = view.spikesUp ? 0 : safe;
      const lure = (function () {
        if (pulseIn > 1.05 || pulseIn <= 0 && !view.spikesUp) return false;
        for (const e of enemies) {
          if (isSpikeCell(e.x, e.z) || isClusterTag(tagOf(ringIndexNear(e.x, e.z)))) return true;
          const dPad = Math.hypot(e.x - firstPad[0], e.z - firstPad[1]);
          const dMe = Math.hypot(px - firstPad[0], pz - firstPad[1]);
          if (dPad < 16 && (dPad < dMe + 3 || dPad < 8)) return true;
        }
        return false;
      })();
      if (lure && !info.inside) {
        tx = B[0]; tz = B[1];
        seekFrom = [px, pz];
        stateName = "lure-spike";
      } else if (canClearNow) {
        committed = true;
        commitExit = info.cluster.exit;
      } else if (info.inside) {
        tx = B[0]; tz = B[1];
        seekFrom = [px, pz];
        stateName = "retreat-spike";
      } else if (clusterFar) {
        // Next pad is too far to reach before the pulse — just keep looping.
      } else if (nearStage) {
        tx = B[0]; tz = B[1];
        seekFrom = [px, pz];
        stateName = "hold-spike";
      } else if (!view.spikesUp && timeToB + 0.2 < safe) {
        tx = B[0]; tz = B[1];
        seekFrom = [px, pz];
        stateName = "stage-spike";
      } else {
        // would reach the pad this window but cannot clear: stop short of it
        tx = B[0]; tz = B[1];
        seekFrom = [px, pz];
        stateName = "time-spike";
      }
    }

    // --- noodles: HP<5 and path safe (map bowls + drops), prefer closer / on-ring ---
    if (view.hp < view.hpMax && stateName === "loop") {
      let best = null, bestScore = 1e9;
      for (const b of (view.noodles || [])) {
        const d = Math.hypot(b.x - px, b.z - pz);
        if (d < 14 && pathSafeTo(px, pz, b.x, b.z, view)) {
          const sc = d; // prefer closer
          if (sc < bestScore) { bestScore = sc; best = b; }
        }
      }
      if (best) { tx = best.x; tz = best.z; stateName = "noodle"; }
    }

    // --- enemies ---
    const ahead = enemyAhead(px, pz, tx, tz, enemies, 4);
    const behind = enemyBehind(px, pz, tx, tz, enemies, 5);
    const near = enemiesNear(view, px, pz, 4);
    const nearest = near.reduce((m, e) => Math.min(m, Math.hypot(e.x - px, e.z - pz)), 99);
    const hasSnake = near.some((e) => e.type === "snake");
    const hasFire = (view.fireballs || []).some((f) => Math.hypot(f.x - px, f.z - pz) < 8);

    if (view.heldBlade >= 0 && view.hp <= 3 && nearest <= 4 && t0 - lastBladeAt > 1) {
      useBlade = true;
      lastBladeAt = t0;
    }

    if (ahead && behind) {
      const inner = innerSafeCell(px, pz, enemies, view);
      if (inner) { tx = inner[0]; tz = inner[1]; stateName = "yield"; }
      else { stateName = "yield"; }
      holdYieldUntil = t0 + 0.8;
      if (view.heldBlade >= 0) useBlade = true;
    } else if (t0 < holdYieldUntil && stateName !== "retreat-spike" && stateName !== "time-spike") {
      stateName = "yield";
    } else if (ahead && stateName !== "retreat-spike" && stateName !== "time-spike") {
      // Before reversing, look the other way and at the far side of a corner cluster.
      const otherDir = -loopDir;
      const otherTgt = ringCell(wi + otherDir); // rough
      const otherAhead = enemyAhead(px, pz, otherTgt[0], otherTgt[1], enemies, 5);
      const otherNear = enemiesNear(view, otherTgt[0], otherTgt[1], 5).length;
      const thisNear = enemiesNear(view, tx, tz, 5).length;
      if (otherAhead && otherNear >= thisNear) {
        const inner = innerSafeCell(px, pz, enemies, view);
        if (inner && pathSafeTo(px, pz, inner[0], inner[1], view)) {
          tx = inner[0]; tz = inner[1];
          stateName = "cut-inner";
        } else {
          stateName = "yield";
          holdYieldUntil = t0 + 0.5;
        }
      } else if (t0 >= reverseUntil) {
        loopDir *= -1;
        reverseUntil = t0 + 1.8;
        _latKey = null;
        committed = false;
        wi = ((wi + loopDir) % n + n) % n;
        // after flip, re-check cluster in the new direction
        const info2 = nextCluster(px, pz, wi, loopDir);
        if (info2.cluster.indices.length && (view.spikesUp || safe < info2.time + margin)) {
          // don't dive into a hot corner; stay / yield instead
          loopDir *= -1; // undo
          wi = ((wi + loopDir) % n + n) % n;
          stateName = "yield";
          holdYieldUntil = t0 + 0.4;
        } else {
          tx = ringCell(wi)[0]; tz = ringCell(wi)[1];
          stateName = "reverse";
        }
      } else {
        stateName = "reverse";
      }
    } else if (t0 < reverseUntil && stateName === "loop") {
      stateName = "reverse";
    }

    // dart on current target: shuttle back if threat and we are not mid-cluster commit
    if (stateName === "loop" || stateName === "reverse") {
      const eta = Math.hypot(tx - px, tz - pz) / SPEED;
      if (view.threatAt && view.threatAt(tx, tz, eta)) {
        const back1 = ringCell(wi - loopDir);
        tx = back1[0]; tz = back1[1];
        stateName = "time-dart";
      }
    }


    // attack-knockback only behind a trap, no fireball / big snake
    if (!hasFire && !hasSnake && (stateName === "loop" || stateName === "time-spike" || stateName === "yield" || stateName === "lure-spike")) {
      for (const e of enemies) {
        const d = Math.hypot(e.x - px, e.z - pz);
        if (d > 2.8 || d < 0.4) continue;
        if (!isSpikeCell(e.x, e.z) && !isSpikeCell((e.x + px) / 2, (e.z + pz) / 2)) continue;
        // we should not ourselves be on a hot pad
        if (onPad && view.spikesUp) continue;
        // "behind" the trap: enemy closer to pad centre than we are, we on safe cell
        if (!onPad && (view.spikesUp || safe < 0.5)) {
          attack = true;
          break;
        }
      }
    }

    const keys = followTo(px, pz, tx, tz, loopDir, wi, seekFrom);
    return { keys, wi, loopDir, tx, tz, state: stateName, useBlade, attack, fx: tx - px, fz: tz - pz };
  }

  function reverse() {
    loopDir *= -1;
    wi = ((wi + loopDir) % RING.length + RING.length) % RING.length;
    _latKey = null;
    committed = false;
  }

  return { reset, step, reverse, name: "v25", getWi: () => wi, getDir: () => loopDir };
}

function createV26Brain() {
  const base = createV25Brain();
  let lastAtk = -99;
  let fleeUntil = 0, fleeX = 0, fleeZ = 0;
  let dumpStarted = -1;

  function reset(opt) {
    lastAtk = -99;
    fleeUntil = 0;
    dumpStarted = -1;
    base.reset(opt);
  }

  function plankInfo(x, z) {
    const c = cellOf(x, z);
    const kind = isNarrowPlank(c[0], c[1]);
    return kind ? { cx: c[0], cz: c[1], kind: kind } : null;
  }

  function isSafeDumpCell(cx, cz) {
    // 1-cell mid-planks including the last one before a corner cluster (±18)
    return !!isNarrowPlank(cx, cz) && !isSpikeCell(cx, cz);
  }

  function inwardStand(ex, ez) {
    const p = plankInfo(ex, ez);
    if (!p || !isSafeDumpCell(p.cx, p.cz)) return null;
    const ox = p.kind === "v" ? (Math.sign(p.cx) || 1) : 0;
    const oz = p.kind === "h" ? (Math.sign(p.cz) || 1) : 0;
    let sx = p.kind === "v" ? p.cx - ox * 0.95 : ex;
    let sz = p.kind === "h" ? p.cz - oz * 0.95 : ez;
    if (!isPb(sx, sz)) {
      sx = p.kind === "v" ? p.cx - ox * 0.6 : ex;
      sz = p.kind === "h" ? p.cz - oz * 0.6 : ez;
    }
    if (!isPb(sx, sz) || isSpikeCell(sx, sz)) return null;
    return { x: sx, z: sz, ox: ox, oz: oz, cx: p.cx, cz: p.cz, kind: p.kind };
  }

  // Knock must point mostly outward, not along the plank.
  function alignedInward(px, pz, ex, ez, ox, oz) {
    const out = (ex - px) * ox + (ez - pz) * oz;
    const along = Math.abs((ex - px) * oz + (ez - pz) * ox);
    return out > 0.6 && along < 0.7;
  }

  function fireClose(view, px, pz) {
    for (const f of view.fireballs || []) {
      if (Math.hypot(f.x - px, f.z - pz) < 10) return true;
    }
    return false;
  }

  function clampKeysToPlank(px, pz, keys) {
    const k = Object.assign({}, keys);
    const p = plankInfo(px, pz);
    if (!p) return k;
    const margin = 1.12; // half-width 1.5; never walk closer than 0.38 to the water
    if (p.kind === "v") {
      if (px <= p.cx - margin) k.ArrowLeft = false;
      if (px >= p.cx + margin) k.ArrowRight = false;
    } else if (p.kind === "h") {
      if (pz <= p.cz - margin) k.ArrowUp = false;
      if (pz >= p.cz + margin) k.ArrowDown = false;
    }
    return k;
  }

  function pickDumpPrey(px, pz, enemies) {
    const us = plankInfo(px, pz);
    let best = null, bestS = -1e9;
    for (const e of enemies) {
      const p = plankInfo(e.x, e.z);
      if (!p || !isSafeDumpCell(p.cx, p.cz)) continue;
      const d = Math.hypot(e.x - px, e.z - pz);
      if (d > 14) continue;
      let closeOthers = 0;
      for (const o of enemies) {
        if (o === e) continue;
        const od = Math.hypot(o.x - px, o.z - pz);
        if (o.type === "medusa" && od < 12) closeOthers += 2;
        else if (o.type === "snake" && od < 5) closeOthers++;
        else if (od < 3.5) closeOthers++;
      }
      if (closeOthers >= 2) continue;
      if (e.type !== "axe" && e.type !== "snake" && closeOthers >= 1) continue;
      let score = 0;
      if (e.type === "axe") score += 100;
      else if (e.type === "boss" || e.type === "boss2") score += 80;
      else if ((e.hp || 1) >= 3) score += 40 + (e.hp || 0);
      else if ((e.kb || 18) >= 15) score += 20;
      else score += 10;
      if (us && us.kind === p.kind && ((p.kind === "v" && us.cx === p.cx) || (p.kind === "h" && us.cz === p.cz))) score += 25;
      if (e.type === "snake" && d < 4) score += 50;
      score -= d;
      if (score > bestS) { bestS = score; best = e; }
    }
    return best;
  }

  function lanePoint(stand, alongX, alongZ, mode) {
    // mode: "in" | "center" | "out" — kite/flee stay centre/out so the axe walks along the plank, not back inward
    let x, z;
    if (stand.kind === "v") {
      x = mode === "in" ? stand.x : mode === "out" ? stand.cx + stand.ox * 0.45 : stand.cx;
      z = alongZ;
    } else {
      z = mode === "in" ? stand.z : mode === "out" ? stand.cz + stand.oz * 0.45 : stand.cz;
      x = alongX;
    }
    if (isPb(x, z) && !isSpikeCell(x, z)) return [x, z];
    const c = cellOf(x, z);
    if (isPb(c[0], c[1]) && !isSpikeCell(c[0], c[1])) {
      const ix = stand.kind === "v" ? (mode === "in" ? stand.x : c[0]) : c[0];
      const iz = stand.kind === "h" ? (mode === "in" ? stand.z : c[1]) : c[1];
      if (isPb(ix, iz) && !isSpikeCell(ix, iz)) return [ix, iz];
      return [c[0], c[1]];
    }
    return null;
  }

  function alongLane(px, pz, ex, ez, stand, dist, preferFar, mode) {
    const cands = [];
    const md = mode || "center";
    for (const sign of [1, -1]) {
      const ax = stand.kind === "h" ? ex + sign * dist : stand.cx;
      const az = stand.kind === "v" ? ez + sign * dist : stand.cz;
      const pt = lanePoint(stand, ax, az, md);
      if (!pt) continue;
      const de = Math.hypot(pt[0] - ex, pt[1] - ez);
      const dp = Math.hypot(pt[0] - px, pt[1] - pz);
      cands.push([pt[0], pt[1], de, dp]);
    }
    if (!cands.length) return [stand.x, stand.z];
    if (preferFar) cands.sort((a, b) => (b[2] - a[2]) || (a[3] - b[3]));
    else cands.sort((a, b) => (a[3] - b[3]) || (b[2] - a[2]));
    return [cands[0][0], cands[0][1]];
  }

  function fleeTarget(px, pz, stand, prey) {
    return alongLane(px, pz, prey.x, prey.z, stand, 6.6, true);
  }

  function nearSpike(px, pz) {
    return isSpikeCell(px, pz) || isSpikeCell(px + 3, pz) || isSpikeCell(px - 3, pz) ||
      isSpikeCell(px, pz + 3) || isSpikeCell(px, pz - 3);
  }

  function clusterLocked(state, px, pz) {
    if (state === "time-dart") return true;
    if (state === "time-spike" || state === "hold-spike" || state === "retreat-spike") {
      return nearSpike(px, pz);
    }
    return false;
  }

  function nearestDumpCell(px, pz) {
    let best = null, bd = 1e9;
    for (let i = 0; i < RING.length; i++) {
      const c = ringCell(i);
      if (!isSafeDumpCell(c[0], c[1])) continue;
      const d = Math.hypot(c[0] - px, c[1] - pz);
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }

  function awayOnRing(px, pz, ex, ez, out) {
    const dir = out.loopDir || 1;
    const n = RING.length;
    const wi = out.wi || 0;
    let best = null, bestD = -1;
    for (const sign of [1, -1]) {
      for (const steps of [2, 3, 4, 5]) {
        const i = ((wi + dir * sign * steps) % n + n) % n;
        const c = ringCell(i);
        if (isSpikeCell(c[0], c[1])) continue;
        const de = Math.hypot(c[0] - ex, c[1] - ez);
        if (de > bestD) { bestD = de; best = c; }
      }
    }
    return best;
  }

  function keysTo(px, pz, tx, tz, out) {
    return clampKeysToPlank(px, pz, followTo(px, pz, tx, tz, out.loopDir, out.wi, [px, pz]));
  }

  function ringAway(px, pz, threat, out) {
    const us = ringIndexNear(px, pz);
    const n = RING.length;
    let dir = out.loopDir || 1;
    if (threat) {
      const them = ringIndexNear(threat.x, threat.z);
      const fwd = ((them - us) * dir % n + n) % n;
      if (fwd <= n - fwd) dir = -dir; // threat is in front or equal, go the other way
    }
    for (const steps of [3, 4, 2, 5, 1]) {
      const i = ((us + dir * steps) % n + n) % n;
      const c = ringCell(i);
      if (isSpikeCell(c[0], c[1]) || c[2] === "spike" || c[2] === "blade") continue;
      return { x: c[0], z: c[1], dir: dir };
    }
    const c = ringCell(((us + dir * 2) % n + n) % n);
    return { x: c[0], z: c[1], dir: dir };
  }

  function step(px, pz, t0, view) {
    const out = base.step(px, pz, t0, view);
    const enemies = view.enemies || [];

    if (t0 < fleeUntil) {
      const keys = keysTo(px, pz, fleeX, fleeZ, out);
      return Object.assign({}, out, {
        keys: keys, tx: fleeX, tz: fleeZ, state: "snake-flee",
        attack: false, fx: fleeX - px, fz: fleeZ - pz
      });
    }
    const tank = enemies.find((e) => e.type === "axe" || e.type === "boss" || e.type === "boss2") || null;
    if (!tank) dumpStarted = -1;

    // Save red for a tank. Yellow can be used anytime off a pad (heals or no-op)
    // to free the slot. Green (0.4s freeze) is short enough to reroll off a pad.
    // Never auto-use blue: a random 6s slow-mo stalls waves (traps+spawns).
    let useBlade = !!out.useBlade;
    const onTrap = isSpikeCell(px, pz) || clusterLocked(out.state, px, pz);
    if (view.heldBlade === 1) {
      const nearDeath = view.hp <= 2 && enemies.some((e) => Math.hypot(e.x - px, e.z - pz) < 2.4);
      const tankHere = tank && Math.hypot(tank.x - px, tank.z - pz) < 5.5;
      if (!nearDeath && !tankHere) useBlade = false;
    } else if (view.heldBlade === 3 && !onTrap) {
      useBlade = true;
    } else if (view.heldBlade === 2 && !onTrap) {
      useBlade = true;
    } else if (view.heldBlade === 0 && tank && !onTrap) {
      // Recycle blue once a tank is up so the next corner can roll red.
      // Do not spam blue in early waves (6s slow-mo stalls them).
      useBlade = true;
    }

    const busyFire = fireClose(view, px, pz);

    // Hunt the tank along the ring when we have (or just used) red. v25
    // yield/reverse would otherwise keep us out of the d<6 use range forever.
    // Stay on-axis with the next ring cell so we never cut a corner into water.
    if (tank && !busyFire && (view.heldBlade === 1 || view.timeScale === 0)) {
      const d = Math.hypot(tank.x - px, tank.z - pz);
      const frozen = view.timeScale === 0;
      const snakeClose = enemies.some((e) => e.type === "snake" && Math.hypot(e.x - px, e.z - pz) < 6.5);
      if (!frozen && snakeClose) {
        if (view.heldBlade === 1 && d < 10 && !onTrap) useBlade = true;
        return Object.assign({}, out, { useBlade: useBlade });
      }
      if (view.heldBlade === 1 && d < 8 && !onTrap) useBlade = true;
      let attack = false;
      if (frozen && d < 3.5 && t0 - lastAtk >= 0.36) {
        attack = true;
        lastAtk = t0;
      }
      let keys = out.keys, tx = out.tx, tz = out.tz, stn = frozen ? "freeze-melee" : "hunt-axe";
      const us = ringIndexNear(px, pz);
      const them = ringIndexNear(tank.x, tank.z);
      const n = RING.length;
      const dir0 = out.loopDir || 1;
      const fwd = ((them - us) * dir0 % n + n) % n;
      const dir = fwd <= n - fwd ? dir0 : -dir0;
      const nextI = (us + dir + n) % n;
      const c = ringCell(nextI);
      const nextIsCluster = isSpikeCell(c[0], c[1]) || c[2] === "spike" || c[2] === "blade";
      const uc = cellOf(px, pz);
      function sharesAxis(ax, az) {
        const tc = cellOf(ax, az);
        return Math.abs(tc[0] - uc[0]) < 0.2 || Math.abs(tc[1] - uc[1]) < 0.2;
      }
      if (frozen && d < 6) {
        const L = d || 1;
        let sx = tank.x - ((tank.x - px) / L) * 2.15;
        let sz = tank.z - ((tank.z - pz) / L) * 2.15;
        if (!isPb(sx, sz) || isSpikeCell(sx, sz) || !sharesAxis(sx, sz)) {
          sx = uc[0]; sz = uc[1];
        }
        const k = keysTo(px, pz, sx, sz, out);
        if (!wouldFall(px, pz, k, 0.5)) { keys = k; tx = sx; tz = sz; }
      } else if ((frozen || !nextIsCluster) && sharesAxis(c[0], c[1])) {
        const k = keysTo(px, pz, c[0], c[1], Object.assign({}, out, { loopDir: dir, wi: nextI }));
        if (!wouldFall(px, pz, k, 0.5)) { keys = k; tx = c[0]; tz = c[1]; }
      }
      return Object.assign({}, out, {
        keys: keys, tx: tx, tz: tz, state: stn,
        attack: attack, useBlade: useBlade, fx: tank.x - px, fz: tank.z - pz
      });
    }

    return Object.assign({}, out, { useBlade: useBlade });
  }

  return {
    reset: reset,
    step: step,
    reverse: function () { return base.reverse(); },
    name: "v26",
    getWi: function () { return base.getWi(); },
    getDir: function () { return base.getDir(); }
  };
}

function createV27Brain() {
  const base = createV26Brain();

  let lastAtk = 0;
  function reset(opt) { lastAtk = 0; base.reset(opt); }

  function empty() {
    return { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
  }
  function axisKeysToward(px, pz, tx, tz) {
    const k = empty();
    if (Math.abs(tx - px) >= Math.abs(tz - pz)) {
      if (tx > px + 0.08) k.ArrowRight = true;
      else if (tx < px - 0.08) k.ArrowLeft = true;
    } else {
      if (tz > pz + 0.08) k.ArrowDown = true;
      else if (tz < pz - 0.08) k.ArrowUp = true;
    }
    return k;
  }

  function sharesAxis(a, b) {
    return Math.abs(a[0] - b[0]) < 0.21 || Math.abs(a[1] - b[1]) < 0.21;
  }

  function ringAlong(px, pz, dir) {
    const us = ringIndexNear(px, pz);
    const cur = ringCell(us);
    const n = RING.length;
    dir = dir || 1;
    for (const steps of [2, 3, 1, 4]) {
      const i = ((us + dir * steps) % n + n) % n;
      const c = ringCell(i);
      if (!sharesAxis(cur, c)) continue;
      return { x: c[0], z: c[1] };
    }
    return { x: cur[0], z: cur[1] };
  }

  function ringAway(px, pz, threat, out) {
    const us = ringIndexNear(px, pz);
    const n = RING.length;
    let dir = out.loopDir || 1;
    if (threat) {
      const them = ringIndexNear(threat.x, threat.z);
      const fwd = ((them - us) * dir % n + n) % n;
      if (fwd <= n - fwd) dir = -dir;
    }
    const dest = ringAlong(px, pz, dir);
    const cur = ringCell(us);
    if (dest.x !== cur[0] || dest.z !== cur[1]) return dest;
    return ringAlong(px, pz, -dir);
  }

  // Hug the centre of a 1-cell plank so a 1.8 knock cannot reach oc
  // (live death 2: standing at x=-22.59, 0.09 inside the inner edge).
  function clampPlank(px, pz, keys) {
    const k = Object.assign({}, empty(), keys);
    const c = cellOf(px, pz);
    const kind = isNarrowPlank(c[0], c[1]);
    if (!kind) return k;
    const margin = 1.12;
    if (kind === "v") {
      if (px <= c[0] - margin) k.ArrowLeft = false;
      if (px >= c[0] + margin) k.ArrowRight = false;
      if (Math.abs(px - c[0]) > 0.12) {
        if (c[0] > px + 0.08) k.ArrowRight = true;
        else if (c[0] < px - 0.08) k.ArrowLeft = true;
      }
    } else {
      if (pz <= c[1] - margin) k.ArrowUp = false;
      if (pz >= c[1] + margin) k.ArrowDown = false;
      if (Math.abs(pz - c[1]) > 0.12) {
        if (c[1] > pz + 0.08) k.ArrowDown = true;
        else if (c[1] < pz - 0.08) k.ArrowUp = true;
      }
    }
    return k;
  }

  // After a knock in a 3-wide mid, hug x=±24 or z=±24 so we do not walk
  // the outer column into a 1-cell plank (trial 5: x=26, z=7.5 water).
  function clampToRing(px, pz, keys) {
    const k = Object.assign({}, empty(), keys);
    const ew = Math.abs(Math.abs(px) - 24);
    const ns = Math.abs(Math.abs(pz) - 24);
    if (ew <= ns && Math.abs(px) > 18) {
      const axis = px >= 0 ? 24 : -24;
      if (px > axis + 1.12) k.ArrowRight = false;
      if (px < axis - 1.12) k.ArrowLeft = false;
      if (px > axis + 0.12) k.ArrowLeft = true;
      if (px < axis - 0.12) k.ArrowRight = true;
    } else if (ns < ew && Math.abs(pz) > 18) {
      const axis = pz >= 0 ? 24 : -24;
      if (pz > axis + 1.12) k.ArrowDown = false;
      if (pz < axis - 1.12) k.ArrowUp = false;
      if (pz > axis + 0.12) k.ArrowUp = true;
      if (pz < axis - 0.12) k.ArrowDown = true;
    }
    return k;
  }

  function snakeClose(enemies, px, pz, r) {
    for (const e of enemies || []) {
      if (e.type === "snake" && Math.hypot(e.x - px, e.z - pz) < r) return e;
    }
    return null;
  }

  function step(px, pz, t0, view) {
    const out = base.step(px, pz, t0, view);
    const enemies = view.enemies || [];
    const leftover = enemies.length === 1 && enemies[0].type !== "axe" &&
      enemies[0].type !== "boss" && enemies[0].type !== "boss2";
    const prey = leftover ? enemies[0] : null;
    const trashPair = !leftover && enemies.length === 2 &&
      enemies.every((e) => e.type !== "axe" && e.type !== "boss" && e.type !== "boss2");
    const sn = snakeClose(enemies, px, pz, 6.5);
    // Live death 1: do not STAND in lure-spike with a snake in 6.5.
    // Exception: a lone leftover 1-HP snake is finished by that pulse — hold.
    // If we are still walking toward the lure cell, keep v26 keys.
    // Once we have arrived, continue along the ring in loopDir (never reverse
    // into the snake — that walked trial 8 into a cut-inner and the water).
    if (out.state === "lure-spike" && sn && !leftover) {
      const dT = Math.hypot(px - (out.tx == null ? px : out.tx), pz - (out.tz == null ? pz : out.tz));
      if (dT < 0.8) {
        const dest = ringAlong(px, pz, out.loopDir || 1);
        const keys = followTo(px, pz, dest.x, dest.z, out.loopDir, out.wi, [px, pz]);
        if (!wouldFall(px, pz, keys, 0.45)) {
          out.keys = keys;
          out.tx = dest.x;
          out.tz = dest.z;
          out.state = "abort-lure";
          out.attack = false;
          out.fx = dest.x - px;
          out.fz = dest.z - pz;
        }
      }
    }
    // Finish a lone leftover (the wave-3..6 stall: a 1-HP snake kiting us
    // forever). Recycle non-red blades so a red can roll; use red in place;
    // jab only on a 3-wide cell. Do not add hunt movement while unfrozen —
    // that walked off the ring. While frozen, step along the ring toward it.
    if (prey) {
      const d = Math.hypot(prey.x - px, prey.z - pz);
      const frozen = view.timeScale === 0;
      const onTrap = typeof isSpikeCell === "function" && isSpikeCell(px, pz);
      const busyFire = (view.fireballs || []).some((f) => Math.hypot(f.x - px, f.z - pz) < 7);
      if ((view.heldBlade === 0 || view.heldBlade === 2 || view.heldBlade === 3) && !onTrap) {
        out.useBlade = true;
      }
      if (view.heldBlade === 1 && d < 10 && !onTrap) out.useBlade = true;
      const c0 = cellOf(px, pz);
      const wide = !isNarrowPlank(c0[0], c0[1]);
      if (frozen && d < 3.5 && t0 - lastAtk >= 0.36) { out.attack = true; lastAtk = t0; }
      if (frozen && !busyFire) {
        const dest = ringAlong(px, pz, (function () {
          const us = ringIndexNear(px, pz);
          const them = ringIndexNear(prey.x, prey.z);
          const n = RING.length;
          const dir0 = out.loopDir || 1;
          const fwd = ((them - us) * dir0 % n + n) % n;
          return fwd <= n - fwd ? dir0 : -dir0;
        })());
        const k = followTo(px, pz, dest.x, dest.z, out.loopDir, out.wi, [px, pz]);
        if (!wouldFall(px, pz, k, 0.5) && (Math.abs(Math.abs(dest.x) - 24) < 0.3 || Math.abs(Math.abs(dest.z) - 24) < 0.3)) {
          out.keys = k; out.tx = dest.x; out.tz = dest.z;
          out.state = "leftover-melee";
          out.fx = prey.x - px; out.fz = prey.z - pz;
        }
      } else if (wide && d < 2.8 && t0 - lastAtk >= 0.36) {
        out.attack = true;
        lastAtk = t0;
        out.state = "leftover-jab";
      }
    }

    // Two leftover trash + a held red was the wave-11 stall. Pop red and
    // jab if they walk into range, but do not add hunt movement (that caused water).
    if (trashPair) {
      const near = enemies.slice().sort((a, b) => Math.hypot(a.x - px, a.z - pz) - Math.hypot(b.x - px, b.z - pz))[0];
      const d = Math.hypot(near.x - px, near.z - pz);
      const onTrap = typeof isSpikeCell === "function" && isSpikeCell(px, pz);
      if (view.heldBlade === 1 && d < 10 && !onTrap) out.useBlade = true;
      if ((view.heldBlade === 0 || view.heldBlade === 2 || view.heldBlade === 3) && !onTrap) out.useBlade = true;
      const frozen = view.timeScale === 0;
      const c0 = cellOf(px, pz);
      const wide = !isNarrowPlank(c0[0], c0[1]);
      if (frozen && d < 3.5 && t0 - lastAtk >= 0.36) { out.attack = true; lastAtk = t0; }
      else if (!frozen && wide && d < 2.8 && t0 - lastAtk >= 0.36) { out.attack = true; lastAtk = t0; }
    }

    // Never follow a target off the outer ring. cut-inner / yield at the
    // SE/SW corners walk to (21,-21) and slip into water (trial 3 at 501s).
    function onOuterRing(tx, tz) {
      return Math.abs(Math.abs(tx) - 24) < 0.3 || Math.abs(Math.abs(tz) - 24) < 0.3;
    }
    const curCell = cellOf(px, pz);
    const targetOffAxis = out.tx != null && out.tz != null &&
      !sharesAxis([px, pz], [out.tx, out.tz]) &&
      !sharesAxis(curCell, [out.tx, out.tz]);
    // v52: at low HP with enemies close, never cross the interior toward a
    // ring waypoint (run-1 death: HP 1, walked the middle line into snake + grunts).
    const interiorPx = !(Math.abs(Math.abs(px) - 24) < 3 || Math.abs(Math.abs(pz) - 24) < 3);
    const lowHpThreat = view.hp <= 2 && interiorPx &&
      enemies.some((e) => Math.hypot(e.x - px, e.z - pz) < 5);
    if ((out.tx != null && out.tz != null && !onOuterRing(out.tx, out.tz)) || targetOffAxis || lowHpThreat) {
      const dest = ringAlong(px, pz, out.loopDir || 1);
      const keys = followTo(px, pz, dest.x, dest.z, out.loopDir, out.wi, [px, pz]);
      if (!wouldFall(px, pz, keys, 0.45)) {
        out.keys = keys;
        out.tx = dest.x;
        out.tz = dest.z;
        out.state = "stay-ring";
        out.fx = dest.x - px;
        out.fz = dest.z - pz;
      }
    }

    // Centre-hug only when a melee hit could knock us off a 1-cell plank
    // (always-on clamp desyncs v26's safe path and caused water).
    const kind = isNarrowPlank(cellOf(px, pz)[0], cellOf(px, pz)[1]);
    if (kind) {
      let threatNear = false;
      for (const e of view.enemies || []) {
        const d = Math.hypot(e.x - px, e.z - pz);
        if (d < Math.max((e.reach || 1) + 2.5, 6)) { threatNear = true; break; }
      }
      const off = kind === "v" ? Math.abs(px - cellOf(px, pz)[0]) : Math.abs(pz - cellOf(px, pz)[1]);
      if (threatNear || off > 0.35) {
        const k = clampPlank(px, pz, out.keys || empty());
        if (!wouldFall(px, pz, k, 0.4)) out.keys = k;
      }
    }
    // Only when already past a 1-cell plank width (centre ±1.15). Everyday
    // ring walking stays at |axis|≈24; a wide clamp was stalling trial 10.
    if (Math.abs(px) > 25.15 || Math.abs(pz) > 25.15) {
      const k = clampToRing(px, pz, out.keys || empty());
      if (!wouldFall(px, pz, k, 0.4)) out.keys = k;
    }
    return out;
  }

  return {
    reset: reset,
    step: step,
    reverse: function () { return base.reverse(); },
    name: "v27",
    getWi: function () { return base.getWi(); },
    getDir: function () { return base.getDir(); }
  };
}

function createV28Brain() {
  const base = createV27Brain();
  let lastAtk = 0;
  function reset(opt) { lastAtk = 0; base.reset(opt); }

  function empty() {
    return { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
  }
  function axisKeysToward(px, pz, tx, tz) {
    const k = empty();
    if (Math.abs(tx - px) >= Math.abs(tz - pz)) {
      if (tx > px + 0.08) k.ArrowRight = true;
      else if (tx < px - 0.08) k.ArrowLeft = true;
    } else {
      if (tz > pz + 0.08) k.ArrowDown = true;
      else if (tz < pz - 0.08) k.ArrowUp = true;
    }
    return k;
  }
  function sharesAxis(a, b) {
    return Math.abs(a[0] - b[0]) < 0.21 || Math.abs(a[1] - b[1]) < 0.21;
  }
  function ringAlongSafe(px, pz, dir) {
    const us = ringIndexNear(px, pz);
    const cur = ringCell(us);
    const n = RING.length;
    dir = dir || 1;
    for (const steps of [2, 3, 1, 4, 5]) {
      const c = ringCell(((us + dir * steps) % n + n) % n);
      if (!sharesAxis(cur, c)) continue;
      if (isSpikeCell(c[0], c[1])) continue;
      return { x: c[0], z: c[1] };
    }
    return { x: cur[0], z: cur[1] };
  }
  function spikeKnockOff(px, pz) {
    if (!isSpikeCell(px, pz)) return false;
    const pad = cellOf(px, pz);
    const L = Math.hypot(px - pad[0], pz - pad[1]) || 1;
    return !isPb(px + ((px - pad[0]) / L) * 1.8, pz + ((pz - pad[1]) / L) * 1.8);
  }
  function safeKeys(px, pz, keys) {
    let k = Object.assign({}, empty(), keys || empty());
    if (!wouldFallLag(px, pz, k, 0.5)) return k;
    const c = cellOf(px, pz);
    const kind = isNarrowPlank(c[0], c[1]);
    if (kind === "v") { k.ArrowLeft = false; k.ArrowRight = false; }
    else if (kind === "h") { k.ArrowUp = false; k.ArrowDown = false; }
    if (!wouldFallLag(px, pz, k, 0.5)) return k;
    const dest = ringAlongSafe(px, pz, 1);
    const alt = followTo(px, pz, dest.x, dest.z, 1, 0, [px, pz]);
    if (!wouldFallLag(px, pz, alt, 0.5)) return alt;
    return empty();
  }

  function step(px, pz, t0, view) {
    const out = base.step(px, pz, t0, view);
    const enemies = view.enemies || [];
    const frozen = view.timeScale === 0;
    const onTrap = isSpikeCell(px, pz);
    const sn = enemies.find((e) => e.type === "snake" && Math.hypot(e.x - px, e.z - pz) < 6.5) || null;
    const c0 = cellOf(px, pz);
    const narrow = isNarrowPlank(c0[0], c0[1]);

    // Leave a spike pad if the pulse is up or a 1.8 knock would leave pb
    // (live v26: repeated spike chips, then SW-corner / outer-edge water).
    if (onTrap && (view.spikesUp || spikeKnockOff(px, pz))) {
      const dest = ringAlongSafe(px, pz, out.loopDir || 1);
      const keys = followTo(px, pz, dest.x, dest.z, out.loopDir, out.wi, [px, pz]);
      if (!wouldFallLag(px, pz, keys, 0.5)) {
        out.keys = safeKeys(px, pz, keys);
        out.tx = dest.x; out.tz = dest.z; out.state = "leave-pad";
        out.attack = false;
        out.fx = dest.x - px; out.fz = dest.z - pz;
        return out;
      }
    }

    // Wave-12 live/sim death: do not stand on a 1-cell plank with a snake in 6.5.
    const standing = /^(lure-spike|hold-spike|stage-spike|time-spike|yield|freeze-melee)$/.test(out.state || "");
    const dT = Math.hypot(px - (out.tx == null ? px : out.tx), pz - (out.tz == null ? pz : out.tz));
    if (narrow && sn && !frozen && standing && dT < 1.0) {
      const dest = ringAlongSafe(px, pz, out.loopDir || 1);
      const keys = followTo(px, pz, dest.x, dest.z, out.loopDir, out.wi, [px, pz]);
      if (!wouldFallLag(px, pz, keys, 0.5)) {
        out.keys = safeKeys(px, pz, keys);
        out.tx = dest.x; out.tz = dest.z; out.state = "abort-plank";
        out.attack = false;
        return out;
      }
    }

    // Anti-timeout: if a wave has run >90s with <=3 left, recycle a non-red
    // blade so a red can roll. Do not change movement (that cost water / waves).
    const nEn = enemies.length;
    const waveAge = view.waveAge != null ? view.waveAge : 0;
    if (waveAge > 90 && nEn >= 1 && nEn <= 3 && !onTrap &&
        (view.heldBlade === 0 || view.heldBlade === 2 || view.heldBlade === 3)) {
      out.useBlade = true;
    }

    return out;
  }

  return {
    reset: reset,
    step: step,
    reverse: function () { return base.reverse(); },
    name: "v28",
    getWi: function () { return base.getWi(); },
    getDir: function () { return base.getDir(); }
  };
}

function createV29Brain() {
  const base = createV27Brain();
  const DT_BUF = 8;
  const dts = new Float64Array(DT_BUF);
  let dtN = 0, dtI = 0;
  let holdUntil = -1, holdState = "", holdDest = null, holdDir = 1;

  function reset(opt) {
    dtN = 0; dtI = 0;
    holdUntil = -1; holdState = ""; holdDest = null; holdDir = 1;
    base.reset(opt);
  }

  function empty() {
    return { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
  }
  function axisKeysToward(px, pz, tx, tz) {
    const k = empty();
    if (Math.abs(tx - px) >= Math.abs(tz - pz)) {
      if (tx > px + 0.08) k.ArrowRight = true;
      else if (tx < px - 0.08) k.ArrowLeft = true;
    } else {
      if (tz > pz + 0.08) k.ArrowDown = true;
      else if (tz < pz - 0.08) k.ArrowUp = true;
    }
    return k;
  }
  function noteDt(dt) {
    if (!(dt > 0) || dt > 2) return;
    dts[dtI % DT_BUF] = dt;
    dtI++;
    if (dtN < DT_BUF) dtN++;
  }
  function recentDt() {
    if (dtN < 1) return 1 / 60;
    let mx = 1 / 60;
    for (let i = 0; i < dtN; i++) if (dts[i] > mx) mx = dts[i];
    return Math.min(0.1, Math.max(1 / 60, mx));
  }
  function sharesAxis(a, b) {
    return Math.abs(a[0] - b[0]) < 0.21 || Math.abs(a[1] - b[1]) < 0.21;
  }
  function onOuterLine(px, pz) {
    return Math.abs(Math.abs(px) - 24) <= 0.85 || Math.abs(Math.abs(pz) - 24) <= 0.85;
  }
  function keysTowardOuter(px, pz) {
    const k = empty();
    const dx = Math.abs(Math.abs(px) - 24);
    const dz = Math.abs(Math.abs(pz) - 24);
    if (dx <= dz) {
      if (px >= 0) { if (px < 23.7) k.ArrowRight = true; else if (px > 24.3) k.ArrowLeft = true; }
      else { if (px > -23.7) k.ArrowLeft = true; else if (px < -24.3) k.ArrowRight = true; }
    } else {
      if (pz >= 0) { if (pz < 23.7) k.ArrowDown = true; else if (pz > 24.3) k.ArrowUp = true; }
      else { if (pz > -23.7) k.ArrowUp = true; else if (pz < -24.3) k.ArrowDown = true; }
    }
    return k;
  }
  function ringAlongSafe(px, pz, dir) {
    const us = ringIndexNear(px, pz);
    const cur = ringCell(us);
    const n = RING.length;
    dir = dir || 1;
    for (const steps of [2, 3, 1, 4, 5]) {
      const c = ringCell(((us + dir * steps) % n + n) % n);
      if (!sharesAxis(cur, c)) continue;
      if (isSpikeCell(c[0], c[1])) continue;
      if (!onOuterLine(c[0], c[1])) continue;
      return { x: c[0], z: c[1] };
    }
    return { x: cur[0], z: cur[1] };
  }
  function spikeKnockOff(px, pz) {
    if (!isSpikeCell(px, pz)) return false;
    const pad = cellOf(px, pz);
    const L = Math.hypot(px - pad[0], pz - pad[1]) || 1;
    return !isPb(px + ((px - pad[0]) / L) * 1.8, pz + ((pz - pad[1]) / L) * 1.8);
  }
  function wouldFallDt(px, pz, keys, stepDt, horizon) {
    if (wouldFall(px, pz, keys, horizon == null ? 0.28 : horizon)) return true;
    const ka = kaFromKeys(keys);
    if (ka == null) return !isPb(px, pz);
    const d = worldDirFromKa(ka, YAW_RAD);
    const t = Math.min(0.1, Math.max(1 / 60, stepDt || 1 / 60));
    return !isPb(px + d[0] * SPD * t, pz + d[1] * SPD * t);
  }
  function dropLaterals(keys, kind) {
    const k = Object.assign({}, empty(), keys || empty());
    if (kind === "v") { k.ArrowLeft = false; k.ArrowRight = false; }
    else if (kind === "h") { k.ArrowUp = false; k.ArrowDown = false; }
    return k;
  }
  function keysTowardCenter(px, pz, kind) {
    const k = empty();
    const c = cellOf(px, pz);
    if (kind === "v") {
      if (px < c[0] - 0.12) k.ArrowRight = true;
      else if (px > c[0] + 0.12) k.ArrowLeft = true;
    } else if (kind === "h") {
      if (pz < c[1] - 0.12) k.ArrowDown = true;
      else if (pz > c[1] + 0.12) k.ArrowUp = true;
    }
    return k;
  }
  function filterKeys(px, pz, keys, stepDt) {
    let k = Object.assign({}, empty(), keys || empty());
    // If we have drifted off the outer line, recover first (always).
    if (!onOuterLine(px, pz)) {
      const rec = keysTowardOuter(px, pz);
      // Only test the next (possibly hitch) step so a short correction
      // toward |x| or |z| = 24 is not rejected as a long-horizon overshoot.
      const recDt = Math.min(0.1, Math.max(stepDt, 1 / 60));
      if (!wouldFallDt(px, pz, rec, recDt, recDt)) return rec;
    }
    const kind = isNarrowPlank(cellOf(px, pz)[0], cellOf(px, pz)[1]);
    if (stepDt >= 0.035 && kind) {
      const c = cellOf(px, pz);
      const off = kind === "v" ? Math.abs(px - c[0]) : Math.abs(pz - c[1]);
      // Off-centre: only hug the centre (no diagonal). On-centre: pure axis.
      k = off > 0.22 ? keysTowardCenter(px, pz, kind) : dropLaterals(k, kind);
    }
    if (stepDt < 0.035) return k;
    const horizon = Math.max(0.28, stepDt * 5);
    if (!wouldFallDt(px, pz, k, stepDt, horizon)) return k;
    if (kind) {
      k = dropLaterals(k, kind);
      if (!wouldFallDt(px, pz, k, stepDt, horizon)) return k;
    }
    return empty();
  }
  function goTo(px, pz, dest, stepDt, loopDir, wi, state) {
    const keys = followTo(px, pz, dest.x, dest.z, loopDir, wi, [px, pz]);
    const fk = filterKeys(px, pz, keys, stepDt);
    if (wouldFallDt(px, pz, fk, stepDt, Math.max(0.28, stepDt * 5))) return null;
    return {
      keys: fk, tx: dest.x, tz: dest.z, state: state,
      attack: false, fx: dest.x - px, fz: dest.z - pz, loopDir: loopDir, wi: wi
    };
  }

  function step(px, pz, t0, view) {
    if (view && view.dt) noteDt(view.dt);
    const out = base.step(px, pz, t0, view);
    const stepDt = recentDt();
    const enemies = view.enemies || [];
    const frozen = view.timeScale === 0;
    const onTrap = isSpikeCell(px, pz);
    const sn = enemies.find((e) => e.type === "snake" && Math.hypot(e.x - px, e.z - pz) < 6.5) || null;
    const c0 = cellOf(px, pz);
    const narrow = isNarrowPlank(c0[0], c0[1]);
    const dir = out.loopDir || holdDir || 1;

    if (holdUntil > t0 && holdDest) {
      const dH = Math.hypot(px - holdDest.x, pz - holdDest.z);
      if (dH > 0.45) {
        const go = goTo(px, pz, holdDest, stepDt, holdDir || dir, out.wi, holdState);
        if (go) { Object.assign(out, go); return out; }
      }
      holdUntil = -1; holdDest = null;
    }

    if (onTrap && (view.spikesUp || spikeKnockOff(px, pz))) {
      const dest = ringAlongSafe(px, pz, dir);
      const go = goTo(px, pz, dest, stepDt, dir, out.wi, "leave-pad");
      if (go) {
        holdUntil = t0 + 1.0; holdState = "leave-pad"; holdDest = dest; holdDir = dir;
        Object.assign(out, go);
        return out;
      }
    }

    const standing = /^(lure-spike|hold-spike|stage-spike|time-spike|yield|freeze-melee)$/.test(out.state || "");
    const dT = Math.hypot(px - (out.tx == null ? px : out.tx), pz - (out.tz == null ? pz : out.tz));
    if (narrow && sn && !frozen && standing && dT < 1.0 && onOuterLine(px, pz)) {
      const dest = ringAlongSafe(px, pz, dir);
      const go = goTo(px, pz, dest, stepDt, dir, out.wi, "abort-plank");
      if (go) {
        holdUntil = t0 + 1.2; holdState = "abort-plank"; holdDest = dest; holdDir = dir;
        Object.assign(out, go);
        return out;
      }
    }

    const nEn = enemies.length;
    const waveAge = view.waveAge != null ? view.waveAge : 0;
    if (waveAge > 90 && nEn >= 1 && nEn <= 3 && !onTrap &&
        (view.heldBlade === 0 || view.heldBlade === 2 || view.heldBlade === 3)) {
      out.useBlade = true;
    }

    out.keys = filterKeys(px, pz, out.keys, stepDt);
    return out;
  }

  return {
    reset: reset,
    step: step,
    reverse: function () { return base.reverse(); },
    name: "v29",
    getWi: function () { return base.getWi(); },
    getDir: function () { return base.getDir(); }
  };
}

function createV30Brain() {
  // Matches live v30 leave-pad: always-on when inside the 2.5 disk, dest is
  // the next same-axis ring cell along loopDir that is not a spike *cell*
  // (often the corner at dist 3). A 1s hold then walks through the pad,
  // including during the 0.25s up window.
  const base = createV29Brain();
  let lastX = null, lastZ = null, lastMoveT = 0;
  let holdUntil = -1, holdDest = null, holdDir = 1;
  const dts = new Float64Array(8);
  let dtN = 0, dtI = 0;

  function reset(opt) {
    lastX = null; lastZ = null; lastMoveT = 0;
    holdUntil = -1; holdDest = null; holdDir = 1;
    dtN = 0; dtI = 0;
    base.reset(opt);
  }
  function recentDt() {
    if (dtN < 1) return 1 / 60;
    let mx = 1 / 60;
    for (let i = 0; i < dtN; i++) if (dts[i] > mx) mx = dts[i];
    return Math.min(0.1, mx);
  }
  function onOuter(px, pz) {
    return Math.abs(Math.abs(px) - 24) <= 0.85 || Math.abs(Math.abs(pz) - 24) <= 0.85;
  }
  function nextSafe(px, pz, dir) {
    const us = ringIndexNear(px, pz);
    const cur = ringCell(us);
    const n = RING.length;
    dir = dir || 1;
    for (const steps of [2, 3, 1, 4, 5]) {
      const c = ringCell(((us + dir * steps) % n + n) % n);
      if (Math.abs(c[0] - cur[0]) > 0.21 && Math.abs(c[1] - cur[1]) > 0.21) continue;
      if (isSpikeCell(c[0], c[1])) continue;
      return { x: c[0], z: c[1] };
    }
    return { x: cur[0], z: cur[1] };
  }
  function alongRingKeys(px, pz, dir, wi, dest) {
    const keys = followTo(px, pz, dest.x, dest.z, dir, wi, [px, pz]);
    return keys;
  }
  function farSafe(px, pz, dir) {
    const us = ringIndexNear(px, pz);
    const n = RING.length;
    dir = dir || 1;
    for (const steps of [2, 3, 1, 4, 5, 6]) {
      const c = ringCell(((us + dir * steps) % n + n) % n);
      if (!isPb(c[0], c[1])) continue;
      if (nearestPad(c[0], c[1]).dist < SPIKE_SAFE_R) continue;
      return { x: c[0], z: c[1] };
    }
    return null;
  }
  function alongWatch(px, pz, dir, wi) {
    const us = ringIndexNear(px, pz);
    const n = RING.length;
    dir = dir || 1;
    for (const steps of [2, 3, 1, 4, 5]) {
      const c = ringCell(((us + dir * steps) % n + n) % n);
      if (!isPb(c[0], c[1])) continue;
      if (nearestPad(c[0], c[1]).dist < SPIKE_SAFE_R) continue;
      const keys = followTo(px, pz, c[0], c[1], dir, wi, [px, pz]);
      if (wouldFall(px, pz, keys, 0.4)) continue;
      const ka = kaFromKeys(keys);
      if (ka != null) {
        const d = worldDirFromKa(ka, YAW_RAD);
        const nx = px + d[0] * SPD * 0.1, nz = pz + d[1] * SPD * 0.1;
        if (!isPb(nx, nz) || !onOuter(nx, nz)) continue;
      }
      return { keys: keys, x: c[0], z: c[1] };
    }
    return null;
  }

  function step(px, pz, t0, view) {
    if (view && view.dt > 0 && view.dt < 2) {
      dts[dtI % 8] = view.dt; dtI++; if (dtN < 8) dtN++;
    }
    const out = base.step(px, pz, t0, view);
    const moved = lastX == null || Math.hypot(px - lastX, pz - lastZ) > 0.12;
    if (moved) lastMoveT = t0;
    lastX = px; lastZ = pz;
    const keysOn = out.keys && (out.keys.ArrowUp || out.keys.ArrowDown || out.keys.ArrowLeft || out.keys.ArrowRight);
    if (!moved && !keysOn && t0 - lastMoveT > 3) {
      const go = alongWatch(px, pz, out.loopDir || 1, out.wi);
      if (go) {
        out.keys = go.keys; out.tx = go.x; out.tz = go.z;
        out.state = "watchdog"; out.attack = false;
        lastMoveT = t0;
        return out;
      }
    }

    const dir = out.loopDir || holdDir || 1;
    const np = nearestPad(px, pz);
    const safe = view.safeTime != null ? view.safeTime : 2;
    const exitEta = Math.max(0, (SPIKE_HIT_R + 0.35 - np.dist) / 8);
    const wantLeave = np.dist < SPIKE_HIT_R && (view.spikesUp || safe < Math.max(0.2, exitEta) + 0.08);

    if (holdUntil > t0 && holdDest) {
      const dH = Math.hypot(px - holdDest.x, pz - holdDest.z);
      if (dH > 0.45) {
        out.keys = alongRingKeys(px, pz, holdDir || dir, out.wi, holdDest);
        out.tx = holdDest.x; out.tz = holdDest.z;
        out.state = "leave-pad"; out.attack = false;
        return out;
      }
      holdUntil = -1; holdDest = null;
    }

    if (wantLeave) {
      const dest = nextSafe(px, pz, dir);
      holdUntil = t0 + 1.0;
      holdDest = dest;
      holdDir = dir;
      out.keys = alongRingKeys(px, pz, dir, out.wi, dest);
      out.tx = dest.x; out.tz = dest.z;
      out.state = "leave-pad"; out.attack = false;
      return out;
    }

    // Second live IIFE: if still in the disk, try a dest with pad >= 3.3.
    if (np.dist < SPIKE_HIT_R && (view.spikesUp || safe < exitEta + 0.08)) {
      const dest = farSafe(px, pz, dir);
      if (dest) {
        const keys = followTo(px, pz, dest.x, dest.z, dir, out.wi, [px, pz]);
        if (!wouldFall(px, pz, keys, 0.4)) {
          out.keys = keys; out.tx = dest.x; out.tz = dest.z;
          out.state = "leave-pad"; out.attack = false;
          return out;
        }
      }
    }
    return out;
  }

  return {
    reset: reset,
    step: step,
    reverse: function () { return base.reverse(); },
    name: "v30",
    getWi: function () { return base.getWi(); },
    getDir: function () { return base.getDir(); }
  };
}

function createV31Brain() {
  // v29 (dt-aware, no live-style leave-pad) + watchdog + conservative 2.5-disk
  // gating: do not enter while spikes are up or safeTime < CROSS; if already
  // inside, step away from the pad (the ring direction that increases pad
  // distance), never through it toward the corner.
  const base = createV29Brain();
  const CROSS = 0.70;
  let lastX = null, lastZ = null, lastMoveT = 0;
  const dts = new Float64Array(8);
  let dtN = 0, dtI = 0;

  function reset(opt) {
    lastX = null; lastZ = null; lastMoveT = 0;
    dtN = 0; dtI = 0;
    base.reset(opt);
  }
  function empty() {
    return { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
  }
  function axisKeysToward(px, pz, tx, tz) {
    const k = empty();
    if (Math.abs(tx - px) >= Math.abs(tz - pz)) {
      if (tx > px + 0.08) k.ArrowRight = true;
      else if (tx < px - 0.08) k.ArrowLeft = true;
    } else {
      if (tz > pz + 0.08) k.ArrowDown = true;
      else if (tz < pz - 0.08) k.ArrowUp = true;
    }
    return k;
  }
  function recentDt() {
    if (dtN < 1) return 1 / 60;
    let mx = 1 / 60;
    for (let i = 0; i < dtN; i++) if (dts[i] > mx) mx = dts[i];
    return Math.min(0.1, mx);
  }
  function onOuter(px, pz) {
    return Math.abs(Math.abs(px) - 24) <= 0.85 || Math.abs(Math.abs(pz) - 24) <= 0.85;
  }
  function padUnsafe(view) {
    const safe = view && view.safeTime != null ? view.safeTime : 2;
    return !!(view && (view.spikesUp || safe < CROSS));
  }
  function predicted(px, pz, keys, t) {
    const ka = kaFromKeys(keys);
    if (ka == null) return [px, pz];
    const d = worldDirFromKa(ka, YAW_RAD);
    return [px + d[0] * SPD * t, pz + d[1] * SPD * t];
  }
  function keysAway(px, pz, dir, wi) {
    const now = nearestPad(px, pz).dist;
    const n = RING.length;
    const us = ringIndexNear(px, pz);
    dir = dir || 1;
    for (const d of [-dir, dir]) {
      for (const steps of [1, 2, 3, 4, 5]) {
        const c = ringCell(((us + d * steps) % n + n) % n);
        if (!isPb(c[0], c[1])) continue;
        const keys = followTo(px, pz, c[0], c[1], d, wi, [px, pz]);
        if (wouldFall(px, pz, keys, 0.3)) continue;
        const look = Math.max(0.15, recentDt());
        const pred = predicted(px, pz, keys, look);
        if (!isPb(pred[0], pred[1]) || !onOuter(pred[0], pred[1])) continue;
        if (nearestPad(pred[0], pred[1]).dist > now + 0.05) {
          return { keys: keys, x: c[0], z: c[1] };
        }
      }
    }
    return null;
  }
  function alongWatch(px, pz, dir, wi) {
    const us = ringIndexNear(px, pz);
    const n = RING.length;
    dir = dir || 1;
    for (const steps of [2, 3, 1, 4, 5]) {
      const c = ringCell(((us + dir * steps) % n + n) % n);
      if (!isPb(c[0], c[1])) continue;
      if (nearestPad(c[0], c[1]).dist < SPIKE_HIT_R) continue;
      const keys = followTo(px, pz, c[0], c[1], dir, wi, [px, pz]);
      if (wouldFall(px, pz, keys, 0.4)) continue;
      const pred = predicted(px, pz, keys, 0.15);
      if (!isPb(pred[0], pred[1]) || !onOuter(pred[0], pred[1])) continue;
      if (nearestPad(pred[0], pred[1]).dist < SPIKE_HIT_R) continue;
      return { keys: keys, x: c[0], z: c[1] };
    }
    return null;
  }

  function step(px, pz, t0, view) {
    if (view && view.dt > 0 && view.dt < 2) {
      dts[dtI % 8] = view.dt; dtI++; if (dtN < 8) dtN++;
    }
    const out = base.step(px, pz, t0, view);
    const moved = lastX == null || Math.hypot(px - lastX, pz - lastZ) > 0.12;
    if (moved) lastMoveT = t0;
    lastX = px; lastZ = pz;
    const keysOn = out.keys && (out.keys.ArrowUp || out.keys.ArrowDown || out.keys.ArrowLeft || out.keys.ArrowRight);
    if (!moved && !keysOn && t0 - lastMoveT > 3) {
      const go = alongWatch(px, pz, out.loopDir || 1, out.wi);
      if (go) {
        out.keys = go.keys; out.tx = go.x; out.tz = go.z;
        out.state = "watchdog"; out.attack = false;
        lastMoveT = t0;
      }
    }

    // Conservative gate: never ENTER the 2.5 disk when spikes are up or the
    // remaining down window cannot cover a crossing. Once inside during a
    // still-safe down window, finish the crossing — do not abort mid-way
    // just because remaining safeTime dropped below CROSS. Only back away
    // if spikes are already up, or if there is not enough time to exit.
    const look = Math.max(0.15, recentDt());
    const pred = predicted(px, pz, out.keys || empty(), look);
    const nowD = nearestPad(px, pz).dist;
    const nextD = nearestPad(pred[0], pred[1]).dist;
    const nowIn = nowD < SPIKE_HIT_R;
    const nextIn = nextD < SPIKE_HIT_R;
    const safe = view && view.safeTime != null ? view.safeTime : 2;
    const up = !!(view && view.spikesUp);

    function retreat() {
      const go = keysAway(px, pz, out.loopDir || 1, out.wi);
      if (go) {
        out.keys = go.keys; out.tx = go.x; out.tz = go.z;
        out.state = "back-pad"; out.attack = false;
      } else {
        out.keys = empty();
        out.state = "wait-pad"; out.attack = false;
      }
    }

    if (up) {
      if (nowIn) retreat();
      else if (nextIn) { out.keys = empty(); out.state = "wait-pad"; out.attack = false; }
    } else if (!nowIn && nextIn && safe < CROSS) {
      out.keys = empty();
      out.state = "wait-pad"; out.attack = false;
    } else if (nowIn) {
      const goingDeeper = nextD < nowD - 0.02;
      const exitEta = goingDeeper ? (nowD + SPIKE_HIT_R) / 8 : Math.max(0, (SPIKE_HIT_R - nowD) / 8);
      if (safe < exitEta + 0.12) retreat();
    }
    return out;
  }

  return {
    reset: reset,
    step: step,
    reverse: function () { return base.reverse(); },
    name: "v31",
    getWi: function () { return base.getWi(); },
    getDir: function () { return base.getDir(); }
  };
}


function createV32Brain(kind) {
  // kind: "32.1" water, "32.2" dodge, "32.3" both, "33" all blades, "34" tight blades + noodle cooldown,
  // "35" conservative late-wave policy (regressed), "36" = v34 + three live-death patches only.
  const water = kind === "32.1" || kind === "32.3" || kind === "33" || kind === "34" || kind === "35" || kind === "36" || kind === "37" || kind === "38" || kind === "39" || kind === "40" || kind === "41" || kind === "42" || kind === "45" || kind === "46" || kind === "47" || kind === "48";
  const dodge = kind === "32.2" || kind === "32.3";
  const allBlades = kind === "33" || kind === "34" || kind === "35" || kind === "36" || kind === "37" || kind === "38" || kind === "39" || kind === "40" || kind === "41" || kind === "42" || kind === "45" || kind === "46" || kind === "47" || kind === "48";
  const tight = kind === "34" || kind === "35" || kind === "36" || kind === "37" || kind === "38" || kind === "39" || kind === "40" || kind === "41" || kind === "42" || kind === "45" || kind === "46" || kind === "47" || kind === "48";
  const v35 = kind === "35";
  const v36 = kind === "36" || kind === "37" || kind === "38" || kind === "39";
  const v37 = kind === "37" || kind === "38" || kind === "39";
  const v38 = kind === "38" || kind === "39";
  const v39 = kind === "39";
  const v40 = kind === "40" || kind === "41" || kind === "42" || kind === "45" || kind === "46" || kind === "47" || kind === "48";
  const v41 = kind === "41" || kind === "42" || kind === "45" || kind === "46" || kind === "47" || kind === "48";
  const v42 = kind === "42";
  const v45 = kind === "45";
  const v46 = kind === "46";
  const v47 = kind === "47" || kind === "48";
  const v48 = kind === "48";
  const V48_LURE_R = 6;
  // Baked after the v47 sweep: R=6, T=2 s, axe-only, no auto red/blue
  // (that set passed replay 0–1 hits both loopDirs and official 6x3
  // 19.67/19.33/17.00 = 18.67, 0 water/spike).
  const V47_R = 6;
  const V47_T = 2;
  const V47_BLADE = false;
  const V47_MELEE = false;
  const SLIM = false;
  const NOSTAB = false;
  const NOBLADE = false;
  const base = createV31Brain();
  const CROSS = 0.70;
  let lastX = null, lastZ = null, lastMoveT = 0;
  let lastAtk = -99;
  let orbBaitDir = 0;
  let lastBladeUseT = -999;
  let lastBladeEndT = -999;
  let lastBladePaid = true;
  let lastGreenDash = false;
  let stallSince = 0, stallKills = 0, stallWave = 0, spikeWaitT = 0, spikeWaitKey = "";
  let noodleSince = 0, noodleCoolUntil = 0;
  let commitUntil = -1, commitKeys = null, commitX = 0, commitZ = 0, lastFlipT = -999, prevKeys = null;
  let axeFleeUntil = -1, axeFleeKeys = null, axeFleeX = 0, axeFleeZ = 0;
  let yoyoUntil = -1, yoyoKeys = null, yoyoLastKeys = null;
  let outHoldX = null, outHoldZ = null;
  let dirFlips = 0, jitterTime = 0, lastJitT = 0, lastJitX = null, lastJitZ = null;
  let v41Dts = [1 / 60, 1 / 60, 1 / 60, 1 / 60], v41DtI = 0;

  function reset(opt) {
    lastX = null; lastZ = null; lastMoveT = 0;
    lastAtk = -99;
    orbBaitDir = 0;
    lastBladeUseT = -999;
    lastBladeEndT = -999;
    lastBladePaid = true;
    noodleSince = 0; noodleCoolUntil = 0;
    commitUntil = -1; commitKeys = null; lastFlipT = -999; prevKeys = null;
    axeFleeUntil = -1; axeFleeKeys = null; axeFleeX = 0; axeFleeZ = 0;
    yoyoUntil = -1; yoyoKeys = null; yoyoLastKeys = null;
    dirFlips = 0; jitterTime = 0; lastJitT = 0; lastJitX = null; lastJitZ = null;
    v41Dts = [1 / 60, 1 / 60, 1 / 60, 1 / 60]; v41DtI = 0;
    base.reset(opt);
  }
  function empty() {
    return { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
  }
  function axisKeysToward(px, pz, tx, tz) {
    const k = empty();
    if (Math.abs(tx - px) >= Math.abs(tz - pz)) {
      if (tx > px + 0.08) k.ArrowRight = true;
      else if (tx < px - 0.08) k.ArrowLeft = true;
    } else {
      if (tz > pz + 0.08) k.ArrowDown = true;
      else if (tz < pz - 0.08) k.ArrowUp = true;
    }
    return k;
  }
  function onKeys(k) { return !!(k && (k.ArrowUp || k.ArrowDown || k.ArrowLeft || k.ArrowRight)); }
  function opposite(a, b) {
    if (!a || !b) return false;
    return (a.ArrowLeft && b.ArrowRight) || (a.ArrowRight && b.ArrowLeft) ||
      (a.ArrowUp && b.ArrowDown) || (a.ArrowDown && b.ArrowUp);
  }
  function copyKeys(k) {
    return { ArrowUp: !!(k && k.ArrowUp), ArrowDown: !!(k && k.ArrowDown), ArrowLeft: !!(k && k.ArrowLeft), ArrowRight: !!(k && k.ArrowRight) };
  }
  function inwardKeys(px, pz) {
    const k = empty();
    if (px > 24.2) k.ArrowLeft = true;
    else if (px < -24.2) k.ArrowRight = true;
    if (pz > 24.2) k.ArrowUp = true;
    else if (pz < -24.2) k.ArrowDown = true;
    return k;
  }
  function along(px, pz, dir, wi) {
    const us = ringIndexNear(px, pz);
    const n = RING.length;
    dir = dir || 1;
    for (const steps of [2, 3, 1, 4]) {
      const c = ringCell(((us + dir * steps) % n + n) % n);
      if (!isPb(c[0], c[1])) continue;
      return { keys: followTo(px, pz, c[0], c[1], dir, wi, [px, pz]), x: c[0], z: c[1] };
    }
    return null;
  }
  function alongRail(px, pz, dir, wi) {
    // Yield/kite dests must stay on the current 24-rail at corners.
    // Plain along() can pick a cell on the other rail; axis-only keys then
    // walk the larger delta through the well (official waters at the inner lip).
    const us = ringIndexNear(px, pz);
    const n = RING.length;
    dir = dir || 1;
    const atC = Math.abs(px) > 18 && Math.abs(pz) > 18;
    const onEW = Math.abs(Math.abs(px) - 24) <= 1.2 && Math.abs(Math.abs(pz) - 24) > 1.5;
    const onNS = Math.abs(Math.abs(pz) - 24) <= 1.2 && Math.abs(Math.abs(px) - 24) > 1.5;
    for (const steps of [2, 3, 1, 4]) {
      const c = ringCell(((us + dir * steps) % n + n) % n);
      if (!isPb(c[0], c[1])) continue;
      if (atC && onEW && Math.abs(Math.abs(c[0]) - 24) > 0.1) continue;
      if (atC && onNS && Math.abs(Math.abs(c[1]) - 24) > 0.1) continue;
      const keys = followTo(px, pz, c[0], c[1], dir, wi, [px, pz]);
      if (keys && !wouldFall(px, pz, keys, 0.3) && !wouldFallLag(px, pz, keys, 0.3)) {
        return { keys, x: c[0], z: c[1] };
      }
    }
    return along(px, pz, dir, wi);
  }
  function stabilize(keys, t0, px, pz, emergency, state) {
    let speed = 99;
    if (lastJitX != null && lastJitT > 0) {
      const dtj = t0 - lastJitT, disp = Math.hypot(px - lastJitX, pz - lastJitZ);
      if (dtj > 0 && dtj < 0.2) {
        speed = disp / dtj;
        if (onKeys(prevKeys) && speed < 0.3) jitterTime += dtj;
      }
    }
    lastJitX = px; lastJitZ = pz; lastJitT = t0;
    // If keys have been held while barely moving for >0.12 s, this is the
    // live oscillation — release them. A real MOVE exceeds 0.3 u/s within
    // one or two frames, so we do not delay ring travel or commit a direction.
    if (!emergency && onKeys(prevKeys) && onKeys(keys) && speed < 0.3 && (t0 - lastMoveT) > 0.12) {
      if (prevKeys && opposite(keys, prevKeys)) { dirFlips++; lastFlipT = t0; }
      prevKeys = empty();
      return empty();
    }
    if (onKeys(keys) && speed >= 0.3) lastMoveT = t0;
    if (prevKeys && opposite(keys, prevKeys)) { dirFlips++; lastFlipT = t0; }
    prevKeys = copyKeys(keys);
    return keys;
  }

  function step(px, pz, t0, view) {
    const out = base.step(px, pz, t0, view);
    if (v41 && view && view.dt > 0 && view.dt < 2) {
      v41Dts[v41DtI % v41Dts.length] = view.dt;
      v41DtI++;
    }
    function padUnsafe(viewX, x, z) {
      if (viewX && viewX.spikesUp) return nearestPad(x, z).dist < SPIKE_HIT_R + 0.05;
      if (viewX && (viewX.safeTime || 2) < 0.70) return nearestPad(x, z).dist < SPIKE_HIT_R + 0.05;
      return false;
    }
    function meleeClose(viewX, x, z, r) {
      const es = (viewX && viewX.enemies) || [];
      for (let i = 0; i < es.length; i++) {
        const e = es[i];
        if (!e) continue;
        if (e.type === "grunt" || e.type === "snake" || e.type === "axe" || e.type === "shield" || e.type === "boss" || e.type === "boss2") {
          if (Math.hypot((e.x || 0) - x, (e.z || 0) - z) < r) return true;
        }
      }
      return false;
    }
    if (v41 && (out.state === "yield" || (v42 && (out.state === "abort-plank" || (meleeClose(view, px, pz, 6) && !onKeys(out.keys || empty())))))) {
      // v40 died live in 'yield' (standing). v41 live died in abort-plank
      // next to a grunt — keep moving along the ring with axis-only keys.
      // Do not walk onto a hot pad (first v42 hitch had 2 spike deaths).
      const waitingPad = /^(hold-spike|wait-pad|time-spike|stage-spike|back-pad)$/.test(out.state || "");
      if (!(v42 && waitingPad && padUnsafe(view, px, pz))) {
        const dirK = base.getDir ? base.getDir() : 1;
        const wiK = base.getWi ? base.getWi() : 0;
        const go = alongRail(px, pz, dirK, wiK) || alongRail(px, pz, -dirK, wiK);
        if (go && go.keys && !(v42 && padUnsafe(view, go.x, go.z))) {
          out.keys = go.keys; out.tx = go.x; out.tz = go.z;
          out.state = (out.state === "abort-plank" && v42) ? "abort-plank" : "kite";
        }
      }
    }
    if (tight) {
      const hpN = view && view.hp != null ? view.hp : 5;
      const waveN = (view && view.wave) || 0;
      const enemiesN = (view && view.enemies) || [];
      let noodleThreat = false;
      for (const e of enemiesN) {
        const d = Math.hypot(e.x - px, e.z - pz);
        if ((e.type === "axe" || e.type === "shield" || e.type === "boss" || e.type === "boss2") && d < 12) noodleThreat = true;
        if (d < 3.2) noodleThreat = true;
      }
      let wantNoodle = hpN <= 3 || (hpN <= 4 && !noodleThreat && waveN < 13);
      if (waveN >= 13 && hpN > 2) wantNoodle = false;
      if (noodleThreat) wantNoodle = hpN <= 2;
      if (v40) {
        wantNoodle = hpN <= 4 && !noodleThreat;
        if (noodleThreat) wantNoodle = hpN <= 2;
      }
      if (out.state === "noodle") {
        const abort = function () {
          const go = along(px, pz, out.loopDir || 1, out.wi);
          if (go && go.keys) { out.keys = go.keys; out.tx = go.x; out.tz = go.z; }
          out.state = "loop";
          noodleSince = 0;
        };
        if (!wantNoodle || t0 < noodleCoolUntil) {
          abort();
        } else {
          if (!noodleSince) noodleSince = t0;
          const tx = out.tx, tz = out.tz;
          if (t0 - noodleSince > 2.5 && tx != null && Math.hypot(tx - px, tz - pz) > 1.2) {
            noodleCoolUntil = t0 + 8;
            abort();
          }
        }
      } else {
        noodleSince = 0;
      }
    }
    // v34 live fidelity: dodge an orb at 4.5 along the ring (the same
    // logic later versions also apply inside the v36 block).
    if (tight && !v36 && !v40) {
      const fbs34 = (view && view.fireballs) || [];
      let threat34 = null, bestF34 = 99;
      for (const f of fbs34) {
        const fd = Math.hypot(f.x - px, f.z - pz);
        if (fd < 4.5 && fd < bestF34) { bestF34 = fd; threat34 = f; }
      }
      const onRing34 = Math.abs(Math.abs(px) - 24) <= 1.0 || Math.abs(Math.abs(pz) - 24) <= 1.0;
      if (threat34 && onRing34) {
        const dest34 = along(px, pz, out.loopDir || 1, out.wi);
        if (dest34 && dest34.keys && !wouldFall(px, pz, dest34.keys, 0.4)) {
          out.keys = dest34.keys; out.tx = dest34.x; out.tz = dest34.z; out.state = "dodge-orb";
        }
      }
    }
    if (v40) {
      const fbs = (view && view.fireballs) || [];
      const waiting = /spike|wait-pad|wait-round|stage|lure|hold/.test(out.state || "");
      const onRing = Math.abs(Math.abs(px) - 24) <= 1.0 || Math.abs(Math.abs(pz) - 24) <= 1.0;
      function ringDist(x, z) {
        return Math.min(Math.abs(Math.abs(x) - 24), Math.abs(Math.abs(z) - 24));
      }
      function atCornerPt(x, z) {
        return Math.abs(x) > 18 && Math.abs(z) > 18;
      }
      function knockbackSafe(x, z) {
        // Spike knockback starts at speed 9 and decays at 5/s ≈ 1.8 units of travel.
        const np = nearestPad(x, z);
        if (!np || !np.pad || np.dist >= SPIKE_HIT_R + 0.3) return isPb(x, z);
        const dx = x - np.pad[0], dz = z - np.pad[1], L = Math.hypot(dx, dz) || 1;
        return isPb(x + dx / L * 2.0, z + dz / L * 2.0);
      }
      function inSafeBand(x, z) {
        if (!isPb(x, z)) return false;
        if (atCornerPt(x, z) && ringDist(x, z) > 1.0) return false;
        if (!knockbackSafe(x, z)) return false;
        return true;
      }
      function alongOrb(px2, pz2, dir, wi2) {
        // At corners, only follow the current 24-rail (never a chord through
        // the moat toward the other rail — that was the C4 water death).
        const us = ringIndexNear(px2, pz2);
        const n = RING.length;
        const corner = v41 && atCornerPt(px2, pz2);
        const railX = Math.abs(px2) >= Math.abs(pz2) - 2;
        for (const steps of [2, 3, 1, 4]) {
          const idx = ((us + dir * steps) % n + n) % n;
          const c = ringCell(idx);
          if (!isPb(c[0], c[1])) continue;
          if (corner) {
            if (railX && Math.abs(Math.abs(c[0]) - 24) > 0.1) continue;
            if (!railX && Math.abs(Math.abs(c[1]) - 24) > 0.1) continue;
          }
          if (v41 && !inSafeBand(c[0], c[1])) continue;
          const keys = followTo(px2, pz2, c[0], c[1], dir, wi2, [px2, pz2]);
          if (!keys || wouldFall(px2, pz2, keys, 0.4) || wouldFallLag(px2, pz2, keys, 0.4)) continue;
          if (v41) {
            const ka = kaFromKeys(keys);
            if (ka != null) {
              const d = worldDirFromKa(ka, YAW_RAD);
              const nx = px2 + d[0] * SPD * 0.45, nz = pz2 + d[1] * SPD * 0.45;
              if (!inSafeBand(nx, nz)) continue;
            }
          }
          return { keys, x: c[0], z: c[1] };
        }
        return null;
      }
      let threat = null;
      for (const f of fbs) {
        const fd = Math.hypot(f.x - px, f.z - pz);
        if (fd < 10 && (!threat || fd < threat.d)) threat = { x: f.x, z: f.z, d: fd, vx: f.vx || 0, vz: f.vz || 0 };
      }
      if (threat && (onRing || waiting)) {
        const pickAlong = v41 ? alongOrb : function (x, z, d, w) { return along(x, z, d, w); };
        const goL = pickAlong(px, pz, out.loopDir || 1, out.wi);
        const goP = pickAlong(px, pz, 1, out.wi);
        const goN = pickAlong(px, pz, -1, out.wi);
        function missOf(go) {
          if (!go || !go.keys || wouldFall(px, pz, go.keys, 0.4)) return -1e9;
          const L = Math.hypot(go.x - px, go.z - pz) || 1;
          const nx = px + (go.x - px) / L * 2.4, nz = pz + (go.z - pz) / L * 2.4;
          if (!isPb(nx, nz)) return -1e9;
          if ((Math.abs(Math.abs(nx) - 24) > 1.2 && Math.abs(Math.abs(nz) - 24) > 1.2)) return -1e9;
          if (v41 && !inSafeBand(nx, nz)) return -1e9;
          for (const e of (view.enemies || [])) {
            const d2 = Math.hypot(e.x - nx, e.z - nz);
            if ((e.type === "axe" || e.type === "boss" || e.type === "boss2") && d2 < 3.5) return -1e9;
          }
          const vL = Math.hypot(threat.vx, threat.vz);
          if (vL < 0.35) {
            const ox = px - threat.x, oz = pz - threat.z, oL = Math.hypot(ox, oz) || 1;
            return Math.abs((nx - px) * (-oz / oL) + (nz - pz) * (ox / oL));
          }
          const wx = nx - threat.x, wz = nz - threat.z;
          const tt = (wx * threat.vx + wz * threat.vz) / (vL * vL);
          const cx = threat.x + threat.vx * Math.max(0, tt), cz = threat.z + threat.vz * Math.max(0, tt);
          return Math.hypot(nx - cx, nz - cz);
        }
        if (threat.d <= 3) {
          const sL = missOf(goL), sP = missOf(goP), sN = missOf(goN);
          let pick = goL, score = sL;
          // At a corner, do not switch to a sidestep that leaves the current rail.
          if (!(v41 && atCornerPt(px, pz))) {
            if (sP > score + 0.8) { pick = goP; score = sP; }
            if (sN > score + 0.8) { pick = goN; score = sN; }
          }
          if (pick && pick.keys && score > 0.4) {
            out.keys = pick.keys; out.tx = pick.x; out.tz = pick.z; out.state = "sidestep-orb";
          }
        } else if (threat.d < 4.5 && onRing && goL && goL.keys && !wouldFall(px, pz, goL.keys, 0.4)) {
          out.keys = goL.keys; out.tx = goL.x; out.tz = goL.z; out.state = "dodge-orb";
        } else if (waiting && threat.d <= 8 && goL && goL.keys && !wouldFall(px, pz, goL.keys, 0.4)) {
          out.keys = goL.keys; out.tx = goL.x; out.tz = goL.z; out.state = "bait-orb";
        }
      }
    }
        const dir = out.loopDir || 1;
    const wi = out.wi;
    const enemies = (view && view.enemies) || [];
    if (v35) {
      const fbs = (view && view.fireballs) || [];
      let threat = null, bestF = 99;
      for (const f of fbs) {
        const fd = Math.hypot(f.x - px, f.z - pz);
        if (fd < 8 && fd < bestF) { bestF = fd; threat = f; }
      }
      if (threat) {
        function onRingPt(x, z) {
          return Math.abs(Math.abs(x) - 24) <= 1.0 || Math.abs(Math.abs(z) - 24) <= 1.0;
        }
        function orbScore(dest) {
          if (!dest || !onRingPt(dest.x, dest.z)) return -1e9;
          const dx = dest.x - px, dz = dest.z - pz, L = Math.hypot(dx, dz) || 1;
          const nx = px + dx / L * 2.8, nz = pz + dz / L * 2.8;
          if (!isPb(nx, nz) || !onRingPt(nx, nz) || wouldFall(px, pz, dest.keys || empty(), 0.3)) return -1e9;
          const oxd = px - threat.x, ozd = pz - threat.z, oL = Math.hypot(oxd, ozd) || 1;
          const ox2 = threat.x + oxd / oL * 2.2, oz2 = threat.z + ozd / oL * 2.2;
          let score = Math.hypot(nx - ox2, nz - oz2);
          for (const e of enemies) {
            const d2 = Math.hypot(e.x - nx, e.z - nz);
            if ((e.type === "axe" || e.type === "boss" || e.type === "boss2") && d2 < 3.5) score -= 8;
            if ((e.type === "shield" || e.type === "grunt") && d2 < 2.2) score -= 3;
          }
          return score;
        }
        const candA = along(px, pz, 1, wi), candB = along(px, pz, -1, wi);
        const dest = (orbScore(candA) >= orbScore(candB)) ? candA : candB;
        if (dest && dest.keys && orbScore(dest) > 0.5 && !wouldFall(px, pz, dest.keys, 0.3)) {
          out.keys = dest.keys; out.tx = dest.x; out.tz = dest.z; out.state = "dodge-orb";
        }
      }
    }
    if (v36) {
      const fbs = (view && view.fireballs) || [];
      const hpN = (view && view.hp != null) ? view.hp : 5;
      const hasFb8 = fbs.some((f) => Math.hypot(f.x - px, f.z - pz) < (v38 ? 12 : 8));
      const medusaNear = enemies.some((e) => e.type === "medusa" && Math.hypot(e.x - px, e.z - pz) <= 13);
      // v38: same any-orb abort as v36/v37, plus abort at HP<=3 if a medusa
      // is in shoot range. Do not ban lure at low HP or near a medusa alone.
      const lureBad = hasFb8 || fbs.length > 0 || (v38 && hpN <= 3 && medusaNear) || (v39 && hpN <= 2.5);
      if (out.state === "lure-spike" && lureBad) {
        const go = along(px, pz, out.loopDir || 1, out.wi);
        if (go && go.keys && !wouldFall(px, pz, go.keys, 0.45)) {
          out.keys = go.keys; out.tx = go.x; out.tz = go.z; out.state = "abort-lure";
        } else {
          out.state = "loop";
        }
      }
      function onRingPt36(x, z) {
        return Math.abs(Math.abs(x) - 24) <= 1.0 || Math.abs(Math.abs(z) - 24) <= 1.0;
      }
      // v34 live dodge range (4.5), plus reject a landing within axe/boss reach.
      let threat = null, bestF = 99;
      for (const f of fbs) {
        const fd = Math.hypot(f.x - px, f.z - pz);
        if (fd < ((v38 && (out.state === "lure-spike" || out.state === "abort-lure")) ? 8 : 4.5) && fd < bestF) { bestF = fd; threat = f; }
      }
      if (threat && onRingPt36(px, pz)) {
        function destOk(dest) {
          if (!dest || !dest.keys) return false;
          const dx = dest.x - px, dz = dest.z - pz, L = Math.hypot(dx, dz) || 1;
          const nx = px + dx / L * 2.8, nz = pz + dz / L * 2.8;
          if (!isPb(nx, nz) || !onRingPt36(nx, nz) || wouldFall(px, pz, dest.keys, 0.3)) return false;
          for (const e of enemies) {
            const d2 = Math.hypot(e.x - nx, e.z - nz);
            if ((e.type === "axe" || e.type === "boss" || e.type === "boss2") && d2 <= 3.5) return false;
          }
          return true;
        }
        let dest = along(px, pz, out.loopDir || 1, out.wi);
        if (!destOk(dest)) dest = along(px, pz, -(out.loopDir || 1), out.wi);
        if (destOk(dest)) {
          out.keys = dest.keys; out.tx = dest.x; out.tz = dest.z; out.state = "dodge-orb";
        }
      }
    }
    const nearEn = enemies.filter((e) => Math.hypot(e.x - px, e.z - pz) < 6.5);
    const knockNear = enemies.some((e) => Math.hypot(e.x - px, e.z - pz) < 5);
    const dartUnsafe = view && view.traps ? false : false;
    const trapThreat = (typeof view.dartThreat === "boolean") ? view.dartThreat :
      (require("traps").createTraps ? null : null);
    // Prefer traps.threatAt via view if present; otherwise nearest dart / lane.
    let laneBad = false;
    try {
      const trapsMod = require("traps");
      // use global helper if exported
      laneBad = (trapsMod.onDartLane && trapsMod.onDartLane(px, pz) && view &&
        (view.darts || []).length >= 0) ?
        (function () {
          const t = view.trapTime != null ? view.trapTime : t0;
          // Rebuild threat with tick from view.spikeTick or trapTime
          const tick = (view.spikeTick != null ? view.spikeTick : 0) % 1000;
          const fireIn = ((500 - tick + 1000) % 1000) / 400;
          const sinceFire = tick >= 500 ? (tick - 500) / 400 : 99;
          if (trapsMod.onDartLane(px, pz) && (fireIn < 0.40 || sinceFire < 0.40)) return true;
          const darts = view.darts || [];
          for (const d of darts) {
            const fx = d.fx != null ? d.fx : (d.forward && d.forward.x) || 0;
            const fz = d.fz != null ? d.fz : (d.forward && d.forward.z) || 0;
            const along = (px - d.x) * fx + (pz - d.z) * fz;
            const side = Math.abs((px - d.x) * (-fz) + (pz - d.z) * fx);
            if (along > -2 && along < 8 && side < 2.0) return true;
          }
          return false;
        })() : false;
    } catch (e) { laneBad = false; }

    let emergency = false;
    if (!SLIM) {

    // Arrow: leave a hot firing line along the ring; never stand in it.
    // If the next step would enter a hot lane, cancel that step.
    try {
      const trapsMod = require("traps");
      const onLane = trapsMod.onDartLane;
      if (onLane && laneBad && onLane(px, pz)) {
        const go = along(px, pz, dir, wi);
        const leave = go && onLane && !onLane(go.x, go.z) && !wouldFall(px, pz, go.keys, 0.25);
        if (leave) {
          out.keys = go.keys; out.tx = go.x; out.tz = go.z; out.state = "dodge-arrow";
          emergency = true;
        } else {
          const goR = along(px, pz, -dir, wi);
          if (goR && !onLane(goR.x, goR.z) && !wouldFall(px, pz, goR.keys, 0.25)) {
            out.keys = goR.keys; out.tx = goR.x; out.tz = goR.z; out.state = "dodge-arrow";
            emergency = true;
          }
        }
      } else if (onLane && out.keys) {
        const nx = px + (out.keys.ArrowRight ? 1 : out.keys.ArrowLeft ? -1 : 0);
        const nz = pz + (out.keys.ArrowDown ? 1 : out.keys.ArrowUp ? -1 : 0);
        // crude next-pos peek: if already off a lane, don't step onto a hot one
        if (!onLane(px, pz) && onLane(nx, nz) && laneBad) {
          out.keys = empty();
          out.state = "wait-arrow";
        }
      }
    } catch (e) { /* keep base keys */ }

    if (!allBlades) {
    // Don't auto-pick a non-red blade at a corner (pickup < 1.5). A held green/yellow/blue
    // blocks picking red for the rest of the run because we never activate those colours.
    const blades = (view && view.blades) || [];
    const wantRed = view && (view.heldBlade == null || view.heldBlade < 0) && (t0 - lastBladeUseT >= 15);
    for (const b of blades) {
      if (b.color == null || b.color < 0) continue;
      const dB = Math.hypot(b.x - px, b.z - pz);
      if (dB < 2.2 && !(b.color === 1 && wantRed)) {
        const sx = b.x >= 0 ? 1 : -1, sz = b.z >= 0 ? 1 : -1;
        const dx = b.x - 1.8 * sx, dz = b.z - 1.8 * sz;
        if (isPb(dx, dz) && !isSpikeCell(dx, dz) && nearestPad(dx, dz).dist >= 2.5) {
          const keys = followTo(px, pz, dx, dz, dir, wi, [px, pz]);
          if (!wouldFall(px, pz, keys, 0.25)) {
            out.keys = keys; out.tx = dx; out.tz = dz; out.state = "skirt-blade";
          }
        }
        break;
      }
    }

    }

    if (dodge) {
      const st = out.state || "";
      if (st === "cut-inner" && nearEn.length) {
        const go = along(px, pz, -dir, wi);
        if (go && !wouldFall(px, pz, go.keys, 0.3) && (Math.abs(Math.abs(go.x) - 24) <= 0.85 || Math.abs(Math.abs(go.z) - 24) <= 0.85)) {
          out.keys = go.keys; out.tx = go.x; out.tz = go.z;
          out.state = "yield";
        } else { out.keys = empty(); out.state = "yield"; }
      } else if (st === "yield") {
        const go = along(px, pz, -dir, wi);
        if (go && !wouldFall(px, pz, go.keys, 0.3) && (Math.abs(Math.abs(go.x) - 24) <= 0.85 || Math.abs(Math.abs(go.z) - 24) <= 0.85)) {
          out.keys = go.keys; out.tx = go.x; out.tz = go.z;
          out.state = "yield";
        }
      }
    }

    const waterOuter = Math.abs(px) > 24.2 || Math.abs(pz) > 24.2;
    if (water && waterOuter) {
      const k2 = inwardKeys(px, pz);
      if (onKeys(k2) && !wouldFall(px, pz, k2, 0.25)) {
        out.keys = k2;
        out.state = "edge-margin";
        emergency = true;
      }
    }

    }
    // Blade policy. v32.x: red only, 15s cooldown, discard other colours.
    // v33: use every colour deliberately; no discard; no global 15s cooldown
    // (the game already enforces one effect at a time and a 15s pad respawn).
    const held = view && view.heldBlade;
    const mode = (view && view.bladeMode) || 0;
    const active = mode > 0 || (view && view.bladeUntil > t0);
    if (tight && lastBladeUseT > -9 && view && view.bladeUntil != null && view.bladeUntil <= t0 && lastBladeEndT < lastBladeUseT) {
      lastBladeEndT = t0;
      const used = (view.bladeUses || []).slice(-1)[0];
      if (used) lastBladePaid = ((used.kills || 0) > 0 || (used.escapes || 0) > 0);
    }
    out.useBlade = false;
    out.bladeReason = null;
    out.discardBlade = false;
    out.dashFx = undefined;
    out.dashFz = undefined;
    if (!allBlades && !NOBLADE && held !== 1 && held != null && held >= 0) out.discardBlade = true;
    const spikeHot = !!(view && (view.spikesUp || (typeof inSpikeRadius === "function" && inSpikeRadius(px, pz)) || (view.safeTime != null && view.safeTime < 0.7 && nearestPad(px, pz).dist < 4)));
    const hp = view && view.hp != null ? view.hp : 5;
    const orb = (view.fireballs || []).some((f) => Math.hypot(f.x - px, f.z - pz) < (v35 ? 10 : 8)) ||
      (v35 && (view.fireballs || []).length > 0) ||
      enemies.some((e) => e.type === "medusa" && Math.hypot(e.x - px, e.z - pz) <= 13);
    const dBoss = enemies.reduce((m, e) => (e.type === "boss" || e.type === "boss2") ? Math.min(m, Math.hypot(e.x - px, e.z - pz)) : m, 99);
    const melee = enemies.some((e) => Math.hypot(e.x - px, e.z - pz) < 4);
    const hard = enemies.some((e) => (e.type === "axe" || e.type === "shield" || e.type === "boss" || e.type === "boss2") && Math.hypot(e.x - px, e.z - pz) < 8);
    const snakes = enemies.filter((e) => e.type === "snake" && Math.hypot(e.x - px, e.z - pz) < 8).length;

    function predictDash(fx, fz) {
      const L = Math.hypot(fx, fz);
      if (L < 1e-6) return null;
      let mx = (fx / L) * 7.5, mz = (fz / L) * 7.5;
      for (let i = 0; i < 3; i++) {
        const tx = px + mx, tz = pz + mz;
        if (isPb(tx, tz)) {
          const c = [ /* cell centre */ ];
          const cc = (typeof cellOf === "function") ? cellOf(tx, tz) : [tx, tz];
          return { x: cc[0], z: cc[1], fx: fx / L, fz: fz / L };
        }
        mx *= 0.66; mz *= 0.66;
      }
      return null;
    }
    function dashLandSafe(land) {
      if (!land || !isPb(land.x, land.z)) return false;
      if (Math.abs(land.x) > 25.2 || Math.abs(land.z) > 25.2) return false;
      if (!(Math.abs(Math.abs(land.x) - 24) <= 1.0 || Math.abs(Math.abs(land.z) - 24) <= 1.0)) return false;
      if (isSpikeCell(land.x, land.z) || inSpikeRadius(land.x, land.z)) return false;
      try {
        const trapsMod = require("traps");
        if (trapsMod.onDartLane && trapsMod.onDartLane(land.x, land.z) && view && view.threatAt && view.threatAt(land.x, land.z, 0.25)) return false;
      } catch (e) {}
      return true;
    }
    function bestDash() {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      const go = along(px, pz, dir, wi);
      if (go) dirs.unshift([go.x - px, go.z - pz]);
      let best = null;
      const fb = (view.fireballs || []).reduce((m, f) => Math.min(m, Math.hypot(f.x - px, f.z - pz)), 99);
      for (const d of dirs) {
        const land = predictDash(d[0], d[1]);
        if (!dashLandSafe(land)) continue;
        const ringDist = Math.min(Math.abs(Math.abs(land.x) - 24), Math.abs(Math.abs(land.z) - 24));
        let score = -ringDist;
        if (fb < 8) score += 3;
        let close = 99;
        for (const e of enemies) {
          const ed = Math.hypot(e.x - land.x, e.z - land.z);
          if (ed < close) close = ed;
        }
        if (close > 0.8 && close < 3.2) score += 5;
        if (melee && Math.hypot(land.x - px, land.z - pz) > 3) score += 4;
        if (!best || score > best.score) best = { land, score, reason: (fb < 8 || melee) ? "green-escape" : "green-close" };
      }
      return best;
    }

    if (allBlades) {
      if (mode === 4) {
        const rp = view.rewindPos;
        const rpOk = rp && isPb(rp.x, rp.z) && !inSpikeRadius(rp.x, rp.z) && (Math.abs(Math.abs(rp.x) - 24) <= 1.2 || Math.abs(Math.abs(rp.z) - 24) <= 1.2);
        if (rpOk && (hp < (rp.hp || hp) || wouldFall(px, pz, out.keys || empty(), 0.2) || hp <= 1)) {
          out.useBlade = true;
          out.bladeReason = hp <= 1 || (rp && hp < rp.hp) ? "yellow-rewind-hp" : "yellow-escape-fall";
        }
      } else if (mode === 3 && !lastGreenDash) {
        const plan = bestDash();
        if (plan && plan.land) {
          out.useBlade = true;
          out.dashFx = plan.land.fx;
          out.dashFz = plan.land.fz;
          out.bladeReason = plan.reason;
          lastGreenDash = true;
          const face = axisKeysToward(px, pz, px + plan.land.fx, pz + plan.land.fz);
          if (onKeys(face)) out.keys = face;
        }
      } else if (held >= 0 && !active) {
        lastGreenDash = false;
        const dTank = enemies.reduce((m, e) => {
          if (e.type === "axe" || e.type === "boss" || e.type === "boss2") {
            return Math.min(m, Math.hypot(e.x - px, e.z - pz));
          }
          return m;
        }, 99);
        let danger = (hp <= 2 && (melee || orb || hard)) || (view.fireballs || []).some((f) => Math.hypot(f.x - px, f.z - pz) < (v35 ? 8 : 5)) || (v35 && dBoss < 6 && orb);
        if (v40) {
          const fbD = (view.fireballs || []).reduce((m, f) => Math.min(m, Math.hypot(f.x - px, f.z - pz)), 99);
          const nearN = enemies.filter((e) => Math.hypot(e.x - px, e.z - pz) < 4).length;
          danger = (hp <= 3 && (melee || orb || hard)) || fbD < 8 || nearN >= 2 || (hard && hp <= 4);
        }
        const coolOk = !tight || danger || ((t0 - Math.max(lastBladeEndT, lastBladeUseT) >= 8) && (lastBladePaid || t0 - Math.max(lastBladeEndT, lastBladeUseT) >= 12));
        if (held === 1 && !spikeHot && coolOk) {
          let reason = null;
          if (hp <= 1 && (melee || orb || hard)) reason = "danger-hp";
          else if (v35 && dBoss < 6 && (orb || melee || hp <= 3)) reason = "red-boss";
          else if (melee) reason = "danger-melee";
          else if (hard && (!tight || dTank < 5.5)) reason = tight ? "advantage-tank" : "advantage-hard";
          else if ((view.waveAge || 0) > 90 && enemies.length >= 1 && (!tight || (hard && enemies.length <= 4))) reason = "advantage-stuck";
          if (reason) { out.useBlade = true; out.bladeReason = reason; lastBladeUseT = t0; }
        } else if (held === 0 && coolOk && !(view.spikesUp && (inSpikeRadius(px, pz) || isSpikeCell(px, pz)))) {
          let reason = null;
          if (orb) reason = "blue-orbs";
          else if (snakes >= (tight ? 3 : 2) && melee) reason = "blue-snakes";
          else if ((view.waveAge || 0) > 90 && enemies.length >= (tight ? 2 : 1)) reason = "blue-stuck";
          if (reason) { out.useBlade = true; out.bladeReason = reason; lastBladeUseT = t0; }
        } else if (held === 2 && coolOk) {
          const plan = bestDash();
          if (plan && plan.land) {
            const fb = (view.fireballs || []).reduce((m, f) => Math.min(m, Math.hypot(f.x - px, f.z - pz)), 99);
            const escapeOk = plan.reason === "green-escape" && (fb < (v40 ? 8 : 6) || (melee && hp <= 3) || (v40 && hp <= 2));
            const closeOk = plan.reason === "green-close" && plan.score >= 5;
            const looseOk = plan.reason === "green-escape" || plan.score >= 4 || hard;
            if ((tight && (escapeOk || closeOk)) || (!tight && looseOk)) {
              out.useBlade = true;
              out.dashFx = plan.land.fx;
              out.dashFz = plan.land.fz;
              out.bladeReason = plan.reason;
              lastBladeUseT = t0;
            }
          }
        } else if (held === 3 && coolOk && (v40 ? (melee || orb || hard || hp <= 4 || danger) : (v35 ? (hp <= 3 || (hp <= 4 && (melee || orb || hard))) : (melee || orb || hard || hp <= (tight ? 3 : 4))))) {
          out.useBlade = true;
          out.bladeReason = "yellow-arm";
          lastBladeUseT = t0;
        }
      }
    } else if (!NOBLADE && held === 1 && !active && t0 - lastBladeUseT >= 15 && !spikeHot) {
      let reason = null;
      if (hp <= 1 && (melee || orb || hard)) reason = "danger-hp";
      else if (orb) reason = "danger-orb";
      else if (melee) reason = "danger-melee";
      else if (hard) reason = "advantage-hard";
      else if ((view.waveAge || 0) > 90 && enemies.length >= 1 && enemies.length <= 3) reason = "advantage-stuck";
      if (reason) { out.useBlade = true; out.bladeReason = reason; lastBladeUseT = t0; }
    }

    if (allBlades) {
      const killsN = (view && view.kills != null) ? view.kills : stallKills;
      const waveN = (view && view.wave) || stallWave;
      if (killsN !== stallKills || waveN !== stallWave) {
        stallKills = killsN; stallWave = waveN; stallSince = t0;
      }
      // Stay on the ring. After 60s with no kill/wave progress, reverse
      // direction so a leftover (wave-6 axe, wave-13 shields) is not looped around forever.
      if (stallSince && t0 - stallSince > 60 && enemies.length) {
        if (typeof base.reverse === "function") base.reverse();
        stallSince = t0 - 20;
        out.state = "hunt-stall";
      }
    }

    function recoverToRing(x, z) {
      const k = empty();
      const ew = Math.abs(Math.abs(x) - 24), ns = Math.abs(Math.abs(z) - 24);
      if (ew <= ns) {
        if (x >= 0 && x < 23.85) k.ArrowRight = true;
        else if (x >= 0 && x > 24.15) k.ArrowLeft = true;
        else if (x < 0 && x > -23.85) k.ArrowLeft = true;
        else if (x < 0 && x < -24.15) k.ArrowRight = true;
      } else {
        if (z >= 0 && z < 23.85) k.ArrowDown = true;
        else if (z >= 0 && z > 24.15) k.ArrowUp = true;
        else if (z < 0 && z > -23.85) k.ArrowUp = true;
        else if (z < 0 && z < -24.15) k.ArrowDown = true;
      }
      return k;
    }
    if (v36) {
      const onRingNow = Math.abs(Math.abs(px) - 24) <= 1.0 || Math.abs(Math.abs(pz) - 24) <= 1.0;
      if (!onRingNow) {
        const rec = recoverToRing(px, pz);
        if (onKeys(rec) && !wouldFall(px, pz, rec, 0.2)) {
          out.keys = rec;
          out.state = "recover-ring";
          emergency = true;
        }
      }
    }
    if (v37) {
      const waitSt = /^(hold-spike|wait-pad|time-spike|stage-spike|wait-arrow|back-pad)$/.test(out.state || "");
      const waveN = (view && view.wave) || 1;
      const lateMul = waveN > 25 ? Math.min(waveN / 25, 1.5) : 1;
      let best = null;
      if (waitSt) {
        for (const e of enemies) {
          const d = Math.hypot(e.x - px, e.z - pz);
          let lim = 0;
          if (e.type === "shield" || e.type === "axe" || e.type === "boss" || e.type === "boss2") lim = 4 * lateMul;
          else if (e.type === "grunt") lim = 3.2 * lateMul;
          if (lim && d <= lim && (!best || d < best.d)) best = { e, d };
        }
      }
      if (best) {
        if (best.d <= 3.2) out.attack = true;
        function destScore(dest) {
          if (!dest || !dest.keys || wouldFall(px, pz, dest.keys, 0.3)) return -1e9;
          const dx = dest.x - px, dz = dest.z - pz, L = Math.hypot(dx, dz) || 1;
          const nx = px + dx / L * 2.4, nz = pz + dz / L * 2.4;
          if (!isPb(nx, nz)) return -1e9;
          if ((view.spikesUp || (view.safeTime != null && view.safeTime < 0.7)) && nearestPad(nx, nz).dist < 2.5) return -1e9;
          if (Math.abs(nx) > Math.abs(px) + 0.15 && Math.abs(nx) > 24.1) return -1e9;
          if (Math.abs(nz) > Math.abs(pz) + 0.15 && Math.abs(nz) > 24.1) return -1e9;
          return Math.hypot(nx - best.e.x, nz - best.e.z);
        }
        const a = along(px, pz, 1, out.wi), b = along(px, pz, -1, out.wi);
        const dest = destScore(a) >= destScore(b) ? a : b;
        if (dest && dest.keys && destScore(dest) > -1e8) {
          out.keys = dest.keys; out.tx = dest.x; out.tz = dest.z; out.state = "sidestep-melee";
        }
        const outerLip = (Math.abs(px) >= Math.abs(pz) && Math.abs(px) > 24.08) ||
                         (Math.abs(pz) >= Math.abs(px) && Math.abs(pz) > 24.08);
        if (outerLip) {
          const rec = recoverToRing(px, pz);
          if (onKeys(rec) && !wouldFall(px, pz, rec, 0.2)) {
            if (!onKeys(out.keys || empty())) out.keys = rec;
            out.state = out.state === "sidestep-melee" ? "sidestep-melee" : "hug-center";
          }
        }
      }
      // Allow red/green in a wait state when a hard enemy is close and we are not on a pad.
      const closeHard = enemies.some((e) => (e.type === "shield" || e.type === "axe" || e.type === "boss" || e.type === "boss2") && Math.hypot(e.x - px, e.z - pz) <= 4 * lateMul);
      const onPadNow = typeof inSpikeRadius === "function" && inSpikeRadius(px, pz);
      if (closeHard && !onPadNow && view && view.heldBlade === 1) {
        out.useBlade = true; out.bladeReason = "danger-melee";
      } else if (closeHard && !onPadNow && view && view.heldBlade === 2 && !out.useBlade) {
        out.useBlade = true; out.bladeReason = "green-escape";
      }
    }
    if (!SLIM && wouldFall(px, pz, out.keys || empty(), 0.2)) {
      const rec = recoverToRing(px, pz);
      if (onKeys(rec) && !wouldFall(px, pz, rec, 0.2)) {
        out.keys = rec;
        out.state = "recover-ring";
        emergency = true;
      } else {
        out.keys = empty();
        emergency = true;
      }
    }

    outHoldX = out.tx; outHoldZ = out.tz;
    if (!NOSTAB) out.keys = stabilize(out.keys || empty(), t0, px, pz, emergency, out.state);
    if (wouldFall(px, pz, out.keys || empty(), 0.2)) {
      const rec = recoverToRing(px, pz);
      if (onKeys(rec) && !wouldFall(px, pz, rec, 0.2)) {
        out.keys = rec;
        out.state = "recover-ring";
      } else {
        out.keys = empty();
      }
    }
    if (v41 && (out.state === "yield" || (out.state === "kite" && !onKeys(out.keys || empty())) ||
        (v42 && (out.state === "abort-plank" || (((view && view.enemies) || []).some(function (e) {
          return e && (e.type === "grunt" || e.type === "snake" || e.type === "axe" || e.type === "shield" || e.type === "boss" || e.type === "boss2") && Math.hypot(e.x - px, e.z - pz) < 6;
        }) && !onKeys(out.keys || empty())))))) {
      const waitingPad = /^(hold-spike|wait-pad|time-spike|stage-spike|back-pad)$/.test(out.state || "");
      if (!(v42 && waitingPad && (view && (view.spikesUp || (view.safeTime || 2) < 0.70)) && nearestPad(px, pz).dist < SPIKE_HIT_R + 0.05)) {
        const dirK = base.getDir ? base.getDir() : 1;
        const wiK = base.getWi ? base.getWi() : 0;
        const go = alongRail(px, pz, dirK, wiK) || alongRail(px, pz, -dirK, wiK);
        const destHot = v42 && go && view && (view.spikesUp || (view.safeTime || 2) < 0.70) && nearestPad(go.x, go.z).dist < SPIKE_HIT_R + 0.05;
        if (go && go.keys && !destHot) {
          out.keys = go.keys; out.tx = go.x; out.tz = go.z;
          if (!(v42 && out.state === "abort-plank")) out.state = "kite";
        }
      }
    }
    if (v41) {
      // C4i dt-aware corner-well no-go + recover/along-rail fallback.
      // Official simple-v41 waters were kite/yield walking an inward-parallel
      // of the 24-rail (dest on the rail, axis key only fixes the long axis)
      // plus yaw/knockback into the well, then wait-pad coasting on the lip.
      function inCornerWell(x, z) {
        return Math.abs(x) > 16 && Math.abs(z) > 16 &&
          Math.min(Math.abs(Math.abs(x) - 24), Math.abs(Math.abs(z) - 24)) > 1.0;
      }
      function inwardOffsetOf(x, z) {
        const ew = Math.abs(Math.abs(x) - 24), ns = Math.abs(Math.abs(z) - 24);
        if (ew <= ns && Math.abs(x) >= 16) return 24 - Math.abs(x);
        if (Math.abs(z) >= 16) return 24 - Math.abs(z);
        return 0;
      }
      function recoverCorner(x, z) {
        const k = empty();
        const ew = Math.abs(Math.abs(x) - 24), ns = Math.abs(Math.abs(z) - 24);
        // Prefer the closer 24-rail (C4i pushed the farther axis first and
        // walked west along an already-inward south lip).
        const fixX = function () {
          if (x >= 0 && x < 23.85) k.ArrowRight = true;
          else if (x >= 0 && x > 24.15) k.ArrowLeft = true;
          else if (x < 0 && x > -23.85) k.ArrowLeft = true;
          else if (x < 0 && x < -24.15) k.ArrowRight = true;
        };
        const fixZ = function () {
          if (z >= 0 && z < 23.85) k.ArrowDown = true;
          else if (z >= 0 && z > 24.15) k.ArrowUp = true;
          else if (z < 0 && z > -23.85) k.ArrowUp = true;
          else if (z < 0 && z < -24.15) k.ArrowDown = true;
        };
        if (ns <= ew && ns > 0.25) fixZ();
        else if (ew > 0.25) fixX();
        else if (ns > 0.25) fixZ();
        return onKeys(k) ? k : recoverToRing(x, z);
      }
      function onMidDock(x, z) {
        // Only the actual mid-side dock cells that connect spawn to the
        // 24-rail: (15,0)/(18,0)/(21,±3) and rotations. A wider |z|<=9
        // band (first v48 cut) treated the inward lip of the 24-rail as
        // a dock and official 1/60 fell in at (-22.5,-6.9) and (7.9,-22.5).
        const ax = Math.abs(x), az = Math.abs(z);
        if (az <= 1.6 && ax >= 13.5 && ax <= 19.6) return true;
        if (az <= 4.6 && ax >= 19.5 && ax <= 24) return true;
        if (ax <= 1.6 && az >= 13.5 && az <= 19.6) return true;
        if (ax <= 4.6 && az >= 19.5 && az <= 24) return true;
        return false;
      }
      function knockbackOk(x, z) {
        if (!isPb(x, z) || inCornerWell(x, z)) return false;
        if (v48 && onMidDock(x, z)) return true;
        if (inwardOffsetOf(x, z) > 1.20) return false;
        return true;
      }
      function predOf(keys, hor) {
        const ka = kaFromKeys(keys);
        if (ka == null) return [px, pz];
        const d = worldDirFromKa(ka, YAW_RAD);
        return [px + d[0] * SPD * hor, pz + d[1] * SPD * hor];
      }
      function predSafe(keys, hor) {
        if (!onKeys(keys)) return false;
        const p = predOf(keys, hor);
        return knockbackOk(p[0], p[1]) && isPb(p[0], p[1]) && !inCornerWell(p[0], p[1]);
      }
      function dropRailLaterals(keys) {
        const k = Object.assign({}, empty(), keys || empty());
        const ax = Math.abs(px), az = Math.abs(pz);
        const onEW = Math.abs(ax - 24) <= 1.2 && Math.abs(az - 24) > 1.5;
        const onNS = Math.abs(az - 24) <= 1.2 && Math.abs(ax - 24) > 1.5;
        if (onEW) { k.ArrowLeft = false; k.ArrowRight = false; }
        else if (onNS) { k.ArrowUp = false; k.ArrowDown = false; }
        if (inwardOffsetOf(px, pz) > 0.35) {
          const rec = recoverCorner(px, pz);
          if (onEW) { k.ArrowLeft = rec.ArrowLeft; k.ArrowRight = rec.ArrowRight; }
          else if (onNS) { k.ArrowUp = rec.ArrowUp; k.ArrowDown = rec.ArrowDown; }
        }
        return k;
      }
      function alongRailKeys(dir) {
        const n = RING.length;
        const i = ringIndexNear(px, pz);
        const c = RING[((i + (dir >= 0 ? 1 : -1)) % n + n) % n];
        const k = empty();
        const dx = c[0] - px, dz = c[1] - pz;
        // If already inward of a rail, fix that first (don't keep walking
        // the long axis on a parallel inward of the plank).
        if (inwardOffsetOf(px, pz) > 0.7) return recoverCorner(px, pz);
        if (Math.abs(dx) >= Math.abs(dz)) {
          if (dx > 0.2) k.ArrowRight = true;
          else if (dx < -0.2) k.ArrowLeft = true;
        } else {
          if (dz < -0.2) k.ArrowUp = true;
          else if (dz > 0.2) k.ArrowDown = true;
        }
        return k;
      }
      let recent = 0;
      for (let i = 0; i < v41Dts.length; i++) if (v41Dts[i] > recent) recent = v41Dts[i];
      const stepDt = (view && view.dt > 0) ? view.dt : recent || 1 / 60;
      const atC = Math.abs(px) > 18 && Math.abs(pz) > 18;
      const look = atC ? Math.max(stepDt, recent, 1 / 30, 0.10) : Math.max(stepDt, recent, 1 / 30);
      const dir = (base.getDir && base.getDir()) || 1;
      const onOneRail = (Math.abs(Math.abs(px) - 24) <= 1.2 && Math.abs(Math.abs(pz) - 24) > 1.5)
        || (Math.abs(Math.abs(pz) - 24) <= 1.2 && Math.abs(Math.abs(px) - 24) > 1.5);
      if (atC && onOneRail && onKeys(out.keys || empty())) {
        const clamped = dropRailLaterals(out.keys);
        if (onKeys(clamped)) out.keys = clamped;
      }
      function pickSafe(preferred, label) {
        const cands = [];
        if (preferred) cands.push({ k: preferred, s: label || out.state });
        if (atC) cands.push({ k: dropRailLaterals(preferred || out.keys || empty()), s: "corner-clamp" });
        cands.push({ k: recoverCorner(px, pz), s: "recover-ring" });
        cands.push({ k: alongRailKeys(dir), s: "corner-along" });
        cands.push({ k: alongRailKeys(-dir), s: "corner-along" });
        for (let i = 0; i < cands.length; i++) {
          if (predSafe(cands[i].k, look)) {
            out.keys = cands[i].k;
            out.state = cands[i].s;
            return true;
          }
        }
        if (!knockbackOk(px, pz) || inCornerWell(px, pz)) {
          const rec = recoverCorner(px, pz);
          if (onKeys(rec)) { out.keys = rec; out.state = "recover-ring"; return true; }
        }
        out.keys = empty();
        out.state = "corner-brake";
        return false;
      }
      const waiting = /^(hold-spike|wait-pad|time-spike|stage-spike|wait-arrow|back-pad)$/.test(out.state || "");
      if (onKeys(out.keys || empty())) {
        if (!predSafe(out.keys, look)) pickSafe(out.keys, out.state);
      } else if (!knockbackOk(px, pz) || inCornerWell(px, pz) || inwardOffsetOf(px, pz) > 0.7) {
        if (waiting && isPb(px, pz) && !inCornerWell(px, pz) && inwardOffsetOf(px, pz) <= 1.0) {
          /* keep a safe pad-wait */
        } else {
          pickSafe(null, out.state);
        }
      }
    }
    // v45: live w6 died in cut-inner next to an axe (hits at 3.4–4.3, then a
    // 1-dmg chip with spikes up). v41 rewrites yield but not cut-inner, so the
    // bot can stand/cut inward in axe reach on a rail that leads to a pad.
    // When an axe is within 5, never cut-inner or stand still near a pad —
    // keep running the ring away from the axe, unless that direction would
    // land on a pad that is already hot or will be up before we get there
    // (first v45 1/60 trial 3 ran flee-axe onto (24,21)).
    if (v45) {
      let axe = null, axeD = 99;
      for (const e of (view && view.enemies) || []) {
        if (!e || e.type !== "axe") continue;
        const d = Math.hypot(e.x - px, e.z - pz);
        if (d < axeD) { axeD = d; axe = e; }
      }
      if (axe && axeD <= 5) {
        const padNow = nearestPad(px, pz);
        const standing = !onKeys(out.keys || empty());
        const cutting = out.state === "cut-inner";
        const waiting = /^(hold-spike|wait-pad|time-spike|stage-spike|back-pad|corner-brake)$/.test(out.state || "");
        let intoHotPad = false;
        if (onKeys(out.keys || empty())) {
          const k = out.keys;
          const kx = (k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0);
          const kz = (k.ArrowDown ? 1 : 0) - (k.ArrowUp ? 1 : 0);
          const L = Math.hypot(kx, kz) || 1;
          const predX = px + kx / L * 8 * 0.45, predZ = pz + kz / L * 8 * 0.45;
          const padPred = nearestPad(predX, predZ);
          const safe = (view && view.safeTime != null) ? view.safeTime : 2;
          const eta = Math.max(0.15, padNow.dist / 8);
          if (padPred.dist < padNow.dist - 0.2 && padPred.dist < (SPIKE_HIT_R + 1.2) &&
              (view && (view.spikesUp || safe < eta + 0.4))) intoHotPad = true;
        }
        if (cutting || standing || intoHotPad || (waiting && padNow.dist < 8)) {
          const dirK = (base.getDir && base.getDir()) || out.loopDir || 1;
          const wiK = (base.getWi && base.getWi()) || out.wi || 0;
          const goA = alongRail(px, pz, dirK, wiK);
          const goB = alongRail(px, pz, -dirK, wiK);
          const safe = (view && view.safeTime != null) ? view.safeTime : 2;
          let recent = 1 / 30;
          for (let i = 0; i < v41Dts.length; i++) if (v41Dts[i] > recent) recent = v41Dts[i];
          function axeScore(go) {
            if (!go || !go.keys) return -1e9;
            if (wouldFall(px, pz, go.keys, 0.3)) return -1e9;
            if (typeof padUnsafe === "function" && padUnsafe(view, go.x, go.z)) return -1e8;
            const np = nearestPad(go.x, go.z);
            const towardPad = np.dist + 0.4 < padNow.dist;
            const etaPad = Math.max(0.1, np.dist / 8);
            // Never step into the 3.3 safe disk while fleeing an axe — hitch
            // frames can skip a 0.25s up-window (v45c hitch trial 2 on (24,-21)).
            if (towardPad && np.dist < (SPIKE_SAFE_R || 3.3)) return -1e8;
            if (towardPad && np.dist < (SPIKE_HIT_R + 1.2) &&
                (view && (view.spikesUp || safe < etaPad + 0.5 + recent))) return -1e8;
            return Math.hypot(go.x - axe.x, go.z - axe.z) - axeD;
          }
          const pick = axeScore(goA) >= axeScore(goB) ? goA : goB;
          if (pick && axeScore(pick) > -1e8) {
            out.keys = pick.keys; out.tx = pick.x; out.tz = pick.z;
            out.state = "flee-axe";
          }
        }
      }
    }

    // v46: live v45 died on the west rail in flee-axe (w7) because the hook
    // only overrode cut-inner / standing / intoHotPad, then lure/stage/kite
    // reversed back through a nearly-stationary axe (walk 2.5, then windup).
    // Physics already match live (player cruise 8, axe approach 2.43). Kite:
    // keep a gap >6, never flee straight along a rail *into or back through*
    // the axe, break line via mid-dock / safe pad-diagonal, and use red
    // freeze or blue slow when an axe is within 4.
    if (v46) {
      let axe = null, axeD = 99;
      for (const e of (view && view.enemies) || []) {
        if (!e || e.type !== "axe") continue;
        const d = Math.hypot(e.x - px, e.z - pz);
        if (d < axeD) { axeD = d; axe = e; }
      }
      const padNow = nearestPad(px, pz);
      const onPadNow = padNow.dist < (SPIKE_SAFE_R || 3.3);
      if (axe && axeD <= 4 && view && (view.heldBlade === 0 || view.heldBlade === 1) && !onPadNow) {
        out.useBlade = true;
        out.bladeReason = view.heldBlade === 1 ? "red-axe" : "blue-axe";
      }
      if (axe && (axeD <= 6.5 || (axeFleeUntil > t0 && axeD <= 8))) {
        const dirK = (base.getDir && base.getDir()) || out.loopDir || 1;
        const wiK = (base.getWi && base.getWi()) || out.wi || 0;
        const safe = (view && view.safeTime != null) ? view.safeTime : 2;
        let recent = 1 / 30;
        for (let i = 0; i < v41Dts.length; i++) if (v41Dts[i] > recent) recent = v41Dts[i];
        const onV = Math.abs(Math.abs(px) - 24) <= 2 && Math.abs(Math.abs(pz) - 24) > 2;
        const onH = Math.abs(Math.abs(pz) - 24) <= 2 && Math.abs(Math.abs(px) - 24) > 2;
        function goFromDest(tx, tz, label) {
          if (tx == null || !isPb(tx, tz)) return null;
          // Mid-docks only. Corner / inner-lip dests walk the well (official
          // v46 first 6x3 drowned at (±18–22, ±19–22)).
          const corner = Math.abs(tx) > 18 && Math.abs(tz) > 18;
          if (corner) return null;
          const keys = axisKeysToward(px, pz, tx, tz);
          if (!onKeys(keys)) return null;
          if (wouldFall(px, pz, keys, 0.55) || wouldFallLag(px, pz, keys, 0.55)) return null;
          return { keys: keys, x: tx, z: tz, label: label || "cut" };
        }
        function scoreGo(go) {
          if (!go) return -1e9;
          const moving = onKeys(go.keys);
          if (moving && (wouldFall(px, pz, go.keys, 0.3) || wouldFallLag(px, pz, go.keys, 0.3))) return -1e9;
          const k = go.keys || empty();
          const kx = (k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0);
          const kz = (k.ArrowDown ? 1 : 0) - (k.ArrowUp ? 1 : 0);
          const Lm = Math.hypot(kx, kz) || 1;
          const predX = moving ? px + kx / Lm * 8 * 0.5 : px;
          const predZ = moving ? pz + kz / Lm * 8 * 0.5 : pz;
          if (moving && !isPb(predX, predZ)) return -1e9;
          const predD = Math.hypot(predX - axe.x, predZ - axe.z);
          const destD = Math.hypot(go.x - axe.x, go.z - axe.z);
          const np = nearestPad(go.x, go.z);
          const npPred = nearestPad(predX, predZ);
          const towardPad = np.dist + 0.4 < padNow.dist || npPred.dist + 0.4 < padNow.dist;
          const etaPad = Math.max(0.1, Math.min(np.dist, npPred.dist) / 8);
          const padHot = view && (view.spikesUp || safe < etaPad + 0.35 + recent);
          const enterDisk = towardPad && npPred.dist < (SPIKE_SAFE_R || 3.3);
          // Lethal: would be on the hit disk while spikes are / will be up.
          if (padHot && npPred.dist < (SPIKE_HIT_R + 0.2) && towardPad) return -1e8;
          let sc = (predD - axeD) * 4 + (destD - axeD);
          if (!moving) sc = 0.5; // hold off-disk beats reversing into the axe
          if (predD < axeD - 0.1) sc -= 80;
          if (predD < 3 && axeD > predD) sc -= 40;
          go._opens = predD >= axeD - 0.05;
          // Soft pad discomfort only — never preferred over walking into the axe.
          if (enterDisk && padHot) sc -= 20;
          else if (enterDisk && view && !view.spikesUp && safe > etaPad + 0.9 + recent) sc += 2;
          const off = (onV && Math.abs(go.x - px) > 1.4) || (onH && Math.abs(go.z - pz) > 1.4);
          if (off && predD + 0.2 >= Math.min(axeD, 6)) sc += 6;
          if (off && towardPad && view && !view.spikesUp && safe > etaPad + 1.1 + recent) sc += 3;
          return sc;
        }
        const cands = [];
        const goA = alongRail(px, pz, dirK, wiK);
        const goB = alongRail(px, pz, -dirK, wiK);
        if (goA) cands.push(Object.assign({ label: "rail+" }, goA));
        if (goB) cands.push(Object.assign({ label: "rail-" }, goB));
        if (padNow.dist >= SPIKE_HIT_R) {
          cands.push({ keys: empty(), x: px, z: pz, label: "hold" });
        }
        let best = null, bestS = -1e9;
        for (let i = 0; i < cands.length; i++) {
          const sc = scoreGo(cands[i]);
          if (sc > bestS) { bestS = sc; best = cands[i]; }
        }
        const committed = axeFleeUntil > t0 && axeFleeKeys && onKeys(axeFleeKeys);
        if (committed) {
          const cg = { keys: axeFleeKeys, x: axeFleeX, z: axeFleeZ, label: "commit" };
          const cs = scoreGo(cg);
          // Drop a commit that would close the gap (a stutter must not lock us
          // into walking back through the axe).
          if (cs > -1e8 && cg._opens) {
            const flip = best && opposite(best.keys, axeFleeKeys);
            const betterCut = flip && bestS > cs + 8 && best && best.label === "cut" && best._opens;
            if (!betterCut) { best = cg; bestS = cs; }
          } else {
            axeFleeUntil = -1; axeFleeKeys = null;
          }
        }
        if (best && bestS > -1e8 && best.label !== "hold" &&
            (wouldFall(px, pz, best.keys, 0.55) || wouldFallLag(px, pz, best.keys, 0.55))) {
          // Do not undo C4i: drop a would-fall flee rather than walk the well.
          best = null;
        }
        if (best && bestS > -1e8) {
          out.keys = best.keys; out.tx = best.x; out.tz = best.z;
          out.state = best.label === "hold" ? "hold-axe" : "flee-axe";
          if (best.label !== "hold" && best._opens && (!committed || opposite(best.keys, axeFleeKeys) || axeFleeUntil <= t0)) {
            axeFleeUntil = t0 + 2.2;
            axeFleeKeys = copyKeys(best.keys);
            axeFleeX = best.x; axeFleeZ = best.z;
          }
        }
      } else {
        // Drop the commit once the gap is clearly open so normal ring
        // travel (and C4i corner safety) can resume.
        axeFleeUntil = -1; axeFleeKeys = null;
      }
    }


    // v47: minimal anti-yoyo on v41. Only when a same-rail melee is
    // within R AND the planned lure/stage/loop keys *reverse* toward it,
    // keep the current (opening) along-rail direction for T seconds.
    // Do not intervene on a continuing loop toward a distant axe (that
    // fought official). No holds, no cuts, no inner-lip stands.
    if (v47) {
      const MELEE = V47_MELEE
        ? { axe: 1, grunt: 1, snake: 1, shield: 1, boss: 1, boss2: 1 }
        : { axe: 1 };
      const onV = Math.abs(Math.abs(px) - 24) <= 2 && Math.abs(Math.abs(pz) - 24) > 2;
      const onH = Math.abs(Math.abs(pz) - 24) <= 2 && Math.abs(Math.abs(px) - 24) > 2;
      function sameRail(e) {
        if (!e) return false;
        if (onV) return Math.abs((e.x || 0) - px) <= 3.2;
        if (onH) return Math.abs((e.z || 0) - pz) <= 3.2;
        return Math.abs((e.x || 0) - px) <= 3.2 || Math.abs((e.z || 0) - pz) <= 3.2;
      }
      let threat = null, tD = 99;
      for (const e of (view && view.enemies) || []) {
        if (!e || !MELEE[e.type]) continue;
        if (!sameRail(e)) continue;
        const d = Math.hypot(e.x - px, e.z - pz);
        if (d < tD) { tD = d; threat = e; }
      }
      function predOf(keys) {
        const k = keys || empty();
        const kx = (k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0);
        const kz = (k.ArrowDown ? 1 : 0) - (k.ArrowUp ? 1 : 0);
        if (!kx && !kz) return { x: px, z: pz };
        const Lm = Math.hypot(kx, kz);
        return { x: px + kx / Lm * 8 * 0.45, z: pz + kz / Lm * 8 * 0.45 };
      }
      function towardThreat(keys) {
        if (!threat) return false;
        const p = predOf(keys);
        return Math.hypot(p.x - threat.x, p.z - threat.z) < tD - 0.15;
      }
      function opensThreat(keys) {
        if (!threat || !onKeys(keys)) return false;
        const p = predOf(keys);
        return Math.hypot(p.x - threat.x, p.z - threat.z) >= tD - 0.05;
      }
      function railKeysOnly(keys) {
        const k = copyKeys(keys);
        // Axis-only on the current rail so a followTo lateral cannot walk
        // off the mid-dock (v47b r5 1/60 trial 1 drowned at (25.5, 9.1)).
        if (onV) { k.ArrowLeft = false; k.ArrowRight = false; }
        if (onH) { k.ArrowUp = false; k.ArrowDown = false; }
        return k;
      }
      function railSafe(keys) {
        if (!onKeys(keys)) return false;
        if (wouldFall(px, pz, keys, 0.55) || wouldFallLag(px, pz, keys, 0.55)) return false;
        return true;
      }
      const atCorner = Math.abs(px) > 18 && Math.abs(pz) > 18;
      if (V47_BLADE && threat && threat.type === "axe" && tD <= 4 && view &&
          (view.heldBlade === 0 || view.heldBlade === 1) &&
          nearestPad(px, pz).dist > (SPIKE_SAFE_R || 3.3)) {
        out.useBlade = true;
        out.bladeReason = view.heldBlade === 1 ? "red-axe" : "blue-axe";
      }
      const planned = out.keys || empty();
      const inCommit = yoyoUntil > t0 && yoyoKeys && onKeys(yoyoKeys);
      const close = threat && tD <= V47_R;
      const isReverse = yoyoLastKeys && onKeys(yoyoLastKeys) && opposite(planned, yoyoLastKeys);
      if (close && !atCorner && inCommit && railSafe(railKeysOnly(yoyoKeys)) && !towardThreat(railKeysOnly(yoyoKeys))) {
        out.keys = railKeysOnly(yoyoKeys);
        out.state = "anti-yoyo";
      } else if (close && !atCorner && isReverse && towardThreat(planned)) {
        // Reversal into the melee: keep the previous opening direction, or
        // the along-rail heading that opens the gap. Never stand still.
        let keep = null;
        if (railSafe(yoyoLastKeys) && opensThreat(yoyoLastKeys)) keep = copyKeys(yoyoLastKeys);
        if (!keep && inCommit && railSafe(yoyoKeys) && !towardThreat(yoyoKeys)) keep = copyKeys(yoyoKeys);
        if (!keep) {
          const dirK = (base.getDir && base.getDir()) || out.loopDir || 1;
          const wiK = (base.getWi && base.getWi()) || out.wi || 0;
          const goA = alongRail(px, pz, dirK, wiK);
          const goB = alongRail(px, pz, -dirK, wiK);
          let best = null, bestOpen = -1e9;
          for (const go of [goA, goB]) {
            if (!go || !railSafe(go.keys)) continue;
            const p = predOf(go.keys);
            const open = Math.hypot(p.x - threat.x, p.z - threat.z) - tD;
            if (open > bestOpen) { bestOpen = open; best = go; }
          }
          if (best && bestOpen >= -0.05) keep = copyKeys(best.keys);
        }
        if (keep) {
          keep = railKeysOnly(keep);
          if (onKeys(keep) && railSafe(keep)) {
            out.keys = keep;
            out.state = "anti-yoyo";
            yoyoUntil = t0 + V47_T;
            yoyoKeys = copyKeys(keep);
          }
        }
      } else if (close && !atCorner && opensThreat(railKeysOnly(planned)) && railSafe(railKeysOnly(planned))) {
        // Already opening: commit so a later lure/stage cannot flip back in.
        yoyoUntil = t0 + V47_T;
        yoyoKeys = railKeysOnly(planned);
      } else if (!close) {
        // v48: do not drop the commit the moment the axe leaves R — that is
        // how live v47 fled to 4–6 then lure-spike walked back into the axe.
        if (!(v48 && yoyoUntil > t0 && threat && tD <= 9)) {
          yoyoUntil = -1; yoyoKeys = null;
        }
      }
      yoyoLastKeys = copyKeys(out.keys || empty());
    }
    // v48: lure-spike / stage-spike must abort when an axe is within LURE_R
    // or the planned lure path would close on / cross that axe.
    if (v48) {
      let axe = null, axeD = 99;
      for (const e of (view && view.enemies) || []) {
        if (!e || e.type !== "axe") continue;
        const d = Math.hypot(e.x - px, e.z - pz);
        if (d < axeD) { axeD = d; axe = e; }
      }
      function lureCrosses(keys) {
        if (!axe || !onKeys(keys)) return false;
        const k = keys;
        const kx = (k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0);
        const kz = (k.ArrowDown ? 1 : 0) - (k.ArrowUp ? 1 : 0);
        const Lm = Math.hypot(kx, kz) || 1;
        for (let t = 0.1; t <= 1.2 + 1e-9; t += 0.1) {
          const x = px + kx / Lm * 8 * t, z = pz + kz / Lm * 8 * t;
          if (Math.hypot(x - axe.x, z - axe.z) < V48_LURE_R) return true;
        }
        return false;
      }
      const lureSt = out.state === "lure-spike" || out.state === "stage-spike";
      if (axe && lureSt && (axeD <= V48_LURE_R || lureCrosses(out.keys || empty()))) {
        const atCorner = Math.abs(px) > 18 && Math.abs(pz) > 18;
        const dirK = (base.getDir && base.getDir()) || out.loopDir || 1;
        const wiK = (base.getWi && base.getWi()) || out.wi || 0;
        const goA = alongRail(px, pz, dirK, wiK);
        const goB = alongRail(px, pz, -dirK, wiK);
        let best = null, bestOpen = -1e9;
        for (const go of [goA, goB]) {
          if (!go || !go.keys) continue;
          if (wouldFall(px, pz, go.keys, 0.55) || wouldFallLag(px, pz, go.keys, 0.55)) continue;
          const k = go.keys;
          const kx = (k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0);
          const kz = (k.ArrowDown ? 1 : 0) - (k.ArrowUp ? 1 : 0);
          const Lm = Math.hypot(kx, kz) || 1;
          const predX = px + kx / Lm * 8 * 0.45, predZ = pz + kz / Lm * 8 * 0.45;
          const open = Math.hypot(predX - axe.x, predZ - axe.z) - axeD;
          if (open > bestOpen) { bestOpen = open; best = go; }
        }
        if (best && bestOpen >= -0.05 && !atCorner) {
          out.keys = best.keys; out.tx = best.x; out.tz = best.z;
          out.state = "abort-lure";
          yoyoUntil = t0 + V47_T;
          yoyoKeys = copyKeys(best.keys);
          yoyoLastKeys = copyKeys(best.keys);
        } else if (yoyoKeys && onKeys(yoyoKeys) && !wouldFall(px, pz, yoyoKeys, 0.55)) {
          out.keys = yoyoKeys;
          out.state = "abort-lure";
        }
      }
    }

    out.dirFlips = dirFlips;
    out.jitterTime = jitterTime;
    return out;
  }

  return {
    reset: reset,
    step: step,
    reverse: function () { return base.reverse(); },
    name: "v" + kind,
    getWi: function () { return base.getWi(); },
    getDir: function () { return base.getDir(); }
  };
}

function createV41Brain() {
  // v40 exactly, plus: rewrite yield to axis-only along-ring motion, and
  // bait-orb dests stay on the current 24-rail at corners.
  return createV32Brain("41");
}

function createV42Brain() {
  // v41 plus: abort-plank never stands still with melee close (keep moving
  // along the ring, same idea as the yield fix).
  return createV32Brain("42");
}

function createV45Brain() {
  // v41 plus: when an axe is within 5, do not cut-inner or stand near a
  // pad — keep running the ring away from the axe (live v44 w6 death).
  return createV32Brain("45");
}

function createV46Brain() {
  // v41 plus a committed axe kite: keep gap >6, do not reverse along the
  // rail through the axe, break line at mid-docks / safe pad diagonals,
  // and use red freeze or blue slow when an axe is within 4 (live v45 w7).
  return createV32Brain("46");
}

function createV47Brain() {
  // v41 plus a minimal same-rail anti-yoyo: do not lure/stage/loop toward
  // a nearby melee; commit the opening along-rail direction for ~2 s.
  return createV32Brain("47");
}

function createV48Brain() {
  // v47 plus: abort lure/stage when an axe is within 6 or the lure path
  // crosses it (live v47 w19), and allow mid-dock approach from spawn
  // (live auto-restart corner-brake stall at (15.75,0)).
  return createV32Brain("48");
}

function createBrain(name) {
  if (name === "v32.3" || name === "v32.3") return createV32Brain("32.3");
  if (name === "v32.2") return createV32Brain("32.2");
  if (name === "v32.1") return createV32Brain("32.1");
  if (name === "v33") return createV32Brain("33");
  if (name === "v34") return createV32Brain("34");
  if (name === "v35") return createV32Brain("35");
  if (name === "v36") return createV32Brain("36");
  if (name === "v37") return createV32Brain("37");
  if (name === "v38") return createV32Brain("38");
  if (name === "v39") return createV32Brain("39");
  if (name === "v40") return createV32Brain("40");
  if (name === "v41") return createV41Brain();
  if (name === "v42") return createV42Brain();
  if (name === "v45") return createV45Brain();
  if (name === "v46") return createV46Brain();
  if (name === "v47") return createV47Brain();
  if (name === "v48") return createV48Brain();
  if (name === "v32") return createV32Brain("32.3");
  if (name === "v31") return createV31Brain();
  if (name === "v30") return createV30Brain();
  if (name === "v29") return createV29Brain();
  if (name === "v28") return createV28Brain();
  if (name === "v27") return createV27Brain();
  if (name === "v26") return createV26Brain();
  if (name === "v25") return createV25Brain();
  if (name === "v24") return createV24Brain();
  return createV23();
}

module.exports = { createBrain, createV41Brain, createV42Brain, createV45Brain, createV46Brain, createV47Brain, createV48Brain, createV24Brain, createV25Brain, createV26Brain, createV27Brain, createV28Brain, createV29Brain, createV30Brain, createV31Brain, createV32Brain, timeToClearCluster, followTo };

});

/* Browser adapter: maps window.k <-> brain.step. Policy lives only in brain.js. */
(function attachAdapter(require, VER, KIND) {
  var TOP = window;
  var brainApi = require("brain");
  var traps = require("traps");
  var ringMod = require("ring");
  var RING = ringMod.RING;
  var ringIndexNear = ringMod.ringIndexNear;

  var SB = {
    ver: VER, kind: KIND, state: "boot", px: 0, pz: 0, vn: 0, avg: 0,
    wp: "", keys: "none", hp: 5, hpMax: 5, wave: "?", score: "?", blade: -1,
    nearest: 99, enemies: 0, fireballs: 0, tick: 0, runKills: 0, kills: 0,
    deaths: [], runs: prevRunsSafe(), hpEvents: [], bladeUses: [],
    err: "", lite: "", sanity: "", stuck: false, attack: false, acts: null
  };
  try { TOP.__SB = SB; } catch (e) {}

  var gw = null, k = null, down = {};
  var overlay = null, rafId = 0, uiTimer = 0, overlayTimer = 0, stopped = false;
  var lastHud = "", lastHp = 5, lastScoreNum = 0, lastPersistT = 0, lastDownloadN = -1;
  var deathLogged = false, everAlive = false, runDumped = false, checkedMap = false;
  var finished = false, firstDeathTrace = null;
  var lastAlivePos = null, prevPos = null, vel = [0, 0];
  var lastFrameT = 0, lastDt = 1 / 60, waveStartedAt = 0, waveSeen = "";
  var dtBuf = [], dtCount = 0, dtIdx = 0, dtMaxSeen = 0, dtOver40 = 0;
  var nowT = 0, lastKeyRefresh = 0, lastFocus = 0;
  var poses = [], poseI = 0, poseT = 0, yellowOn = false;
  var trace = [], lastTraceT = -99;
  var brain = brainApi.createBrain("v" + KIND);
  var KEYS = { ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, " ": 32, Control: 17 };

  function prevRunsSafe() {
    try { return (TOP.__SB && TOP.__SB.runs) ? TOP.__SB.runs.slice() : []; } catch (e) { return []; }
  }
  function genAlive() {
    try { if (TOP.__SB_GEN !== GEN) return false; } catch (e) { return false; }
    return !stopped;
  }
  function stop() {
    stopped = true;
    try { if (TOP.__SB_INSTANCE === VER) TOP.__SB_INSTANCE = ""; } catch (e) {}
    try { if (TOP.top && TOP.top !== TOP && TOP.top.__SB_INSTANCE === VER) TOP.top.__SB_INSTANCE = ""; } catch (e) {}
    try { TOP.__SB_RUNNING_ANY = 0; } catch (e) {}
    try { if (TOP.top && TOP.top !== TOP) TOP.top.__SB_RUNNING_ANY = 0; } catch (e) {}
    if (rafId) { try { (gw || TOP).cancelAnimationFrame(rafId); } catch (e) {} rafId = 0; }
    if (uiTimer) { try { clearInterval(uiTimer); } catch (e) {} uiTimer = 0; }
    if (overlayTimer) { try { clearInterval(overlayTimer); } catch (e) {} overlayTimer = 0; }
    try { if (TOP.__SB_TIMERS) { TOP.__SB_TIMERS.raf = 0; TOP.__SB_TIMERS.ui = 0; TOP.__SB_TIMERS.ov = 0; } } catch (e) {}
    try { releaseAllKeys(true); } catch (e) {}
    try { forceReleaseKeys(gw || TOP); } catch (e) {}
    if (overlay && overlay.parentNode) try { overlay.parentNode.removeChild(overlay); } catch (e) {}
    overlay = null;
    SB.state = "stopped";
  }
  SB.stop = stop;

  function findGameWindow() {
    if (TOP.k) return TOP;
    var frames, i, f, cw;
    try { frames = TOP.document.querySelectorAll("iframe"); } catch (e) { return null; }
    for (i = 0; i < frames.length; i++) {
      f = frames[i];
      try {
        cw = f.contentWindow;
        if (cw && cw.k && (cw.k.X || /games\/871\//.test(f.src || ""))) return cw;
      } catch (e2) {}
    }
    return null;
  }
  function Q(sel) { return gw && gw.document ? gw.document.querySelector(sel) : null; }
  function visible(el) { return !!(el && el.offsetParent !== null && el.offsetWidth > 0 && el.offsetHeight > 0); }
  function clickEl(el) {
    if (!el || !gw) return;
    var cls = (el.className && el.className.toString) ? el.className.toString() : "";
    if (/powerUpLabel/i.test(cls) || /powerUp/i.test(el.id || "")) return;
    ["pointerdown", "mousedown", "click"].forEach(function (type) {
      try { el.dispatchEvent(new gw.MouseEvent(type, { bubbles: true, cancelable: true, view: gw })); } catch (e) {}
    });
  }
  function canvasEl() { return gw && gw.document ? gw.document.querySelector("canvas") : null; }
  function focusCanvas() {
    var c = canvasEl();
    if (!c || !gw) return;
    try { if (c.focus) c.focus(); } catch (e) {}
    var r = c.getBoundingClientRect();
    var ev = { bubbles: true, cancelable: true, view: gw, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, button: 0 };
    ["pointerdown", "mousedown", "pointerup", "mouseup", "click"].forEach(function (type) {
      try { c.dispatchEvent(new gw.MouseEvent(type, ev)); } catch (e) {}
    });
  }
  function dispatchKey(name, isDown) {
    if (!gw) return;
    var ev, c, targets, i, t, seen = [];
    try {
      ev = new gw.KeyboardEvent(isDown ? "keydown" : "keyup", {
        key: name === "Control" ? "Control" : name,
        code: name === " " ? "Space" : name === "Control" ? "ControlLeft" : name,
        keyCode: KEYS[name], which: KEYS[name], bubbles: true, cancelable: true
      });
    } catch (e) { return; }
    c = canvasEl();
    targets = [c, gw.document, gw.document && gw.document.body, gw];
    for (i = 0; i < targets.length; i++) {
      t = targets[i];
      if (!t || !t.dispatchEvent || seen.indexOf(t) >= 0) continue;
      seen.push(t);
      try { t.dispatchEvent(ev); } catch (e2) {}
    }
  }
  function key(name, isDown, force) {
    if (!force && !!down[name] === !!isDown) return;
    down[name] = !!isDown;
    dispatchKey(name, isDown);
  }
  function applyGameKeys(want) {
    want = want || {};
    if (k && k.key) {
      k.key.up = !!want.ArrowUp;
      k.key.Cb = !!want.ArrowDown;
      k.key.left = !!want.ArrowLeft;
      k.key.right = !!want.ArrowRight;
    }
    key("ArrowUp", !!want.ArrowUp);
    key("ArrowDown", !!want.ArrowDown);
    key("ArrowLeft", !!want.ArrowLeft);
    key("ArrowRight", !!want.ArrowRight);
  }
  function releaseAllKeys(force) {
    applyGameKeys({});
    Object.keys(KEYS).forEach(function (n) { key(n, false, force); });
    down = {};
  }
  function forceReleaseKeys(w) {
    if (!w) return;
    var names = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", " ", "Control"];
    var i, ev, KE, targets, ti, t;
    try {
      if (w.k && w.k.key) {
        w.k.key.left = false; w.k.key.right = false; w.k.key.up = false;
        w.k.key.Cb = false; w.k.key.w = false; w.k.key.a = false; w.k.key.s = false; w.k.key.d = false;
      }
    } catch (e) {}
    try { KE = w.KeyboardEvent; } catch (e2) { KE = KeyboardEvent; }
    if (!KE) return;
    for (i = 0; i < names.length; i++) {
      try {
        ev = new KE("keyup", { key: names[i], code: names[i] === " " ? "Space" : names[i], keyCode: KEYS[names[i]] || 0, which: KEYS[names[i]] || 0, bubbles: true, cancelable: true });
        targets = [w.document, w.document && w.document.body, w];
        for (ti = 0; ti < targets.length; ti++) {
          t = targets[ti];
          if (t && t.dispatchEvent) try { t.dispatchEvent(ev); } catch (e3) {}
        }
      } catch (e4) {}
    }
  }

  function isGameOver() {
    // v52: a stale k.i.la flag with HP > 0 is not a death (live run stopped
    // itself at spawn with hp 5, reason "dead").
    if (!(k && k.i)) return false;
    if (typeof k.i.Y === "number" && k.i.Y <= 0) return true;
    return !!(k.i.la && !(typeof k.i.Y === "number" && k.i.Y > 0));
  }
  function inRound() {
    if (!k || !k.i) return false;
    if (isGameOver()) return false;
    if (k.N && k.N.Ob === false && k.i.Ta) return false;
    return true;
  }
  function playerPos() { return k && k.i && k.i.v ? k.i.v.position : null; }

  function enemyName(e) {
    var id = (e && (e.hb != null ? e.hb : e.type));
    return ({ 0: "snake", 1: "grunt", 2: "shield", 3: "axe", 4: "medusa", 5: "boss", 6: "boss2" })[id] || (typeof id === "string" ? id : ("t" + id));
  }
  function liveEnemies() {
    var out = [], i, e;
    if (!k || !k.ba || !k.ba.K) return out;
    for (i = 0; i < k.ba.K.length; i++) {
      e = k.ba.K[i];
      if (e && e.alive && e.mesh) out.push(e);
    }
    return out;
  }
  function spikeTick() {
    if (!k || !k.level || !k.level.G) return 0;
    var ch = k.level.G.children, i, o;
    for (i = 0; i < ch.length; i++) {
      o = ch[i];
      if (o && (o.Ga === "TRAPSPIKES" || /trapSpikes/i.test(o.name || ""))) return o.tick || 0;
    }
    return 0;
  }
  function spikesUpNow() {
    var t = spikeTick();
    if (t >= 900 && t < 1000) return true;
    if (!k || !k.level || !k.level.G) return false;
    var ch = k.level.G.children, i, o;
    for (i = 0; i < ch.length; i++) {
      o = ch[i];
      if (o && (o.Ga === "TRAPSPIKES" || /trapSpikes/i.test(o.name || "")) && o.ya) return true;
    }
    return false;
  }
  function safeTimeNow() {
    var tick = spikeTick() % 1000;
    if (tick >= 900) return 0;
    return (900 - tick) / 400;
  }
  function liveDarts() {
    var out = [], n, i, d;
    if (!k || !k.eb || !k.eb.array) return out;
    n = k.eb.active || 0;
    for (i = 0; i < n; i++) {
      d = k.eb.array[i];
      if (!d || !d.position) continue;
      out.push({
        x: d.position.x, z: d.position.z,
        fx: (d.forward && d.forward.x) || 0,
        fz: (d.forward && d.forward.z) || 0,
        speed: d.speed || 20
      });
    }
    return out;
  }
  function liveFireballs() {
    var out = [], n, i, f, pos, vel;
    if (!k || !k.Vc || !k.Vc.j) return out;
    n = k.Vc.active || 0;
    for (i = 0; i < n; i++) {
      f = k.Vc.j[i];
      pos = f && (f.wb || f.position);
      if (!pos) continue;
      vel = f.velocity || {};
      out.push({ x: pos.x, z: pos.z, vx: vel.x || 0, vz: vel.z || 0 });
    }
    return out;
  }
  function liveNoodles() {
    var out = [], i, p, m;
    if (!k || !k.gc) return out;
    if (k.gc.u) {
      for (i = 0; i < k.gc.u.length; i++) {
        p = k.gc.u[i];
        if (p && p.vb && p.vb.visible) out.push({ x: p.vb.position.x, z: p.vb.position.z });
      }
    }
    if (k.gc.j && k.gc.active) {
      for (i = 0; i < k.gc.active; i++) {
        m = k.gc.j[i];
        if (m && m.visible) out.push({ x: m.position.x, z: m.position.z });
      }
    }
    return out;
  }
  function liveBlades() {
    var out = [], i, s, col;
    try {
      if (!k || !k.Ib) return out;
      for (i = 0; i < k.Ib.length; i++) {
        s = k.Ib[i];
        col = (s && (s.$a != null ? s.$a : s.sa));
        if (!s || col == null || col < 0) continue;
        if (s.Gd) continue;
        out.push({ x: s.position.x, z: s.position.z, color: col, visible: true });
      }
    } catch (e) {}
    return out;
  }
  function threatAt(x, z, eta) {
    var darts = liveDarts(), i, d, px, pz, along, side, tick, fireIn, sinceFire;
    eta = eta || 0;
    for (i = 0; i < darts.length; i++) {
      d = darts[i];
      px = d.x + d.fx * d.speed * eta;
      pz = d.z + d.fz * d.speed * eta;
      along = (x - px) * d.fx + (z - pz) * d.fz;
      side = Math.abs((x - px) * (-d.fz) + (z - pz) * d.fx);
      if (along > -2 && along < 8 && side < 2.0) return true;
    }
    tick = spikeTick() % 1000;
    fireIn = ((500 - tick + 1000) % 1000) / 400;
    sinceFire = tick >= 500 ? (tick - 500) / 400 : 99;
    if (traps.onDartLane(x, z) && (fireIn < 0.40 + eta || sinceFire < 0.40 + eta)) return true;
    return false;
  }
  function snapshotPose(px, pz, hp) {
    return { x: px, z: pz, hp: hp };
  }
  function updatePoses(px, pz, hp, dt, mode) {
    if (mode === 4) {
      if (!yellowOn) {
        yellowOn = true;
        poses = [];
        for (var i = 0; i < 12; i++) poses.push(snapshotPose(px, pz, hp));
        poseI = 0; poseT = 0.25;
      }
      poseT -= dt;
      if (poseT <= 0) {
        poseT += 0.25;
        poseI = (poseI + 1) % 12;
        poses[poseI] = snapshotPose(px, pz, hp);
      }
    } else {
      yellowOn = false;
      poses = [];
    }
  }
  function rewindPos() {
    if (!poses.length) return null;
    return poses[(poseI + 1) % poses.length];
  }
  function bladeModeOf() {
    if (!k || !k.i) return 0;
    var d = k.i.Da;
    if (d === 1 || d === 2 || d === 3 || d === 4) return d;
    return d ? 1 : 0;
  }
  function timeScaleOf(mode) {
    if (mode === 2) return 0;
    if (mode === 1) return 0.3;
    return 1;
  }

  function buildView(px, pz, dt) {
    var enemies = liveEnemies().map(function (e) {
      var pos = e.mesh.position;
      return {
        x: pos.x, z: pos.z, type: enemyName(e),
        hp: e.hp || 2, speed: e.speed, reach: e.reach, dmg: e.dmg, kb: e.kb,
        windup: e.windup, recoveryT: e.recoveryT || 0
      };
    });
    var mode = bladeModeOf();
    var tick = spikeTick();
    var wave = (k && k.ba && k.ba.Xb != null) ? k.ba.Xb : parseInt(SB.wave, 10) || 1;
    if (String(wave) !== String(waveSeen)) {
      waveSeen = String(wave);
      waveStartedAt = nowT;
    }
    updatePoses(px, pz, (k && k.i && k.i.Y) || SB.hp, dt, mode);
    return {
      t: nowT,
      trapTime: tick / 400,
      spikeTick: tick,
      spikesUp: spikesUpNow(),
      safeTime: safeTimeNow(),
      enemies: enemies,
      fireballs: liveFireballs(),
      darts: liveDarts(),
      noodles: liveNoodles(),
      blades: liveBlades(),
      hp: (k && k.i && k.i.Y != null) ? k.i.Y : 5,
      hpMax: (k && k.i && k.i.Hb) || 5,
      iframes: 0,
      heldBlade: (k && k.i && k.i.Rb != null) ? k.i.Rb : -1,
      bladeMode: mode,
      bladeWe: 0,
      bladeUntil: 0,
      timeScale: timeScaleOf(mode),
      rewindPos: rewindPos(),
      wave: wave,
      waveStart: waveStartedAt,
      waveAge: Math.max(0, nowT - (waveStartedAt || nowT)),
      dt: dt,
      score: parseInt(SB.score, 10) || 0,
      kills: SB.runKills || 0,
      threatAt: threatAt,
      dartThreat: threatAt(px, pz, 0)
    };
  }

  function applyOut(out, t0) {
    out = out || {};
    var keys = out.keys || {};
    applyGameKeys(keys);
    var labels = [];
    if (keys.ArrowUp) labels.push("Up");
    if (keys.ArrowDown) labels.push("Down");
    if (keys.ArrowLeft) labels.push("Left");
    if (keys.ArrowRight) labels.push("Right");
    SB.keys = labels.join("+") || "none";
    SB.state = out.state || SB.state;
    SB.wp = (out.tx != null && out.tz != null) ? (out.tx + "," + out.tz) : (SB.wp || "");
    if (out.wi != null) SB.wi = out.wi;
    var acts = {
      attack: !!out.attack,
      useBlade: !!out.useBlade,
      discardBlade: !!out.discardBlade,
      bladeRewind: !!out.bladeRewind,
      dashFx: out.dashFx,
      dashFz: out.dashFz,
      bladeReason: out.bladeReason || out.state || "",
      fx: out.fx, fz: out.fz
    };
    SB.acts = acts;
    SB.attack = acts.attack;
    if (acts.attack) {
      try { if (k && typeof k.Fd === "function") k.Fd(); else key(" ", true, true); } catch (e) {}
      setTimeout(function () { try { key(" ", false, true); SB.attack = false; } catch (e2) {} }, 90);
    }
    if (acts.useBlade) {
      try {
        if (typeof gw.sa === "function") gw.sa();
        else {
          key("Control", true, true);
          setTimeout(function () { try { key("Control", false, true); } catch (e3) {} }, 80);
        }
      } catch (err) { SB.err = "blade " + ((err && err.message) || err); }
    }
    if (t0 - lastKeyRefresh > 0.20) {
      lastKeyRefresh = t0;
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].forEach(function (n) {
        if (keys[n]) dispatchKey(n, true);
      });
    }
  }

  function dtStats() {
    var i, tmp = dtBuf.slice(), p50 = 1 / 60, p95 = 1 / 60, mx = 0;
    if (tmp.length) {
      tmp.sort(function (a, b) { return a - b; });
      p50 = tmp[Math.min(tmp.length - 1, Math.floor(0.50 * tmp.length))];
      p95 = tmp[Math.min(tmp.length - 1, Math.floor(0.95 * tmp.length))];
      mx = tmp[tmp.length - 1];
    }
    return { p50: +p50.toFixed(4), p95: +p95.toFixed(4), max: +Math.max(mx, dtMaxSeen).toFixed(4), over40: dtOver40, n: dtCount, frames: dtIdx };
  }
  function noteFrameDt(t0) {
    if (lastFrameT > 0) {
      lastDt = Math.max(0.001, Math.min(0.2, t0 - lastFrameT));
      dtBuf.push(lastDt);
      if (dtBuf.length > 240) dtBuf.shift();
      dtCount = dtBuf.length;
      dtIdx++;
      if (lastDt > dtMaxSeen) dtMaxSeen = lastDt;
      if (lastDt > 0.04) dtOver40++;
    }
    lastFrameT = t0;
  }

  var liteApplied = false, liteW = 0, liteH = 0;
  function lightenRenderer() {
    try {
      if (!k || !k.renderer) return;
      var r = k.renderer, win = gw || window;
      var w = win.innerWidth || 800, h = win.innerHeight || 600;
      if (liteApplied && w === liteW && h === liteH) return;
      liteW = w; liteH = h;
      if (r.setPixelRatio) r.setPixelRatio(0.5);
      if (r.setSize) r.setSize(w, h, true);
      if (r.shadowMap) {
        if (r.shadowMap.enabled != null) r.shadowMap.enabled = false;
        if (r.shadowMap.autoUpdate != null) r.shadowMap.autoUpdate = false;
      }
      // Never write renderer.shadowMapEnabled: THREE logs
      // ".shadowMapEnabled is now .shadowMap.enabled" every frame from
      // lib1.js and the flood costs live dt (v44 p95 32ms, 183 frames >40ms).
      liteApplied = true;
      SB.lite = "pr=0.5 no-shadow";
    } catch (e) {}
  }

  function classifyDeath(px, pz) {
    var reason = "dead";
    if (k && k.i && k.i.Ta) reason = "water";
    var last;
    if (SB.hpEvents && SB.hpEvents.length) {
      last = SB.hpEvents[SB.hpEvents.length - 1];
      if (last && last.cause && last.cause !== "unknown") reason = last.cause;
    }
    return reason;
  }
  function logDeath(reason) {
    if (deathLogged) return;
    var src = lastAlivePos || { x: SB.px, z: SB.pz };
    var atOrigin = Math.hypot(+src.x || 0, +src.z || 0) < 2;
    if (!everAlive && atOrigin && !(parseInt(SB.score, 10) > 0)) return;
    deathLogged = true;
    var rec = {
      x: +(+src.x || 0).toFixed(2), z: +(+src.z || 0).toFixed(2),
      reason: reason || "die", score: SB.score, wave: SB.wave,
      state: SB.state, wp: SB.wp, t: Date.now(),
      hpEvents: (SB.hpEvents || []).slice(-8),
      kills: SB.runKills || 0,
      trace: trace.slice()
    };
    SB.deaths.push(rec);
    if (!firstDeathTrace && rec.trace && rec.trace.length) firstDeathTrace = rec.trace.slice();
    finished = true;
    SB.finished = true;
    try { console.log("[SB v" + VER + " death] " + rec.reason + "/" + rec.state + " (" + rec.x + "," + rec.z + ") sc=" + rec.score + " w=" + rec.wave); } catch (e) {}
    persistLog();
  }
  function logPayload() {
    var genMax = GEN;
    try { if (TOP.__SB_GEN != null) genMax = TOP.__SB_GEN; } catch (e) {}
    return {
      ver: SB.ver, kind: KIND, gen: GEN, instances: genMax,
      runs: SB.runs, deaths: SB.deaths, hpEvents: SB.hpEvents || [],
      dt: dtStats(), lite: SB.lite || "", bladeUses: SB.bladeUses || [],
      trace: (firstDeathTrace && firstDeathTrace.length) ? firstDeathTrace.slice() : trace.slice(),
      finished: !!finished,
      current: {
        score: SB.score, wave: SB.wave, kills: SB.runKills || 0, hp: SB.hp,
        x: +(+SB.px).toFixed(2), z: +(+SB.pz).toFixed(2),
        state: SB.state, wp: SB.wp, t: Date.now(), alive: !!everAlive, gen: GEN
      }
    };
  }
  function persistLog() {
    var json = JSON.stringify(logPayload());
    try { if (TOP.localStorage) TOP.localStorage.setItem("__SB_dump_v" + VER, json); } catch (e) {}
    TOP.__SB_dump = function () { return JSON.stringify(logPayload()); };
    try { TOP["__SB_dump_v" + VER] = TOP.__SB_dump; } catch (e2) {}
    SB.dump = TOP.__SB_dump;
  }
  function logRun() {
    var score = SB.score, wave = SB.wave, kills = SB.runKills;
    if (score === "?" && wave === "?") return;
    if (String(wave) === "0") return;
    var last = SB.runs[SB.runs.length - 1];
    var now = Date.now();
    if (last && String(last.score) === String(score) && String(last.wave) === String(wave) && (now - (last.t || 0)) < 8000) return;
    var deathReason = "";
    if (SB.deaths.length && SB.deaths[SB.deaths.length - 1].t >= now - 4000) deathReason = SB.deaths[SB.deaths.length - 1].reason;
    SB.runs.push({
      score: score, wave: wave, kills: kills, ver: VER, gen: GEN, t: now,
      x: +(+((lastAlivePos && lastAlivePos.x) || SB.px || 0)).toFixed(2),
      z: +(+((lastAlivePos && lastAlivePos.z) || SB.pz || 0)).toFixed(2),
      state: SB.state, reason: deathReason
    });
  }
  function endRunCapture(force) {
    if (!force && !isGameOver() && !deathLogged) return;
    if (runDumped) { persistLog(); return; }
    logRun();
    persistLog();
    runDumped = true;
  }
  function downloadLog() {
    persistLog();
    try {
      var n = 0, i, r, name, blob, a, doc, url;
      for (i = 0; i < SB.runs.length; i++) { r = SB.runs[i]; if (r && String(r.ver) === String(VER)) n++; }
      name = "sumpfarena-v" + VER + "-log-" + n + ".json";
      blob = new Blob([JSON.stringify(logPayload())], { type: "application/json" });
      doc = TOP.document;
      a = doc.createElement("a");
      url = URL.createObjectURL(blob);
      a.href = url; a.download = name; a.style.display = "none";
      doc.body.appendChild(a); a.click();
      setTimeout(function () { try { URL.revokeObjectURL(url); if (a.parentNode) a.parentNode.removeChild(a); } catch (e) {} }, 1500);
    } catch (e) { SB.err = "dump " + ((e && e.message) || e); }
  }
  function clickUi() {
    if (!gw || !gw.document) return;
    var ok = [Q(".okButton"), Q(".okTutorialButton")].filter(visible)[0];
    if (ok) { clickEl(ok); return; }
    var buttons = gw.document.querySelectorAll("button"), i, b, again = null;
    for (i = 0; i < buttons.length; i++) {
      b = buttons[i];
      if (visible(b) && /nochmal/i.test(b.textContent || "")) { again = b; break; }
    }
    if (again) {
      if (everAlive) logDeath(classifyDeath(SB.px, SB.pz));
      endRunCapture(true);
      // v48: do not auto-click "nochmal" after the first death. Live v47
      // restarts overwrote the top-level trace and then died in a mid-dock
      // stall at (15.76,1). Keep the first run's dump and stop re-running.
      if (finished || deathLogged) {
        SB.state = "stopped-after-death";
        persistLog();
        return;
      }
      clickEl(again);
      SB.wave = "1"; SB.score = "0"; SB.state = "restart"; SB.runKills = 0; lastScoreNum = 0;
      return;
    }
    if (finished || deathLogged) return;
    // v52: Kartenwahl wie im Spiel: Hauptmenue-Spielen -> Auswahl (.nav .next = Pfeil rechts)
    // -> Auswahl-Spielen (.playButton). Giftsumpf = level index 1 (k.level.da.current).
    var lvCur = (k && k.level && k.level.da) ? k.level.da.current : null;
    var pickPlay = Q(".playButton");
    if (visible(pickPlay)) {
      if (lvCur !== 1) {
        var pickNext = Q(".nav .next");
        if (visible(pickNext)) clickEl(pickNext);
      } else {
        clickEl(pickPlay);
      }
    } else {
      var mainPlay = Q("button.play.pulse");
      if (visible(mainPlay)) clickEl(mainPlay);
    }
  }
  function syncHud() {
    if (k && k.i) { SB.hp = k.i.Y; SB.hpMax = k.i.Hb || 5; SB.blade = k.i.Rb; }
    if (k && k.ba && k.ba.Xb != null) SB.wave = String(k.ba.Xb);
    else { var wn = Q(".waveNumber"); if (visible(wn)) SB.wave = (wn.textContent || "").trim(); }
    var sc = (typeof gw.C === "number" ? gw.C : (typeof gw.K === "number" ? gw.K : null));
    if (sc != null) SB.score = String(parseInt(sc, 10));
    else {
      var el = Q("#game .score") || Q(".score");
      if (visible(el)) { var m = /(\d+)/.exec(el.textContent || ""); if (m) SB.score = m[1]; }
    }
    var sn = parseInt(SB.score, 10);
    if (!isNaN(sn) && sn > lastScoreNum) { if (lastScoreNum > 0 || sn >= 5) SB.runKills += 1; lastScoreNum = sn; }
    else if (!isNaN(sn) && sn === 0) lastScoreNum = 0;
    SB.kills = SB.runKills;
    SB.tick = spikeTick();
  }
  function padInfo(px, pz) {
    var np = traps.nearestPad ? traps.nearestPad(px, pz) : { dist: 99, pad: null };
    return { dist: np.dist, pad: np.pad || null, hit: np.dist < ((traps.SPIKE_HIT_R || 2.5) + 0.4) };
  }
  function nearEnemiesList(px, pz, r) {
    var ens = liveEnemies(), i, pos, d, out = [];
    r = r == null ? 12 : r;
    for (i = 0; i < ens.length; i++) {
      pos = ens[i].mesh && ens[i].mesh.position;
      if (!pos) continue;
      d = Math.hypot(pos.x - px, pos.z - pz);
      if (d <= r) out.push({ type: enemyName(ens[i]), dist: +d.toFixed(2), x: +pos.x.toFixed(2), z: +pos.z.toFixed(2) });
    }
    out.sort(function (a, b) { return a.dist - b.dist; });
    return out;
  }
  function noteTrace(force) {
    if (!force && nowT - lastTraceT < 1) return;
    lastTraceT = nowT;
    var px = +SB.px || 0, pz = +SB.pz || 0, pad = padInfo(px, pz);
    var tick = spikeTick();
    var rec = {
      t: +nowT.toFixed(2), x: +px.toFixed(2), z: +pz.toFixed(2),
      hp: SB.hp, state: SB.state, wp: SB.wp, keys: SB.keys,
      wave: SB.wave, score: SB.score,
      spikeUp: spikesUpNow(), tick: +tick.toFixed(1), safe: +safeTimeNow().toFixed(2),
      pad: +pad.dist.toFixed(2),
      enemies: nearEnemiesList(px, pz, 12)
    };
    trace.push(rec);
    if (trace.length > 60) trace.shift();
  }
  function recordHpLoss(before, after, px, pz) {
    var pad = padInfo(px, pz);
    var ens = nearEnemiesList(px, pz, 14);
    var ev = {
      t: Date.now(), hpBefore: before, hpAfter: after, amount: +(before - after).toFixed(2),
      x: +(+px).toFixed(2), z: +(+pz).toFixed(2),
      spikeUp: spikesUpNow(), spikeTick: +spikeTick().toFixed(1),
      pad: +pad.dist.toFixed(2), onPad: !!pad.hit,
      nearestEnemy: ens[0] || { type: null, dist: 99 },
      enemies: ens.slice(0, 6),
      state: SB.state, wp: SB.wp
    };
    var fb = 99, i, fbs = liveFireballs();
    for (i = 0; i < fbs.length; i++) {
      var fd = Math.hypot(fbs[i].x - px, fbs[i].z - pz);
      if (fd < fb) fb = fd;
    }
    ev.nearestFireball = +fb.toFixed(2);
    ev.nearestDart = (function () {
      var ds = liveDarts(), j, best = 99, dd;
      for (j = 0; j < ds.length; j++) {
        dd = Math.hypot(ds[j].x - px, ds[j].z - pz);
        if (dd < best) best = dd;
      }
      return +best.toFixed(2);
    })();
    // amount>=2 is always an axe in this game (axe $b=2). Do not require
    // dist<4: live v44 hits landed at 4.00–4.33 (Ge sa at V=3, zb=2).
    if (ev.amount >= 2) ev.cause = "enemy/axe";
    else if (ev.spikeUp && pad.hit) ev.cause = "spike";
    else if (ev.nearestDart < 2.5) ev.cause = "arrow";
    else if (ev.nearestFireball < 2.2) ev.cause = "fireball";
    else if (ev.nearestEnemy.dist < 5.5 && ev.nearestEnemy.type) ev.cause = "enemy/" + ev.nearestEnemy.type;
    else ev.cause = "unknown";
    SB.hpEvents = (SB.hpEvents || []).concat([ev]).slice(-40);
    noteTrace(true);
    try { persistLog(); } catch (e) {}
  }
  function ensureOverlay() {
    var doc = TOP.document;
    if (!doc || !doc.body) return;
    var old = doc.getElementById("__sb_overlay");
    if (old && old !== overlay) old.parentNode.removeChild(old);
    if (overlay && overlay.parentNode) return;
    overlay = doc.createElement("div");
    overlay.id = "__sb_overlay";
    overlay.style.cssText = "position:fixed;top:8px;right:8px;z-index:2147483647;min-width:250px;max-width:380px;max-height:58vh;overflow:auto;background:rgba(8,12,10,.88);color:#d6ffd0;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;padding:8px 10px;border:1px solid #3a7;border-radius:6px;pointer-events:none;white-space:pre-wrap;";
    doc.body.appendChild(overlay);
  }
  function renderOverlay() {
    if (!overlay) return;
    var runs = SB.runs.slice(-8).map(function (r, i) {
      var n = SB.runs.length - Math.min(SB.runs.length, 8) + i + 1;
      return n + ". score " + r.score + "  wave " + r.wave + (r.kills != null ? "  k" + r.kills : "");
    }).join("\n") || "(keine Läufe)";
    var deaths = SB.deaths.slice(-6).map(function (d, i) {
      return (SB.deaths.length - Math.min(SB.deaths.length, 6) + i + 1) +
        ". (" + d.x + "," + d.z + ") " + (d.reason || "") + " " + (d.state || "");
    }).join("\n") || "(keine)";
    var hits = (SB.hpEvents || []).slice(-5).map(function (e) {
      return (e.hpBefore + "->" + e.hpAfter + " " + (e.cause || "?") + " (" + e.x + "," + e.z + ")");
    }).join("\n") || "(keine)";
    var html =
      "Sumpf-Arena Bot v" + SB.ver + " (brain " + KIND + ")\n" +
      "state  " + SB.state + "\n" +
      "pos    " + (+SB.px || 0).toFixed(1) + ", " + (+SB.pz || 0).toFixed(1) + "\n" +
      "keys   " + SB.keys + "\n" +
      "HP     " + SB.hp + "/" + SB.hpMax + "   kills " + SB.runKills + "\n" +
      "wave   " + SB.wave + "   score " + SB.score + "\n" +
      "near   " + (+SB.nearest || 0).toFixed(1) + "  enm " + SB.enemies + "  fire " + SB.fireballs + "\n" +
      "atk    " + (SB.attack ? "YES" : "no") + "  blade " + SB.blade + "  tick " + (+SB.tick || 0).toFixed(0) + "\n" +
      "gen    " + GEN + (SB.err ? "\nERR    " + SB.err : "") + "\n" +
      "--- Läufe ---\n" + runs + "\n--- Treffer ---\n" + hits + "\n--- Tode ---\n" + deaths;
    if (html !== lastHud) { lastHud = html; overlay.textContent = html; }
  }
  function runtimeSelfCheck() {
    if (!k || !k.i || !k.i.v) return;
    var p = k.i.v.position;
    var lines = ["player " + p.x.toFixed(2) + "," + p.z.toFixed(2) + " generated-from-brain " + KIND];
    SB.sanity = lines.join(" | ");
    checkedMap = true;
    try { console.log("[SB v" + VER + " sanity]", lines); } catch (e) {}
  }
  function startBrain(px, pz) {
    var loopDir = 1;
    try { if (typeof TOP.__SB_LOOPDIR === "number" && TOP.__SB_LOOPDIR) loopDir = TOP.__SB_LOOPDIR; } catch (e) {}
    var wi = ringIndexNear(px, pz);
    brain.reset({ x: px, z: pz, wi: wi, loopDir: loopDir, t: 0 });
  }

  function stepBrain(t0) {
    var p = playerPos();
    if (!p) { SB.state = "wait-player"; SB.acts = null; return; }
    if (!checkedMap) runtimeSelfCheck();
    SB.px = p.x; SB.pz = p.z;
    if (prevPos) {
      var dtp = Math.max(0.008, t0 - prevPos[2]);
      vel[0] = (p.x - prevPos[0]) / dtp;
      vel[1] = (p.z - prevPos[1]) / dtp;
      SB.vn = Math.hypot(vel[0], vel[1]);
    }
    prevPos = [p.x, p.z, t0];
    lastAlivePos = { x: p.x, z: p.z, t: t0 };

    if (Math.hypot(p.x, p.z) < 8 && (p.y == null || p.y > -0.5) && !traps.isSpikeCell(p.x, p.z) &&
        !(k && k.X /* mid-ring if already on the rail */ && Math.hypot(p.x, p.z) > 6)) {
      /* spawn island */
    }
    if (Math.hypot(p.x, p.z) < 6 && (p.y == null || p.y > -1)) {
      /* at spawn: brain still steers toward the ring after reset */
    }

    var ens = liveEnemies();
    SB.enemies = ens.length;
    SB.fireballs = (k && k.Vc && k.Vc.active) || 0;
    var near = 99, i, pos, d;
    for (i = 0; i < ens.length; i++) {
      pos = ens[i].mesh && ens[i].mesh.position;
      if (!pos) continue;
      d = Math.hypot(pos.x - p.x, pos.z - p.z);
      if (d < near) near = d;
    }
    SB.nearest = near;

    var view = buildView(p.x, p.z, lastDt);
    var out = brain.step(p.x, p.z, t0, view);
    applyOut(out, t0);
    noteTrace(false);
  }

  function tick() {
    if (!genAlive()) { stop(); return; }
    try {
      if (!gw || !gw.k) {
        gw = findGameWindow();
        if (gw) k = gw.k || null;
        return;
      }
      k = gw.k || k;
      var t0 = ((gw.performance) || performance).now() / 1000;
      nowT = t0;
      noteFrameDt(t0);
      lightenRenderer();
      syncHud();
      var hpNow = (k && k.i && typeof k.i.Y === "number") ? k.i.Y : SB.hp;
      if (typeof lastHp === "number" && typeof hpNow === "number" && hpNow < lastHp - 0.01 && lastHp > 0) {
        recordHpLoss(lastHp, hpNow, SB.px, SB.pz);
      }
      var deadNow = isGameOver();
      if (everAlive && deadNow) logDeath(classifyDeath(SB.px, SB.pz));
      var p = playerPos();
      var running = inRound();
      var atSpawn = p && Math.hypot(p.x, p.z) < 6 && (p.y == null || p.y > -1);
      if (finished) {
        releaseAllKeys();
        if (SB.state !== "stopped-after-death") SB.state = "stopped-after-death";
        SB.acts = null;
        prevPos = null;
        lastHp = hpNow;
        return;
      }
      if (running && atSpawn && (SB._alive !== true || (lastHp <= 0 && hpNow > 0) || (SB.state === "falling" && k.i && k.i.Ta === false))) {
        startBrain(p.x, p.z);
        SB.runKills = 0; lastScoreNum = parseInt(SB.score, 10) || 0;
        deathLogged = false; everAlive = true; runDumped = false;
        SB.hpEvents = []; trace = []; lastTraceT = -99;
        SB.state = "start"; SB._alive = true;
        waveStartedAt = t0; waveSeen = "";
        releaseAllKeys(true);
        focusCanvas();
      } else if (running && SB._alive !== true && p && !atSpawn) {
        deathLogged = false; everAlive = true; runDumped = false;
        startBrain(p.x, p.z);
        SB.hpEvents = []; trace = []; lastTraceT = -99;
        SB.state = "loop";
        SB._alive = true;
      }
      if (running) SB._alive = true;
      lastHp = hpNow;
      if (deadNow) {
        if (everAlive) logDeath(classifyDeath(SB.px, SB.pz));
        endRunCapture();
        releaseAllKeys();
        if (SB.state !== "restart" && SB.state !== "falling") SB.state = "wait-round";
        SB._alive = false;
        SB.acts = null;
        prevPos = null;
        return;
      }
      if (!running) {
        releaseAllKeys();
        if (SB.state !== "restart" && SB.state !== "falling" && SB.state !== "wait-spawn") SB.state = "wait-round";
        SB.acts = null;
        return;
      }
      if (k.i && k.i.Ta) {
        if (!deathLogged) logDeath("water");
        releaseAllKeys();
        SB.state = "falling";
        SB.acts = null;
        return;
      }
      everAlive = true;
      stepBrain(t0);
    } catch (e) {
      SB.err = (e && e.message) || String(e);
    }
  }
  function loop() {
    if (!genAlive()) { stop(); return; }
    tick();
    if (!genAlive()) return;
    rafId = (gw || TOP).requestAnimationFrame(loop);
    try { if (TOP.__SB_TIMERS) TOP.__SB_TIMERS.raf = rafId; } catch (e) {}
  }
  function boot() {
    ensureOverlay();
    persistLog();
    renderOverlay();
    gw = findGameWindow();
    if (gw) k = gw.k || null;
    uiTimer = setInterval(function () {
      if (!genAlive()) { try { clearInterval(uiTimer); } catch (e) {} return; }
      try { clickUi(); } catch (e) { SB.err = e.message; }
    }, 70);
    overlayTimer = setInterval(function () {
      if (!genAlive()) { try { clearInterval(overlayTimer); } catch (e) {} return; }
      try {
        ensureOverlay();
        renderOverlay();
        try { TOP.document.title = "V" + SB.ver + " " + SB.score + " w" + SB.wave + " " + SB.state; } catch (e) {}
        if (nowT - lastPersistT > 2) { lastPersistT = nowT; persistLog(); }
      } catch (e2) {}
    }, 250);
    try { TOP.__SB_TIMERS = { raf: 0, ui: uiTimer, ov: overlayTimer }; } catch (e) {}
    loop();
  }
  boot();
})(__require, "48", "48");
})();