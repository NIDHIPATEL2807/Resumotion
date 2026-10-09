# Discovery — Claude Reference

This is step 1. Extract facts, check for confidential content, ask ≤ 2 questions.

---

## Extracting facts.json

Copy only. If it's not in the resume, the value is `null`. Never infer, guess, or embellish.

```json
{
  "name": "Full Name",
  "role": "how they describe their work in ≤6 words",
  "tagline": "their own tagline if they have one, else null",
  "projects": [
    {
      "title": "Project Name",
      "what": "what it does, in one plain sentence",
      "metric": "any real number from the resume, else null",
      "tags": ["domain tags"],
      "confidential": false
    }
  ],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "dates": "Mon YYYY – Mon YYYY",
      "what": "what they actually did, in one sentence",
      "confidential": false,
      "confidential_note": null
    }
  ],
  "wins": [
    { "label": "Winner", "event": "Event Name", "detail": "N+ participants or teams", "logo": null }
  ],
  "stack": ["Tech1", "Tech2"],
  "contact": { "email": null, "github": null, "linkedin": null, "site": null },
  "brand": { "colors": [], "fonts": [] },
  "persona_image": null,
  "looking_for": null,
  "source_notes": "Everything here appears in the input. Nothing inferred."
}
```

**Rules:**
- `role` is punchy and human. "AI-first engineer" not "Software Engineer II at Acme Corp".
- `metric` is only populated if a real number appears in the resume. Never estimate.
- `tags` are domain labels, never visual keys. `"cv"` yes, `"depth_map"` no — visuals live only in the HTML.
- User corrections during Gate 1 are facts. Update facts.json immediately so they can't revert.

---

## Confidentiality check

Before asking any questions, scan for:

| Flag | Example | Action |
|---|---|---|
| Internal team/tool name | "Project Falcon", "our internal ML platform" | Ask: *"I noticed [X] — OK to show on screen, or should I use a generic description?"* |
| Unreleased product | "we're launching X in Q4" | Same — ask first |
| Client name under NDA | "for [ClientCo]" | Ask |
| Non-public financial metric | "reduced costs by $X for [enterprise client]" | Ask |
| Personal: phone number, home address | present in the paste | Strip silently, don't include in the reel |

Ask once per flagged item. Wait for the answer. Log it in `confidential_note`. Never assume silence = consent.

If the user says no to including something: mark `confidential: true`, note it, and use the company name only or a generic description.

---

## The ≤ 2 questions

Ask only what the resume doesn't already tell you. Order of priority:

1. **Feel** (always worth asking if not obvious from the resume tone):
   *"One word for how you want this to feel?"*
   Options: calm / fast / precise / bold / playful
   → Maps to transition speed, music energy, type density

2. **Accent color** (ask if no brand colors in the resume):
   *"Any brand color or accent color you love? Hex, name, or just describe it."*
   → Overrides theme default accent

3. **Theme-specific** (pick one if relevant — see each THEME.md):
   - Perception: *"Do you have a nickname or handle for your work?"* (boot text, detector label)
   - Speedrun: *"Does your mascot have a name?"*
   - IPO: *"What would your ticker symbol be?"*
   - Blueprint: (auto-detected from resume — no need to ask)

Never ask about: fonts, scene count, duration, music style, layout, or anything technical. You decide those.

---

## Minimum to proceed

Name + role + at least one thing they did. If any of these are missing after reading the resume, ask one direct question:

- Missing name: *"What's your name?"*
- Missing role: *"What do you do, in a few words?"*
- Missing any project/experience: *"Tell me one thing you've built or done that you're proud of."*

Never ask more than 3 questions total across this whole step (including confidentiality checks). If you're still missing information after 3, proceed with what you have and mark missing fields `null`.
