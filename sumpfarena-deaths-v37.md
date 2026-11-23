# Sumpf-Arena deaths — v37 live

All times are Europe/Zurich (UTC+1). Goal remains **wave 35 live**. The v34 record is still **wave 21 / 6040 / 206**. This v37 life reached **wave 16 / 3890 / 131**, better than v36’s wave 13, and died to a fireball in `lure-spike`.

## v37 session (21:50:23–22:21:35, 23 Nov 2026)

Source: `/home/box/Downloads/sumpfarena-v37-log-final.json` (11340 B). Ver 37, lite `pr=0.5 no-shadow` (canvas **stable**, no `'22'`), frames 58498, dt p50 24.4 ms / p95 32.0 ms / max 1.44 s, over40 393, jitter **0.57 s**, dirFlips 257. 0 water deaths. The dump’s 2 “runs” are a boot snapshot at 21:50:23 and one real game-over. At dump the bot was alive on run 2, wave 3 / 310 / 9 kills, HP 5, state `loop`.

### The death — 22:17:40, wave 16 / 3890 / 131 kills

| | |
|---|---|
| Pos | (−15.63, 23.54) — north plank, waypoint **`R41 -15,24 spike`** |
| State | **lure-spike** |
| Logged reason | **fireball** (not spike) |
| Knock | dx −1.25, dz +8.08 |
| Nearby | axe 1.27–1.34, 7 enemies live, nearest pad 5.39 (not on the pad), spikes **down** in 0.72 s, fb 99 at the death tick (orb removed on hit) |

Wave 16 is **2 snakes, 2 grunts, 2 shields, 2 axes, 2 medusas** (`$a`: `[2,2,2,2,2,0,0]`). Plenty of orbs.

The waypoint is a **spike cell** because the bot was luring toward that pad. Spikes were down and `onSpikePad` was false at death. The HUD/log reason is **fireball**. The “spike context” is the lure target, not the killing blow.

Last 8 HP chips on that life:

| Time | T−death | Cause | HP | Pos | Notes |
|---|---:|---|---|---|---|
| 22:14:29 | 3:11 | grunt | 4→3 | (20.48, 24.03) | On a north-plank pad (pad 0.52), spikes down 0.57 s |
| 22:14:31 | 3:09 | **unknown** amt **2** | 3→1 | (14.96, 24.05) | Nearest **axe at 5.78**, fb 99, dart 56, pad 6.04, not on a pad, spikes down 1.17 s |
| 22:14:33 | 3:07 | **axe** amt 2 | 3→1 | (12.45, 23.93) | Axe now at **1.16**. HP is 3 again → yellow rewind after the unknown hit |
| 22:14:47 | 2:53 | snake | 3→2 | (−24.15, −3.08) | HP 3 again (second rewind). Then a long quiet gap |
| 22:17:11 | 0:29 | axe amt 2 | 5→3 | (24.01, −3.51) | East plank; HP had recovered to 5 (noodle) |
| 22:17:27 | 0:13 | shield | 4→3 | (−23.99, 3.47) | West plank |
| 22:17:33 | 0:07 | **fireball** amt 1.5 | 3→1.5 | (−21.62, 23.20) | **On a pad** (pad 1.01), **fb still visible at 9.5**, shield 3.97, spikes down 1.81 s |
| 22:17:40 | 0:00 | **fireball** amt 1.5 | 1.5→0 | (−15.63, 23.54) | State `lure-spike`, walking east toward R41; fb 99 at tick, axe 1.34, pad 5.39 |

A fireball hit at 22:17:33 while the bot was on a pad, with **another (or the same, mid-update) orb recorded at 9.5**. Seven seconds later the bot was still in `lure-spike`, walking along the north plank toward the next pad, and a second orb finished it at HP 1.5. Just before this, a wave-16 `red danger-surround` had been used with a medusa at 3.91 and a shield at 3.93 (kills already 131). Hands were empty at death; no yellow was armed.

### What the `unknown` 3→1 was

Classifier order: spike (only if spikes are **up** and the bot is on/near a pad) → arrow → fireball (`amount === 1.5` or fb < 2.2) → enemy if dist < 4, or if `amount >= 2` and dist < **5.5** and the nearest type is axe/boss/shield → else `unknown`.

This chip is **amount 2**, which in this game is uniquely an **axe** hit (axe dmg 2; everything else is 1 or 1.5). The nearest enemy was an axe, but at **5.78**, just outside the 5.5 cutoff — almost certainly the snapshot after knockback (axe kb is only 5, but the player had already started moving west along the plank). Two seconds later the same axe is at 1.16 and the same 3→1 is logged as `enemy/axe`, after a yellow rewind restored HP to 3.

So `unknown` here is an **axe hit**, mislabelled because the distance gate is too tight after knockback. It is not a spike, arrow, or fireball.

### Wave-14 stall (~4 min, score almost flat)

Yellow `rewind-hp` uses at bot-t 1090 and 1180 (wave 14, the 3→1 hits above) then `yellow-arm` at 1245 with an axe at 7.98, **kills stuck at 113**. The next payoff is only at 1481 (`yellow-arm`, still killsAt 113, axe still at 7.79) — **~236 s / ~3.9 min** with no kill. Then wave 15 starts.

Wave 14 is 1 snake, 1 grunt, 1 shield, **2 axes**, **2 medusas**. After the early chips and two rewinds, one or two leftovers (at least one axe at ~8) were not being finished. Why:

- “Leftover prey” **explicitly excludes axes / bosses**. A lone leftover axe is not hunted as `leftover-melee`.
- `hunt-axe` only runs when the bot is **holding red or already frozen**. During the stall the bot was holding yellow and then blue (`blue-darts` at 1369, 0 payoff), so it never closed.
- `hunt-stall` (after 60 s with no kill/wave change) only **reverses** around the ring for 3 s. It does not walk toward the leftover. The bot can loop the ring indefinitely with an axe sitting at ~8.

### Why the v36 `lure-spike` fireball patch did not fire

v36/v37 already refuse to enter lure unless `nearestFireball >= 8 && fireballCount() === 0`, and abort if `nearestFireball < 8 || fireballCount() > 0`. Two holes let this death through:

1. **`fireballCount()` is `k.Vc.active` only.** Live orbs live in the pool `k.Vc.j` (position `wb`, life `O`). If `active` is stale or 0, the count is 0 even when `eachFireball` / `nearestFireball` still see an orb. The entry condition then collapses to “nearest ≥ 8”, and the abort’s `count > 0` branch never runs.
2. **The 8-unit gate is too short for a homing orb.** At 22:17:33 an orb was logged at **9.5**. That is ≥ 8, so lure is still allowed. Orbs home with accel 5, max speed ~9, life 4 s — 9.5 units is well inside arrival time. `dodge-orb` only starts at **4.5**, so it also stayed quiet. At HP 1.5 the bot kept luring toward R41.

A medusa in range (13) was also not treated as a lure veto, even though wave 16 has two.

43 blades this session (including run 2): green-close 10, blue-darts 10, yellow-arm 9, yellow-rewind-hp 6, danger-melee 4, blue-orbs 2, advantage-tank 1, danger-surround 1. 19 zero-payoff. Yellow rewinds saved the wave-14 3→1 hits; there was no yellow in hand for the lethal 1.5→0 orb.

### v38 fixes (minimal, kept)

- Count live orbs via `eachFireball`, not `k.Vc.active`.
- Do not start (and do abort) `lure-spike` if any live fireball exists, if an orb is in flight toward the bot, or if the nearest orb is **< 12** (covers the live 9.5-unit miss). At **HP ≤ 3**, also abort if a medusa has line of sight within reach 13.
- While already in `lure-spike` / `abort-lure`, `dodge-orb` range extends to **8** (axe-reach ≤ 3.5 reject kept); prefer the landing farther from the orb.
- Classifier: `amount >= 2` is an axe hit even if the snapshot distance is > 5.5 (logging only).
- Leftover-axe hunt and a more aggressive `hunt-stall` were tried and **withdrawn** — closing on leftover axes caused wave-6 axe deaths and moat water in sim. `hunt-stall` remains v37’s reverse-at-60s. The wave-14 leftover-axe stall is still an open issue.
- HP ≤ 3 yellow-arm was already in v37; no extra blade-policy change. Unconditional “no lure at HP ≤ 3 / any medusa within 13” over-blocked lures and was also withdrawn.

Sim (same-run vs v37, 6 trials × 3 clocks, cap 7000 s, targetW=36, `/tmp/sb-bench38e`): **not worse**. 1/60 and 1/40 identical trial-for-trial (means 11.33 / 14.33). Hitch mean ties at 13.33; one wave-10 trial died to a medusa instead of a shield. 0 water / 0 spike / 0 arrow. Stable stays v34. Dump key `__SB_dump_v38`.

## Prior lives, briefly

| Ver | Best life | Death | Notes |
|---|---|---|---|
| v34 | **wave 21 / 6040 / 206** | dodge-orb into an axe; later fireball in lure-spike; water in stay-ring | Long-session collapse after WebGL loss (jitter → 3.1 s) |
| v36 | wave 13 / 2980 / 107 | shield in **hold-spike** on the west lip | Canvas stable; v37’s sidestep/red-in-wait was the answer |
| v37 | **wave 16 / 3890 / 131** | fireball in **lure-spike** toward R41 | Canvas stable, jitter 0.57 s; hold-spike shield hole did not recur; leftover-axe stall + lure vs a 9.5-unit orb is the new hole |

v37 moved the record-for-this-line (v36+) from 13 to 16 and kept the session healthy after death. The v34 wave-21 life is still ahead.
