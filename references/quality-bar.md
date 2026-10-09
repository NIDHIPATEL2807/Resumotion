# Quality Bar — Claude Reference

Every check returns **pass**, **fixed**, or **n/a**. Nothing is silently skipped. Print the full report after every render.

---

## Automated checks (toolkit runs these)

| Check | Rule | Tool |
|---|---|---|
| Text duration | Each text block on screen for ≥ `words ÷ 3 + 1` seconds | `check-audio.js` + frame scan |
| Safe area | All text ≥ 5% inside every edge (96 px at 1920×1080) | framesheet scan |
| Contrast | ≥ 4.5:1 at the worst frame | framesheet scan |
| Loudness | −14 LUFS ±1, true peak ≤ −1 dBTP | `check-audio.js` |
| A/V sync | Each visual hit lands within 2 frames of its sound | framesheet + audio alignment |
| Text overflow | Zero — measured with real font metrics | `stills.js` pre-render |
| Flash rate | ≤ 3 full-screen flashes per second | framesheet scan |
| Black frames | None (avg luminance < 2% = fail) | framesheet scan |
| Frozen frames | No two consecutive frames with pixel diff < 0.1% | framesheet scan |

---

## Human checks (you do these before Gate 2)

Ask yourself honestly:

**Structure**
- [ ] Frame 1 is designed — not black, not a loading spinner, not accidental
- [ ] The last frame rhymes with the first (same motif, closed loop, invites replay)
- [ ] The screen never goes blank — during silence, something is always visible (at minimum the name or a dot)
- [ ] Every cut lands on a beat or a 16th note — nothing feels arbitrary
- [ ] Every cut has a carrier — a shape, line, mask, or wipe brings the next scene in. Crossfades are a last resort.

**Sound**
- [ ] Big moments (name slam, drop, outro) get full hits
- [ ] Small moments (stat tick, box lock) get soft ticks
- [ ] Some micro-moments get nothing — not every event needs a sound
- [ ] The silence beat is truly silent — music gain cut in ≤ 30 ms, no bleed
- [ ] It sounds good on phone speakers (check at −14 LUFS, not studio volume)

**Visuals**
- [ ] There is texture — grain, jitter, imperfection. It must not feel sterile.
- [ ] Negative space and silence are used on purpose, not because a scene ran out of content
- [ ] It works on mute — the meaning is carried by the visuals alone
- [ ] Type is big enough to read on a phone screen in 9:16 (even though we render 16:9)
- [ ] The end card is tasteful: `made with resumotion°` in small muted text, ~1.5 s, not centered and loud

**Content**
- [ ] Every on-screen fact matches the approved script.md
- [ ] No facts were invented — check against facts.json
- [ ] The hero story has a real problem and a real result
- [ ] The thesis words are earned by actual projects in the reel

---

## The "would a pro make this?" test

If a stranger who has never seen resumotion watched this, would they think a motion designer made it for this specific person? If yes: ship it. If no: find the weakest moment and fix it first.

Common failure modes:
- Opener is just a black screen with text — no visual interest
- Name scene feels like a placeholder
- Every scene uses the same transition
- The music and the visuals are not actually in sync
- Text is technically readable but emotionally flat
- End card is too big, too long, or breaks the visual tone

---

## Variety check (when building for multiple people in one theme)

Render example resumes side by side as frame sheets. If you can't tell people apart without reading the text, the theme doesn't have enough variety. Fix with:
1. Different scene selections (strongest lever — free)
2. Different seed → different grain, jitter, box positions
3. Different palette variant
4. Different scene variants for project / name / outro

Never use the same transition carrier twice in a row within a single reel.
