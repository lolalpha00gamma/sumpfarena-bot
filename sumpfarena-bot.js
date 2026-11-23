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

  var KEYS = { ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, " ": 32 };
  var ARROWS = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
  var SPIKE_PERIOD = 2.51;
  var TARGET = 6.0;
  var GUARD = 6.3;
  var CENTER = 3;
  var WP = [
    [5.5, 5.5],
    [5.5, 0],
    [5.5, -5.5],
    [0, -5.5],
    [-5.5, -5.5],
    [-5.5, 0],
    [-5.5, 5.5],
    [0, 5.5]
  ];
  var LS_DEATHS = "__SB_deaths_v17";

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
    ver: 17,
    runs: prevRuns,
    deaths: loadDeaths(),
    err: "",
    state: "boot",
    n: 0,
    wi: 0,
    wt: 0,
    hp: 1,
    wave: "?",
    score: "0",
    rs: 0,
    spikeUpAt: 0,
    spikePeriod: SPIKE_PERIOD,
    spikesUp: false,
    ok: true,
    vn: 0,
    attack: false,
    fireballs: 0,
    bigSnakes: 0,
    enemies: 0,
    nearest: 99,
    px: 0,
    pz: 0,
    py: 0,
    kills: 0,
    runKills: 0,
    shoveUntil: 0,
    lastTrap: null,
    stuck: 0,
    pk: [],
    stop: stop
  };
  TOP.__SB = SB;

  var gw = null;
  var T = null;
  var down = {};
  var scenes = null;
  var player = null;
  var cam = null;
  var spikes = [];
  var lastDir = [1, 0];
  var prevPos = null;
  var vel = [0, 0];
  var moverPrev = {};
  var normalEnemySize = 0;
  var overlay = null;
  var rafId = 0;
  var uiTimer = 0;
  var overlayTimer = 0;
  var stopped = false;
  var hooked = false;
  var lastHud = "";
  var lastHp = 0;
  var spacePulseUntil = 0;
  var lastAttackAt = -9;
  var knownEnemies = [];
  var stuckSince = 0;
  var lastMovedAt = 0;
  var lastWatchdog = 0;
  var lastKeyRefresh = 0;
  var cycleIdx = 0;
  var blockedDir = 0;
  var lastFocus = 0;
  var intended = [1, 0];
  var lastScoreNum = 0;
  var trail = [];
  var deathLogged = false;
  var lastAliveAt = 0;
  var lastAlivePos = null;

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
    if (TOP.THREE && TOP.document && TOP.document.querySelector("canvas")) return TOP;
    var frames = TOP.document.querySelectorAll("iframe");
    var i, f, cw;
    for (i = 0; i < frames.length; i++) {
      f = frames[i];
      if (f.src && /games\/871\//.test(f.src)) {
        try { if (f.contentWindow && f.contentWindow.document) return f.contentWindow; } catch (e) {}
      }
    }
    for (i = 0; i < frames.length; i++) {
      try {
        cw = frames[i].contentWindow;
        if (cw && cw.THREE && cw.document && cw.document.querySelector("canvas")) return cw;
      } catch (e) {}
    }
    return null;
  }

  function hookThree() {
    if (!gw || !gw.THREE || hooked) return;
    T = gw.THREE;
    if (!gw.__SS) gw.__SS = new (gw.Set || Set)();
    scenes = gw.__SS;
    if (!gw.__SB_HOOKED) {
      var proto = T.Scene && T.Scene.prototype;
      if (proto && proto.updateMatrixWorld) {
        var orig = proto.updateMatrixWorld;
        proto.updateMatrixWorld = function (force) {
          try { scenes.add(this); } catch (e) {}
          return orig.call(this, force);
        };
        gw.__SB_HOOKED = true;
      }
    }
    hooked = true;
  }

  function mainScene() {
    if (!scenes) return null;
    var best = null, max = 100;
    scenes.forEach(function (s) {
      if (s && s.children && s.children.length > max) {
        max = s.children.length;
        best = s;
      }
    });
    return best;
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
      key: name,
      code: name === " " ? "Space" : name,
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
    if (!gw) return;
    if (!force && !!down[name] === !!isDown) return;
    down[name] = !!isDown;
    dispatchKey(name, isDown);
  }

  function releaseAllKeys(force) {
    Object.keys(KEYS).forEach(function (k) { key(k, false, force); });
    down = {};
  }

  function project(x, z) {
    if (!cam || !T) return [0, 0];
    var v = new T.Vector3(x, 0, z).project(cam);
    return [v.x, v.y];
  }

  function holdDir(vx, vz, t0, p, forceTwo) {
    var len = Math.hypot(vx, vz);
    if (len < 0.05) {
      vx = lastDir[0];
      vz = lastDir[1];
    } else {
      lastDir[0] = vx / len;
      lastDir[1] = vz / len;
      vx = lastDir[0];
      vz = lastDir[1];
    }
    intended[0] = vx;
    intended[1] = vz;

    var want = { ArrowRight: false, ArrowLeft: false, ArrowUp: false, ArrowDown: false };
    if (p && cam && T) {
      var a = project(p.x + 1, p.z);
      var b = project(p.x, p.z + 1);
      var c = project(p.x, p.z);
      var s0 = vx * (a[0] - c[0]) + vz * (b[0] - c[0]);
      var s1 = vx * (a[1] - c[1]) + vz * (b[1] - c[1]);
      var m = Math.max(Math.abs(s0), Math.abs(s1)) || 1;
      var thr = forceTwo ? 0.15 : 0.38;
      want.ArrowRight = s0 > thr * m;
      want.ArrowLeft = s0 < -thr * m;
      want.ArrowUp = s1 > thr * m;
      want.ArrowDown = s1 < -thr * m;
      var held = 0, k;
      for (k in want) if (want[k]) held++;
      if (held === 0 || (forceTwo && held < 2)) {
        var scores = [
          ["ArrowRight", s0],
          ["ArrowLeft", -s0],
          ["ArrowUp", s1],
          ["ArrowDown", -s1]
        ];
        scores.sort(function (x, y) { return y[1] - x[1]; });
        want[scores[0][0]] = true;
        if (forceTwo || held === 0) want[scores[1][0]] = want[scores[1][0]] || forceTwo || held === 0;
        if (held === 0) want[scores[0][0]] = true;
      } else if (held > 2) {
        var sc2 = [
          ["ArrowRight", s0],
          ["ArrowLeft", -s0],
          ["ArrowUp", s1],
          ["ArrowDown", -s1]
        ];
        sc2.sort(function (x, y) { return y[1] - x[1]; });
        want = { ArrowRight: false, ArrowLeft: false, ArrowUp: false, ArrowDown: false };
        want[sc2[0][0]] = true;
        want[sc2[1][0]] = true;
      }
    } else {
      want.ArrowRight = vx > 0.38;
      want.ArrowLeft = vx < -0.38;
      want.ArrowUp = vz < -0.38;
      want.ArrowDown = vz > 0.38;
      if (!want.ArrowRight && !want.ArrowLeft && !want.ArrowUp && !want.ArrowDown) want.ArrowRight = true;
    }

    var k;
    for (k in want) if (want[k]) key(k, true);
    for (k in want) if (!want[k]) key(k, false);

    if (t0 < spacePulseUntil) key(" ", true, t0 - lastAttackAt < 0.05);
    else key(" ", false);
    SB.attack = t0 < spacePulseUntil;
  }

  function pulseSpace(t0) {
    if (t0 - lastAttackAt < 0.35) return;
    lastAttackAt = t0;
    spacePulseUntil = t0 + 0.12;
    key(" ", true, true);
    SB.attack = true;
  }

  function inCenter(x, z) {
    return Math.abs(x) < CENTER && Math.abs(z) < CENTER;
  }

  function beyondGuard(x, z) {
    return Math.abs(x) > GUARD || Math.abs(z) > GUARD;
  }

  function inBlockedZone(x, z) {
    var i, d, s;
    for (i = 0; i < SB.deaths.length; i++) {
      s = SB.deaths[i];
      if (s && typeof s.x === "number") {
        d = Math.hypot(x - s.x, z - s.z);
        if (d < 1.0) return s;
      }
    }
    return null;
  }

  function allowedPos(x, z) {
    if (Math.abs(x) > TARGET || Math.abs(z) > TARGET) return false;
    if (inBlockedZone(x, z)) return false;
    return true;
  }

  function clampTarget(x, z) {
    var ax = Math.max(-TARGET, Math.min(TARGET, x));
    var az = Math.max(-TARGET, Math.min(TARGET, z));
    if (!inBlockedZone(ax, az)) return [ax, az];
    var best = [0, 0], bestD = 1e9, i, a, nx, nz, d;
    for (i = 0; i < 16; i++) {
      a = (i / 16) * Math.PI * 2;
      nx = ax + Math.cos(a) * 1.15;
      nz = az + Math.sin(a) * 1.15;
      nx = Math.max(-TARGET, Math.min(TARGET, nx));
      nz = Math.max(-TARGET, Math.min(TARGET, nz));
      if (inBlockedZone(nx, nz)) continue;
      d = Math.hypot(nx - x, nz - z);
      if (d < bestD) { bestD = d; best = [nx, nz]; }
    }
    return best;
  }

  function clampStep(px, pz, vx, vz) {
    var len = Math.hypot(vx, vz) || 1;
    vx /= len;
    vz /= len;
    var step = 0.85;
    var nx = px + vx * step, nz = pz + vz * step;
    if (allowedPos(nx, nz) && !(inCenter(nx, nz) && !inCenter(px, pz))) return [vx, vz];
    var inward = (function () {
      var L = Math.hypot(-px, -pz) || 1;
      return [-px / L, -pz / L];
    })();
    if (allowedPos(px + inward[0] * step, pz + inward[1] * step)) return inward;
    var i, a, c, s, rx, rz;
    for (i = 1; i <= 14; i++) {
      a = (i % 2 ? 1 : -1) * i * (Math.PI / 16);
      c = Math.cos(a);
      s = Math.sin(a);
      rx = vx * c - vz * s;
      rz = vx * s + vz * c;
      nx = px + rx * step;
      nz = pz + rz * step;
      if (allowedPos(nx, nz) && !inCenter(nx, nz)) return [rx, rz];
    }
    return inward;
  }

  function nearestLoopWP(px, pz) {
    var best = 1, bestD = 1e9, i, d, t;
    for (i = 0; i < WP.length; i++) {
      t = clampTarget(WP[i][0], WP[i][1]);
      d = Math.hypot(t[0] - px, t[1] - pz);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function recordTrail(t0, p) {
    trail.push({
      t: t0,
      x: +p.x,
      z: +p.z,
      y: +p.y,
      vx: vel[0],
      vz: vel[1],
      dx: lastDir[0],
      dz: lastDir[1]
    });
    while (trail.length && t0 - trail[0].t > 2.05) trail.shift();
    lastAliveAt = t0;
    lastAlivePos = { t: t0, x: +p.x, z: +p.z, y: +p.y, dx: lastDir[0], dz: lastDir[1], vx: vel[0], vz: vel[1] };
  }

  function logDeath(reason) {
    if (deathLogged) return;
    deathLogged = true;
    var src = lastAlivePos || (trail.length ? trail[trail.length - 1] : null);
    if (!src) return;
    var rec = {
      x: +src.x.toFixed(2),
      z: +src.z.toFixed(2),
      y: +(+src.y || 0).toFixed(2),
      dx: +(src.dx || 0).toFixed(2),
      dz: +(src.dz || 0).toFixed(2),
      vx: +(src.vx || 0).toFixed(2),
      vz: +(src.vz || 0).toFixed(2),
      reason: reason || "die",
      score: SB.score,
      wave: SB.wave,
      t: Date.now(),
      trail: trail.slice(-8).map(function (p) {
        return [+p.x.toFixed(1), +p.z.toFixed(1), +p.y.toFixed(2)];
      })
    };
    SB.deaths.push(rec);
    saveDeaths(SB.deaths);
  }

  function ensureOverlay() {
    var doc = TOP.document;
    if (!doc || !doc.body) return;
    var old = doc.getElementById("__sb_overlay");
    if (old && old !== overlay) old.parentNode.removeChild(old);
    if (overlay && overlay.parentNode) return;
    overlay = doc.createElement("div");
    overlay.id = "__sb_overlay";
    overlay.style.cssText = "position:fixed;top:8px;right:8px;z-index:2147483647;min-width:230px;max-width:340px;max-height:52vh;overflow:auto;background:rgba(8,12,10,.88);color:#d6ffd0;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;padding:8px 10px;border:1px solid #3a7;border-radius:6px;pointer-events:none;white-space:pre-wrap;";
    doc.body.appendChild(overlay);
  }

  function renderOverlay() {
    if (!overlay) return;
    var runs = SB.runs.slice(-8).map(function (r, i) {
      var n = SB.runs.length - Math.min(SB.runs.length, 8) + i + 1;
      var k = r.kills != null ? "  k" + r.kills : "";
      return n + ". score " + r.score + "  wave " + r.wave + k;
    }).join("\n");
    if (!runs) runs = "(keine Läufe)";
    var deaths = SB.deaths.slice(-6).map(function (d, i) {
      return (SB.deaths.length - Math.min(SB.deaths.length, 6) + i + 1) +
        ". (" + d.x + "," + d.z + ") dir " + d.dx + "," + d.dz + " " + (d.reason || "");
    }).join("\n");
    if (!deaths) deaths = "(keine)";
    var html =
      "Sumpf-Arena Bot v" + SB.ver + "\n" +
      "state  " + SB.state + (SB.stuck ? "  STUCK" : "") + "\n" +
      "pos    " + SB.px.toFixed(1) + ", " + SB.pz.toFixed(1) + "\n" +
      "spd    " + (SB.vn || 0).toFixed(2) + "   near " + SB.nearest.toFixed(1) + "\n" +
      "HP     " + Math.round(SB.hp * 100) + "%   kills " + SB.runKills + "\n" +
      "wave   " + SB.wave + "   score " + SB.score + "\n" +
      "enemy  " + SB.enemies + "  atk " + (SB.attack ? "YES" : "no") + "\n" +
      (SB.err ? "ERR    " + SB.err + "\n" : "") +
      "--- Läufe ---\n" + runs + "\n" +
      "--- Tode / Wasser ---\n" + deaths;
    if (html !== lastHud) {
      lastHud = html;
      overlay.textContent = html;
    }
  }

  function readHP() {
    var bar = Q(".healthBar");
    if (!visible(bar)) return SB.hp;
    var fill = bar.querySelector(".fill") || bar.querySelector("div, span");
    var bw = bar.getBoundingClientRect().width;
    if (fill && bw > 0) {
      var fw = fill.getBoundingClientRect().width;
      if (fw >= 0 && fw <= bw + 4) return Math.max(0, Math.min(1, fw / bw));
      if (fill.style && /([\d.]+)%/.test(fill.style.width || "")) {
        return Math.max(0, Math.min(1, parseFloat(RegExp.$1) / 100));
      }
    }
    if (bar.getAttribute("value") != null) {
      var max = parseFloat(bar.getAttribute("max") || "100") || 100;
      return Math.max(0, Math.min(1, parseFloat(bar.getAttribute("value")) / max));
    }
    return SB.hp;
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
      if (lastHp > 0.001) logDeath("nochmal");
      logRun();
      clickEl(again);
      SB.wave = "1";
      SB.score = "0";
      SB.state = "restart";
      SB.runKills = 0;
      lastScoreNum = 0;
      knownEnemies = [];
      player = null;
      SB._lp = null;
      SB.shoveUntil = 0;
      prevPos = null;
      return;
    }
    var play = Q(".entry.level_02 .play");
    if (visible(play)) clickEl(play);
    var pu = Q(".powerUpLabel");
    if (visible(pu) && SB.enemies >= 2 && SB.nearest < 4 && SB.hp >= 0.5) {
      clickEl(pu);
      SB.pk.push("PU@" + SB.score);
    }
  }

  function logRun() {
    var score = SB.score, wave = SB.wave, kills = SB.runKills;
    if (score === "?" && wave === "?") return;
    var last = SB.runs[SB.runs.length - 1];
    if (last && String(last.score) === String(score) && String(last.wave) === String(wave) && last.kills === kills) return;
    if ((score === "0" || score === 0) && (wave === "1" || wave === "?" || wave === "0") && kills === 0 && last && Date.now() - (last.t || 0) < 2000) return;
    SB.runs.push({ score: score, wave: wave, kills: kills, t: Date.now() });
  }

  function syncHud() {
    var wn = Q(".waveNumber");
    if (visible(wn)) SB.wave = (wn.textContent || "").trim();
    var sb = Q(".scoreBoard .score") || Q(".scoreBoard") || Q(".score");
    if (visible(sb)) {
      var txt = (sb.textContent || "").trim();
      var m = /(\d+)/.exec(txt);
      SB.score = m ? m[1] : txt;
    }
    SB.hp = readHP();
    var sn = parseInt(SB.score, 10);
    if (!isNaN(sn) && sn > lastScoreNum) {
      if (lastScoreNum > 0 || sn >= 5) SB.runKills += 1;
      lastScoreNum = sn;
    } else if (!isNaN(sn) && sn === 0) {
      lastScoreNum = 0;
    }
  }

  function findCamera(sc) {
    if (cam && cam.parent) return;
    cam = null;
    sc.traverse(function (o) { if (o.isCamera) cam = o; });
  }

  function meshName(e) {
    try { return String(e.name || (e.parent && e.parent.name) || "").toLowerCase(); } catch (err) { return ""; }
  }

  function looksLikePlayerName(n) {
    return /ninja|player|hero|char|lloyd|jay|kai|zane|cole|nya/.test(n);
  }

  function findPlayer(es, sc) {
    var valid = player && player.visible && player.parent === sc && SB.hp > 0;
    if (valid) {
      var mp = Math.max(Math.abs(player.position.x), Math.abs(player.position.z));
      if (mp < 16) return;
    }
    var i, e, d, nm, atOrigin = [], named = [];
    for (i = 0; i < es.length; i++) {
      e = es[i];
      if (!e.visible) continue;
      d = Math.hypot(e.position.x, e.position.z);
      if (Math.max(Math.abs(e.position.x), Math.abs(e.position.z)) > 12) continue;
      nm = meshName(e);
      if (looksLikePlayerName(nm)) named.push(e);
      if (d < 1.8) atOrigin.push(e);
    }
    var pick = named[0] || (SB.hp > 0 && atOrigin[0]) || null;
    if (!pick && valid) return;
    if (!pick && es.length) {
      var best = 2.2, cand = null;
      for (i = 0; i < es.length; i++) {
        e = es[i];
        d = Math.hypot(e.position.x, e.position.z);
        if (d < best) { best = d; cand = e; }
      }
      pick = cand;
    }
    if (pick) player = pick;
  }

  function refreshSpikes(sc) {
    if (spikes.length && spikes[0] && spikes[0].parent) return;
    spikes = [];
    sc.traverse(function (x) { if (x.name === "spikes") spikes.push(x); });
  }

  function updateSpikeTiming(t0) {
    var up = !!(spikes[0] && spikes[0].position.y > -0.6);
    if (up && !SB.spikesUp) {
      if (SB.spikeUpAt > 0) {
        var dt = t0 - SB.spikeUpAt;
        if (dt > 1.5 && dt < 4) SB.spikePeriod = SB.spikePeriod * 0.7 + dt * 0.3;
      }
      SB.spikeUpAt = t0;
    }
    SB.spikesUp = up;
  }

  function enemyExtent(e) {
    var sx = 1, sy = 1, sz = 1;
    try {
      sx = Math.abs(e.scale.x) || 1;
      sy = Math.abs(e.scale.y) || 1;
      sz = Math.abs(e.scale.z) || 1;
    } catch (err) {}
    var scale = Math.max(sx, sy, sz);
    var rad = 0;
    try {
      if (e.geometry) {
        if (!e.geometry.boundingSphere && e.geometry.computeBoundingSphere) e.geometry.computeBoundingSphere();
        if (e.geometry.boundingSphere) rad = e.geometry.boundingSphere.radius * scale;
      }
    } catch (err) {}
    return Math.max(scale, rad || 0);
  }

  function scanThreats(sc, es, t0, px, pz) {
    var fire = 0, big = 0, sizes = [], i, e, ext;
    for (i = 0; i < es.length; i++) {
      e = es[i];
      ext = enemyExtent(e);
      if (ext > 0) sizes.push(ext);
    }
    if (sizes.length) {
      sizes.sort(function (a, b) { return a - b; });
      var mid = sizes[Math.floor(sizes.length / 2)];
      if (mid > 0) normalEnemySize = normalEnemySize ? normalEnemySize * 0.8 + mid * 0.2 : mid;
    }
    var norm = normalEnemySize || (sizes[0] || 1);
    for (i = 0; i < es.length; i++) {
      if (enemyExtent(es[i]) > norm * 1.55 + 0.15) big++;
    }
    var seen = {};
    function consider(obj) {
      if (!obj || obj.isSkinnedMesh || obj.isCamera || obj.isLight) return;
      if (obj.visible === false) return;
      var pos = obj.position;
      if (!pos) return;
      var x = pos.x, z = pos.z;
      if (Math.max(Math.abs(x), Math.abs(z)) > 12) return;
      var id = obj.id;
      seen[id] = 1;
      var prev = moverPrev[id];
      if (prev) {
        var dt = t0 - prev.t;
        if (dt > 0.03 && dt < 0.5) {
          var spd = Math.hypot(x - prev.x, z - prev.z) / dt;
          if (spd > 9 && Math.hypot(x - px, z - pz) < 14) fire++;
        }
        prev.x = x; prev.z = z; prev.t = t0;
      } else {
        moverPrev[id] = { x: x, z: z, t: t0 };
      }
    }
    var ch = sc.children, j, k, c;
    for (j = 0; j < ch.length; j++) {
      c = ch[j];
      consider(c);
      if (c.children && c.children.length && c.children.length < 80) {
        for (k = 0; k < c.children.length; k++) consider(c.children[k]);
      }
    }
    Object.keys(moverPrev).forEach(function (id) {
      if (!seen[id] && t0 - moverPrev[id].t > 1) delete moverPrev[id];
    });
    SB.fireballs = fire;
    SB.bigSnakes = big;
  }

  function trackKills(E, t0) {
    var cur = {};
    E.forEach(function (e) { cur[e.id] = e; });
    knownEnemies.forEach(function (o) {
      if (!cur[o.id] && t0 - SB.rs > 1.2) {
        var nearTrap = Math.min(Math.abs(o.x), Math.abs(o.z)) > 4.5 && Math.max(Math.abs(o.x), Math.abs(o.z)) > 5.5;
        if (nearTrap || o.d < 5) SB.runKills += 1;
      }
    });
    knownEnemies = E.map(function (e) {
      return { id: e.id, x: e.position.x, z: e.position.z, d: Math.hypot(e.position.x - SB.px, e.position.z - SB.pz) };
    });
    SB.kills = SB.runKills;
  }

  function canShove() {
    return SB.hp >= 0.5 && SB.fireballs === 0 && SB.bigSnakes === 0 && SB.enemies > 0 && SB.nearest < 6;
  }

  function loopPath(t0, p, nd, enemiesInside) {
    var raw = WP[SB.wi % 8];
    var tg = clampTarget(raw[0], raw[1]);
    var dg = Math.hypot(tg[0] - p.x, tg[1] - p.z);
    if (dg < 0.85 || t0 - SB.wt > 8) {
      SB.wi++;
      SB.wt = t0;
      raw = WP[SB.wi % 8];
      tg = clampTarget(raw[0], raw[1]);
      dg = Math.hypot(tg[0] - p.x, tg[1] - p.z);
    }
    var vx = tg[0] - p.x, vz = tg[1] - p.z;
    if (enemiesInside) {
      var rad = Math.hypot(p.x, p.z) || 1;
      vx += (p.x / rad) * 0.8;
      vz += (p.z / rad) * 0.8;
    }
    return [vx, vz];
  }

  function watchdog(t0, p, inRound) {
    if (!inRound) {
      stuckSince = 0;
      SB.stuck = 0;
      return;
    }
    var spd = Math.hypot(vel[0], vel[1]);
    var moved = prevPos && Math.hypot(p.x - prevPos[0], p.z - prevPos[1]) > 0.04;
    if (moved && spd >= 0.8) {
      lastMovedAt = t0;
      stuckSince = 0;
      SB.stuck = 0;
      return;
    }
    if (!stuckSince) stuckSince = t0;
    if (t0 - stuckSince < 0.5) return;
    SB.stuck = 1;
    if (t0 - lastWatchdog < 0.28) return;
    lastWatchdog = t0;
    releaseAllKeys(true);
    focusCanvas();
    var inward = [-p.x, -p.z];
    if (Math.hypot(inward[0], inward[1]) < 0.2) inward = [1, 0];
    var pick;
    if (beyondGuard(p.x, p.z) || Math.max(Math.abs(p.x), Math.abs(p.z)) > TARGET - 0.2) {
      pick = inward;
    } else {
      cycleIdx = (cycleIdx + 1) % 4;
      var tans = [
        [-p.z, p.x],
        [p.z, -p.x],
        inward,
        [inward[0] - p.z * 0.4, inward[1] + p.x * 0.4]
      ];
      pick = tans[cycleIdx];
    }
    lastDir[0] = pick[0];
    lastDir[1] = pick[1];
    holdDir(pick[0], pick[1], t0, p, true);
    Object.keys(down).forEach(function (k) { if (down[k]) dispatchKey(k, true); });
  }

  function waterGuard(p) {
    var px = p.x, pz = p.z;
    var predX = px + vel[0] * 0.3;
    var predZ = pz + vel[1] * 0.3;
    if (beyondGuard(px, pz) || beyondGuard(predX, predZ)) {
      return { dir: [-px, -pz], forceTwo: true, state: "water" };
    }
    return null;
  }

  function chooseMove(t0, sc, es) {
    var p = player.position;
    var guard = waterGuard(p);
    if (guard) {
      SB.state = guard.state;
      SB.attack = false;
      return guard;
    }

    var n = null, nd = 1e9, E = [], inside = 0, i, e, d;
    var behind = 0;
    var fx = lastDir[0], fz = lastDir[1];
    for (i = 0; i < es.length; i++) {
      e = es[i];
      if (e === player) continue;
      if (Math.max(Math.abs(e.position.x), Math.abs(e.position.z)) > 10) continue;
      E.push(e);
      d = Math.hypot(e.position.x - p.x, e.position.z - p.z);
      if (d < nd) { nd = d; n = e; }
      if (inCenter(e.position.x, e.position.z)) inside++;
      if (d < 10 && fx * (e.position.x - p.x) + fz * (e.position.z - p.z) < 0) behind++;
    }
    SB.enemies = E.length;
    SB.nearest = E.length ? nd : 99;
    scanThreats(sc, E, t0, p.x, p.z);
    trackKills(E, t0);

    var vx = 0, vz = 0;
    var forceTwo = false;
    var blocking = false;
    if (n && nd < 1.5) {
      var ex = n.position.x - p.x, ez = n.position.z - p.z;
      var el = Math.hypot(ex, ez) || 1;
      if ((ex / el) * fx + (ez / el) * fz > 0.1) blocking = true;
    }

    if (t0 - SB.rs < 1.2 || inCenter(p.x, p.z)) {
      if (t0 - SB.rs < 0.08) SB.wi = nearestLoopWP(5.5, 0);
      var tg0 = clampTarget(WP[SB.wi % 8][0], WP[SB.wi % 8][1]);
      if (Math.hypot(p.x, p.z) < 1.0) { vx = 1; vz = 0; }
      else { vx = tg0[0] - p.x; vz = tg0[1] - p.z; }
      SB.state = "start";
    } else if (t0 < SB.shoveUntil && canShove()) {
      if (n) { vx = n.position.x - p.x; vz = n.position.z - p.z; }
      else { vx = -p.x; vz = -p.z; }
      SB.state = "shove";
      pulseSpace(t0);
    } else {
      var mv = loopPath(t0, p, nd, inside > 0);
      vx = mv[0];
      vz = mv[1];
      SB.state = "loop";
      if (n && nd < 4 && behind < Math.max(1, E.length * 0.6) && E.length) {
        var awayx = p.x - n.position.x, awayz = p.z - n.position.z;
        vx += -awayz * 0.35 + awayx * 0.1;
        vz += awayx * 0.35 + awayz * 0.1;
      }
    }

    if (blocking) {
      pulseSpace(t0);
      var bx = n.position.x - p.x, bz = n.position.z - p.z;
      vx += -bz * 0.8 - bx * 0.4;
      vz += bx * 0.8 - bz * 0.4;
      SB.state = "dodge";
    }

    var spd = Math.hypot(vel[0], vel[1]);
    if (spd < 0.7 && t0 - SB.rs > 0.4 && Math.hypot(vx, vz) > 0.1 && downHasArrow()) {
      blockedDir = (blockedDir + 1) % 6;
      var turn = (blockedDir % 2 ? 1 : -1) * (0.7 + blockedDir * 0.35);
      var c = Math.cos(turn), s = Math.sin(turn);
      var rx = vx * c - vz * s, rz = vx * s + vz * c;
      vx = rx; vz = rz;
      if (SB.state !== "water") SB.state = "blocked";
    }

    var zone = inBlockedZone(p.x, p.z) || inBlockedZone(p.x + vx, p.z + vz);
    if (zone) {
      vx = -p.x + (p.x - zone.x) * 0.6;
      vz = -p.z + (p.z - zone.z) * 0.6;
    }

    guard = waterGuard({ x: p.x, z: p.z });
    if (guard) return guard;

    var steered = clampStep(p.x, p.z, vx, vz);
    return { dir: steered, forceTwo: forceTwo };
  }

  function downHasArrow() {
    return !!(down.ArrowLeft || down.ArrowRight || down.ArrowUp || down.ArrowDown);
  }

  function refreshHeldKeys(t0) {
    if (t0 - lastKeyRefresh < 0.28) return;
    lastKeyRefresh = t0;
    ARROWS.forEach(function (k) { if (down[k]) dispatchKey(k, true); });
  }

  function onNewRound(t0) {
    SB.rs = t0;
    SB.runKills = 0;
    lastScoreNum = parseInt(SB.score, 10) || 0;
    knownEnemies = [];
    SB.shoveUntil = 0;
    prevPos = null;
    vel = [0, 0];
    stuckSince = 0;
    trail = [];
    deathLogged = false;
    SB.wi = nearestLoopWP(5.5, 0);
    SB.wt = t0;
    SB.state = "start";
    releaseAllKeys(true);
    focusCanvas();
    lastFocus = t0;
    lastDir[0] = 1;
    lastDir[1] = 0;
    holdDir(1, 0, t0, player ? player.position : null, false);
  }

  function tick() {
    if (stopped) return;
    try {
      SB.n++;
      if (!gw || !gw.THREE) {
        gw = findGameWindow();
        if (gw && gw.THREE) hookThree();
        return;
      }
      if (!hooked) hookThree();
      syncHud();
      var t0 = ((gw && gw.performance) || performance).now() / 1000;
      var sc = mainScene();
      if (!sc) {
        SB.state = "wait-scene";
        return;
      }
      findCamera(sc);
      var es = [];
      var ch = sc.children, i;
      for (i = 0; i < ch.length; i++) {
        if (ch[i].isSkinnedMesh && ch[i].visible) es.push(ch[i]);
      }
      var prevPlayer = player;
      findPlayer(es, sc);

      var hpNow = SB.hp;
      var playerGone = prevPlayer && (!player || !player.visible || player.parent !== sc);
      var yDrop = player && prevPos && (player.position.y < prevPos[3] - 1.2 || player.position.y < -1.5);
      if ((lastHp > 0.05 && hpNow <= 0.001) || playerGone || yDrop) {
        logDeath(playerGone ? "vanish" : (yDrop ? "y-drop" : "hp0"));
      }

      var inRound = !!(player && player.visible && hpNow > 0.001 && (visible(Q(".healthBar")) || visible(Q(".waveNumber")) || hpNow > 0));
      if (inRound && (player !== SB._lp || (lastHp <= 0.001 && hpNow > 0.02))) {
        SB._lp = player;
        onNewRound(t0);
      }
      lastHp = hpNow;

      if (!inRound) {
        releaseAllKeys();
        if (SB.state !== "restart") SB.state = "wait-round";
        prevPos = null;
        return;
      }

      var p = player.position;
      SB.px = p.x;
      SB.pz = p.z;
      SB.py = p.y;
      if (prevPos) {
        var dt = Math.max(0.008, t0 - prevPos[2]);
        vel[0] = (p.x - prevPos[0]) / dt;
        vel[1] = (p.z - prevPos[1]) / dt;
        SB.vn = Math.hypot(vel[0], vel[1]);
      }
      refreshSpikes(sc);
      updateSpikeTiming(t0);
      recordTrail(t0, p);

      if (t0 - lastFocus > 2.5) {
        lastFocus = t0;
        try { var c = canvasEl(); if (c && c.focus) c.focus(); } catch (e) {}
      }

      var mv = chooseMove(t0, sc, es);
      holdDir(mv.dir[0], mv.dir[1], t0, p, mv.forceTwo);
      refreshHeldKeys(t0);
      watchdog(t0, p, true);
      prevPos = [p.x, p.z, t0, p.y];
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
    if (gw && gw.THREE) hookThree();
    uiTimer = setInterval(function () {
      if (stopped) return;
      try { clickUi(); } catch (e) { SB.err = e.message; }
    }, 70);
    overlayTimer = setInterval(function () {
      if (stopped) return;
      try {
        ensureOverlay();
        renderOverlay();
        try { TOP.document.title = "V" + SB.ver + " " + SB.score + " w" + SB.wave + " " + SB.state; } catch (e) {}
      } catch (e) {}
    }, 200);
    loop();
  }

  boot();
})();
