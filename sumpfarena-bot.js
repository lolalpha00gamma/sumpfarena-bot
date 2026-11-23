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
  var LIMIT = 6.8;
  var SPIKE_MAX = 7.65;
  var CENTER = 3;
  var WP = [
    [7.4, 7.5, 1],
    [6.6, 0, 0],
    [7.4, -7.5, 1],
    [0, -6.6, 0],
    [-7.4, -7.5, 1],
    [-6.6, 0, 0],
    [-7.4, 7.5, 1],
    [0, 6.6, 0]
  ];

  var SB = {
    ver: 16,
    runs: prevRuns,
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
    kills: 0,
    runKills: 0,
    shoveUntil: 0,
    lastTrap: null,
    cal: "cam",
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
  var lastPosSample = null;
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
  var spaceUntil = 0;
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
  var mapFlip0 = 1;
  var mapFlip1 = 1;
  var mapSwap = false;
  var keyAxis = { ArrowRight: null, ArrowLeft: null, ArrowUp: null, ArrowDown: null };
  var intended = [1, 0];
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
    var x = r.left + r.width / 2;
    var y = r.top + r.height / 2;
    var ev = { bubbles: true, cancelable: true, view: gw, clientX: x, clientY: y, button: 0 };
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

  function camAxes(p) {
    var a = project(p.x + 1, p.z);
    var b = project(p.x, p.z + 1);
    var c = project(p.x, p.z);
    var right = [a[0] - c[0], b[0] - c[0]];
    var up = [a[1] - c[1], b[1] - c[1]];
    if (mapSwap) {
      var tmp = right; right = up; up = tmp;
    }
    right = [right[0] * mapFlip0, right[1] * mapFlip0];
    up = [up[0] * mapFlip1, up[1] * mapFlip1];
    return { right: right, up: up };
  }

  function norm2(v) {
    var L = Math.hypot(v[0], v[1]) || 1;
    return [v[0] / L, v[1] / L];
  }

  function worldDirForKey(k, p) {
    if (keyAxis[k]) return keyAxis[k];
    var ax = camAxes(p);
    if (k === "ArrowRight") return norm2(ax.right);
    if (k === "ArrowLeft") return norm2([-ax.right[0], -ax.right[1]]);
    if (k === "ArrowUp") return norm2(ax.up);
    if (k === "ArrowDown") return norm2([-ax.up[0], -ax.up[1]]);
    return [0, 0];
  }

  function predictedFromHeld(p) {
    var sx = 0, sz = 0, n = 0, i, k, d;
    for (i = 0; i < ARROWS.length; i++) {
      k = ARROWS[i];
      if (!down[k]) continue;
      d = worldDirForKey(k, p);
      sx += d[0];
      sz += d[1];
      n++;
    }
    if (!n) return null;
    return norm2([sx, sz]);
  }

  function applyMapping(flip0, flip1, swap, vx, vz, p) {
    var a = project(p.x + 1, p.z);
    var b = project(p.x, p.z + 1);
    var c = project(p.x, p.z);
    var r = [a[0] - c[0], b[0] - c[0]];
    var u = [a[1] - c[1], b[1] - c[1]];
    if (swap) { var tmp = r; r = u; u = tmp; }
    r = [r[0] * flip0, r[1] * flip0];
    u = [u[0] * flip1, u[1] * flip1];
    return { s0: vx * r[0] + vz * r[1], s1: vx * u[0] + vz * u[1], r: r, u: u };
  }

  function autoCalibrate(p, t0) {
    var spd = Math.hypot(vel[0], vel[1]);
    if (spd < 1.2) return;
    var heldN = 0, i, k;
    for (i = 0; i < ARROWS.length; i++) if (down[ARROWS[i]]) heldN++;
    if (heldN === 1) {
      for (i = 0; i < ARROWS.length; i++) {
        k = ARROWS[i];
        if (down[k]) keyAxis[k] = norm2(vel);
      }
    }
    var pred = predictedFromHeld(p);
    if (!pred) return;
    var align = pred[0] * vel[0] / spd + pred[1] * vel[1] / spd;
    if (align >= 0.55) {
      SB.cal = "ok";
      return;
    }
    var best = { sc: align, f0: mapFlip0, f1: mapFlip1, sw: mapSwap };
    var opts = [
      [1, 1, false], [1, -1, false], [-1, 1, false], [-1, -1, false],
      [1, 1, true], [1, -1, true], [-1, 1, true], [-1, -1, true]
    ];
    var o, m, pr, sc;
    var ivx = intended[0], ivz = intended[1];
    for (i = 0; i < opts.length; i++) {
      o = opts[i];
      m = applyMapping(o[0], o[1], o[2], ivx, ivz, p);
      pr = [0, 0];
      if (down.ArrowRight) { pr[0] += m.r[0]; pr[1] += m.r[1]; }
      if (down.ArrowLeft) { pr[0] -= m.r[0]; pr[1] -= m.r[1]; }
      if (down.ArrowUp) { pr[0] += m.u[0]; pr[1] += m.u[1]; }
      if (down.ArrowDown) { pr[0] -= m.u[0]; pr[1] -= m.u[1]; }
      if (Math.hypot(pr[0], pr[1]) < 0.01) continue;
      pr = norm2(pr);
      sc = pr[0] * vel[0] / spd + pr[1] * vel[1] / spd;
      if (sc > best.sc) best = { sc: sc, f0: o[0], f1: o[1], sw: o[2] };
    }
    if (best.sc > align + 0.25 && best.sc > 0.35) {
      mapFlip0 = best.f0;
      mapFlip1 = best.f1;
      mapSwap = best.sw;
      keyAxis = { ArrowRight: null, ArrowLeft: null, ArrowUp: null, ArrowDown: null };
      SB.cal = (mapSwap ? "sw" : "") + (mapFlip0 < 0 ? "x" : "") + (mapFlip1 < 0 ? "y" : "") || "fix";
    } else if (align < -0.2) {
      SB.cal = "bad";
    }
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
    var usedMeasured = 0, i, k, d, dots = [];
    for (i = 0; i < ARROWS.length; i++) {
      k = ARROWS[i];
      if (keyAxis[k]) {
        usedMeasured++;
        d = keyAxis[k];
        dots.push([k, d[0] * vx + d[1] * vz]);
      }
    }
    if (usedMeasured >= 2) {
      dots.sort(function (a, b) { return b[1] - a[1]; });
      if (dots[0][1] > 0.15) want[dots[0][0]] = true;
      if (dots[1] && dots[1][1] > 0.35) want[dots[1][0]] = true;
    }
    if (!want.ArrowRight && !want.ArrowLeft && !want.ArrowUp && !want.ArrowDown) {
      if (p && cam) {
        var m = applyMapping(mapFlip0, mapFlip1, mapSwap, vx, vz, p);
        var s0 = m.s0, s1 = m.s1;
        var mx = Math.max(Math.abs(s0), Math.abs(s1)) || 1;
        var thr = forceTwo ? 0.15 : 0.38;
        want.ArrowRight = s0 > thr * mx;
        want.ArrowLeft = s0 < -thr * mx;
        want.ArrowUp = s1 > thr * mx;
        want.ArrowDown = s1 < -thr * mx;
      } else {
        want.ArrowRight = vx > 0.38;
        want.ArrowLeft = vx < -0.38;
        want.ArrowUp = vz < -0.38;
        want.ArrowDown = vz > 0.38;
      }
    }

    var held = 0;
    for (k in want) if (want[k]) held++;
    if (held === 0) {
      var bestK = "ArrowRight", bestV = -99, v;
      if (p && cam) {
        var mm = applyMapping(mapFlip0, mapFlip1, mapSwap, vx, vz, p);
        var scores = [
          ["ArrowRight", mm.s0],
          ["ArrowLeft", -mm.s0],
          ["ArrowUp", mm.s1],
          ["ArrowDown", -mm.s1]
        ];
        scores.sort(function (a, b) { return b[1] - a[1]; });
        want[scores[0][0]] = true;
        if (forceTwo) want[scores[1][0]] = true;
      } else {
        want.ArrowRight = true;
      }
    } else if (held > 2) {
      var sc2 = [];
      for (i = 0; i < ARROWS.length; i++) {
        k = ARROWS[i];
        d = worldDirForKey(k, p || { x: 0, z: 0 });
        sc2.push([k, d[0] * vx + d[1] * vz]);
      }
      sc2.sort(function (a, b) { return b[1] - a[1]; });
      want = { ArrowRight: false, ArrowLeft: false, ArrowUp: false, ArrowDown: false };
      want[sc2[0][0]] = true;
      want[sc2[1][0]] = true;
    } else if (forceTwo && held === 1 && p && cam) {
      var mm2 = applyMapping(mapFlip0, mapFlip1, mapSwap, vx, vz, p);
      var sc3 = [
        ["ArrowRight", mm2.s0],
        ["ArrowLeft", -mm2.s0],
        ["ArrowUp", mm2.s1],
        ["ArrowDown", -mm2.s1]
      ];
      sc3.sort(function (a, b) { return b[1] - a[1]; });
      want[sc3[0][0]] = true;
      want[sc3[1][0]] = true;
    }

    for (k in want) if (want[k]) key(k, true);
    for (k in want) if (!want[k]) key(k, false);

    if (t0 < spacePulseUntil) {
      key(" ", true, t0 - lastAttackAt < 0.05);
    } else {
      key(" ", false);
    }
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

  function inSpikeCorner(x, z) {
    return Math.min(Math.abs(x), Math.abs(z)) >= 4.5 && Math.max(Math.abs(x), Math.abs(z)) <= SPIKE_MAX;
  }

  function allowedPos(x, z) {
    var ax = Math.abs(x), az = Math.abs(z);
    var mp = Math.max(ax, az);
    if (mp <= LIMIT) return true;
    if (inSpikeCorner(x, z)) return true;
    return false;
  }

  function clampStep(px, pz, vx, vz) {
    var len = Math.hypot(vx, vz) || 1;
    vx /= len;
    vz /= len;
    var step = 0.85;
    var nx = px + vx * step, nz = pz + vz * step;
    if (allowedPos(nx, nz) && !(inCenter(nx, nz) && !inCenter(px, pz))) return [vx, vz];
    var inward = norm2([-px, -pz]);
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
    var best = 1, bestD = 1e9, i, d;
    for (i = 0; i < WP.length; i++) {
      if (WP[i][2]) continue;
      d = Math.hypot(WP[i][0] - px, WP[i][1] - pz);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function closestWP(px, pz) {
    var best = 0, bestD = 1e9, i, d;
    for (i = 0; i < WP.length; i++) {
      d = Math.hypot(WP[i][0] - px, WP[i][1] - pz);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function ensureOverlay() {
    var doc = TOP.document;
    if (!doc || !doc.body) return;
    var old = doc.getElementById("__sb_overlay");
    if (old && old !== overlay) old.parentNode.removeChild(old);
    if (overlay && overlay.parentNode) return;
    overlay = doc.createElement("div");
    overlay.id = "__sb_overlay";
    overlay.style.cssText = "position:fixed;top:8px;right:8px;z-index:2147483647;min-width:230px;max-width:340px;max-height:50vh;overflow:auto;background:rgba(8,12,10,.88);color:#d6ffd0;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;padding:8px 10px;border:1px solid #3a7;border-radius:6px;pointer-events:none;white-space:pre-wrap;";
    doc.body.appendChild(overlay);
  }

  function renderOverlay() {
    if (!overlay) return;
    var runs = SB.runs.slice(-10).map(function (r, i) {
      var n = SB.runs.length - Math.min(SB.runs.length, 10) + i + 1;
      var k = r.kills != null ? "  k" + r.kills : "";
      return n + ". score " + r.score + "  wave " + r.wave + k;
    }).join("\n");
    if (!runs) runs = "(keine Läufe)";
    var html =
      "Sumpf-Arena Bot v" + SB.ver + "\n" +
      "state  " + SB.state + (SB.stuck ? "  STUCK" : "") + "\n" +
      "pos    " + SB.px.toFixed(1) + ", " + SB.pz.toFixed(1) + "\n" +
      "spd    " + (SB.vn || 0).toFixed(2) + "   near " + SB.nearest.toFixed(1) + "\n" +
      "HP     " + Math.round(SB.hp * 100) + "%   kills " + SB.runKills + "\n" +
      "wave   " + SB.wave + "   score " + SB.score + "\n" +
      "enemy  " + SB.enemies + "  fire " + SB.fireballs + "  big " + SB.bigSnakes + "\n" +
      "atk    " + (SB.attack ? "YES" : "no") + "   cal " + SB.cal + "\n" +
      "spike  P=" + SB.spikePeriod.toFixed(2) + "s  ok=" + (SB.ok ? "1" : "0") + "\n" +
      (SB.err ? "ERR    " + SB.err + "\n" : "") +
      "--- Läufe ---\n" + runs;
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
      SB.kills = (SB.kills || 0);
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

  function findPlayer(es, sc, t0) {
    var valid = player && player.visible && player.parent === sc && SB.hp > 0;
    if (valid) {
      var mp = Math.max(Math.abs(player.position.x), Math.abs(player.position.z));
      if (mp < 16) return;
    }
    var i, e, d, nm, atOrigin = [], moving = [], named = [];
    for (i = 0; i < es.length; i++) {
      e = es[i];
      if (!e.visible) continue;
      d = Math.hypot(e.position.x, e.position.z);
      if (Math.max(Math.abs(e.position.x), Math.abs(e.position.z)) > 12) continue;
      nm = meshName(e);
      if (looksLikePlayerName(nm)) named.push(e);
      if (d < 1.8) atOrigin.push(e);
      if (prevPos && player && e === player && Math.hypot(vel[0], vel[1]) > 1) moving.push(e);
    }
    var pick = named[0] || null;
    if (!pick && SB.hp > 0 && atOrigin.length) pick = atOrigin[0];
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
      e = es[i];
      if (enemyExtent(e) > norm * 1.55 + 0.15) big++;
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
    var ch = sc.children, j, k, c, g;
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
    var tg = WP[SB.wi % 8];
    var dg = Math.hypot(tg[0] - p.x, tg[1] - p.z);
    if (dg < 0.85 || t0 - SB.wt > 8) {
      if (tg[2] && canShove() && dg < 1.6) {
        SB.shoveUntil = t0 + 0.42;
        SB.lastTrap = [tg[0], tg[1]];
      }
      SB.wi++;
      SB.wt = t0;
      tg = WP[SB.wi % 8];
      dg = Math.hypot(tg[0] - p.x, tg[1] - p.z);
    }
    var ox = tg[0] - p.x, oz = tg[1] - p.z;
    var vx = ox, vz = oz;
    SB.ok = true;
    if (enemiesInside) {
      var rad = Math.hypot(p.x, p.z) || 1;
      vx += (p.x / rad) * 1.6;
      vz += (p.z / rad) * 1.6;
    }
    if (tg[2] && dg < 6 && dg > 2.5 && SB.spikeUpAt > 0) {
      var speed = Math.max(SB.vn || 6, 4.5);
      var tc = t0 + dg / speed;
      var P = SB.spikePeriod;
      var ph = (tc - SB.spikeUpAt) % P;
      if (ph < 0) ph += P;
      var lag = Math.min(nd, 6) / 3.6;
      var pe = (ph + lag) % P;
      SB.ok = ph > 0.8 && ph < P - 0.2 && pe < 0.7;
      if (!SB.ok) {
        var r = (dg - 4) * 0.3 / dg;
        vx = -oz / dg + ox * r;
        vz = ox / dg + oz * r;
      }
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
    cycleIdx = (cycleIdx + 1) % 8;
    var dirs = [
      [1, 0], [1, 1], [0, 1], [-1, 1],
      [-1, 0], [-1, -1], [0, -1], [1, -1]
    ];
    var inward = [-p.x, -p.z];
    if (Math.hypot(inward[0], inward[1]) < 0.2) inward = [1, 0];
    var pick = (Math.max(Math.abs(p.x), Math.abs(p.z)) > LIMIT - 0.2) ? inward : dirs[cycleIdx];
    lastDir[0] = pick[0];
    lastDir[1] = pick[1];
    intended[0] = pick[0];
    intended[1] = pick[1];
    holdDir(pick[0], pick[1], t0, p, true);
    Object.keys(down).forEach(function (k) {
      if (down[k]) dispatchKey(k, true);
    });
  }

  function chooseMove(t0, sc, es) {
    var p = player.position;
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
    var out = !allowedPos(p.x, p.z);
    var blocking = false;
    if (n && nd < 1.5) {
      var ex = n.position.x - p.x, ez = n.position.z - p.z;
      var el = Math.hypot(ex, ez) || 1;
      if ((ex / el) * fx + (ez / el) * fz > 0.1) blocking = true;
    }

    if (out) {
      var wp = WP[nearestLoopWP(p.x, p.z)];
      vx = -p.x * 1.4 + wp[0] * 0.15;
      vz = -p.z * 1.4 + wp[1] * 0.15;
      if (Math.hypot(vx, vz) < 0.2) { vx = -p.x; vz = -p.z; }
      SB.state = "recover";
      forceTwo = true;
    } else if (t0 - SB.rs < 1.2 || inCenter(p.x, p.z)) {
      if (t0 - SB.rs < 0.08) SB.wi = nearestLoopWP(6.6, 0);
      var tg0 = WP[SB.wi % 8];
      if (Math.hypot(p.x, p.z) < 1.0) { vx = 1; vz = 0; }
      else { vx = tg0[0] - p.x; vz = tg0[1] - p.z; }
      SB.state = "start";
    } else if (t0 < SB.shoveUntil && SB.lastTrap && canShove()) {
      if (n) { vx = n.position.x - p.x; vz = n.position.z - p.z; }
      else { vx = SB.lastTrap[0] - p.x; vz = SB.lastTrap[1] - p.z; }
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
      if (SB.state !== "recover") SB.state = "dodge";
    }

    var spd = Math.hypot(vel[0], vel[1]);
    if (spd < 0.7 && t0 - SB.rs > 0.4 && Math.hypot(vx, vz) > 0.1 && downHasArrow()) {
      blockedDir = (blockedDir + 1) % 6;
      var turn = (blockedDir % 2 ? 1 : -1) * (0.7 + blockedDir * 0.35);
      var c = Math.cos(turn), s = Math.sin(turn);
      var rx = vx * c - vz * s, rz = vx * s + vz * c;
      if (out) { rx = -p.x; rz = -p.z; }
      vx = rx; vz = rz;
      if (SB.state !== "recover") SB.state = "blocked";
    }

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
    SB.wi = nearestLoopWP(6.6, 0);
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
      findPlayer(es, sc, t0);

      var hpNow = SB.hp;
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
      if (prevPos) {
        var dt = Math.max(0.008, t0 - prevPos[2]);
        vel[0] = (p.x - prevPos[0]) / dt;
        vel[1] = (p.z - prevPos[1]) / dt;
        SB.vn = Math.hypot(vel[0], vel[1]);
      }
      autoCalibrate(p, t0);
      refreshSpikes(sc);
      updateSpikeTiming(t0);

      if (t0 - lastFocus > 2.5) {
        lastFocus = t0;
        try { var c = canvasEl(); if (c && c.focus) c.focus(); } catch (e) {}
      }

      var mv = chooseMove(t0, sc, es);
      holdDir(mv.dir[0], mv.dir[1], t0, p, mv.forceTwo);
      refreshHeldKeys(t0);
      watchdog(t0, p, true);
      prevPos = [p.x, p.z, t0];
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
