# v34 live hit / death statistic

Sources, 23 Nov 2026, Europe/Zurich (CET):

- `/home/box/Downloads/sumpfarena-v34-log-final.json` (17186 B, dumped 20:35:58 CET) — still alive, wave **17 / 4530**, 159 kills, HP 5, state `wait-pad` at (−17.50, 23.98). 33 HP events, 38 blade uses, 0 runs, 0 deaths.
- `/home/box/Downloads/sumpfarena-v34-log-final2.json` (19446 B, dumped 20:43:30 CET) — still alive, wave **20 / 5750**, 199 kills, HP 5, state `hunt-axe` at (23.52, 16.47). 39 HP events, 40 blade uses, 0 runs, 0 deaths.

The two dumps are the same continuous life (v34 run-counting fix held: a “run” is only a game over, and there was none). final2 is a superset of the HP list; six events after 20:35 appear only there. `hpEvents` is capped at 40, so anything before 20:10:05 CET would have been dropped; the first recorded chip is 20:10:05 and nothing in either file suggests a gap other than healthy stretches (notably 20:10:38–20:18:23, around the WebGL context loss).

## Outcome

- Still alive at both dumps. **0 game-overs, 0 water, 0 arrow, 0 deaths recorded.** One spike *chip* (not a death) at 20:18:57.
- Linus: reached **wave 18 ~20:37 CET**, continued to **wave 20 / 5750 / 199 kills** by 20:43. The run was still going after final2 (watched separately).
- Hardest moment: wave 20, 20:42:51–20:42:55 CET, boss2 + fireballs down to **HP 1**, then a yellow rewind/heal back to 5 by the 20:43:30 dump. Just before that, at 20:37:40–41 (wave 18 start), a boss hit 5→4 and a fireball 4→2.5.
- WebGL context lost ~20:16 CET (canvas black, HUD `ERR Cannot read properties of null (reading '22')`). Logic continued. dt max **743.9 ms** (almost certainly that hitch). By 20:43: p50 16.3 ms, p95 23.6 ms, 48/106117 frames > 40 ms, flips/min ≈ 380 (dirFlips 13226), jitter **1.13 s**.

## All 39 unique HP losses

Times are CET. final2 is the later snapshot of the same life.

| # | Time | HP | Dmg | Pos | Cause | Nearby | Notes |
|---|---|---|---:|---|---|---|---|
| 1–4 | 20:10:05–38 | 5→4 (×4) | 1 | south / west planks | grunt ×2, snake ×2 | melee 1.4–2.5 | Early chips; HP kept recovering to 5. |
| 5 | 20:18:23 | 5→3 | 2 | (21.39, −23.76) | axe | axe 2.44, **on pad** 0.46, spikes down | SE spike pad. |
| 6 | 20:18:55 | 5→4 | 1 | (17.88, −23.67) | snake | snake 2.60 | |
| 7 | 20:18:57 | 4→3 | 1 | (23.73, −23.65) | **spike** | grunt 2.10, pad 2.66, **spikes up**, onPad=false | Just outside the 2.5 disk, still tagged spike. Only spike chip this session. |
| 8–9 | 20:18:58–19:01 | 3→2→1 | 1+1 | east plank (24.15, −16.74) → (24.10, −7.85) | shield ×2 | shield 1.14 / 1.33 | Closest early call (HP 1). Recovered to 5 by 20:20:19. |
| 10–13 | 20:20:19–27 | 5→4 (×4) | 1 | east mid-plank | snake ×4 | snake 1.1–2.2, fireballs 7–10 already in the air | Wave 9-ish snake pack. |
| 14–15 | 20:20:57–21:01 | 5→3.5→2 | 1.5+1.5 | (24.01, 10.00) → (24.03, 17.40) | **fireball ×2** | medusa 6.65 then 11.98; **nearestFireball 99** at the hit frame (orb already consumed) | Dodge/blue did not fire in time. |
| 16 | 20:22:25 | 5→4 | 1 | (−17.52, −23.42) | snake | snake 1.50 | |
| 17–19 | 20:23:29–37 | 5→3.5→2→1 | 1.5+1.5+1 | west plank | fireball ×2, then grunt | medusa 1.71; then grunt 2.49. Again fb=99 at impact | HP 1. Recovered before 20:24:38. |
| 20–21 | 20:24:38–40 | 5→4→3 | 1+1 | east plank | shield ×2 | 1.57 / 1.50 | |
| 22–24 | 20:26:43–51 | 5→4→3→2 | 1×3 | east plank | grunt ×3 | 1.11 / 2.56 / 1.62, last with spikes up but pad 5.83 | |
| 25 | 20:28:44 | 5→3 | 2 | (−16.69, −24.01) | axe | axe 3.07, spikes up, pad 4.31 | |
| 26–27 | 20:30:19–22 | 5→3.5 (×2, heal between) | 1.5 | east pad / (23.98, 15.01) | **fireball ×2** | on pad 1.30; then medusa 1.50 | |
| 28–30 | 20:30:54–31:44 | 5→3→1, then 5→3 | 2+2, 2 | west / north | axe ×3 | 3.35, 1.24, 3.73 | HP 1 after a double axe. Yellow rewind likely (rewind-hp in the blade log, wave 16). |
| 31 | 20:32:45 | 3→1 | 2 | (15.01, 23.94) | axe | axe 2.48, spikes up | HP 1 again. |
| 32 | 20:34:49 | 5→3 | 2 | (−24.13, −11.11) | snake (2 dmg in the log) | snake 1.24 | Unusual 2 dmg for a snake (maybe two hits in one sample, or an axe just outside the classifier). |
| 33 | 20:34:56 | 4→2 | 2 | (−19.99, −23.66) | shield | shield 2.82, **on pad** 1.07; 2 dmg is heavy for a shield — possible axe/lag | Last event in the 20:35 dump (wave 17). |
| 34–35 | 20:37:40–41 | 5→4→2.5 | 1 + 1.5 | west plank (−23.42, −13.23) | **boss**, then **fireball** | boss 2.68 / 2.76 | Wave 18 entry. Matches Linus’s “boss 5→4”. |
| 36–39 | 20:42:51–55 | 5→3.5, 5→3.5, 3.5→2, 2→1 | 1.5×3 + 1 | north-east plank / pad | **fireball ×3**, then **boss2** | medusa 11.02 (on pad 1.10); boss2 2.26 with fb 10.47; medusa 3.03 fb 4.84; boss2 1.49 **on pad** 0.67 | Wave 20 (2 snake, 4 medusa, 1 boss, 1 boss2). Down to HP 1; yellow rewind-hp in the blade log at this moment; HP 5 again at 20:43:30. |

Cause tally (39): **fireball 10, snake 9, axe 6, grunt 6, shield 5, spike 1, boss 1, boss2 1**. No water, no arrow. At least four separate trips to HP 1 (19:01, 23:37, 30:55–32:45, 42:55), all recovered.

`nearestFireball` is 99 on most fireball chips because the orb is removed from the pool in the same tick it hits (`ab()`). The dodge/blade code therefore has to act **before** impact, from the still-live `k.Vc.j[].wb` list. Several approach windows were visible (fb 7–10 a few seconds earlier, and 4.84 / 10.47 in the wave-20 volley).

## Blades (40 uses in final2, last 40 kept)

| Colour | Uses | Kills | K/use | Escapes | Zero-payoff | Reasons |
|---|---:|---:|---:|---:|---:|---|
| yellow | 17 | 31 | 1.82 | 7 | 3 | yellow-arm 10, yellow-rewind-hp 7 |
| red | 9 | 1 | 0.11 | 0 | 8 | danger-melee 3, advantage-tank 3, advantage-stuck 2, danger-surround 1 |
| green | 8 | 7 | 0.88 | 1 | 4 | green-close 7, green-escape 1 |
| blue | 6 | 0 | 0.00 | 0 | **6/6** | **blue-darts 6**, never `blue-orbs` |
| all | 40 | 39 | 0.98 | 8 | 21 | |

Yellow carried the life (7 rewinds, including the wave-20 HP-1 save with boss2 + medusas listed on the use). Blue was wasted on empty dart-lane triggers and was **never** spent to slow the 10 fireball hits. Red almost never paid in kills and was not in hand for the 20:42 volley (yellow was already armed).

## WebGL / `reading '22'` (for the v35 fix)

`F(k.X, pos)` is `return k.X.data[ix][iy].type`. `k.X.data` starts as **`null`** in the `va` constructor and is filled when the map loads. Index **22** is the grid column/row for world X or Z in **[−1.5, +1.5)** — the mid-point of the north/south or east/west plank (`isPb(24, 0)` uses `iy = 22`). So `k.X.data` (or a column) being **null** and a lookup at x≈0 or z≈0 throws exactly `Cannot read properties of null (reading '22')`.

`isPb` already catches `F` and returns false, so a sticky HUD `ERR` means an **uncaught** call: `runtimeSelfCheck` / `rebuildRingFromF` call `gw.F` raw. After a context loss the game may rebuild the collision map (`data = null` again). If `checkedMap` is still true this path should not re-run — but any other uncaught `F` / renderer path, or a re-check after resize/`setSize`, would land in `tick()`’s catch, set `SB.err`, and skip `step()` for that frame. dt max 743.9 ms matches a context-loss hitch.

v35 must: `preventDefault` on `webglcontextlost` so the context can restore; skip `setSize` / pixel-ratio while lost; never call `F` without a guard; if `data` is null, fall back to a geometric outer-ring test so the bot does not freeze; cap log arrays so a 35-wave life cannot grow without bound.

## What v35 should do in 19–35

- **Wave 19:** 9 snakes + 3 axes — keep red for axes in reach; do not noodle into the pack.
- **Wave 20, 24, 27, 30:** medusa volleys (4 / 6 / 5 / 8) + bosses. Spend **blue** to slow orbs, **red** to freeze a boss in melee *and* the orbs, start orb dodge earlier than 4.5 and strafe along the ring *away* from the approach, arm yellow only when HP is already down so the hand is not blocked.
- **Wave 22:** 8 shields — walk behind, or leave them to traps.
- **Wave 25 / 28:** 5 axes.
- **Waves 31–35:** random 26–29 tables, enemies at up to 1.40× dt. Same tools, tighter blades, stable WebGL.

## final3 (21:03:20 CET) — first true game-overs, then a degraded session

Source: `/home/box/Downloads/sumpfarena-v34-log-final3.json` (15206 B). Same continuous bot session (dt max still 743.9 ms from the ~20:16 context loss; frames now 155458; jitters **3.10 s**; flips 19062). Run counting and death logging **worked**: 3 game-overs with reasons, current still alive on run 4 at wave 2 / 180 / 7 kills, state `stage-spike`. Top-level `hpEvents` only has the current life (cleared in `onNewRound`); each death record keeps its last chips.

| Run | Time | Score / wave / kills | Pos | State | Cause | Notes |
|----:|---|---|---|---|---|---|
| 1 | 20:44:00 | **6040 / 21 / 206** | (23.49, −17.32) | **dodge-orb** | **enemy/axe** (1.46) | Record life, one wave past the 20/5750 dump. Last chips: shield 3→2→1 on the south-east plank, then dodge-orb walked north on the east plank into an axe (fireball also at 2.84). `dx≈0, dz=+8.75`. |
| 2 | 20:50:16 | 1100 / 7 / 37 | (−17.50, −23.34) | **lure-spike** | **fireball** (1.5 dmg, fb 2.30) | Standing/luring toward a pad while a grunt had already taken HP to 1.5; orb arrived mid-lure. |
| 3 | 21:02:11 | 860 / 6 / 28 | (13.46, −22.50) | **stay-ring** | **water** (log reason); last HP chip is axe 1→0 | Axe twice (5→3, 3→1) at (13.5, −23.24) on the south plank, then knock/step inward to z=−22.5 (inner moat). stay-ring was aiming `R28 6,−24` off-axis from an already inward pose. |
| 4 | 21:03:20 dump | 180 / 2 / 7, HP 5 | (9.49, 23.97) | stage-spike | (alive) | Two grunt chips on this life. |

Linus also saw the bot sit in **hold-spike at speed 0 for ~3 min (20:54–20:57, wave 1)** — that is the start of run 3, after the WebGL context was already lost. The 5 s pad wait did not fire, most likely because (a) uncaught `F()` / `reading '22'` skipped `step()` or aborted `onNewRound` mid-reset (runtimeSelfCheck still called raw `F` in v34), and/or (b) `spikeWaitKey` flickered whenever `cluster.start` or `loopDir` changed, resetting the timer; (c) mid-ring resume after a death did **not** fully reset waits, jitter, or blade state. Jitter is a session accumulator (1.1 → 2.4–3.1 s) and was never zeroed on a new life.

v35 must therefore: recover from a null collision map without throwing; **fully reset per run** (including mid-ring resume); cap log/jitter growth; use a hold-spike stuck timer that does not depend on padKey; refuse dodge-orb into an axe’s reach; abort lure-spike when an orb is close; recover outward when already inward of the plank instead of stay-ring cutting the moat.

