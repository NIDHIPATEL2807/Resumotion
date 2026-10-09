# Copywriting — Claude Reference

How to write on-screen text. Sourced from 6 reels, 5 themes, 3 people.

---

## The one rule: story beats lists

A problem → insight → solution → result arc is stronger than any bullet list of projects. Every theme proves this. The Barclays scene in Perception v2 — "talked to solution architects → found C4 diagrams drawn by hand → bottleneck → pipeline → 4 outcomes" — was the strongest 9 seconds in any reel made so far. Build from the hero story outward, not from the resume inward.

---

## Vocabulary — use the field's own words

Each theme has a native vocabulary. Don't cross them.

| Theme | Vocabulary |
|---|---|
| Perception | detects, perceives, reasons, deploys, model, pipeline, confidence, inference |
| Speedrun | level, boss, smash, PB, split, collected, unlocked, cleared |
| IPO Day | files, covers, fills, beats, halts, lists, prospectus, initiate coverage, trading halted |
| Prospectus | tombstone, waterfall, league table, mandate, structure, execute |
| Blueprint / VLSI | tape-out, sign-off, coverage, DRC/LVS, timing closure, floorplan, first silicon |

Using the wrong vocabulary is a tell — a markets reel with "pipelines" or a VLSI reel with "deployed to production" breaks immersion.

---

## Identity labels, not filenames

Detector labels, HUD text, and system identifiers should say who the person *is*, not their name as a string.

| Wrong | Right |
|---|---|
| `jane_doe` | `builder 0.99` |
| `user_1` | `problem_finder 0.98` |
| `loading jane_doe.onnx` | `loading jane_doe.nino` |
| `tracks 3` | `open to: FDE · SDE · AI eng` (cycling) |

The label is identity. The filename is a cliché.

---

## Newsroom one-liners

One sentence that tells the whole story is worth more than three scenes of bullet points. The best headline across all reels:

> **"ENGINEER TURNED ANALYST FILES TO GO PUBLIC"**

That's 7 words and tells a complete story. When writing an opening headline, try:
- Subject + transformation + action
- Present tense, active voice
- No adjectives ("highly analytical" → never)

---

## Confidence scores on detector labels

Use these as a feel guide:

| Score | Use for |
|---|---|
| `0.99` | The person's core identity (name scene) |
| `0.97–0.98` | Their defining approach / thesis |
| `0.94–0.96` | Strong projects with real outcomes |
| `0.88–0.93` | Supporting projects, experiences |
| `1.0` | Outro availability label only |

Never go below 0.85 — it implies doubt. Never use 1.0 except in the outro. The scores should feel earned, not random.

---

## Hooks must be said on screen

If the hook is not legible without sound, put it on screen explicitly.

> "THE SOUND YOU HEAR IS DRAWING THIS"

Without that caption, the XY Mode trick was invisible to anyone watching without headphones. If your theme has a concept that isn't self-evident, say it.

---

## Group skills, never dump them

A tool dump is unreadable and looks like a resume, not a reel. Always group:

```
Agents & GenAI · LangGraph · CrewAI · RAG
Computer Vision · YOLO · MiDaS · OpenCV
Backend · FastAPI · PostgreSQL · Docker
Frontend · React · Next.js
```

5 categories × 3–4 items each = readable and impressive. 16 tools in 4 seconds = noise.

---

## Numbers and claims

**Real numbers only.** If the resume has a number, use it. If it doesn't, use a qualitative win.

- "82% faster" ✅ (from resume)
- "significantly faster" ❌ (invented, worthless)
- "zero misroutes" ✅ (from resume)
- "improved efficiency" ❌ (invented, worthless)

**Count claims carefully.** "Five hackathons, five trophies" — check that ML challenges count as hackathons. If unsure, say "five trophies" and describe each one.

**Confidence with rank.** "ML CHALLENGE" as a headline is flat. If there's a rank, use it. If there isn't one, use the full event name as the anchor line and a verb as the headline ("Competed in Amazon ML Challenge 2025").

---

## Defaults — what to exclude unless asked

| Item | Default |
|---|---|
| CGPA / GPA | Off. Ask if they want it. |
| Phone number | Off. Strip silently if in the resume paste. |
| Home address | Off. Strip silently. |
| QR code | Off. Only add if explicitly requested. |
| Confidential team/tool names | Off. Ask first, log the answer. |

---

## Honesty tags

When something is academic or unconfirmed, label it clearly. This protects the person and builds trust:

| Situation | Label |
|---|---|
| Academic case study / coursework deal | "case study" |
| Work in progress | "in progress" |
| Indicative / estimated chart | "indicative" |
| Methodology shown, no real output | the method name only (e.g. "DCF methodology") |

Never show a number that implies real money/results if it came from a coursework assignment. The Prospectus reel got this right: "$120M + $200M" was labelled as a case study.

---

## Confirm the display name

Always confirm what name to show on screen. The resume and the chat conversation can have different names. When in doubt, ask: *"What name should I show on screen?"*

---

## The thesis must be earned

The 3 cycling words (see / think / ship, etc.) must connect to actual projects in the reel. Don't write "scale" if there's no evidence of scale. Don't write "ship" if every project is academic. Read the facts, then write the thesis — never the other way around.

---

## Cross-scene copy consistency

- The identity label in the name scene (`builder 0.99`) should rhyme with the outro (`available 1.0`). Same voice, bookended.
- The thesis words should echo in the project scenes. If the thesis says "see / think / ship", the project visuals should reinforce at least two of those.
- The hero story's "bottleneck" label should be the hardest-hitting label in the reel — more jitter, slightly larger pill.
