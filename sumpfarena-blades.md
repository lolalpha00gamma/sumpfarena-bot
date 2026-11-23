# Zeitklingen (time blades)

Documented from `app.beautified.js` (`D` 1018–1041, class `x` 3200–3252, player timer 886–973, world tick 1580–1589, `oa` 3238–3244, `$a` is the wave table and is unrelated). Confirmed against FINDINGS.md §5.

## Spawn

Four **fixed** pads at the outer-ring corners:

```
(24, -24), (24, 24), (-24, 24), (-24, -24)
```

List: `k.Ib`. The ring path goes through these cells.

- First appearance: respawn timer `Va = 1` s after load.
- After a normal consume (`oa` without the forced flag): **`Th = 15` s**.
- Forced clear (death, level reset, `oa(pad, true)`): **0.5 s**.
- When `Va` hits 0 a **uniform random** colour `$a ∈ {0,1,2,3}` is chosen and the mesh becomes visible. Colour cannot be chosen by the player.
- During a red freeze or blue slow, pad `update` uses the **scaled** world dt, so respawn countdowns freeze or slow. Pickup itself is a distance check and still works if you walk in.

## Pickup

- Automatic, no key: distance **< 1.5** to the visible blade, and the player is not already holding one (`k.i.Rb == -1`).
- The blade sticks to the hand bone (`Gd = true`); the pad stays “occupied” until the effect is consumed. You cannot pick a second blade while holding one, and that pad does not start its 15 s respawn until consume.
- Pickup does **not** activate the effect.

## Activation

- **Ctrl** (keyCode 17) or the UI power-up button → `sa()` → `D(player, heldIndex + 1)`.
- 5-**frame** debounce `we` (decremented once per player `update`, not per second). A second press inside those 5 frames is ignored.
- First press is ignored while falling (`Ta`). A second press (green dash / yellow rewind) is **allowed while falling**.
- One effect at a time: `Da` is the active mode. A second Ctrl during blue or red is a no-op (debounce still consumed).
- The effect timer `Cc` ticks on **unscaled** player dt (real time). When `Cc < 0` or the player dies (`la`), `oa(spawner)` consumes the blade, `Rb = -1`, `Da = 0`.
- On death / respawn, a held blade is force-cleared and every pad is `oa(..., true)`.

`va` / `D` argument = `Rb + 1`:

| `$a` / `Rb` | `D(..., Rb+1)` | Colour | `va.*` |
|------------:|---------------:|--------|--------|
| 0 | 1 | blue | `Gc` |
| 1 | 2 | red | `stop` |
| 2 | 3 | green | `forward` |
| 3 | 4 | yellow (“orange” in the UI) | `reverse` |

## Colours

### 0 — blue — slow time

- First Ctrl arms immediately. Duration **6 s**.
- World dt used by **enemies, traps (spikes and dart cycles), fireballs/orbs, noodles, and blade pads** is multiplied by **`Ee = 0.3`**.
- Player movement (`k.te`) and the blade timer itself stay at full speed. The player is about 3.3× faster relative to the world.
- No second-press effect.
- **Traps:** a spike-up window that is already running lasts 0.25 / 0.3 ≈ **0.83 s of real time** — do not arm blue while spikes are up and you are in a pad disk. A down window becomes longer, which is useful for a crossing that you start in the down phase. In-flight darts and fireballs move at 30% speed, so they are easier to dodge or outrun.
- **Water:** no special interaction.

### 1 — red — freeze

- First Ctrl arms immediately. Duration **6 s**.
- World dt for the same systems as blue is set to **0**. Enemies and traps **stop**. Player movement is unchanged.
- No second-press effect.
- **Traps:** if spikes are up when you freeze, they stay up for the whole 6 s — deadly. If they are down, they stay down (safe to cross, melee on pads). Dart pedestals do not fire; in-flight darts freeze in place (the 1.55 hit disk is still live if you walk into it).
- **Use:** melee on axe / shield / boss while they cannot swing or turn (walk behind a shield). Do not arm on a hot spike disk.

### 2 — green — Zeitsprung (dash)

- First Ctrl **arms** for **6 s** (no movement change). World dt is not scaled.
- **Second** Ctrl dashes along **current facing** (`getWorldDirection()`, the mesh +Z after the movement slerp). Facing is the direction the player has been walking, so the bot must hold the intended arrow(s) before the second press.
- Dash length tries **`Kg = 7.5`**, then **×0.66 ≈ 4.95**, then **×0.66 again ≈ 3.27**. For each candidate, if the point’s cell is walkable (`type.pb`), the player **teleports to that cell’s centre**. If none of the three is `pb`, there is no teleport (the press is still consumed and the dash sound plays).
- The dash does **not** test spikes, dart lanes, or enemies — only `pb`. Landing on a live spike disk, a hot dart lane, or the outer lip is possible and must be rejected by the bot.
- After a successful dash, ring index / `loopDir` / heading no longer match the pre-dash route and must be re-synced from the new cell.
- `Da` stays `forward` until the 6 s timer ends, and debounce is only 5 frames, so **further dashes are possible** every 5 frames during the arm window. The bot must issue at most one verified dash per arm.
- **Water:** a candidate that is not `pb` (water / blocked) is skipped; a short fallback may still land on `pb`. A successful dash can also cancel a bad position only if the landing is `pb` — it does not clear `Ta` by itself. First press cannot be issued while already falling.

### 3 — yellow — rewind

- First Ctrl **arms** for **9 s** (`Ch + 3`) and calls `ra()`: the 12-sample ring buffer is filled with the **current** pose (position, quaternion, HP, animation).
- While armed, a new sample is written every **`D = 0.25` s**. 12 samples ≈ **3 s** of history. Oldest sample is the slot after the write head (`(Fc + 1) % 12`).
- **Second** Ctrl rewinds to that oldest pose: copy position and quaternion; **if current HP is lower than the saved HP, restore HP**; `ra()` resets the buffer to the rewound pose; **`Ta = false` (falling is cancelled)**; camera flag `k.N.Ob = true`; shadow made visible again.
- Second press **is allowed while falling**, so a rewind can save a water fall if it is issued before death.
- The landing pose is whatever was recorded ~3 s ago (or the arm pose if fewer than 3 s have elapsed). It is not spike/dart-safe by itself — the bot must refuse a rewind whose saved cell is now a hot spike disk or hot dart lane.
- Further second presses during the 9 s window are allowed (5-frame debounce). After a rewind, `ra()` has just filled the buffer with the current pose, so an immediate third press would snap to the same place.
- **Water / traps / enemies:** rewind does not freeze or slow the world. It can restore HP lost to melee, arrows, spikes, or fireballs, and can cancel a fall. It cannot revive a completed death (`la` expires the effect).

## Interaction summary

| | Enemies | Traps (spikes / darts) | Fireballs | Water / fall | Player move |
|---|---|---|---|---|---|
| Blue | 0.3× speed and windup | tick and projectiles 0.3× (up-window lasts longer in real time) | 0.3× | none | full speed |
| Red | frozen (no swing, no turn) | frozen in current state | frozen | none | full speed |
| Green | none | none (landing can overlap a trap) | none | only if a fallback `pb` landing is used; does not clear `Ta` | teleport |
| Yellow | none | none (can rewind off a trap / restore HP) | none | second press clears `Ta` and restores pose | teleport to saved pose |

## What this is not

Green is **not** reversed controls, a camera change, or a speed buff. The live “lost orientation” was a second Ctrl dashing 7.5 along facing and snapping to a cell centre, leaving `wi` / `loopDir` / heading wrong. Yellow is **not** a shield or area damage — it is a 3 s pose/HP rewind. Blue is world-slow, not a player speed-up (though the relative effect is the same).
