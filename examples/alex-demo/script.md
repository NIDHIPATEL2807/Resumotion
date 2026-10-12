# script.md — Alex Kim · Context Window theme
# Gate 1 approval document

BPM: 100 · DUR: ~72s (120 beats) · Theme: context_window

---

## Scene 1: Boot (beats 0–8 · 0–4.8s)

Dark terminal. Centred card fades in.

```
> context_window v2.4.1
> loading tools............. done
> awaiting query
```

Cursor blinks on the last line.

---

## Scene 2: User query (beats 8–20 · 4.8–12s)

Header bar appears: `context_window` centred · `● live session` green right.

User message panel slides in (amber border):

```
user:
who is this person? give me their story.
```

---

## Scene 3: Tool call — retrieve_experience (beats 18–40 · 10.8–24s)

Tool call header (blue border):
```
tool_call  retrieve_experience( resume_id="alex_001" )
```

JSON result lines expand:
```
role:        "Software Engineer"
company:     "Acme AI"
duration:    "2022 – present"
impact:      "2M daily requests · 6 model providers"
stack:       "Python · LangGraph · Kubernetes"
prev:        "Stripe · payments infra · gRPC migrations"
```

Context meter starts filling → 30%.

---

## Scene 4: Tool call — analyze_projects (beats 38–60 · 22.8–36s)

Tool call header:
```
tool_call  analyze_projects( resume_id="alex_001"  top_n=3 )
```

Three project cards staggered (blue / green / purple borders):

**CONTEXT COMPRESSION SDK**
60% token reduction · open source · LLM infra

**AGENT MEMORY LAYER**
persistent memory · 3 teams in production · multi-turn sessions

**EVAL HARNESS**
40 model variants · regression tests on prompt changes

Context meter → 65%.

---

## Scene 5: `<thinking>` block (beats 58–82 · 34.8–49.2s)

Purple border panel:

```
<thinking>
Alex built the infrastructure layer that makes LLM products
actually work in production — context routing, memory, evals.
Not someone who adds AI features on top of existing products.
Someone who builds the substrate other people's products run on.
The SDK and the memory layer compound each other.
Strong signal for infra-focused AI roles.
</thinking>
```

Context meter → 85%.

---

## Scene 6: Assistant response (beats 80–108 · 48–64.8s)

Green border panel:

```
assistant:
Product engineer who moved into AI infra and never looked back.
Built the context pipeline handling 2M daily requests at Acme AI,
then open-sourced a compression SDK that cuts token costs 60%.
The kind of person who sees the missing layer and builds it.
```

Context meter → 100% · chime.

---

## Scene 7: Outro (beats 108–120 · 64.8–72s)

```
CONTEXT COMPLETE
```

Blue→purple gradient headline, Syne 800.

```
alex@alexkim.dev · github.com/alexkim · alexkim.dev
open to: AI infra · context engineering · agent tooling
```

---

## Bespoke moment

The context meter hits 100% exactly as the assistant response finishes streaming — the meter and the last character of the response land on the same beat. A two-note chime plays. This is unique to Alex's reel.
