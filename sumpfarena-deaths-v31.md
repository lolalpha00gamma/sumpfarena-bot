# Sumpf-Arena v31 live deaths (23 Nov 2026, Europe/Zurich)

Session **18:36:50–18:57 CET** (log saved 18:57). New record **wave 10 / 1960** (run snapshot 18:53:38; the wave-10 death at 18:53:37 is 10/1930). Lite `pr=0.5 no-shadow`. Frame dt: **p50=24.4 ms, p95=28.3 ms, max=163.6 ms**, 110 / 54243 frames >40 ms. Once “STUCK” at speed 0 in wave 8 (self-recovered; not a death). **No leave-pad / spike deaths in the v31 HUD list.**

The deaths array has **17** entries. **0–9** are leftover v29/v30 records (17:31–18:24). **Death 10** (18:31:07, spike/dodge-orb, wave 7/1360) is an earlier pre-window entry, still on this loader. **Deaths 11–16** are the v31 HUD deaths Linus listed (11–12 at 18:32, just before the stated 18:36 start; 13–16 inside the window).

No per-hit `dt` is stored; use the session p50/p95 above. `dx`/`dz` on a death record are residual knock (`kb=9`). Arrow projectiles are removed on impact, so `nearestDart` at record time is often 10–13 even when the hit was an arrow.

## Carry-over (not v31)

Deaths 0–9: v29 boot, v29 loop/medusa, and the v30 leave-pad / water / shield / dodge-orb set. See `sumpfarena-deaths-v30.md`.

## Earlier entry

### Death 10 — 18:31:07 — **spike / dodge-orb**, wave 7 / 1360
- Death pos **(-24.04, 22.28)**, `dz=7.52`, wp `R40 -15,24 blade`, on pad, tick **901.8** up, pad dist 1.28. HP was already 0.5 after a fireball.
- ev0 18:30:03 **unknown → reclassified arrow**: (-24.09, **-6.01**) tick **531.7**, dart 12.07. This is the west dart lane (`z≈-6`, `x≈-24`) just after fire (tick 500). Same pattern as the v31 unknowns below.
- Later spike grazes and two fireballs (medusa 11.66 then 4.68). The final spike tick during dodge-orb finished 0.5 HP. Unique to this pre-window run; not in the later HUD list.

## v31 HUD deaths

### Death 11 — 18:32:01 — **water / wait-round**, wave 3 / 310
- Death pos **(-28.06, 23.64)** y=0, `dx=-6.81`, `dz=2.87`, wp `R35 -24,18 path`. Off the **west** side of the NW corner (walkable |x|≲25.5).
- Last hits: grunt @1.67 at **(-27.56, 23.43)** HP 2→1, then grunt @2.21 at (-28.06, 23.64) HP 1→0. Already beyond the plank when the grunt connected; knock is further west into water.
- `wait-round` is the post-fall / between-round state at log time. The cause is standing or lingering on the **outer** edge, then a knock with no inward margin.
- Earlier evs include several spike grazes (not fatal) and a grunt at (25.03, -22.15).

### Death 12 — 18:32:47 — **enemy/grunt / yield**, wave 2 / 140
- Death pos **(6.90, 23.98)**, `dx=-9.92`, wp `R50 0,24 dart` — **on the north dart lane** (`x≈6`, `z=24`).
- Yield **stands still**. ev4 snake @1.53 at (13.87, 24), then grunt @1.20 at (9.81, 24.05), then grunt @1.98 at (6.90, 23.98). Knock is along the plank (west), not into water. Yield-as-stand let the pack walk onto the bot.

### Death 13 — 18:42:08 — **water / loop**, wave 6 / 870
- Death pos **(-28.61, -23.16)** y=**-5.25**, `dx=-7.60`, `dz=1.34`, wp `R28 -24,-18 path`. Off the **west** side of the SW plank.
- ev5–7: snake @1.50 at **(-26.38, -23.27)**, then @1.44 at (-28.11, -23.24), then @1.81 at (-28.47, -23.18). Already at |x|=26.4 (past the walkable edge) on the first of those hits. Loop was running on the outer edge; snake knock finished the fall.
- ev3 18:40:07 **unknown → arrow**: (23.84, **4.53**) tick **541.9**, dart 10.54 (east lane `z≈6`).
- ev4 18:41:06 **unknown → arrow**: (**7.32**, 23.93) tick **545.8**, dart 13.34 (north lane `x≈6`).

### Death 14 — 18:42:30 — **enemy/snake / cut-inner**, wave 6 / 880
- Death pos **(27.51, -24.08)**, `dx=0.09`, `dz=-0.08`, wp `R7 24,-24 spike`. Already at **x=27.51** (outer edge / water lip) on the south plank.
- ev0–2: snake @1.65 at (25.56, -24.15), @1.50 at (26.39, -23.55), @1.50 at (27.51, -24.08). `cut-inner` with a snake in melee walked or got pushed **outward** instead of inward. y=0, HP to 0 from the snake (not a water classify, but the same outer-edge geometry).

### Death 15 — 18:48:09 — **water / loop**, wave 6 / 820
- Death pos **(28.51, 23.21)** y=**-4.99**, `dx=0.81`, `dz=-0.53`, wp `R57 24,18 spike`. Off the **east** side of the NE corner.
- ev2–3: snake @1.50 at **(27.26, 23.35)**, then @2.65 at (28.48, 23.22). Same pattern as death 13: already past |x|≈25.5 when the snake connected.
- ev0 18:47:54 **unknown → arrow**: (-24, **6.21**) tick **535.8**, dart 12.27 (west lane `z≈6`).

### Death 16 — 18:53:37 — **enemy/shield / yield**, wave 10 / **1930** (record run; snapshot 10/1960 is a second later)
- Death pos **(23.94, 16.30)**, `dx=0.72`, `dz=7.85`, wp `R58 24,18 path`. East plank, mid-side, spikes down.
- ev3–7 in ~9 s: shield @1.32, grunt @1.24, shield @1.42, shield @1.45, shield @1.30, all at x≈24, z≈15–16. Yield stood in the pack; knock along the plank (north).
- ev1 18:52:32 **unknown → arrow**: (-23.88, **5.19**) tick **535.6**, dart 11.24 (west lane).
- ev0 boss @3.09, ev2 snake @0.96 (healed back to 5 before the shield pack).

## Unfinished run (top-level hpEvents after death 16)

- 18:54:20–24 grunt chip on the north/west planks (one at pad 1.43, spikes down).
- 18:55:05 **unknown → arrow**: (-23.98, **5.86**) tick **529.6**, dart 11.91.
- 18:55:30 fireball 1.5 at (22.42, 20.81), medusa 3.16, orb still visible at 12.32.

## Root causes

### 1. Water at the outer edge (|x| or |z| ≈ 28)
All three water deaths sit **2–3 units past the walkable lip** after a melee knock (`kb=9` travels several units). The bot was on the **outer** side of the 1-cell plank (`|x|` or `|z|` ≳ 24.5–26) with a snake or grunt within 1.5–2.2. Knock is away from the attacker: if the enemy is inward of the bot, the residual is into the water. `wait-round` / `loop` standing or micro-stepping on that lip is enough. **Fix idea (v32.1):** never wait/stand on outer-edge cells; keep a **1-cell (~3) margin** from water when any enemy is in knock range; stay **inward** of nearby enemies so knock goes toward the island.

### 2. Yield stands still; cut-inner with a snake nearby
Yield is chosen when enemies are both ahead and behind, then **hold still** for 0.5–0.9 s (`holdYieldUntil`). Deaths 12 and 16 are that stand, with the pack walking onto the bot. Death 14 is `cut-inner` with a snake at 1.5, already at x=25.6–27.5 (outer). **Fix idea (v32.2):** treat yield as **move-away along the ring** (larger radius), and never cut-inner when an enemy is near.

### 3. Arrow traps (Pfeilfallen / `logic_trapDart`) — previously logged as `unknown`
Six pedestals, no south pair: **(±6, 21)** fire **+Z** (north), **(-21, ±6)** fire **−X** (west), **(21, ±6)** fire **+X** (east). Tick speed 400, fire at tick 500, rearm at 1000 (period 2.5 s). Projectile speed **20**, hit radius **1.55**, life 5 s, **1 HP**, removed on impact. The arrow reaches the outer ring in ~0.15 s (tick ~560); hits are logged around tick **530–550** because the 1.55 disk already covers the ring as the arrow approaches.

`dartThreatAt` only treated the lane as unsafe when `fireIn < 0.35` (time *until* the next shot). **After** the fire, `fireIn` wraps to ~2 s, so the bot walked into the in-flight arrow. At record time the dart is gone, so `nearestDart` is 10–13 and the cause became `unknown`.

Re-check of old logs (lane `x≈±6,z>18` or `|z|≈6,|x|>18`, and tick 500–700):

| log | unknown | of which arrows |
|---|---|---|
| v29-log-final | 2 | 1 |
| v30-log-final | 4 | 3 (plus carry-over) |
| v31-log-final | 10 | **9** |

The one non-arrow unknown in the carry-over is the v29 medusa-orb death at (23.51, 23.31).

### 4. Zeitklingen spam / green dash
Pickup is **proximity < 1.5**, no key; the outer-ring corners **are** the four spawn points, so a full lap auto-picks whatever is up. `maybeUseBlade` fires green (2) and yellow (3) immediately, and blue (0) on many combat conditions. Green is a **Zeitsprung**: first Ctrl *arms* (6 s), second Ctrl dashes up to **7.5** along facing and snaps to a walkable cell centre — that is the live “lost orientation” (ring `wi` / `loopDir` / heading no longer match the dash). Yellow arms a rewind clone; second press teleports back. Only **red freeze (6 s, enemies/traps `dt=0`, player still moves)** is a clean combat tool. Field blades respawn **15 s** after use. First appearance after 1 s; random colour.

### 5. Key jitter
`clampToRingKeys` / centre-hug / follow-centreline use a **0.12** deadband, so a “stand” state still taps alternating keys every few frames. The run animation plays with almost no displacement. Needs a committed STAND / MOVE layer.
