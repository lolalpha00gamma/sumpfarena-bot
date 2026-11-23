# Sumpf-Arena live deaths — v38

Log: `/home/box/Downloads/sumpfarena-v38-log-final.json` (dumped 22:48:09 Europe/Zurich, 23 Nov 2026). Ver 38, lite `pr=0.5 no-shadow`, 19869 frames, jitter **0.58 s**, dt p50 0.022 / max 0.40 s, canvas stable. One real death, then a short alive run 2 (at dump: wave 3 / 290 / 8, HP 5, `loop` at (23.85, −13.5)).

Live line so far (best life per build): **v34 wave 21 / 6040 / 206**, v36 wave 13 / 2980 / 107, v37 wave 16 / 3890 / 131, **v38 wave 8 / 1460 / 44**. One short v38 sample; variance is high. The new hole is not the v37 fireball-at-9.5 miss (that patch had nothing to veto here) — it is **staying in `lure-spike` at low HP and getting chained by melee**.

## The death

22:46:42.138 Europe/Zurich, **1460 / wave 8 / 44 kills**, state `lure-spike`, waypoint **`R26 -24,-15 path`**, pos (−23.93, −15.01), reason **`enemy/grunt`** (grunt at 1.54; 1 enemy still live; fireball 99; pad 5.99; spikes down in 0.17 s; `onSpikePad` false).

Wave 8 is 3 snakes, 2 grunts, **1 boss** (first boss), no medusas.

### HP 5→0 in 15.8 s

| Time | Δ | Cause | HP | Pos | Notes |
|---|---|---|---|---|---|
| 22:46:26.365 | 0:00 | **enemy/boss** amt 1 | 5→4 | (23.98, −21.41) | **On a spike pad** (pad 0.41), spikes down in 0.88 s, boss at **1.42** |
| 22:46:27.522 | +1.16 s | **fireball** amt 1.5 | 4→2.5 | (23.80, −18.22) | Moved north on the east plank; fb 99 at tick (orb consumed); snake 1.49, pad 2.79 |
| 22:46:28.967 | +2.60 s | **enemy/grunt** amt 1 | 2.5→1.5 | (20.28, −24.14) | **On a spike pad** again (pad 0.73), around the SE corner, grunt 1.80 |
| 22:46:40.979 | +14.61 s | **enemy/grunt** amt 1 | 1.5→0.5 | (−24.06, −19.05) | After **~12 s** still luring, now on the west plank; grunt 1.86, pad 1.95 |
| 22:46:42.138 | +15.77 s | **enemy/grunt** amt 0.5 | 0.5→0 | (−23.93, −15.01) | Still `lure-spike` toward R26; grunt 1.54 |

Earlier chips in the same life (all healed back to 5 before the chain): 22:41:29 snake 4→3 at (23.92, 6.23); 22:43:17 snake 5→4 at (23.85, −6.18); 22:45:06 grunt 5→4 at (9.34, −23.48).

Player i-frames after a hit are **1 s** (`Oa = Ad = 1`). The first three lethal-chain hits are spaced ~1.16–1.45 s — just outside i-frames — and the last two are 1.16 s apart. The bot spent those windows **continuing `lure-spike`** instead of leaving the pad / fleeing along the ring, then walked from the SE corner to the west plank for ~12 s at HP 1.5, straight into the same (or another) grunt.

### Why v38 `lureUnsafe` did not abort

v38 already refuses lure when a live orb exists, an orb is incoming, nearest orb < 12, or (HP ≤ 3) a medusa has LoS within 13. Wave 8 has **no medusa**. At the later hits `nearestFireball` was 99 (the mid-chain orb was already gone). There is **no HP ≤ 2.5 lure veto**, so at HP 1.5 the bot was still allowed to start and keep `lure-spike` toward R26.

Hands were empty for the chain. Last wave-8 blade was `green-close` at bot-t 532 (boss 7.72, snake 8.44, 1 kill), ended 538. No yellow was armed, so there was no rewind on the 4→2.5 / 2.5→1.5 hits. 12 blades this session (10 in the dead life): green-close 5, blue-darts 2, red danger-melee 1, red advantage-tank 1, yellow-arm 1; plus run 2 blue-darts and a yellow-rewind-hp that actually paid (1 kill, 1 escape).

## What v39 is (minimal, kept)

Base is **v38** (sim-tied with v37 on the paired protocol; keeps the accurate orb count / 12-unit lure gate that v37 needed). Live w8 is one short sample and does not undo that patch.

Kept: **no `lure-spike` at all when HP ≤ 2.5** (entry and abort). That is the hole that let the bot walk ~12 s toward R26 at HP 1.5.

Tried and **withdrawn** (new spike / water deaths and early-wave melee deaths in sim): perpetual HP≤2 flee along the ring, i-frame escape after every chip, a ≥2-melee-within-5 lure veto at full HP, leave-pad movement next to a boss, and extra defensive blade fires at HP≤2. Those belong in a later pass with a pad-safe path, not in this keep.

Leftover-axe hunt stays withdrawn. Blade/noodle policy otherwise unchanged. Dump key: `__SB_dump_v39`.

## Prior lives, briefly

| Ver | Best life | Death | Notes |
|---|---|---|---|
| v34 | **wave 21 / 6040 / 206** | dodge-orb into an axe; later fireball in lure-spike; water in stay-ring | Long-session collapse after WebGL loss (jitter → 3.1 s). Still the live record. |
| v36 | wave 13 / 2980 / 107 | shield in **hold-spike** on the west lip | Canvas stable; v37 sidestep/red-in-wait fixed this hole. |
| v37 | **wave 16 / 3890 / 131** | fireball in **lure-spike** toward R41 | Orb at 9.5 slipped the 8-unit / `k.Vc.active` gate. `unknown` 3→1 amt 2 was an axe past the 5.5 classifier. Wave-14 leftover-axe stall (~4 min) still open. |
| v38 | wave 8 / 1460 / 44 | grunt in **lure-spike** toward R26 | Canvas stable, jitter 0.58 s; orb-count patch had nothing to veto (no medusa, no live orb). Chained 5→0 in 16 s while luring at low HP, including a boss hit on a pad. |

v38 did not recapture the v37 line. The shared pattern across v37 and v38 deaths is **staying in `lure-spike` after being chipped**, not a regression of the hold-spike or WebGL fixes (those have not recurred).
