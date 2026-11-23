# Sumpf-Arena deaths — v36 live, plus v34 recap

All times are Europe/Zurich (UTC+1). Goal remains **wave 35 live**; the v34 live record is still **wave 21**.

## v36 session (21:18:37–21:39:50, 23 Nov 2026)

Source: `/home/box/Downloads/sumpfarena-v36-log-final.json` (9672 B). Ver 36, lite `pr=0.5 no-shadow` (context **not** lost), frames 47025, dt p50 25.4 ms / p95 31.8 ms / max 437 ms, over40 410, jitter **0.62 s**, dirFlips 1277. Canvas stayed stable; no `'22'` error, no water, no spike deaths.

The dump records 2 “runs”: a boot snapshot at 21:18:37 (score 0 / wave 1 / (0,0), not a death) and one real game-over. At dump the bot was alive again on run 2, wave 7 / 1130 / 37 kills, HP 5, state `noodle`.

### The death — 21:35:02, wave 13 / 2980 / 107 kills

| | |
|---|---|
| Pos | (−24.03, 15.16) — west plank, waypoint `R38 -24,15 path` |
| State | **hold-spike** |
| Cause | **enemy/shield** (dist 1.44, 3 enemies live) |
| Knock | dx −0.11, dz +7.01 (mostly north along the plank) |
| Nearest pad | 5.84 (not on a pad; staging, waiting) |

Wave 13’s composition is **5 shields + 1 snake** (`$a`: `[1,0,5,0,0,0,0]`). This is a leftover-shield wave, not an orb/boss wave.

Last 8 HP chips on that life (the death record; current-life `hpEvents` were cleared on restart):

| Time | T−death | Cause | HP | Pos | Nearest | Pad | Spikes |
|---|---:|---|---|---|---|---:|---|
| 21:34:33 | 29.3 s | fireball | 5→3.5 | (26.77, 6.00) outward of east plank | medusa 5.67, fb 99 at tick | 15.3 | down 0.34 s |
| 21:34:35 | 26.8 s | fireball | 5→3.5 | (24.02, −3.14) | medusa 5.49 | 17.9 | down 0.34 s |
| 21:34:39 | 22.9 s | fireball | 3.5→2 | (24.11, −15.16) | snake 3.29 | 5.8 | down 1.47 s |
| 21:34:53 | 9.1 s | snake | 5→4 | (−3.10, 24.05) | snake 1.41 | 17.9 | down 0.26 s |
| 21:34:58 | 3.55 s | **shield** | 4→3 | (−23.40, 13.66) | shield **1.42** | 7.37 | **up** |
| 21:34:59 | 2.35 s | **shield** | 3→2 | (−23.42, 14.89) | shield 1.50 | 6.14 | down 1.10 s |
| 21:35:01 | 1.15 s | **shield** | 2→1 | (−24.16, 15.07) | shield 1.48 | 5.93 | **up** |
| 21:35:02 | 0.01 s | **shield** | 1→0 | (−24.03, 15.16) | shield 1.46 | 5.84 | down 1.26 s |

A fireball volley on the east plank ~25 s earlier took HP to 2; HP is 5 again by 21:34:53 (noodle and/or a earlier yellow rewind — three `yellow-rewind-hp` uses were logged on waves 7–9). A snake chip to 4, then a **shield stunlock** at the west staging cell: four hits, ~1.15–1.2 s apart (shield windup + active + recovery + i-frames), while the bot stood in `hold-spike` waiting for a pad ~6 units away. Shield knockback is 18, the same as most melee. The pose walked from x=−23.40 (slightly inward of the ring line) to x=−24.16 (outer lip). The bot died on the outer west edge, still holding, still not on the pad.

### Why hold-spike stood still

- `hold-spike` is a wait: keys eventually go empty once the bot is at the staging cell (`nearStage`). The 5 s `spikeStuckSince` timer only force-crosses when the pad is *down* and `safe ≥ 0.35`; it does not react to an enemy in reach.
- **Red freeze is skipped** in any trap wait (`onTrapState` includes `hold-spike` / `wait-pad`) **and** whenever `spikeHot` is true. `spikeHot` includes **global** `spikesUp()`, so red is also refused during the up half of the cycle even when the bot is not on a pad. Two of the four lethal chips were during spike-up.
- Attack-knockback (`pulseAttack` behind a trap) is only considered from `loop` / `time-spike` / `lure-spike` / `yield`, not from `hold-spike`.
- The narrow-plank abort is **snake-only** (`abort-plank` when a snake is within 6.5). A shield at 1.4 does not trigger it.
- `findTank` (used for hunt/freeze-melee) is axe/boss/boss2 only — shields are ignored.
- Wave 13 opened with a `green-close` (shields already at 6.4 and 8.2). Hands were likely empty during the beatdown. 9 of 10 blues this session were `blue-darts` (v34 policy, often 0 payoff); that did not cause this death.

28 blades in the session (including the second life): blue-darts 9, green-close 6, danger-melee 4, yellow-arm 3, yellow-rewind-hp 3, green-escape 2, blue-orbs 1. 12 zero-payoff.

### v37 fix (this death only, minimal)

In `hold-spike` and other waiting states (`wait-pad`, `time-spike`, `stage-spike`, `wait-arrow`, `back-pad`), if a shield/axe/boss is within ~4 (grunt ~3.2; radius scales by `min(wave/25, 1.5)` from wave 26):

- do not stand still;
- attack if in range (≤ 3.2);
- sidestep along the ring **away** from the enemy (on-ring, not into a hot pad, not further outward);
- if holding red or green, allow the use even in a wait state, as long as the bot is **not standing on a pad** (`onHotPad`); do not let global `spikesUp()` block that;
- if already on the outer lip (`|x|` or `|z|` > 24.08), hug back toward the ring line at 24 so the next knock does not throw the bot into the moat.

Everything else (blade/noodle policy, v36 stability and the three v34 live-death patches) is unchanged.

## v34 recap (same evening; record life wave 21)

Full write-up: `sumpfarena-deaths-v34.md`. Logs: `…-final.json` (20:35:58, alive wave 17/4530), `…-final2.json` (20:43:30, alive wave 20/5750/199), `…-final3.json` (21:03:20). After the first death the session degraded (WebGL lost ~20:16, jitter 1.1 → 3.1 s, a 3 min hold-spike stall at wave 1).

| Run | Time | Score / wave / kills | State | Cause | Notes |
|----:|---|---|---|---|---|
| 1 | 20:44:00 | **6040 / 21 / 206** | dodge-orb | **axe** at (23.49, −17.32), dist 1.46 | Record life. Last chips: shields 3→2→1 on the south plank, then dodge-orb into an axe (orb also at 2.84). 8 live enemies. |
| 2 | 20:50:16 | 1100 / 7 / 37 | lure-spike | **fireball** at (−17.50, −23.34) | Grunt had already taken HP to 1.5; orb arrived mid-lure (fb 8.01 then 2.30). |
| 3 | 21:02:11 | 860 / 6 / 28 | stay-ring | **water** at (13.46, −22.50) | Classified water; last chips are axe 5→3→1 then 1→0 after a knock inward of the south plank (z −23.24 → −22.50). |

The long life (final2, 39 HP events): fireball 10, snake 9, axe 6, grunt 6, shield 5, spike 1, boss 1, boss2 1. Yellow (17 arms / 7 rewinds) carried several HP-1 moments, including a wave-20 volley at 20:42. All 6 blues were `blue-darts` with 0 payoff.

v36 already targeted those three deaths (orb dodge vs axe, lure vs fireballs, off-ring recover, WebGL/'22' reset, hold-spike max-wait). The new hole is the one v36 then died to: **standing in hold-spike next to a shield**.

## Comparison

| | v34 live | v36 live |
|---|---|---|
| Best life | **wave 21 / 6040 / 206** | wave 13 / 2980 / 107 |
| Deaths | 3 (axe dodge-orb; fireball lure-spike; water stay-ring) | 1 (shield hold-spike) |
| Water / spike | 1 water (run 3) | **0 / 0** |
| Canvas / `'22'` | lost ~20:16, jitter → 3.1 s, 3 min hold-spike freeze | **stable**, jitter 0.62 s |
| Session after first death | later lives much worse | run 2 still healthy at dump (wave 7, HP 5) |

v36 fixed the long-session collapse and the three v34 death modes in this session, but died earlier than the v34 record to a different, simpler failure: waiting at a pad while a wave-13 shield walked into range and was allowed to hit four times.
