"use client";

import React, { useEffect, useRef } from "react";

// ─── Invisible anchor — holds the exact size/position of an "O" in the text ──
const EnsoAnchor = ({
  id,
  fontSize = "1em",
}: {
  id: string;
  fontSize?: string;
}) => (
  <span
    id={id}
    data-enso-target="true"
    aria-hidden="true"
    style={{
      display: "inline-block",
      width: `calc(${fontSize} * 0.72)`,
      height: fontSize,
      verticalAlign: "middle",
      opacity: 0,
      pointerEvents: "none",
    }}
  />
);

// ─── Section heading — black style ───────────────────────────────────
const SectionTitle = ({
  children,
  ensoId,
  fontSize = "2.25rem",
  className = "",
}: {
  children: React.ReactNode;
  ensoId?: string;
  fontSize?: string;
  className?: string;
}) => (
  <div className={`text-center mb-12 ${className}`}>
    <h2
      className="font-['Shippori_Mincho',serif] text-3xl sm:text-4xl font-bold tracking-wide inline-flex items-center text-black"
    >
      {ensoId && <EnsoAnchor id={ensoId} fontSize={fontSize} />}
      {children}
    </h2>
    <div className="mt-3 mx-auto w-16 h-0.5 bg-[#b43c32]" />
  </div>
);

// ─── Person card ─────────────────────────────────────────────────────────────
const PersonCard = ({
  name,
  title,
  image,
  message,
  signature,
}: {
  name: string;
  title: string;
  image: string;
  message: React.ReactNode;
  signature?: string;
}) => (
  <div className="bg-[rgba(255,252,245,0.95)] border border-[rgba(139,90,43,0.15)] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.07)] mb-10">
    <div className="flex flex-col md:flex-row">
      {/* Image block */}
      <div className="md:w-64 shrink-0 relative bg-[#1a0f07]">
        <img
          src={image}
          alt={name}
          className="w-full h-56 sm:h-64 md:h-full object-cover object-top opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1a0f07]/80 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-[#1a0f07]/30" />
        {/* Name overlay on mobile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
          <p className="font-['Shippori_Mincho',serif] text-[#c4a35a] font-bold text-lg leading-snug">{name}</p>
          <p className="text-[#c4a35a]/70 text-xs tracking-widest uppercase mt-0.5">{title}</p>
        </div>
      </div>

      {/* Text block */}
      <div className="flex-1 p-6 sm:p-8">
        {/* Desktop name/title header */}
        <div className="hidden md:flex items-start justify-between mb-6">
          <div>
            <p className="font-['Shippori_Mincho',serif] text-2xl text-[#5c3a1e] font-bold">{name}</p>
            <p className="text-[#8b5a2b] text-sm tracking-widest uppercase mt-1">{title}</p>
          </div>
          <div className="w-10 h-10 border border-[#c4a35a]/40 rounded-full flex items-center justify-center shrink-0">
            <div className="w-6 h-6 border border-[#c4a35a]/60 rounded-full" />
          </div>
        </div>

        <div className="border-l-2 border-[#c4a35a]/30 pl-5 sm:pl-6 space-y-3">{message}</div>
        {signature && (
          <p className="font-['Shippori_Mincho',serif] text-[#8b5a2b] text-right mt-6 text-sm italic">
            — {signature}
          </p>
        )}
      </div>
    </div>
  </div>
);

// ─── Staff card ───────────────────────────────────────────────────────────────
const StaffCard = ({ name, title, image }: { name: string; title: string; image: string }) => (
  <div className="bg-[rgba(255,252,245,0.95)] border border-[rgba(139,90,43,0.15)] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] text-center group">
    <div className="relative overflow-hidden h-48 sm:h-52">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#1a0f07]/60 to-transparent" />
    </div>
    <div className="p-4 sm:p-5">
      <p className="font-['Shippori_Mincho',serif] text-[#5c3a1e] font-bold text-base sm:text-lg">{name}</p>
      <div className="w-8 h-px bg-[#b43c32] mx-auto my-2" />
      <p className="text-[#8b5a2b] text-xs sm:text-sm tracking-wider">{title}</p>
    </div>
  </div>
);

// ─── Course pill ──────────────────────────────────────────────────────────────
const CoursePill = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[rgba(139,90,43,0.1)] last:border-0">
    <span className="w-1.5 h-1.5 rounded-full bg-[#b43c32] shrink-0" />
    <span className="text-[#3d2b1a] text-sm leading-snug">{label}</span>
  </div>
);

// ─── Helper for base path ─────────────────────────────────────────────────────
const basePath = import.meta.env.BASE_URL;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const ensoRef = useRef<HTMLDivElement>(null);
  const rafRef  = useRef<number | null>(null);

  const TARGET_IDS = [
    "anchor-eiko-o",
    "anchor-offerings-o",
    "anchor-our-course",
    "anchor-our-exec",
    "anchor-our-staff",
    "anchor-get-touch",
  ];

  useEffect(() => {
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const getHeroSize = () => {
      // Scale enso size based on viewport width for mobile
      const vw = window.innerWidth;
      if (vw < 480) return 220;
      if (vw < 768) return 300;
      return 420;
    };

    const update = () => {
      const enso = ensoRef.current;
      if (!enso) return;
      const sy    = window.scrollY;
      const vw    = window.innerWidth;
      const vh    = window.innerHeight;
      const heroH = heroRef.current?.offsetHeight ?? vh;
      const heroEnd = heroH * 0.45;
      const HERO_SIZE = getHeroSize();

      // Phase 1 — hero: centred, shrinks smoothly as user scrolls down
      if (sy <= heroEnd) {
        const p = sy / heroEnd;
        const smoothP = easeInOutCubic(p);
        const size = HERO_SIZE - smoothP * (HERO_SIZE * 0.286); // shrink ~28% like original
        enso.style.cssText = `
          position:fixed;
          width:${size}px;
          height:${size}px;
          left:${vw / 2 - size / 2}px;
          top:${vh / 2 - size / 2}px;
          opacity:1;
          pointer-events:none;
          z-index:100;
          transition: none;
        `;
        return;
      }

      // Phase 2 — smooth travel between anchors
      const els = TARGET_IDS
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];
      if (!els.length) return;

      const center = sy + vh / 2;
      const pageTops = els.map((el) => el.getBoundingClientRect().top + sy);

      let currentIndex = 0;
      for (let i = 0; i < pageTops.length - 1; i++) {
        if (center >= pageTops[i] && center < pageTops[i + 1]) {
          currentIndex = i;
          break;
        }
        if (i === pageTops.length - 2 && center >= pageTops[i + 1]) {
          currentIndex = i + 1;
        }
      }

      let fromEl, toEl, progress;
      const HERO_SIZE_FINAL = getHeroSize();

      if (currentIndex === 0 && center < pageTops[0]) {
        const fromRect = {
          width: HERO_SIZE_FINAL - HERO_SIZE_FINAL * 0.286,
          height: HERO_SIZE_FINAL - HERO_SIZE_FINAL * 0.286,
          left: vw / 2 - (HERO_SIZE_FINAL - HERO_SIZE_FINAL * 0.286) / 2,
          top: vh / 2 - (HERO_SIZE_FINAL - HERO_SIZE_FINAL * 0.286) / 2,
        };
        const toRect = els[0].getBoundingClientRect();
        const transitionStart = heroEnd;
        const transitionEnd = pageTops[0] - vh * 0.3;
        progress = Math.max(0, Math.min(1, (sy - transitionStart) / (transitionEnd - transitionStart)));
        progress = easeInOutCubic(progress);

        const fromSize = Math.max(fromRect.height, 16);
        const toSize = Math.max(toRect.height, 16);
        const size = fromSize + (toSize - fromSize) * progress;
        const left = fromRect.left + (toRect.left - (toSize - toRect.width) / 2 - fromRect.left) * progress;
        const top = fromRect.top + (toRect.top - (toSize - toRect.height) / 2 - fromRect.top) * progress;

        enso.style.cssText = `
          position:fixed;
          width:${size}px;
          height:${size}px;
          left:${left}px;
          top:${top}px;
          opacity:1;
          pointer-events:none;
          z-index:100;
          transition: none;
        `;
      } else if (currentIndex >= pageTops.length - 1) {
        const elRect = els[els.length - 1].getBoundingClientRect();
        const size = Math.max(elRect.height, 16);
        enso.style.cssText = `
          position:fixed;
          width:${size}px;
          height:${size}px;
          left:${elRect.left - (size - elRect.width) / 2}px;
          top:${elRect.top - (size - elRect.height) / 2}px;
          opacity:1;
          pointer-events:none;
          z-index:100;
          transition: none;
        `;
      } else {
        const fromRect = els[currentIndex].getBoundingClientRect();
        const toRect = els[currentIndex + 1].getBoundingClientRect();

        const transitionStart = pageTops[currentIndex];
        const transitionEnd = pageTops[currentIndex + 1];
        progress = (center - transitionStart) / (transitionEnd - transitionStart);
        progress = Math.max(0, Math.min(1, progress));
        progress = easeInOutCubic(progress);

        const fromSize = Math.max(fromRect.height, 16);
        const toSize = Math.max(toRect.height, 16);
        const size = fromSize + (toSize - fromSize) * progress;

        const fromLeft = fromRect.left - (fromSize - fromRect.width) / 2;
        const fromTop = fromRect.top - (fromSize - fromRect.height) / 2;
        const toLeft = toRect.left - (toSize - toRect.width) / 2;
        const toTop = toRect.top - (toSize - toRect.height) / 2;

        const left = fromLeft + (toLeft - fromLeft) * progress;
        const top = fromTop + (toTop - fromTop) * progress;

        enso.style.cssText = `
          position:fixed;
          width:${size}px;
          height:${size}px;
          left:${left}px;
          top:${top}px;
          opacity:1;
          pointer-events:none;
          z-index:100;
          transition: none;
        `;
      }
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f0e8] font-['Zen_Kaku_Gothic_New',sans-serif] text-[#2c2416]">

      {/* ── Single travelling Enso ── */}
      <div
        ref={ensoRef}
        style={{
          position: "fixed",
          width: "clamp(220px, 55vw, 420px)",
          height: "clamp(220px, 55vw, 420px)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          zIndex: 100,
        }}
      >
        <img
          src={`${basePath}enso.webp`}
          alt=""
          style={{ width: "100%", height: "100%", display: "block" }}
          className="drop-shadow-[0_0_40px_rgba(196,163,90,0.6)]"
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="w-full min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat z-1"
        style={{ backgroundImage: `url('${basePath}hero.webp')` }}
      >
        <div className="absolute inset-0 bg-black/35 z-0" />
        {/* Decorative circles — hidden on very small screens to avoid clutter */}
        <div className="absolute inset-0 opacity-10 z-1 hidden sm:block">
          <div className="absolute top-10 left-10 w-28 sm:w-40 h-28 sm:h-40 border border-[#c4a35a] rounded-full" />
          <div className="absolute bottom-20 right-20 w-40 sm:w-60 h-40 sm:h-60 border border-[#c4a35a] rounded-full" />
          <div className="absolute top-1/3 right-10 w-14 sm:w-20 h-14 sm:h-20 border border-[#8b5a2b] rounded-full" />
        </div>

        {/* Logo sphere */}
        <div
          className="relative z-2"
          style={{
            width: "clamp(220px, 55vw, 420px)",
            height: "clamp(220px, 55vw, 420px)",
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute rounded-full overflow-hidden border-2 border-[#c4a35a] bg-cover bg-center bg-[#ffff] z-3"
            style={{
              width: "clamp(100px, 28vw, 200px)",
              height: "clamp(100px, 28vw, 200px)",
              top: "50%",
              left: "50%",
              transform: "translate(-45%, -55%) translateZ(50px)",
              backgroundImage: `url('${basePath}logo.webp')`,
            }}
          />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#c4a35a] text-center z-5">
          <p className="text-xs sm:text-sm font-['Shippori_Mincho',serif] tracking-widest mb-2 drop-shadow-lg">SCROLL</p>
          <div className="w-6 h-10 border-2 border-[#c4a35a] rounded-full mx-auto relative">
            <div className="w-1.5 h-1.5 bg-[#c4a35a] rounded-full absolute top-2 left-1/2 -translate-x-1/2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CONTENT
          ══════════════════════════════════════════════════════ */}
      <section
        className="relative z-0"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(139,90,43,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(180,60,50,0.04) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(139,90,43,0.05) 0%, transparent 50%), #f5f0e8",
        }}
      >
        {/* ── EIKO LANKA identity block ── */}
        <div className="pt-16 sm:pt-24 pb-12 sm:pb-16 text-center px-4">
          <p className="text-[#8b5a2b] tracking-[0.2em] sm:tracking-[0.3em] text-xs uppercase mb-4 font-['Shippori_Mincho',serif]">
            世界ランカ &nbsp;·&nbsp; Sekai Lanka
          </p>

          <h1
            className="font-['Yuji_Syuku',serif] text-5xl sm:text-6xl md:text-8xl mb-2 leading-none tracking-tight inline-flex items-center justify-center text-black"
          >
            EIK
            <EnsoAnchor id="anchor-eiko-o" fontSize="1em" />
            &nbsp;LANKA
          </h1>

          <p className="font-['Shippori_Mincho',serif] text-base sm:text-xl text-[#5c3a1e] mt-4 tracking-widest px-2">
            JAPANESE INSTITUTE & CULTURAL CENTER
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-14 sm:w-20 bg-[#c4a35a]/50" />
            <p className="text-[#8b5a2b] text-xs tracking-widest">by World Lanka</p>
            <div className="h-px w-14 sm:w-20 bg-[#c4a35a]/50" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">

          {/* ── ABOUT / VISION ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-16 sm:mb-20">
            <div className="bg-[rgba(255,252,245,0.95)] border border-[rgba(139,90,43,0.15)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <p className="text-[#c4a35a] text-xs tracking-widest font-['Shippori_Mincho',serif] mb-3 uppercase">Our Mission</p>
              <p className="font-['Shippori_Mincho',serif] text-xl sm:text-2xl text-[#5c3a1e] font-bold mb-4 leading-snug">
                日本語で未来を拓く
              </p>
              <p className="text-[#5c3a1e] text-sm italic mb-4">
                "Fostering the power to shape the future through the Japanese language"
              </p>
              <p className="text-[#3d2b1a] text-sm leading-relaxed">
                We serve as a bridge between Japan and Sri Lanka — offering high-quality language
                education, cultural immersion, and pathways to study, work, and thrive in Japan.
              </p>
            </div>
            <div className="bg-[#1a0f07] rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)] relative overflow-hidden">
              <p className="absolute -right-4 -bottom-8 text-[100px] sm:text-[120px] text-[#c4a35a]/10 font-['Yuji_Syuku',serif] select-none leading-none">
                学
              </p>
              <p className="text-[#c4a35a] text-xs tracking-widest font-['Shippori_Mincho',serif] mb-3 uppercase">Why Eiko Lanka</p>
              <div className="space-y-4 relative z-1">
                {[
                  ["Native instructors", "Learn from Japanese-speaking professionals with real-world experience"],
                  ["JLPT certified prep", "Structured courses from N4/JFT to N2 with proven methodology"],
                  ["Japan pathways", "SSW Visa, Technical Intern, Study Abroad & Graduate school guidance"],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <span className="w-1 min-h-6 bg-[#b43c32] rounded-full shrink-0 mt-1" />
                    <div>
                      <p className="text-[#c4a35a] text-sm font-bold font-['Shippori_Mincho',serif]">{title}</p>
                      <p className="text-[#c4a35a]/60 text-xs leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── COURSE OFFERINGS ── */}
          <div className="text-center mb-10 sm:mb-12">
            <h2
              className="font-['Shippori_Mincho',serif] text-3xl sm:text-4xl font-bold tracking-wide inline-flex items-center text-black"
            >
              Course&nbsp;<EnsoAnchor id="anchor-offerings-o" fontSize="2.25rem" />fferings
            </h2>
            <div className="mt-3 mx-auto w-16 h-0.5 bg-[#b43c32]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-16 sm:mb-20">
            <div className="bg-[rgba(255,252,245,0.95)] border border-[rgba(139,90,43,0.15)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <CoursePill label="JLPT N4 / JFT — 6-Month Course" />
              <CoursePill label="N2 Course (Native Japanese instructor)" />
              <CoursePill label="Conversation Class (Native Japanese instructor)" />
              <CoursePill label="Specified Skills Test Preparation" />
              <CoursePill label="Business Japanese & Japanese Etiquette" />
              <CoursePill label="Conversation Practice" />
              <CoursePill label="Cultural Experience" />
            </div>
            <div className="bg-[rgba(255,252,245,0.95)] border border-[rgba(139,90,43,0.15)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <p className="text-[#c4a35a] text-xs tracking-widest font-['Shippori_Mincho',serif] mb-4 uppercase">Japan Pathways</p>
              <CoursePill label="Employment in Japan" />
              <CoursePill label="SSW Visa (Specified Skilled Worker)" />
              <CoursePill label="Technical Intern Training Visa" />
              <CoursePill label="Study Abroad" />
              <CoursePill label="Graduate School Preparation" />
            </div>
          </div>

          {/* ── OUR COURSE (pricing) ── */}
          <SectionTitle ensoId="anchor-our-course" fontSize="2.25rem">ur Course</SectionTitle>
          <div className="bg-[#1a0f07] rounded-2xl p-7 sm:p-10 mb-16 sm:mb-20 shadow-[0_8px_40px_rgba(0,0,0,0.15)] relative overflow-hidden">
            <p className="absolute -left-6 -top-6 text-[120px] sm:text-[180px] text-[#c4a35a]/05 font-['Yuji_Syuku',serif] select-none leading-none">円</p>
            {/* Stack vertically on mobile, 3 cols on md+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center relative z-1">
              <div>
                <p className="text-[#c4a35a]/60 text-xs tracking-widest uppercase font-['Shippori_Mincho',serif] mb-2">Program</p>
                <p className="text-[#c4a35a] font-['Shippori_Mincho',serif] text-lg sm:text-xl font-bold">JLPT N4 / JFT</p>
                <p className="text-[#c4a35a]/50 text-sm mt-1">6-Month Intensive</p>
              </div>
              {/* Dividers: horizontal on mobile, vertical on sm+ */}
              <div className="border-t sm:border-t-0 sm:border-x border-[#c4a35a]/20 pt-6 sm:pt-0">
                <p className="text-[#c4a35a]/60 text-xs tracking-widest uppercase font-['Shippori_Mincho',serif] mb-2">Tuition</p>
                <p className="text-[#c4a35a] text-3xl sm:text-4xl font-bold font-['Yuji_Syuku',serif]">70,000</p>
                <p className="text-[#c4a35a]/50 text-sm mt-1">LKR / 6 months</p>
              </div>
              <div className="border-t sm:border-t-0 border-[#c4a35a]/20 pt-6 sm:pt-0">
                <p className="text-[#c4a35a]/60 text-xs tracking-widest uppercase font-['Shippori_Mincho',serif] mb-2">Intake</p>
                <p className="text-[#c4a35a] font-['Shippori_Mincho',serif] text-lg sm:text-xl font-bold">September</p>
                <p className="text-[#c4a35a]/50 text-sm mt-1">Classes begin</p>
              </div>
            </div>
          </div>

          {/* ── LEADERSHIP MESSAGES ── */}
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="font-['Shippori_Mincho',serif] text-3xl sm:text-4xl font-bold tracking-wide text-black">
              A Message from Leadership
            </h2>
            <div className="mt-3 mx-auto w-16 h-0.5 bg-[#b43c32]" />
          </div>

          <PersonCard
            name="Mitsuhiro Yoshinaga"
            title="Chairman"
            image={`${basePath}Mitsuhiro%20Yoshinaga.jpg`}
            message={
              <>
                <p className="text-[#3d2b1a] text-sm leading-relaxed">
                  Welcome, and thank you for visiting our school's website. Our Japanese language school
                  is located in Sri Lanka — a country blessed with beautiful nature and rich culture —
                  where many students strive each day to master the Japanese language.
                </p>
                <p className="text-[#3d2b1a] text-sm leading-relaxed mt-3">
                  We aim to serve as a bridge between Japan and Sri Lanka. We teach not only language
                  skills, but also Japanese culture, values, and business etiquette — helping our students
                  succeed across various future paths.
                </p>
                <p className="text-[#3d2b1a] text-sm leading-relaxed mt-3">
                  We offer flexible curricula tailored to each learner's needs, with experienced
                  instructors dedicated to helping every student unlock their full potential.
                </p>
              </>
            }
          />

          <PersonCard
            name="Bodahandi Sanath"
            title="Managing Director"
            image={`${basePath}Bodahandi%20Sanath.jpg`}
            message={
              <>
                <p className="text-[#3d2b1a] text-sm leading-relaxed">
                  Our school was founded with the mission of "Fostering the power to shape the future
                  through the Japanese language." In today's globalizing world, learning a language is
                  more than acquiring a skill — it is an encounter with new values.
                </p>
                <p className="text-[#3d2b1a] text-sm leading-relaxed mt-3">
                  I myself studied in Japan, advancing from a language school to a Japanese university.
                  My Japanese proficiency led to work at Japanese companies, launching a business in
                  Japan, and building a wide professional network — all of which I now channel into
                  supporting Sri Lankan students.
                </p>
                <p className="text-[#3d2b1a] text-sm leading-relaxed mt-3">
                  We offer high-quality classes for all levels, cultural events, and traditional
                  Japanese seasonal activities. For those who wish to study and work in Japan, we hope
                  to be your first step.
                </p>
              </>
            }
          />

          <PersonCard
            name="Thushani Ayesha"
            title="Principal"
            image={`${basePath}Thushani%20Ayesha.jpg`}
            message={
              <>
                <p className="text-[#3d2b1a] text-sm leading-relaxed">
                  I am pleased to announce the establishment of this Japanese language school and
                  sending organization in Sri Lanka. We aim to support students in broadening their
                  international perspectives through Japanese language and culture.
                </p>
                <p className="text-[#3d2b1a] text-sm leading-relaxed mt-3">
                  Having studied in Japan and worked for Japanese companies, I understand both the
                  challenges and the immense rewards. Our programs go beyond language acquisition —
                  covering daily life, culture, and business etiquette so students can live in Japan
                  with full confidence.
                </p>
                <p className="text-[#3d2b1a] text-sm leading-relaxed mt-3">
                  With a strong belief in nurturing global leaders, we will continue to pursue the
                  highest quality in education. I look forward to meeting you.
                </p>
              </>
            }
          />

          {/* ── EXECUTIVE TEAM ── */}
          <SectionTitle ensoId="anchor-our-exec" fontSize="2.25rem">ur Executives</SectionTitle>
          {/* 1 col on mobile, 3 on md+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 mb-16 sm:mb-20">
            <StaffCard name="L.H.G Sigera"      title="Marketing Director" image={`${basePath}L.H.G%20Sigera.jpg`} />
            <StaffCard name="Nirmani Sulakkhana" title="Senior Lecturer"   image={`${basePath}Nirmani%20Sulakkhana.jpg`} />
            <StaffCard name="Lasitha Chamini"    title="Senior Lecturer"   image={`${basePath}Lasitha%20Chamini.jpg`} />
          </div>

          {/* ── OUR STAFF ── */}
          <SectionTitle ensoId="anchor-our-staff" fontSize="2.25rem">ur Staff</SectionTitle>
          <div className="mb-16 sm:mb-20 bg-[rgba(255,252,245,0.95)] border border-[rgba(139,90,43,0.15)] rounded-2xl p-8 sm:p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <p className="text-[#8b5a2b] text-sm">Staff profiles coming soon.</p>
          </div>

          {/* ── GET IN TOUCH ── */}
          <div className="text-center mb-10 sm:mb-12">
            <h2
              className="font-['Shippori_Mincho',serif] text-3xl sm:text-4xl font-bold tracking-wide inline-flex items-center text-black"
            >
              Get in T<EnsoAnchor id="anchor-get-touch" fontSize="2.25rem" />uch
            </h2>
            <div className="mt-3 mx-auto w-16 h-0.5 bg-[#b43c32]" />
          </div>

          <div className="bg-[#1a0f07] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.15)] mb-10">
            {/* Stack on mobile, 3 cols on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#c4a35a]/10">
              {/* Address */}
              <div className="p-8 sm:p-10 text-center">
                <div className="w-10 h-10 border border-[#c4a35a]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-4 h-4 text-[#c4a35a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-[#c4a35a] font-['Shippori_Mincho',serif] font-bold text-sm tracking-widest uppercase mb-3">Address</p>
                <p className="text-[#c4a35a]/60 text-sm leading-relaxed">
                  No. 109/6, Parakrama Mawatha<br />
                  Town Road, Homagama<br />
                  SRI LANKA
                </p>
              </div>
              {/* Phone */}
              <div className="p-8 sm:p-10 text-center">
                <div className="w-10 h-10 border border-[#c4a35a]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-4 h-4 text-[#c4a35a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-[#c4a35a] font-['Shippori_Mincho',serif] font-bold text-sm tracking-widest uppercase mb-3">Phone</p>
                <p className="text-[#c4a35a]/60 text-sm leading-relaxed">
                  +94 11 2223 460<br />
                  +81 80 4183 5695
                </p>
              </div>
              {/* Email */}
              <div className="p-8 sm:p-10 text-center">
                <div className="w-10 h-10 border border-[#c4a35a]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-4 h-4 text-[#c4a35a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-[#c4a35a] font-['Shippori_Mincho',serif] font-bold text-sm tracking-widest uppercase mb-3">Email</p>
                <p className="text-[#c4a35a]/60 text-sm leading-relaxed">
                  eikolanka@gmail.com
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a0f07] text-[#c4a35a] relative overflow-hidden">
        <p className="absolute right-8 top-1/2 -translate-y-1/2 text-[80px] sm:text-[120px] text-[#c4a35a]/05 font-['Yuji_Syuku',serif] select-none leading-none pointer-events-none">
          縁
        </p>
        <div className="max-w-5xl mx-auto px-6 py-10 sm:py-12 text-center relative z-1">
          <p className="font-['Yuji_Syuku',serif] text-2xl sm:text-3xl mb-1">栄光ランカ</p>
          <p className="font-['Shippori_Mincho',serif] text-base sm:text-lg mb-1 tracking-widest">EIKO LANKA</p>
          <p className="text-xs opacity-50 tracking-wider mb-6">Japanese Institute & Cultural Center</p>
          <div className="flex items-center justify-center gap-4 opacity-30">
            <div className="h-px w-12 sm:w-16 bg-[#c4a35a]" />
            <div className="w-3 h-3 border border-[#c4a35a] rounded-full" />
            <div className="h-px w-12 sm:w-16 bg-[#c4a35a]" />
          </div>
          <p className="text-xs mt-6 opacity-30">by World Lanka</p>
        </div>
      </footer>
    </div>
  );
}