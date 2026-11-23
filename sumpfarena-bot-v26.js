(function () {
  "use strict";

  var TOP = window;
  var GEN = (TOP.__SB_GEN || 0) + 1;
  try { TOP.__SB_GEN = GEN; } catch (e) {}
  try { if (TOP.top && TOP.top !== TOP) TOP.top.__SB_GEN = GEN; } catch (e2) {}

  function allWindows() {
    var out = [], seen = [];
    function add(w) {
      if (!w || seen.indexOf(w) >= 0) return;
      seen.push(w);
      out.push(w);
    }
    add(TOP);
    try { add(TOP.top); } catch (e) {}
    try { add(TOP.parent); } catch (e) {}
    var di, docs = [];
    try { docs.push(TOP.document); } catch (e) {}
    try { if (TOP.top && TOP.top.document) docs.push(TOP.top.document); } catch (e) {}
    for (di = 0; di < docs.length; di++) {
      try {
        var frames = docs[di].querySelectorAll("iframe"), fi, cw;
        for (fi = 0; fi < frames.length; fi++) {
          try { cw = frames[fi].contentWindow; if (cw) add(cw); } catch (e) {}
        }
      } catch (e) {}
    }
    return out;
  }
  function forceReleaseKeys(w) {
    var names = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", " ", "Control"];
    var codes = { ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, " ": 32, Control: 17 };
    var i, ev, targets, ti, t, KE;
    try {
      if (w.k && w.k.key) {
        w.k.key.left = false; w.k.key.right = false; w.k.key.up = false;
        w.k.key.Cb = false; w.k.key.w = false; w.k.key.a = false; w.k.key.s = false; w.k.key.d = false;
      }
    } catch (e) {}
    try { KE = w.KeyboardEvent; } catch (e) { KE = KeyboardEvent; }
    if (!KE) return;
    for (i = 0; i < names.length; i++) {
      try {
        ev = new KE("keyup", { key: names[i] === "Control" ? "Control" : names[i], code: names[i] === " " ? "Space" : names[i] === "Control" ? "ControlLeft" : names[i], keyCode: codes[names[i]], which: codes[names[i]], bubbles: true, cancelable: true });
        targets = [];
        try { if (w.document) { targets.push(w.document); targets.push(w.document.body); var c = w.document.querySelector("canvas"); if (c) targets.push(c); } } catch (e) {}
        targets.push(w);
        for (ti = 0; ti < targets.length; ti++) {
          t = targets[ti];
          if (t && t.dispatchEvent) try { t.dispatchEvent(ev); } catch (e) {}
        }
      } catch (e) {}
    }
  }
  function stopPreviousBots() {
    var wins = allWindows(), wi, w, tm;
    for (wi = 0; wi < wins.length; wi++) {
      w = wins[wi];
      try { if (w.__SB && typeof w.__SB.stop === "function") w.__SB.stop(); } catch (e) {}
      try {
        tm = w.__SB_TIMERS;
        if (tm) {
          try { if (tm.raf) w.cancelAnimationFrame(tm.raf); } catch (e) {}
          try { if (tm.ui) clearInterval(tm.ui); } catch (e) {}
          try { if (tm.ov) clearInterval(tm.ov); } catch (e) {}
          w.__SB_TIMERS = null;
        }
      } catch (e) {}
      forceReleaseKeys(w);
      try { w.__SB_GEN = GEN; } catch (e) {}
    }
  }

  var prevRuns = [];
  stopPreviousBots();
  try { if (TOP.__SB && TOP.__SB.runs) prevRuns = TOP.__SB.runs.slice(); } catch (e) {}

  var KEYS = { ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, " ": 32, Control: 17 };
  var ARROWS = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
  var DIRS = [
    { ka: 0, keys: { ArrowRight: 1 } },
    { ka: 45, keys: { ArrowRight: 1, ArrowDown: 1 } },
    { ka: 90, keys: { ArrowDown: 1 } },
    { ka: 125, keys: { ArrowDown: 1, ArrowLeft: 1 } },
    { ka: 180, keys: { ArrowLeft: 1 } },
    { ka: 225, keys: { ArrowLeft: 1, ArrowUp: 1 } },
    { ka: 270, keys: { ArrowUp: 1 } },
    { ka: 315, keys: { ArrowUp: 1, ArrowRight: 1 } }
  ];
  var COS20 = 0.9397;
  var MIN_HOLD = 0.35;
  var ARRIVE = 0.55;
  var N4 = [[3, 0], [-3, 0], [0, 3], [0, -3]];
  var LS_DEATHS = "__SB_deaths_v26";
  var LS_DUMP = "__SB_dump_v26";

  var PLAN_PAIRS = "24,0,24,-3,24,-6,24,-9,24,-12,24,-15,24,-18,24,-21,24,-24,21,-24,18,-24,15,-24,12,-24,9,-24,6,-24,3,-24,0,-24,-3,-24,-6,-24,-9,-24,-12,-24,-15,-24,-18,-24,-21,-24,-24,-24,-24,-21,-24,-18,-24,-15,-24,-12,-24,-9,-24,-6,-24,-3,-24,0,-24,3,-24,6,-24,9,-24,12,-24,15,-24,18,-24,21,-24,24,-21,24,-18,24,-15,24,-12,24,-9,24,-6,24,-3,24,0,24,3,24,6,24,9,24,12,24,15,24,18,24,21,24,24,24,24,21,24,18,24,15,24,12,24,9,24,6,24,3".split(",");
  var PLAN_TAGS = "noodle,path,path,path,path,path,path,spike,blade,spike,path,path,path,path,path,path,path,path,path,path,path,path,path,spike,blade,spike,path,path,path,path,path,path,noodle,path,path,path,path,path,path,spike,blade,spike,path,path,path,path,dart,path,noodle,path,dart,path,path,path,path,spike,blade,spike,path,path,path,path,path,path".split(",");
  var PLAN = [];
  var pi;
  for (pi = 0; pi < PLAN_PAIRS.length; pi += 2) {
    PLAN.push([+PLAN_PAIRS[pi], +PLAN_PAIRS[pi + 1], PLAN_TAGS[pi / 2] || "path"]);
  }

  function axisPath(dx, dz) {
    var out = [[0, 0]], i;
    for (i = 3; i <= 24; i += 3) out.push([dx * i, dz * i]);
    return out;
  }
  var START_CANDIDATES = [axisPath(1, 0), axisPath(0, 1), axisPath(-1, 0), axisPath(0, -1)];

  function loadDeaths() {
    try {
      var raw = TOP.localStorage && TOP.localStorage.getItem(LS_DEATHS);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveDeaths(list) {
    try { if (TOP.localStorage) TOP.localStorage.setItem(LS_DEATHS, JSON.stringify(list.slice(-100))); } catch (e) {}
  }

  var SB = {
    ver: 26,
    gen: GEN,
    bl: 0,
    runs: prevRuns,
    deaths: loadDeaths(),
    err: "",
    sanity: "",
    state: "boot",
    n: 0,
    wi: 0,
    hp: 5,
    hpMax: 5,
    wave: "?",
    score: "0",
    rs: 0,
    vn: 0,
    avg: 0,
    attack: false,
    fireballs: 0,
    enemies: 0,
    nearest: 99,
    px: 0,
    pz: 0,
    kills: 0,
    runKills: 0,
    stuck: 0,
    keys: "",
    wp: "",
    tick: 0,
    blade: -1,
    dropped: 0,
    pk: [],
    stop: stop
  };
  TOP.__SB = SB;

  var gw = null, k = null, down = {}, overlay = null;
  var rafId = 0, uiTimer = 0, overlayTimer = 0, stopped = false;
  var lastHud = "", lastHp = 0, lastAttackAt = -9, lastWatchdog = 0, lastKeyRefresh = 0, lastFocus = 0;
  var stuckSince = 0, trail = [], speedHist = [], deathLogged = false, lastAlivePos = null;
  var antiT = 0, antiX = 0, antiZ = 0;
  var lastSegA = null, lastSegB = null, joinEnd = [24, 0], latKey = null;
  var waterSegCount = {}, sessionBlacklist = {}, runDumped = false, holdYieldUntil = 0;
  var prevPos = null, vel = [0, 0], curDir = 0, holdUntil = 0, lastScoreNum = 0;
  var RING = PLAN.slice();
  var route = [];
  var routeI = 0;
  var onRing = false;
  var loopDir = 1;
  var reverseUntil = 0;
  var waitUntil = 0;
  var guardUntil = 0;
  var checkedMap = false;
  var committed = false, commitExit = -1, shuttleToB = true, seekDirect = false;
  SB.hpEvents = [];

  function genAlive() {
    try { if (TOP.__SB_GEN !== GEN) return false; } catch (e) { return false; }
    return !stopped;
  }
  function stop() {
    stopped = true;
    if (rafId) {
      try { (gw || TOP).cancelAnimationFrame(rafId); } catch (e) { try { TOP.cancelAnimationFrame(rafId); } catch (e2) {} }
      rafId = 0;
    }
    if (uiTimer) { clearInterval(uiTimer); uiTimer = 0; }
    if (overlayTimer) { clearInterval(overlayTimer); overlayTimer = 0; }
    try { if (TOP.__SB_TIMERS) { TOP.__SB_TIMERS.raf = 0; TOP.__SB_TIMERS.ui = 0; TOP.__SB_TIMERS.ov = 0; } } catch (e) {}
    try { releaseAllKeys(true); } catch (e) {}
    try { forceReleaseKeys(gw || TOP); } catch (e) {}
    try { forceReleaseKeys(TOP); } catch (e) {}
    if (overlay && overlay.parentNode) try { overlay.parentNode.removeChild(overlay); } catch (e) {}
    overlay = null;
    SB.state = "stopped";
  }

  function findGameWindow() {
    if (TOP.k) return TOP;
    var frames = TOP.document.querySelectorAll("iframe"), i, f, cw;
    for (i = 0; i < frames.length; i++) {
      f = frames[i];
      try {
        cw = f.contentWindow;
        if (cw && cw.k && (cw.k.X || /games\/871\//.test(f.src || ""))) return cw;
      } catch (e) {}
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
    var ev = new gw.KeyboardEvent(isDown ? "keydown" : "keyup", {
      key: name === "Control" ? "Control" : name,
      code: name === " " ? "Space" : name === "Control" ? "ControlLeft" : name,
      keyCode: KEYS[name], which: KEYS[name], bubbles: true, cancelable: true
    });
    var c = canvasEl(), targets = [c, gw.document, gw.document && gw.document.body, gw], i, t, seen = [];
    for (i = 0; i < targets.length; i++) {
      t = targets[i];
      if (!t || !t.dispatchEvent || seen.indexOf(t) >= 0) continue;
      seen.push(t);
      try { t.dispatchEvent(ev); } catch (e) {}
    }
  }
  function key(name, isDown, force) {
    if (!force && !!down[name] === !!isDown) return;
    down[name] = !!isDown;
    dispatchKey(name, isDown);
  }

  function isPb(x, z) {
    if (!k || !k.X || typeof gw.F !== "function") return false;
    try {
      return gw.F(k.X, { x: x, y: 0, z: z }) === k.X.type.pb;
    } catch (e) { return false; }
  }
  function cellOf(x, z) {
    var ix = Math.floor((x + 67.5) / 3);
    var iz = Math.floor((z + 67.5) / 3);
    return [3 * ix - 67.5 + 1.5, 3 * iz - 67.5 + 1.5];
  }
  function segmentClear(ax, az, bx, bz) {
    var dist = Math.hypot(bx - ax, bz - az);
    var n = Math.max(1, Math.ceil(dist / 0.5)), i, t, x, z;
    for (i = 0; i <= n; i++) {
      t = i / n;
      x = ax + (bx - ax) * t;
      z = az + (bz - az) * t;
      if (!isPb(x, z)) return false;
    }
    return true;
  }
  function pathClear(pts) {
    var i;
    if (!pts || pts.length < 2) return !!(pts && pts.length && isPb(pts[0][0], pts[0][1]));
    for (i = 0; i < pts.length; i++) if (!isPb(pts[i][0], pts[i][1])) return false;
    for (i = 0; i < pts.length - 1; i++) if (!segmentClear(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])) return false;
    return true;
  }
  function segKey(ax, az, bx, bz) {
    var a = (+ax).toFixed(1) + "," + (+az).toFixed(1);
    var b = (+bx).toFixed(1) + "," + (+bz).toFixed(1);
    return a < b ? a + ">" + b : b + ">" + a;
  }
  function isBlockedSeg(ax, az, bx, bz) {
    return !!sessionBlacklist[segKey(ax, az, bx, bz)];
  }
  function rememberWaterDeath(rec) {
    var ax, az, bx, bz, c, key, n, m;
    if (lastSegA && lastSegB) { ax = lastSegA[0]; az = lastSegA[1]; bx = lastSegB[0]; bz = lastSegB[1]; }
    else {
      c = cellOf(rec.x, rec.z);
      ax = c[0]; az = c[1];
      bx = ax; bz = az;
      if (rec.wp) {
        m = /(-?\d+),\s*(-?\d+)/.exec(rec.wp);
        if (m) { bx = +m[1]; bz = +m[2]; }
      }
    }
    key = segKey(ax, az, bx, bz);
    n = (waterSegCount[key] || 0) + 1;
    waterSegCount[key] = n;
    if (n >= 2) {
      sessionBlacklist[key] = 1;
      SB.bl = Object.keys(sessionBlacklist).length;
    }
  }

  function neighborsF(cx, cz) {
    var out = [], i, nx, nz;
    for (i = 0; i < 4; i++) {
      nx = cx + N4[i][0];
      nz = cz + N4[i][1];
      if (isPb(nx, nz) && segmentClear(cx, cz, nx, nz)) out.push([nx, nz]);
    }
    return out;
  }

  function bfsTo(sx, sz, goals) {
    var start = cellOf(sx, sz);
    if (!isPb(start[0], start[1])) return null;
    var goalSet = {}, i, g, q, prev, cur, nbs, n, nk, key0, path, p;
    function ck(a, b) { return a + "," + b; }
    for (i = 0; i < goals.length; i++) {
      g = goals[i];
      if (isPb(g[0], g[1])) goalSet[ck(g[0], g[1])] = 1;
    }
    key0 = ck(start[0], start[1]);
    if (goalSet[key0]) return [start];
    q = [start];
    prev = {};
    prev[key0] = null;
    var qi = 0;
    while (qi < q.length && qi < 800) {
      cur = q[qi++];
      nbs = neighborsF(cur[0], cur[1]);
      for (i = 0; i < nbs.length; i++) {
        n = nbs[i];
        nk = ck(n[0], n[1]);
        if (prev[nk] !== undefined) continue;
        prev[nk] = cur;
        if (goalSet[nk]) {
          path = [n];
          p = cur;
          while (p) { path.push(p); p = prev[ck(p[0], p[1])]; }
          path.reverse();
          return path;
        }
        q.push(n);
      }
    }
    return null;
  }

  function isDoorCell(cx, cz) {
    return (Math.abs(cx) >= 28.5 && Math.abs(cz) < 4.5) || (Math.abs(cz) >= 28.5 && Math.abs(cx) < 4.5);
  }
  function cellAllowed(cx, cz) {
    if (isDoorCell(cx, cz)) return false;
    if (Math.abs(cx) >= 28.5 || Math.abs(cz) >= 28.5) return false;
    return isPb(cx, cz);
  }
  function rebuildRingFromF() {
    var live = [], i, c, dropped = 0, lines = [], typ;
    for (i = 0; i < PLAN.length; i++) {
      c = PLAN[i];
      typ = (k && k.X && typeof gw.F === "function") ? gw.F(k.X, { x: c[0], y: 0, z: c[1] }) : null;
      if (cellAllowed(c[0], c[1]) && typ === k.X.type.pb) live.push([c[0], c[1], c[2]]);
      else {
        dropped++;
        lines.push("DROP " + c[0] + "," + c[1] + " " + c[2] + " F=" + typ);
      }
    }
    if (live.length >= 8) RING = live;
    SB.dropped = dropped;
    return lines;
  }

  function runtimeSelfCheck() {
    if (!k || !k.X || typeof gw.F !== "function") return;
    var lines = [], p, t, i, c, ok, nOk = 0, nBad = 0;
    if (k.i && k.i.v) {
      p = k.i.v.position;
      t = gw.F(k.X, { x: p.x, y: 0, z: p.z });
      lines.push("player " + p.x.toFixed(2) + "," + p.z.toFixed(2) + " F=" + t + " pb=" + k.X.type.pb + " " + (t === k.X.type.pb ? "OK" : "NOT_WALKABLE"));
    }
    var dropLines = rebuildRingFromF();
    for (i = 0; i < PLAN.length; i++) {
      c = PLAN[i];
      ok = isPb(c[0], c[1]);
      if (ok) nOk++; else nBad++;
    }
    lines.push("ring planned " + PLAN.length + " live " + RING.length + " drop " + nBad);
    lines = lines.concat(dropLines.slice(0, 12));
    var east = START_CANDIDATES[0];
    lines.push("start east F=" + (pathClear(east) ? "CLEAR" : "BLOCKED"));
    SB.sanity = lines.join(" | ");
    checkedMap = true;
    try { console.log("[SB v26 sanity]", lines); } catch (e) {}
  }

  function yawTerm() {
    if (k && k.level && k.level.Ka) return k.level.Ka.rotation.y || 0;
    return 0.087266;
  }
  function worldDirFromKa(ka) {
    var theta = 0.0174533 * -(ka - 90 + yawTerm());
    return [Math.sin(theta), Math.cos(theta)];
  }

  function applyGameKeys(want) {
    if (k && k.key) {
      k.key.up = !!want.ArrowUp;
      k.key.Cb = !!want.ArrowDown;
      k.key.left = !!want.ArrowLeft;
      k.key.right = !!want.ArrowRight;
    }
    var name;
    for (name in { ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1 }) key(name, !!want[name]);
  }
  function chooseKa(vx, vz, t0, force) {
    var len = Math.hypot(vx, vz) || 1;
    vx /= len;
    vz /= len;
    var best = 0, bestDot = -2, i, d, dot;
    for (i = 0; i < DIRS.length; i++) {
      d = worldDirFromKa(DIRS[i].ka);
      dot = d[0] * vx + d[1] * vz;
      if (dot > bestDot) { bestDot = dot; best = i; }
    }
    if (!force && t0 < holdUntil) return curDir;
    if (!force) {
      d = worldDirFromKa(DIRS[curDir].ka);
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
  function holdKa(idx, t0) {
    var dir = DIRS[idx];
    var want = {
      ArrowUp: !!dir.keys.ArrowUp,
      ArrowDown: !!dir.keys.ArrowDown,
      ArrowLeft: !!dir.keys.ArrowLeft,
      ArrowRight: !!dir.keys.ArrowRight
    };
    applyGameKeys(want);
    var labels = [];
    if (want.ArrowUp) labels.push("Up");
    if (want.ArrowDown) labels.push("Down");
    if (want.ArrowLeft) labels.push("Left");
    if (want.ArrowRight) labels.push("Right");
    SB.keys = labels.join("+") || "none";
    if (t0 - lastKeyRefresh > 0.28) {
      lastKeyRefresh = t0;
      ARROWS.forEach(function (n) { if (want[n]) dispatchKey(n, true); });
    }
  }
  var CTE_ON = 0.22, CTE_OFF = 0.12;
  function projectSeg(px, pz, ax, az, bx, bz) {
    var dx = bx - ax, dz = bz - az, L = Math.hypot(dx, dz) || 1;
    var ux = dx / L, uz = dz / L;
    var pxp = -uz, pzp = ux;
    var t = ((px - ax) * ux + (pz - az) * uz) / L;
    var tC = t < 0 ? 0 : t > 1 ? 1 : t;
    var cte = (px - ax) * pxp + (pz - az) * pzp;
    return { ux: ux, uz: uz, pxp: pxp, pzp: pzp, cte: cte, t: t, remain: (1 - t) * L, cx: ax + ux * L * tC, cz: az + uz * L * tC };
  }
  function cardinalAlong(ux, uz) {
    if (Math.abs(ux) >= Math.abs(uz)) return ux >= 0 ? { ArrowRight: 1 } : { ArrowLeft: 1 };
    return uz >= 0 ? { ArrowDown: 1 } : { ArrowUp: 1 };
  }
  function lateralTowardCenter(cte, pxp, pzp) {
    if (Math.abs(cte) < CTE_OFF) return null;
    var vx = -pxp * (cte > 0 ? 1 : cte < 0 ? -1 : 0), vz = -pzp * (cte > 0 ? 1 : cte < 0 ? -1 : 0);
    if (Math.abs(vx) >= Math.abs(vz)) return vx >= 0 ? "ArrowRight" : "ArrowLeft";
    return vz >= 0 ? "ArrowDown" : "ArrowUp";
  }
  function wouldFallKeys(px, pz, keys, horizon) {
    var ka = null, up = !!keys.ArrowUp, down = !!keys.ArrowDown, left = !!keys.ArrowLeft, right = !!keys.ArrowRight;
    if (up && left) ka = 225;
    else if (up && right) ka = 315;
    else if (down && left) ka = 125;
    else if (down && right) ka = 45;
    else if (up && !down) ka = 270;
    else if (down && !up) ka = 90;
    else if (left && !right) ka = 180;
    else if (right && !left) ka = 0;
    if (ka == null) return !isPb(px, pz);
    var d = worldDirFromKa(ka), i, t, spd = (k && k.Ah) || 8;
    for (i = 1; i <= 10; i++) {
      t = horizon * i / 10;
      if (!isPb(px + d[0] * spd * t, pz + d[1] * spd * t)) return true;
    }
    return false;
  }
  function emptyKeys() { return { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 }; }
  function followCentreline(px, pz, ax, az, bx, bz) {
    var pr = projectSeg(px, pz, ax, az, bx, bz);
    var keys = emptyKeys();
    var along = cardinalAlong(pr.ux, pr.uz), kname;
    for (kname in along) if (along[kname]) keys[kname] = 1;
    if (Math.abs(pr.cte) > CTE_ON) latKey = lateralTowardCenter(pr.cte, pr.pxp, pr.pzp);
    else if (Math.abs(pr.cte) < CTE_OFF) latKey = null;
    if (latKey) keys[latKey] = 1;
    if (wouldFallKeys(px, pz, keys, 0.28)) {
      if (latKey) { keys[latKey] = 0; latKey = null; }
    }
    if (wouldFallKeys(px, pz, keys, 0.28)) {
      var opp = lateralTowardCenter(pr.cte || 0.3, pr.pxp, pr.pzp);
      if (opp) {
        keys[opp] = 1;
        if (wouldFallKeys(px, pz, keys, 0.28)) keys[opp] = 0;
        else latKey = opp;
      }
    }
    if (wouldFallKeys(px, pz, keys, 0.12)) {
      var toward = emptyKeys();
      if (Math.abs(bx - px) >= Math.abs(bz - pz)) {
        if (bx - px > 0.08) toward.ArrowRight = 1;
        else if (bx - px < -0.08) toward.ArrowLeft = 1;
      } else {
        if (bz - pz > 0.08) toward.ArrowDown = 1;
        else if (bz - pz < -0.08) toward.ArrowUp = 1;
      }
      if (!wouldFallKeys(px, pz, toward, 0.12)) keys = toward;
    }
    if (keys.ArrowUp && keys.ArrowDown) { keys.ArrowUp = 0; keys.ArrowDown = 0; }
    if (keys.ArrowLeft && keys.ArrowRight) { keys.ArrowLeft = 0; keys.ArrowRight = 0; }
    return keys;
  }
  function applyFollowKeys(keys, t0) {
    applyGameKeys(keys);
    var labels = [];
    if (keys.ArrowUp) labels.push("Up");
    if (keys.ArrowDown) labels.push("Down");
    if (keys.ArrowLeft) labels.push("Left");
    if (keys.ArrowRight) labels.push("Right");
    SB.keys = labels.join("+") || "none";
    if (t0 - lastKeyRefresh > 0.20) {
      lastKeyRefresh = t0;
      ARROWS.forEach(function (n) { if (keys[n]) dispatchKey(n, true); });
    }
  }

  function releaseAllKeys(force) {
    applyGameKeys({});
    Object.keys(KEYS).forEach(function (n) { key(n, false, force); });
    down = {};
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
  function spikesUp() {
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
  function isSpikeCell(cx, cz) {
    var i, o, c;
    if (!k || !k.level || !k.level.G) return false;
    var ch = k.level.G.children;
    for (i = 0; i < ch.length; i++) {
      o = ch[i];
      if (o && (o.Ga === "TRAPSPIKES" || /trapSpikes/i.test(o.name || "")) && o.position) {
        c = cellOf(o.position.x, o.position.z);
        if (Math.abs(c[0] - cx) < 0.1 && Math.abs(c[1] - cz) < 0.1) return true;
      }
    }
    return false;
  }
  function dartThreatAt(x, z, eta) {
    if (!k || !k.eb || !k.eb.array) return false;
    var n = k.eb.active || 0, i, d, fx, fz, px, pz, along, side, spd;
    for (i = 0; i < n; i++) {
      d = k.eb.array[i];
      if (!d || !d.position) continue;
      fx = (d.forward && d.forward.x) || 0;
      fz = (d.forward && d.forward.z) || 0;
      spd = d.speed || 20;
      px = d.position.x + fx * spd * (eta || 0);
      pz = d.position.z + fz * spd * (eta || 0);
      along = (x - px) * fx + (z - pz) * fz;
      side = Math.abs((x - px) * (-fz) + (z - pz) * fx);
      if (along > -2 && along < 8 && side < 2.0) return true;
    }
    var tick = spikeTick();
    var fireIn = ((500 - (tick % 1000) + 1000) % 1000) / 400;
    var onLane =
      (Math.abs(Math.abs(x) - 6) < 1.6 && z > 18) ||
      (Math.abs(Math.abs(z) - 6) < 1.6 && x > 18) ||
      (Math.abs(Math.abs(z) - 6) < 1.6 && x < -18);
    return onLane && fireIn < 0.35;
  }
  function spikeWindowHits(enterEta, leaveEta) {
    var t = spikeTick();
    var a = t + Math.max(0, enterEta) * 400;
    var b = t + Math.max(enterEta, leaveEta) * 400;
    var w;
    for (w = Math.floor(a / 1000) * 1000 + 900; w < b; w += 1000) {
      if (b > w && a < w + 100) return true;
    }
    return false;
  }
  function shouldWaitSpike(px, pz, tx, tz) {
    var c = cellOf(tx, tz);
    if (!isSpikeCell(c[0], c[1]) && !isSpikeCell(cellOf(px, pz)[0], cellOf(px, pz)[1])) return false;
    var dist = Math.hypot(tx - px, tz - pz);
    var eta = dist / 8;
    var onPad = isSpikeCell(cellOf(px, pz)[0], cellOf(px, pz)[1]);
    if (onPad) return spikeWindowHits(0, 0.4) || spikesUp();
    return spikeWindowHits(eta, eta + 0.4);
  }
  function ringCell(i) {
    if (!RING.length) return [24, 0, "path"];
    return RING[(((i % RING.length) + RING.length) % RING.length)];
  }


  function ringTag(i) {
    var c = ringCell(i);
    return (c && c[2]) || "path";
  }
  function isClusterTag(tag) { return tag === "spike" || tag === "blade"; }
  function alongDir(start, to, dir) {
    var n = RING.length;
    return ((to - start) * dir + n * 8) % n;
  }
  function clusterFrom(wi, dir) {
    var n = RING.length, cells = [], i = ((wi % n) + n) % n, guard = 0;
    if (!isClusterTag(ringTag(i))) return { indices: [], start: i, exit: i };
    while (isClusterTag(ringTag(i)) && guard++ < 8) {
      cells.push(i);
      i = ((i + dir) % n + n) % n;
    }
    return { indices: cells, start: cells[0], exit: i };
  }
  function nextCluster(px, pz, wi, dir) {
    var n = RING.length;
    var here = ringIndexNear(px, pz);
    var start = null, j, g, cl, hereOff, path, cx, cz, seq, idx, off, c, first, inside, etaEnter;
    if (isSpikeCell(px, pz) || isClusterTag(ringTag(here))) {
      j = here; g = 0;
      while (isClusterTag(ringTag(((j - dir) % n + n) % n)) && g++ < 8) j = ((j - dir) % n + n) % n;
      start = j;
    } else {
      j = here; g = 0;
      while (!isClusterTag(ringTag(j)) && g++ < n) j = ((j + dir) % n + n) % n;
      if (isClusterTag(ringTag(j))) start = j;
    }
    cl = start == null ? { indices: [], start: 0, exit: 0 } : clusterFrom(start, dir);
    if (!cl.indices.length) return { time: 0, cluster: cl, etaEnter: 0, inside: false };
    hereOff = alongDir(cl.start, here, dir);
    path = 0; cx = px; cz = pz; seq = [];
    for (g = 0; g < cl.indices.length; g++) {
      idx = cl.indices[g];
      off = alongDir(cl.start, idx, dir);
      if ((isSpikeCell(px, pz) || isClusterTag(ringTag(here))) && off <= hereOff) continue;
      seq.push(idx);
    }
    seq.push(cl.exit);
    for (g = 0; g < seq.length; g++) {
      c = ringCell(seq[g]);
      path += Math.hypot(c[0] - cx, c[1] - cz);
      cx = c[0]; cz = c[1];
    }
    first = ringCell(cl.start);
    etaEnter = Math.hypot(first[0] - px, first[1] - pz) / 8;
    inside = isSpikeCell(px, pz) || isClusterTag(ringTag(here));
    return { time: path / 8, cluster: cl, etaEnter: etaEnter, inside: inside };
  }
  function prePathCells(clusterStart, dir) {
    var n = RING.length, out = [], j = ((clusterStart - dir) % n + n) % n, g = 0;
    while (out.length < 2 && g++ < 10) {
      if (!isClusterTag(ringTag(j))) out.push(j);
      j = ((j - dir) % n + n) % n;
    }
    return out;
  }
  function safeTimeRemaining() {
    var t = spikeTick();
    if (t >= 900) return 0;
    return (900 - t) / 400;
  }
  function pathSafeTo(px, pz, tx, tz) {
    var dist = Math.hypot(tx - px, tz - pz), eta = dist / 8, steps, i, x, z;
    if (isSpikeCell(tx, tz) || isSpikeCell(px, pz)) {
      if (spikesUp() || safeTimeRemaining() < eta + 0.35) return false;
    }
    if (dartThreatAt(tx, tz, eta)) return false;
    steps = Math.max(2, Math.ceil(dist / 3));
    for (i = 1; i <= steps; i++) {
      x = px + (tx - px) * i / steps;
      z = pz + (tz - pz) * i / steps;
      if (!isPb(x, z)) return false;
      if (isSpikeCell(x, z) && (spikesUp() || safeTimeRemaining() < eta * (i / steps) + 0.25)) return false;
    }
    return true;
  }
  function enemyName(e) {
    var id = (e && (e.hb != null ? e.hb : e.type));
    return ({ 0: "snake", 1: "grunt", 2: "shield", 3: "axe", 4: "medusa", 5: "boss", 6: "boss2" })[id] || ("t" + id);
  }
  function nearestEnemyInfo(px, pz, enemies) {
    var best = { type: null, dist: 99 }, i, e, pos, d;
    for (i = 0; i < (enemies || []).length; i++) {
      e = enemies[i];
      pos = e.mesh && e.mesh.position;
      if (!pos) continue;
      d = Math.hypot(pos.x - px, pos.z - pz);
      if (d < best.dist) best = { type: enemyName(e), dist: +d.toFixed(2) };
    }
    return best;
  }
  function recordHpLoss(before, after, px, pz, enemies) {
    var ev = {
      t: Date.now(),
      hpBefore: before,
      hpAfter: after,
      amount: +(before - after).toFixed(2),
      x: +(+px).toFixed(2),
      z: +(+pz).toFixed(2),
      onSpikePad: isSpikeCell(px, pz),
      spikeUp: spikesUp(),
      spikeTick: +spikeTick().toFixed(1),
      spikePhase: spikesUp() ? "up" : ("down in " + safeTimeRemaining().toFixed(2) + "s"),
      nearestEnemy: nearestEnemyInfo(px, pz, enemies || liveEnemies()),
      nearestDart: +nearestDart(px, pz).toFixed(2),
      nearestFireball: +nearestFireball(px, pz).toFixed(2)
    };
    ev.cause = ev.onSpikePad && ev.spikeUp ? "spike"
      : (ev.nearestDart < 2.2 ? "dart"
        : (ev.nearestFireball < 2.2 ? "fireball"
          : (ev.nearestEnemy.dist < 4 ? "enemy/" + ev.nearestEnemy.type : "unknown")));
    SB.hpEvents = (SB.hpEvents || []).concat([ev]).slice(-24);
    try { console.log("[SB v26 hp] " + ev.hpBefore + "->" + ev.hpAfter + " " + ev.cause + " (" + ev.x + "," + ev.z + ") " + ev.spikePhase + " enm=" + ev.nearestEnemy.type + "@" + ev.nearestEnemy.dist); } catch (e) {}
    return ev;
  }

  function inRound() {
    if (!k || !k.i || !k.i.v) return false;
    if (k.i.la) return false;
    if (k.N && k.N.Ob === false && k.i.Ta) return false;
    return !!(k.i.v.visible && (k.N && k.N.Ob || k.i.Y > 0));
  }
  function playerPos() { return k && k.i && k.i.v ? k.i.v.position : null; }
  function liveEnemies() {
    var out = [], i, e;
    if (!k || !k.ba || !k.ba.K) return out;
    for (i = 0; i < k.ba.K.length; i++) {
      e = k.ba.K[i];
      if (e && e.alive && e.mesh) out.push(e);
    }
    return out;
  }
  function fireballCount() { return (k && k.Vc && k.Vc.active) || 0; }
  function nearestFireball(px, pz) {
    if (!k || !k.Vc || !k.Vc.j) return 99;
    var n = k.Vc.active || 0, i, f, pos, d, best = 99;
    for (i = 0; i < n; i++) {
      f = k.Vc.j[i];
      pos = (f && (f.wb || f.position)) || null;
      if (!pos) continue;
      d = Math.hypot(pos.x - px, pos.z - pz);
      if (d < best) best = d;
    }
    return best;
  }
  function nearestDart(px, pz) {
    if (!k || !k.eb || !k.eb.array) return 99;
    var n = k.eb.active || 0, i, d, best = 99, dist;
    for (i = 0; i < n; i++) {
      d = k.eb.array[i];
      if (!d || !d.position) continue;
      dist = Math.hypot(d.position.x - px, d.position.z - pz);
      if (dist < best) best = dist;
    }
    return best;
  }
  function noodles() {
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

  function safetyBad(px, pz) {
    var predX = px + vel[0] * 0.25, predZ = pz + vel[1] * 0.25;
    var pts = [
      [predX, predZ],
      [predX + 0.9, predZ + 0.9],
      [predX + 0.9, predZ - 0.9],
      [predX - 0.9, predZ + 0.9],
      [predX - 0.9, predZ - 0.9]
    ];
    var i;
    for (i = 0; i < pts.length; i++) if (!isPb(pts[i][0], pts[i][1])) return true;
    return false;
  }

  function pickStartRoute(px, pz) {
    var i;
    for (i = 0; i < START_CANDIDATES.length; i++) {
      if (pathClear(START_CANDIDATES[i])) return START_CANDIDATES[i].map(function (p) { return [p[0], p[1]]; });
    }
    return START_CANDIDATES[0].map(function (p) { return [p[0], p[1]]; });
  }
  function ringIndexAt(x, z) {
    var i, d;
    for (i = 0; i < RING.length; i++) {
      d = Math.hypot(RING[i][0] - x, RING[i][1] - z);
      if (d < 0.8) return i;
    }
    return -1;
  }
  function joinRingAtEnd(endx, endz) {
    var i = ringIndexAt(endx, endz);
    if (i < 0) i = ringIndexNear(endx, endz);
    onRing = true;
    SB.wi = i;
    SB.state = "loop";
    joinEnd = [endx, endz];
  }
  function enemyBehind(px, pz, tx, tz, enemies, distMax) {
    var dx = tx - px, dz = tz - pz, L = Math.hypot(dx, dz) || 1, i, e, ex, ez, d, best = null, bestD = 1e9;
    dx /= L; dz /= L;
    for (i = 0; i < enemies.length; i++) {
      e = enemies[i].mesh.position;
      ex = e.x - px; ez = e.z - pz;
      d = Math.hypot(ex, ez);
      if (d > distMax || d < 0.01) continue;
      if (ex * dx + ez * dz < 0 && d < bestD) { bestD = d; best = enemies[i]; }
    }
    return best;
  }
  function innerSafeCell(px, pz, enemies) {
    var c = cellOf(px, pz), i, nx, nz, j, e, blocked, h, best = null, bestH = Math.hypot(px, pz);
    for (i = 0; i < 4; i++) {
      nx = c[0] + N4[i][0];
      nz = c[1] + N4[i][1];
      if (!isPb(nx, nz)) continue;
      h = Math.hypot(nx, nz);
      if (h >= bestH - 0.2) continue;
      blocked = false;
      for (j = 0; j < enemies.length; j++) {
        e = enemies[j].mesh.position;
        if (Math.hypot(e.x - nx, e.z - nz) < 1.6) { blocked = true; break; }
      }
      if (!blocked) { best = [nx, nz]; bestH = h; }
    }
    return best;
  }

  function ringIndexNear(x, z) {
    var best = 0, bestD = 1e9, i, d;
    for (i = 0; i < RING.length; i++) {
      d = Math.hypot(RING[i][0] - x, RING[i][1] - z);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }
  function currentTarget() {
    if (!onRing) {
      if (!route.length) return [24, 0, "join"];
      var i = Math.min(routeI, route.length - 1);
      return [route[i][0], route[i][1], "join"];
    }
    var r = RING[((SB.wi % RING.length) + RING.length) % RING.length];
    return [r[0], r[1], r[2] || "path"];
  }

  function enemyAhead(px, pz, tx, tz, enemies, distMax) {
    var dx = tx - px, dz = tz - pz;
    var L = Math.hypot(dx, dz) || 1;
    dx /= L; dz /= L;
    var cosA = Math.cos(45 * Math.PI / 180);
    var i, e, ex, ez, d, along, best = null, bestD = 1e9;
    for (i = 0; i < enemies.length; i++) {
      e = enemies[i].mesh.position;
      ex = e.x - px; ez = e.z - pz;
      d = Math.hypot(ex, ez);
      if (d > distMax || d < 0.01) continue;
      along = (ex * dx + ez * dz) / d;
      if (along >= cosA && d < bestD) { bestD = d; best = enemies[i]; }
    }
    return best;
  }
  function walkableEscape(px, pz, enemies) {
    var c = cellOf(px, pz), nbs = neighborsF(c[0], c[1]), i, n, j, e, blocked, d, free = [];
    for (i = 0; i < nbs.length; i++) {
      n = nbs[i];
      blocked = false;
      for (j = 0; j < enemies.length; j++) {
        e = enemies[j].mesh.position;
        d = Math.hypot(e.x - n[0], e.z - n[1]);
        if (d < 1.6) { blocked = true; break; }
      }
      if (!blocked) free.push(n);
    }
    return free;
  }

  function pulseAttack(t0) {
    if (t0 - lastAttackAt < 0.5) return;
    if (k && k.i && k.i.na > 0) return;
    lastAttackAt = t0;
    SB.attack = true;
    try { if (k && typeof k.Fd === "function") k.Fd(); else key(" ", true, true); } catch (e) {}
    setTimeout(function () { try { key(" ", false, true); SB.attack = false; } catch (e2) {} }, 90);
  }
  function useZeitklingen() {
    if (!gw || typeof gw.D !== "function") return;
    try {
      if (typeof gw.sa === "function") { gw.sa(); return; }
    } catch (e) { SB.err = "blade " + ((e && e.message) || e); return; }
    try {
      key("Control", true, true);
      setTimeout(function () { try { key("Control", false, true); } catch (e2) {} }, 80);
    } catch (e3) {}
  }
  function isFrozen() {
    try { return !!(k && k.i && k.i.va && k.i.Da === k.i.va.stop); } catch (e) { return false; }
  }
  function findTank(enemies) {
    var i, e, pos, name;
    for (i = 0; i < (enemies || []).length; i++) {
      e = enemies[i];
      name = enemyName(e);
      if (name !== "axe" && name !== "boss" && name !== "boss2") continue;
      pos = e.mesh && e.mesh.position;
      if (pos) return { e: e, x: pos.x, z: pos.z, name: name };
    }
    return null;
  }
  function maybeUseBlade(px, pz, enemies) {
    if (!k || !k.i || k.i.Rb < 0) return;
    var color = k.i.Rb;
    var onTrap = isSpikeCell(px, pz) || /^(time-spike|hold-spike|retreat-spike|time-dart)$/.test(SB.state || "");
    var tank = findTank(enemies);
    var nearDeath = k.i.Y <= 2 && SB.nearest <= 2.4;
    var d = tank ? Math.hypot(tank.x - px, tank.z - pz) : 99;
    if (color === 1) {
      if (nearDeath || (tank && d < 8 && !onTrap) || (tank && d < 10 && !onTrap && SB.state === "hunt-axe")) useZeitklingen();
      return;
    }
    if (onTrap) return;
    if (color === 3 || color === 2) { useZeitklingen(); return; }
    if (color === 0 && tank) { useZeitklingen(); return; }
    if (color === 0 && SB.nearest <= 4 && k.i.Y <= 3) useZeitklingen();
  }

  function classifyDeath(px, pz) {
    var reason = "dead";
    if (k && k.i && k.i.Ta) reason = "water";
    else if (isPb && k && k.X && typeof gw.F === "function") {
      try { if (gw.F(k.X, { x: px, y: 0, z: pz }) === k.X.type.oc) reason = "water"; } catch (e) {}
    }
    var c = cellOf(px, pz);
    if (reason !== "water" && spikesUp() && isSpikeCell(c[0], c[1])) reason = "spike";
    var nd = nearestDart(px, pz);
    if (reason !== "water" && nd < 2.2) reason = "dart";
    var nf = nearestFireball(px, pz);
    if (reason !== "water" && nf < 2.2) reason = "fireball";
    if (reason === "dead" && SB.nearest < 4) reason = "enemy d=" + SB.nearest.toFixed(2);
    if (SB.hpEvents && SB.hpEvents.length) {
      var last = SB.hpEvents[SB.hpEvents.length - 1];
      if (last && Date.now() - last.t < 2000 && last.cause && last.cause !== "unknown") {
        if (reason === "dead" || reason.indexOf("enemy") === 0) reason = last.cause;
      }
    }
    return reason;
  }
  function logDeath(reason) {
    if (deathLogged) return;
    deathLogged = true;
    var src = lastAlivePos || { x: SB.px, z: SB.pz, y: 0, dx: vel[0], dz: vel[1] };
    var rec = {
      x: +(+src.x).toFixed(2), z: +(+src.z).toFixed(2), y: +(+src.y || 0).toFixed(2),
      dx: +(src.dx || vel[0] || 0).toFixed(2), dz: +(src.dz || vel[1] || 0).toFixed(2),
      reason: reason || "die", score: SB.score, wave: SB.wave,
      state: SB.state, wp: SB.wp, t: Date.now(),
      hpEvents: (SB.hpEvents || []).slice(-8)
    };
    SB.deaths.push(rec);
    saveDeaths(SB.deaths);
    try { console.log("[SB v26 death] " + (rec.reason || "") + "/" + (rec.state || "") + " (" + rec.x + "," + rec.z + ") wp=" + (rec.wp || "") + " sc=" + rec.score + " w=" + rec.wave); } catch (e) {}
    if (/^water/i.test(rec.reason || "")) rememberWaterDeath(rec);
  }
  function recordTrail(t0, p) {
    trail.push({ t: t0, x: +p.x, z: +p.z, y: +p.y, dx: vel[0], dz: vel[1] });
    while (trail.length && t0 - trail[0].t > 2.05) trail.shift();
    lastAlivePos = trail[trail.length - 1];
    speedHist.push({ t: t0, x: +p.x, z: +p.z });
    while (speedHist.length && t0 - speedHist[0].t > 1.05) speedHist.shift();
    if (speedHist.length >= 2) {
      var a = speedHist[0], b = speedHist[speedHist.length - 1];
      SB.avg = Math.hypot(b.x - a.x, b.z - a.z) / Math.max(0.05, b.t - a.t);
    }
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
        ". (" + d.x + "," + d.z + ") " + (d.reason || "") + " " + (d.state || "") + " " + (d.wp || "");
    }).join("\n") || "(keine)";
    var html =
      "Sumpf-Arena Bot v" + SB.ver + "\n" +
      "state  " + SB.state + (SB.stuck ? "  STUCK" : "") + (onRing ? "  ring" : "  join") + "\n" +
      "pos    " + SB.px.toFixed(1) + ", " + SB.pz.toFixed(1) + "\n" +
      "spd    " + (SB.vn || 0).toFixed(2) + "   avg1s " + (SB.avg || 0).toFixed(2) + "\n" +
      "wp     " + SB.wp + "\n" +
      "keys   " + SB.keys + "\n" +
      "HP     " + SB.hp + "/" + SB.hpMax + "   kills " + SB.runKills + "\n" +
      "wave   " + SB.wave + "   score " + SB.score + "\n" +
      "near   " + SB.nearest.toFixed(1) + "  enm " + SB.enemies + "  fire " + SB.fireballs + "\n" +
      "atk    " + (SB.attack ? "YES" : "no") + "  blade " + SB.blade + "  tick " + SB.tick.toFixed(0) + "\n" +
      "bl     " + (SB.bl || 0) + " segs  gen " + GEN + "\n" +
      (SB.sanity ? "map    " + SB.sanity + "\n" : "") +
      (SB.err ? "ERR    " + SB.err + "\n" : "") +
      "--- Läufe ---\n" + runs + "\n" +
      "--- Tode ---\n" + deaths;
    if (html !== lastHud) { lastHud = html; overlay.textContent = html; }
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
      if (lastHp > 0) logDeath(classifyDeath(SB.px, SB.pz));
      endRunCapture();
      clickEl(again);
      SB.wave = "1"; SB.score = "0"; SB.state = "restart"; SB.runKills = 0; lastScoreNum = 0;
      route = []; onRing = false;
      return;
    }
    var play = Q(".entry.level_02 .play");
    if (visible(play)) clickEl(play);
  }
  function logPayload() {
    return { ver: SB.ver, runs: SB.runs, deaths: SB.deaths, hpEvents: SB.hpEvents || [] };
  }
  function persistLog() {
    var json = JSON.stringify(logPayload());
    try { if (TOP.localStorage) TOP.localStorage.setItem(LS_DUMP, json); } catch (e) {}
    TOP.__SB_dump = function () { return JSON.stringify(logPayload()); };
    SB.dump = TOP.__SB_dump;
  }
  function downloadLog() {
    persistLog();
    try {
      var n = 0, i, r, name, blob, a, doc, url;
      for (i = 0; i < SB.runs.length; i++) { r = SB.runs[i]; if (r && r.ver === 25) n++; }
      name = "sumpfarena-v26-log-" + n + ".json";
      blob = new Blob([JSON.stringify(logPayload())], { type: "application/json" });
      doc = TOP.document;
      a = doc.createElement("a");
      url = URL.createObjectURL(blob);
      a.href = url;
      a.download = name;
      a.style.display = "none";
      doc.body.appendChild(a);
      a.click();
      setTimeout(function () { try { URL.revokeObjectURL(url); if (a.parentNode) a.parentNode.removeChild(a); } catch (e) {} }, 1500);
    } catch (e) { SB.err = "dump " + ((e && e.message) || e); }
  }
  function countVerRuns() {
    var n = 0, i, r;
    for (i = 0; i < SB.runs.length; i++) { r = SB.runs[i]; if (r && r.ver === 25) n++; }
    return n;
  }
  function endRunCapture() {
    logRun();
    persistLog();
    if (runDumped) return;
    runDumped = true;
    if (countVerRuns() % 10 === 0 && countVerRuns() > 0) downloadLog();
  }
  function logRun() {
    var score = SB.score, wave = SB.wave, kills = SB.runKills;
    if (score === "?" && wave === "?") return;
    if (String(wave) === "0") return;
    var last = SB.runs[SB.runs.length - 1];
    var now = Date.now();
    if (last && String(last.score) === String(score) && String(last.wave) === String(wave) && (now - (last.t || 0)) < 8000) return;
    SB.runs.push({ score: score, wave: wave, kills: kills, ver: 26, t: now });
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

  function onNewRound(t0, p) {
    SB.rs = t0;
    SB.runKills = 0;
    lastScoreNum = parseInt(SB.score, 10) || 0;
    deathLogged = false;
    trail = []; speedHist = [];
    stuckSince = 0; waitUntil = 0; guardUntil = 0; reverseUntil = 0; antiT = 0;
    loopDir = 1; onRing = false; holdUntil = 0;
    lastSegA = null; lastSegB = null; runDumped = false; holdYieldUntil = 0; latKey = null;
    committed = false; commitExit = -1; shuttleToB = true; seekDirect = false;
    SB.hpEvents = [];
    if (k && k.X) runtimeSelfCheck();
    route = pickStartRoute(p.x, p.z);
    routeI = 0;
    joinEnd = (route.length ? route[route.length - 1] : [24, 0]).slice(0, 2);
    SB.state = "start";
    releaseAllKeys(true);
    focusCanvas();
    lastFocus = t0;
    var tgt = route[1] || route[0] || [24, 0];
    var idx = chooseKa(tgt[0] - p.x, tgt[1] - p.z, t0, true);
    holdKa(idx, t0);
  }

  function tryAltDir(px, pz, tx, tz, t0) {
    var candidates = [
      [tx - px, tz - pz],
      [3, 0], [-3, 0], [0, 3], [0, -3],
      [3, 3], [3, -3], [-3, 3], [-3, -3]
    ];
    var i, dx, dz, len, nx, nz, best = null, bestDot = -1e9, dot, towardX = tx - px, towardZ = tz - pz, tlen;
    tlen = Math.hypot(towardX, towardZ) || 1;
    towardX /= tlen; towardZ /= tlen;
    for (i = 0; i < candidates.length; i++) {
      dx = candidates[i][0]; dz = candidates[i][1];
      len = Math.hypot(dx, dz) || 1;
      nx = px + dx / len * 1.2;
      nz = pz + dz / len * 1.2;
      if (!isPb(nx, nz) || !segmentClear(px, pz, nx, nz)) continue;
      if (!isPb(px + dx / len * 0.6, pz + dz / len * 0.6)) continue;
      dot = (dx / len) * towardX + (dz / len) * towardZ;
      if (best == null || dot > bestDot) { bestDot = dot; best = [dx, dz]; }
    }
    if (best) holdKa(chooseKa(best[0], best[1], t0, true), t0);
    return !!best;
  }

  function step(t0) {
    var p = playerPos();
    if (!p) { SB.state = "wait-player"; return; }
    if (!checkedMap && k && k.X) runtimeSelfCheck();
    SB.px = p.x; SB.pz = p.z;
    if (prevPos) {
      var dt = Math.max(0.008, t0 - prevPos[2]);
      vel[0] = (p.x - prevPos[0]) / dt;
      vel[1] = (p.z - prevPos[1]) / dt;
      SB.vn = Math.hypot(vel[0], vel[1]);
    }
    recordTrail(t0, p);

    if (k.i.Ta) {
      if (!deathLogged) logDeath("water");
      releaseAllKeys();
      SB.state = "falling";
      prevPos = [p.x, p.z, t0, p.y];
      return;
    }

    var enemies = liveEnemies();
    SB.enemies = enemies.length;
    var nd = 1e9, i, e, d;
    for (i = 0; i < enemies.length; i++) {
      e = enemies[i].mesh.position;
      d = Math.hypot(e.x - p.x, e.z - p.z);
      if (d < nd) nd = d;
    }
    SB.nearest = enemies.length ? nd : 99;
    SB.fireballs = fireballCount();
    var here = cellOf(p.x, p.z);

    if (!onRing) {
      if (!route.length) { route = pickStartRoute(p.x, p.z); routeI = 0; joinEnd = route[route.length - 1] || [24, 0]; }
      while (routeI < route.length && Math.hypot(route[routeI][0] - p.x, route[routeI][1] - p.z) < ARRIVE) routeI++;
      var end = joinEnd || route[route.length - 1] || [24, 0];
      if (routeI >= route.length || Math.hypot(end[0] - p.x, end[1] - p.z) < ARRIVE) {
        joinRingAtEnd(end[0], end[1]);
      }
    }
    if (onRing) {
      var nR = RING.length, gi, prA, prevA, nextA;
      for (gi = 0; gi < 6; gi++) {
        prevA = ringCell(SB.wi - loopDir);
        nextA = ringCell(SB.wi);
        prA = projectSeg(p.x, p.z, prevA[0], prevA[1], nextA[0], nextA[1]);
        if (Math.hypot(nextA[0] - p.x, nextA[1] - p.z) < ARRIVE || prA.t >= 0.92) {
          SB.wi = ((SB.wi + loopDir) % nR + nR) % nR;
          continue;
        }
        break;
      }
      var fromC = ringCell(SB.wi - loopDir), toC = ringCell(SB.wi);
      if (fromC && toC && isBlockedSeg(fromC[0], fromC[1], toC[0], toC[1])) {
        var skipI = ((SB.wi + loopDir) % RING.length + RING.length) % RING.length;
        var skipC = ringCell(skipI);
        if (skipC && !isBlockedSeg(fromC[0], fromC[1], skipC[0], skipC[1]) && isPb(skipC[0], skipC[1])) {
          SB.wi = skipI;
        } else {
          loopDir *= -1;
          latKey = null;
          SB.wi = ((SB.wi + loopDir) % RING.length + RING.length) % RING.length;
        }
      }
    }

    var tgt = currentTarget();
    var tx = tgt[0], tz = tgt[1];

    if (k && k.i && k.i.Y < k.i.Hb) {
      var bowls = noodles(), bi, bowl, bd, bestB = null, bestBd = 1e9;
      for (bi = 0; bi < bowls.length; bi++) {
        bowl = bowls[bi];
        bd = Math.hypot(bowl.x - p.x, bowl.z - p.z);
        if (bd < 14 && isPb(bowl.x, bowl.z) && pathSafeTo(p.x, p.z, bowl.x, bowl.z) && bd < bestBd) {
          bestBd = bd; bestB = bowl;
        }
      }
      if (bestB) { tx = bestB.x; tz = bestB.z; SB.state = "noodle"; }
    }

    var ahead = enemyAhead(p.x, p.z, tx, tz, enemies, 4);
    var behind = enemyBehind(p.x, p.z, tx, tz, enemies, 5);
    if (ahead && behind) {
      var inner = innerSafeCell(p.x, p.z, enemies);
      if (inner) { tx = inner[0]; tz = inner[1]; SB.state = "yield"; holdYieldUntil = t0 + 0.9; }
      else { SB.state = "yield"; holdYieldUntil = t0 + 0.5; }
      if (k && k.i && k.i.Rb >= 0 && k.i.Rb !== 1) useZeitklingen();
    } else if (t0 < holdYieldUntil) {
      SB.state = "yield";
    } else if (ahead) {
      var otherTgt = onRing ? ringCell(SB.wi - loopDir) : [p.x, p.z];
      var otherAhead = enemyAhead(p.x, p.z, otherTgt[0], otherTgt[1], enemies, 5);
      if (otherAhead && t0 >= reverseUntil && onRing) {
        var inner2 = innerSafeCell(p.x, p.z, enemies);
        if (inner2 && pathSafeTo(p.x, p.z, inner2[0], inner2[1])) {
          tx = inner2[0]; tz = inner2[1];
          SB.state = "cut-inner";
        } else {
          SB.state = "yield";
          holdYieldUntil = t0 + 0.5;
        }
        if (k && k.i && k.i.Rb >= 0 && k.i.Rb !== 1 && k.i.Y <= 3) useZeitklingen();
      } else if (t0 >= reverseUntil && onRing) {
        loopDir *= -1;
        latKey = null;
        committed = false;
        reverseUntil = t0 + 1.8;
        SB.wi = ((SB.wi + loopDir) % RING.length + RING.length) % RING.length;
        tgt = currentTarget();
        tx = tgt[0]; tz = tgt[1];
        SB.state = "reverse";
      } else if (t0 < reverseUntil && onRing) {
        SB.state = "reverse";
      } else {
        var esc = walkableEscape(p.x, p.z, enemies);
        if (!esc.length) {
          pulseAttack(t0);
          SB.state = "cornered";
        } else {
          tx = esc[0][0]; tz = esc[0][1];
          SB.state = "dodge";
        }
      }
    } else if (t0 < reverseUntil && onRing) {
      SB.state = "reverse";
    } else if (SB.state !== "noodle") {
      SB.state = onRing ? "loop" : "start";
    }

    seekDirect = false;
    if (onRing) {
      var info = nextCluster(p.x, p.z, SB.wi, loopDir);
      var onPad = isSpikeCell(here[0], here[1]);
      var margin = 0.20;
      var safe = safeTimeRemaining();
      var hereI = ringIndexNear(p.x, p.z);
      if (committed) {
        var exitC = ringCell(commitExit);
        var past = Math.hypot(exitC[0] - p.x, exitC[1] - p.z) < 1.0 ||
          (!onPad && !isClusterTag(ringTag(hereI)) && hereI === commitExit) ||
          (!onPad && !isClusterTag(ringTag(hereI)) &&
            alongDir(info.cluster.start || 0, hereI, loopDir) >= alongDir(info.cluster.start || 0, commitExit, loopDir));
        if (past) { committed = false; commitExit = -1; }
      }
      var canClearNow = !info.cluster.indices.length || (!spikesUp() && safe >= info.time + margin);
      if (!committed && info.cluster.indices.length) {
        var pres = prePathCells(info.cluster.start, loopDir);
        var iA = pres[0] != null ? pres[0] : ((info.cluster.start - loopDir + RING.length) % RING.length);
        var iB = pres[1] != null ? pres[1] : iA;
        var A = ringCell(iA), B = ringCell(iB);
        var timeToB = Math.hypot(B[0] - p.x, B[1] - p.z) / 8;
        var nearStage = Math.hypot(B[0] - p.x, B[1] - p.z) < 1.2 || Math.hypot(A[0] - p.x, A[1] - p.z) < 1.2;
        var clusterFar = info.etaEnter > safe + 0.25;
        var firstPad = ringCell(info.cluster.start);
        var lure = false, ei, epos, dPad, dMe, pulseIn;
        pulseIn = spikesUp() ? 0 : safe;
        if (pulseIn > 0 && pulseIn <= 1.05) {
          for (ei = 0; ei < enemies.length; ei++) {
            epos = enemies[ei].mesh && enemies[ei].mesh.position;
            if (!epos) continue;
            if (isSpikeCell(epos.x, epos.z) || isClusterTag(ringTag(ringIndexNear(epos.x, epos.z)))) { lure = true; break; }
            dPad = Math.hypot(epos.x - firstPad[0], epos.z - firstPad[1]);
            dMe = Math.hypot(p.x - firstPad[0], p.z - firstPad[1]);
            if (dPad < 16 && (dPad < dMe + 3 || dPad < 8)) { lure = true; break; }
          }
        }
        if (lure && !info.inside) {
          tx = B[0]; tz = B[1]; seekDirect = true; SB.state = "lure-spike";
        } else if (canClearNow) {
          committed = true; commitExit = info.cluster.exit;
        } else if (info.inside) {
          tx = B[0]; tz = B[1]; seekDirect = true; SB.state = "retreat-spike";
        } else if (clusterFar) {
          /* keep looping — pad is too far to reach this window */
        } else if (nearStage) {
          tx = B[0]; tz = B[1]; seekDirect = true; SB.state = "hold-spike";
        } else if (!spikesUp() && timeToB + 0.2 < safe) {
          tx = B[0]; tz = B[1]; seekDirect = true; SB.state = "stage-spike";
        } else {
          tx = B[0]; tz = B[1]; seekDirect = true; SB.state = "time-spike";
        }
      }
    }
    if ((SB.state === "loop" || SB.state === "reverse") && dartThreatAt(tx, tz, Math.hypot(tx - p.x, tz - p.z) / 8)) {
      var back1 = ringCell(SB.wi - loopDir);
      tx = back1[0]; tz = back1[1];
      seekDirect = true;
      SB.state = "time-dart";
    }

    // Attack-knockback only behind a trap, and never with a fireball or fast snake nearby.
    var hasFire = fireballCount() > 0 || nearestFireball(p.x, p.z) < 8;
    var hasSnake = false, si, epos2;
    for (si = 0; si < enemies.length; si++) {
      epos2 = enemies[si].mesh && enemies[si].mesh.position;
      if (!epos2) continue;
      if (enemyName(enemies[si]) === "snake" && Math.hypot(epos2.x - p.x, epos2.z - p.z) < 6) hasSnake = true;
    }
    if (!hasFire && !hasSnake && (SB.state === "loop" || SB.state === "time-spike" || SB.state === "lure-spike" || SB.state === "yield")) {
      var aj, apos, ad;
      for (aj = 0; aj < enemies.length; aj++) {
        apos = enemies[aj].mesh && enemies[aj].mesh.position;
        if (!apos) continue;
        ad = Math.hypot(apos.x - p.x, apos.z - p.z);
        if (ad > 2.8 || ad < 0.4) continue;
        if (!isSpikeCell(apos.x, apos.z) && !isSpikeCell((apos.x + p.x) / 2, (apos.z + p.z) / 2)) continue;
        if (!isSpikeCell(p.x, p.z) && (spikesUp() || safeTimeRemaining() < 0.5)) { pulseAttack(t0); break; }
      }
    }

    // v26: hunt the axe along the ring when holding red (or already frozen).
    // Never cut a corner: only retarget a ring cell that shares an axis with us.
    var tank = findTank(enemies);
    if (tank && (k.i.Rb === 1 || isFrozen()) && !hasFire) {
      var dTank = Math.hypot(tank.x - p.x, tank.z - p.z);
      var frozen = isFrozen();
      var snakeClose = false, s2, spos2;
      for (s2 = 0; s2 < enemies.length; s2++) {
        spos2 = enemies[s2].mesh && enemies[s2].mesh.position;
        if (spos2 && enemyName(enemies[s2]) === "snake" && Math.hypot(spos2.x - p.x, spos2.z - p.z) < 6.5) snakeClose = true;
      }
      if (frozen || !snakeClose) {
        if (frozen && dTank < 3.5) pulseAttack(t0);
        var usI = ringIndexNear(p.x, p.z);
        var themI = ringIndexNear(tank.x, tank.z);
        var nRi = RING.length;
        var dir0 = loopDir || 1;
        var fwd = ((themI - usI) * dir0 % nRi + nRi) % nRi;
        var dirH = fwd <= nRi - fwd ? dir0 : -dir0;
        var nextI = (usI + dirH + nRi) % nRi;
        var cH = ringCell(nextI);
        var nextIsCluster = isSpikeCell(cH[0], cH[1]) || cH[2] === "spike" || cH[2] === "blade";
        var uc = cellOf(p.x, p.z);
        function sharesAxis(ax, az) {
          var tc = cellOf(ax, az);
          return Math.abs(tc[0] - uc[0]) < 0.2 || Math.abs(tc[1] - uc[1]) < 0.2;
        }
        if (frozen && dTank < 6) {
          var Lh = dTank || 1;
          var sx = tank.x - ((tank.x - p.x) / Lh) * 2.15;
          var sz = tank.z - ((tank.z - p.z) / Lh) * 2.15;
          if (!isPb(sx, sz) || isSpikeCell(sx, sz) || !sharesAxis(sx, sz)) { sx = uc[0]; sz = uc[1]; }
          var fallK = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
          if (Math.abs(sx - p.x) >= Math.abs(sz - p.z)) {
            if (sx - p.x > 0.08) fallK.ArrowRight = 1; else if (sx - p.x < -0.08) fallK.ArrowLeft = 1;
          } else {
            if (sz - p.z > 0.08) fallK.ArrowDown = 1; else if (sz - p.z < -0.08) fallK.ArrowUp = 1;
          }
          if (!wouldFallKeys(p.x, p.z, fallK, 0.5)) {
            tx = sx; tz = sz; seekDirect = true; SB.state = "freeze-melee";
          } else SB.state = "freeze-melee";
        } else if ((frozen || !nextIsCluster) && sharesAxis(cH[0], cH[1])) {
          tx = cH[0]; tz = cH[1]; seekDirect = true; SB.state = frozen ? "freeze-melee" : "hunt-axe";
        } else {
          SB.state = frozen ? "freeze-melee" : "hunt-axe";
        }
      }
    }

    lastSegA = seekDirect ? [p.x, p.z] : (onRing ? ringCell(SB.wi - loopDir) : (routeI > 0 && route[routeI - 1] ? route[routeI - 1] : [p.x, p.z]));
    lastSegB = [tx, tz];

    var followKeys = followCentreline(p.x, p.z, lastSegA[0], lastSegA[1], tx, tz);
    if (seekDirect) {
      if (Math.abs(tx - p.x) >= Math.abs(tz - p.z)) { followKeys.ArrowUp = 0; followKeys.ArrowDown = 0; }
      else { followKeys.ArrowLeft = 0; followKeys.ArrowRight = 0; }
    }
    applyFollowKeys(followKeys, t0);
    maybeUseBlade(p.x, p.z, enemies);
    SB.wp = (onRing ? "R" + SB.wi + " " : "J" + routeI + " ") + tx.toFixed(0) + "," + tz.toFixed(0) + " " + (tgt[2] || "");

    if (t0 - lastFocus > 2.5) {
      lastFocus = t0;
      try { var cnv = canvasEl(); if (cnv && cnv.focus) cnv.focus(); } catch (e) {}
    }

    var keyHeld = !!(down.ArrowLeft || down.ArrowRight || down.ArrowUp || down.ArrowDown);
    if (keyHeld && t0 >= holdYieldUntil) {
      if (!antiT) { antiT = t0; antiX = p.x; antiZ = p.z; }
      if (t0 - antiT >= 0.6) {
        var disp = Math.hypot(p.x - antiX, p.z - antiZ);
        if (disp < 0.8) {
          SB.stuck = 1;
          holdUntil = 0;
          if (onRing) SB.wi = ((SB.wi + loopDir) % RING.length + RING.length) % RING.length;
          else {
            routeI++;
            var end2 = joinEnd || (route.length ? route[route.length - 1] : [24, 0]);
            if (routeI >= route.length || Math.hypot(end2[0] - p.x, end2[1] - p.z) < ARRIVE) {
              joinRingAtEnd(end2[0], end2[1]);
            }
          }
          var nt = currentTarget();
          latKey = null;
          applyFollowKeys(followCentreline(p.x, p.z, p.x, p.z, nt[0], nt[1]), t0);
          SB.wp = (onRing ? "R" + SB.wi + " " : "J" + routeI + " ") + "unstick " + nt[0] + "," + nt[1];
        } else SB.stuck = 0;
        antiT = t0; antiX = p.x; antiZ = p.z;
      }
    } else {
      antiT = 0;
      SB.stuck = 0;
    }
    prevPos = [p.x, p.z, t0, p.y];
  }


  function tick() {
    if (!genAlive()) { stop(); return; }
    try {
      SB.n++;
      if (!gw || !gw.k) {
        gw = findGameWindow();
        if (gw) k = gw.k || null;
        return;
      }
      k = gw.k || k;
      var t0 = ((gw.performance) || performance).now() / 1000;
      if (!checkedMap && k && k.X) runtimeSelfCheck();
      syncHud();
      var hpNow = SB.hp;
      if (lastHp > hpNow && lastHp > 0) recordHpLoss(lastHp, hpNow, SB.px, SB.pz, (k && k.ba) ? liveEnemies() : []);
      if ((lastHp > 0 && hpNow <= 0) || (k.i && k.i.la && !deathLogged)) logDeath(classifyDeath(SB.px, SB.pz));
      var p = playerPos();
      var running = inRound();
      var atSpawn = p && Math.hypot(p.x, p.z) < 6 && (p.y == null || p.y > -1);
      if (running && atSpawn && (SB._alive !== true || (lastHp <= 0 && hpNow > 0) || (SB.state === "falling" && k.i && k.i.Ta === false))) {
        onNewRound(t0, p);
        SB._alive = true;
      } else if (running && SB._alive !== true && p && !atSpawn) {
        onRing = true;
        SB.wi = ringIndexNear(p.x, p.z);
        SB.state = "loop";
        SB._alive = true;
      } else if (running && SB.state === "falling" && k.i && k.i.Ta === false && !atSpawn) {
        SB.state = onRing ? "loop" : "start";
      }
      if (running) SB._alive = true;
      lastHp = hpNow;
      if (!running) {
        if (k && k.i && (k.i.la || hpNow <= 0) && !deathLogged) logDeath(classifyDeath(SB.px, SB.pz));
        if (deathLogged || SB.rs) endRunCapture();
        releaseAllKeys();
        if (SB.state !== "restart" && SB.state !== "falling") SB.state = "wait-round";
        SB._alive = false;
        prevPos = null;
        return;
      }
      step(t0);
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
        try { TOP.document.title = "V" + SB.ver + " " + SB.score + " w" + SB.wave + " " + SB.state + " " + (SB.avg || 0).toFixed(1); } catch (e) {}
      } catch (e) {}
    }, 200);
    try { TOP.__SB_TIMERS = { raf: 0, ui: uiTimer, ov: overlayTimer }; } catch (e) {}
    loop();
  }

  boot();
})();
