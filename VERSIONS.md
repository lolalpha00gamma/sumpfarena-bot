# Sumpf-Arena bot versions

Injectable bots for the TOGGO Ninjago Sumpf-Arena. Stable loader is always `sumpfarena-bot.js` on `main` (currently **v34**, after the 23 Nov 2026 live session reached wave 21). v35 is published for testing but did not beat v34 in sim, so it is not stable. Variant files on `main` can be loaded independently via the SHA-pinned jsDelivr URLs below. Each variant uses its own HUD version string, dump key (`__SB_dump_v32.x`), and download filename (`sumpfarena-v32.x-log-…`) so live logs never mix.

Sim protocol (all numbers below): 11 trials, cap 2400 s, target wave 13, seeds `4000+i*97`. Clocks: `1/60`, `1/40`, and hitch 8% (40–100 ms). v31 spike gating (2.5 disk, CROSS=0.70) is unchanged in every v32 variant.

## Variants

| Variant | Branch | Idea | SHA-pinned jsDelivr |
|---|---|---|---|
| v31 (stable) | `main` | Conservative spike gate, dt-aware, pr=0.5, watchdog, noodle abort | See commit `729799f2bfad1dfff43b5dbf155cd5f01b1e8aea` — `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@729799f2bfad1dfff43b5dbf155cd5f01b1e8aea/sumpfarena-bot-v31.js` |
| v32.1 | `v32.1` | Water-edge margin: never correct toward the inner moat; only pull back when already past the outer lip (`|x|` or `|z| > 24.2`) toward the ring line at 24. Plus all shared v32 fixes below. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@97d04b89a1d6c9020fa617a9e9a7823d4e334788/sumpfarena-bot-v32.1.js` |
| v32.2 | `v32.2` | Earlier enemy dodging: larger yield radius (6/7), yield = move-away along the ring instead of standing, no cut-inner with an enemy within ~6.5. Plus all shared v32 fixes. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@97d04b89a1d6c9020fa617a9e9a7823d4e334788/sumpfarena-bot-v32.2.js` |
| v32.3 | `v32.3` | Both: water-edge margin and earlier enemy dodging, plus all shared v32 fixes. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@97d04b89a1d6c9020fa617a9e9a7823d4e334788/sumpfarena-bot-v32.3.js` |
| v33 | `main` (file `sumpfarena-bot-v33.js`) | Built on v32.1. Uses every Zeitklinge colour deliberately (see `sumpfarena-blades.md`). Fixes v32.1 live bugs: death recording, dump heartbeat, spike-gating livelock, stall hunting. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@f75f573ad292205a4053a0811267ead4e1572c72/sumpfarena-bot-v33.js` |
| v34 | `main` (file `sumpfarena-bot-v34.js`) | Built on v33. Real game-over run counting (i-frame blink no longer opens a “run”), HP/death recording each frame, one autosave per 10 real game-overs, tighter blade policy, noodle cooldown. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@69863f79e62a97188fbb28fab6fc992ef0b3fa02/sumpfarena-bot-v34.js` |
| v35 | `main` (file `sumpfarena-bot-v35.js`) | Built on v34. Wave 19–35 support: null `'22'` / WebGL-loss recovery, full per-run reset, capped logs, hold-spike max-wait that does not depend on padKey, dodge-orb that refuses an axe’s reach, no lure-spike into fireballs, outward recover-ring instead of stay-ring cuts. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@a7a9f49110f28853a336282f145032ebe4ef8942/sumpfarena-bot-v35.js` |
| v36 | `main` (file `sumpfarena-bot-v36.js`) | v34 behaviour plus only WebGL/'22' stability, per-run reset, capped logs, hold-spike stuck timer (safe ≥ 0.35), dodge-orb reject of axe/boss reach ≤ 3.5, no lure-spike with a fireball < 8, off-ring recover outward. Blade/noodle policy unchanged. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@84f94239e91775aa54e238f7ff0f60f5ccac0fd2/sumpfarena-bot-v36.js` |
| v37 | `main` (file `sumpfarena-bot-v37.js`) | v36 plus: do not stand still in hold-spike/wait states when a shield/axe/boss is within ~4; attack, sidestep along the ring, or use red/green if held; hug the outer lip toward 24. Cheap late-wave radius scale from wave 26. Blade/noodle policy otherwise unchanged. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@3dd1946023f0e395d632bf039cfea84469df5c6e/sumpfarena-bot-v37.js` |

The v32 files on `main` are at commit `97d04b89a1d6c9020fa617a9e9a7823d4e334788`.

**Recommend testing live first: v32.1.** It is the only variant that beats v31 on mean wave and ≥10/≥12 counts at 1/60 and 1/40, with 0 water / 0 spike / 0 arrow in those benches. Under hitch 8% it is slightly behind v31 (mean 8.45 vs 9.18, ge10 3 vs 4), so **stable stays v31** until hitch is at least as good.

v32.2 and v32.3 isolate the larger-yield / ring-move-away idea. In sim that dodge regresses hard (mean ~4–5, some water). They are published so the ideas can be tested independently, but they are not recommended live.

## Shared v32 behaviour (all variants)

- **Arrow traps (Pfeilfallen).** Six pedestals (no south pair). Cycle 2.5 s, fire at tick 500, projectile speed 20, hit radius 1.55, 1 HP, removed on impact. The old `fireIn < 0.35` check missed the in-flight window (after fire, `fireIn` wraps to ~2 s). v32 treats a lane as hot if `fireIn < 0.40` **or** `sinceFire < 0.40`, plus live darts. Do not stand in a hot firing line — leave along the ring; do not step onto a hot lane. HP/death cause is `'arrow'`. Target: 0 arrow deaths.
- **Old-log reclassification** (lane `x≈±6, z>+18` or `|z|≈6, |x|>18`, tick 500–700): v29-log-final unknowns 2, of which 1 arrow; v30-log-final unknowns 4, of which 3 arrows; v31-log-final unknowns 10, of which **9 arrows** (the live “unknown” hits Linus saw).
- **Zeitklingen.** Pickup is automatic at proximity &lt; 1.5 on the four outer corners `(±24, ±24)`. Only **red (freeze, 6 s)** is picked (when the ring already goes through it — not a detour) and used, and only for danger (enemy &lt; 4, orb/medusa, HP ≤ 1) or advantage (axe/shield/boss in reach, or wave stuck &gt; 90 s with 1–3 enemies). Cooldown ≥ 15 s, max one active effect, never activate green / yellow / blue. Green is a 7.5-unit dash along facing with a cell-centre snap on the **second** Ctrl press (the live “lost orientation”). Skirt a non-red corner blade via the walkable inner diagonal (e.g. `(22.2, 22.2)`), staying outside the 1.5 pickup and out of neighbouring spike disks. Each use is logged in `bladeUses` (colour, reason, nearby enemies, kills during the effect).
- **Key hysteresis.** A MOVE-direction commit of ≥0.25 s was tried and **rejected**: at speed 8 it walks ~2 units off a 1-cell mid-plank into the inner moat. Instead: (1) if keys have been held with displacement &lt; 0.3 u/s for &gt; 0.12 s, release them (the live run-animation / no-progress oscillation); (2) live bots use a **0.4** deadband in `clampToRingKeys` / plank centre-hug / CTE (was 0.12); (3) `dirFlips` per minute and `jitterTime` are logged in the dump. Sim flip counts stay high because the v31 controller still generates lateral micro-taps; the live 0.4 deadband is what should bring oscillation down. Target ≈ 0 on live.
- v31 spike handling, pr=0.5, dt-aware control, watchdog, and noodle abort are unchanged.

## Sim comparison (11 trials, cap 2400 s, targetW=13)

Columns: water, spike, arrow, mean wave, ≥10, ≥12, blades used, kills/blade, blades/wave, dirFlips/min, jitterTime. Live column is for Linus to fill.

### 1/60

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | Blades | K/blade | B/wave | Flips/min | Jitter | Live |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v31 | 0 | 0 | 0 | 9.36 | 6 | 5 | 652 | 0.27 | 6.33 | 914.85 | 0.1s | |
| v32.1 | 0 | 0 | 0 | **12.45** | **10** | **10** | 266 | 0.11 | 1.94 | 592.38 | 0.2s | |
| v32.2 | 1 | 0 | 0 | 5.64 | 0 | 0 | 64 | 0.05 | 1.03 | 547.22 | 0.1s | |
| v32.3 | 0 | 0 | 0 | 5.64 | 0 | 0 | 88 | 0.05 | 1.42 | 504.28 | 0.1s | |

v31 survived 4; v32.1 survived 10 (max 13, min 7). Majority ≥10: v31 yes, v32.1 yes, v32.2/32.3 no.

### 1/40

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | Blades | K/blade | B/wave | Flips/min | Jitter | Live |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v31 | 0 | 0 | 0 | 10.09 | 6 | 6 | 575 | 0.29 | 5.18 | 610.87 | 0.3s | |
| v32.1 | 0 | 0 | 0 | **10.55** | **7** | **7** | 186 | 0.06 | 1.60 | 395.40 | 0.3s | |
| v32.2 | 1 | 0 | 0 | 5.18 | 1 | 0 | 81 | 0.02 | 1.42 | 378.76 | 0.2s | |
| v32.3 | 0 | 0 | 0 | 4.91 | 0 | 0 | 61 | 0.10 | 1.13 | 363.88 | 0.2s | |

v31 survived 6; v32.1 survived 6. Majority ≥10: v31 yes, v32.1 yes, v32.2/32.3 no.

### Hitch 8% (40–100 ms)

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | Blades | K/blade | B/wave | Flips/min | Jitter | Live |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v31 | 0 | 0 | 0 | **9.18** | **4** | **4** | 498 | 0.35 | 4.93 | 478.91 | 0.6s | |
| v32.1 | 0 | 0 | 0 | 8.45 | 3 | 3 | 255 | 0.08 | 2.74 | 313.59 | 0.5s | |
| v32.2 | 7 | 0 | 0 | 4.27 | 0 | 0 | 58 | 0.14 | 1.23 | 270.49 | 0.0s | |
| v32.3 | 2 | 0 | 0 | 3.91 | 0 | 0 | 53 | 0.08 | 1.23 | 288.68 | 0.2s | |

v31 survived 4; v32.1 survived 3. Majority ≥10: none (v31 ge10=4, v32.1 ge10=3). This is why stable is not pointed at v32.1 yet.

## v31 live root causes (18:36–18:57 CET, 23 Nov 2026)

Full write-up: `sumpfarena-deaths-v31.md` (from `/home/box/Downloads/sumpfarena-v31-log-final.json` only). Record snapshot wave 10 / 1960. 0 spike deaths in the v31 HUD list.

- Water at the outer corners (`|x|` or `|z| ≈ 28`) was knock from a snake/grunt while the bot was already on the outer lip, not wait-round idling mid-wave.
- Yield-as-stand deaths (grunt at `(6.9, 23.98)` — also on the north dart lane; shield at `(23.94, 16.30)` wave 10 / 1930).
- cut-inner with a snake already at 1.5 walked/got pushed to `(27.51, −24.08)`.
- Most `unknown` HP events were in-flight arrows (9 of 10 in this log).
- Blade spam: sim v31 uses ~5–6 blades/wave of random colours; green’s second press dashes and desyncs heading.

v32.1 targets the water-lip and shared arrow/blade/jitter issues without the dodge regression. The yield/cut-inner idea lives in v32.2/32.3 and needs more work before it is safe to combine.


## v33 (wave-18 protocol)

Sim protocol from this version on: **6 trials**, cap **4000 s**, **targetW=19** (survive wave 18). Same three clocks. `stall` is seconds spent with no kill and no wave change after a 60 s grace, plus the number of such stall events. Wave table `$a()` for 13–18 (counts snake, grunt, shield, axe, medusa, boss, boss2): 13=5 shields+1 snake; 14=2 axe+2 medusa; 15=first mid-game boss; 16=2 of each trash/axe/medusa; 17=3 shield+3 medusa+1 axe; 18=5 grunt+2 shield+2 medusa+1 boss. **No run reached wave 18** in this bench.

### How v33 uses each colour

- **Red (freeze, 6 s):** melee / tank / boss / leftover wave; never while spikes are up in a pad disk (traps freeze in their current state).
- **Blue (world dt ×0.3, 6 s):** incoming fireballs or medusa, dart lanes, snake packs; never if spikes are already up underfoot (the up window lasts longer in real time).
- **Green (dash 7.5 / 4.95 / 3.27 along facing, cell-centre snap):** only if the landing is walkable, **on the outer ring**, not a spike disk, not a hot dart lane, not past the outer lip. Used to escape a close threat or close on a kill. At most one dash per arm; ring index is re-synced afterwards. The game will dash onto traps if asked — the bot must refuse those landings. After a 5-frame debounce the landing is re-checked from the current pose.
- **Yellow (9 s arm, 3 s pose/HP rewind):** arm when entering risk (nearby enemies, orbs, HP ≤ 4); second Ctrl rewinds if HP dropped or a fall started, and only if the saved pose is still on the ring. Clears `Ta`.

One effect at a time. No extra 15 s global cooldown (the pad already respawns in 15 s). Pickup is automatic on the ring for any colour; v33 does **not** skirt via the inner diagonal (that walk fell into the moat in sim).

### v32.1 live (19:25–19:35 CET, 23 Nov 2026)

Log `/home/box/Downloads/sumpfarena-v32.1-log-final.json` (2976 bytes). Max wave 6 / 920 (HUD). 8 run snapshots, last in the file 19:29:34 CET at wave 6 / 880 / 30 kills — the 19:31–19:35 stall was **not in the dump** because it only persisted on boot and run-end (`countVerRuns` still compared `ver === 25`, so the 10-run autosave never fired). Deaths: a single `dead/boot (0,0)` at 19:25:51 CET. After that the player started on the ring, `onNewRound` never ran, `deathLogged` stayed true, and every later death was dropped. Blades used: 0. flips/min 99–139, jitter 0.5–0.6 s. 0 water / 0 arrow seen. HP events: snakes, grunts, one fireball. From ~19:31 the HUD sat at wave 6 cycling hold-spike → loop → stage-spike (spike-gating livelock; leftover is the wave-6 axe).

v33 dump/death fixes: versioned `countVerRuns`, 2 s persist heartbeat with a `current` snapshot, ignore boot/(0,0) deaths, reset `deathLogged` when becoming alive on the ring, wait-spawn until the player is on a `pb` cell, richer run/death records. Livelock: max ~5 s wait per pad, then force-cross on the next down window (`safe ≥ 0.35`) or reverse; after 60 s with no kill/wave progress, reverse on the ring and hunt leftovers.

### 1/60 (6 trials, cap 4000, targetW=19)

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | B/wave | K/blade | Stall | Live |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v32.1 | 0 | 0 | 0 | **10.83** | 3 | 3 | **1** | 0 | 2.06 | 0.10 | 2058s/25 | 6/920, deaths not recorded, 0 blades, spike livelock |
| v33 | 0 | 0 | 0 | 10.67 | 3 | 3 | 0 | 0 | 3.56 | **0.41** | 5142s/28 | |

### 1/40

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | B/wave | K/blade | Stall | Live |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v32.1 | 1 | 0 | 0 | **11.17** | 3 | 3 | **2** | 0 | 2.91 | 0.09 | 3359s/32 | |
| v33 | 0 | 0 | 0 | 9.83 | 3 | 3 | 1 | 0 | 3.78 | **0.33** | 4488s/29 | |

### Hitch 8%

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | B/wave | K/blade | Stall | Live |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v32.1 | 0 | 0 | 0 | **13.33** | **5** | **5** | **2** | 0 | 3.25 | 0.07 | 3856s/39 | |
| v33 | 0 | 0 | 0 | 7.50 | 2 | 1 | 0 | 0 | 3.09 | **0.50** | 1620s/24 | |

v33 does **not** beat v32.1 on mean or ≥12/≥15, and does not beat v31 on all three clocks, so **stable stays v31**. It is still the build to test live next if the goal is working death logs, a live dump during a stall, breaking the wave-6 pad livelock, and actually using blades. Wave 18 remains unreached; leftover axes and medusa orbs in 13–17 are the wall, with high stall time in both versions.

## v34 (wave-18 protocol)

Same sim protocol as v33: **6 trials**, cap **4000 s**, **targetW=19**, clocks 1/60, 1/40, hitch 8%. Full v33 live write-up: `sumpfarena-deaths-v33.md` (from `/home/box/Downloads/sumpfarena-v33-log-final.json` only). Session 19:47:24–19:57:07 CET, 23 Nov 2026. Still alive at dump: wave 8 / 1510 / 52 kills / HP 5. **0 true game-overs.** HUD “Tode” stayed `(keine)` because the player never hit `la` or HP 0. The 13 “runs” (consecutive scores often +10–20, sometimes <1 s apart) were **HP chips and i-frame blinks**, plus a boot snapshot, not 13 lives.

Root causes in the v33 live bot:

- `inRound()` required `k.i.v.visible`. The 1 s i-frame window (`Oa`) blinks the mesh, so `inRound()` flickered false. `endRunCapture()` then ran because `SB.rs` is the round-start timestamp (always truthy after the first `onNewRound`), not a game-over flag.
- Autosave: after the 10th fake run (19:54:08), the blink reset `runDumped` and `downloadLog()` fired eight times (`log-10.json` plus `(1)`…`(7)`).
- 11 HP events were recorded and are the real injury log: snake 5, axe 4 (one mislabelled `unknown` at axe 4.50), fireball 1, grunt 1. No water / spike / arrow in this session.
- Blades: 34 uses in ~10 min, 19 with 0 kills and 0 escapes (56%). Green was double-logged (arm + dash). Loose `blue-darts` / `green-close` / `yellow-arm` at full HP / `advantage-stuck` with no enemies did not pay off.
- Noodle time sink in wave 6 (19:50–19:53, axe chip at 19:52:10 in state `noodle`): a 3 s abort reset `noodleSince`, so the next frame re-entered the bowl chase.

v34 fixes:

- Detect every HP decrease and every real game-over (`la` or HP ≤ 0) each frame; `deathLogged` is only a duplicate-record guard. HUD gains a “Treffer” list. A “run” is counted only on game over (or the Nochmal restart). `inRound()` no longer uses mesh visibility. Autosave writes once when the real run count crosses a multiple of 10 (`lastDownloadN`).
- Blade policy is tighter and logs **one record per activation**: red freeze only when a tank is actually in reach (≲ 5.5); blue only for orbs, a dart that is actually close, or 3+ snakes; green only as a verified escape or a close that lands next to a target; yellow only when HP ≤ 3 or a hit is likely. 8–12 s cooldown after a use, longer after a zero-payoff, waived for real danger.
- Noodle only when healing is worth it (HP ≤ 3, or ≤ 4 with no axe/boss nearby and wave < 13). Abort starts an 8 s cooldown so the bot cannot immediately re-enter. Waves ≥ 13: noodles only at HP ≤ 2.

### 1/60 (6 trials, cap 4000, targetW=19)

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | B/wave | K/blade | Stall | Live |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v31 | 0 | 1 | 1 | 8.17 | 2 | 2 | 0 | 0 | 4.22 | 0.28 | 1158s/11 | |
| v33 | 0 | 0 | 0 | **10.67** | 3 | **3** | 0 | 0 | 3.56 | **0.41** | 5142s/28 | 8/1510 still alive, 0 true deaths, 34 blades, fake runs, noodle sink |
| v34 | 0 | 0 | 0 | **10.67** | **4** | 2 | **1** | 0 | **1.83** | 0.37 | 5431s/38 | |

v34 majority ≥10; one trial hit the 4000 s cap on wave 16 at HP 5 (first ≥15 on this clock). Blades/wave is about half of v33.

### 1/40

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | B/wave | K/blade | Stall | Live |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v31 | 0 | 0 | 1 | 8.83 | 2 | 2 | 0 | 0 | 3.25 | 0.24 | 1901s/24 | |
| v33 | 0 | 0 | 0 | **9.83** | **3** | **3** | **1** | 0 | 3.78 | 0.33 | 4488s/29 | |
| v34 | 0 | 0 | 0 | 9.17 | 2 | 2 | **1** | 0 | **1.16** | **0.58** | 3306s/29 | |

v34 beats v31 on mean and has 0 arrow (v31 had 1) and much fewer blades, but is slightly behind v33 on mean and ≥10/≥12.

### Hitch 8%

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | B/wave | K/blade | Stall | Live |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v31 | 0 | 0 | 0 | 9.83 | 3 | 3 | 0 | 0 | 2.98 | 0.39 | 702s/17 | |
| v33 | 0 | 0 | 0 | 7.50 | 2 | 1 | 0 | 0 | 3.09 | 0.50 | 1620s/24 | |
| v34 | 1 | 0 | 0 | **14.67** | **6** | **6** | **3** | 0 | **1.92** | 0.50 | 5111s/53 | |

v34 is far ahead on mean (all six trials ≥12, three ≥15, max 16) but has **1 water** at (−22.5, 8.7) wave 12, HP 3.5 — inward of the west plank, not a corner lip. Because of that safety regression, **stable stays v31** even though v34 has the higher mean on all three clocks. Wave 18 is still unreached; leftover axes and medusa orbs in 13–17 plus stall time remain the wall.

**Recommend testing live next: v34** (own dump key `__SB_dump_v34`). The logging/run-count/autosave fixes and the tighter blades/noodle policy are the point of this build; watch hitch water and whether blades/wave stay low.

## v34 live (20:00–21:03 CET, 23 Nov 2026) and stable pointer

Full write-up: `sumpfarena-deaths-v34.md`. Logs: `/home/box/Downloads/sumpfarena-v34-log-final.json` (20:35:58 CET, alive wave 17/4530), `…-final2.json` (20:43:30 CET, alive wave 20/5750/199 kills), `…-final3.json` (21:03:20 CET).

The first life reached **wave 21 / 6040 / 206 kills** and died at 20:44:00 CET to an **axe in `dodge-orb`** at (23.49, −17.32) — one wave past the “still alive on 20” dump. Two shorter lives followed (wave 7 fireball in `lure-spike`; wave 6 water / last chip axe in `stay-ring` after a knock inward of the south plank). The WebGL context had been lost ~20:16 (canvas black, HUD `ERR Cannot read properties of null (reading '22')`); logic kept running but jitter grew 1.1 → 2.4–3.1 s, and the bot sat in **hold-spike at speed 0 for ~3 min** at the start of run 3 (20:54–20:57, wave 1).

Because v34 actually reached wave 21 live, **`sumpfarena-bot.js` on `main` is now v34** (same blob as `sumpfarena-bot-v34.js`, dump key `__SB_dump_v34`). The earlier hitch-8% water in sim is still a known risk, but the live result outweighs keeping v31 as the stable pointer.

## v35 (wave-35 protocol)

Goal: WAVE 35. Sim protocol for this section: **6 trials**, cap **7000 s**, **targetW=36**, clocks 1/60, 1/40, hitch 8%. Wave table (`$a` in `app.beautified.js`): waves 19–30 are scripted (19 = 9 snakes + 3 axes; 20/24/27/30 = heavy medusa + bosses; 22 = 8 shields; 25/28 = 5 axes). Waves 31+ remap the *composition* only: `30 < b && (b = parseInt(26 + 4 * Math.random()))` rolls a 26–29 row, never wave 30’s row; the HUD wave `Xb` is unchanged. From wave 26, enemy `dt` is scaled by `min(Xb/25, 1.5)` (wave 35 → 1.40×; cap 1.50× at wave 38+). Player, fireballs, traps, noodles and blade pads are **not** scaled.

v35 live-session fixes (see `sumpfarena-deaths-v34.md`):

- **`'22'` / WebGL:** `F()` indexes `k.X.data[ix][iy]`; `data` starts `null` in `va()` until the map loads, and index 22 is the mid-plank. Uncaught `F()` in `runtimeSelfCheck` / `rebuildRingFromF` / `isPb` set `SB.err` and skipped `step()`, or made every cell look unwalkable. v35 guards `mapType`/`isPb` (geometric outer-ring fallback when the grid is missing), hooks `webglcontextlost` with `preventDefault`, skips `setSize` while lost, restores on `webglcontextrestored`, and never lets a map error abort `onNewRound`.
- **Full per-run reset:** `resetRunState` clears jitter/flips, spike waits, `spikeStuckSince`, pending blades, committed crossings, noodle cooldowns, and `hpEvents` on every new life **and** on mid-ring resume. Session log arrays are capped (~80 events) and persisted every 4 s.
- **hold-spike max-wait:** an independent `spikeStuckSince` timer (does not reset when `padKey` flickers). After 5 s standing in `hold-spike`/`wait-pad` (or a moving spike state with `avg < 0.4`) and not `committed`, force-cross when the pad is down and `safe ≥ 0.30`, or reverse after 8 s.
- **dodge-orb** scores both ring directions, refuses a step that is off-ring / `wouldFall`, and penalizes landing within axe/boss 3.5 or shield/grunt 2.2; requires score > 0.5.
- **lure-spike** is not entered (and is aborted) when a fireball is present or nearer than 8.
- **Off-ring recover:** if already inward of the plank, `recover-ring` / `keysTowardOuter` instead of `stay-ring` cutting the inner moat.
- Blade policy: prefer blue for orbs (`blue-orbs`, no empty `blue-darts`); `red-boss` when a boss is < 6 with orbs/melee; yellow only if already hurt so the hand is not blocked at full HP.

Dump key: `__SB_dump_v35`. Filename: `sumpfarena-v35-log-…`.

### 1/60 (6 trials, cap 7000, targetW=36)

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | ≥25 | ≥35 | B/wave | K/blade | Stall |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v34 | 0 | 0 | 0 | **10.83** | **4** | **2** | **1** | 0 | 0 | 0 | 1.95 | 0.35 | 6040s/41 |
| v35 | 0 | 0 | 0 | 8.67 | 2 | 2 | 0 | 0 | 0 | 0 | 0.96 | **0.54** | 3089s/22 |

v34 causes: axe 3, medusa 2, grunt 1; max 17. v35 causes: axe 2, fireball 1, grunt 1, medusa 1, shield 1; max 14.

### 1/40

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | ≥25 | ≥35 | B/wave | K/blade | Stall |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v34 | 0 | 0 | 0 | **9.17** | **2** | **2** | **1** | 0 | 0 | 0 | 1.16 | **0.58** | 3306s/29 |
| v35 | 0 | **2** | 0 | 8.00 | 1 | 1 | 0 | 0 | 0 | 0 | 0.81 | 0.49 | 2378s/16 |

v34 causes: axe 2, medusa 2, grunt 1, boss 1; max 15. v35 causes: fireball 2, spike 2, shield 1, axe 1; max 12. The two spike deaths (waves 4 and 9, south-east pad) are a safety regression in this clock.

### Hitch 8%

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | ≥25 | ≥35 | B/wave | K/blade | Stall |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| v34 | **1** | 0 | 0 | **14.67** | **6** | **6** | **3** | 0 | 0 | 0 | 1.92 | **0.50** | 5111s/53 |
| v35 | 0 | 0 | 0 | 8.00 | 1 | 1 | 0 | 0 | 0 | 0 | 0.73 | 0.43 | 4978s/25 |

v34 still has the known hitch water at (−22.5, 8.7) wave 12, but every trial reached ≥12 (max 16). v35 cleared water on this clock (and on the other two) but dropped hard on mean (max 12). Neither build reached ≥18 in sim — the live v34 wave-21 life is well ahead of the sim wall.

**v35 does not beat v34** on mean or ≥12/≥15 on any clock, and it adds two spike deaths at 1/40. Stable therefore stays **v34**. v35 is still the build to test live next if the goal is surviving a lost WebGL context, not freezing in hold-spike after a death, and avoiding the three v34 live death modes (dodge-orb into an axe, lure-spike into a fireball, stay-ring into the moat). Watch 1/40 spike crossings and whether the more conservative blade/dodge policy costs early waves.

## v36 (wave-35 protocol, v34 + minimal patches)

v35’s sim regression came from a more conservative blade/dodge policy. v36 is **v34 behaviour exactly**, plus only:

1. Stability: guarded `mapType`/`isPb` with a geometric outer-ring fallback while `k.X.data` is null, `webglcontextlost` + `preventDefault`, `setSize(..., false)` skipped while lost, map errors cannot abort `onNewRound`, `resetRunState` on every new life and mid-ring resume, log arrays capped (~80), persist every 4 s.
2. Independent `spikeStuckSince` (does not reset when `padKey` flickers). After 5 s standing in `hold-spike`/`wait-pad` (or a moving spike state with `avg < 0.4`) and not `committed`, force-cross when the pad is down and **`safe ≥ 0.35`** (v34’s threshold), or reverse after 8 s.
3. The three v34 live deaths only, minimal footprint: dodge-orb keeps v34’s 4.5 range and `loopDir`, but **rejects** a landing within **≤ 3.5** of an axe/boss (tries the other ring direction once); no `lure-spike` when a fireball exists or is nearer than 8 (and abort if one appears); if already off the outer ring, `recover-ring` outward instead of `stay-ring` cutting the moat.

Blade and noodle policy are unchanged from v34. Dump key: `__SB_dump_v36`. Sim protocol: **6 trials**, cap **7000 s**, **targetW=36**. Late-wave enemy `dt` scale (`min(Xb/25, 1.5)` from wave 26) and the 31+ composition remap (rolls 26–29) are in the sim (`world.js`).

### 1/60 (6 trials, cap 7000, targetW=36)

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | ≥25 | ≥35 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| v34 | 0 | 0 | 0 | 10.83 | 4 | 2 | 1 | 0 | 0 | 0 | 17 |
| v36 | 0 | 0 | 0 | **14.00** | **6** | **5** | **3** | 0 | 0 | 0 | 17 |

### 1/40

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | ≥25 | ≥35 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| v34 | 0 | 0 | 0 | **9.17** | 2 | 2 | 1 | 0 | 0 | 0 | 15 |
| v36 | 0 | 0 | 0 | 9.00 | 2 | 2 | 1 | 0 | 0 | 0 | 15 |

No spike deaths on 1/40 (v35 had 2). Mean is 0.17 below v34; ≥ counts match.

### Hitch 8%

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | ≥25 | ≥35 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| v34 | **1** | 0 | 0 | **14.67** | 6 | **6** | **3** | 0 | 0 | 0 | 16 |
| v36 | 0 | 0 | 0 | 13.50 | 6 | 4 | 2 | 0 | 0 | 0 | 16 |

v36 clears the hitch water at (−22.5, 8.7) but is slightly behind on mean. Neither build reached ≥18 in sim.

**Stable stays v34.** Rule was: promote v36 if mean ≥ v34 on at least two clocks and no new water/spike deaths. v36 has no new water or spike (hitch water went 1→0) and beats v34 clearly on 1/60, but 1/40 (9.00 vs 9.17) and hitch (13.50 vs 14.67) are both slightly below, so only one clock qualifies. `sumpfarena-bot.js` remains the v34 blob. v36 is the build to test live next for the WebGL/'22' hang and the three v34 live death modes.

## v37 (wave-35 protocol, v36 + hold-spike melee)

v36 live (21:18:37–21:39:50 Europe/Zurich, 23 Nov 2026): one real death at **wave 13 / 2980 / 107**, state `hold-spike`, **enemy/shield** at (−24.03, 15.16) on the west plank (`R38`). Wave 13 is 5 shields + 1 snake. A shield at dist 1.4 hit four times in ~3.5 s while the bot stood at a staging cell (~6 from the pad) and was knocked to the outer lip. Red was skipped (`onTrapState` + global `spikesUp()`). Canvas was stable, jitter 0.62 s, 0 water / 0 spike. Full write-up: `sumpfarena-deaths-v36.md`. The v34 live record (wave 21) still stands.

v37 = v36 plus only that hole: in `hold-spike` / `wait-pad` / other wait states, if a shield/axe/boss is within ~4 (grunt ~3.2; radius `× min(wave/25, 1.5)` from wave 26), do not stand still — attack if in range, sidestep along the ring away from the enemy (on-ring, not into a hot pad, not further outward), or use red/green if held (allowed even in a wait state as long as the bot is not on a pad). If already on the outer lip (`|x|` or `|z|` > 24.08), hug back toward 24. Blade/noodle policy otherwise unchanged. Dump key: `__SB_dump_v37`.

Sim: 6 trials, cap 7000 s, targetW=36.

### 1/60

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | ≥25 | ≥35 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| v34 | 0 | 0 | 0 | 10.83 | 4 | 2 | 1 | 0 | 0 | 0 | 17 |
| v36 | 0 | 0 | 0 | **14.00** | **6** | **5** | **3** | 0 | 0 | 0 | 17 |
| v37 | 0 | 0 | 0 | 13.17 | 5 | 5 | 1 | **1** | 0 | 0 | **18** |

### 1/40

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | ≥25 | ≥35 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| v34 | 0 | 0 | 0 | 9.17 | 2 | 2 | 1 | 0 | 0 | 0 | 15 |
| v36 | 0 | 0 | 0 | 9.00 | 2 | 2 | 1 | 0 | 0 | 0 | 15 |
| v37 | 0 | 0 | 0 | **14.67** | **5** | **5** | **2** | **1** | 0 | 0 | **21** |

### Hitch 8%

| Ver | Water | Spike | Arrow | Mean | ≥10 | ≥12 | ≥15 | ≥18 | ≥25 | ≥35 | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| v34 | **1** | 0 | 0 | **14.67** | **6** | **6** | **3** | 0 | 0 | 0 | 16 |
| v36 | 0 | 0 | 0 | 13.50 | **6** | 4 | 2 | 0 | 0 | 0 | 16 |
| v37 | 0 | 0 | 0 | **14.67** | 5 | 5 | **3** | **1** | 0 | 0 | **24** |

v37 is **not worse**: 0 water / 0 spike / 0 arrow on all clocks, first ≥18 on every clock (hitch max 24, 1/40 max 21). Mean is slightly below v36 on 1/60 (13.17 vs 14.00) but well above v34, and well above both on 1/40; hitch ties v34’s mean with no water. Stable stays v34 (not re-evaluated here). v37 is the build to test live next for the wave-13 hold-spike shield death.
