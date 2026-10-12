"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";

/* ── fetch total zip+tar.gz downloads from GitHub releases ── */
function useDownloadCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    fetch("https://api.github.com/repos/NIDHIPATEL2807/Resumotion/releases")
      .then(r => r.json())
      .then((releases: Array<{ assets: Array<{ download_count: number }> }>) => {
        const total = releases.flatMap(r => r.assets).reduce((s, a) => s + a.download_count, 0);
        setCount(total);
      })
      .catch(() => {});
  }, []);
  return count;
}

/* ── data ────────────────────────────────────────────────── */
const BAR_COLORS = ["#C0C0C0","#C0C000","#00C0C0","#00C000","#C000C0","#C00000","#0000C0"];

type InstallTab = "claude-code" | "claude-ai";

const ZIP_URL = "https://github.com/NIDHIPATEL2807/Resumotion/releases/latest/download/resumotion.zip";

const INSTALL: Record<InstallTab, { label: string; steps: string[]; cmd: string; isZip?: boolean; note?: string }> = {
  "claude-code": {
    label: "Claude Code",
    cmd: ZIP_URL,
    isZip: true,
    steps: [
      "Download the ZIP and unzip it — you get a resumotion/ folder.",
      "Move that folder into ~/.claude/skills/ (Mac/Linux) or %USERPROFILE%\\.claude\\skills\\ (Windows).",
      "Restart Claude Code, attach your resume, and pick a theme.",
    ],
  },
  "claude-ai": {
    label: "Claude.ai",
    cmd: ZIP_URL,
    isZip: true,
    steps: [
      "Download the ZIP below.",
      "Go to Claude.ai → Settings → Skills → Upload a skill.",
      "Upload the zip — done. Attach your resume and pick a theme.",
    ],
    note: "No unzipping needed for Claude.ai — upload the zip directly.",
  },
};

const SHOWCASE = [
  {
    id:"speedrun",   file:"/reels/ninosauraus-speedrun.mp4",
    name:"Speedrun",   person:"Nidhi",      role:"CS Student",
    meta:"120 BPM · ACTION · 58 s",
    desc:"Zero-to-hero energy. Fast cuts, pure momentum.",
    linkedin:"https://www.linkedin.com/in/nidhi-patel-424674252/",
  },
  {
    id:"perception", file:"/reels/nidhi-patel-perception-social.mp4",
    name:"Perception", person:"Nidhi",      role:"Technology Developer",
    meta:"96 BPM · EDITORIAL · 57 s",
    desc:"Slow-burn visual essay. Measured.",
    linkedin:"https://www.linkedin.com/in/nidhi-patel-424674252/",
  },
  {
    id:"xymode",     file:"/reels/kaustubh-xy-mode-v2.mp4",
    name:"XY Mode",    person:"Kaustubh",   role:"Electrical Engineer",
    meta:"140 BPM · TECH · 60 s",
    desc:"Oscilloscope aesthetic. Pure signal.",
    linkedin:"https://www.linkedin.com/in/kaustubh-vekhande-a583712b6/",
  },
  {
    id:"ipo",        file:"/reels/rameshwari-ipo-day.mp4",
    name:"IPO Day",    person:"Rameshwari", role:"Finance Analyst",
    meta:"72 BPM · CINEMATIC · 62 s",
    desc:"Big-room gravity. Like a market opening bell.",
    linkedin:"https://www.linkedin.com/in/rameshwari28/",
  },
  {
    id:"prospectus", file:"/reels/rameshwari-prospectus.mp4",
    name:"Prospectus", person:"Rameshwari", role:"Finance Analyst",
    meta:"88 BPM · INVESTOR · 55 s",
    desc:"Clean, confident, boardroom-ready.",
    linkedin:"https://www.linkedin.com/in/rameshwari28/",
  },
  {
    id:"nptv",       file:"/reels/nidhi-patel-NPTV-reel.mp4",
    name:"Signal Hijack", person:"Nidhi",   role:"Technology Developer",
    meta:"NP·TV · PIRATE BROADCAST",
    desc:"The channel gets hijacked. Every cut is a channel flip.",
    linkedin:"https://www.linkedin.com/in/nidhi-patel-424674252/",
  },
];

const SCHEDULE = [
  { time:"09:00", title:"Upload your resume",  desc:"Paste or attach in any Claude chat. No form, no portal." },
  { time:"09:05", title:"Pick your concept",   desc:"Speedrun, IPO Day, XY Mode — each is a full audio-visual world." },
  { time:"09:10", title:"Approve the script",  desc:"Claude drafts the reel concept. Tweak anything before rendering." },
  { time:"09:15", title:"Your film airs",       desc:"60-second reel, music included, ready to share anywhere." },
];

/* ── helpers ─────────────────────────────────────────────── */
function pad(n: number) { return String(n).padStart(2,"0"); }
function localTime() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function ColorBars({ h = "100%" }: { h?: string }) {
  return (
    <div style={{ display:"flex", height:h, width:"100%" }}>
      {BAR_COLORS.map(c => <span key={c} style={{ flex:1, background:c }} />)}
    </div>
  );
}

/* ── LinkedIn icon ───────────────────────────────────────── */
function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

/* ── Header ──────────────────────────────────────────────── */
function Header() {
  const [time, setTime] = useState("00:00:00");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setTime(localTime());
    const id = setInterval(() => setTime(localTime()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (scrolled) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded"
        style={{ background:"rgba(21,21,24,0.94)", backdropFilter:"blur(12px)", border:"1px solid var(--line)" }}>
        <span className="on-air-dot w-2 h-2 rounded-full" style={{ background:"var(--crimson)" }} />
        <span className="font-display font-bold text-sm uppercase" style={{ color:"var(--paper)", letterSpacing:"0.05em" }}>
          resumotion<span style={{ color:"var(--crimson)" }}>°</span> TV
        </span>
      </div>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-6 h-12"
      style={{ background:"rgba(11,11,13,0.94)", backdropFilter:"blur(12px)", borderBottom:"1px solid var(--line)" }}>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="on-air-dot w-2.5 h-2.5 rounded-full" style={{ background:"var(--crimson)" }} />
        <span className="font-teletext uppercase tracking-widest" style={{ color:"var(--crimson)", fontSize:"18px" }}>ON AIR</span>
      </div>
      <div className="w-px h-4 shrink-0" style={{ background:"var(--line)" }} />
      <span className="font-display font-bold uppercase shrink-0" style={{ color:"var(--paper)", fontSize:"16px", letterSpacing:"0.05em" }}>
        resumotion<span style={{ color:"var(--crimson)" }}>°</span> TV
      </span>
      <nav className="hidden md:flex items-center flex-1 justify-center gap-1">
        {[{ch:"01",label:"HOME",href:"#home"},{ch:"02",label:"SHOWCASE",href:"#showcase"},{ch:"03",label:"HOW",href:"#how"},{ch:"04",label:"SUBSCRIBE",href:"#subscribe"}].map(n => (
          <a key={n.ch} href={n.href}
            className="flex items-center gap-1 px-3 h-12 font-teletext transition-all hover:text-crimson group"
            style={{ fontSize:"17px", color:"var(--muted)" }}>
            <span className="group-hover:text-[var(--crimson)] transition-colors" style={{ color:"var(--line)", fontSize:"12px" }}>CH{n.ch}</span>
            <span className="ml-1 group-hover:text-[var(--crimson)] transition-colors">{n.label}</span>
          </a>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-4 shrink-0">
        <span className="font-teletext hidden sm:block" style={{ color:"var(--muted)", fontSize:"19px" }}>{time} IST</span>
        <a href="https://github.com/NIDHIPATEL2807/Resumotion" target="_blank" rel="noopener noreferrer"
          className="font-teletext hover:opacity-70 transition-opacity" style={{ color:"var(--muted)", fontSize:"16px" }}>GH</a>
        <a href="https://x.com/Ninosauraus" target="_blank" rel="noopener noreferrer"
          className="font-teletext hover:opacity-70 transition-opacity" style={{ color:"var(--muted)", fontSize:"16px" }}>X</a>
      </div>
    </header>
  );
}

/* ── CRT TV ──────────────────────────────────────────────── */
function CRTHero() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  return (
    <div className="relative max-w-2xl mx-auto lg:mx-0 lg:ml-auto">
      <div className="crt-frame scanlines" style={{ aspectRatio:"16/10", background:"var(--ink)" }}>
        <video
          ref={ref}
          src="/reels/nidhi-patel-NPTV-reel.mp4"
          autoPlay loop playsInline muted={muted}
          className="w-full h-full object-cover"
          style={{ cursor:"pointer" }}
          onClick={() => { if(ref.current?.paused) ref.current.play(); else ref.current?.pause(); }}
        />
        {/* sound toggle */}
        <button
          onClick={() => setMuted(m => !m)}
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded font-teletext transition-all hover:opacity-80 cursor-pointer"
          style={{ background:"rgba(11,11,13,0.75)", border:"1px solid var(--line)", color: muted ? "var(--muted)" : "var(--crimson)", fontSize:"14px", backdropFilter:"blur(6px)" }}>
          {muted ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          )}
          {muted ? "MUTED" : "SOUND"}
        </button>
        {/* lower third */}
        <div className="lower-third">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-teletext" style={{ color:"var(--crimson)", fontSize:"13px", letterSpacing:"0.15em" }}>NOW SHOWING</div>
              <div className="font-display font-bold uppercase" style={{ color:"var(--paper)", fontSize:"17px" }}>
                NP·TV — Signal Hijack &mdash; made from one resume
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 mb-0.5">
              <span className="on-air-dot w-2 h-2 rounded-full" style={{ background:"var(--crimson)" }} />
              <span className="font-teletext" style={{ color:"var(--crimson)", fontSize:"13px" }}>LIVE</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-[-60px] -z-10"
        style={{ background:"radial-gradient(ellipse 80% 70% at 50% 50%, rgba(196,41,74,0.07) 0%, transparent 70%)" }} />
    </div>
  );
}

/* ── Copy Button ─────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000); } catch {}
  };
  return (
    <button onClick={copy} className="shrink-0 px-3 py-1 rounded font-teletext cursor-pointer transition-all"
      style={{ background: copied ? "#3DDC84" : "var(--crimson)", color: copied ? "#000" : "var(--paper)", fontSize:"14px", minWidth:"64px" }}>
      {copied ? "DONE!" : "COPY"}
    </button>
  );
}

/* ── Showcase Card ───────────────────────────────────────── */
function ShowcaseCard({ reel, delay }: { reel: typeof SHOWCASE[number]; delay: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [hov, setHov] = useState(false);

  return (
    <div data-reveal data-delay={String(delay)}
      className="rounded-xl overflow-hidden group"
      style={{ background:"var(--panel)", border:"1px solid var(--line)", opacity:0, transition:"border-color 0.2s, transform 0.25s, box-shadow 0.25s" }}
      onMouseEnter={()=>{ setHov(true); ref.current?.play().catch(()=>{}); }}
      onMouseLeave={()=>{ setHov(false); if(ref.current){ref.current.pause();ref.current.currentTime=0;} }}>

      {/* video */}
      <div className="relative" style={{ aspectRatio:"16/9", background:"var(--ink)" }}>
        <video ref={ref} src={reel.file} muted playsInline preload="metadata"
          className="w-full h-full object-cover"
          style={{ opacity: hov ? 1 : 0.65, transition:"opacity 0.3s" }} />

        {/* channel badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full transition-all"
            style={{ background: hov ? "var(--crimson)" : "var(--line)", boxShadow: hov ? "0 0 6px var(--crimson)" : "none" }} />
          <span className="font-teletext uppercase tracking-widest transition-colors"
            style={{ color: hov ? "var(--crimson)" : "var(--muted)", fontSize:"14px" }}>
            {reel.name}
          </span>
        </div>

        {/* hover: play hint */}
        {hov && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-teletext" style={{ color:"rgba(255,255,255,0.6)", fontSize:"28px" }}>&#9654;</span>
          </div>
        )}
      </div>

      {/* meta */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-display font-bold uppercase" style={{ color:"var(--paper)", fontSize:"22px", letterSpacing:"0.03em", lineHeight:1 }}>
              {reel.name}
            </h3>
            <p className="font-body text-sm mt-0.5" style={{ color:"var(--muted)" }}>{reel.desc}</p>
          </div>
          {/* LinkedIn — only shown if URL provided */}
          {reel.linkedin ? (
            <a href={reel.linkedin} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all hover:opacity-80 mt-0.5"
              style={{ background:"var(--panel-2)", border:"1px solid var(--line)", color:"var(--muted)" }}
              title={`${reel.person} on LinkedIn`}>
              <LinkedInIcon />
              <span className="font-body text-xs">{reel.person}</span>
            </a>
          ) : (
            <span className="shrink-0 font-body text-xs mt-0.5" style={{ color:"var(--muted)" }}>
              {reel.person}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2.5" style={{ borderTop:"1px solid var(--line)" }}>
          <span className="font-teletext uppercase" style={{ color:"var(--muted)", fontSize:"13px" }}>{reel.meta}</span>
          <span className="font-body text-xs" style={{ color:"var(--muted)" }}>{reel.role}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function Home() {
  const playheadRef = useRef<HTMLDivElement>(null);
  const downloads = useDownloadCount();

  useEffect(() => {
    const el = playheadRef.current;
    if (!el) return;
    const fn = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      el.style.height = (total > 0 ? (window.scrollY / total) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.animationDelay = (el.dataset.delay ?? "0") + "ms";
          el.classList.add("reveal");
          io.unobserve(el);
        }
      });
    }, { threshold:0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div id="playhead" ref={playheadRef} />
      <Header />

      <main className="pt-12" id="home">

        {/* ── HERO ── */}
        <section className="px-6 md:px-12 lg:px-20 pt-16 pb-24">
          <div className="max-w-6xl mx-auto space-y-10">

            {/* headline left | CRT TV right */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

              {/* LEFT: headline + tagline only */}
              <div className="flex-1 min-w-0">
                <div data-reveal data-delay="0" className="flex items-center gap-2 mb-7" style={{ opacity:0 }}>
                  <span className="on-air-dot w-2.5 h-2.5 rounded-full shrink-0" style={{ background:"var(--crimson)" }} />
                  <span className="font-teletext uppercase tracking-widest" style={{ color:"var(--crimson)", fontSize:"18px" }}>BROADCASTING LIVE</span>
                </div>

                <h1 data-reveal data-delay="60"
                  className="font-display font-bold uppercase leading-none mb-5"
                  style={{ fontSize:"clamp(52px, 9vw, 112px)", color:"var(--paper)", letterSpacing:"0.02em", opacity:0 }}>
                  YOUR RESUME,<br />
                  <span style={{ color:"var(--crimson)" }}>AS A FILM.</span>
                </h1>

                <p data-reveal data-delay="120" className="font-body leading-relaxed" style={{ color:"var(--muted)", fontSize:"18px", opacity:0 }}>
                  Not a template. A free Claude skill that builds you a 60-second reel with music, in one chat.
                </p>
              </div>

              {/* RIGHT: CRT TV + install below it */}
              <div className="w-full lg:w-[500px] shrink-0 space-y-4">
                <div data-reveal data-delay="100" style={{ opacity:0 }}>
                  <CRTHero />
                </div>

                {/* install block — directly under TV */}
                <div data-reveal data-delay="200" className="space-y-3" style={{ opacity:0 }}>
                  {/* two buttons side by side */}
                  <div className="flex gap-3 flex-wrap">
                    <a href={ZIP_URL} target="_blank" rel="noopener noreferrer"
                      onClick={() => track("zip_download", { location: "hero_claude_code" })}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-teletext uppercase tracking-wider transition-all hover:opacity-80 flex-1"
                      style={{ background:"var(--crimson)", color:"var(--paper)", fontSize:"15px" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Claude Code
                      {downloads !== null && <span className="ml-1 opacity-70" style={{ fontSize:"11px" }}>· {downloads.toLocaleString()}</span>}
                    </a>
                    <a href={ZIP_URL} target="_blank" rel="noopener noreferrer"
                      onClick={() => track("zip_download", { location: "hero_claude_ai" })}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-teletext uppercase tracking-wider transition-all hover:opacity-80 flex-1"
                      style={{ background:"var(--panel)", border:"1px solid var(--line)", color:"var(--paper)", fontSize:"15px" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Claude.ai
                    </a>
                  </div>
                  <p className="font-body text-xs px-1" style={{ color:"var(--muted)" }}>
                    Same zip — Claude Code: move folder to ~/.claude/skills/ · Claude.ai: upload zip in Settings → Skills
                  </p>

                  {/* download + socials */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <a href={ZIP_URL} target="_blank" rel="noopener noreferrer"
                      onClick={() => track("zip_download", { location: "hero" })}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-teletext uppercase tracking-wider transition-all hover:opacity-80"
                      style={{ background:"var(--panel-2)", border:"1px solid var(--line)", color:"var(--paper)", fontSize:"14px" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download .zip
                      {downloads !== null && (
                        <span className="font-teletext ml-1" style={{ color:"var(--crimson)", fontSize:"12px" }}>
                          {downloads.toLocaleString()}
                        </span>
                      )}
                    </a>

                    <span style={{ color:"var(--line)" }}>·</span>

                    {/* tag me label */}
                    <span className="font-body text-xs" style={{ color:"var(--muted)" }}>tag me:</span>

                    {/* X */}
                    <a href="https://x.com/Ninosauraus" target="_blank" rel="noopener noreferrer" title="@Ninosauraus on X"
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:opacity-80"
                      style={{ background:"var(--panel-2)", border:"1px solid var(--line)", color:"var(--muted)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>

                    {/* LinkedIn */}
                    <a href="https://www.linkedin.com/in/nidhi-patel-424674252/" target="_blank" rel="noopener noreferrer" title="Nidhi on LinkedIn"
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:opacity-80"
                      style={{ background:"var(--panel-2)", border:"1px solid var(--line)", color:"var(--muted)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>

                    {/* GitHub */}
                    <a href="https://github.com/NIDHIPATEL2807" target="_blank" rel="noopener noreferrer" title="NIDHIPATEL2807 on GitHub"
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:opacity-80"
                      style={{ background:"var(--panel-2)", border:"1px solid var(--line)", color:"var(--muted)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── SHOWCASE ── */}
        <section id="showcase" className="px-6 md:px-12 lg:px-20 py-24" style={{ borderTop:"1px solid var(--line)" }}>
          <div className="max-w-6xl mx-auto">
            <div data-reveal data-delay="0" style={{ opacity:0 }}>
              <div className="font-teletext mb-2 uppercase tracking-widest" style={{ color:"var(--crimson)", fontSize:"18px" }}>CH 02</div>
              <h2 className="font-display font-bold uppercase leading-none mb-4"
                style={{ fontSize:"clamp(40px, 6vw, 80px)", color:"var(--paper)" }}>
                SHOWCASE
              </h2>
              <p className="font-body mb-12" style={{ color:"var(--muted)", fontSize:"17px", maxWidth:"480px" }}>
                Real reels, real people. Hover to play. Every card links to the person who made it.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SHOWCASE.map((r,i) => <ShowcaseCard key={r.id} reel={r} delay={i*60} />)}
            </div>
          </div>
        </section>

        {/* ── BROADCAST SCHEDULE ── */}
        <section id="how" className="px-6 md:px-12 lg:px-20 py-24" style={{ borderTop:"1px solid var(--line)" }}>
          <div className="max-w-5xl mx-auto">
            <div data-reveal data-delay="0" style={{ opacity:0 }}>
              <div className="font-teletext mb-2 uppercase tracking-widest" style={{ color:"var(--crimson)", fontSize:"18px" }}>CH 03</div>
              <h2 className="font-display font-bold uppercase leading-none mb-12"
                style={{ fontSize:"clamp(40px, 6vw, 80px)", color:"var(--paper)" }}>
                THE BROADCAST<br />SCHEDULE
              </h2>
            </div>
            <div style={{ border:"1px solid var(--line)", borderRadius:"10px", overflow:"hidden" }}>
              {SCHEDULE.map((s,i) => (
                <div key={s.time} data-reveal data-delay={String(i*70)}
                  className="flex items-start gap-6 px-6 py-5"
                  style={{ borderBottom: i < SCHEDULE.length-1 ? "1px solid var(--line)" : "none", opacity:0 }}>
                  <div className="shrink-0 pt-0.5">
                    <span className="font-teletext" style={{ color:"var(--crimson)", fontSize:"22px" }}>{s.time}</span>
                  </div>
                  <div>
                    <div className="font-display font-bold uppercase mb-1" style={{ color:"var(--paper)", fontSize:"20px" }}>{s.title}</div>
                    <div className="font-body text-sm" style={{ color:"var(--muted)" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SUBSCRIBE ── */}
        <section id="subscribe" className="px-6 md:px-12 lg:px-20 py-24" style={{ borderTop:"1px solid var(--line)" }}>
          <div className="max-w-5xl mx-auto">
            <div data-reveal data-delay="0" style={{ opacity:0 }}>
              <div className="font-teletext mb-2 uppercase tracking-widest" style={{ color:"var(--crimson)", fontSize:"18px" }}>CH 04</div>
              <h2 className="font-display font-bold uppercase leading-none mb-4"
                style={{ fontSize:"clamp(40px, 6vw, 80px)", color:"var(--paper)" }}>
                SUBSCRIBE
              </h2>
              <p className="font-body mb-10" style={{ color:"var(--muted)", fontSize:"17px" }}>
                Free. No account. No upload portal. Just Claude.
              </p>
            </div>

            <div data-reveal data-delay="80" className="grid md:grid-cols-3 gap-5" style={{ opacity:0 }}>
              {(["claude-code","claude-ai"] as InstallTab[]).map(tab => {
                const it = INSTALL[tab];
                const isTerminal = tab === "claude-code";
                return (
                  <div key={tab} className="rounded-xl overflow-hidden"
                    style={{ border: isTerminal ? "1px solid var(--crimson)" : "1px solid var(--line)", background:"var(--panel)" }}>
                    <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom:"1px solid var(--line)", background:"var(--panel-2)" }}>
                      <span className="font-teletext uppercase" style={{ color: isTerminal ? "var(--crimson)" : "var(--paper)", fontSize:"18px" }}>{it.label}</span>
                      {isTerminal && <span className="font-teletext px-2 py-0.5 rounded" style={{ color:"var(--crimson)", fontSize:"12px", border:"1px solid var(--crimson)" }}>RECOMMENDED</span>}
                    </div>
                    <div className="p-5">
                      <InstallSteps steps={it.steps} cmd={it.cmd} isZip={!!it.isZip} downloads={downloads} />
                      {it.note && <p className="font-body text-xs mt-3 leading-relaxed" style={{ color:"var(--muted)" }}>{it.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* privacy note */}
            <div data-reveal data-delay="160" className="mt-5 px-5 py-4 rounded-xl" style={{ background:"var(--panel)", border:"1px solid var(--line)", opacity:0 }}>
              <div className="font-teletext mb-1 uppercase tracking-wider" style={{ color:"var(--muted)", fontSize:"15px" }}>PARENTAL GUIDANCE</div>
              <p className="font-body text-sm" style={{ color:"var(--muted)" }}>
                Rendering runs in your browser or on your machine. Your resume is only shared with Claude in your conversation. We store nothing.
              </p>
            </div>
          </div>
        </section>

        {/* ── IS IT SAFE / FAQ ── */}
        <section className="px-6 md:px-12 lg:px-20 py-24" style={{ borderTop:"1px solid var(--line)" }}>
          <div className="max-w-5xl mx-auto">
            <div data-reveal data-delay="0" style={{ opacity:0 }}>
              <div className="font-teletext mb-2 uppercase tracking-widest" style={{ color:"var(--crimson)", fontSize:"18px" }}>P888</div>
              <h2 className="font-display font-bold uppercase leading-none mb-12"
                style={{ fontSize:"clamp(40px, 6vw, 72px)", color:"var(--paper)" }}>
                IS IT SAFE?
              </h2>
            </div>

            {/* safety cards */}
            <div data-reveal data-delay="60" className="grid md:grid-cols-3 gap-4 mb-12" style={{ opacity:0 }}>
              {[
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                  title: "Plain text only",
                  body: "Six text files, ~300 KB total. Instructions, theme docs, templates, a licence. Nothing else.",
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
                  title: "Nothing runs on install",
                  body: "Installing only copies files. No scripts, no packages, no dependencies execute.",
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
                  title: "Reel stays in your browser",
                  body: "The generated HTML runs in the browser sandbox. No tracking, no accounts, no outside requests.",
                },
              ].map(c => (
                <div key={c.title} className="p-5 rounded-xl space-y-3" style={{ background:"var(--panel)", border:"1px solid var(--line)" }}>
                  <div style={{ color:"var(--crimson)" }}>{c.icon}</div>
                  <div className="font-display font-bold uppercase" style={{ color:"var(--paper)", fontSize:"18px" }}>{c.title}</div>
                  <p className="font-body text-sm leading-relaxed" style={{ color:"var(--muted)" }}>{c.body}</p>
                </div>
              ))}
            </div>

            {/* look before install */}
            <div data-reveal data-delay="120" className="mb-12 p-6 rounded-xl" style={{ background:"var(--panel)", border:"1px solid var(--line)", opacity:0 }}>
              <div className="font-display font-bold uppercase mb-5" style={{ color:"var(--paper)", fontSize:"22px" }}>Look before you install</div>
              <div className="space-y-4">
                {[
                  { n:"1", t:"Download the zip", d:<>Download <a href="https://github.com/NIDHIPATEL2807/Resumotion/releases/latest/download/resumotion.zip" target="_blank" rel="noopener noreferrer" style={{ color:"var(--crimson)" }}>resumotion.zip</a></> },
                  { n:"2", t:"Unzip it", d:"Double-click — you get a folder called resumotion/" },
                  { n:"3", t:"Read the files", d:"Open SKILL.md in any text editor. That is the full set of instructions Claude follows. Everything is plain text." },
                  { n:"4", t:"Happy with it? Install that folder", d:<>Paste in Terminal to move it from Downloads: <code className="font-teletext px-2 py-0.5 rounded text-xs" style={{ background:"var(--ink)", color:"var(--paper)" }}>mkdir -p ~/.claude/skills && mv ~/Downloads/resumotion ~/.claude/skills/</code></> },
                ].map(s => (
                  <div key={s.n} className="flex gap-4 items-start">
                    <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-teletext"
                      style={{ background:"var(--panel-2)", border:"1px solid var(--line)", color:"var(--crimson)", fontSize:"17px" }}>
                      {s.n}
                    </div>
                    <div className="pt-0.5">
                      <div className="font-display font-bold uppercase mb-0.5" style={{ color:"var(--paper)", fontSize:"16px" }}>{s.t}</div>
                      <div className="font-body text-sm leading-relaxed" style={{ color:"var(--muted)" }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ teletext */}
            <div data-reveal data-delay="180" className="p-6 rounded-xl" style={{ background:"var(--panel)", border:"1px solid var(--line)", opacity:0 }}>
              <div className="font-teletext mb-5 uppercase tracking-widest" style={{ color:"var(--crimson)", fontSize:"18px" }}>TELETEXT PAGE 888 · FAQ</div>
              <div className="space-y-5">
                {[
                  { q:"Claude isn't using the skill", a:"Restart Claude Code, then mention it by name: \"use the resumotion skill to make my reel\". Check it's installed: ls ~/.claude/skills/resumotion — you should see SKILL.md." },
                  { q:"How do I update?", a:"Run the install command again — it overwrites the old version." },
                  { q:"How do I remove it?", a:"rm -rf ~/.claude/skills/resumotion" },
                  { q:"Can I use this for commercial work?", a:"Yes. MIT licensed. Keep the licence file with the skill if you share it." },
                  { q:"Can I contribute a theme?", a:"Yes — add a THEME.md to resumotion/assets/themes/your-theme/ and open a PR. See CONTRIBUTING in the README." },
                ].map(f => (
                  <div key={f.q} className="pb-5" style={{ borderBottom:"1px solid var(--line)" }}>
                    <div className="font-display font-bold uppercase mb-1" style={{ color:"var(--paper)", fontSize:"16px" }}>{f.q}</div>
                    <p className="font-body text-sm leading-relaxed" style={{ color:"var(--muted)" }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── COMING UP NEXT ── */}
        <section className="px-6 md:px-12 lg:px-20 py-24" style={{ borderTop:"1px solid var(--line)" }}>
          <div className="max-w-5xl mx-auto">
            <div data-reveal data-delay="0" style={{ opacity:0 }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="on-air-dot w-2.5 h-2.5 rounded-full" style={{ background:"var(--crimson)" }} />
                <span className="font-teletext uppercase tracking-widest" style={{ color:"var(--crimson)", fontSize:"18px" }}>
                  COMING UP NEXT ON RESUMOTION° TV
                </span>
              </div>
              <h2 className="font-display font-bold uppercase leading-none mb-4"
                style={{ fontSize:"clamp(32px, 5vw, 60px)", color:"var(--paper)" }}>
                MORE CHANNEL PACKS<br />IN PRODUCTION.
              </h2>
              <p className="font-body mb-8 max-w-md" style={{ color:"var(--muted)", fontSize:"17px" }}>
                Polished theme packs for engineers, founders and finance folks. Pick one, add your resume, done.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/NIDHIPATEL2807/Resumotion/discussions" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 rounded font-display font-bold uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-[0.97]"
                  style={{ background:"var(--crimson)", color:"var(--paper)", fontSize:"16px" }}>
                  VOTE FOR THE NEXT CHANNEL
                </a>
                <a href="https://github.com/NIDHIPATEL2807/Resumotion" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 rounded font-display font-bold uppercase tracking-widest transition-all hover:opacity-80"
                  style={{ border:"1px solid var(--line)", color:"var(--paper)", fontSize:"16px" }}>
                  SUBMIT YOUR REEL
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid var(--line)" }}>
        <div style={{ height:"20px" }}><ColorBars h="20px" /></div>
        <div className="relative px-6 md:px-12 lg:px-20 py-14 flex flex-col items-center text-center scanlines"
          style={{ background:"var(--panel)" }}>
          {/* crosshairs */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity:0.05 }}>
            <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background:"var(--paper)" }} />
            <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background:"var(--paper)" }} />
          </div>
          {/* circle */}
          <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{ border:"2px solid var(--line)", background:"var(--ink)" }}>
            <span className="font-display font-bold uppercase" style={{ color:"var(--crimson)", fontSize:"11px", lineHeight:1.2 }}>
              resumotion<br /><span style={{ color:"var(--paper)" }}>° TV</span>
            </span>
          </div>
          <div className="font-teletext mb-1 uppercase tracking-widest" style={{ color:"var(--muted)", fontSize:"18px" }}>
            STATION SIGN-OFF · THANK YOU FOR WATCHING
          </div>
          <div className="font-display font-bold uppercase mb-7" style={{ color:"var(--paper)", fontSize:"28px" }}>
            resumotion<span style={{ color:"var(--crimson)" }}>°</span> TV
          </div>
          {/* teletext nav */}
          <div className="flex flex-wrap justify-center gap-5 mb-7">
            {[
              {p:"P100",label:"Install",href:"#subscribe"},
              {p:"P200",label:"Showcase",href:"#showcase"},
              {p:"P300",label:"GitHub",href:"https://github.com/NIDHIPATEL2807/Resumotion"},
              {p:"P400",label:"X / Twitter",href:"https://x.com/Ninosauraus"},
              {p:"P500",label:"LinkedIn",href:"https://linkedin.com/in/nidhi-patel-28"},
            ].map(item => (
              <a key={item.p} href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
                <span className="font-teletext" style={{ color:"var(--crimson)", fontSize:"17px" }}>{item.p}</span>
                <span className="font-teletext" style={{ color:"var(--muted)", fontSize:"17px" }}>{item.label}</span>
              </a>
            ))}
          </div>
          <div className="font-teletext flex items-center justify-center gap-2" style={{ color:"var(--muted)", fontSize:"19px", letterSpacing:"0.1em" }}>
            MADE BY NIDHI PATEL · NINOSAURAUS
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity:0.6 }}>
              <ellipse cx="16" cy="22" rx="8" ry="5" fill="var(--muted)"/>
              <ellipse cx="16" cy="14" rx="6" ry="7" fill="var(--muted)"/>
              <ellipse cx="10" cy="20" rx="3" ry="2" fill="var(--muted)" transform="rotate(-20 10 20)"/>
              <ellipse cx="22" cy="20" rx="3" ry="2" fill="var(--muted)" transform="rotate(20 22 20)"/>
              <circle cx="13.5" cy="12" r="1.2" fill="var(--ink)"/>
              <circle cx="18.5" cy="12" r="1.2" fill="var(--ink)"/>
              <path d="M20 10 Q22 7 24 9" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M12 10 Q10 7 8 9" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <div className="font-teletext mt-2" style={{ color:"var(--line)", fontSize:"17px", letterSpacing:"0.1em" }}>
            TRANSMISSION ENDS 23:59 · RESUMES WHEN YOU SCROLL UP
          </div>
          <div className="mt-6 font-body text-xs" style={{ color:"var(--line)" }}>
            MIT License · Built with Claude · 2025 Nidhi Patel
          </div>
        </div>
        <div style={{ height:"6px" }}><ColorBars h="6px" /></div>
      </footer>
    </>
  );
}

/* ── InstallSteps (used in subscribe section cards) ────── */
function InstallSteps({ steps, cmd, isZip, downloads }: { steps: string[]; cmd: string; isZip: boolean; downloads?: number | null }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(()=>setCopied(false),2000); } catch {}
  };
  return (
    <div className="space-y-4">
      {steps.map((s,i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-teletext"
            style={{ background:"var(--panel-2)", border:"1px solid var(--line)", color:"var(--crimson)", fontSize:"16px" }}>
            {i+1}
          </div>
          <p className="font-body text-sm leading-relaxed pt-0.5" style={{ color:"var(--muted)" }}>{s}</p>
        </div>
      ))}
      {!isZip ? (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background:"var(--ink)", border:"1px solid var(--line)" }}>
          <code className="font-teletext flex-1 truncate" style={{ color:"var(--paper)", fontSize:"13px" }}>{cmd}</code>
          <button onClick={copy}
            className="shrink-0 px-2.5 py-1 rounded font-teletext cursor-pointer transition-all"
            style={{ background: copied ? "#3DDC84" : "var(--crimson)", color: copied ? "#000" : "var(--paper)", fontSize:"14px" }}>
            {copied ? "COPIED!" : "COPY"}
          </button>
        </div>
      ) : (
        <a href={cmd} target="_blank" rel="noopener noreferrer"
          onClick={() => track("zip_download", { location: "subscribe" })}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-teletext uppercase hover:opacity-90 transition-opacity"
          style={{ background:"var(--crimson)", color:"var(--paper)", fontSize:"16px" }}>
          Download ZIP
          {downloads != null && (
            <span className="font-teletext ml-1 opacity-80" style={{ fontSize:"13px" }}>
              · {downloads.toLocaleString()} installs
            </span>
          )}
        </a>
      )}
    </div>
  );
}
