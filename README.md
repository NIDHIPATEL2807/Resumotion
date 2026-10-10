# resumotion°

**Attach your resume. Get a motion-graphics video reel — invented for you, not a template.**

A Claude skill. Works in claude.ai and Claude Code. No timeline software, no After Effects, no design skills needed.

---

<!-- add a GIF here once one is exported -->

---

## Install

### claude.ai
1. Download [resumotion.zip](../../releases/latest/download/resumotion.zip)
2. Go to **claude.ai → Customize → Skills → Upload**
3. Upload the zip and turn it on
4. Start a new chat, attach your resume PDF, and say **"make my reel"**

### Claude Code
```bash
# copy the skill folder into Claude Code's skills directory
cp -r resumotion ~/.claude/skills/resumotion
```
Then in any project:
```
/resumotion
```
Or just attach your resume and say **"make my reel"** — Claude finds the skill automatically.

---

## How it works

1. You attach a resume (PDF, text, LinkedIn — anything works)
2. Claude reads it and proposes 3 concepts — original, remix, or closest theme
3. You pick one and approve the screenplay
4. Claude builds a self-contained HTML file with canvas animation + synthesized music
5. Open it in your browser → **▶ Play** to preview, **⏺ Record** to export a video
6. If you have ffmpeg + Playwright installed, Claude renders the MP4 automatically

The HTML works offline. No API keys. No subscriptions. No uploads.

---

## Themes

| Theme | For |
|---|---|
| `perception` | ML engineers, computer vision, AI/robotics |
| `speedrun` | Hackers, game devs, people with a mascot or strong online identity |
| `ipo-day` | Finance, IB, equity research, consulting, MBA |
| `prospectus` | Premium finance, policy, law, NGO — editorial weight |
| `blueprint` | Core engineering — electronics, VLSI, mechanical, embedded |
| `context_window` | LLM/agent builders, context engineers, AI infra |
| `general` | Teachers, HR, ops, healthcare, architecture — anyone else |

You're not locked to a theme. Claude can invent a concept from scratch.

---

## Examples

| Person | Theme | Reel |
|---|---|---|
| Nidhi | Perception | [link TBD] |
| Nino | Speedrun | [link TBD] |
| Rameshwari | IPO Day | [link TBD] |
| Rameshwari | Prospectus | [link TBD] |
| Kaustubh | XY Mode | [link TBD] |

---

## Rendering to MP4 (optional)

The browser **⏺ Record** button works everywhere and needs nothing installed.

For a higher-quality render:
```bash
cd resumotion/scripts
npm install
npx playwright install chromium   # one-time

node render.js my-reel.html --name my-reel
# outputs: out/my-reel-master.mp4 + out/my-reel-social.mp4
```
Requires: Node ≥ 20, ffmpeg.

---

## License

MIT — see [LICENSE](LICENSE).
