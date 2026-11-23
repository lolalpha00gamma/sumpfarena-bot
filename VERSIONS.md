# Sumpf-Arena bot versions

Injectable bots for the TOGGO Ninjago Sumpf-Arena. Stable loader is always `sumpfarena-bot.js` on `main` (currently **v31**). Variant files on `main` can be loaded independently via the SHA-pinned jsDelivr URLs below. Each variant uses its own HUD version string, dump key (`__SB_dump_v32.x`), and download filename (`sumpfarena-v32.x-log-…`) so live logs never mix.

Sim protocol (all numbers below): 11 trials, cap 2400 s, target wave 13, seeds `4000+i*97`. Clocks: `1/60`, `1/40`, and hitch 8% (40–100 ms). v31 spike gating (2.5 disk, CROSS=0.70) is unchanged in every v32 variant.

## Variants

| Variant | Branch | Idea | SHA-pinned jsDelivr |
|---|---|---|---|
| v31 (stable) | `main` | Conservative spike gate, dt-aware, pr=0.5, watchdog, noodle abort | See commit `729799f2bfad1dfff43b5dbf155cd5f01b1e8aea` — `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@729799f2bfad1dfff43b5dbf155cd5f01b1e8aea/sumpfarena-bot-v31.js` |
| v32.1 | `v32.1` | Water-edge margin: never correct toward the inner moat; only pull back when already past the outer lip (`|x|` or `|z| > 24.2`) toward the ring line at 24. Plus all shared v32 fixes below. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@97d04b89a1d6c9020fa617a9e9a7823d4e334788/sumpfarena-bot-v32.1.js` |
| v32.2 | `v32.2` | Earlier enemy dodging: larger yield radius (6/7), yield = move-away along the ring instead of standing, no cut-inner with an enemy within ~6.5. Plus all shared v32 fixes. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@97d04b89a1d6c9020fa617a9e9a7823d4e334788/sumpfarena-bot-v32.2.js` |
| v32.3 | `v32.3` | Both: water-edge margin and earlier enemy dodging, plus all shared v32 fixes. | `https://cdn.jsdelivr.net/gh/lolalpha00gamma/sumpfarena-bot@97d04b89a1d6c9020fa617a9e9a7823d4e334788/sumpfarena-bot-v32.3.js` |
| v33 | `main` (file `sumpfarena-bot-v33.js`) | Built on v32.1. Uses every Zeitklinge colour deliberately (see `sumpfarena-blades.md`). Fixes v32.1 live bugs: death recording, dump heartbeat, spike-gating livelock, stall hunting. | _(filled after push)_ |

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
