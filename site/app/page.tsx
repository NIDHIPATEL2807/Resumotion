"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Tab = "claude-ai" | "claude-code" | "zip";

const CMDS: Record<Tab, string> = {
  "claude-ai":   "/skills add github:nidhi-patel/resumotion",
  "claude-code": "claude skills add nidhi-patel/resumotion",
  "zip":         "Download ZIP -> /skills add ./resumotion",
};

const REELS = [
  { id:"speedrun",   file:"/reels/ninosauraus-speedrun.mp4",   name:"Speedrun",   person:"Nino",       meta:"120 BPM · ACTION · 58 s",   desc:"Zero-to-hero energy." },
  { id:"ipo",        file:"/reels/rameshwari-ipo-day.mp4",     name:"IPO Day",    person:"Rameshwari", meta:"72 BPM · CINEMATIC · 62 s",  desc:"Big-room gravity." },
  { id:"prospectus", file:"/reels/rameshwari-prospectus.mp4",  name:"Prospectus", person:"Rameshwari", meta:"88 BPM · INVESTOR · 55 s",   desc:"Boardroom-ready." },
  { id:"xymode",     file:"/reels/kaustubh-xy-mode-v2.mp4",    name:"XY Mode",    person:"Kaustubh",   meta:"140 BPM · TECH · 60 s",      desc:"Pure signal." },
  { id:"perception", file:"/reels/nidhi-patel-perception.mp4", name:"Perception", person:"Nidhi",      meta:"96 BPM · EDITORIAL · 57 s",  desc:"Slow-burn essay." },
];

const RESUME_LINES = [
  "Nidhi Patel  --  Technology Developer",
  "nidhipatel28.vercel.app",
  "nidhipatelspit@gmail.com",
  "-----------------------------------",
  "EXPERIENCE",
  "  Technology Developer Intern",
  "  Barclays · Pune · June 2026-",
  "-----------------------------------",
  "EDUCATION",
  "  B.Tech ECE + AI Minor · SPIT Mumbai",
  "  Graduating 2027",
  "-----------------------------------",
  "ACHIEVEMENTS",
  "  Top 5 · VoyageHack 3.0 (11k+ teams)",
  "  Winner · iAccelerate · Infosys",
  "  Rank 240 · Amazon ML Challenge 2025",
  "  Top 60 · iMobilothon 5.0 · Volkswagen",
  "-----------------------------------",
  "SKILLS",
  "  Python · TypeScript · Next.js",
  "  YOLOv8 · PyTorch · LLaMA3 · Docker",
];

function SceneLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <span className="text-[10px] font-mono tracking-[0.22em] uppercase shrink-0" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <span className="flex-1 h-px" style={{ background: "var(--line)" }} />
    </div>
  );
}

function HeroAnimation() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [showReel, setShowReel] = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= RESUME_LINES.length) {
        clearInterval(iv);
        setTimeout(() => {
          setScanning(true);
          setTimeout(() => {
            setShowReel(true);
            setScanning(false);
          }, 2600);
        }, 500);
      }
    }, 85);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="mt-14 max-w-6xl space-y-5">
      {/* top row */}
      <div className="flex items-stretch gap-4">
        {/* resume panel */}
        <div
          className="relative rounded-xl overflow-hidden shrink-0"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            width: "340px",
            opacity: showReel ? 0.3 : 1,
            transition: "opacity 1s ease",
            filter: showReel ? "blur(1.5px)" : "none",
          }}
        >
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-lo)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--line)" }} />
          </div>
          <div className="absolute top-3 right-3 text-[9px] font-mono tracking-widest" style={{ color: "var(--muted)" }}>resume.pdf</div>

          <div className="px-5 pt-10 pb-5 font-mono text-[10px] leading-[2]" style={{ color: "var(--ink)" }}>
            {RESUME_LINES.slice(0, visibleLines).map((line, i) => {
              const isSection = line === line.toUpperCase() && line.trim() && !line.includes("·") && !line.includes("@") && !line.includes(".") && !line.startsWith("-");
              const isDivider = line.startsWith("-");
              return (
                <div key={i} style={{ color: isDivider ? "var(--line)" : isSection ? "var(--accent)" : "var(--ink)" }}>
                  {line}
                </div>
              );
            })}
            {visibleLines < RESUME_LINES.length && (
              <span className="cursor" />
            )}
          </div>

          {scanning && (
            <>
              <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ mixBlendMode: "screen" }}>
                <div className="scan-line h-full" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center text-[9px] font-mono tracking-widest uppercase" style={{ color: "var(--accent)" }}>
                rendering reel<span className="cursor" />
              </div>
            </>
          )}
        </div>

        {/* arrow */}
        <div className="flex flex-col items-center justify-center gap-2 px-1 shrink-0">
          <div className="w-px flex-1" style={{ background: showReel ? "var(--accent)" : "var(--line)", transition: "background 0.8s" }} />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 9h14M10 4l5 5-5 5" stroke={showReel ? "var(--accent-hi)" : "var(--muted)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.8s" }} />
          </svg>
          <div className="w-px flex-1" style={{ background: showReel ? "var(--accent)" : "var(--line)", transition: "background 0.8s" }} />
        </div>

        {/* right: placeholder or reel preview */}
        {!showReel ? (
          <div className="flex-1 rounded-xl flex items-center justify-center" style={{ border: "1px dashed var(--line)" }}>
            <span className="text-[10px] font-mono" style={{ color: "var(--line)" }}>awaiting render...</span>
          </div>
        ) : (
          <div
            className="card-frame relative flex-1 rounded-xl overflow-hidden"
            style={{
              border: "1px solid var(--accent)",
              boxShadow: "0 0 40px rgba(196,41,74,0.25)",
              aspectRatio: "16/9",
            }}
          >
            <span className="fr-b" />
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent)", animation: "glow-pulse 2.5s ease-in-out infinite" }} />
              <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: "var(--accent)" }}>REC</span>
            </div>
            <video src="/reels/nidhi-patel-perception.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* full-width reel */}
      {showReel && (
        <div
          className="card-frame relative rounded-xl overflow-hidden w-full"
          style={{
            border: "1px solid var(--accent)",
            boxShadow: "0 0 80px rgba(196,41,74,0.3), 0 0 160px rgba(196,41,74,0.1)",
            aspectRatio: "16/9",
          }}
        >
          <span className="fr-b" />
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: "var(--accent)", boxShadow: "0 0 10px var(--accent)", animation: "glow-pulse 2.5s ease-in-out infinite" }} />
            <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--accent)" }}>REC</span>
          </div>
          <video src="/reels/nidhi-patel-perception.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

function ReelCard({ reel, delay }: { reel: typeof REELS[number]; delay: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [hov, setHov] = useState(false);

  return (
    <div
      data-reveal
      data-delay={String(delay)}
      className="card-frame relative rounded-lg overflow-hidden cursor-pointer"
      style={{ background: "var(--surface)", border: "1px solid var(--line)", opacity: 0, transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={() => { setHov(true); ref.current?.play().catch(() => {}); }}
      onMouseLeave={() => { setHov(false); if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; } }}
    >
      <span className="fr-b" />
      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: hov ? "var(--accent)" : "var(--line)", boxShadow: hov ? "0 0 6px var(--accent)" : "none", transition: "all 0.2s" }} />
        <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: hov ? "var(--accent)" : "var(--muted)", transition: "color 0.2s" }}>
          {reel.person}
        </span>
      </div>
      <div style={{ aspectRatio: "16/9", background: "var(--bg)" }}>
        <video ref={ref} src={reel.file} muted playsInline preload="metadata" className="w-full h-full object-cover" style={{ opacity: hov ? 1 : 0.65, transition: "opacity 0.3s" }} />
      </div>
      <div className="p-3.5">
        <h3 className="font-sans font-bold text-base tracking-tight mb-1.5" style={{ color: "var(--ink)" }}>{reel.name}</h3>
        <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--muted)" }}>{reel.desc}</p>
        <div className="text-[9px] font-mono tracking-widest uppercase pt-2.5" style={{ color: "var(--muted)", borderTop: "1px solid var(--line)" }}>
          {reel.meta}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("claude-ai");
  const [copied, setCopied] = useState(false);
  const playheadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = playheadRef.current;
    if (!el) return;
    const fn = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      el.style.height = (total > 0 ? (window.scrollY / total) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.animationDelay = (el.dataset.delay ?? "0") + "ms";
          el.classList.add("reveal");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const copy = useCallback(async () => {
    try { await navigator.clipboard.writeText(CMDS[tab]); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }, [tab]);

  return (
    <>
      <div id="playhead" ref={playheadRef} />

      {/* NAV */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-12"
        style={{ background: "rgba(18,6,9,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--line)" }}
      >
        <span className="font-sans font-extrabold text-base tracking-tight" style={{ color: "var(--ink)" }}>
          resumotion<span style={{ color: "var(--accent)" }}>°</span>
        </span>
        <div className="flex items-center gap-5">
          <a href="https://github.com/NIDHIPATEL2807/Resumotion" target="_blank" rel="noopener noreferrer"
            className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--muted)" }}>
            GitHub
          </a>
          <a href="https://x.com/Ninosauraus" target="_blank" rel="noopener noreferrer"
            className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--muted)" }}>
            X
          </a>
        </div>
      </header>

      <main className="pt-12">
        {/* HERO */}
        <section className="relative px-6 md:px-12 lg:px-20 pt-20 pb-28 overflow-hidden">
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(196,41,74,0.08) 0%, transparent 70%)" }} />
          <div className="relative max-w-6xl mx-auto">
            <div data-reveal data-delay="0" style={{ opacity: 0 }}>
              <SceneLabel label="01 · introducing" />
            </div>
            <h1
              data-reveal data-delay="60"
              className="font-sans font-extrabold tracking-tighter leading-[0.88] mb-6"
              style={{ fontSize: "clamp(60px, 11vw, 148px)", color: "var(--ink)", opacity: 0 }}
            >
              Your resume,<br />
              <em style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", color: "var(--accent)" }}>
                in motion.
              </em>
            </h1>
            <p data-reveal data-delay="140" className="text-base md:text-lg max-w-lg mb-10 leading-relaxed" style={{ color: "var(--muted)", opacity: 0 }}>
              A free Claude skill. One chat. 60-second reel with music, generated for you.
            </p>

            {/* install */}
            <div data-reveal data-delay="220" className="rounded-xl p-1 max-w-md" style={{ background: "var(--surface)", border: "1px solid var(--line)", opacity: 0 }}>
              <div className="flex gap-1 px-3 pt-3 pb-2">
                {(["claude-ai", "claude-code", "zip"] as Tab[]).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className="text-[10px] font-mono font-medium px-3 py-1 rounded-md transition-all cursor-pointer"
                    style={{ background: tab === t ? "var(--accent-lo)" : "transparent", color: tab === t ? "var(--ink)" : "var(--muted)", border: tab === t ? "1px solid var(--accent)" : "1px solid transparent", letterSpacing: "0.08em" }}>
                    {t === "claude-ai" ? "Claude.ai" : t === "claude-code" ? "Claude Code" : "Zip"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mx-3 mb-3 px-4 py-3 rounded-lg" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
                <code className="text-xs font-mono flex-1 truncate" style={{ color: "var(--ink)" }}>{CMDS[tab]}</code>
                <button onClick={copy}
                  className="shrink-0 text-[9px] font-mono font-medium px-2.5 py-1 rounded-md transition-all cursor-pointer"
                  style={{ background: copied ? "var(--ok)" : "var(--surface-2)", color: copied ? "#000" : "var(--muted)", border: "1px solid var(--line)", minWidth: "56px" }}>
                  {copied ? "copied!" : "copy"}
                </button>
              </div>
            </div>

            <HeroAnimation />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 md:px-12 lg:px-20 py-24">
          <div className="max-w-6xl mx-auto">
            <div data-reveal data-delay="0" style={{ opacity: 0 }}><SceneLabel label="02 · how it works" /></div>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { n: "01", title: "Drop your resume", body: "Paste or attach in any Claude chat. No form, no portal." },
                { n: "02", title: "Pick a theme", body: "Speedrun, IPO Day, XY Mode — each is a complete audio-visual world." },
                { n: "03", title: "Reel exported", body: "Claude renders frame-by-frame: type, colour, music. Done in one message." },
              ].map((s, i) => (
                <div key={s.n} data-reveal data-delay={String(i * 90)} className="flex flex-col gap-4" style={{ opacity: 0 }}>
                  <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>{s.n}</span>
                  <h3 className="text-xl font-sans font-bold tracking-tight" style={{ color: "var(--ink)" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="px-6 md:px-12 lg:px-20 py-24">
          <div className="max-w-6xl mx-auto">
            <div data-reveal data-delay="0" style={{ opacity: 0 }}><SceneLabel label="03 · the reels" /></div>
            <h2 data-reveal data-delay="60" className="font-sans font-extrabold tracking-tighter leading-none mb-14" style={{ fontSize: "clamp(38px, 5.5vw, 72px)", color: "var(--ink)", opacity: 0 }}>
              Every theme<br />is a world.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {REELS.map((r, i) => <ReelCard key={r.id} reel={r} delay={i * 55} />)}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-12 lg:px-20 py-32 text-center">
          <div data-reveal data-delay="0" className="max-w-lg mx-auto" style={{ opacity: 0 }}>
            <SceneLabel label="04 · get started" />
            <h2 className="font-sans font-extrabold tracking-tighter leading-none mb-5" style={{ fontSize: "clamp(44px, 7vw, 96px)", color: "var(--ink)" }}>
              One chat.<br />
              <em style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", color: "var(--accent)" }}>Your reel.</em>
            </h2>
            <p className="text-sm mb-10" style={{ color: "var(--muted)" }}>Free. Open source. No login.</p>
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer"
              className="glow inline-flex items-center gap-2 px-8 py-4 rounded-full font-sans font-bold text-sm transition-all hover:scale-[1.04] active:scale-[0.97]"
              style={{ background: "var(--accent)", color: "var(--ink)" }}>
              Open in Claude.ai
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--line)" }}>
        <div className="px-6 md:px-12 lg:px-20 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-sans font-extrabold text-xl tracking-tight mb-1" style={{ color: "var(--ink)" }}>
              resumotion<span style={{ color: "var(--accent)" }}>°</span>
            </div>
            <div className="text-xs font-mono" style={{ color: "var(--muted)" }}>
              turn your resume into a reel — free, open source
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/NIDHIPATEL2807/Resumotion" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-mono transition-colors hover:opacity-80" style={{ color: "var(--muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
            <a href="https://x.com/Ninosauraus" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-mono transition-colors hover:opacity-80" style={{ color: "var(--muted)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Twitter / X
            </a>
            <a href="https://nidhipatel28.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-mono transition-colors hover:opacity-80" style={{ color: "var(--muted)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              nidhipatel28.vercel.app
            </a>
          </div>
        </div>
        <div className="px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--line)" }}>
          <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>2025 Nidhi Patel — MIT License</span>
          <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>built with Claude</span>
        </div>
      </footer>
    </>
  );
}
