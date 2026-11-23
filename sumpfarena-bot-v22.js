(function () {
  "use strict";

  var TOP = window;
  var prevRuns = [];
  var prevDeaths = [];
  if (TOP.__SB) {
    try {
      if (TOP.__SB.runs) prevRuns = TOP.__SB.runs.slice();
      if (TOP.__SB.deaths) prevDeaths = TOP.__SB.deaths.slice();
      if (typeof TOP.__SB.stop === "function") TOP.__SB.stop();
    } catch (e) {}
  }

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
  var ARRIVE = 0.8;
  var N4 = [[3, 0], [-3, 0], [0, 3], [0, -3]];
  var LS_DEATHS = "__SB_deaths_v22";
  var LS_BLACKLIST = "__SB_blacklist_v22";

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
    ver: 22,
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
  var lastSegA = null, lastSegB = null, joinEnd = [24, 0];
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

  function stop() {
    stopped = true;
    if (rafId) {
      try { (gw || TOP).cancelAnimationFrame(rafId); } catch (e) { try { TOP.cancelAnimationFrame(rafId); } catch (e2) {} }
      rafId = 0;
    }
    if (uiTimer) { clearInterval(uiTimer); uiTimer = 0; }
    if (overlayTimer) { clearInterval(overlayTimer); overlayTimer = 0; }
    try { releaseAllKeys(); } catch (e) {}
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
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
  function segKey(ax, az, bx, bz) {
    var a = (+ax).toFixed(1) + "," + (+az).toFixed(1);
    var b = (+bx).toFixed(1) + "," + (+bz).toFixed(1);
    return a < b ? a + ">" + b : b + ">" + a;
  }
  function loadBlacklist() {
    try {
      var raw = TOP.localStorage && TOP.localStorage.getItem(LS_BLACKLIST);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveBlacklist(list) {
    try { if (TOP.localStorage) TOP.localStorage.setItem(LS_BLACKLIST, JSON.stringify(list.slice(-80))); } catch (e) {}
  }
  var blacklist = loadBlacklist();
  function isBlockedSeg(ax, az, bx, bz) {
    var key = segKey(ax, az, bx, bz), i, b, k2;
    for (i = 0; i < blacklist.length; i++) {
      b = blacklist[i];
      if (segKey(b.ax, b.az, b.bx, b.bz) === key) return true;
    }
    return false;
  }
  function rememberWaterDeath(rec) {
    var ax, az, bx, bz, c, i, already, key;
    if (lastSegA && lastSegB) { ax = lastSegA[0]; az = lastSegA[1]; bx = lastSegB[0]; bz = lastSegB[1]; }
    else {
      c = cellOf(rec.x, rec.z);
      ax = c[0]; az = c[1];
      bx = ax; bz = az;
      if (rec.wp) {
        var m = /(-?\d+),\s*(-?\d+)/.exec(rec.wp);
        if (m) { bx = +m[1]; bz = +m[2]; }
      }
    }
    key = segKey(ax, az, bx, bz);
    already = false;
    for (i = 0; i < blacklist.length; i++) {
      if (segKey(blacklist[i].ax, blacklist[i].az, blacklist[i].bx, blacklist[i].bz) === key) { already = true; break; }
    }
    if (!already) {
      blacklist.push({ ax: ax, az: az, bx: bx, bz: bz, x: rec.x, z: rec.z, wp: rec.wp || "", t: rec.t || Date.now() });
      saveBlacklist(blacklist);
    }
    SB.bl = blacklist.length;
    try { if (k && k.X) rebuildRingFromF(); } catch (e) {}
  }
  function seedBlacklistFromDeaths(list) {
    if (!list || !list.length) return;
    var i, d, reason;
    for (i = 0; i < list.length; i++) {
      d = list[i];
      reason = (d && d.reason) || "";
      if (!/^water/i.test(reason)) continue;
      lastSegA = null; lastSegB = null;
      rememberWaterDeath(d);
    }
  }
  function segmentClear(ax, az, bx, bz, allowBlocked) {
    if (!allowBlocked && isBlockedSeg(ax, az, bx, bz)) return false;
    var dist = Math.hypot(bx - ax, bz - az);
    var n = Math.max(1, Math.ceil(dist / 0.25)), i, t, x, z;
    var dx = bx - ax, dz = bz - az, L = dist || 1;
    var px = -dz / L, pz = dx / L;
    for (i = 0; i <= n; i++) {
      t = i / n;
      x = ax + dx * t;
      z = az + dz * t;
      if (!isPb(x, z)) return false;
      if (!isPb(x + px * 0.6, z + pz * 0.6)) return false;
      if (!isPb(x - px * 0.6, z - pz * 0.6)) return false;
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
  function pathDirOk(cx, cz, dx, dz) {
    if (!isPb(cx, cz)) return false;
    var L = Math.hypot(dx, dz) || 1;
    var ux = dx / L, uz = dz / L;
    var px = -uz, pz = ux;
    return isPb(cx + ux * 0.6, cz + uz * 0.6) &&
      isPb(cx - ux * 0.6, cz - uz * 0.6) &&
      isPb(cx + px * 0.6, cz + pz * 0.6) &&
      isPb(cx - px * 0.6, cz - pz * 0.6);
  }
  function nextStepToward(px, pz, tx, tz) {
    if (segmentClear(px, pz, tx, tz)) return [tx, tz];
    var path = bfsTo(px, pz, [[tx, tz]]);
    if (path && path.length >= 2) {
      if (segmentClear(px, pz, path[1][0], path[1][1])) return [path[1][0], path[1][1]];
    }
    if (path && path.length >= 1 && isPb(path[0][0], path[0][1])) return [path[0][0], path[0][1]];
    if (segmentClear(px, pz, tx, tz, true)) return [tx, tz];
    return null;
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
    var cand = [], i, j, c, n, p, nxt, ddx, ddz, dropped = 0, lines = [], typ, live, path, fill;
    for (i = 0; i < PLAN.length; i++) {
      c = PLAN[i];
      typ = (k && k.X && typeof gw.F === "function") ? gw.F(k.X, { x: c[0], y: 0, z: c[1] }) : null;
      p = PLAN[(i - 1 + PLAN.length) % PLAN.length];
      n = PLAN[(i + 1) % PLAN.length];
      ddx = n[0] - p[0]; ddz = n[1] - p[1];
      if (!ddx && !ddz) { ddx = n[0] - c[0]; ddz = n[1] - c[1]; }
      if (cellAllowed(c[0], c[1]) && typ === k.X.type.pb && pathDirOk(c[0], c[1], ddx, ddz)) {
        cand.push([c[0], c[1], c[2]]);
      } else {
        dropped++;
        lines.push("DROP " + c[0] + "," + c[1] + " " + c[2] + " F=" + typ);
      }
    }
    live = [];
    for (i = 0; i < cand.length; i++) {
      if (!live.length) { live.push(cand[i]); continue; }
      p = live[live.length - 1];
      nxt = cand[i];
      ddx = nxt[0] - p[0]; ddz = nxt[1] - p[1];
      if (((Math.abs(ddx) === 3 && ddz === 0) || (Math.abs(ddz) === 3 && ddx === 0)) && segmentClear(p[0], p[1], nxt[0], nxt[1])) {
        live.push(nxt);
      } else if (segmentClear(p[0], p[1], nxt[0], nxt[1])) {
        fill = bfsTo(p[0], p[1], [nxt]);
        if (fill && fill.length >= 2) {
          for (j = 1; j < fill.length; j++) live.push([fill[j][0], fill[j][1], nxt[2] || "path"]);
        } else live.push(nxt);
      } else {
        fill = bfsTo(p[0], p[1], [nxt]);
        if (fill && fill.length >= 2) {
          for (j = 1; j < fill.length; j++) live.push([fill[j][0], fill[j][1], nxt[2] || "path"]);
        } else {
          dropped++;
          lines.push("GAP " + p[0] + "," + p[1] + "->" + nxt[0] + "," + nxt[1]);
        }
      }
    }
    if (live.length >= 8) RING = live;
    SB.dropped = dropped;
    SB.bl = blacklist.length;
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
    try { console.log("[SB v22 sanity]", lines); } catch (e) {}
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
    var onLane = Math.abs(Math.abs(x) - 6) < 1.6 || Math.abs(z - 21) < 1.6;
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
    var i, path, ends;
    for (i = 0; i < START_CANDIDATES.length; i++) {
      if (pathClear(START_CANDIDATES[i])) return START_CANDIDATES[i].map(function (p) { return [p[0], p[1]]; });
    }
    ends = [[24, 0], [0, 24], [-24, 0], [0, -24]];
    path = bfsTo(px, pz, ends);
    if (path && path.length) return path;
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
  function innerShortcut(px, pz, enemies) {
    var c = cellOf(px, pz), tries = [], i, n, j, e, blocked, h, best = null, bestH = Math.hypot(px, pz);
    tries.push([c[0] - 3 * (c[0] > 0 ? 1 : c[0] < 0 ? -1 : 0), c[1]]);
    tries.push([c[0], c[1] - 3 * (c[1] > 0 ? 1 : c[1] < 0 ? -1 : 0)]);
    var nbs = neighborsF(c[0], c[1]);
    for (i = 0; i < nbs.length; i++) tries.push(nbs[i]);
    for (i = 0; i < tries.length; i++) {
      n = tries[i];
      if (!isPb(n[0], n[1])) continue;
      if (!segmentClear(px, pz, n[0], n[1]) && !nextStepToward(px, pz, n[0], n[1])) continue;
      h = Math.hypot(n[0], n[1]);
      if (h >= bestH - 0.4) continue;
      blocked = false;
      for (j = 0; j < enemies.length; j++) {
        e = enemies[j].mesh.position;
        if (Math.hypot(e.x - n[0], e.z - n[1]) < 2.0) { blocked = true; break; }
      }
      if (!blocked && h < (best ? Math.hypot(best[0], best[1]) : 1e9)) best = n;
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
  function maybeUseBlade(px, pz, enemies) {
    if (!k || !k.i || k.i.Rb < 0) return;
    if (!(SB.nearest <= 2 && k.i.Y <= 2)) return;
    useZeitklingen();
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
    return reason;
  }
  function logDeath(reason) {
    if (deathLogged) return;
    var src = lastAlivePos || { x: SB.px, z: SB.pz, y: 0, dx: vel[0], dz: vel[1] };
    var rec = {
      x: +(+src.x).toFixed(2), z: +(+src.z).toFixed(2), y: +(+src.y || 0).toFixed(2),
      dx: +(src.dx || vel[0] || 0).toFixed(2), dz: +(src.dz || vel[1] || 0).toFixed(2),
      reason: reason || "die", score: SB.score, wave: SB.wave,
      state: SB.state, wp: SB.wp, t: Date.now()
    };
    var last = SB.deaths[SB.deaths.length - 1];
    if (last && rec.t - (last.t || 0) < 2000 && Math.hypot(rec.x - last.x, rec.z - last.z) < 0.6) {
      deathLogged = true;
      return;
    }
    deathLogged = true;
    SB.deaths.push(rec);
    saveDeaths(SB.deaths);
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
      "bl     " + (SB.bl || 0) + " segs  drop " + (SB.dropped || 0) + "\n" +
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
      logRun();
      clickEl(again);
      SB.wave = "1"; SB.score = "0"; SB.state = "restart"; SB.runKills = 0; lastScoreNum = 0;
      route = []; onRing = false;
      return;
    }
    var play = Q(".entry.level_02 .play");
    if (visible(play)) clickEl(play);
  }
  function logRun() {
    var score = SB.score, wave = SB.wave, kills = SB.runKills;
    if (score === "?" && wave === "?") return;
    var last = SB.runs[SB.runs.length - 1];
    var now = Date.now();
    if (last && String(last.score) === String(score) && String(last.wave) === String(wave) && (now - (last.t || 0)) < 5000) return;
    SB.runs.push({ score: score, wave: wave, kills: kills, ver: 22, t: now });
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
    lastSegA = null; lastSegB = null;
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
      [3, 0], [-3, 0], [0, 3], [0, -3]
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

  function applyVia(px, pz, tx, tz) {
    var nxt = nextStepToward(px, pz, tx, tz);
    if (nxt) return nxt;
    return [tx, tz];
  }
  function centrelineBias(px, pz, ax, az, bx, bz, vx, vz) {
    var dx = bx - ax, dz = bz - az, L = Math.hypot(dx, dz);
    if (L < 0.2) return [vx, vz];
    var ux = dx / L, uz = dz / L;
    var pxp = -uz, pzp = ux;
    var cte = (px - ax) * pxp + (pz - az) * pzp;
    if (Math.abs(cte) < 0.25) return [vx, vz];
    return [vx - pxp * cte * 1.6, vz - pzp * cte * 1.6];
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
      var cur = ringCell(SB.wi);
      if (cur && Math.hypot(cur[0] - p.x, cur[1] - p.z) < ARRIVE) {
        SB.wi = ((SB.wi + loopDir) % RING.length + RING.length) % RING.length;
      }
    }

    var tgt = currentTarget();
    var tx = tgt[0], tz = tgt[1];
    var segFrom = onRing ? ringCell(SB.wi - loopDir) : (routeI > 0 && route[routeI - 1] ? route[routeI - 1] : here);

    if (safetyBad(p.x, p.z) || !isPb(p.x, p.z)) {
      guardUntil = t0 + 0.2;
    }
    if (t0 < guardUntil) {
      var safeT = onRing ? ringCell(SB.wi) : (route[Math.min(routeI, Math.max(0, route.length - 1))] || joinEnd || [24, 0]);
      var via = applyVia(p.x, p.z, safeT[0], safeT[1]);
      tx = via[0]; tz = via[1];
      SB.state = onRing ? "loop" : "start";
    }

    if (k && k.i && k.i.Y < k.i.Hb) {
      var bowls = noodles(), bi, bowl, bd, bestB = null, bestBd = 1e9;
      for (bi = 0; bi < bowls.length; bi++) {
        bowl = bowls[bi];
        bd = Math.hypot(bowl.x - p.x, bowl.z - p.z);
        if (bd < 5 && isPb(bowl.x, bowl.z) && segmentClear(p.x, p.z, bowl.x, bowl.z) && bd < bestBd) {
          bestBd = bd; bestB = bowl;
        }
      }
      if (bestB) { tx = bestB.x; tz = bestB.z; SB.state = "noodle"; }
    }

    var ahead = enemyAhead(p.x, p.z, tx, tz, enemies, 4);
    if (ahead && onRing) {
      var opp = ringCell(SB.wi - loopDir);
      var otherAhead = enemyAhead(p.x, p.z, opp[0], opp[1], enemies, 4);
      if (otherAhead) {
        var inner = innerShortcut(p.x, p.z, enemies);
        if (inner) {
          var iv = applyVia(p.x, p.z, inner[0], inner[1]);
          tx = iv[0]; tz = iv[1];
          SB.state = "shortcut";
        } else if (k.i && k.i.Rb >= 0) {
          useZeitklingen();
          SB.state = "blade";
        } else {
          var esc2 = walkableEscape(p.x, p.z, enemies);
          if (esc2.length) {
            var ev = applyVia(p.x, p.z, esc2[0][0], esc2[0][1]);
            tx = ev[0]; tz = ev[1];
            SB.state = "dodge";
          } else {
            pulseAttack(t0);
            SB.state = "cornered";
          }
        }
      } else if (t0 >= reverseUntil) {
        loopDir *= -1;
        reverseUntil = t0 + 1.8;
        SB.wi = ((SB.wi + loopDir) % RING.length + RING.length) % RING.length;
        tgt = currentTarget();
        var rv = applyVia(p.x, p.z, tgt[0], tgt[1]);
        tx = rv[0]; tz = rv[1];
        SB.state = "reverse";
      } else {
        SB.state = "reverse";
        var rv2 = applyVia(p.x, p.z, tx, tz);
        tx = rv2[0]; tz = rv2[1];
      }
    } else if (ahead && !onRing) {
      var esc = walkableEscape(p.x, p.z, enemies);
      if (!esc.length) {
        pulseAttack(t0);
        SB.state = "cornered";
      } else {
        var evs = applyVia(p.x, p.z, esc[0][0], esc[0][1]);
        tx = evs[0]; tz = evs[1];
        SB.state = "dodge";
      }
    } else if (t0 < reverseUntil && onRing) {
      SB.state = "reverse";
    } else if (SB.state !== "noodle") {
      SB.state = onRing ? "loop" : "start";
    }

    var onPadNow = isSpikeCell(here[0], here[1]);
    if (onPadNow && (spikesUp() || spikeWindowHits(0, 0.35))) {
      if (onRing) SB.wi = ((SB.wi + loopDir) % RING.length + RING.length) % RING.length;
      tgt = currentTarget();
      tx = tgt[0]; tz = tgt[1];
    } else if (shouldWaitSpike(p.x, p.z, tx, tz) || dartThreatAt(tx, tz, Math.hypot(tx - p.x, tz - p.z) / 8)) {
      if (onRing) {
        var back1 = ringCell(SB.wi - loopDir);
        var back2 = ringCell(SB.wi - 2 * loopDir);
        var d1 = Math.hypot(back1[0] - p.x, back1[1] - p.z);
        if (d1 < 0.7) { tx = back2[0]; tz = back2[1]; }
        else { tx = back1[0]; tz = back1[1]; }
        SB.state = shouldWaitSpike(p.x, p.z, currentTarget()[0], currentTarget()[1]) ? "time-spike" : "time-dart";
      }
    }

    var viaT = applyVia(p.x, p.z, tx, tz);
    tx = viaT[0]; tz = viaT[1];
    lastSegA = [segFrom[0], segFrom[1]];
    lastSegB = [tx, tz];

    var vx = tx - p.x, vz = tz - p.z;
    if (onRing && segFrom) {
      var biased = centrelineBias(p.x, p.z, segFrom[0], segFrom[1], tx, tz, vx, vz);
      vx = biased[0]; vz = biased[1];
    }
    var stepLen = Math.hypot(vx, vz) || 1;
    var nextX = p.x + (vx / stepLen) * 0.8;
    var nextZ = p.z + (vz / stepLen) * 0.8;
    if (!isPb(nextX, nextZ) || !segmentClear(p.x, p.z, nextX, nextZ)) {
      var pull = onRing ? ringCell(SB.wi) : (joinEnd || here);
      if (!isPb(pull[0], pull[1])) pull = here;
      var pv = applyVia(p.x, p.z, pull[0], pull[1]);
      vx = pv[0] - p.x;
      vz = pv[1] - p.z;
    }

    var idx = chooseKa(vx, vz, t0, false);
    holdKa(idx, t0);
    maybeUseBlade(p.x, p.z, enemies);
    SB.wp = (onRing ? "R" + SB.wi + " " : "J" + routeI + " ") + tx.toFixed(0) + "," + tz.toFixed(0) + " " + (tgt[2] || "");

    if (t0 - lastFocus > 2.5) {
      lastFocus = t0;
      try { var cnv = canvasEl(); if (cnv && cnv.focus) cnv.focus(); } catch (e) {}
    }

    var keyHeld = !!(down.ArrowLeft || down.ArrowRight || down.ArrowUp || down.ArrowDown);
    if (keyHeld) {
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
          var nv = applyVia(p.x, p.z, nt[0], nt[1]);
          if (!tryAltDir(p.x, p.z, nv[0], nv[1], t0)) {
            holdKa(chooseKa(nv[0] - p.x, nv[1] - p.z, t0, true), t0);
          }
          SB.wp = (onRing ? "R" + SB.wi + " " : "J" + routeI + " ") + "unstick " + nv[0] + "," + nv[1];
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
    if (stopped) return;
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
      if ((lastHp > 0 && hpNow <= 0) || (k.i && k.i.la && !deathLogged)) logDeath(classifyDeath(SB.px, SB.pz));
      var p = playerPos();
      var running = inRound();
      var atSpawn = p && Math.hypot(p.x, p.z) < 6 && (p.y == null || p.y > -1);
      if (running && atSpawn && (SB._alive !== true || (lastHp <= 0 && hpNow > 0) || (SB.state === "falling" && k.i && k.i.Ta === false))) {
        onNewRound(t0, p);
        SB._alive = true;
      } else if (running && SB._alive !== true && p && !atSpawn) {
        var recov = bfsTo(p.x, p.z, RING);
        if (recov && recov.length) { route = recov; routeI = 0; onRing = false; joinEnd = recov[recov.length - 1]; }
        else { onRing = true; SB.wi = ringIndexNear(p.x, p.z); }
        SB.state = onRing ? "loop" : "start";
        SB._alive = true;
      } else if (running && SB.state === "falling" && k.i && k.i.Ta === false && !atSpawn) {
        SB.state = onRing ? "loop" : "start";
      }
      if (running) SB._alive = true;
      lastHp = hpNow;
      if (!running) {
        if (k && k.i && (k.i.la || hpNow <= 0) && !deathLogged) logDeath(classifyDeath(SB.px, SB.pz));
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
    if (stopped) return;
    tick();
    rafId = (gw || TOP).requestAnimationFrame(loop);
  }

  function boot() {
    ensureOverlay();
    try {
      var prev = (TOP.__SB && TOP.__SB.deaths) || [];
      seedBlacklistFromDeaths(prevDeaths);
      seedBlacklistFromDeaths(loadDeaths());
      SB.bl = blacklist.length;
    } catch (e) {}
    renderOverlay();
    gw = findGameWindow();
    if (gw) k = gw.k || null;
    uiTimer = setInterval(function () {
      if (stopped) return;
      try { clickUi(); } catch (e) { SB.err = e.message; }
    }, 70);
    overlayTimer = setInterval(function () {
      if (stopped) return;
      try {
        ensureOverlay();
        renderOverlay();
        try { TOP.document.title = "V" + SB.ver + " " + SB.score + " w" + SB.wave + " " + SB.state + " " + (SB.avg || 0).toFixed(1); } catch (e) {}
      } catch (e) {}
    }, 200);
    loop();
  }

  boot();
})();
