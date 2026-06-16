import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AuthModal } from "@/components/AuthModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { toast } from "sonner";
import { submitContactForm } from "@/lib/contact";
import walletImg from "@/assets/wallet-mockup.png";
import dashboardImg from "@/assets/dashboard-mockup.png";
import heroBg from "@/assets/hero-bg.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  return (
    <SmoothScroll>
      <main className="relative bg-background text-foreground overflow-clip">
        <AmbientBackground />
        <Nav />
        <Hero />
        <StatsStrip />
        <PinnedProduct />
        <PinnedEcosystem />
        <PinnedSecurity />
        <Testimonials />
        <FinalCTA />
        <ContactFormSection />
        <Footer />
        <AuthModal />
        <ScrollToTop />
      </main>
    </SmoothScroll>
  );
}

/* ------------------------------ AMBIENT ------------------------------ */
function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const orbs = ref.current?.querySelectorAll<HTMLElement>(".orb");
    if (!orbs) return;
    orbs.forEach((o, i) => {
      gsap.to(o, {
        y: i % 2 === 0 ? -80 : 80,
        x: i % 2 === 0 ? 40 : -40,
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });
    });
  }, []);
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-0">
      <div className="orb absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[oklch(0.92_0.22_130/0.18)] blur-[140px]" />
      <div className="orb absolute top-1/3 -right-60 h-[700px] w-[700px] rounded-full bg-[oklch(0.55_0.25_295/0.25)] blur-[160px]" />
      <div className="orb absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[oklch(0.75_0.18_200/0.18)] blur-[140px]" />
      <div className="absolute inset-0 grid-bg opacity-60" />
    </div>
  );
}

/* ------------------------------ NAV ------------------------------ */
function Nav() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto mt-5 flex max-w-7xl items-center justify-between rounded-full surface-glass px-6 py-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 font-display text-xl font-bold tracking-tight"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_20px_var(--color-primary)]" />
          Ciphera
        </a>
        <nav className="hidden gap-8 md:flex">
          {[["Produit", "product"], ["Marchés", "markets"], ["Sécurité", "security"], ["Rendement", "earn"], ["Contact", "contact"]].map(([label, id]) => (
            <a key={id} href={`#${id}`} className="text-sm text-muted-foreground transition hover:text-foreground">
              {label}
            </a>
          ))}
        </nav>
        <MagneticButton small onClick={openAuth}>Lancer l'app</MagneticButton>
      </div>
    </motion.header>
  );
}

/* ------------------------------ MAGNETIC BUTTON ------------------------------ */
function MagneticButton({
  children,
  small,
  variant = "primary",
  onClick,
}: {
  children: React.ReactNode;
  small?: boolean;
  variant?: "primary" | "ghost";
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 15 });
  const sy = useSpring(my, { stiffness: 200, damping: 15 });

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    const r = ref.current!.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mx.set((e.clientX - cx) * 0.3);
    my.set((e.clientY - cy) * 0.5);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }
  const base =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:shadow-[0_0_60px_-5px_var(--color-primary)]"
      : "border border-white/15 text-foreground hover:bg-white/5";
  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative inline-flex items-center gap-2 rounded-full font-medium transition-all ${
        small ? "px-4 py-2 text-sm" : "px-7 py-3.5 text-base"
      } ${base}`}
    >
      <span className="relative z-10">{children}</span>
      <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </motion.button>
  );
}

function openAuth() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("open-auth"));
}

/* ------------------------------ HERO ------------------------------ */
function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitType(headlineRef.current!, { types: "chars,words" });
      const subSplit = new SplitType(subRef.current!, { types: "lines,words" });

      gsap.set(split.chars, { yPercent: 130, opacity: 0, rotateX: -60, filter: "blur(14px)" });
      gsap.set(subSplit.words, { yPercent: 100, opacity: 0 });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 20 });
      gsap.set(ctaRef.current, { opacity: 0, y: 30 });
      gsap.set(walletRef.current, {
        opacity: 0,
        scale: 0.6,
        rotate: 8,
        filter: "blur(20px)",
        y: 80,
      });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.9 })
        .to(
          split.chars,
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 1.4,
            stagger: { each: 0.025, from: "start" },
          },
          "-=0.5",
        )
        .to(subSplit.words, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.02 }, "-=0.9")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
        .to(
          walletRef.current,
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
            y: 0,
            duration: 1.8,
            ease: "expo.out",
          },
          "-=1.4",
        );

      // Constant float
      gsap.to(floatRef.current, {
        y: -20,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Scroll parallax on wallet
      gsap.to(walletRef.current, {
        y: -120,
        rotate: -4,
        scale: 0.92,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Headline parallax fade out
      gsap.to([headlineRef.current, eyebrowRef.current, subRef.current, ctaRef.current], {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative z-10 min-h-screen overflow-hidden pt-32">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.2]"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-10 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div ref={eyebrowRef} className="mb-6 inline-flex items-center gap-2 rounded-full surface-glass px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            En direct | Série C
          </div>
          <h1
            ref={headlineRef}
            className="font-display text-[clamp(2.2rem,6.5vw,5.5rem)] font-bold leading-[1.25] tracking-tight text-balance py-3"
          >
            Crypto<br />
            <span className="gradient-text">conçue</span><br />
            en mouvement.
          </h1>
          <p ref={subRef} className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Ciphera Intelligence est la plateforme d'investissement cinématique pour les capitaux sérieux. Marchés en temps réel, garde institutionnelle, et un produit qui évolue avec vous.
          </p>
          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton onClick={openAuth}>Commencer à investir</MagneticButton>
            <MagneticButton variant="ghost" onClick={openAuth}>Voir le film</MagneticButton>
          </div>
        </div>

        <div ref={floatRef} className="relative">
          <div ref={walletRef} className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 -z-10 blur-3xl" style={{ background: "var(--gradient-radial-glow)" }} />
            <img
              src={walletImg}
              alt="Portefeuille crypto Ciphera Intelligence"
              width={1024}
              height={1024}
              className="w-full drop-shadow-[0_60px_80px_oklch(0_0_0/0.6)]"
            />
            {/* Orbiting micro cards */}
            <FloatingChip className="absolute -left-10 top-10" delay={0}>
              <span className="font-mono text-xs text-primary">+18.42%</span>
              <span className="text-xs text-muted-foreground">BTC / 24h</span>
            </FloatingChip>
            <FloatingChip className="absolute -right-6 top-1/3" delay={0.6}>
              <span className="font-mono text-xs text-accent">$284 917</span>
              <span className="text-xs text-muted-foreground">Portefeuille</span>
            </FloatingChip>
            <FloatingChip className="absolute -bottom-2 left-4" delay={1.2}>
              <span className="font-mono text-xs gradient-text">Staké / 12,8k ETH</span>
            </FloatingChip>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingChip({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.4 + delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="surface-glass flex items-center gap-2 rounded-2xl px-3 py-2 shadow-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------ STATS ------------------------------ */
function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const counters = ref.current!.querySelectorAll<HTMLElement>("[data-counter]");
      counters.forEach((el) => {
        const target = parseFloat(el.dataset.counter!);
        const decimals = parseInt(el.dataset.decimals || "0");
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = `${prefix}${obj.v.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}${suffix}`;
          },
        });
      });

      gsap.from(ref.current!.querySelectorAll(".stat"), {
        y: 60,
        opacity: 0,
        scale: 0.85,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const stats: { label: string; v: number; decimals?: number; prefix?: string; suffix?: string }[] = [
    { label: "Actifs sous garde", v: 48.2, decimals: 1, prefix: "$", suffix: "B" },
    { label: "Investisseurs actifs", v: 1240000, suffix: "+" },
    { label: "Marchés supportés", v: 380 },
    { label: "Disponibilité depuis 2019", v: 99.99, decimals: 2, suffix: "%" },
  ];

  return (
    <section ref={ref} className="relative z-10 py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-12 border-y border-white/5 px-6 py-16 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <div
              className="font-display text-5xl font-bold tracking-tight md:text-6xl"
              data-counter={s.v}
              data-decimals={s.decimals ?? 0}
              data-prefix={s.prefix ?? ""}
              data-suffix={s.suffix ?? ""}
            >
              0
            </div>
            <div className="mt-3 text-sm uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------- PINNED 1: PRODUCT --------------------- */
function PinnedProduct() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = ref.current!.querySelectorAll<HTMLElement>(".orbit-card");
      const headline = ref.current!.querySelector<HTMLHeadingElement>("h2")!;
      const split = new SplitType(headline, { types: "chars" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
        },
      });

      tl.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        rotateX: -50,
        filter: "blur(10px)",
        stagger: 0.02,
        duration: 1,
      });

      cards.forEach((card, i) => {
        gsap.set(card, {
          opacity: 0,
          y: 200,
          scale: 0.8,
          rotate: i % 2 === 0 ? -8 : 8,
          filter: "blur(20px)",
        });
        tl.to(
          card,
          { opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)", duration: 1.4 },
          0.5 + i * 0.4,
        );
      });

      // Then sweep cards away
      tl.to(cards, {
        y: -200,
        opacity: 0,
        scale: 0.85,
        filter: "blur(12px)",
        stagger: 0.08,
        duration: 1,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const features = [
    { tag: "01", title: "Marchés en temps réel", body: "Exécution inférieure à 50 ms sur 380+ marchés avec une liquidité institutionnelle profonde." },
    { tag: "02", title: "Coffres en auto-garde", body: "Clés isolées matériellement. Vous détenez l'actif, nous maintenons la norme." },
    { tag: "03", title: "Rendement programmable", body: "Composez des stratégies de staking, prêt et LP dans une seule position." },
    { tag: "04", title: "Garde assurée", body: "Police de 500 M$ des syndicats de Lloyd's sur chaque portefeuille en garde." },
  ];

  return (
    <section ref={ref} id="product" className="relative z-10 h-screen overflow-hidden">
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
        <div className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">Produit</div>
        <h2 className="font-display text-[clamp(2.0rem,5.2vw,4.0rem)] font-bold leading-[1.25] text-balance py-3">
          Un terminal.<br />Chaque marché.
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <TiltCard key={f.tag} className="orbit-card">
              <div className="font-mono text-xs text-primary">{f.tag}</div>
              <div className="mt-6 font-display text-2xl font-semibold">{f.title}</div>
              <div className="mt-3 text-sm text-muted-foreground">{f.body}</div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ TILT CARD ------------------------------ */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const lift = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sy = useSpring(ry, { stiffness: 200, damping: 18 });
  const sl = useSpring(lift, { stiffness: 200, damping: 18 });

  function move(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(-px * 8);
    rx.set(py * 8);
    lift.set(-16);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
    lift.set(0);
  }
  return (
    <motion.div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={reset}
      style={{ rotateX: sx, rotateY: sy, y: sl, transformPerspective: 1000 }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`group relative rounded-2xl surface-glass p-7 transition-shadow hover:shadow-[0_30px_80px_-20px_oklch(0_0_0/0.6),0_0_60px_-20px_var(--color-primary)] ${className}`}
    >
      <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at 50% 0%, oklch(0.92 0.22 130 / 0.18), transparent 60%)" }}
      />
      {children}
    </motion.div>
  );
}

/* --------------------- PINNED 2: ECOSYSTEM --------------------- */
function PinnedEcosystem() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const dash = ref.current!.querySelector<HTMLElement>(".dash")!;
      const cards = ref.current!.querySelectorAll<HTMLElement>(".eco-card");
      const headline = ref.current!.querySelector<HTMLHeadingElement>("h2")!;
      const split = new SplitType(headline, { types: "words" });

      gsap.set(dash, { scale: 0.5, opacity: 0, y: 200, filter: "blur(20px)" });
      gsap.set(cards, { opacity: 0, y: 120, scale: 0.85 });
      gsap.set(split.words, { yPercent: 100, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=4000",
          pin: true,
          scrub: 1.2,
        },
      });

      tl.to(split.words, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 1 })
        .to(dash, { scale: 1, opacity: 1, y: 0, filter: "blur(0px)", duration: 2 }, 0.3)
        .to(cards, { opacity: 1, y: 0, scale: 1, stagger: 0.18, duration: 1.2 }, 1.2)
        .to(dash, { scale: 1.06, y: -30, duration: 2 }, ">")
        .to(cards, { y: -80, opacity: 0.4, stagger: 0.08, duration: 1 }, "<");
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="markets" className="relative z-10 h-screen overflow-hidden">
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
        <div className="mb-3 text-sm uppercase tracking-[0.3em] text-accent">Écosystème</div>
        <h2 className="font-display text-[clamp(2.0rem,4.8vw,3.8rem)] font-bold leading-[1.25] py-3">
          Un bureau de trading en direct dans votre poche.
        </h2>
        <div className="relative mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="dash relative">
            <div className="absolute inset-0 -z-10 blur-3xl" style={{ background: "var(--gradient-radial-glow)" }} />
            <img
              src={dashboardImg}
              alt="Tableau de bord de trading"
              loading="lazy"
              width={1600}
              height={900}
              className="w-full"
            />
            <LiveTicker />
          </div>
          <div className="grid gap-4">
            {[
              { k: "Spot & Perpétuels", v: "380+ paires" },
              { k: "Latence moyenne", v: "47ms" },
              { k: "APY de staking", v: "5,8 - 14,2%" },
              { k: "Stratégies actives", v: "2 184" },
            ].map((row) => (
              <div key={row.k} className="eco-card surface-glass flex items-center justify-between rounded-2xl px-5 py-4">
                <span className="text-sm text-muted-foreground">{row.k}</span>
                <span className="font-mono text-base gradient-text">{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveTicker() {
  const [val, setVal] = useState(284917.42);
  useEffect(() => {
    const id = setInterval(() => {
      setVal((v) => v + (Math.random() - 0.4) * 120);
    }, 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute right-4 top-4 surface-glass rounded-xl px-4 py-2 md:right-8 md:top-8">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Solde en direct</div>
      <motion.div
        key={Math.floor(val)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-lg gradient-text"
      >
        ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </motion.div>
    </div>
  );
}

/* --------------------- PINNED 3: SECURITY --------------------- */
function PinnedSecurity() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const layers = ref.current!.querySelectorAll<HTMLElement>(".sec-layer");
      const headline = ref.current!.querySelector<HTMLHeadingElement>("h2")!;
      const split = new SplitType(headline, { types: "chars" });

      gsap.set(split.chars, { yPercent: 110, opacity: 0, filter: "blur(12px)" });

      // Set initial stacked layout styles
      layers.forEach((l, i) => {
        gsap.set(l, {
          opacity: i === 0 ? 1 : 1 - i * 0.3,
          scale: 1 - i * 0.08,
          y: i * 40,
          rotate: (i - 1) * 3,
          filter: "blur(0px)",
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
        },
      });

      // 1. Text entrance
      tl.to(split.chars, { yPercent: 0, opacity: 1, filter: "blur(0px)", stagger: 0.02, duration: 0.8 });

      // 2. Card deck swipes: Card 0 swipes away, Card 1 & 2 step up
      tl.to(layers[0], {
        y: -550,
        opacity: 0,
        rotate: -8,
        scale: 0.9,
        duration: 1.5,
        ease: "power2.inOut",
      }, "+=0.2");

      tl.to(layers[1], {
        y: 0,
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 1.5,
        ease: "power2.inOut",
      }, "<");

      tl.to(layers[2], {
        y: 40,
        scale: 0.92,
        opacity: 0.7,
        rotate: -3,
        duration: 1.5,
        ease: "power2.inOut",
      }, "<");

      // Card 1 swipes away, Card 2 steps up
      tl.to(layers[1], {
        y: -550,
        opacity: 0,
        rotate: 8,
        scale: 0.9,
        duration: 1.5,
        ease: "power2.inOut",
      }, "+=0.5");

      tl.to(layers[2], {
        y: 0,
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 1.5,
        ease: "power2.inOut",
      }, "<");
    }, ref);
    return () => ctx.revert();
  }, []);

  const layers = [
    { title: "Stockage à froid", body: "97 % des actifs dans des coffres isolés géographiquement distribués.", tag: "Couche 01" },
    { title: "Calcul multipartite", body: "Signatures à seuil dans 5 juridictions indépendantes.", tag: "Couche 02" },
    { title: "Moteur anti-fraude en temps réel", body: "La modélisation comportementale examine chaque transaction en moins de 12 ms.", tag: "Couche 03" },
  ];

  return (
    <section ref={ref} id="security" className="relative z-10 h-screen overflow-hidden">
      <div className="mx-auto grid h-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="mb-3 text-sm uppercase tracking-[0.3em]" style={{ color: "var(--glow-violet)" }}>Sécurité</div>
          <h2 className="font-display text-[clamp(2.0rem,4.8vw,3.8rem)] font-bold leading-[1.25] py-3">
            Niveau bancaire,<br /> par conception.
          </h2>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Trois couches indépendantes protègent chaque transaction. Auditées trimestriellement par Trail of Bits, Halborn et les Big Four.
          </p>
        </div>
        <div className="relative h-[480px] perspective-1000">
          {layers.map((l, i) => (
            <div
              key={l.tag}
              className="sec-layer absolute inset-x-0 mx-auto w-full max-w-lg surface-glass rounded-3xl p-8 glow-ring-violet"
              style={{ top: "0px", zIndex: 10 - i }}
            >
              <div className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--glow-violet)" }}>{l.tag}</div>
              <div className="mt-4 font-display text-3xl font-semibold">{l.title}</div>
              <div className="mt-3 text-sm text-muted-foreground">{l.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ TESTIMONIALS ------------------------------ */
function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = ref.current!.querySelectorAll<HTMLElement>(".marquee-row");
      rows.forEach((row, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const speed = 30 + i * 10;
        gsap.to(row, {
          x: `${dir * 50}%`,
          duration: speed,
          ease: "none",
          repeat: -1,
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const items = [
    { name: "Mira Chen", role: "Gestionnaire de portefeuille, Helix", quote: "La couche d'exécution est la plus rapide que j'aie testée en dehors du CME. Franchement injuste." },
    { name: "Jonas Reiter", role: "Directeur des investissements, Northwave Capital", quote: "Nous avons migré 1,4 milliard $ de garde en 11 jours. L'intégration était de niveau conciergerie." },
    { name: "Aiyana Park", role: "Responsable quant, Petra", quote: "Premier produit qui respecte à la fois la vitesse et l'esthétique. Notre équipe l'a remarqué en un jour." },
    { name: "Theo Albrecht", role: "Family Office", quote: "La conformité était la case la plus facile à cocher que j'aie vue dans ce secteur." },
    { name: "Lena Volkov", role: "Fondatrice, Drift Labs", quote: "C'est la seule plateforme crypto qui semble avoir été créée par des gens qui tradent vraiment." },
    { name: "Marc Devereux", role: "Directeur de trésorerie, Vega", quote: "Nous avons remplacé quatre outils par un seul. Le reporting seul a rentabilisé l'abonnement en un mois." },
  ];

  return (
    <section className="relative z-10 overflow-hidden py-40">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">Confiance</div>
        <h2 className="font-display text-[clamp(2.0rem,4.8vw,3.6rem)] font-bold leading-[1.25] text-balance py-3">
          Le capital derrière <span className="gradient-text">la courbe</span>.
        </h2>
      </div>
      <div ref={ref} className="mt-20 space-y-6">
        {[0, 1].map((row) => (
          <div key={row} className="marquee-row">
            {[...items, ...items].map((t, i) => (
              <motion.div
                key={`${row}-${i}`}
                whileHover={{ y: -8, rotate: 0, scale: 1.03 }}
                style={{ rotate: ((i % 5) - 2) * 0.5 }}
                className="w-[380px] shrink-0 surface-glass rounded-3xl p-7"
              >
                <p className="font-display text-lg leading-snug">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ FINAL CTA ------------------------------ */
function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const headline = ref.current!.querySelector<HTMLHeadingElement>("h2")!;
      const split = new SplitType(headline, { types: "chars,words" });
      gsap.set(split.chars, { yPercent: 130, opacity: 0, filter: "blur(20px)", rotateX: -60 });
      gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        rotateX: 0,
        ease: "expo.out",
        stagger: 0.025,
        duration: 1.6,
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });

      gsap.from(ref.current!.querySelectorAll(".cta-sub"), {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 65%" },
      });

      gsap.to(ref.current!.querySelector(".cta-glow"), {
        scale: 1.4,
        opacity: 0.9,
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="earn" ref={ref} className="relative z-10 overflow-hidden py-48">
      <div className="cta-glow pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[160px]"
        style={{ background: "var(--gradient-primary)" }} />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-display text-[clamp(2.2rem,7.0vw,6.5rem)] font-bold leading-[1.25] tracking-tight text-balance py-6">
          Déplacez<br />
          <span className="gradient-text">le capital</span><br />
          comme la lumière.
        </h2>
        <p className="cta-sub mx-auto mt-10 max-w-xl text-lg text-white/80">
          Rejoignez 1,2 M+ investisseurs qui tradent la prochaine génération d'actifs numériques sur Ciphera.
        </p>
        <div className="cta-sub mt-12 flex flex-wrap justify-center gap-4">
          <MagneticButton onClick={openAuth}>Ouvrir un compte</MagneticButton>
          <MagneticButton variant="ghost" onClick={openAuth}>Parler aux ventes</MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ CONTACT FORM ------------------------------ */
function ContactFormSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await submitContactForm({
          name,
          email,
          phone,
          message,
          sourceId: "ciphera_contact",
      });


      if (res.success) {
        toast.success("Message reçu ! Notre équipe vous contactera prochainement.");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        toast.error(res.error || "Échec de l'envoi du message.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Une erreur inattendue s'est produite.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="relative z-10 py-32 border-t border-white/5">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <div className="mb-3 text-sm uppercase tracking-[0.3em] text-primary">Demandes</div>
          <h2 className="font-display text-[clamp(2.0rem,4.8vw,3.6rem)] font-bold leading-[1.25] tracking-tight py-3">
            Connectez-vous avec <span className="gradient-text">Ciphera</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Garde de niveau institutionnel ou portefeuilles à haut rendement ? Parlons-en.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="surface-glass bg-white/[0.05] rounded-3xl p-8 md:p-10 shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Nom
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Satoshi Nakamoto"
                  className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3 text-base text-foreground outline-none transition focus:border-primary/60 focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_oklch(0.92_0.22_130/0.15)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Adresse e-mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="satoshi@ciphera.io"
                  className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3 text-base text-foreground outline-none transition focus:border-primary/60 focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_oklch(0.92_0.22_130/0.15)]"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Numéro de téléphone
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3 text-base text-foreground outline-none transition focus:border-primary/60 focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_oklch(0.92_0.22_130/0.15)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Message <span className="text-muted-foreground/50">(Optionnel)</span>
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Parlez-nous de vos objectifs d'investissement..."
                rows={4}
                className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3 text-base text-foreground outline-none transition focus:border-primary/60 focus:bg-white/[0.12] focus:shadow-[0_0_0_4px_oklch(0.92_0.22_130/0.15)] resize-none"
              />
            </label>

            <div className="flex justify-end pt-4">
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-medium text-primary-foreground transition hover:shadow-[0_0_60px_-5px_var(--color-primary)] disabled:opacity-60"
              >
                {sending ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                  />
                ) : (
                  <>
                    Envoyer
                    <span>→</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------ FOOTER ------------------------------ */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2 font-display text-base text-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          Ciphera
        </div>
        <div>© {new Date().getFullYear()} Ciphera Intelligence, Inc. Entité réglementée. Investissements à risque.</div>
        <div className="flex gap-6">
          <a href="#" className="transition hover:text-foreground">Twitter</a>
          <a href="#" className="transition hover:text-foreground">Github</a>
          <a href="#" className="transition hover:text-foreground">Docs</a>
        </div>
      </div>
    </footer>
  );
}
