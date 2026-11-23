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
  var COS20 = 0.9397;
  var MIN_HOLD = 0.35;
  var ARRIVE = 0.8;
  var GUARD_HOLD = 0.3;
  var LS_DEATHS = "__SB_deaths_v18";

  var WP = [
    [24, 0, "noodle"],
    [24, -12, ""],
    [24, -21, "spike"],
    [24, -24, "blade"],
    [21, -24, "spike"],
    [12, -24, ""],
    [0, -24, ""],
    [-12, -24, ""],
    [-21, -24, "spike"],
    [-24, -24, "blade"],
    [-24, -21, "spike"],
    [-24, -12, ""],
    [-24, 0, "noodle"],
    [-24, 12, ""],
    [-24, 21, "spike"],
    [-24, 24, "blade"],
    [-21, 24, "spike"],
    [-12, 24, ""],
    [0, 24, "noodle"],
    [6, 24, "dart"],
    [12, 24, ""],
    [21, 24, "spike"],
    [24, 24, "blade"],
    [24, 21, "spike"],
    [24, 12, ""]
  ];

  var WALK_PAIRS = "0,-36,3,-36,0,-33,3,-33,-6,-30,-3,-30,0,-30,3,-30,6,-30,-27,-27,-24,-27,-21,-27,-6,-27,-3,-27,0,-27,3,-27,6,-27,21,-27,24,-27,27,-27,-27,-24,-24,-24,-21,-24,-18,-24,-15,-24,-12,-24,-9,-24,-6,-24,-3,-24,0,-24,3,-24,6,-24,9,-24,12,-24,15,-24,18,-24,21,-24,24,-24,27,-24,-27,-21,-24,-21,-21,-21,-6,-21,-3,-21,0,-21,3,-21,6,-21,21,-21,24,-21,27,-21,-24,-18,0,-18,24,-18,-24,-15,0,-15,24,-15,-24,-12,-12,-12,-9,-12,-6,-12,-3,-12,0,-12,3,-12,6,-12,9,-12,12,-12,24,-12,-24,-9,-12,-9,-3,-9,0,-9,3,-9,12,-9,24,-9,-27,-6,-24,-6,-12,-6,-6,-6,-3,-6,0,-6,3,-6,6,-6,12,-6,24,-6,27,-6,-27,-3,-24,-3,-21,-3,-12,-3,-9,-3,-6,-3,-3,-3,0,-3,3,-3,6,-3,9,-3,12,-3,21,-3,24,-3,27,-3,-27,0,-24,0,-21,0,-18,0,-15,0,-12,0,-9,0,-6,0,-3,0,0,0,3,0,6,0,9,0,12,0,15,0,18,0,21,0,24,0,27,0,-27,3,-24,3,-21,3,-12,3,-9,3,-6,3,-3,3,0,3,3,3,6,3,9,3,12,3,21,3,24,3,27,3,-27,6,-24,6,-12,6,-6,6,-3,6,0,6,3,6,6,6,12,6,24,6,27,6,-24,9,-12,9,-3,9,0,9,3,9,12,9,24,9,-24,12,-12,12,-9,12,-6,12,-3,12,0,12,3,12,6,12,9,12,12,12,24,12,-24,15,0,15,24,15,-24,18,0,18,24,18,-27,21,-24,21,-21,21,-3,21,0,21,3,21,21,21,24,21,27,21,-27,24,-24,24,-21,24,-18,24,-15,24,-12,24,-9,24,-6,24,-3,24,0,24,3,24,6,24,9,24,12,24,15,24,18,24,21,24,24,24,27,24,-27,27,-24,27,-21,27,-6,27,-3,27,0,27,3,27,6,27,21,27,24,27,27,27".split(",");
  var WALK = {};
  var wi;
  for (wi = 0; wi < WALK_PAIRS.length; wi += 2) {
    WALK[WALK_PAIRS[wi] + "," + WALK_PAIRS[wi + 1]] = 1;
  }

  function loadDeaths() {
    try {
      var raw = TOP.localStorage && TOP.localStorage.getItem(LS_DEATHS);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveDeaths(list) {
    try {
      if (TOP.localStorage) TOP.localStorage.setItem(LS_DEATHS, JSON.stringify(list.slice(-80)));
    } catch (e) {}
  }

  var SB = {
    ver: 18,
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
    pk: [],
    newObj: [],
    stop: stop
  };
  TOP.__SB = SB;

  var gw = null;
  var k = null;
  var down = {};
  var overlay = null;
  var rafId = 0;
  var uiTimer = 0;
  var overlayTimer = 0;
  var stopped = false;
  var lastHud = "";
  var lastHp = 0;
  var lastAttackAt = -9;
  var lastWatchdog = 0;
  var lastKeyRefresh = 0;
  var lastFocus = 0;
  var stuckSince = 0;
  var trail = [];
  var speedHist = [];
  var deathLogged = false;
  var lastAlivePos = null;
  var prevPos = null;
  var vel = [0, 0];
  var curDir = 6;
  var holdUntil = 0;
  var committed = null;
  var commitSince = 0;
  var guardUntil = 0;
  var guardDir = [0, 0];
  var seenIds = {};
  var loggedIds = {};
  var lastScoreNum = 0;

  function stop() {
    stopped = true;
    if (rafId) {
      try { (gw || TOP).cancelAnimationFrame(rafId); } catch (e) {
        try { TOP.cancelAnimationFrame(rafId); } catch (e2) {}
      }
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
    if (TOP.k && TOP.k.X) return TOP;
    if (TOP.k) return TOP;
    var frames = TOP.document.querySelectorAll("iframe");
    var i, f, cw;
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

  function Q(sel) {
    return gw && gw.document ? gw.document.querySelector(sel) : null;
  }
  function visible(el) {
    return !!(el && el.offsetParent !== null && el.offsetWidth > 0 && el.offsetHeight > 0);
  }
  function clickEl(el) {
    if (!el || !gw) return;
    ["pointerdown", "mousedown", "pointerup", "mouseup", "click"].forEach(function (type) {
      el.dispatchEvent(new gw.MouseEvent(type, { bubbles: true, cancelable: true, view: gw }));
    });
  }
  function canvasEl() {
    return gw && gw.document ? gw.document.querySelector("canvas") : null;
  }
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
      keyCode: KEYS[name],
      which: KEYS[name],
      bubbles: true,
      cancelable: true
    });
    var c = canvasEl();
    var targets = [c, gw.document, gw.document && gw.document.body, gw];
    var i, t, seen = [];
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

  function applyGameKeys(want) {
    if (k && k.key) {
      k.key.up = !!want.ArrowUp;
      k.key.Cb = !!want.ArrowDown;
      k.key.left = !!want.ArrowLeft;
      k.key.right = !!want.ArrowRight;
    }
    if (k && k.touch && want._ka != null) {
      k.touch.Aa = true;
      k.touch.La = 300;
      k.touch.ka = want._ka;
    }
    var name;
    for (name in { ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1 }) {
      key(name, !!want[name]);
    }
  }

  function releaseAllKeys(force) {
    var empty = {};
    applyGameKeys(empty);
    Object.keys(KEYS).forEach(function (n) { key(n, false, force); });
    down = {};
    if (k && k.touch) { k.touch.Aa = false; k.touch.La = 0; }
  }

  function yawTerm() {
    if (k && k.level && k.level.Ka) return k.level.Ka.rotation.y || 0;
    return 0.087266;
  }

  function worldDirFromKa(ka) {
    var theta = 0.0174533 * -(ka - 90 + yawTerm());
    return [Math.sin(theta), Math.cos(theta)];
  }

  function cellCenter(x, z) {
    var ix = Math.floor((x + 67.5) / 3);
    var iz = Math.floor((z + 67.5) / 3);
    return [3 * ix - 67.5 + 1.5, 3 * iz - 67.5 + 1.5];
  }

  function isPb(x, z) {
    if (k && k.X && typeof gw.F === "function") {
      try {
        return gw.F(k.X, { x: x, y: 0, z: z }) === k.X.type.pb;
      } catch (e) {}
    }
    var c = cellCenter(x, z);
    return !!WALK[c[0] + "," + c[1]];
  }

  function walkable(x, z) {
    if (!isPb(x, z)) return false;
    var offs = [[0.55, 0.55], [0.55, -0.55], [-0.55, 0.55], [-0.55, -0.55], [0.6, 0], [-0.6, 0], [0, 0.6], [0, -0.6]];
    var i;
    for (i = 0; i < offs.length; i++) {
      if (!isPb(x + offs[i][0], z + offs[i][1])) return false;
    }
    return true;
  }

  function nearestWalkable(x, z) {
    if (walkable(x, z)) return [x, z];
    var best = null, bestD = 1e9, key, p, d, parts;
    for (key in WALK) {
      parts = key.split(",");
      p = [+parts[0], +parts[1]];
      d = Math.hypot(p[0] - x, p[1] - z);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best || [0, 0];
  }

  function spikeTick() {
    if (!k || !k.level || !k.level.G) return 0;
    var ch = k.level.G.children, i, o;
    for (i = 0; i < ch.length; i++) {
      o = ch[i];
      if (o && (o.Ga === "TRAPSPIKES" || /trapSpikes/i.test(o.name || ""))) {
        return o.tick || 0;
      }
    }
    return 0;
  }

  function spikesUp() {
    if (!k || !k.level || !k.level.G) return false;
    var ch = k.level.G.children, i, o;
    for (i = 0; i < ch.length; i++) {
      o = ch[i];
      if (o && (o.Ga === "TRAPSPIKES" || /trapSpikes/i.test(o.name || "")) && o.ya) return true;
    }
    var t = spikeTick();
    return t >= 900 && t < 1000;
  }

  function inRound() {
    if (!k || !k.i || !k.i.v) return false;
    if (k.i.la) return false;
    if (k.N && k.N.Ob === false && k.i.Ta) return false;
    return !!(k.i.v.visible && (k.N && k.N.Ob || k.i.Y > 0));
  }

  function playerPos() {
    if (k && k.i && k.i.v) return k.i.v.position;
    return null;
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

  function blades() {
    var out = [], i, s, pos;
    if (!k || !k.Ib) return out;
    for (i = 0; i < k.Ib.length; i++) {
      s = k.Ib[i];
      if (!s || s.Gd || s.$a < 0) continue;
      pos = s.position;
      if (pos) out.push({ x: pos.x, z: pos.z, color: s.$a, spawner: s });
    }
    return out;
  }

  function fireballCount() {
    if (!k || !k.Vc) return 0;
    return k.Vc.active || 0;
  }

  function dartThreat(px, pz, vx, vz) {
    if (!k || !k.eb || !k.eb.array) return false;
    var n = k.eb.active || 0, i, d, fx, fz, dx, dz, along, side;
    for (i = 0; i < n; i++) {
      d = k.eb.array[i];
      if (!d || !d.position) continue;
      fx = (d.forward && d.forward.x) || 0;
      fz = (d.forward && d.forward.z) || 0;
      dx = px - d.position.x;
      dz = pz - d.position.z;
      along = dx * fx + dz * fz;
      side = Math.abs(dx * (-fz) + dz * fx);
      if (along > -1 && along < 10 && side < 2.2) return true;
    }
    return false;
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
      if (dot + 1e-6 >= bestDot * COS20 || Math.acos(Math.max(-1, Math.min(1, dot))) - Math.acos(Math.max(-1, Math.min(1, bestDot))) < 20 * Math.PI / 180) {
        return curDir;
      }
    }
    if (best !== curDir) holdUntil = t0 + MIN_HOLD;
    curDir = best;
    return curDir;
  }

  function holdKa(idx, t0) {
    var dir = DIRS[idx];
    var want = { ArrowUp: !!dir.keys.ArrowUp, ArrowDown: !!dir.keys.ArrowDown, ArrowLeft: !!dir.keys.ArrowLeft, ArrowRight: !!dir.keys.ArrowRight, _ka: dir.ka };
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

  function nearestWP(px, pz) {
    var best = 0, bestD = 1e9, i, d;
    for (i = 0; i < WP.length; i++) {
      d = Math.hypot(WP[i][0] - px, WP[i][1] - pz);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function aheadEnemy(px, pz, tx, tz, enemies, rad) {
    var dx = tx - px, dz = tz - pz;
    var L = Math.hypot(dx, dz) || 1;
    dx /= L;
    dz /= L;
    var i, e, ex, ez, d, along;
    for (i = 0; i < enemies.length; i++) {
      e = enemies[i].mesh.position;
      ex = e.x - px;
      ez = e.z - pz;
      d = Math.hypot(ex, ez);
      if (d > rad) continue;
      along = (ex * dx + ez * dz) / (d || 1);
      if (along > 0.35) return enemies[i];
    }
    return null;
  }

  function waitForSpike(tx, tz, px, pz) {
    var t = spikeTick();
    var dist = Math.hypot(tx - px, tz - pz);
    var eta = dist / 8;
    var tickOnArrive = (t + eta * 400) % 1000;
    var leave = eta + 0.45;
    var tickLeave = (t + leave * 400) % 1000;
    if (spikesUp()) return true;
    if (tickOnArrive >= 820 && tickOnArrive < 1000) return true;
    if (tickLeave >= 900 && tickLeave < 1000 && tickOnArrive < 900) return true;
    return false;
  }

  function pickNoodleDetour(px, pz) {
    if (!k || !k.i || k.i.Y >= k.i.Hb) return null;
    var list = noodles(), i, n, d, best = null, bestD = 1e9;
    for (i = 0; i < list.length; i++) {
      n = list[i];
      if (!walkable(n.x, n.z) && !isPb(n.x, n.z)) continue;
      d = Math.hypot(n.x - px, n.z - pz);
      if (d < bestD) { bestD = d; best = n; }
    }
    if (!best) return null;
    if (best.kind === "pad") return best;
    if (bestD < 10 && isPb(best.x, best.z)) return best;
    return null;
  }

  function inwardDir(px, pz) {
    var c = nearestWalkable(px * 0.85, pz * 0.85);
    var dx = c[0] - px, dz = c[1] - pz;
    if (Math.hypot(dx, dz) < 0.15) {
      c = nearestWalkable(0, 0);
      dx = c[0] - px;
      dz = c[1] - pz;
    }
    if (Math.hypot(dx, dz) < 0.15) { dx = -px; dz = -pz; }
    return [dx, dz];
  }

  function recordTrail(t0, p) {
    trail.push({ t: t0, x: +p.x, z: +p.z, y: +p.y, dx: vel[0], dz: vel[1] });
    while (trail.length && t0 - trail[0].t > 2.05) trail.shift();
    lastAlivePos = trail[trail.length - 1];
    speedHist.push({ t: t0, x: +p.x, z: +p.z });
    while (speedHist.length && t0 - speedHist[0].t > 1.05) speedHist.shift();
    if (speedHist.length >= 2) {
      var a = speedHist[0], b = speedHist[speedHist.length - 1];
      var dt = Math.max(0.05, b.t - a.t);
      SB.avg = Math.hypot(b.x - a.x, b.z - a.z) / dt;
    }
  }

  function logDeath(reason) {
    if (deathLogged) return;
    deathLogged = true;
    var src = lastAlivePos;
    if (!src) return;
    var rec = {
      x: +src.x.toFixed(2),
      z: +src.z.toFixed(2),
      y: +(+src.y || 0).toFixed(2),
      dx: +(src.dx || 0).toFixed(2),
      dz: +(src.dz || 0).toFixed(2),
      reason: reason || "die",
      score: SB.score,
      wave: SB.wave,
      t: Date.now()
    };
    SB.deaths.push(rec);
    saveDeaths(SB.deaths);
  }

  function logNewObjects() {
    if (!k) return;
    function consider(obj, tag) {
      if (!obj || obj.visible === false) return;
      var id = obj.id != null ? tag + obj.id : tag + (obj.position && obj.position.x);
      if (loggedIds[id]) return;
      loggedIds[id] = 1;
      var p = obj.position || { x: 0, z: 0 };
      var rec = (obj.name || tag || "?") + "@" + (+p.x).toFixed(1) + "," + (+p.z).toFixed(1);
      SB.newObj.push(rec);
      if (SB.newObj.length > 24) SB.newObj.shift();
    }
    var i, p, s;
    if (k.gc && k.gc.u) {
      for (i = 0; i < k.gc.u.length; i++) {
        p = k.gc.u[i];
        if (p && p.vb && p.vb.visible) consider(p.vb, "nudel");
      }
    }
    if (k.gc && k.gc.j) {
      for (i = 0; i < (k.gc.active || 0); i++) if (k.gc.j[i]) consider(k.gc.j[i], "nudel-drop");
    }
    if (k.Ib) {
      for (i = 0; i < k.Ib.length; i++) {
        s = k.Ib[i];
        if (s && s.$a >= 0 && !s.Gd) consider(s, "blade" + s.$a);
      }
    }
  }

  function maybeUseBlade(px, pz, enemies) {
    if (!k || !k.i || k.i.Rb < 0) return;
    var col = k.i.Rb;
    if (col !== 0 && col !== 1) return;
    if (enemies.length < 1 || SB.nearest > 5) return;
    var i, e, behind = 0, nearTrap = false;
    for (i = 0; i < enemies.length; i++) {
      e = enemies[i].mesh.position;
      if (Math.hypot(e.x - px, e.z - pz) < 6) behind++;
    }
    var wp = WP[SB.wi % WP.length];
    if (wp[2] === "spike" || (committed && committed[2] === "spike")) nearTrap = true;
    if (behind >= 1 && nearTrap) {
      try {
        if (typeof gw.sa === "function") gw.sa();
        else key("Control", true, true);
        SB.pk.push("blade" + col + "@" + SB.score);
      } catch (err) {}
      setTimeout(function () { try { key("Control", false, true); } catch (e2) {} }, 80);
    }
  }

  function pulseAttack(t0) {
    if (t0 - lastAttackAt < 0.45) return;
    if (k && k.i && k.i.na > 0) return;
    lastAttackAt = t0;
    SB.attack = true;
    try {
      if (k && typeof k.Fd === "function") k.Fd();
      else key(" ", true, true);
    } catch (e) {}
    setTimeout(function () { try { key(" ", false, true); SB.attack = false; } catch (e2) {} }, 90);
  }

  function ensureOverlay() {
    var doc = TOP.document;
    if (!doc || !doc.body) return;
    var old = doc.getElementById("__sb_overlay");
    if (old && old !== overlay) old.parentNode.removeChild(old);
    if (overlay && overlay.parentNode) return;
    overlay = doc.createElement("div");
    overlay.id = "__sb_overlay";
    overlay.style.cssText = "position:fixed;top:8px;right:8px;z-index:2147483647;min-width:240px;max-width:360px;max-height:54vh;overflow:auto;background:rgba(8,12,10,.88);color:#d6ffd0;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;padding:8px 10px;border:1px solid #3a7;border-radius:6px;pointer-events:none;white-space:pre-wrap;";
    doc.body.appendChild(overlay);
  }

  function renderOverlay() {
    if (!overlay) return;
    var runs = SB.runs.slice(-8).map(function (r, i) {
      var n = SB.runs.length - Math.min(SB.runs.length, 8) + i + 1;
      var kk = r.kills != null ? "  k" + r.kills : "";
      return n + ". score " + r.score + "  wave " + r.wave + kk;
    }).join("\n") || "(keine Läufe)";
    var deaths = SB.deaths.slice(-5).map(function (d, i) {
      return (SB.deaths.length - Math.min(SB.deaths.length, 5) + i + 1) +
        ". (" + d.x + "," + d.z + ") " + (d.reason || "");
    }).join("\n") || "(keine)";
    var html =
      "Sumpf-Arena Bot v" + SB.ver + "\n" +
      "state  " + SB.state + (SB.stuck ? "  STUCK" : "") + "\n" +
      "pos    " + SB.px.toFixed(1) + ", " + SB.pz.toFixed(1) + "\n" +
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
    if (html !== lastHud) {
      lastHud = html;
      overlay.textContent = html;
    }
  }

  function clickUi() {
    if (!gw || !gw.document) return;
    var ok = [Q(".okButton"), Q(".okTutorialButton")].filter(visible)[0];
    if (ok) { clickEl(ok); return; }
    var buttons = gw.document.querySelectorAll("button");
    var i, b, again = null;
    for (i = 0; i < buttons.length; i++) {
      b = buttons[i];
      if (visible(b) && /nochmal/i.test(b.textContent || "")) { again = b; break; }
    }
    if (again) {
      if (lastHp > 0) logDeath("nochmal");
      logRun();
      clickEl(again);
      SB.wave = "1";
      SB.score = "0";
      SB.state = "restart";
      SB.runKills = 0;
      lastScoreNum = 0;
      committed = null;
      return;
    }
    var play = Q(".entry.level_02 .play");
    if (visible(play)) clickEl(play);
  }

  function logRun() {
    var score = SB.score, wave = SB.wave, kills = SB.runKills;
    if (score === "?" && wave === "?") return;
    var last = SB.runs[SB.runs.length - 1];
    if (last && String(last.score) === String(score) && String(last.wave) === String(wave) && last.kills === kills) return;
    SB.runs.push({ score: score, wave: wave, kills: kills, t: Date.now() });
  }

  function syncHud() {
    if (k && k.i) {
      SB.hp = k.i.Y;
      SB.hpMax = k.i.Hb || 5;
      SB.blade = k.i.Rb;
    }
    if (k && k.ba && k.ba.Xb != null) SB.wave = String(k.ba.Xb);
    else {
      var wn = Q(".waveNumber");
      if (visible(wn)) SB.wave = (wn.textContent || "").trim();
    }
    var sc = (typeof gw.C === "number" ? gw.C : (typeof gw.K === "number" ? gw.K : null));
    if (sc != null) SB.score = String(parseInt(sc, 10));
    else {
      var el = Q("#game .score") || Q(".scoreBoard .score") || Q(".score");
      if (visible(el)) {
        var m = /(\d+)/.exec(el.textContent || "");
        if (m) SB.score = m[1];
      }
    }
    var sn = parseInt(SB.score, 10);
    if (!isNaN(sn) && sn > lastScoreNum) {
      if (lastScoreNum > 0 || sn >= 5) SB.runKills += 1;
      lastScoreNum = sn;
    } else if (!isNaN(sn) && sn === 0) lastScoreNum = 0;
    SB.kills = SB.runKills;
    SB.tick = spikeTick();
  }

  function onNewRound(t0, p) {
    SB.rs = t0;
    SB.runKills = 0;
    lastScoreNum = parseInt(SB.score, 10) || 0;
    deathLogged = false;
    trail = [];
    speedHist = [];
    committed = null;
    guardUntil = 0;
    stuckSince = 0;
    SB.wi = nearestWP(p ? p.x : 24, p ? p.z : 0);
    if (p && Math.hypot(p.x, p.z) < 4) {
      SB.wi = nearestWP(24, 0);
    }
    committed = WP[SB.wi % WP.length];
    commitSince = t0;
    SB.state = "start";
    releaseAllKeys(true);
    focusCanvas();
    lastFocus = t0;
    holdUntil = 0;
    var idx = chooseKa(committed[0] - (p ? p.x : 0), committed[1] - (p ? p.z : 0), t0, true);
    holdKa(idx, t0);
  }

  function step(t0) {
    var p = playerPos();
    if (!p) {
      SB.state = "wait-player";
      return;
    }
    SB.px = p.x;
    SB.pz = p.z;
    if (prevPos) {
      var dt = Math.max(0.008, t0 - prevPos[2]);
      vel[0] = (p.x - prevPos[0]) / dt;
      vel[1] = (p.z - prevPos[1]) / dt;
      SB.vn = Math.hypot(vel[0], vel[1]);
    }
    recordTrail(t0, p);
    logNewObjects();

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

    var predX = p.x + vel[0] * 0.3;
    var predZ = p.z + vel[1] * 0.3;
    var edge = !walkable(p.x, p.z) || !isPb(predX, predZ) || !walkable(p.x + vel[0] * 0.15, p.z + vel[1] * 0.15);
    if (edge && t0 >= guardUntil) {
      guardUntil = t0 + GUARD_HOLD;
      guardDir = inwardDir(p.x, p.z);
      SB.state = "water";
    }
    if (t0 < guardUntil) {
      var gidx = chooseKa(guardDir[0], guardDir[1], t0, true);
      holdKa(gidx, t0);
      SB.state = "water";
      SB.wp = "guard->c";
      prevPos = [p.x, p.z, t0, p.y];
      return;
    }

    if (!committed) {
      SB.wi = nearestWP(p.x, p.z);
      committed = WP[SB.wi % WP.length];
      commitSince = t0;
    }

    var noodle = pickNoodleDetour(p.x, p.z);
    var target = committed;
    if (noodle && Math.hypot(noodle.x - p.x, noodle.z - p.z) < 1.5) {
      target = [noodle.x, noodle.z, "noodle"];
      SB.state = "noodle";
    } else if (noodle && (committed[2] !== "spike")) {
      var onLoop = false;
      for (i = 0; i < WP.length; i++) {
        if (Math.hypot(WP[i][0] - noodle.x, WP[i][1] - noodle.z) < 2) { onLoop = true; break; }
      }
      if (!onLoop && Math.hypot(noodle.x - p.x, noodle.z - p.z) < 8) {
        target = [noodle.x, noodle.z, "noodle"];
        SB.state = "noodle";
      }
    }

    var tx = target[0], tz = target[1];
    var dist = Math.hypot(tx - p.x, tz - p.z);
    var arrived = dist < ARRIVE || t0 - commitSince > 8;
    if (arrived && target === committed) {
      SB.wi = (SB.wi + 1) % WP.length;
      var nxt = WP[SB.wi];
      var blk = aheadEnemy(p.x, p.z, nxt[0], nxt[1], enemies, 1.0);
      if (blk) {
        pulseAttack(t0);
        SB.wi = (SB.wi + 1) % WP.length;
        nxt = WP[SB.wi];
      }
      if (nxt[2] === "spike" && waitForSpike(nxt[0], nxt[1], p.x, p.z)) {
        SB.state = "wait-spike";
        SB.wp = "wait " + nxt[0] + "," + nxt[1];
        var widx = chooseKa(tx - p.x, tz - p.z, t0, false);
        if (Math.hypot(tx - p.x, tz - p.z) < 1.2) {
          var holdx = p.x, holdz = p.z;
          widx = chooseKa(holdx - p.x + (p.z - tz) * 0.2, holdz - p.z + (tx - p.x) * 0.2, t0, false);
        }
        holdKa(widx, t0);
        maybeUseBlade(p.x, p.z, enemies);
        prevPos = [p.x, p.z, t0, p.y];
        return;
      }
      committed = nxt;
      commitSince = t0;
      target = committed;
      tx = target[0];
      tz = target[1];
      dist = Math.hypot(tx - p.x, tz - p.z);
    }

    if (committed && committed[2] === "spike" && waitForSpike(committed[0], committed[1], p.x, p.z) && dist > 2) {
      SB.state = "wait-spike";
      SB.wp = "wait " + committed[0] + "," + committed[1];
      var sidx = chooseKa(committed[0] - p.x, committed[1] - p.z, t0, false);
      holdKa(sidx, t0);
      maybeUseBlade(p.x, p.z, enemies);
      prevPos = [p.x, p.z, t0, p.y];
      return;
    }

    if (dartThreat(p.x, p.z, tx - p.x, tz - p.z) && target[2] !== "spike") {
      var side = [-(tz - p.z), tx - p.x];
      if (walkable(p.x + side[0] * 0.2, p.z + side[1] * 0.2)) {
        tx = p.x + side[0];
        tz = p.z + side[1];
        SB.state = "dart";
      }
    }

    var midBlk = aheadEnemy(p.x, p.z, tx, tz, enemies, 1.0);
    if (midBlk && t0 - commitSince > MIN_HOLD) {
      pulseAttack(t0);
      SB.wi = (SB.wi + 1) % WP.length;
      committed = WP[SB.wi];
      commitSince = t0;
      tx = committed[0];
      tz = committed[1];
    }

    var stepX = p.x + (tx - p.x) / (dist || 1) * 1.2;
    var stepZ = p.z + (tz - p.z) / (dist || 1) * 1.2;
    if (!isPb(stepX, stepZ) || !walkable((p.x + stepX) / 2, (p.z + stepZ) / 2)) {
      var alt = nearestWalkable(tx, tz);
      if (Math.hypot(alt[0] - p.x, alt[1] - p.z) > 0.4) {
        tx = alt[0];
        tz = alt[1];
      } else {
        guardUntil = t0 + GUARD_HOLD;
        guardDir = inwardDir(p.x, p.z);
        var ev = chooseKa(guardDir[0], guardDir[1], t0, true);
        holdKa(ev, t0);
        SB.state = "water";
        prevPos = [p.x, p.z, t0, p.y];
        return;
      }
    }

    var idx = chooseKa(tx - p.x, tz - p.z, t0, false);
    holdKa(idx, t0);
    SB.wp = (committed ? committed[0] + "," + committed[1] + (committed[2] ? " " + committed[2] : "") : "?");
    if (SB.state !== "noodle" && SB.state !== "dart") SB.state = (t0 - SB.rs < 1.2 ? "start" : "loop");
    maybeUseBlade(p.x, p.z, enemies);

    if (t0 - lastFocus > 2.5) {
      lastFocus = t0;
      try { var c = canvasEl(); if (c && c.focus) c.focus(); } catch (e) {}
    }

    var spd = SB.vn || 0;
    var moved = prevPos && Math.hypot(p.x - prevPos[0], p.z - prevPos[1]) > 0.05;
    if (moved && spd >= 1.2) stuckSince = 0;
    else {
      if (!stuckSince) stuckSince = t0;
      if (t0 - stuckSince > 0.5 && t0 - lastWatchdog > 0.3) {
        lastWatchdog = t0;
        SB.stuck = 1;
        releaseAllKeys(true);
        focusCanvas();
        holdUntil = 0;
        var wd = inwardDir(p.x, p.z);
        if (walkable(p.x, p.z) && committed) wd = [committed[0] - p.x, committed[1] - p.z];
        var wdi = chooseKa(wd[0], wd[1], t0, true);
        holdKa(wdi, t0);
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
      if ((lastHp > 0 && hpNow <= 0) || (k.i && k.i.la && !deathLogged)) logDeath(k.i && k.i.la ? "dead" : "hp0");
      var p = playerPos();
      var running = inRound();
      if (running && (SB._alive !== true || (lastHp <= 0 && hpNow > 0) || (k.i && k.i.Ta === false && SB.state === "falling"))) {
        if (p) onNewRound(t0, p);
        SB._alive = true;
      }
      lastHp = hpNow;
      if (!running) {
        if (k && k.i && (k.i.la || hpNow <= 0)) {
          if (!deathLogged) logDeath("dead");
        }
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
    var src = gw || TOP;
    rafId = src.requestAnimationFrame(loop);
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
