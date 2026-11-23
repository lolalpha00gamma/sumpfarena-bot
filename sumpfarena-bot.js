(function () {
  "use strict";

  var TOP = window;
  var prevRuns = [];
  if (TOP.__SB) {
    try {
      if (TOP.__SB.runs) prevRuns = TOP.__SB.runs.slice();
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
  var N4 = [[3, 0], [-3, 0], [0, 3], [0, -3]];
  var CTE_MAX = 0.7;
  var LS_DEATHS = "__SB_deaths_v19";

  var WALK_PAIRS = "0,-36,3,-36,0,-33,3,-33,-6,-30,-3,-30,0,-30,3,-30,6,-30,-27,-27,-24,-27,-21,-27,-6,-27,-3,-27,0,-27,3,-27,6,-27,21,-27,24,-27,27,-27,-27,-24,-24,-24,-21,-24,-18,-24,-15,-24,-12,-24,-9,-24,-6,-24,-3,-24,0,-24,3,-24,6,-24,9,-24,12,-24,15,-24,18,-24,21,-24,24,-24,27,-24,-27,-21,-24,-21,-21,-21,-6,-21,-3,-21,0,-21,3,-21,6,-21,21,-21,24,-21,27,-21,-24,-18,0,-18,24,-18,-24,-15,0,-15,24,-15,-24,-12,-12,-12,-9,-12,-6,-12,-3,-12,0,-12,3,-12,6,-12,9,-12,12,-12,24,-12,-24,-9,-12,-9,-3,-9,0,-9,3,-9,12,-9,24,-9,-27,-6,-24,-6,-12,-6,-6,-6,-3,-6,0,-6,3,-6,6,-6,12,-6,24,-6,27,-6,-27,-3,-24,-3,-21,-3,-12,-3,-9,-3,-6,-3,-3,-3,0,-3,3,-3,6,-3,9,-3,12,-3,21,-3,24,-3,27,-3,-27,0,-24,0,-21,0,-18,0,-15,0,-12,0,-9,0,-6,0,-3,0,0,0,3,0,6,0,9,0,12,0,15,0,18,0,21,0,24,0,27,0,-27,3,-24,3,-21,3,-12,3,-9,3,-6,3,-3,3,0,3,3,3,6,3,9,3,12,3,21,3,24,3,27,3,-27,6,-24,6,-12,6,-6,6,-3,6,0,6,3,6,6,6,12,6,24,6,27,6,-24,9,-12,9,-3,9,0,9,3,9,12,9,24,9,-24,12,-12,12,-9,12,-6,12,-3,12,0,12,3,12,6,12,9,12,12,12,24,12,-24,15,0,15,24,15,-24,18,0,18,24,18,-27,21,-24,21,-21,21,-3,21,0,21,3,21,21,21,24,21,27,21,-27,24,-24,24,-21,24,-18,24,-15,24,-12,24,-9,24,-6,24,-3,24,0,24,3,24,6,24,9,24,12,24,15,24,18,24,21,24,24,24,27,24,-27,27,-24,27,-21,27,-6,27,-3,27,0,27,3,27,6,27,21,27,24,27,27,27".split(",");
  var WALK = {};
  var wi;
  for (wi = 0; wi < WALK_PAIRS.length; wi += 2) WALK[WALK_PAIRS[wi] + "," + WALK_PAIRS[wi + 1]] = 1;

  var RING_PAIRS = "24,0,24,-3,24,-6,24,-9,24,-12,24,-15,24,-18,24,-21,24,-24,21,-24,18,-24,15,-24,12,-24,9,-24,6,-24,3,-24,0,-24,-3,-24,-6,-24,-9,-24,-12,-24,-15,-24,-18,-24,-21,-24,-24,-24,-24,-21,-24,-18,-24,-15,-24,-12,-24,-9,-24,-6,-24,-3,-24,0,-24,3,-24,6,-24,9,-24,12,-24,15,-24,18,-24,21,-24,24,-21,24,-18,24,-15,24,-12,24,-9,24,-6,24,-3,24,0,24,3,24,6,24,9,24,12,24,15,24,18,24,21,24,24,24,24,21,24,18,24,15,24,12,24,9,24,6,24,3".split(",");
  var RING_TAGS = "noodle,path,path,path,path,path,path,spike,blade,spike,path,path,path,path,dart,path,path,path,dart,path,path,path,path,spike,blade,spike,path,path,path,path,path,path,noodle,path,path,path,path,path,path,spike+dart,blade,spike,path,path,path,path,dart,path,noodle,path,dart,path,path,path,path,spike,blade,spike+dart,path,path,path,path,path,path".split(",");
  var RING = [];
  var RING_SET = {};
  for (wi = 0; wi < RING_PAIRS.length; wi += 2) {
    var rc = [+RING_PAIRS[wi], +RING_PAIRS[wi + 1], RING_TAGS[wi / 2] || "path"];
    RING.push(rc);
    RING_SET[rc[0] + "," + rc[1]] = RING.length - 1;
  }

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
    ver: 19,
    runs: prevRuns,
    deaths: loadDeaths(),
    err: "",
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
    cte: 0,
    pathN: 0,
    pk: [],
    stop: stop
  };
  TOP.__SB = SB;

  var gw = null, k = null, down = {}, overlay = null;
  var rafId = 0, uiTimer = 0, overlayTimer = 0, stopped = false;
  var lastHud = "", lastHp = 0, lastAttackAt = -9, lastWatchdog = 0, lastKeyRefresh = 0, lastFocus = 0;
  var stuckSince = 0, trail = [], speedHist = [], deathLogged = false, lastAlivePos = null;
  var prevPos = null, vel = [0, 0], curDir = 6, lastKa = 0, savedIc = null;
  var lastScoreNum = 0;
  var route = [];
  var routeI = 0;
  var loopDir = 1;
  var reverseUntil = 0;
  var waitUntil = 0;
  var guardUntil = 0;
  var onRing = false;

  function stop() {
    stopped = true;
    if (rafId) {
      try { (gw || TOP).cancelAnimationFrame(rafId); } catch (e) { try { TOP.cancelAnimationFrame(rafId); } catch (e2) {} }
      rafId = 0;
    }
    if (uiTimer) { clearInterval(uiTimer); uiTimer = 0; }
    if (overlayTimer) { clearInterval(overlayTimer); overlayTimer = 0; }
    try { releaseAllKeys(); } catch (e) {}
    if (k && savedIc != null) try { k.Ic = savedIc; } catch (e) {}
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
    for (i = 0; i < frames.length; i++) {
      try {
        cw = frames[i].contentWindow;
        if (cw && cw.THREE && cw.document && cw.document.querySelector("canvas")) return cw;
      } catch (e) {}
    }
    return null;
  }

  function Q(sel) { return gw && gw.document ? gw.document.querySelector(sel) : null; }
  function visible(el) { return !!(el && el.offsetParent !== null && el.offsetWidth > 0 && el.offsetHeight > 0); }
  function clickEl(el) {
    if (!el || !gw) return;
    ["pointerdown", "mousedown", "pointerup", "mouseup", "click"].forEach(function (type) {
      el.dispatchEvent(new gw.MouseEvent(type, { bubbles: true, cancelable: true, view: gw }));
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

  function yawTerm() {
    if (k && k.level && k.level.Ka) return k.level.Ka.rotation.y || 0;
    return 0.087266;
  }
  function worldDirFromKa(ka) {
    var theta = 0.0174533 * -(ka - 90 + yawTerm());
    return [Math.sin(theta), Math.cos(theta)];
  }
  function kaFromWorld(vx, vz) {
    var thetaDeg = Math.atan2(vx, vz) * 180 / Math.PI;
    var ka = 90 - yawTerm() - thetaDeg;
    while (ka < 0) ka += 360;
    while (ka >= 360) ka -= 360;
    return ka;
  }
  function lerpAngle(a, b, t) {
    var d = b - a;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    if (d > 18) d = 18;
    if (d < -18) d = -18;
    var r = a + d * (t == null ? 1 : t);
    while (r < 0) r += 360;
    while (r >= 360) r -= 360;
    return r;
  }
  function nearestDirIndex(ka) {
    var best = 0, bestD = 1e9, i, d;
    for (i = 0; i < DIRS.length; i++) {
      d = Math.abs(DIRS[i].ka - ka);
      if (d > 180) d = 360 - d;
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function cellOf(x, z) {
    var ix = Math.floor((x + 67.5) / 3);
    var iz = Math.floor((z + 67.5) / 3);
    return [3 * ix - 67.5 + 1.5, 3 * iz - 67.5 + 1.5];
  }
  function ck(x, z) { return Math.round(x) + "," + Math.round(z); }
  function isPb(x, z) {
    if (k && k.X && typeof gw.F === "function") {
      try { return gw.F(k.X, { x: x, y: 0, z: z }) === k.X.type.pb; } catch (e) {}
    }
    var c = cellOf(x, z);
    return !!WALK[ck(c[0], c[1])];
  }
  function walkCell(cx, cz) { return !!WALK[ck(cx, cz)] || isPb(cx, cz); }

  function orthoStepOk(ax, az, bx, bz) {
    return walkCell(ax, az) && walkCell(bx, bz) && Math.abs(ax - bx) + Math.abs(az - bz) === 3;
  }
  function diagStepOk(ax, az, bx, bz) {
    if (!walkCell(ax, az) || !walkCell(bx, bz)) return false;
    if (Math.abs(ax - bx) !== 3 || Math.abs(az - bz) !== 3) return false;
    return walkCell(bx, az) && walkCell(ax, bz);
  }
  function canStep(ax, az, bx, bz) {
    var man = Math.abs(ax - bx) + Math.abs(az - bz);
    if (man === 3) return orthoStepOk(ax, az, bx, bz);
    if (man === 6 && Math.abs(ax - bx) === 3) return diagStepOk(ax, az, bx, bz);
    return false;
  }

  function neighbors(cx, cz) {
    var out = [], i, nx, nz;
    for (i = 0; i < 4; i++) {
      nx = cx + N4[i][0];
      nz = cz + N4[i][1];
      if (walkCell(nx, nz)) out.push([nx, nz]);
    }
    return out;
  }

  function bfsPath(sx, sz, goals) {
    var start = cellOf(sx, sz);
    var key0 = ck(start[0], start[1]);
    if (!walkCell(start[0], start[1])) {
      start = nearestWalkableCell(sx, sz);
      key0 = ck(start[0], start[1]);
    }
    var goalSet = {};
    var i, g, q, prev, cur, nbs, n, nk, path, p;
    for (i = 0; i < goals.length; i++) {
      g = goals[i];
      goalSet[ck(g[0], g[1])] = 1;
    }
    if (goalSet[key0]) return [start];
    q = [start];
    prev = {};
    prev[key0] = null;
    var qi = 0;
    while (qi < q.length) {
      cur = q[qi++];
      nbs = neighbors(cur[0], cur[1]);
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

  function nearestWalkableCell(x, z) {
    var c = cellOf(x, z);
    if (walkCell(c[0], c[1])) return c;
    var best = [0, 0], bestD = 1e9, key, p, d, parts;
    for (key in WALK) {
      parts = key.split(",");
      p = [+parts[0], +parts[1]];
      d = Math.hypot(p[0] - x, p[1] - z);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best;
  }

  function parallelCell(cx, cz) {
    var out, inn;
    if (Math.abs(cx) === 24 && Math.abs(cz) !== 24) {
      out = [cx > 0 ? 27 : -27, cz];
      inn = [cx > 0 ? 21 : -21, cz];
    } else if (Math.abs(cz) === 24 && Math.abs(cx) !== 24) {
      out = [cx, cz > 0 ? 27 : -27];
      inn = [cx, cz > 0 ? 21 : -21];
    } else if (Math.abs(cx) === 24 && Math.abs(cz) === 24) {
      out = [cx > 0 ? 27 : -27, cz > 0 ? 27 : -27];
      inn = [cx > 0 ? 21 : -21, cz > 0 ? 21 : -21];
    } else {
      return null;
    }
    if (walkCell(out[0], out[1]) && canStep(cx, cz, out[0], out[1])) return out;
    if (walkCell(inn[0], inn[1]) && canStep(cx, cz, inn[0], inn[1])) return inn;
    return null;
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
    if (!k || !k.level || !k.level.G) {
      return /spike/.test((RING[RING_SET[ck(cx, cz)]] && RING[RING_SET[ck(cx, cz)]][2]) || "");
    }
    var ch = k.level.G.children;
    for (i = 0; i < ch.length; i++) {
      o = ch[i];
      if (o && (o.Ga === "TRAPSPIKES" || /trapSpikes/i.test(o.name || ""))) {
        c = cellOf(o.position.x, o.position.z);
        if (Math.abs(c[0] - cx) < 0.1 && Math.abs(c[1] - cz) < 0.1) return true;
      }
    }
    return false;
  }
  function dartThreatAt(x, z, eta) {
    if (!k || !k.eb || !k.eb.array) return false;
    var n = k.eb.active || 0, i, d, fx, fz, px, pz, along, side, spd, t;
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
    if (onLane && fireIn < 0.35) return true;
    return false;
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
  function noodles() {
    var out = [], i, p, m;
    if (!k || !k.gc) return out;
    if (k.gc.u) {
      for (i = 0; i < k.gc.u.length; i++) {
        p = k.gc.u[i];
        if (p && p.vb && p.vb.visible) out.push({ x: p.vb.position.x, z: p.vb.position.z, kind: "pad" });
      }
    }
    if (k.gc.j && k.gc.active) {
      for (i = 0; i < k.gc.active; i++) {
        m = k.gc.j[i];
        if (m && m.visible) out.push({ x: m.position.x, z: m.position.z, kind: "drop" });
      }
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

  function applySteer(ka, moving) {
    if (k) {
      if (savedIc == null && typeof k.Ic === "boolean") savedIc = k.Ic;
      k.Ic = false;
      if (k.touch) {
        k.touch.Aa = !!moving;
        k.touch.La = moving ? 300 : 0;
        k.touch.ka = ka;
      }
      if (k.key) {
        var idx = nearestDirIndex(ka);
        var keys = DIRS[idx].keys;
        k.key.up = moving && !!keys.ArrowUp;
        k.key.Cb = moving && !!keys.ArrowDown;
        k.key.left = moving && !!keys.ArrowLeft;
        k.key.right = moving && !!keys.ArrowRight;
        var lab = [];
        if (k.key.up) lab.push("Up");
        if (k.key.Cb) lab.push("Down");
        if (k.key.left) lab.push("Left");
        if (k.key.right) lab.push("Right");
        SB.keys = (moving ? lab.join("+") || "analog" : "hold") + " ka=" + Math.round(ka);
        ARROWS.forEach(function (n) {
          var on = moving && ((n === "ArrowUp" && k.key.up) || (n === "ArrowDown" && k.key.Cb) || (n === "ArrowLeft" && k.key.left) || (n === "ArrowRight" && k.key.right));
          key(n, !!on);
        });
        curDir = idx;
      }
    } else {
      var idx2 = nearestDirIndex(ka);
      var dir = DIRS[idx2];
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].forEach(function (n) { key(n, moving && !!dir.keys[n]); });
      SB.keys = moving ? String(dir.ka) : "hold";
    }
    lastKa = ka;
    if (moving && performance.now() / 1000 - lastKeyRefresh > 0.28) {
      lastKeyRefresh = performance.now() / 1000;
      ARROWS.forEach(function (n) { if (down[n]) dispatchKey(n, true); });
    }
  }
  function releaseAllKeys(force) {
    applySteer(lastKa || 0, false);
    Object.keys(KEYS).forEach(function (n) { key(n, false, force); });
    down = {};
    if (k && k.touch) { k.touch.Aa = false; k.touch.La = 0; }
  }

  function desiredOnSegment(px, pz, ax, az, bx, bz) {
    var tx = bx - ax, tz = bz - az;
    var len = Math.hypot(tx, tz) || 1;
    var ux = tx / len, uz = tz / len;
    var wx = px - ax, wz = pz - az;
    var along = wx * ux + wz * uz;
    var cte = wx * (-uz) + wz * ux;
    SB.cte = cte;
    var latGain = 3.2;
    if (Math.abs(cte) > 0.35) latGain = 5.5;
    var dx = ux - (-uz) * cte * latGain;
    var dz = uz - (ux) * cte * latGain;
    if (vel[0] || vel[1]) {
      var sp = Math.hypot(vel[0], vel[1]);
      if (sp > 1) {
        var nx = vel[0] / sp, nz = vel[1] / sp;
        var id = Math.hypot(dx, dz) || 1;
        var ix = dx / id, iz = dz / id;
        var driftX = nx - ix * (nx * ix + nz * iz);
        var driftZ = nz - iz * (nx * ix + nz * iz);
        dx -= driftX * 0.85;
        dz -= driftZ * 0.85;
      }
    }
    if (along > len - 0.15) { dx = ux; dz = uz; }
    return [dx, dz, cte];
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

  function ringIndexNear(x, z) {
    var best = 0, bestD = 1e9, i, d;
    for (i = 0; i < RING.length; i++) {
      d = Math.hypot(RING[i][0] - x, RING[i][1] - z);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function buildStartRoute(px, pz) {
    var goals = RING.map(function (r) { return [r[0], r[1]]; });
    var path = bfsPath(px, pz, goals);
    if (!path || path.length < 1) path = bfsPath(0, 0, [[24, 0]]) || [[0, 0], [3, 0], [6, 0], [9, 0], [12, 0], [15, 0], [18, 0], [21, 0], [24, 0]];
    route = path;
    routeI = 0;
    onRing = false;
    loopDir = 1;
    SB.pathN = path.length;
  }

  function enterRing(px, pz) {
    SB.wi = ringIndexNear(px, pz);
    onRing = true;
    route = [];
    routeI = 0;
  }

  function currentTarget() {
    if (!onRing) {
      if (!route.length) return [24, 0, "join"];
      var i = Math.min(routeI, route.length - 1);
      return [route[i][0], route[i][1], "join"];
    }
    var r = RING[((SB.wi % RING.length) + RING.length) % RING.length];
    return [r[0], r[1], r[2]];
  }
  function nextRingCell(off) {
    var i = ((SB.wi + (off || 0) * loopDir) % RING.length + RING.length) % RING.length;
    return RING[i];
  }

  function enemyAhead(px, pz, tx, tz, enemies, distMax, coneDeg) {
    var dx = tx - px, dz = tz - pz;
    var L = Math.hypot(dx, dz) || 1;
    dx /= L; dz /= L;
    var cosA = Math.cos((coneDeg || 45) * Math.PI / 180);
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
    var c = cellOf(px, pz), nbs = neighbors(c[0], c[1]), i, n, j, e, blocked, d;
    var free = [];
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

  function shouldWaitSpike(px, pz, tx, tz) {
    if (!isSpikeCell(tx, tz) && !isSpikeCell(cellOf(tx, tz)[0], cellOf(tx, tz)[1])) return false;
    var dist = Math.hypot(tx - px, tz - pz);
    var eta = dist / 8;
    var t = spikeTick();
    var arrive = (t + eta * 400) % 1000;
    var leave = (t + (eta + 0.4) * 400) % 1000;
    if (spikesUp()) return true;
    if (arrive >= 820 && arrive < 1000) return true;
    if (leave >= 900 && leave < 1000 && arrive < 900) return true;
    return false;
  }

  function maybeUseBlade(px, pz, enemies) {
    if (!k || !k.i || k.i.Rb < 0) return;
    var col = k.i.Rb;
    if (col !== 0 && col !== 1) return;
    if (enemies.length < 1 || SB.nearest > 5) return;
    var tg = currentTarget();
    if (!/spike/.test(tg[2] || "")) return;
    try { if (typeof gw.sa === "function") gw.sa(); else key("Control", true, true); } catch (e) {}
    setTimeout(function () { try { key("Control", false, true); } catch (e2) {} }, 80);
  }

  function pulseAttack(t0) {
    if (t0 - lastAttackAt < 0.5) return;
    if (k && k.i && k.i.na > 0) return;
    lastAttackAt = t0;
    SB.attack = true;
    try { if (k && typeof k.Fd === "function") k.Fd(); else key(" ", true, true); } catch (e) {}
    setTimeout(function () { try { key(" ", false, true); SB.attack = false; } catch (e2) {} }, 90);
  }

  function classifyDeath(px, pz) {
    var reason = "dead";
    var extra = "";
    if (k && k.i && k.i.Ta) reason = "water";
    else if (k && k.X && typeof gw.F === "function") {
      try { if (gw.F(k.X, { x: px, y: 0, z: pz }) === k.X.type.oc) reason = "water"; } catch (e) {}
    }
    var c = cellOf(px, pz);
    if (reason !== "water" && (spikesUp() || isSpikeCell(c[0], c[1]) && spikesUp())) reason = "spike";
    var nd = nearestDart(px, pz);
    if (reason !== "water" && nd < 2.2) reason = "dart";
    var nf = nearestFireball(px, pz);
    if (reason !== "water" && nf < 2.2) reason = "fireball";
    if (reason === "dead" || reason === "hp0") {
      if (SB.nearest < 4) {
        reason = "enemy";
        extra = " d=" + SB.nearest.toFixed(2);
      }
    }
    return reason + extra;
  }

  function logDeath(reason) {
    if (deathLogged) return;
    deathLogged = true;
    var src = lastAlivePos || { x: SB.px, z: SB.pz, y: 0, dx: vel[0], dz: vel[1] };
    var rec = {
      x: +(+src.x).toFixed(2),
      z: +(+src.z).toFixed(2),
      y: +(+src.y || 0).toFixed(2),
      dx: +(src.dx || vel[0] || 0).toFixed(2),
      dz: +(src.dz || vel[1] || 0).toFixed(2),
      reason: reason || "die",
      score: SB.score,
      wave: SB.wave,
      state: SB.state,
      wp: SB.wp,
      cte: +(+SB.cte || 0).toFixed(2),
      t: Date.now()
    };
    SB.deaths.push(rec);
    saveDeaths(SB.deaths);
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
    overlay.style.cssText = "position:fixed;top:8px;right:8px;z-index:2147483647;min-width:250px;max-width:370px;max-height:56vh;overflow:auto;background:rgba(8,12,10,.88);color:#d6ffd0;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;padding:8px 10px;border:1px solid #3a7;border-radius:6px;pointer-events:none;white-space:pre-wrap;";
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
      "pos    " + SB.px.toFixed(1) + ", " + SB.pz.toFixed(1) + "  cte " + (SB.cte || 0).toFixed(2) + "\n" +
      "spd    " + (SB.vn || 0).toFixed(2) + "   avg1s " + (SB.avg || 0).toFixed(2) + "\n" +
      "wp     " + SB.wp + "\n" +
      "keys   " + SB.keys + "\n" +
      "HP     " + SB.hp + "/" + SB.hpMax + "   kills " + SB.runKills + "\n" +
      "wave   " + SB.wave + "   score " + SB.score + "\n" +
      "near   " + SB.nearest.toFixed(1) + "  enm " + SB.enemies + "  fire " + SB.fireballs + "\n" +
      "atk    " + (SB.attack ? "YES" : "no") + "  blade " + SB.blade + "  tick " + SB.tick.toFixed(0) + "\n" +
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
    var pu = Q(".powerUpLabel") || Q("button.powerUpLabel");
    if (visible(pu) && k && k.i && k.i.Rb >= 0 && k.i.Rb <= 1 && SB.nearest < 5) clickEl(pu);
  }
  function logRun() {
    var score = SB.score, wave = SB.wave, kills = SB.runKills;
    if (score === "?" && wave === "?") return;
    var last = SB.runs[SB.runs.length - 1];
    if (last && String(last.score) === String(score) && String(last.wave) === String(wave) && last.kills === kills) return;
    SB.runs.push({ score: score, wave: wave, kills: kills, t: Date.now() });
  }
  function syncHud() {
    if (k && k.i) { SB.hp = k.i.Y; SB.hpMax = k.i.Hb || 5; SB.blade = k.i.Rb; }
    if (k && k.ba && k.ba.Xb != null) SB.wave = String(k.ba.Xb);
    else { var wn = Q(".waveNumber"); if (visible(wn)) SB.wave = (wn.textContent || "").trim(); }
    var sc = (typeof gw.C === "number" ? gw.C : (typeof gw.K === "number" ? gw.K : null));
    if (sc != null) SB.score = String(parseInt(sc, 10));
    else {
      var el = Q("#game .score") || Q(".scoreBoard .score") || Q(".score");
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
    stuckSince = 0; waitUntil = 0; guardUntil = 0; reverseUntil = 0;
    loopDir = 1;
    releaseAllKeys(true);
    focusCanvas();
    lastFocus = t0;
    buildStartRoute(p.x, p.z);
    SB.state = "start";
    var tgt = currentTarget();
    var ka = kaFromWorld(tgt[0] - p.x, tgt[1] - p.z);
    lastKa = ka;
    applySteer(ka, true);
  }

  function step(t0) {
    var p = playerPos();
    if (!p) { SB.state = "wait-player"; return; }
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

    if (safetyBad(p.x, p.z) || !isPb(p.x, p.z)) {
      guardUntil = t0 + 0.28;
    }
    if (t0 < guardUntil) {
      var ccx = here[0] - p.x, ccz = here[1] - p.z;
      if (!isPb(here[0], here[1])) {
        var nw = nearestWalkableCell(p.x, p.z);
        ccx = nw[0] - p.x; ccz = nw[1] - p.z;
      }
      lastKa = lerpAngle(lastKa, kaFromWorld(ccx, ccz), 1);
      applySteer(lastKa, Math.hypot(ccx, ccz) > 0.12);
      SB.state = "center";
      SB.wp = "cell " + here[0] + "," + here[1];
      prevPos = [p.x, p.z, t0, p.y];
      return;
    }

    if (!onRing) {
      if (!route.length) buildStartRoute(p.x, p.z);
      while (routeI < route.length && Math.hypot(route[routeI][0] - p.x, route[routeI][1] - p.z) < 0.8) routeI++;
      if (routeI >= route.length) {
        enterRing(p.x, p.z);
      }
    }

    if (onRing) {
      var cur = RING[((SB.wi % RING.length) + RING.length) % RING.length];
      if (Math.hypot(cur[0] - p.x, cur[1] - p.z) < 0.8) {
        SB.wi = ((SB.wi + loopDir) % RING.length + RING.length) % RING.length;
      }
    }

    var tgt = currentTarget();
    var tx = tgt[0], tz = tgt[1];

    if (k && k.i && k.i.Y < k.i.Hb) {
      var bowls = noodles(), bi, bowl, bd, bestB = null, bestBd = 1e9;
      for (bi = 0; bi < bowls.length; bi++) {
        bowl = bowls[bi];
        bd = Math.hypot(bowl.x - p.x, bowl.z - p.z);
        if (bd < 8 && (bowl.kind === "pad" || isPb(bowl.x, bowl.z)) && bd < bestBd) { bestBd = bd; bestB = bowl; }
      }
      if (bestB && bestBd < 6) { tx = bestB.x; tz = bestB.z; SB.state = "noodle"; }
    }

    var prevC = onRing ? nextRingCell(-1) : (routeI > 0 ? route[routeI - 1] : here);
    var ax = prevC[0], az = prevC[1];
    if (Math.hypot(tx - ax, tz - az) < 0.1) { ax = here[0]; az = here[1]; }
    var des = desiredOnSegment(p.x, p.z, ax, az, tx, tz);
    var dx = des[0], dz = des[1];

    var ahead = enemyAhead(p.x, p.z, tx, tz, enemies, 3, 45);
    if (ahead) {
      var lane = parallelCell(here[0], here[1]);
      if (lane) {
        tx = lane[0]; tz = lane[1];
        dx = tx - p.x; dz = tz - p.z;
        SB.state = "dodge";
      } else if (t0 >= reverseUntil && onRing) {
        loopDir *= -1;
        reverseUntil = t0 + 1.6;
        SB.wi = ((SB.wi + loopDir) % RING.length + RING.length) % RING.length;
        tgt = currentTarget();
        tx = tgt[0]; tz = tgt[1];
        dx = tx - p.x; dz = tz - p.z;
        SB.state = "reverse";
      } else {
        var esc = walkableEscape(p.x, p.z, enemies);
        if (!esc.length) {
          pulseAttack(t0);
          SB.state = "cornered";
        } else {
          dx = esc[0][0] - p.x; dz = esc[0][1] - p.z;
          SB.state = "dodge";
        }
      }
    } else if (t0 < reverseUntil && onRing) {
      SB.state = "reverse";
    } else if (SB.state !== "noodle") {
      SB.state = onRing ? "loop" : "start";
    }

    if (shouldWaitSpike(p.x, p.z, tx, tz) || dartThreatAt(tx, tz, Math.hypot(tx - p.x, tz - p.z) / 8)) {
      waitUntil = t0 + 0.12;
    }
    if (t0 < waitUntil) {
      dx = here[0] - p.x;
      dz = here[1] - p.z;
      SB.state = shouldWaitSpike(p.x, p.z, currentTarget()[0], currentTarget()[1]) ? "wait-spike" : "wait-dart";
      var hold = Math.hypot(dx, dz) > 0.18;
      lastKa = lerpAngle(lastKa, kaFromWorld(hold ? dx : 1, hold ? dz : 0), 1);
      applySteer(lastKa, hold);
      maybeUseBlade(p.x, p.z, enemies);
      SB.wp = (onRing ? "R" + SB.wi + " " : "J" + routeI + " ") + tx + "," + tz + " " + (tgt[2] || "");
      prevPos = [p.x, p.z, t0, p.y];
      return;
    }

    if (!isPb(p.x + dx * 0.8, p.z + dz * 0.8)) {
      dx = here[0] - p.x;
      dz = here[1] - p.z;
    }

    var moving = true;
    var kaT = kaFromWorld(dx, dz);
    lastKa = lerpAngle(lastKa || kaT, kaT, 1);
    applySteer(lastKa, moving);
    maybeUseBlade(p.x, p.z, enemies);
    SB.wp = (onRing ? "R" + SB.wi + " " : "J" + routeI + " ") + tx.toFixed(0) + "," + tz.toFixed(0) + " " + (tgt[2] || "");

    if (t0 - lastFocus > 2.5) {
      lastFocus = t0;
      try { var cnv = canvasEl(); if (cnv && cnv.focus) cnv.focus(); } catch (e) {}
    }
    var moved = prevPos && Math.hypot(p.x - prevPos[0], p.z - prevPos[1]) > 0.05;
    if (moved && SB.vn >= 1.0) stuckSince = 0;
    else {
      if (!stuckSince) stuckSince = t0;
      if (t0 - stuckSince > 0.5 && t0 - lastWatchdog > 0.3) {
        lastWatchdog = t0;
        SB.stuck = 1;
        focusCanvas();
        var wd = [tx - p.x, tz - p.z];
        lastKa = kaFromWorld(wd[0], wd[1]);
        applySteer(lastKa, true);
      } else SB.stuck = stuckSince && t0 - stuckSince > 0.5 ? 1 : 0;
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
      syncHud();
      var hpNow = SB.hp;
      if ((lastHp > 0 && hpNow <= 0) || (k.i && k.i.la && !deathLogged)) {
        logDeath(classifyDeath(SB.px, SB.pz));
      }
      var p = playerPos();
      var running = inRound();
      if (running && (SB._alive !== true || (lastHp <= 0 && hpNow > 0) || (k.i && k.i.Ta === false && SB.state === "falling"))) {
        if (p) onNewRound(t0, p);
        SB._alive = true;
      }
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
