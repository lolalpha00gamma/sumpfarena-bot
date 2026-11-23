# v33 live death / HP-loss statistic

Source: `/home/box/Downloads/sumpfarena-v33-log-final.json` only (11201 B, dumped 19:57:07 CET, 23 Nov 2026). Session ~19:47:24–19:57:07 CET (Europe/Zurich). Cross-checked against the eight autosaves `sumpfarena-v33-log-10.json` and `(1)`…`(7)` at 19:54:08–19:54:11 CET: they are duplicate downloads of the same 10-“run” snapshot, not extra sessions.

- Version: 33
- `deaths`: **0** (HUD “Tode” stayed `(keine)` the whole time)
- `hpEvents`: **11** HP losses (never to 0)
- `runs`: 13 entries, but these are **not** game-overs (see below)
- `bladeUses`: 34
- `current` at dump: still **alive**, score 1510, wave 8, 52 kills, HP 5, state `stage-spike` at (23.23, 12.77)
- Max snapshot: **wave 8 / 1510**
- Water / spike / arrow deaths: **none** in this log
- dt: p50 27.8 ms, p95 32.7 ms, max 122.7 ms, 76/23494 frames > 40 ms
- flips/min ≈ 244 (dirFlips 2653), jitter 0.62 s

## There was no game over in this session

The bot was still in a live wave-8 fight at the dump. The empty death list is therefore **not** “every death failed to record.” What *did* fail:

1. **Run counting fired on every HP chip, not on game over.** Consecutive “runs” differ by only 10–20 score and often by < 1 s (e.g. 870/880/890 all at 19:52:10; 1160 then 1180 at 19:54:15–16). Each of those lines lines up with an `hpEvents` entry (or with a score tick during i-frames). The 0/1 boot line at 19:47:24 is also a false run (`wait-round` at the origin).
2. **Root cause.** `inRound()` required `k.i.v.visible`. During the 1 s i-frame window (`Oa`) the player mesh blinks, so `inRound()` flickers false. The `!running` branch then called `endRunCapture()` because `SB.rs` is the **round-start timestamp** (set in `onNewRound`), not a restart/game-over flag — it is truthy for the rest of the life. `logRun()` only dedupes identical score+wave within 8 s, so a +10 kill during the blink opens a new “run.”
3. **Autosave spammed 8 downloads.** After the 10th fake run (19:54:08, 1140/7), `downloadLog()` ran. The i-frame flicker then set `running` true again, the mid-ring `_alive` recovery path reset `runDumped = false`, and the next blink downloaded again. Hence `log-10.json` plus `(1)`…`(7)` within ~3 s, all with 10 runs / 0 deaths / 24 blades.

True game-over recording (`k.i.la` or HP ≤ 0) never had a chance to fire because the player did not actually die. HP-loss events themselves *were* written.

## All 11 HP losses

Times are Europe/Zurich (CET).

| # | Time | HP | Dmg | Pos | State (paired run) | Cause in log | Nearby | Notes |
|---|---|---|---:|---|---|---|---|---|
| 1 | 19:48:40 | 5→4 | 1 | (17.44, −23.23) | abort-plank, w3 | enemy/snake | snake 1.50 | South plank. First real hit. |
| 2 | 19:49:49 | 5→4 | 1 | (23.63, −6.51) | loop, w4 | enemy/snake | snake 2.27, onDartLane but dart 13.69 | East plank. HP had returned to 5 (noodle). |
| 3 | 19:50:21 | 5→3.5 | 1.5 | (−24.00, −17.30) | dodge-orb, w5 | fireball | snake 8.78, **nearestFireball 99** | Classified by damage 1.5 (orb already gone from the list). Extra fake run 0.24 s later at wait-pad (670/5). |
| 4 | 19:52:10 | 5→3 | 2 | (−3.13, 23.48) | **noodle**, w6 | enemy/axe | axe 1.43 | North plank, next to the (0, 24) noodle bowl. Two more fake runs in 0.30 s (880, 890) during i-frames / score ticks. |
| 5 | 19:53:23 | 5→3 | 2 | (−23.94, 17.19) | loop, w6 | **unknown** | axe 4.50, pad 3.81 (spikes down) | 2 dmg = axe swing; reach/lag put the axe just outside the 4-unit classifier. |
| 6 | 19:53:25 | 3→1 | 2 | (−23.97, 14.97) | — | enemy/axe | axe 1.50 | Same axe, 2 s later. Closest this session came to death (HP 1). Recovered to 5 before 19:54:08 (noodle). |
| 7 | 19:54:08 | 5→4 | 1 | (−23.36, 17.48) | lure-spike, w7 | enemy/snake | snake 1.66 | West plank. Autosave burst starts here. |
| 8 | 19:54:10 | 4→3 | 1 | (−23.74, 8.84) | — | enemy/snake | snake 1.33 | Same west plank, 2 s later. |
| 9 | 19:54:15 | 5→3 | 2 | (−24.04, −15.12) | edge-margin, w7 | enemy/axe | axe 1.28 | HP was 5 again (noodle or yellow). Outer-lip correction (`|x|=24.04`). |
| 10 | 19:54:16 | 3→2 | 1 | (−24.03, −17.42) | wait-pad, w7 | enemy/snake | snake 1.51, spikes **up**, pad 3.52 | Not inside the 2.5 spike disk. Another fake run 0.76 s after #9. |
| 11 | 19:57:06 | 5→4 | 1 | (24.11, 15.63) | time-spike, w8 | enemy/grunt | grunt 1.68, spikes up, pad 5.37 | Last hit; dump 1 s later still lists current HP 5. |

Cause tally (after reading #5 as axe): **snake 5, axe 4, fireball 1, grunt 1**. No water, no spike, no confirmed arrow.

The 13 “runs” (0/1, 280/3, 450/4, 660/5, 670/5, 870/6, 880/6, 890/6, 890/6, 1140/7, 1160/7, 1180/7, 1510/8) are a start snapshot, then these chips, plus a 19:53:23 score-unchanged blink, plus the still-alive dump line — **not** 13 independent lives. A corrected reading is: **one continuous life**, several chips, peak wave 8 / 1510, still alive at dump.

## Blade efficiency (34 uses in ~10 min)

| Colour | Uses | Kills | K/use | Escapes | Zero-payoff | Reasons |
|---|---:|---:|---:|---:|---:|---|
| green | 14 | 6 | 0.43 | 1 | 10 | green-close 12, green-escape 2 |
| blue | 10 | 11 | 1.10 | 0 | 3 | blue-darts 7, blue-stuck 2, blue-snakes 1 |
| yellow | 5 | 3 | 0.60 | 1 | 2 | yellow-arm 4, yellow-rewind-hp 1 |
| red | 5 | 2 | 0.40 | 0 | 4 | danger-melee 2, advantage-tank 2, advantage-stuck 1 |
| **all** | **34** | **22** | 0.65 | 2 | **19 (56%)** | |

Problems:

- **Green is double-logged.** Arm and dash are two `bladeUses` ~0.1 s apart (pairs at t=269, 275, 343, 451, 459, 502, 666). Real green activations are ~7, not 14. Many `green-close` dashes are at an axe 7–9 units away and score 0 kills.
- **Blue-darts is loose.** Several fires with `enemies: []` (t=258, 522, 531, 541). One 0-kill use then two more blues in the next 20 s.
- **Yellow-arm at full HP / empty field** (t=592.7, no rewind). The only clearly useful yellow is the 19:49-era `yellow-rewind-hp` (1 escape).
- **Red `advantage-tank` at axe ~7.9** and **`advantage-stuck` with no enemies** never paid off (0 kills). `danger-melee` on a snake at 1.68 also 0 kills.

Keep: blue when orbs / real dart pressure / snake packs are actually present; red freeze only when a tank is in melee range so the 6 s can be spent hitting it; yellow only when HP is already down or a hit is likely; green only as a verified escape or a close that lands next to a target.

## Noodle time sink

Linus saw the noodle state a lot in wave 6, 19:50–19:53 CET. The log agrees: the 19:52:10 axe chip is in state `noodle` at (−3.13, 23.48), on the way to the north bowl. After that, HP 3 → later 5, then the same life is still on wave 6 at 19:53:23 (no score change for 73 s).

The 3 s “abort if not within 1.2” path sets `noodleSince = 0` and falls through, but the next frame HP is still below max and the bowl is still in the 14-unit window, so the bot **re-enters immediately**. That is a livelock-like time sink, not a one-shot detour, and it walked the bot into the wave-6 axe.

## What v34 must fix

1. Detect every HP decrease and every real game-over (`la` or HP ≤ 0) each frame; `deathLogged` is only a duplicate-record guard. Show recent HP hits on the HUD so an empty Tode list is not silent.
2. Count a run only on game over (or the “Nochmal” restart). `inRound()` must not use mesh visibility.
3. Autosave exactly once when the real run count crosses a multiple of 10; never reset `runDumped` on an i-frame flicker.
4. Tighten blade policy and log one record per activation (kills/escapes already exist per colour).
5. Noodle only when healing is worth the detour; abort must start a cooldown so the bot cannot immediately re-enter; do not chase a bowl into an axe/boss.
