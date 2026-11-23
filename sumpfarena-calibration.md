# Sumpf-Arena sim calibration (v30–v39 live vs sim)

Date: 2026-11-23 (Europe/Zurich). Goal: measure why the sim (means 11–15) was not predicting live, fix the biggest mismatch, and stop patching one death at a time against an uncalibrated model.

Live best waves (one recorded life each after v34, plus v34’s three recorded lives): **v34 w21 / 6040 / 206**, v36 w13, v37 w16, v38 w8, v39 w9. That ranking is **best wave**, not a mean. v34’s same session also died at wave 6 (water, stay-ring) and wave 7 (fireball, lure-spike).

## 1. Logs used

Deduped finals under `/home/box/Downloads`. Skipped `v33-log-10*` and the duplicate `v33-log-20 (*)`.

| log | ver | deaths | session min (frames×p50 dt) | jitter |
|-----|-----|--------|------------------------------|--------|
| v30-log-final | 30 | 10 | 20.71 | — |
| v31-log-final | 31 | 17 | 22.06 | — |
| v32.1-log-final | 32.1 | 1 (boot) | 10.65 | 0.61 |
| v33-log-20 / 30 / final | 33 | 5 / 0 | 42.12 combined | 0.62–1.67 |
| v34-log-final / final2 / final3 | 34 | 0 / 0 / 3 | 93.89 combined | 1.08–3.10 |
| v36-log-final | 36 | 1 | 19.91 | 0.62 |
| v37-log-final | 37 | 1 | 23.79 | 0.57 |
| v38-log-final | 38 | 1 | 7.19 | 0.58 |
| v39-log-final | 39 | 1 | 13.01 | 0.78 |

Notes:

- v31’s death list repeats several v30 scores/causes (likely leftover `localStorage`). Treat v31 spike DPM as inflated.
- Top-level `hpEvents` is a last-N cap (often 2–3). Per-life chains live under `deaths[].hpEvents`. Long lives are undercounted if you only read the top-level array.
- HP events have **no `state` and no `wave`**. Only a fatal hit has `death.state` / `death.wave`. “Hits while in each state” is therefore complete only in the sim (after the `brainState` hook). Live state evidence is fatal-only.
- Session minutes use `dt.frames * dt.p50` when present (better than wall time for paused overlays).

## 2. Live damage per minute by source

Minutes = session frames × p50 dt. Hits = unique HP events in that log (death chains + top-level, deduped in the analysis script).

| ver | min | hits | dmg | dpm | top sources (dpm) |
|-----|-----|------|-----|-----|-------------------|
| v30 | 20.71 | 72 | 73.0 | 3.52 | spike 2.75, grunt 0.29, fireball 0.19 |
| v31 | 22.06 | 117 | 118.5 | 5.37 | spike 3.11 (tainted), grunt 0.63, snake 0.54 |
| v32.1 | 10.65 | 7 | 7.5 | 0.70 | snake 0.28, grunt 0.28, fireball 0.14 |
| v33 | 42.12 | 45 | 56.0 | 1.33 | snake 0.43, axe 0.33, grunt 0.24, fireball 0.21 |
| v34 | 93.89 | 94 | 125.0 | 1.33 | fireball 0.35, axe 0.34, snake 0.23, grunt 0.20, shield 0.15 |
| v36 | 19.91 | 13 | 14.5 | 0.73 | fireball 0.23, snake 0.20, shield 0.20, grunt 0.10 |
| v37 | 23.79 | 9 | 13.0 | 0.55 | axe 0.17, fireball 0.13, grunt 0.08, snake 0.04 |
| v38 | 7.19 | 9 | 9.0 | 1.25 | grunt 0.63, snake 0.28, fireball 0.21, boss 0.14 |
| v39 | 13.01 | 11 | 11.5 | 0.88 | **snake 0.50**, fireball 0.31, spike 0.08 |

### v34–v39 combined (the current live line)

157.8 min, 136 hits, 173 dmg, **dpm 1.10**.

| source | hits | dmg | dpm | share |
|--------|------|-----|-----|-------|
| fireball | 31 | 46.0 | **0.29** | 26.6% |
| enemy/axe | 19 | 36.0 | **0.23** | 20.8% |
| enemy/snake | 34 | 35.5 | **0.22** | 20.5% |
| enemy/grunt | 27 | 27.5 | 0.17 | 15.9% |
| enemy/shield | 17 | 19.0 | 0.12 | 11.0% |
| spike / boss / boss2 / unknown | 8 | 9.0 | 0.06 | 5.2% |

Dominant live chip after the early spike/water era is **fireball + axe + snake**. v39 itself is snake-heavy (0.50 dpm) and died in `yield` to a snake at distance 1.14 after a ~60 s chip/heal/fireball chain.

Wave-bucket DPM is not trustworthy from these logs: events are not tagged with wave, and last-N event caps undercount earlier waves of long lives. Fatal wave of each life (best / others):

- v34: **21** (axe, dodge-orb), also 7 (fireball, lure-spike), 6 (water, stay-ring)
- v36: 13 (shield, hold-spike)
- v37: 16 (fireball, lure-spike)
- v38: 8 (grunt, lure-spike)
- v39: 9 (snake, yield)

### Live hit geometry

Snake hits (all vers, n=68): **mean 1.68, min 0.89, max 2.93**. v39’s seven hits mean 1.49 (fatal 1.14).

Other melee means: grunt 1.71, shield 1.52, axe 2.12 (max 3.73), boss 2.40. This matches game `Ge()` / `Db()`: snake V=1, zb=1, hit if `dist(player, sa) < 1+zb` with `sa` placed `V` along facing (~just under 3 when aligned).

Snake inter-hit gaps (within a life, n=19): mean 3.96 s, median **2.27 s**. v39’s first three gaps were 2.28 / 2.26 s ≈ windup+active+recovery (1.0+0.7+0.5 = 2.2 s). So live snakes **finish** a started windup and walk during it; they do not cancel when the player steps out.

### Fatal cause × state (all vers)

Mostly leftover early bugs: spike/leave-pad (10), water/loop (8), boot (3). Later-line fatals: fireball in lure-spike or dodge-orb, shield in hold-spike (v36), grunt in lure-spike (v38), **snake in yield (v39)**.

## 3. Uncalibrated sim (same 6-trial 1/60, cap 7000, targetW 36, seedBase 4000)

| ver | mean | max | snake dpm | fireball dpm | axe dpm | fake medusa melee dpm |
|-----|------|-----|-----------|--------------|---------|------------------------|
| v34 | 10.83 | 17 | **0.005** | 0.144 | 0.912 | 0.182 |
| v37 | 11.33 | 14 | **0.007** | 0.158 | 0.539 | 0.286 |
| v39 | 11.00 | 14 | **0.020** | 0.182 | 0.418 | 0.293 |

This is the prediction failure. Live snake dpm is ~0.22 (v39 0.50); the sim almost never landed a snake hit. Meanwhile it invented `enemy/medusa` melee (live medusas **only shoot**) and over-damaged axes.

Root cause in `world.js`, versus `app.beautified.js` `Ge()` / `Db()` / `Ra()`:

1. Sim cancelled windup if the player left `reach+1`. The game does **not** cancel a started windup.
2. Sim froze the enemy for the whole windup. The game **walks during windup and recovery**, and only freezes in active (`Ya`).
3. Sim tested `dist(player, enemy) < reach+1.2` at the end of windup. The game places a hit sphere `sa` at `V` along facing and hits if `dist(player, sa) < 1+zb`.
4. Medusas (`Xa`) have a huge shoot reach (13) and no melee; when LoS failed they fell into the melee branch and punched the player.

Yield was also a policy hole, not a sim-physics hole: with `V32_DODGE=false` (v34–v39) the bot may **stand still** for 0.5–0.9 s or cut `innerSafeCell` without swinging. v37’s close-range `pulseAttack` at 3.2 runs only in wait/hold-spike and **skips snakes**. That is exactly the v39 live death (snake at ~1.0–1.5 in `yield`).

## 4. What was patched in the sim

`/workspace/sumpfarena-sim/world.js` (and a `brainState` hook in `run.js` so HP events record `wave` + `state`):

- TYPES now carry `zb` (snake/grunt/shield 1, axe 2, boss 1.5).
- Windup starts at `dist < V+1` with a facing cone, same as live.
- Windup is **not** cancelled by leaving range.
- Walk during windup/recovery; freeze only in active.
- Strike via hit sphere `sa` at `reach` toward the player; hit if `dist(player, sa) < 1+zb`.
- Medusas shoot only — no melee branch.

Did **not** change: snake speed (7), player speed (8), fireball physics (accel 5, cap 9, radius 1.5, 1.5 dmg, 4 s life), axe `V/zb/dmg`, frame dt (official clocks stay 1/60, 1/40, hitch 8%). Axe over-damage must not be “fixed” by nerfing below game values.

## 5. Calibrated sim, same protocol (6 × 1/60)

| ver | mean | std | max | min | snake dpm | snake dist | fireball dpm | axe dpm | yield dmg/min |
|-----|------|-----|-----|-----|-----------|------------|--------------|---------|---------------|
| v34 | 10.00 | 3.79 | 15 | 6 | **0.314** | 2.04 | 0.106 | 0.986 | 31.5 / 156.3 ≈ **0.20** |
| v37 | 12.00 | 4.73 | 17 | 5 | **0.260** | 2.09 | 0.085 | 1.057 | 67.5 / 211.9 ≈ **0.32** |
| v39 | 12.17 | 5.18 | 20 | 5 | **0.294** | 2.13 | 0.054 | 1.209 | 70.0 / 193.6 ≈ **0.36** |

- Snake DPM is now in the live ballpark (0.26–0.31 vs live 0.22; still shy of v39’s 0.50). Fake medusa melee is **gone**. Snake hit distance is a bit long (2.05–2.13 vs live 1.68) but inside the live max (2.93).
- Fireball DPM **fell** (0.05–0.11 vs live 0.29) — still under. Not patched further this round; later lives in sim die more often to axes before fireball chip accumulates.
- Axe DPM is still high (0.99–1.21 vs live 0.23). Leaving game `V=3, zb=2, dmg=2` unchanged. This is the largest remaining quantitative miss and it dominates late-wave causes in the sim (`enemy/axe` is most deaths after calibration).
- Yield chip is real in the calibrated sim and **worse on later bots** (v34 0.20 → v37 0.32 → v39 0.36). That matches the live diagnosis: later versions spend more time standing in `yield` and eat snake/grunt chips there.

## 6. Ranking: we did not get v34 > v37 > v38/v39

The brief asked the calibrated sim to rank like live best-waves (v34 > v37 > v38/v39). After the melee fix, 1/60 means are still **v39 12.17 ≥ v37 12.00 > v34 10.00**.

Honest reading:

- Live “v34 w21” is a **high-variance tail** in a session that also died at w6 and w7. One life is not a mean.
- Later bots (v37–v39) carry the v36–v38 live-death patches (lure/fireball, hold-spike melee, no lure at HP≤2.5) and, on this 6-trial slice, survive slightly longer — but they also leak more yield chip, which is what killed v39 live.
- 6 trials cannot force a tail-ranking. We did not invent a second “live-like” knob (for example nerfing axes or buffing fireballs) just to put v34 first, because that would hide the yield/snake problem the live line is actually dying to.

So the calibrated sim is used to **target the dominant live damage** (snakes in melee / yield, fireball dodge at low HP), not to rubber-stamp v34 as the only base.

## 7. v40 built from this calibration

Base: **v39** (full live-death patch lineage; calibrated 1/60 tied/better vs v34). Not a rollback to v34.

Policy only (game physics already calibrated):

1. **Attack any snake within 2.2**; **must swing at ≤1.5**, including in yield / reverse / loop. Live v39 died yielding with a snake at 1.0–1.14.
2. **Yield always `ringAlong`** — never stand still, never `innerSafeCell` while boxed in.
3. **Dodge-orb range 8 at HP≤2.5** (same 8 already used during lure-spike / abort-lure in v38+).

Wired as `createV32Brain("40")` with dump key `__SB_dump_v40`. Official 6 trials × 3 clocks on the **calibrated** sim vs v34 / v37 / v39 (cap 7000, targetW=36, seedBase 4000):

| clock | v34 mean (max) | v37 mean (max) | v39 mean (max) | v40 mean (max) | water/spike |
|-------|----------------|----------------|----------------|----------------|-------------|
| 1/60 | 10.00 (15) | 12.00 (17) | **12.17 (20)** | 5.83 (6) | all 0/0 |
| 1/40 | **13.83 (15)** | 13.67 (16) | 13.50 (20) | 6.50 (10) | all 0/0 |
| hitch 8% | **9.50 (14)** | 7.17 (12) | 6.50 (7) | 6.50 (8) | all 0/0 |
| 3-clock avg | **11.11** | 10.95 | 10.72 | 6.28 | |

v40 is **not kept**. No new water/spike, but every clock is worse (1/60 collapses to waves 5–6, five of six deaths `enemy/axe`). Always-moving yield / chasing a snake along the ring walks into axe reach around wave 6 — the same class of regression that withdrew earlier survival-movement patches. Bot file is on disk only; not pushed. Dump key unused. Stable remains **v34**.

Across the three calibrated clocks, v34 has the best 1/40 and hitch means and a slightly better 3-clock average than v37/v39. v37/v39 still win 1/60. That is closer to the live best-wave order than the uncalibrated sim was, but it is not a clean v34 > v37 > v39 ranking, and live sample size is still one life per later version.

## 8. Remaining sim error

| channel | live v34–v39 | calibrated sim | action |
|---------|--------------|----------------|--------|
| snake dpm | 0.22 (v39 0.50) | 0.26–0.31 | fixed enough |
| snake hit dist | 1.68 | ~2.1 | acceptable |
| fireball dpm | 0.29 | 0.05–0.11 (then 0.15–0.16 after pass 2) | see §9 |
| axe dpm | 0.23 | 0.99–1.21 (then 0.14–0.26 after pass 2) | see §9 |
| medusa melee | 0 | 0 (was 0.18–0.29) | fixed |
| yield chip | fatal v39; no per-hit state in logs | 0.20–0.36 dpm, rising | addressed in v40 policy |

Raw bench JSON: `/tmp/sb-calib/sim-dpm-before.jsonl`, `/tmp/sb-calib/sim-dpm-after.jsonl`. Live text dump: `/tmp/sb-calib/live-analysis.txt`.


## 9. Second calibration pass (fireball + axe)

Date: 2026-11-23 late evening, Europe/Zurich. Checked medusa orbs and axe aggro against `app.beautified.js`.

### Fireball / medusa (class `wa` / `Xa`) — physics already matched

- Homing is **not** turn-rate limited. While `velocity.length() < 9`, the orb adds `5 * dt` acceleration toward the player, then coasts at 9. Life 4 s, pool cap 20, destroyed on `Xa` cells.
- Contact test in `wa.update` is `distanceTo(player) < 1.5`. `Db(..., 1.5, 1.5)` would allow 2.5, but it only runs after the 1.5 check, so the effective hit radius stays **1.5**. A live `nearestFireball=1.95` event is a *second* orb after the hitting one was destroyed, not evidence of a 2.5 radius.
- Cadence: windup 0.3 + active 0.45 + recovery 1.8 = 2.55 s, facing cone `Ra` (dot > 0.5), LoS `Sa` (blocked only by `Xa` cells). LoS-fail goes to recovery 1.8 s. Enemy wave-dt scale does **not** apply to orbs.
- Those numbers were already in the sim. Buffing radius or fake inaccuracy would have been wrong.

### Axe — sim was aiming perfectly

Game `Ge()` places the hit sphere `sa` along **mesh facing**, not toward the player, and `Ra` must be true to *start* windup. Enemies slerp facing at `dt * Ab` except during the active swing (`Ya`). Axe `Ab = 1.8` is slow (snake 6, grunt 5, shield 1, medusa 5, boss 4). During the 0.8 s axe windup a circling player can leave the cone; the old sim placed `sa` on the player at strike time, so axes almost never missed.

Patched in `world.js`: per-type `turn`, start windup/shot only if `facing · toPlayer > 0.5`, `sa` along facing, turn during windup/recovery.

### Pathing — sim was 4-connected, game `Pa()` is 8-connected

`Pa`/`T` uses cardinal cost 1 and diagonal 1.4, and only allows a diagonal if both adjacent cardinals are open. 4-connected A* sent medusas (and other enemies) around the outer ring, across corner spike pads, *before* they reached shoot range 13 from the courtyard. One 74 min v34 trial spawned only 18 orbs; medusas died on spikes (9) and water (5), with 25 s in range out of 535 s of medusa-time.

8-connected paths from a side door to the opposite ring go **through the interior**. Voluntary steps that would leave `pb` are now clamped (game `L()` does not walk onto `oc`); only knockback can throw an enemy into water.

### DPM after pass 2 (6 × 1/60, cap 7000, seedBase 4000)

| ver | mean | snake dpm | axe dpm | fireball dpm | vs live combined (0.22 / 0.23 / 0.29) |
|-----|------|-----------|---------|--------------|----------------------------------------|
| v34 | 17.00 | 0.228 (1.04×) | 0.255 (1.11×) | 0.164 (0.57×) | axe/snake in band; fireball still short |
| v37 | 17.00 | 0.144 (0.65×) | 0.135 (0.59×) | 0.155 (0.53×) | axe/snake just below 1/1.5; fireball short |
| v39 | 17.33 | 0.130 (0.59×) | 0.141 (0.61×) | 0.152 (0.52×) | same pattern |

Axe over-damage is fixed (was 0.99–1.21). Snake stays near live. Fireball rose from 0.05–0.11 to **0.15–0.16** but is still ~0.5× live 0.29 (target was 0.19+). Orbs/min is only ~0.3–0.4: a medusa in the courtyard is in range 13 only when the player is near a mid-side of the ring; off-axis, they still have to step onto the ring. Live fireball DPM also includes late-wave exposure and worse dodge (jitter 0.6–3 s, hitch). We did not inflate reach or hit radius to close the last gap.

### Ranking (6×3, same protocol, before the v34 4.5-dodge fidelity hook)

| clock | v34 mean (max) | v37 mean (max) | v39 mean (max) |
|-------|----------------|----------------|----------------|
| 1/60 | 17.00 (21) | 17.00 (20) | **17.33 (24)** |
| 1/40 | **15.00 (19)** | 14.83 (23) | 12.83 (16) |
| hitch 8% | 12.50 (23) | **14.17 (21)** | 13.83 (23) |
| 3-clock avg | 14.83 | **15.33** | 14.66 |

Live best-waves are still v34 w21 > v37 w16 > v39 w9, but that is one life each (v34’s session also died w6/w7). The calibrated 3-clock average does **not** force v34 ≥ v37 > v39; v37 is slightly ahead. We did not add a fake knob to manufacture that order.

## 10. v40 from v34 (kept)

The first v40 (from v39: always-move yield + swing any snake ≤ 2.2) was withdrawn — 3-clock avg 6.28, wave-6 axes. This rebuild starts from **v34** (live best) and targets the top live sources: fireballs first, then regen and blade use.

Candidates (max 4, each screened; official 6×3 only for improvers):

- **C1** (withdrawn): aggressive bait *toward* the orb, then sidestep; red freeze on traps; noodles at HP≤4; wider danger blades. 1/60 mean **10.67** vs v34 15.83, plus a spike death and two early snakes. Bait walked into pads and melee.
- **C2** (kept):
  1. **Orb bait/sidestep, conservative.** Homing orbs commit acceleration for ~1.8 s, then coast at 9. v34 already continues `loopDir` at range 4.5. C2 keeps that, and: if *waiting on a pad/stage* with an orb at ≤8, start moving along `loopDir` so the orb does not home onto a stand-still; at **≤3 units**, sidestep the safer ring side only if it beats `loopDir` by a clear margin (and never into an axe/boss or a hot spike pad).
  2. **Danger blades.** Wider danger (HP≤3 with threats, incoming orb <8, or two melee in 4). Yellow arms at HP≤4; green escape also at orb <8. Red still will not fire while planted on a trap (C1’s red-on-traps was dropped).
  3. **Earlier noodles.** Heal at **HP≤4** when the path is safe; still only at HP≤2 if an axe/boss/shield is within 12 (or anyone within 3.2). The wave-13 “stop healing” gate is gone.

The sim v34 brain was also given the live v34 **4.5 dodge-orb** (it had been sitting only in the v36 block). The keep bar below is that corrected v34, same seeds.

### Official 6×3 (calibrated sim, cap 7000, targetW=36, seedBase 4000)

| clock | v34 mean (max) | v40 C2 mean (max) | water/spike |
|-------|----------------|-------------------|-------------|
| 1/60 | 15.83 (24) | **16.67 (21)** | v34 1/0; v40 0/0 |
| 1/40 | 14.33 (17) | **14.67 (19)** | 0/0 |
| hitch 8% | 11.83 (17) | **13.00 (26)** | 0/0 |
| 3-clock avg | 14.00 | **14.78** | |

v40 wins all three clocks, has no water/spike, a higher 1/60 floor (min 14 vs 7), and a hitch timeout at **wave 26**. Means are still inside trial std (~3–6), but the sign is the same on every clock. **Kept and pushed.** Dump key: `__SB_dump_v40`. Stable remains **v34** (this brief did not flip stable).

## 11. Remaining sim error (after pass 2)

| channel | live v34–v39 | sim after pass 2 | notes |
|---------|--------------|------------------|-------|
| snake dpm | 0.22 (v39 0.50) | 0.13–0.23 | in / near the 1.5× band |
| axe dpm | 0.23 | 0.14–0.26 | fixed; was 4–5× high |
| fireball dpm | 0.29 | 0.15–0.16 | still ~0.5×; range-13 geometry + sim dodge |
| grunt / shield | 0.17 / 0.12 | often 0.06–0.09 | a bit low after 8-connected approaches |
| medusa melee | 0 | 0 | stays fixed |

Raw benches: `/tmp/sb-calib/sim-dpm-cal2.jsonl`, `/tmp/sb-calib/official-cal2.log`, `/tmp/sb-calib/official-v40-c2.log`.
