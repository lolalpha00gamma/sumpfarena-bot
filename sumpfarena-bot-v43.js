(function () {
  "use strict";
  // First statements: a second Enter / late-arriving first script must see
  // this flag and return before GEN, timers, or the sanity log. The v41
  // guard required INSTANCE==="41" AND live timers, so a second inject
  // during init (or of another version) still ran and logged sanity twice.
  var TOP = window;
  function alreadyRunningAny(w) {
    if (!w) return false;
    if (w.__SB_RUNNING_ANY) return true;
    try {
      var tm = w.__SB_TIMERS;
      if (tm && (tm.raf || tm.ui || tm.ov)) return true;
    } catch (eA) {}
    try {
      if (w.__SB && w.__SB.state && w.__SB.state !== "stopped") return true;
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
  try { TOP.__SB_INSTANCE = "43"; } catch (e0d) {}
  try { if (TOP.top && TOP.top !== TOP) TOP.top.__SB_INSTANCE = "43"; } catch (e0e) {}

  // v34: based on v33. Fixes run counting (i-frame blink was ending "runs"),
  // death/HP recording independent of deathLogged, one autosave per 10 real
  // game-overs, tighter blade policy, noodle cooldown so wave-6 bowls are
  // not a time sink. See sumpfarena-deaths-v33.md.

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
    // v43: v42 + hoist CROSS (and hunt-stall emptyKeys). v42 HUD showed
    // "ERR CROSS is not defined" every melee-close frame and skipped steering.
  var VER = "43";
  var V32_WATER = true;
  var V32_DODGE = false;
  var V33_ALL_BLADES = true;
  var LS_DEATHS = "__SB_deaths_v43";
  var LS_DUMP = "__SB_dump_v43";

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
    ver: VER,
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

  var DT_NMAX = 120; // dump uses 120; steering uses last 8
  var dtBuf = new Float64Array(DT_NMAX);
  var dtCount = 0, dtIdx = 0, dtOver40 = 0, dtMaxSeen = 0, lastFrameT = 0;
  var lastP50 = 1 / 60, lastP95 = 1 / 60;
  var waveStartedAt = 0, waveSeen = "";
  var holdUntil = -1, holdState = "", holdDest = null, holdDir = 1;
  var lastMoveT = 0, lastMoveX = null, lastMoveZ = null, noodleSince = 0;
  var lastBladeUseT = -999, pendingBlade = null;
  var commitUntil = -1, commitKeys = null, commitStartX = 0, commitStartZ = 0, lastFlipT = -999, lastStabMoveT = -999;
  var jitterTime = 0, dirFlips = 0, lastJitX = null, lastJitZ = null, lastJitT = 0, prevStabKeys = null;
  var nowT = 0;
  SB.bladeUses = [];
  SB.dirFlips = 0;
  SB.jitterTime = 0;
  var SPIKE_HIT_R = 2.5, SPIKE_SAFE_R = 3.3;
  var CROSS = 0.70; // must be IIFE-scoped: step() paths (v42NoStandMelee, abort-plank) used it undeclared
  var liteApplied = false, liteW = 0, liteH = 0;

  function noteFrameDt(t0) {
    if (lastFrameT > 0) {
      var dt = t0 - lastFrameT;
      if (dt > 0 && dt < 2) {
        dtBuf[dtIdx % DT_NMAX] = dt;
        dtIdx++;
        if (dtCount < DT_NMAX) dtCount++;
        if (dt > 0.04) dtOver40++;
        if (dt > dtMaxSeen) dtMaxSeen = dt;
      }
    }
    lastFrameT = t0;
  }
  function dtStats() {
    var i, tmp = [], p50 = 1 / 60, p95 = 1 / 60, mx = 0;
    for (i = 0; i < dtCount; i++) tmp.push(dtBuf[i]);
    if (tmp.length) {
      tmp.sort(function (a, b) { return a - b; });
      p50 = tmp[Math.min(tmp.length - 1, Math.floor(0.50 * tmp.length))];
      p95 = tmp[Math.min(tmp.length - 1, Math.floor(0.95 * tmp.length))];
      mx = tmp[tmp.length - 1];
    }
    lastP50 = p50;
    lastP95 = p95;
    return { p50: +p50.toFixed(4), p95: +p95.toFixed(4), max: +Math.max(mx, dtMaxSeen).toFixed(4), over40: dtOver40, n: dtCount, frames: dtIdx };
  }
  function recentStepDt() {
    // Game: k.delta = THREE.Math.clamp(k.Nb.getDelta(), 1e-5, 0.1).
    // Movement in k.te: pos += dir * Ah * dt (Ah=8). No further clamp.
    // Steering uses max of the last 8 frames so an isolated hitch only
    // tightens the next few steps; the dump still reports p50/p95/max of 120.
    var n = Math.min(dtCount, 8), i, mx = 1 / 60, idx, v;
    if (n < 1) return 1 / 60;
    for (i = 1; i <= n; i++) {
      idx = (dtIdx - i + DT_NMAX) % DT_NMAX;
      v = dtBuf[idx];
      if (v > mx) mx = v;
    }
    return Math.min(0.1, Math.max(1 / 60, mx));
  }
  function noteWave(t0) {
    if (SB.wave !== waveSeen) { waveSeen = SB.wave; waveStartedAt = t0; }
    SB.waveAge = waveStartedAt ? (t0 - waveStartedAt) : 0;
  }
  function lightenRenderer() {
    try {
      if (!k || !k.renderer) return;
      var r = k.renderer;
      var win = gw || window;
      var w = win.innerWidth || window.innerWidth;
      var h = win.innerHeight || window.innerHeight;
      if (liteApplied && w === liteW && h === liteH) return;
      liteW = w;
      liteH = h;
      if (r.setPixelRatio) r.setPixelRatio(0.5);
      if (r.setSize) r.setSize(w, h, true);
      if (r.domElement && r.domElement.style) {
        r.domElement.style.width = w + "px";
        r.domElement.style.height = h + "px";
      }
      if (r.shadowMap) {
        if (r.shadowMap.enabled != null) r.shadowMap.enabled = false;
        if (r.shadowMap.autoUpdate != null) r.shadowMap.autoUpdate = false;
      }
      if (r.shadowMapEnabled != null) r.shadowMapEnabled = false;
      if (k.Ja && k.Ja.setParticleSize) {
        try { k.Ja.setParticleSize(Math.min(h * 0.5, 480)); } catch (e1) {}
      }
      liteApplied = true;
      SB.lite = "pr=0.5 no-shadow";
    } catch (e) {}
  }

  TOP.__SB = SB;

  var gw = null, k = null, down = {}, overlay = null;
  var rafId = 0, uiTimer = 0, overlayTimer = 0, stopped = false;
  var lastHud = "", lastHp = 5, lastAttackAt = -9, lastWatchdog = 0, lastKeyRefresh = 0, lastFocus = 0;
  var stuckSince = 0, trail = [], speedHist = [], deathLogged = false, lastAlivePos = null;
  var spikeWaitKey = "", spikeWaitT = 0, stallSince = 0, stallKills = 0, stallWave = "", lastPersistT = 0, everAlive = false;
  var lastDownloadN = -1, noodleCoolUntil = 0, lastBladeEndT = -999;
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
    try { if (TOP.__SB_INSTANCE === "43") TOP.__SB_INSTANCE = ""; } catch (eSt) {}
    try { if (TOP.top && TOP.top !== TOP && TOP.top.__SB_INSTANCE === "43") TOP.top.__SB_INSTANCE = ""; } catch (eSt2) {}
    try { if (TOP.__SB_RUNNING_ANY) TOP.__SB_RUNNING_ANY = 0; } catch (eSt3) {}
    try { if (TOP.top && TOP.top !== TOP && TOP.top.__SB_RUNNING_ANY) TOP.top.__SB_RUNNING_ANY = 0; } catch (eSt4) {}
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
  function isNarrowPlank(cx, cz) {
    var horiz = isPb(cx + 3, cz) || isPb(cx - 3, cz);
    var vert = isPb(cx, cz + 3) || isPb(cx, cz - 3);
    if (horiz && !vert) return "h";
    if (vert && !horiz) return "v";
    return null;
  }
  function sharesAxisPts(a, b) {
    return Math.abs(a[0] - b[0]) < 0.21 || Math.abs(a[1] - b[1]) < 0.21;
  }
  function ringAlong(px, pz, dir) {
    var us = ringIndexNear(px, pz);
    var cur = ringCell(us);
    var n = RING.length, steps, i, c, arr = [2, 3, 1, 4];
    dir = dir || 1;
    for (i = 0; i < arr.length; i++) {
      steps = arr[i];
      c = ringCell(((us + dir * steps) % n + n) % n);
      if (!sharesAxisPts(cur, c)) continue;
      return { x: c[0], z: c[1] };
    }
    return { x: cur[0], z: cur[1] };
  }
  function ringAlongRail(px, pz, dir) {
    // Like ringAlong, but at a corner stay on the current 24-rail
    // (never a chord toward the other rail through the moat).
    var us = ringIndexNear(px, pz);
    var cur = ringCell(us);
    var n = RING.length, steps, i, c, arr = [2, 3, 1, 4];
    var atC = Math.abs(px) > 18 && Math.abs(pz) > 18;
    var onEW = Math.abs(Math.abs(px) - 24) <= 1.2 && Math.abs(Math.abs(pz) - 24) > 1.5;
    var onNS = Math.abs(Math.abs(pz) - 24) <= 1.2 && Math.abs(Math.abs(px) - 24) > 1.5;
    dir = dir || 1;
    for (i = 0; i < arr.length; i++) {
      steps = arr[i];
      c = ringCell(((us + dir * steps) % n + n) % n);
      if (!sharesAxisPts(cur, c)) continue;
      if (atC && onEW && Math.abs(Math.abs(c[0]) - 24) > 0.1) continue;
      if (atC && onNS && Math.abs(Math.abs(c[1]) - 24) > 0.1) continue;
      return { x: c[0], z: c[1] };
    }
    return ringAlong(px, pz, dir);
  }
  function inCornerWell(x, z) {
    return Math.abs(x) > 16 && Math.abs(z) > 16 &&
      Math.min(Math.abs(Math.abs(x) - 24), Math.abs(Math.abs(z) - 24)) > 1.0;
  }
  function inwardOffsetOf(x, z) {
    var ew = Math.abs(Math.abs(x) - 24), ns = Math.abs(Math.abs(z) - 24);
    if (ew <= ns && Math.abs(x) >= 16) return 24 - Math.abs(x);
    if (Math.abs(z) >= 16) return 24 - Math.abs(z);
    return 0;
  }
  function recoverCorner(x, z) {
    var k = emptyKeys(), ew = Math.abs(Math.abs(x) - 24), ns = Math.abs(Math.abs(z) - 24);
    function fixX() {
      if (x >= 0 && x < 23.85) k.ArrowRight = 1;
      else if (x >= 0 && x > 24.15) k.ArrowLeft = 1;
      else if (x < 0 && x > -23.85) k.ArrowLeft = 1;
      else if (x < 0 && x < -24.15) k.ArrowRight = 1;
    }
    function fixZ() {
      if (z >= 0 && z < 23.85) k.ArrowDown = 1;
      else if (z >= 0 && z > 24.15) k.ArrowUp = 1;
      else if (z < 0 && z > -23.85) k.ArrowUp = 1;
      else if (z < 0 && z < -24.15) k.ArrowDown = 1;
    }
    if (ns <= ew && ns > 0.25) fixZ();
    else if (ew > 0.25) fixX();
    else if (ns > 0.25) fixZ();
    return (k.ArrowUp || k.ArrowDown || k.ArrowLeft || k.ArrowRight) ? k : keysTowardOuter(x, z);
  }
  function kaFromFollow(keys) {
    var up = !!keys.ArrowUp, down = !!keys.ArrowDown, left = !!keys.ArrowLeft, right = !!keys.ArrowRight;
    if (up && left) return 225;
    if (up && right) return 315;
    if (down && left) return 125;
    if (down && right) return 45;
    if (up && !down) return 270;
    if (down && !up) return 90;
    if (left && !right) return 180;
    if (right && !left) return 0;
    return null;
  }
  function predFromKeys(px, pz, keys, hor) {
    var ka = kaFromFollow(keys);
    if (ka == null) return [px, pz];
    var d = worldDirFromKa(ka), spd = (k && k.Ah) || 8;
    return [px + d[0] * spd * hor, pz + d[1] * spd * hor];
  }
  function knockbackOkPos(x, z) {
    if (!isPb(x, z) || inCornerWell(x, z)) return false;
    if (inwardOffsetOf(x, z) > 1.20) return false;
    return true;
  }
  function predSafeKeys(px, pz, keys, hor) {
    if (!keys || !(keys.ArrowUp || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight)) return false;
    var p = predFromKeys(px, pz, keys, hor);
    return knockbackOkPos(p[0], p[1]) && isPb(p[0], p[1]) && !inCornerWell(p[0], p[1]);
  }
  function v41CornerGuard(px, pz, keys, t0) {
    var k2 = keys || emptyKeys();
    var stepDt = recentStepDt();
    var atC = Math.abs(px) > 18 && Math.abs(pz) > 18;
    var look = atC ? Math.max(stepDt, 1 / 30, 0.10) : Math.max(stepDt, 1 / 30);
    var waiting = /^(hold-spike|wait-pad|time-spike|stage-spike|wait-arrow|back-pad)$/.test(SB.state || "");
    var onEW = Math.abs(Math.abs(px) - 24) <= 1.2 && Math.abs(Math.abs(pz) - 24) > 1.5;
    var onNS = Math.abs(Math.abs(pz) - 24) <= 1.2 && Math.abs(Math.abs(px) - 24) > 1.5;
    function onKeys(kk) { return !!(kk && (kk.ArrowUp || kk.ArrowDown || kk.ArrowLeft || kk.ArrowRight)); }
    function dropLat(kk) {
      var o = emptyKeys(), n;
      for (n in kk) if (kk[n]) o[n] = 1;
      if (onEW) { o.ArrowLeft = 0; o.ArrowRight = 0; }
      else if (onNS) { o.ArrowUp = 0; o.ArrowDown = 0; }
      if (inwardOffsetOf(px, pz) > 0.35) {
        var rec = recoverCorner(px, pz);
        if (onEW) { o.ArrowLeft = rec.ArrowLeft; o.ArrowRight = rec.ArrowRight; }
        else if (onNS) { o.ArrowUp = rec.ArrowUp; o.ArrowDown = rec.ArrowDown; }
      }
      return o;
    }
    function alongKey(dir) {
      if (inwardOffsetOf(px, pz) > 0.7) return recoverCorner(px, pz);
      var go = ringAlongRail(px, pz, dir);
      return go ? axisKeysTo(px, pz, go.x, go.z) : emptyKeys();
    }
    function pickSafe(preferred) {
      var cands = [], i, c;
      if (preferred && onKeys(preferred)) cands.push({ k: preferred, s: SB.state });
      if (atC) cands.push({ k: dropLat(preferred || k2), s: "corner-clamp" });
      cands.push({ k: recoverCorner(px, pz), s: "recover-ring" });
      cands.push({ k: alongKey(loopDir || 1), s: "corner-along" });
      cands.push({ k: alongKey(-(loopDir || 1)), s: "corner-along" });
      for (i = 0; i < cands.length; i++) {
        c = cands[i];
        if (predSafeKeys(px, pz, c.k, look)) {
          SB.state = c.s;
          return c.k;
        }
      }
      if (!knockbackOkPos(px, pz) || inCornerWell(px, pz)) {
        var rec2 = recoverCorner(px, pz);
        if (onKeys(rec2)) { SB.state = "recover-ring"; return rec2; }
      }
      SB.state = "corner-brake";
      return emptyKeys();
    }
    if (atC && (onEW || onNS) && onKeys(k2)) {
      var clamped = dropLat(k2);
      if (onKeys(clamped)) k2 = clamped;
    }
    if (onKeys(k2)) {
      if (!predSafeKeys(px, pz, k2, look)) k2 = pickSafe(k2);
    } else if (!knockbackOkPos(px, pz) || inCornerWell(px, pz) || inwardOffsetOf(px, pz) > 0.7) {
      if (!(waiting && isPb(px, pz) && !inCornerWell(px, pz) && inwardOffsetOf(px, pz) <= 1.0)) {
        k2 = pickSafe(null);
      }
    }
    return k2;
  }
  function axisKeysTo(px, pz, tx, tz) {
    var keys = emptyKeys();
    if (Math.abs(tx - px) >= Math.abs(tz - pz)) {
      if (tx - px > 0.08) keys.ArrowRight = 1;
      else if (tx - px < -0.08) keys.ArrowLeft = 1;
    } else {
      if (tz - pz > 0.08) keys.ArrowDown = 1;
      else if (tz - pz < -0.08) keys.ArrowUp = 1;
    }
    return keys;
  }
  function onOuterRing(tx, tz) {
    return Math.abs(Math.abs(tx) - 24) < 0.3 || Math.abs(Math.abs(tz) - 24) < 0.3;
  }
  function clampPlankKeys(px, pz, keys) {
    var k = emptyKeys(), n;
    for (n in keys) if (keys[n]) k[n] = 1;
    var c = cellOf(px, pz);
    var kind = isNarrowPlank(c[0], c[1]);
    if (!kind) return k;
    var margin = 1.12;
    if (kind === "v") {
      if (px <= c[0] - margin) k.ArrowLeft = 0;
      if (px >= c[0] + margin) k.ArrowRight = 0;
      if (Math.abs(px - c[0]) > 0.4) {
        if (c[0] > px + 0.08) k.ArrowRight = 1;
        else if (c[0] < px - 0.08) k.ArrowLeft = 1;
      }
    } else {
      if (pz <= c[1] - margin) k.ArrowUp = 0;
      if (pz >= c[1] + margin) k.ArrowDown = 0;
      if (Math.abs(pz - c[1]) > 0.4) {
        if (c[1] > pz + 0.08) k.ArrowDown = 1;
        else if (c[1] < pz - 0.08) k.ArrowUp = 1;
      }
    }
    return k;
  }
  function clampToRingKeys(px, pz, keys) {
    var k = emptyKeys(), n;
    for (n in keys) if (keys[n]) k[n] = 1;
    var ew = Math.abs(Math.abs(px) - 24);
    var ns = Math.abs(Math.abs(pz) - 24);
    var axis;
    if (ew <= ns && Math.abs(px) > 18) {
      axis = px >= 0 ? 24 : -24;
      if (px > axis + 1.12) k.ArrowRight = 0;
      if (px < axis - 1.12) k.ArrowLeft = 0;
      if (px > axis + 0.4) k.ArrowLeft = 1;
      if (px < axis - 0.4) k.ArrowRight = 1;
    } else if (ns < ew && Math.abs(pz) > 18) {
      axis = pz >= 0 ? 24 : -24;
      if (pz > axis + 1.12) k.ArrowDown = 0;
      if (pz < axis - 1.12) k.ArrowUp = 0;
      if (pz > axis + 0.4) k.ArrowUp = 1;
      if (pz < axis - 0.4) k.ArrowDown = 1;
    }
    return k;
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
    try { console.log("[SB v" + VER + " sanity]", lines); } catch (e) {}
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
  var CTE_ON = 0.5, CTE_OFF = 0.4;
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
  function wouldFallDt(px, pz, keys, stepDt, horizon) {
    if (wouldFallKeys(px, pz, keys, horizon == null ? 0.28 : horizon)) return true;
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
    var d = worldDirFromKa(ka), t = Math.min(0.1, Math.max(1 / 60, stepDt || 1 / 60)), spd = (k && k.Ah) || 8;
    return !isPb(px + d[0] * spd * t, pz + d[1] * spd * t);
  }
  function dropLateralKeys(keys, kind) {
    var k2 = { ArrowUp: keys.ArrowUp, ArrowDown: keys.ArrowDown, ArrowLeft: keys.ArrowLeft, ArrowRight: keys.ArrowRight };
    if (kind === "v") { k2.ArrowLeft = 0; k2.ArrowRight = 0; }
    else if (kind === "h") { k2.ArrowUp = 0; k2.ArrowDown = 0; }
    return k2;
  }
  function onOuterLine(px, pz) {
    return Math.abs(Math.abs(px) - 24) <= 0.85 || Math.abs(Math.abs(pz) - 24) <= 0.85;
  }
  function keysTowardOuter(px, pz) {
    var k2 = emptyKeys();
    var dx = Math.abs(Math.abs(px) - 24), dz = Math.abs(Math.abs(pz) - 24);
    if (dx <= dz) {
      if (px >= 0) { if (px < 23.7) k2.ArrowRight = 1; else if (px > 24.3) k2.ArrowLeft = 1; }
      else { if (px > -23.7) k2.ArrowLeft = 1; else if (px < -24.3) k2.ArrowRight = 1; }
    } else {
      if (pz >= 0) { if (pz < 23.7) k2.ArrowDown = 1; else if (pz > 24.3) k2.ArrowUp = 1; }
      else { if (pz > -23.7) k2.ArrowUp = 1; else if (pz < -24.3) k2.ArrowDown = 1; }
    }
    return k2;
  }
  function keysTowardCenter(px, pz, kind) {
    var k2 = emptyKeys(), c = cellOf(px, pz);
    if (kind === "v") {
      if (px < c[0] - 0.4) k2.ArrowRight = 1;
      else if (px > c[0] + 0.4) k2.ArrowLeft = 1;
    } else if (kind === "h") {
      if (pz < c[1] - 0.4) k2.ArrowDown = 1;
      else if (pz > c[1] + 0.4) k2.ArrowUp = 1;
    }
    return k2;
  }
  function filterLagKeys(px, pz, keys) {
    var k2 = { ArrowUp: keys.ArrowUp, ArrowDown: keys.ArrowDown, ArrowLeft: keys.ArrowLeft, ArrowRight: keys.ArrowRight };
    var stepDt = recentStepDt();
    var horizon = Math.max(0.28, stepDt * 5);
    if (!onOuterLine(px, pz)) {
      var rec = keysTowardOuter(px, pz);
      var recDt = Math.min(0.1, Math.max(stepDt, 1 / 60));
      if (!wouldFallDt(px, pz, rec, recDt, recDt)) return rec;
    }
    var c = cellOf(px, pz), kind = isNarrowPlank(c[0], c[1]);
    if (stepDt >= 0.035 && kind) {
      var off = kind === "v" ? Math.abs(px - c[0]) : Math.abs(pz - c[1]);
      k2 = off > 0.22 ? keysTowardCenter(px, pz, kind) : dropLateralKeys(k2, kind);
    }
    if (stepDt < 0.035) return k2;
    if (!wouldFallDt(px, pz, k2, stepDt, horizon)) return k2;
    if (kind) {
      k2 = dropLateralKeys(k2, kind);
      if (!wouldFallDt(px, pz, k2, stepDt, horizon)) return k2;
    }
    return emptyKeys();
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
  function keysAreOn(keys) {
    return !!(keys && (keys.ArrowUp || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight));
  }
  function keySignature(keys) {
    return (keys && keys.ArrowUp ? "U" : "") + (keys && keys.ArrowDown ? "D" : "") +
      (keys && keys.ArrowLeft ? "L" : "") + (keys && keys.ArrowRight ? "R" : "");
  }
  function oppositeKeys(a, b) {
    if (!a || !b) return false;
    return (a.ArrowLeft && b.ArrowRight) || (a.ArrowRight && b.ArrowLeft) ||
      (a.ArrowUp && b.ArrowDown) || (a.ArrowDown && b.ArrowUp);
  }
  function emptyStab() { return { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 }; }
  function stabilizeKeys(keys, t0, px, pz, emergency) {
    var on = keysAreOn(keys), speed = 99, dtj, disp;
    if (lastJitX != null && lastJitT > 0) {
      dtj = t0 - lastJitT;
      disp = Math.hypot(px - lastJitX, pz - lastJitZ);
      if (dtj > 0 && dtj < 0.2) {
        speed = disp / dtj;
        if (keysAreOn(prevStabKeys) && speed < 0.3) {
          jitterTime += dtj;
          SB.jitterTime = jitterTime;
        }
      }
    }
    lastJitX = px; lastJitZ = pz; lastJitT = t0;
    // If keys have been held while barely moving for >0.12 s, this is the
    // live oscillation — release them. Do not commit a MOVE direction.
    if (!emergency && keysAreOn(prevStabKeys) && on && speed < 0.3 && (t0 - lastStabMoveT) > 0.12) {
      if (prevStabKeys && oppositeKeys(keys, prevStabKeys)) {
        dirFlips += 1; SB.dirFlips = dirFlips; lastFlipT = t0;
      }
      prevStabKeys = emptyStab();
      return emptyStab();
    }
    if (on && speed >= 0.3) lastStabMoveT = t0;
    if (prevStabKeys && oppositeKeys(keys, prevStabKeys)) {
      dirFlips += 1;
      SB.dirFlips = dirFlips;
      lastFlipT = t0;
    }
    prevStabKeys = keys;
    return keys;
  }
  function inwardKeys(px, pz) {
    // Only correct overflow PAST the ring (outer water). Never step inward
    // off a 1-cell plank toward the island moat (that is also water).
    var k = emptyStab();
    if (px > 24.2) k.ArrowLeft = 1;
    else if (px < -24.2) k.ArrowRight = 1;
    if (pz > 24.2) k.ArrowUp = 1;
    else if (pz < -24.2) k.ArrowDown = 1;
    return k;
  }
  function offLaneKeys(px, pz) {
    // Step along the ring, away from x=±6 or z=±6 firing lines.
    var dest, trial;
    dest = ringAlong(px, pz, loopDir || 1);
    trial = axisKeysTo(px, pz, dest.x, dest.z);
    if (onDartLane(dest.x, dest.z) || dartThreatAt(dest.x, dest.z, 0.2)) {
      dest = ringAlong(px, pz, -(loopDir || 1));
      trial = axisKeysTo(px, pz, dest.x, dest.z);
    }
    return trial;
  }
  function perpDodgeArrow(px, pz) {
    var n = (k && k.eb && k.eb.active) || 0, i, d, fx, fz, along, side, spd, trial, dest;
    for (i = 0; i < n; i++) {
      d = k.eb.array[i];
      if (!d || !d.position) continue;
      fx = (d.forward && d.forward.x) || 0;
      fz = (d.forward && d.forward.z) || 0;
      spd = d.speed || 20;
      along = (px - d.position.x) * fx + (pz - d.position.z) * fz;
      side = (px - d.position.x) * (-fz) + (pz - d.position.z) * fx;
      if (along > -2 && along < 10 && Math.abs(side) < 2.2) {
        // Move perpendicular to flight, preferring the along-ring / inward side.
        dest = ringAlong(px, pz, side >= 0 ? (loopDir || 1) : -(loopDir || 1));
        trial = axisKeysTo(px, pz, dest.x, dest.z);
        if (!wouldFallKeys(px, pz, trial, 0.3) && !onDartLane(dest.x, dest.z)) return trial;
      }
    }
    if (onDartLane(px, pz) && dartThreatAt(px, pz, 0.2)) {
      trial = offLaneKeys(px, pz);
      if (!wouldFallKeys(px, pz, trial, 0.3)) return trial;
    }
    return null;
  }
  function v32PostKeys(px, pz, tx, tz, followKeys, t0, enemies) {
    var k2, bi, b, dB, emergency = false, nx, nz, waterOuter, rec0, rec;
    nowT = t0;
    if (SB._dashFace && pendingDash && !greenDashed) {
      k2 = axisKeysTo(px, pz, px + SB._dashFace.fx * 4, pz + SB._dashFace.fz * 4);
      if (keysAreOn(k2) && !wouldFallKeys(px, pz, k2, 0.2)) {
        followKeys = k2;
        SB.state = "face-dash";
        emergency = true;
      }
    }
    // Arrow: leave a hot firing line along the ring; never stand in it.
    // If already off, cancel a step that would enter a hot lane.
    nx = px; nz = pz;
    if (followKeys.ArrowRight) nx += 1.2; else if (followKeys.ArrowLeft) nx -= 1.2;
    if (followKeys.ArrowDown) nz += 1.2; else if (followKeys.ArrowUp) nz -= 1.2;
    if (onDartLane(px, pz) && dartThreatAt(px, pz, 0.2)) {
      var leave = ringAlong(px, pz, 1);
      var lk = leave ? axisKeysTo(px, pz, leave.x, leave.z) : null;
      if (leave && lk && keysAreOn(lk) && !onDartLane(leave.x, leave.z) && !wouldFallKeys(px, pz, lk, 0.2)) {
        followKeys = lk;
        SB.state = "dodge-arrow";
        emergency = true;
      } else {
        leave = ringAlong(px, pz, -1);
        lk = leave ? axisKeysTo(px, pz, leave.x, leave.z) : null;
        if (leave && lk && keysAreOn(lk) && !onDartLane(leave.x, leave.z) && !wouldFallKeys(px, pz, lk, 0.2)) {
          followKeys = lk;
          SB.state = "dodge-arrow";
          emergency = true;
        }
      }
    } else if (onDartLane(nx, nz) && dartThreatAt(nx, nz, 0.2)) {
      followKeys = emptyStab();
      SB.state = "wait-arrow";
    }
    // v33 picks every colour, so never cut the inner diagonal (that walk
    // falls into the moat). v32 still skirts non-red pads.
    if (!V33_ALL_BLADES) (visibleBlades() || []).forEach(function (b) {
      dB = Math.hypot(b.x - px, b.z - pz);
      if (dB < 2.2 && !wantedBlade(b)) {
        var sx = b.x >= 0 ? 1 : -1, sz = b.z >= 0 ? 1 : -1;
        var dx = b.x - 1.8 * sx, dz = b.z - 1.8 * sz;
        if (isPb(dx, dz) && !isSpikeCell(dx, dz) && nearestSpikePad(dx, dz) >= 2.5) {
          k2 = axisKeysTo(px, pz, dx, dz);
          if (keysAreOn(k2) && !wouldFallKeys(px, pz, k2, 0.2)) {
            followKeys = k2;
            SB.state = "skirt-blade";
          }
        }
      }
    });
    waterOuter = Math.abs(px) > 24.2 || Math.abs(pz) > 24.2;
    if (V32_WATER && waterOuter) {
      k2 = inwardKeys(px, pz);
      if (keysAreOn(k2) && !wouldFallKeys(px, pz, k2, 0.2)) {
        followKeys = k2;
        SB.state = "edge-margin";
        emergency = true;
      }
    }
    if (wouldFallKeys(px, pz, followKeys, 0.2) || wouldFallDt(px, pz, followKeys, recentStepDt(), 0.2)) {
      rec = keysTowardOuter(px, pz);
      if (keysAreOn(rec) && !wouldFallKeys(px, pz, rec, 0.2)) {
        followKeys = rec;
        SB.state = "recover-ring";
        emergency = true;
      } else {
        followKeys = emptyStab();
        emergency = true;
      }
    }
    if (bladeEffectActive() && !emergency && !waterOuter && SB.state !== "wait-arrow") {
      // Don't micro-step during a freeze; STAND unless we are leaving the outer lip.
    }
    SB._holdX = tx; SB._holdZ = tz;
    followKeys = stabilizeKeys(followKeys, t0, px, pz, emergency);
    if (wouldFallKeys(px, pz, followKeys, 0.2) || wouldFallDt(px, pz, followKeys, recentStepDt(), 0.2)) {
      rec = keysTowardOuter(px, pz);
      if (keysAreOn(rec) && !wouldFallKeys(px, pz, rec, 0.2)) {
        followKeys = rec;
        SB.state = "recover-ring";
      } else {
        followKeys = emptyStab();
      }
    }
    return followKeys;
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
        var pc = cellOf(cx, cz);
        if (Math.abs(c[0] - pc[0]) < 0.1 && Math.abs(c[1] - pc[1]) < 0.1) return true;
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
    var tick = spikeTick() % 1000;
    var fireIn = ((500 - tick + 1000) % 1000) / 400;
    var sinceFire = tick >= 500 ? (tick - 500) / 400 : 99;
    var onLane = onDartLane(x, z);
    // Upcoming fire, or the dart is already in flight across the ring (~0.15 s to impact, 1.55 hit radius).
    if (onLane && (fireIn < 0.40 + (eta || 0) || sinceFire < 0.40 + (eta || 0))) return true;
    return false;
  }
  function onDartLane(x, z) {
    return (Math.abs(Math.abs(x) - 6) < 1.8 && z > 18) ||
      (Math.abs(Math.abs(z) - 6) < 1.8 && Math.abs(x) > 18);
  }
  function dartInFlightTick(tick) {
    tick = tick % 1000;
    return tick >= 500 && tick < 660;
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
    var dist = Math.hypot(tx - px, tz - pz), eta = dist / 8, steps, i, x, z, CROSS = 0.70;
    if (inSpikeRadius(tx, tz) || inSpikeRadius(px, pz)) {
      if (spikesUp() || safeTimeRemaining() < Math.max(CROSS, eta + 0.35)) return false;
    }
    if (dartThreatAt(tx, tz, eta)) return false;
    steps = Math.max(2, Math.ceil(dist / 3));
    for (i = 1; i <= steps; i++) {
      x = px + (tx - px) * i / steps;
      z = pz + (tz - pz) * i / steps;
      if (!isPb(x, z)) return false;
      if (inSpikeRadius(x, z) && (spikesUp() || safeTimeRemaining() < Math.max(CROSS, eta * (i / steps) + 0.25))) return false;
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
  var SPIKE_PADS = [[24,-21],[21,-24],[-21,-24],[-24,-21],[-24,21],[-21,24],[21,24],[24,21]];
  function nearestSpikePad(px, pz) {
    var best = 99, i, d;
    for (i = 0; i < SPIKE_PADS.length; i++) {
      d = Math.hypot(SPIKE_PADS[i][0] - px, SPIKE_PADS[i][1] - pz);
      if (d < best) best = d;
    }
    return +best.toFixed(2);
  }
  function inSpikeRadius(px, pz, r) {
    return nearestSpikePad(px, pz) < (r == null ? SPIKE_HIT_R : r);
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
    ev.nearestPad = nearestSpikePad(px, pz);
    ev.onDartLane = onDartLane(px, pz);
    ev.cause = ev.spikeUp && (ev.onSpikePad || ev.nearestPad < SPIKE_HIT_R + 0.4) ? "spike"
      : ((ev.nearestDart < 2.5 || (ev.onDartLane && dartInFlightTick(ev.spikeTick))) ? "arrow"
        : (ev.nearestFireball < 2.2 || ev.amount === 1.5 || (ev.nearestEnemy.type === "medusa" && ev.nearestEnemy.dist <= 13 && ev.nearestEnemy.dist > 3.5) ? "fireball"
          : (ev.nearestEnemy.dist < 4 || (ev.amount >= 2 && ev.nearestEnemy.dist < 5.5 && /axe|boss|shield/.test(ev.nearestEnemy.type || "")) ? "enemy/" + ev.nearestEnemy.type : "unknown")));
    SB.hpEvents = (SB.hpEvents || []).concat([ev]).slice(-40);
    try { persistLog(); } catch (eHp) {}
    if (after <= 3) noodleCoolUntil = 0;
    return ev;
  }

  function isGameOver() {
    // Real end of a life: death flag or HP gone. Independent of i-frame blink.
    return !!(k && k.i && (k.i.la || (typeof k.i.Y === "number" && k.i.Y <= 0)));
  }
  function inRound() {
    if (!k || !k.i) return false;
    if (isGameOver()) return false;
    // Do NOT use k.i.v.visible — i-frame blink (Oa) toggles the mesh and was
    // ending runs / firing autosave on every HP chip in v33 live.
    if (k.N && k.N.Ob === false && k.i.Ta) return false;
    return true;
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
  function bladeColorName(c) {
    return c === 0 ? "blue" : c === 1 ? "red" : c === 2 ? "green" : c === 3 ? "yellow" : String(c);
  }
  function bladeEffectActive() {
    try { return !!(k && k.i && k.i.Da); } catch (e) { return false; }
  }
  function closeBladeUses() {
    if (!pendingBlade) return;
    pendingBlade.kills = Math.max(0, (SB.runKills || 0) - (pendingBlade.killsAt || 0));
    pendingBlade.ended = nowT;
    SB.bladeUses = (SB.bladeUses || []).concat([pendingBlade]).slice(-40);
    pendingBlade = null;
    lastBladeEndT = nowT;
  }
  function useZeitklingen(reason) {
    if (!k || !k.i || k.i.Rb < 0) return false;
    // One effect at a time: first press only when idle. Second press is dash/rewind below.
    if (bladeEffectActive() && !(pendingDash || pendingRewind)) return false;
    var color = k.i.Rb;
    var near = [], i, e, pos, nm, d;
    for (i = 0; i < (liveEnemies() || []).length; i++) {
      e = liveEnemies()[i];
      pos = e && e.mesh && e.mesh.position;
      if (!pos) continue;
      d = Math.hypot(pos.x - (SB.px || 0), pos.z - (SB.pz || 0));
      if (d < 10) near.push({ type: enemyName(e), dist: +d.toFixed(2) });
    }
    try {
      if (typeof gw.sa === "function") gw.sa();
      else {
        key("Control", true, true);
        setTimeout(function () { try { key("Control", false, true); } catch (e2) {} }, 80);
      }
    } catch (err) { SB.err = "blade " + ((err && err.message) || err); return false; }
    if (pendingBlade && pendingBlade.colorId === color && bladeEffectActive()) {
      pendingBlade.reason = reason || pendingBlade.reason;
      return true;
    }
    closeBladeUses();
    lastBladeUseT = nowT;
    pendingBlade = {
      t: nowT, wave: SB.wave, color: bladeColorName(color), colorId: color,
      reason: reason || bladeColorName(color), enemies: near, killsAt: SB.runKills || 0, kills: 0, escapes: 0
    };
    return true;
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
  function predictDash(px, pz, fx, fz) {
    var L = Math.hypot(fx, fz), mx, mz, i, tx, tz, c;
    if (L < 1e-6) return null;
    mx = (fx / L) * 7.5; mz = (fz / L) * 7.5;
    for (i = 0; i < 3; i++) {
      tx = px + mx; tz = pz + mz;
      if (isPb(tx, tz)) {
        c = cellOf(tx, tz);
        return { x: c[0], z: c[1], fx: fx / L, fz: fz / L, scale: i === 0 ? 7.5 : i === 1 ? 4.95 : 3.27 };
      }
      mx *= 0.66; mz *= 0.66;
    }
    return null;
  }
  function onOuterRingPt(x, z) {
    return Math.abs(Math.abs(x) - 24) <= 1.0 || Math.abs(Math.abs(z) - 24) <= 1.0;
  }
  function dashLandSafe(land) {
    if (!land || !isPb(land.x, land.z)) return false;
    if (Math.abs(land.x) > 25.2 || Math.abs(land.z) > 25.2) return false;
    if (!onOuterRingPt(land.x, land.z)) return false;
    if (isSpikeCell(land.x, land.z) || inSpikeRadius(land.x, land.z)) return false;
    if (onDartLane(land.x, land.z) && dartThreatAt(land.x, land.z, 0.25)) return false;
    return true;
  }
  function bestDash(px, pz, enemies, reasonPrefer) {
    var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    var along = ringAlong(px, pz, loopDir || 1);
    if (along) dirs.unshift([along.x - px, along.z - pz]);
    var i, land, best = null, score, threat = 0, ei, epos, ed, fb, ringDist, close;
    fb = nearestFireball(px, pz);
    if (fb < 8) threat = Math.max(threat, 8 - fb);
    for (ei = 0; ei < (enemies || []).length; ei++) {
      epos = enemies[ei].mesh && enemies[ei].mesh.position;
      if (!epos) continue;
      ed = Math.hypot(epos.x - px, epos.z - pz);
      if (ed < 2.8) threat = Math.max(threat, 3);
    }
    for (i = 0; i < dirs.length; i++) {
      land = predictDash(px, pz, dirs[i][0], dirs[i][1]);
      if (!dashLandSafe(land)) continue;
      ringDist = Math.min(Math.abs(Math.abs(land.x) - 24), Math.abs(Math.abs(land.z) - 24));
      score = -ringDist;
      if (fb < 8) score += Math.hypot(land.x - px, land.z - pz);
      close = 99;
      for (ei = 0; ei < (enemies || []).length; ei++) {
        epos = enemies[ei].mesh && enemies[ei].mesh.position;
        if (!epos) continue;
        ed = Math.hypot(epos.x - land.x, epos.z - land.z);
        if (ed < close) close = ed;
      }
      if (threat && Math.hypot(land.x - px, land.z - pz) > 3) score += 4;
      if (close > 0.8 && close < 3.2) score += 5; // land next to a kill, not on top
      if (!best || score > best.score) best = { land: land, score: score, reason: threat ? "green-escape" : "green-close" };
    }
    return best;
  }

  var pendingDash = null, pendingRewind = false, greenDashed = false, yellowArmedHp = 5;

  function maybeUseBlade(px, pz, enemies) {
    if (pendingBlade && ((pendingBlade.colorId === 3 && nowT - pendingBlade.t > 9.2) || (pendingBlade.colorId !== 3 && nowT - pendingBlade.t > 6.2) || !bladeEffectActive())) closeBladeUses();
    if (!k || !k.i) return;
    var color = k.i.Rb;
    var mode = k.i.Da || 0;
    var va = k.i.va || {};
    var spikeHot = isSpikeCell(px, pz) || inSpikeRadius(px, pz) || spikesUp() || (safeTimeRemaining() < 0.7 && nearestSpikePad(px, pz) < 4);
    var tank = findTank(enemies);
    var dTank = tank ? Math.hypot(tank.x - px, tank.z - pz) : 99;
    var nearEn = 0, hard = 0, snakes = 0, ti, tpos, tname, td, orbThreat = false;
    for (ti = 0; ti < (enemies || []).length; ti++) {
      tname = enemyName(enemies[ti]);
      tpos = enemies[ti].mesh && enemies[ti].mesh.position;
      if (!tpos) continue;
      td = Math.hypot(tpos.x - px, tpos.z - pz);
      if (td < 4) nearEn++;
      if (tname === "snake" && td < 8) snakes++;
      if ((tname === "axe" || tname === "shield" || tname === "boss" || tname === "boss2") && td < 8) hard++;
      if (tname === "medusa" && td <= 13) orbThreat = true;
    }
    if (nearestFireball(px, pz) < 8) orbThreat = true;
    var hp = k.i.Y;
    var onTrapState = /^(time-spike|hold-spike|retreat-spike|time-dart|wait-pad|back-pad|wait-arrow)$/.test(SB.state || "");

    // Green: second press once a verified landing exists; then resync ring.
    if (pendingDash && mode === (va.forward || 3)) {
      if (nowT - pendingDash.t >= 0.12 && !greenDashed) {
        useZeitklingen(pendingDash.reason || "green-dash");
        greenDashed = true; SB._dashFace = null;
        SB.wi = ringIndexNear(px, pz);
        onRing = true;
        SB.state = "dash-green";
        if (pendingBlade) pendingBlade.escapes = (pendingBlade.escapes || 0) + (pendingDash.reason && pendingDash.reason.indexOf("escape") >= 0 ? 1 : 0);
      }
      return;
    }
    // Yellow: rewind on HP loss, fall, or lethal danger, if the saved pose is safe-ish.
    if (mode === (va.reverse || 4)) {
      var falling = !!(k.i.Ta);
      if ((falling || hp < yellowArmedHp || hp <= 1) && !pendingRewind) {
        pendingRewind = true;
        useZeitklingen(falling ? "yellow-escape-fall" : "yellow-rewind-hp");
        SB.wi = ringIndexNear(px, pz);
        onRing = true;
        SB.state = "rewind-yellow";
        if (pendingBlade) pendingBlade.escapes = (pendingBlade.escapes || 0) + 1;
      }
      return;
    }

    if (color < 0 || mode) return; // not holding, or already armed (red/blue tick down)
    greenDashed = false; pendingDash = null; pendingRewind = false;

    var fbNow0 = nearestFireball(px, pz);
    var danger = (hp <= 3 && (nearEn || orbThreat || hard)) || fbNow0 < 8 || nearEn >= 2 || (hard && hp <= 4);
    var lastUse = (SB.bladeUses || [])[(SB.bladeUses || []).length - 1];
    var lastPaid = !lastUse || (lastUse.kills || 0) > 0 || (lastUse.escapes || 0) > 0;
    if (!danger && nowT - lastBladeEndT < 8) return;
    if (!danger && !lastPaid && nowT - lastBladeEndT < 12) return;

    if (color === 1) { // red freeze — melee crowd (not while planted on a trap)
      if (spikeHot || onTrapState) return;
      if (hp <= 1 && (nearEn || orbThreat || hard)) { useZeitklingen("danger-hp"); return; }
      if (nearEn && dTank < 5.5) { useZeitklingen("danger-melee"); return; }
      if (nearEn) { useZeitklingen("danger-melee"); return; }
      if (hard && dTank < 5.5) { useZeitklingen("advantage-tank"); return; }
      if (SB.waveAge > 90 && hard && enemies && enemies.length >= 1 && enemies.length <= 4) { useZeitklingen("advantage-stuck"); return; }
      return;
    }
    if (color === 0) { // blue slow
      if (spikesUp() && (isSpikeCell(px, pz) || inSpikeRadius(px, pz))) return;
      if (orbThreat) { useZeitklingen("blue-orbs"); return; }
      if (onDartLane(px, pz) && dartThreatAt(px, pz, 0.4) && (nearestDart(px, pz) < 6 || /arrow|dart|time-dart/.test(SB.state || ""))) { useZeitklingen("blue-darts"); return; }
      if (snakes >= 3 && nearEn) { useZeitklingen("blue-snakes"); return; }
      if (SB.waveAge > 90 && enemies && enemies.length >= 2) { useZeitklingen("blue-stuck"); return; }
      return;
    }
    if (color === 2) { // green: verified escape, or a close that lands next to a target
      if (spikeHot && !orbThreat && nearestFireball(px, pz) >= 6) return;
      var plan = bestDash(px, pz, enemies);
      var fbNow = nearestFireball(px, pz);
      var escapeOk = plan && plan.land && (plan.reason === "green-escape" && (fbNow < 8 || (nearEn && hp <= 3) || hp <= 2));
      var closeOk = plan && plan.land && plan.reason === "green-close" && plan.score >= 5;
      if (escapeOk || closeOk) {
        pendingDash = { t: nowT, reason: plan.reason, fx: plan.land.fx, fz: plan.land.fz };
        useZeitklingen(plan.reason);
        SB._dashFace = plan.land;
      }
      return;
    }
    if (color === 3) { // yellow: arm only when a rewind is likely to matter
      if (nearEn || orbThreat || hard || hp <= 4 || danger) {
        yellowArmedHp = hp;
        pendingRewind = false;
        useZeitklingen("yellow-arm");
      }
    }
  }
  function visibleBlades() {
    var out = [], i, s, col;
    try {
      if (!k || !k.Ib) return out;
      for (i = 0; i < k.Ib.length; i++) {
        s = k.Ib[i];
        col = (s && (s.$a != null ? s.$a : s.sa));
        if (!s || col == null || col < 0) continue;
        if (s.Gd) continue;
        out.push({ x: s.position.x, z: s.position.z, color: col, name: bladeColorName(col) });
      }
    } catch (e) {}
    return out;
  }
  function wantedBlade(b) {
    // Any colour on the ring is a free pickup if hands are empty.
    if (!b || b.color == null || b.color < 0) return false;
    if (k && k.i && k.i.Rb >= 0) return false;
    if (bladeEffectActive()) return false;
    return true;
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
    if (reason !== "water" && (nd < 2.5 || (onDartLane(px, pz) && dartInFlightTick(spikeTick())))) reason = "arrow";
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
    // deathLogged is only a duplicate-record guard, never a reason to skip detection.
    if (deathLogged) return;
    var src = lastAlivePos || { x: SB.px, z: SB.pz, y: 0, dx: vel[0], dz: vel[1] };
    var atOrigin = Math.hypot(+src.x || 0, +src.z || 0) < 2;
    var bootish = !everAlive && (SB.state === "boot" || SB.state === "wait-spawn" || SB.state === "wait-player" || SB.state === "wait-round");
    if (bootish || (!everAlive && atOrigin && !(parseInt(SB.score, 10) > 0))) return;
    deathLogged = true;
    var rec = {
      x: +(+src.x).toFixed(2), z: +(+src.z).toFixed(2), y: +(+src.y || 0).toFixed(2),
      dx: +(src.dx || vel[0] || 0).toFixed(2), dz: +(src.dz || vel[1] || 0).toFixed(2),
      reason: reason || "die", score: SB.score, wave: SB.wave,
      state: SB.state, wp: SB.wp, t: Date.now(),
      hpEvents: (SB.hpEvents || []).slice(-8),
      nearest: SB.nearest, enemies: SB.enemies, kills: SB.runKills || 0
    };
    SB.deaths.push(rec);
    saveDeaths(SB.deaths);
    persistLog();
    try { console.log("[SB v" + VER + " death] " + (rec.reason || "") + "/" + (rec.state || "") + " (" + rec.x + "," + rec.z + ") wp=" + (rec.wp || "") + " sc=" + rec.score + " w=" + rec.wave); } catch (e) {}
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
    var hits = (SB.hpEvents || []).slice(-5).map(function (e, i, arr) {
      return (e.hpBefore + "->" + e.hpAfter + " " + (e.cause || "?") + " (" + e.x + "," + e.z + ")");
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
      "blades " + ((SB.bladeUses && SB.bladeUses.length) || 0) + "  flips/min " + (nowT > 1 ? (dirFlips / (nowT / 60)).toFixed(1) : "0") + "  jitter " + jitterTime.toFixed(1) + "s\n" +
      "dt     p50=" + (function () { var st = dtStats(); return (st.p50 * 1000).toFixed(0) + " p95=" + (st.p95 * 1000).toFixed(0) + " max=" + (st.max * 1000).toFixed(0) + "ms  >40=" + st.over40 + "/" + st.frames; })() + "\n" +
      (SB.lite ? "gfx    " + SB.lite + "\n" : "") +
      "bl     " + (SB.bl || 0) + " segs  gen " + GEN + "\n" +
      (SB.sanity ? "map    " + SB.sanity + "\n" : "") +
      (SB.err ? "ERR    " + SB.err + "\n" : "") +
      "--- Läufe ---\n" + runs + "\n" +
      "--- Treffer ---\n" + hits + "\n" +
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
      if (everAlive) logDeath(classifyDeath(SB.px, SB.pz));
      endRunCapture(true);
      clickEl(again);
      SB.wave = "1"; SB.score = "0"; SB.state = "restart"; SB.runKills = 0; lastScoreNum = 0;
      route = []; onRing = false;
      return;
    }
    var play = Q(".entry.level_02 .play");
    if (visible(play)) clickEl(play);
  }
  function logPayload() {
    var genMax = GEN;
    try { if (TOP.__SB_GEN != null) genMax = TOP.__SB_GEN; } catch (eG) {}
    return { ver: SB.ver, gen: GEN, instances: genMax, runs: SB.runs, deaths: SB.deaths, hpEvents: SB.hpEvents || [], dt: dtStats(), lite: SB.lite || "", bladeUses: SB.bladeUses || [], dirFlips: dirFlips, jitterTime: +jitterTime.toFixed(2),
      current: { score: SB.score, wave: SB.wave, kills: SB.runKills || 0, hp: SB.hp, x: +(+SB.px).toFixed(2), z: +(+SB.pz).toFixed(2), state: SB.state, wp: SB.wp, t: Date.now(), alive: !!everAlive, gen: GEN } };
  }
  function persistLog() {
    var json = JSON.stringify(logPayload());
    try { if (TOP.localStorage) TOP.localStorage.setItem(LS_DUMP, json); } catch (e) {}
    TOP.__SB_dump = function () { return JSON.stringify(logPayload()); };
    try { TOP["__SB_dump_v" + VER] = TOP.__SB_dump; } catch (eD) {}
    SB.dump = TOP.__SB_dump;
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
    for (i = 0; i < SB.runs.length; i++) { r = SB.runs[i]; if (r && String(r.ver) === String(VER)) n++; }
    return n;
  }
  function endRunCapture(force) {
    // Only snapshot a "run" on a real game over (or the Nochmal restart).
    if (!force && !isGameOver() && !deathLogged) return;
    if (runDumped) { persistLog(); return; }
    logRun();
    persistLog();
    runDumped = true;
    var n = countVerRuns();
    if (n > 0 && n % 10 === 0 && n !== lastDownloadN) {
      lastDownloadN = n;
      downloadLog();
    }
  }
  function logRun() {
    var score = SB.score, wave = SB.wave, kills = SB.runKills;
    if (score === "?" && wave === "?") return;
    if (String(wave) === "0") return;
    var last = SB.runs[SB.runs.length - 1];
    var now = Date.now();
    // Dedup a double-fire of the same game over, not a mid-life HP chip
    // (those no longer reach this function).
    if (last && String(last.score) === String(score) && String(last.wave) === String(wave) && (now - (last.t || 0)) < 8000) return;
    var deathReason = "";
    if (SB.deaths.length && SB.deaths[SB.deaths.length - 1].t >= now - 4000) deathReason = SB.deaths[SB.deaths.length - 1].reason;
    SB.runs.push({ score: score, wave: wave, kills: kills, ver: VER, gen: GEN, t: now, x: +(+((lastAlivePos&&lastAlivePos.x)||SB.px||0)).toFixed(2), z: +(+((lastAlivePos&&lastAlivePos.z)||SB.pz||0)).toFixed(2), state: SB.state, reason: deathReason });
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
    waveStartedAt = t0; waveSeen = ""; lastFrameT = 0;
    holdUntil = -1; holdState = ""; holdDest = null; holdDir = 1;
    lastMoveT = t0; lastMoveX = null; lastMoveZ = null; noodleSince = 0; noodleCoolUntil = 0; lastBladeEndT = -999;
    SB.rs = t0;
    SB.runKills = 0;
    lastScoreNum = parseInt(SB.score, 10) || 0;
    deathLogged = false; everAlive = true;
    trail = []; speedHist = [];
    stuckSince = 0; spikeWaitKey = ""; spikeWaitT = 0; stallSince = t0; stallKills = 0; stallWave = SB.wave; waitUntil = 0; guardUntil = 0; reverseUntil = 0; antiT = 0;
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
    nowT = t0;
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

    if (!isPb(p.x, p.z) && Math.hypot(p.x, p.z) < 8 && (p.y == null || p.y > -0.5)) {
      releaseAllKeys();
      SB.state = "wait-spawn";
      prevPos = [p.x, p.z, t0, p.y];
      return;
    }
    everAlive = true;

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
      var waveN = parseInt(SB.wave, 10) || 0;
      var noodleThreat = false, ni, npos, nname, ndist;
      for (ni = 0; ni < enemies.length; ni++) {
        nname = enemyName(enemies[ni]);
        npos = enemies[ni].mesh && enemies[ni].mesh.position;
        if (!npos) continue;
        ndist = Math.hypot(npos.x - p.x, npos.z - p.z);
        if ((nname === "axe" || nname === "shield" || nname === "boss" || nname === "boss2") && ndist < 12) noodleThreat = true;
        if (ndist < 3.2) noodleThreat = true;
      }
      // v33 chased any bowl within 14 whenever HP was not full, and a 3s abort
      // reset noodleSince so the next frame re-entered — wave-6 time sink, and
      // the 19:52:10 axe chip happened in state noodle. Heal only when it pays.
      // v40: heal at HP<=4 whenever the path is safe; still refuse a
      // threatened bowl unless HP<=2.
      var wantNoodle = k.i.Y <= 4 && !noodleThreat;
      if (noodleThreat) wantNoodle = k.i.Y <= 2;
      for (bi = 0; bi < bowls.length; bi++) {
        bowl = bowls[bi];
        bd = Math.hypot(bowl.x - p.x, bowl.z - p.z);
        if (bd < 14 && isPb(bowl.x, bowl.z) && pathSafeTo(p.x, p.z, bowl.x, bowl.z) && bd < bestBd) {
          bestBd = bd; bestB = bowl;
        }
      }
      if (wantNoodle && bestB && t0 >= noodleCoolUntil) {
        if (SB.state !== "noodle") noodleSince = t0;
        if (t0 - noodleSince > 2.5 && Math.hypot(p.x - bestB.x, p.z - bestB.z) > 1.2) {
          noodleSince = 0;
          noodleCoolUntil = t0 + 8;
          if (SB.state === "noodle") SB.state = onRing ? "loop" : "start";
        } else {
          tx = bestB.x; tz = bestB.z; SB.state = "noodle";
        }
      } else if (SB.state === "noodle") {
        noodleSince = 0;
        SB.state = onRing ? "loop" : "start";
      }
    }

    var yieldR = V32_DODGE ? 6 : 4;
    var behindR = V32_DODGE ? 7 : 5;
    var ahead = enemyAhead(p.x, p.z, tx, tz, enemies, yieldR);
    var behind = enemyBehind(p.x, p.z, tx, tz, enemies, behindR);
    var enemyNear = false, eni, eposN;
    for (eni = 0; eni < enemies.length; eni++) {
      eposN = enemies[eni].mesh && enemies[eni].mesh.position;
      if (eposN && Math.hypot(eposN.x - p.x, eposN.z - p.z) < 6.5) enemyNear = true;
    }
    if (ahead && behind) {
      if (V32_DODGE) {
        var alongY = ringAlong(p.x, p.z, -(loopDir || 1));
        tx = alongY.x; tz = alongY.z; seekDirect = true;
        SB.state = "yield"; holdYieldUntil = t0 + 0.7;
      } else {
        var inner = innerSafeCell(p.x, p.z, enemies);
        if (inner) { tx = inner[0]; tz = inner[1]; SB.state = "yield"; holdYieldUntil = t0 + 0.9; }
        else { SB.state = "yield"; holdYieldUntil = t0 + 0.5; }
      }
      if (k && k.i && k.i.Rb === 1) useZeitklingen("danger-surround");
    } else if (t0 < holdYieldUntil) {
      if (V32_DODGE) {
        var alongH = ringAlong(p.x, p.z, -(loopDir || 1));
        tx = alongH.x; tz = alongH.z; seekDirect = true;
      }
      SB.state = "yield";
    } else if (ahead) {
      var otherTgt = onRing ? ringCell(SB.wi - loopDir) : [p.x, p.z];
      var otherAhead = enemyAhead(p.x, p.z, otherTgt[0], otherTgt[1], enemies, behindR);
      if (otherAhead && t0 >= reverseUntil && onRing) {
        // Never cut-inner with an enemy nearby (walked off the outer lip in v31 death 14).
        if (!V32_DODGE) {
          var inner2 = innerSafeCell(p.x, p.z, enemies);
          if (inner2 && pathSafeTo(p.x, p.z, inner2[0], inner2[1]) && !enemyNear) {
            tx = inner2[0]; tz = inner2[1];
            SB.state = "cut-inner";
          } else {
            SB.state = "yield";
            holdYieldUntil = t0 + 0.5;
          }
        } else {
          var alongC = ringAlong(p.x, p.z, -(loopDir || 1));
          tx = alongC.x; tz = alongC.z; seekDirect = true;
          SB.state = "yield";
          holdYieldUntil = t0 + 0.7;
        }
        if (k && k.i && k.i.Rb === 1 && k.i.Y <= 1) useZeitklingen("danger-hp");
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
        var padKey = String(info.cluster.start) + ":" + String(loopDir);
        if (padKey !== spikeWaitKey) { spikeWaitKey = padKey; spikeWaitT = t0; }
        var waited = t0 - spikeWaitT;
        if (!committed && !info.inside && waited > 5) {
          // Max wait ~2 spike cycles. Take the next down window with a
          // tighter margin, or reverse off this pad.
          if (!spikesUp() && safe >= 0.35) {
            committed = true; commitExit = info.cluster.exit;
            SB.state = "force-cross";
            spikeWaitT = t0;
          } else if (waited > 8) {
            loopDir = -(loopDir || 1);
            reverseUntil = t0 + 2.5;
            SB.state = "reverse";
            spikeWaitKey = "";
            committed = false;
          }
        }
      } else {
        spikeWaitKey = "";
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

    // v26/v27: hunt the axe along the ring when holding red (or already frozen).
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

    // v28: leave a spike pad when the pulse is up, or a 1.8 knock from the
    // pad would leave pb. Abort standing on a 1-cell plank with a snake in 6.5.
    (function () {
      var onPad = isSpikeCell(p.x, p.z);
      var c0 = cellOf(p.x, p.z);
      var narrow = false, horiz, vert;
      horiz = isPb(c0[0] + 3, c0[1]) || isPb(c0[0] - 3, c0[1]);
      vert = isPb(c0[0], c0[1] + 3) || isPb(c0[0], c0[1] - 3);
      if (horiz && !vert) narrow = true;
      if (vert && !horiz) narrow = true;
      var knockOff = false, L, dx, dz;
      if (onPad) {
        dx = p.x - c0[0]; dz = p.z - c0[1]; L = Math.hypot(dx, dz) || 1;
        knockOff = !isPb(p.x + (dx / L) * 1.8, p.z + (dz / L) * 1.8);
      }
      function dirTo(tx0, tz0) {
        var k = emptyKeys ? emptyKeys() : { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
        if (Math.abs(tx0 - p.x) >= Math.abs(tz0 - p.z)) {
          if (tx0 - p.x > 0.08) k.ArrowRight = 1; else if (tx0 - p.x < -0.08) k.ArrowLeft = 1;
        } else {
          if (tz0 - p.z > 0.08) k.ArrowDown = 1; else if (tz0 - p.z < -0.08) k.ArrowUp = 1;
        }
        return k;
      }
      function nextSafe() {
        var us = ringIndexNear(p.x, p.z), n = RING.length, dir = loopDir || 1, s, i, c;
        for (s = 0; s < [2, 3, 1, 4, 5].length; s++) {
          i = ((us + dir * [2, 3, 1, 4, 5][s]) % n + n) % n;
          c = ringCell(i);
          if (Math.abs(c[0] - c0[0]) > 0.21 && Math.abs(c[1] - c0[1]) > 0.21) continue;
          if (isSpikeCell(c[0], c[1])) continue;
          return c;
        }
        return ringCell(us);
      }
      if (holdState === "leave-pad") { holdUntil = -1; holdDest = null; holdState = ""; }
      if (holdUntil > t0 && holdDest) {
        var dH = Math.hypot(p.x - holdDest[0], p.z - holdDest[1]);
        if (dH > 0.45) {
          tx = holdDest[0]; tz = holdDest[1]; seekDirect = true; SB.state = holdState || "abort-plank";
        } else if (holdState === "abort-plank") {
          // Arrived, but a melee may still be on us — pick the next rail cell
          // instead of standing still (v41 live death at (23.51,-17.35)).
          holdUntil = -1; holdDest = null; holdState = "";
        } else {
          holdUntil = -1; holdDest = null;
        }
      }
      if (!(holdUntil > t0)) {
        var meleeClose = false, si2, spos3, sname;
        for (si2 = 0; si2 < enemies.length; si2++) {
          spos3 = enemies[si2].mesh && enemies[si2].mesh.position;
          sname = enemyName(enemies[si2]);
          if (spos3 && (sname === "snake" || sname === "grunt" || sname === "axe" || sname === "shield" || sname === "boss" || sname === "boss2") &&
              Math.hypot(spos3.x - p.x, spos3.z - p.z) < 6.5) meleeClose = true;
        }
        var standing = /^(lure-spike|hold-spike|stage-spike|time-spike|yield|freeze-melee|abort-plank)$/.test(SB.state || "");
        var dT = Math.hypot(p.x - tx, p.z - tz);
        if (narrow && meleeClose && (standing || dT < 1.0) && !isFrozen() && onOuterLine(p.x, p.z)) {
          var destS = nextSafe();
          var goRail = ringAlongRail(p.x, p.z, loopDir || 1) || ringAlong(p.x, p.z, loopDir || 1);
          if (goRail && Math.hypot(goRail.x - p.x, goRail.z - p.z) > 1.2) destS = [goRail.x, goRail.z];
          var trialS = dirTo(destS[0], destS[1]);
          var destHot = (spikesUp() || safeTimeRemaining() < CROSS) && nearestSpikePad(destS[0], destS[1]) < SPIKE_HIT_R;
          if (!destHot && !wouldFallKeys(p.x, p.z, trialS, 0.5) && !wouldFallDt(p.x, p.z, trialS, recentStepDt(), 0.5)) {
            tx = destS[0]; tz = destS[1]; seekDirect = true; SB.state = "abort-plank";
            holdUntil = t0 + 1.2; holdState = "abort-plank"; holdDest = destS; holdDir = loopDir || 1;
          }
        }
      }
    })();

    // v27: abort standing lure when a snake is in 6.5 (unless a lone leftover);
    // stay on the outer ring (no off-axis / inner cuts); finish leftover trash
    // with red / a 3-wide jab; centre-hug 1-cell planks and recover from a
    // knock onto a 3-wide outer column.
    (function () {
      var ei, pos, name, d, lite = [], sn = null, leftover, prey, trashPair, dest, trial, frozen, c0, wide;
      var us, them, nR, dir0, fwd, dirA, curCell, targetOffAxis, kind, threatNear, off;
      for (ei = 0; ei < enemies.length; ei++) {
        pos = enemies[ei].mesh && enemies[ei].mesh.position;
        if (!pos) continue;
        name = enemyName(enemies[ei]);
        d = Math.hypot(pos.x - p.x, pos.z - p.z);
        lite.push({ type: name, x: pos.x, z: pos.z, d: d });
        if (name === "snake" && d < 6.5 && !sn) sn = { x: pos.x, z: pos.z, d: d };
      }
      leftover = lite.length === 1 && lite[0].type !== "axe" && lite[0].type !== "boss" && lite[0].type !== "boss2";
      prey = leftover ? lite[0] : null;
      trashPair = !leftover && lite.length === 2;
      if (trashPair) {
        for (ei = 0; ei < lite.length; ei++) {
          if (lite[ei].type === "axe" || lite[ei].type === "boss" || lite[ei].type === "boss2") { trashPair = false; break; }
        }
      }
      if (SB.state === "lure-spike" && sn && !leftover) {
        d = Math.hypot(p.x - tx, p.z - tz);
        if (d < 0.8) {
          dest = ringAlong(p.x, p.z, loopDir || 1);
          trial = axisKeysTo(p.x, p.z, dest.x, dest.z);
          if (!wouldFallKeys(p.x, p.z, trial, 0.45)) {
            tx = dest.x; tz = dest.z; seekDirect = true; SB.state = "abort-lure";
          }
        }
      }
      frozen = isFrozen();
      if (prey) {
        if (frozen && prey.d < 3.5) pulseAttack(t0);
        if (frozen) {
          us = ringIndexNear(p.x, p.z);
          them = ringIndexNear(prey.x, prey.z);
          nR = RING.length;
          dir0 = loopDir || 1;
          fwd = ((them - us) * dir0 % nR + nR) % nR;
          dirA = fwd <= nR - fwd ? dir0 : -dir0;
          dest = ringAlong(p.x, p.z, dirA);
          trial = axisKeysTo(p.x, p.z, dest.x, dest.z);
          if (!wouldFallKeys(p.x, p.z, trial, 0.5) && onOuterRing(dest.x, dest.z)) {
            tx = dest.x; tz = dest.z; seekDirect = true; SB.state = "leftover-melee";
          }
        } else {
          c0 = cellOf(p.x, p.z);
          wide = !isNarrowPlank(c0[0], c0[1]);
          if (wide && prey.d < 2.8) pulseAttack(t0);
        }
      }
      if (trashPair) {
        lite.sort(function (a, b) { return a.d - b.d; });
        if (frozen && lite[0].d < 3.5) pulseAttack(t0);
        else {
          c0 = cellOf(p.x, p.z);
          if (!isNarrowPlank(c0[0], c0[1]) && lite[0].d < 2.8) pulseAttack(t0);
        }
      }
      curCell = cellOf(p.x, p.z);
      targetOffAxis = !sharesAxisPts([p.x, p.z], [tx, tz]) && !sharesAxisPts(curCell, [tx, tz]);
      if (!onOuterRing(tx, tz) || targetOffAxis) {
        dest = ringAlong(p.x, p.z, loopDir || 1);
        trial = axisKeysTo(p.x, p.z, dest.x, dest.z);
        if (!wouldFallKeys(p.x, p.z, trial, 0.45)) {
          tx = dest.x; tz = dest.z; seekDirect = true; SB.state = "stay-ring";
        }
      }
      SB._v27lite = lite;
    })();

    lastSegA = seekDirect ? [p.x, p.z] : (onRing ? ringCell(SB.wi - loopDir) : (routeI > 0 && route[routeI - 1] ? route[routeI - 1] : [p.x, p.z]));
    lastSegB = [tx, tz];

    var followKeys = followCentreline(p.x, p.z, lastSegA[0], lastSegA[1], tx, tz);
    if (seekDirect) {
      if (Math.abs(tx - p.x) >= Math.abs(tz - p.z)) { followKeys.ArrowUp = 0; followKeys.ArrowDown = 0; }
      else { followKeys.ArrowLeft = 0; followKeys.ArrowRight = 0; }
    }
    (function () {
      var c = cellOf(p.x, p.z), kind = isNarrowPlank(c[0], c[1]), threatNear = false, off, i, lite = SB._v27lite || [], k2;
      if (kind) {
        off = kind === "v" ? Math.abs(p.x - c[0]) : Math.abs(p.z - c[1]);
        for (i = 0; i < lite.length; i++) {
          if (lite[i].d < 6) { threatNear = true; break; }
        }
        if (threatNear || off > 0.35) {
          k2 = clampPlankKeys(p.x, p.z, followKeys);
          if (!wouldFallKeys(p.x, p.z, k2, 0.4)) followKeys = k2;
        }
      }
      if (Math.abs(p.x) > 25.15 || Math.abs(p.z) > 25.15) {
        k2 = clampToRingKeys(p.x, p.z, followKeys);
        if (!wouldFallKeys(p.x, p.z, k2, 0.4)) followKeys = k2;
      }
    })();
    followKeys = filterLagKeys(p.x, p.z, followKeys);
    (function () {
      var moved, keysOn, dest, trial, us, n, dir, s, i, c, np, nextD, pred, look, away, CROSS = 0.70;
      var fi, f, pos, fd, bestF = 99, threat = null, nx, nz, emptyK, nowIn, nextIn, unsafe;
      function predicted(px, pz, keys, t) {
        nx = px; nz = pz;
        if (keys.ArrowRight) nx += 8 * t; else if (keys.ArrowLeft) nx -= 8 * t;
        if (keys.ArrowDown) nz += 8 * t; else if (keys.ArrowUp) nz -= 8 * t;
        return [nx, nz];
      }
      function keysAwayFromPad(px, pz) {
        var now = nearestSpikePad(px, pz), dirs = [-(loopDir || 1), loopDir || 1], di, ddir, pr, tr;
        us = ringIndexNear(px, pz); n = RING.length;
        for (di = 0; di < 2; di++) {
          ddir = dirs[di];
          for (s = 0; s < 5; s++) {
            i = ((us + ddir * [1, 2, 3, 4, 5][s]) % n + n) % n;
            c = ringCell(i);
            if (!isPb(c[0], c[1])) continue;
            tr = axisKeysTo(px, pz, c[0], c[1]);
            pr = predicted(px, pz, tr, Math.max(0.15, recentStepDt()));
            if (!isPb(pr[0], pr[1]) || !onOuterLine(pr[0], pr[1])) continue;
            if (wouldFallKeys(px, pz, tr, 0.4) || wouldFallDt(px, pz, tr, recentStepDt(), 0.4)) continue;
            if (nearestSpikePad(pr[0], pr[1]) > now + 0.05) return { keys: tr, dest: c };
          }
        }
        return null;
      }
      emptyK = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
      moved = lastMoveX == null || Math.hypot(p.x - lastMoveX, p.z - lastMoveZ) > 0.12;
      if (moved) { lastMoveT = t0; lastMoveX = p.x; lastMoveZ = p.z; }
      keysOn = !!(followKeys.ArrowUp || followKeys.ArrowDown || followKeys.ArrowLeft || followKeys.ArrowRight);
      if (!moved && !keysOn && t0 - lastMoveT > 3) {
        dest = ringAlong(p.x, p.z, loopDir || 1);
        trial = axisKeysTo(p.x, p.z, dest.x, dest.z);
        pred = predicted(p.x, p.z, trial, 0.15);
        if (isPb(pred[0], pred[1]) && onOuterLine(pred[0], pred[1]) && nearestSpikePad(pred[0], pred[1]) >= SPIKE_HIT_R &&
            !wouldFallKeys(p.x, p.z, trial, 0.4) && !wouldFallDt(p.x, p.z, trial, recentStepDt(), 0.4)) {
          followKeys = trial; tx = dest.x; tz = dest.z; SB.state = "watchdog";
          lastMoveT = t0; noodleSince = 0; holdUntil = -1;
        }
      }
      // v40 C2: do not bait toward the orb (C1 walked into snakes/spikes).
      // Default: v34 continue-loopDir dodge at 4.5. If waiting on a pad, start
      // moving. At <=3, sidestep the safer side only when it clearly beats loopDir.
      (function v40Orb() {
        var fi, f, pos, fd, best = null, goA, goB, goL, trial, pred, unsafe;
        var vx, vz, vL, score, scoreL, scoreA, scoreB, pick, waiting, onR;
        function vel(f) {
          if (f && f.velocity && f.velocity.x != null) return { x: f.velocity.x, z: f.velocity.z };
          return { x: 0, z: 0 };
        }
        function missOf(go, orb) {
          var L, nx, nz, vL, wx, wz, t, cx, cz, ei, epos, ed, ovx, ovz;
          if (!go) return -1e9;
          L = Math.hypot(go.x - p.x, go.z - p.z) || 1;
          nx = p.x + (go.x - p.x) / L * 2.4; nz = p.z + (go.z - p.z) / L * 2.4;
          trial = axisKeysTo(p.x, p.z, go.x, go.z);
          if (!isPb(nx, nz) || !onOuterLine(nx, nz) || wouldFallKeys(p.x, p.z, trial, 0.4)) return -1e9;
          if (nearestSpikePad(nx, nz) < SPIKE_HIT_R && (spikesUp() || safeTimeRemaining() < 0.7)) return -1e9;
          for (ei = 0; ei < (enemies || []).length; ei++) {
            epos = enemies[ei].mesh && enemies[ei].mesh.position;
            if (!epos) continue;
            ed = Math.hypot(epos.x - nx, epos.z - nz);
            if ((enemyName(enemies[ei]) === "axe" || enemyName(enemies[ei]) === "boss" || enemyName(enemies[ei]) === "boss2") && ed < 3.5) return -1e9;
          }
          ovx = orb.vx; ovz = orb.vz; vL = Math.hypot(ovx, ovz);
          if (vL < 0.35) {
            var ox = p.x - orb.x, oz = p.z - orb.z, oL = Math.hypot(ox, oz) || 1;
            return Math.abs((nx - p.x) * (-oz / oL) + (nz - p.z) * (ox / oL));
          }
          wx = nx - orb.x; wz = nz - orb.z;
          t = (wx * ovx + wz * ovz) / (vL * vL);
          cx = orb.x + ovx * Math.max(0, t); cz = orb.z + ovz * Math.max(0, t);
          return Math.hypot(nx - cx, nz - cz);
        }
        if (k && k.Vc && k.Vc.j) {
          for (fi = 0; fi < (k.Vc.active || 0); fi++) {
            f = k.Vc.j[fi];
            pos = (f && (f.wb || f.position)) || null;
            if (!pos) continue;
            fd = Math.hypot(pos.x - p.x, pos.z - p.z);
            if (fd < 10 && (!best || fd < best.d)) {
              var ov = vel(f);
              best = { x: pos.x, z: pos.z, d: fd, vx: ov.x, vz: ov.z };
            }
          }
        }
        waiting = /spike|wait-pad|wait-round|stage|lure|hold/.test(SB.state || "");
        onR = onOuterLine(p.x, p.z);
        if (best && (onR || waiting)) {
          goL = ringAlongRail(p.x, p.z, loopDir || 1);
          goA = ringAlongRail(p.x, p.z, 1);
          goB = ringAlongRail(p.x, p.z, -1);
          if (best.d <= 3) {
            scoreL = missOf(goL, best);
            scoreA = missOf(goA, best);
            scoreB = missOf(goB, best);
            pick = goL;
            score = scoreL;
            if (scoreA > score + 0.8) { pick = goA; score = scoreA; }
            if (scoreB > score + 0.8) { pick = goB; score = scoreB; }
            if (pick && score > 0.4) {
              trial = axisKeysTo(p.x, p.z, pick.x, pick.z);
              if (!wouldFallKeys(p.x, p.z, trial, 0.4)) {
                followKeys = trial; tx = pick.x; tz = pick.z; seekDirect = true;
                SB.state = "sidestep-orb";
              }
            }
          } else if (best.d < 4.5 && onR && goL) {
            trial = axisKeysTo(p.x, p.z, goL.x, goL.z);
            pred = predicted(p.x, p.z, trial, 0.15);
            unsafe = spikesUp() || safeTimeRemaining() < CROSS;
            if (isPb(pred[0], pred[1]) && onOuterLine(pred[0], pred[1]) && !wouldFallKeys(p.x, p.z, trial, 0.4) &&
                !(unsafe && nearestSpikePad(pred[0], pred[1]) < SPIKE_HIT_R)) {
              followKeys = trial; SB.state = "dodge-orb";
            }
          } else if (waiting && best.d <= 8 && goL) {
            // Leave a waiting pad so the orb does not home onto a stand-still.
            trial = axisKeysTo(p.x, p.z, goL.x, goL.z);
            if (!wouldFallKeys(p.x, p.z, trial, 0.4)) {
              followKeys = trial; tx = goL.x; tz = goL.z;
              SB.state = "bait-orb";
            }
          }
        }
      })();
      // v41: never stand in yield — continue along the ring with axis-only keys.
      if (SB.state === "yield") {
        var goY = ringAlongRail(p.x, p.z, loopDir || 1) || ringAlongRail(p.x, p.z, -(loopDir || 1));
        if (goY) {
          var yKeys = axisKeysTo(p.x, p.z, goY.x, goY.z);
          var yPred = predicted(p.x, p.z, yKeys, 0.2);
          if (isPb(yPred[0], yPred[1]) && onOuterLine(yPred[0], yPred[1]) &&
              !wouldFallKeys(p.x, p.z, yKeys, 0.3) && !wouldFallDt(p.x, p.z, yKeys, recentStepDt(), 0.3)) {
            followKeys = yKeys; tx = goY.x; tz = goY.z; SB.state = "kite";
            seekDirect = true; holdUntil = -1; holdYieldUntil = -1;
          }
        }
      }
      // Conservative 2.5-disk gate. Do not ENTER when up or when the down
      // window is shorter than a crossing. If already inside during a still-safe
      // down window, finish the crossing instead of aborting mid-way.
      look = Math.max(0.15, recentStepDt());
      pred = predicted(p.x, p.z, followKeys, look);
      np = nearestSpikePad(p.x, p.z);
      nextD = nearestSpikePad(pred[0], pred[1]);
      nowIn = np < SPIKE_HIT_R;
      nextIn = nextD < SPIKE_HIT_R;
      unsafe = spikesUp();
      var safeNow = safeTimeRemaining();
      function retreatPad() {
        away = keysAwayFromPad(p.x, p.z);
        if (away) {
          followKeys = away.keys; tx = away.dest[0]; tz = away.dest[1]; SB.state = "back-pad";
        } else {
          followKeys = emptyK; SB.state = "wait-pad";
        }
      }
      if (unsafe) {
        if (nowIn) retreatPad();
        else if (nextIn) { followKeys = emptyK; SB.state = "wait-pad"; }
      } else if (!nowIn && nextIn && safeNow < CROSS) {
        followKeys = emptyK; SB.state = "wait-pad";
      } else if (nowIn) {
        var goingDeeper = nextD < np - 0.02;
        var exitEta2 = goingDeeper ? (np + SPIKE_HIT_R) / 8 : Math.max(0, (SPIKE_HIT_R - np) / 8);
        if (safeNow < exitEta2 + 0.12) retreatPad();
      }
    })();

    // Wave stall: no kill and no wave change for >60s → leave the pad dance and hunt leftovers.
    if (String(SB.wave) !== String(stallWave) || (SB.runKills || 0) !== stallKills) {
      stallWave = SB.wave; stallKills = SB.runKills || 0; stallSince = t0;
    }
    if (stallSince && t0 - stallSince > 60 && enemies && enemies.length) {
      var hi, hbest = null, hd, hpos, hring;
      for (hi = 0; hi < enemies.length; hi++) {
        hpos = enemies[hi].mesh && enemies[hi].mesh.position;
        if (!hpos) continue;
        hd = Math.hypot(hpos.x - p.x, hpos.z - p.z);
        if (!hbest || hd < hbest.d) hbest = { x: hpos.x, z: hpos.z, d: hd };
      }
      if (hbest) {
        loopDir = -(loopDir || 1);
        reverseUntil = t0 + 3;
        stallSince = t0 - 20;
        committed = false;
        spikeWaitKey = "";
        SB.state = "hunt-stall";
        var leave = ringAlong(p.x, p.z, loopDir);
        if (leave) {
          tx = leave.x; tz = leave.z;
          followKeys = axisKeysTo(p.x, p.z, tx, tz);
          if (wouldFallKeys(p.x, p.z, followKeys, 0.3)) followKeys = emptyKeys();
        }
      }
    }

        followKeys = filterLagKeys(p.x, p.z, followKeys);
    followKeys = v32PostKeys(p.x, p.z, tx, tz, followKeys, t0, enemies);
    followKeys = v41CornerGuard(p.x, p.z, followKeys, t0);
    (function v42NoStandMelee() {
      var ei, epos, en, close = false, go, trial, nkeys;
      nkeys = followKeys && (followKeys.ArrowUp || followKeys.ArrowDown || followKeys.ArrowLeft || followKeys.ArrowRight);
      for (ei = 0; ei < (enemies || []).length; ei++) {
        epos = enemies[ei].mesh && enemies[ei].mesh.position;
        en = enemyName(enemies[ei]);
        if (epos && (en === "grunt" || en === "snake" || en === "axe" || en === "shield" || en === "boss" || en === "boss2") &&
            Math.hypot(epos.x - p.x, epos.z - p.z) < 6.5) { close = true; break; }
      }
      if ((SB.state === "abort-plank" || (close && !nkeys)) && close) {
        var waitingPad = /^(hold-spike|wait-pad|time-spike|stage-spike|back-pad)$/.test(SB.state || "");
        var unsafe = spikesUp() || safeTimeRemaining() < CROSS;
        if (!(waitingPad && unsafe && nearestSpikePad(p.x, p.z) < SPIKE_HIT_R)) {
          go = ringAlongRail(p.x, p.z, loopDir || 1) || ringAlong(p.x, p.z, loopDir || 1) ||
               ringAlongRail(p.x, p.z, -(loopDir || 1)) || ringAlong(p.x, p.z, -(loopDir || 1));
          if (go && !(unsafe && nearestSpikePad(go.x, go.z) < SPIKE_HIT_R)) {
            trial = axisKeysTo(p.x, p.z, go.x, go.z);
            if (!wouldFallKeys(p.x, p.z, trial, 0.3) && !wouldFallDt(p.x, p.z, trial, recentStepDt(), 0.3)) {
              followKeys = trial; tx = go.x; tz = go.z;
              if (SB.state !== "abort-plank") SB.state = "kite";
              seekDirect = true;
            }
          }
        }
      }
    })();
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
      noteFrameDt(t0);
      lightenRenderer();
      if (!checkedMap && k && k.X) runtimeSelfCheck();
      syncHud();
      noteWave(t0);
      var hpNow = (k && k.i && typeof k.i.Y === "number") ? k.i.Y : SB.hp;
      // Every HP decrease, every frame, independent of deathLogged.
      if (typeof lastHp === "number" && typeof hpNow === "number" && hpNow < lastHp - 0.01 && lastHp > 0) {
        recordHpLoss(lastHp, hpNow, SB.px, SB.pz, (k && k.ba) ? liveEnemies() : []);
      }
      var deadNow = isGameOver();
      if (everAlive && deadNow) logDeath(classifyDeath(SB.px, SB.pz));
      var p = playerPos();
      var running = inRound();
      var atSpawn = p && Math.hypot(p.x, p.z) < 6 && (p.y == null || p.y > -1);
      if (running && atSpawn && (SB._alive !== true || (lastHp <= 0 && hpNow > 0) || (SB.state === "falling" && k.i && k.i.Ta === false))) {
        onNewRound(t0, p);
        SB._alive = true;
      } else if (running && SB._alive !== true && p && !atSpawn) {
        // Mid-ring resume after a *real* death/restart, not an i-frame blink.
        deathLogged = false; everAlive = true; runDumped = false;
        stallSince = t0; stallKills = SB.runKills || 0; stallWave = SB.wave;
        onRing = true;
        SB.wi = ringIndexNear(p.x, p.z);
        SB.state = "loop";
        SB._alive = true;
      } else if (running && SB.state === "falling" && k.i && k.i.Ta === false && !atSpawn) {
        SB.state = onRing ? "loop" : "start";
      }
      if (running) SB._alive = true;
      lastHp = hpNow;
      if (deadNow) {
        if (everAlive) logDeath(classifyDeath(SB.px, SB.pz));
        endRunCapture();
        releaseAllKeys();
        if (SB.state !== "restart" && SB.state !== "falling") SB.state = "wait-round";
        SB._alive = false;
        prevPos = null;
        return;
      }
      if (!running) {
        releaseAllKeys();
        if (SB.state !== "restart" && SB.state !== "falling" && SB.state !== "wait-spawn") SB.state = "wait-round";
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
        if (nowT - lastPersistT > 2) { lastPersistT = nowT; persistLog(); }
      } catch (e) {}
    }, 250);
    try { TOP.__SB_TIMERS = { raf: 0, ui: uiTimer, ov: overlayTimer }; } catch (e) {}
    loop();
  }

  boot();
})();
