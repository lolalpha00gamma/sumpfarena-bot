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
  var SPIKE_PERIOD = 2.51;
  var LIMIT_EDGE = 7.15;
  var LIMIT_CORNER = 8.05;
  var LIMIT_FATAL = 8.6;
  var CENTER = 3;
  var WP = [
    [7.4, 7.5, 1],
    [7.25, 0, 0],
    [7.4, -7.5, 1],
    [0, -7.25, 0],
    [-7.4, -7.5, 1],
    [-7.25, 0, 0],
    [-7.4, 7.5, 1],
    [0, 7.25, 0]
  ];

  var SB = {
    ver: 15,
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
    shoveUntil: 0,
    lastTrap: null,
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
  var moverPrev = {};
  var normalEnemySize = 0;
  var overlay = null;
  var rafId = 0;
  var uiTimer = 0;
  var overlayTimer = 0;
  var stopped = false;
  var hooked = false;
  var havePlayer = false;
  var lastHud = "";

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
    if (TOP.THREE && TOP.document && TOP.document.querySelector("canvas")) {
      if (TOP.document.querySelector(".healthBar, .waveNumber, .scoreBoard, canvas")) return TOP;
    }
    var frames = TOP.document.querySelectorAll("iframe");
    var i, f, cw;
    for (i = 0; i < frames.length; i++) {
      f = frames[i];
      if (f.src && /games\/871\//.test(f.src)) {
        try {
          if (f.contentWindow && f.contentWindow.document) return f.contentWindow;
        } catch (e) {}
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

  function canvasTarget() {
    return (gw && gw.document && gw.document.querySelector("canvas")) || (gw && gw.document) || TOP.document;
  }

  function key(name, isDown) {
    if (!gw) return;
    if (!!down[name] === !!isDown) return;
    down[name] = !!isDown;
    var ev = new gw.KeyboardEvent(isDown ? "keydown" : "keyup", {
      key: name,
      code: name === " " ? "Space" : name,
      keyCode: KEYS[name],
      which: KEYS[name],
      bubbles: true,
      cancelable: true
    });
    canvasTarget().dispatchEvent(ev);
  }

  function releaseAllKeys() {
    Object.keys(KEYS).forEach(function (k) { key(k, false); });
  }

  function holdDir(vx, vz) {
    if (!cam || !player || !T) {
      key("ArrowRight", true);
      key("ArrowLeft", false);
      key("ArrowUp", false);
      key("ArrowDown", false);
      return;
    }
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
    var p = player.position;
    var a = project(p.x + 1, p.z);
    var b = project(p.x, p.z + 1);
    var c = project(p.x, p.z);
    var s0 = vx * (a[0] - c[0]) + vz * (b[0] - c[0]);
    var s1 = vx * (a[1] - c[1]) + vz * (b[1] - c[1]);
    var m = Math.max(Math.abs(s0), Math.abs(s1)) || 1;
    var want = {
      ArrowRight: s0 > 0.38 * m,
      ArrowLeft: s0 < -0.38 * m,
      ArrowUp: s1 > 0.38 * m,
      ArrowDown: s1 < -0.38 * m
    };
    var held = 0, k;
    for (k in want) if (want[k]) held++;
    if (held === 0) {
      var bestK = "ArrowRight", bestV = -1, v;
      for (k in want) {
        v = k === "ArrowRight" ? s0 : k === "ArrowLeft" ? -s0 : k === "ArrowUp" ? s1 : -s1;
        if (v > bestV) { bestV = v; bestK = k; }
      }
      want[bestK] = true;
    } else if (held > 2) {
      var scores = [
        ["ArrowRight", s0],
        ["ArrowLeft", -s0],
        ["ArrowUp", s1],
        ["ArrowDown", -s1]
      ];
      scores.sort(function (x, y) { return y[1] - x[1]; });
      want = { ArrowRight: false, ArrowLeft: false, ArrowUp: false, ArrowDown: false };
      want[scores[0][0]] = true;
      want[scores[1][0]] = true;
    }
    for (k in want) if (want[k]) key(k, true);
    for (k in want) if (!want[k]) key(k, false);
    if (SB.attack) {
      if (!down[" "]) key(" ", true);
      else key(" ", false);
    } else {
      key(" ", false);
    }
  }

  function project(x, z) {
    var v = new T.Vector3(x, 0, z).project(cam);
    return [v.x, v.y];
  }

  function inCorner(x, z) {
    return Math.min(Math.abs(x), Math.abs(z)) > 5;
  }

  function isWalkable(x, z) {
    var ax = Math.abs(x), az = Math.abs(z);
    var mp = Math.max(ax, az);
    if (mp > LIMIT_FATAL) return false;
    if (inCorner(x, z)) return mp <= LIMIT_CORNER;
    return mp <= LIMIT_EDGE;
  }

  function steerWalkable(px, pz, vx, vz) {
    var len = Math.hypot(vx, vz) || 1;
    vx /= len;
    vz /= len;
    var step = 0.9;
    var nx = px + vx * step, nz = pz + vz * step;
    if (isWalkable(nx, nz) && !inCenter(nx, nz)) return [vx, vz];
    var i, a, rx, rz, c, s;
    for (i = 1; i <= 12; i++) {
      a = (i % 2 ? 1 : -1) * i * (Math.PI / 14);
      c = Math.cos(a);
      s = Math.sin(a);
      rx = vx * c - vz * s;
      rz = vx * s + vz * c;
      nx = px + rx * step;
      nz = pz + rz * step;
      if (isWalkable(nx, nz) && !inCenter(nx, nz)) return [rx, rz];
    }
    return [-px, -pz];
  }

  function inCenter(x, z) {
    return Math.abs(x) < CENTER && Math.abs(z) < CENTER;
  }

  function ensureOverlay() {
    var doc = TOP.document;
    if (!doc || !doc.body) return;
    var old = doc.getElementById("__sb_overlay");
    if (old && old !== overlay) old.parentNode.removeChild(old);
    if (overlay && overlay.parentNode) return;
    overlay = doc.createElement("div");
    overlay.id = "__sb_overlay";
    overlay.style.cssText = "position:fixed;top:8px;right:8px;z-index:2147483647;min-width:220px;max-width:320px;max-height:46vh;overflow:auto;background:rgba(8,12,10,.86);color:#d6ffd0;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;padding:8px 10px;border:1px solid #3a7;border-radius:6px;pointer-events:none;white-space:pre-wrap;";
    doc.body.appendChild(overlay);
  }

  function renderOverlay() {
    if (!overlay) return;
    var runs = SB.runs.slice(-8).map(function (r, i) {
      var n = SB.runs.length - SB.runs.slice(-8).length + i + 1;
      return n + ". score " + r.score + "  wave " + r.wave;
    }).join("\n");
    if (!runs) runs = "(keine Läufe)";
    var html =
      "Sumpf-Arena Bot v" + SB.ver + "\n" +
      "state  " + SB.state + "\n" +
      "score  " + SB.score + "   wave " + SB.wave + "   HP " + Math.round(SB.hp * 100) + "%\n" +
      "pos    " + SB.px.toFixed(1) + ", " + SB.pz.toFixed(1) + "   spd " + (SB.vn || 0).toFixed(1) + "\n" +
      "enemy  " + SB.enemies + "  near " + SB.nearest.toFixed(1) + "\n" +
      "fire   " + SB.fireballs + "   big " + SB.bigSnakes + "   atk " + (SB.attack ? "YES" : "no") + "\n" +
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
      if (fill.style && /([\d.]+)%/.test(fill.style.width || "")) return Math.max(0, Math.min(1, parseFloat(RegExp.$1) / 100));
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
      havePlayer = false;
      player = null;
      SB.shoveUntil = 0;
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
    var score = SB.score, wave = SB.wave;
    var last = SB.runs[SB.runs.length - 1];
    if (last && last.score === score && last.wave === wave && (score === "0" || score === 0)) return;
    if (score === "?" && wave === "?") return;
    SB.runs.push({ score: score, wave: wave });
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
  }

  function findCamera(sc) {
    if (cam && cam.parent) return;
    cam = null;
    sc.traverse(function (o) {
      if (o.isCamera) cam = o;
    });
  }

  function findPlayer(es, sc) {
    if (player && player.visible && player.parent === sc) return;
    player = null;
    var i, e, d, best = 1.6, pick = null;
    for (i = 0; i < es.length; i++) {
      e = es[i];
      d = Math.hypot(e.position.x, e.position.z);
      if (d < best) { best = d; pick = e; }
    }
    player = pick;
  }

  function refreshSpikes(sc) {
    if (spikes.length && spikes[0] && spikes[0].parent) return;
    spikes = [];
    sc.traverse(function (x) {
      if (x.name === "spikes") spikes.push(x);
    });
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
    if (!rad) {
      try {
        if (e.geometry && e.geometry.boundingBox) {
          var bb = e.geometry.boundingBox;
          rad = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z) * scale * 0.5;
        }
      } catch (err) {}
    }
    return Math.max(scale, rad || 0);
  }

  function scanThreats(sc, es, t0, px, pz) {
    var fire = 0, big = 0, sizes = [], i, e, ext;
    for (i = 0; i < es.length; i++) {
      e = es[i];
      if (e === player) continue;
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
      if (e === player) continue;
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
          prev.spd = spd;
          if (spd > 9 && Math.hypot(x - px, z - pz) < 14) fire++;
        }
        prev.x = x;
        prev.z = z;
        prev.t = t0;
      } else {
        moverPrev[id] = { x: x, z: z, t: t0, spd: 0 };
      }
    }
    var ch = sc.children, j, k, c, g;
    for (j = 0; j < ch.length; j++) {
      c = ch[j];
      consider(c);
      if (c.children && c.children.length && c.children.length < 80) {
        for (k = 0; k < c.children.length; k++) {
          g = c.children[k];
          consider(g);
        }
      }
    }
    Object.keys(moverPrev).forEach(function (id) {
      if (!seen[id] && t0 - moverPrev[id].t > 1) delete moverPrev[id];
    });
    SB.fireballs = fire;
    SB.bigSnakes = big;
  }

  function canShove() {
    return SB.hp >= 0.5 && SB.fireballs === 0 && SB.bigSnakes === 0 && SB.enemies > 0 && SB.nearest < 6;
  }

  function closestOuterWP(px, pz) {
    var best = 0, bestD = 1e9, i, d;
    for (i = 0; i < WP.length; i++) {
      d = Math.hypot(WP[i][0] - px, WP[i][1] - pz);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
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
      vx += (p.x / rad) * 2.2;
      vz += (p.z / rad) * 2.2;
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

  function chooseMove(t0, sc, es) {
    var p = player.position;
    var n = null, nd = 1e9, E = [], inside = 0, i, e, d;
    for (i = 0; i < es.length; i++) {
      e = es[i];
      if (e === player) continue;
      if (Math.max(Math.abs(e.position.x), Math.abs(e.position.z)) > 10) continue;
      E.push(e);
      d = Math.hypot(e.position.x - p.x, e.position.z - p.z);
      if (d < nd) { nd = d; n = e; }
      if (inCenter(e.position.x, e.position.z)) inside++;
    }
    SB.enemies = E.length;
    SB.nearest = E.length ? nd : 99;
    scanThreats(sc, E, t0, p.x, p.z);

    var vx = 0, vz = 0;
    var out = !isWalkable(p.x, p.z) || Math.max(Math.abs(p.x), Math.abs(p.z)) > LIMIT_FATAL - 0.2;
    if (out) {
      vx = -p.x;
      vz = -p.z;
      SB.state = "recover";
      SB.attack = false;
    } else if (inCenter(p.x, p.z) || t0 - SB.rs < 1.6) {
      if (t0 - SB.rs < 0.05) SB.wi = closestOuterWP(7.3, 0);
      var tg0 = WP[SB.wi % 8];
      if (Math.hypot(p.x, p.z) < 1.2) { vx = 1; vz = 0; }
      else { vx = tg0[0] - p.x; vz = tg0[1] - p.z; }
      SB.state = "start";
      SB.attack = false;
    } else if (t0 < SB.shoveUntil && SB.lastTrap && canShove()) {
      var lx = SB.lastTrap[0], lz = SB.lastTrap[1];
      if (n) {
        vx = n.position.x - p.x;
        vz = n.position.z - p.z;
      } else {
        vx = lx - p.x;
        vz = lz - p.z;
      }
      SB.state = "shove";
      SB.attack = true;
    } else {
      SB.attack = false;
      var mv = loopPath(t0, p, nd, inside > 0);
      vx = mv[0];
      vz = mv[1];
      SB.state = "loop";
    }
    if (SB.hp < 0.5) SB.attack = false;

    var steered = steerWalkable(p.x, p.z, vx, vz);
    if (inCenter(p.x + steered[0], p.z + steered[1]) && !inCenter(p.x, p.z)) {
      steered = steerWalkable(p.x, p.z, p.x, p.z);
    }
    return steered;
  }

  function tick() {
    if (stopped) return;
    try {
      SB.n++;
      if (!gw || !gw.THREE) {
        gw = findGameWindow();
        if (gw && gw.THREE) hookThree();
        holdIfPossible();
        return;
      }
      if (!hooked) hookThree();
      syncHud();
      var sc = mainScene();
      if (!sc) {
        SB.state = "wait-scene";
        return;
      }
      findCamera(sc);
      var es = sc.children.filter(function (c) { return c.isSkinnedMesh && c.visible; });
      findPlayer(es, sc);
      if (!player) {
        havePlayer = false;
        releaseAllKeys();
        SB.state = "wait-round";
        return;
      }
      var t0 = (gw.performance || performance).now() / 1000;
      if (player !== SB._lp) {
        SB._lp = player;
        SB.rs = t0;
        SB.wi = closestOuterWP(player.position.x, player.position.z);
        SB.wt = t0;
        havePlayer = true;
        SB.state = "start";
      }
      SB.px = player.position.x;
      SB.pz = player.position.z;
      refreshSpikes(sc);
      updateSpikeTiming(t0);
      var dir = chooseMove(t0, sc, es);
      holdDir(dir[0], dir[1]);
      if (SB.n % 40 === 0) {
        var q = lastPosSample;
        if (q) SB.vn = Math.hypot(SB.px - q[0], SB.pz - q[1]) / Math.max(0.001, t0 - q[2]);
        lastPosSample = [SB.px, SB.pz, t0];
      }
    } catch (e) {
      SB.err = (e && e.message) || String(e);
    }
  }

  function holdIfPossible() {
    if (!gw) return;
    try {
      if (!player) key("ArrowRight", true);
    } catch (e) {}
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
    }, 80);
    overlayTimer = setInterval(function () {
      if (stopped) return;
      try {
        ensureOverlay();
        renderOverlay();
        try {
          TOP.document.title = "V" + SB.ver + " " + SB.score + " w" + SB.wave + " " + SB.state;
        } catch (e) {}
      } catch (e) {}
    }, 250);
    loop();
  }

  boot();
})();
