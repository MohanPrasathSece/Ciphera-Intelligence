import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScroll } from "@/components/SmoothScroll";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Ciphera · Trading Desk" },
      { name: "description", content: "Your live crypto trading desk powered by autonomous bots." },
    ],
  }),
  component: DashboardPage,
});

type User = { name: string; email: string };

function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("ciphera-user") : null;
    if (!raw) {
      navigate({ to: "/" });
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch {
      navigate({ to: "/" });
    }
  }, [navigate]);

  if (!user) return null;

  function logout() {
    localStorage.removeItem("ciphera-user");
    navigate({ to: "/" });
  }

  return (
    <SmoothScroll>
      <main className="relative min-h-screen overflow-clip bg-background text-foreground">
        <Ambient />
        <TopBar user={user} onLogout={logout} />
        <Welcome name={user.name} />
        <PortfolioStats />
        <LiveChart />
        <TradingBots />
        <CryptoIntel />
        <Activity />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

/* ---------------- AMBIENT ---------------- */
function Ambient() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[oklch(0.92_0.22_130/0.15)] blur-[140px]" />
      <div className="absolute top-1/2 -right-60 h-[600px] w-[600px] rounded-full bg-[oklch(0.55_0.25_295/0.22)] blur-[160px]" />
      <div className="absolute inset-0 grid-bg opacity-40" />
    </div>
  );
}

/* ---------------- TOP BAR ---------------- */
function TopBar({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_20px_var(--color-primary)]" />
          Ciphera
        </Link>
        <div className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <a className="text-foreground">Desk</a>
          <a>Bots</a>
          <a>Markets</a>
          <a>Staking</a>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs md:block">
            <div className="text-muted-foreground">Signed in</div>
            <div className="font-medium">{user.name}</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_30px_-5px_var(--color-primary)]" />
          <button
            onClick={onLogout}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-white/30 hover:text-foreground"
          >
            Log out
          </button>
        </div>
      </div>
    </motion.header>
  );
}

/* ---------------- WELCOME ---------------- */
function Welcome({ name }: { name: string }) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full surface-glass px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Live · {new Date().toLocaleDateString()}
        </div>
        <h1 className="font-display text-[clamp(2.2rem,5.2vw,4.2rem)] font-bold leading-[1.25] tracking-tight py-2">
          Welcome back,<br />
          <span className="gradient-text">{name}.</span>
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Your autonomous fleet executed <span className="text-foreground font-medium">1,284 trades</span> while you were away. Markets are open and your bots are dancing.
        </p>
      </motion.div>
    </section>
  );
}

/* ---------------- PORTFOLIO STATS ---------------- */
function PortfolioStats() {
  const stats = [
    { label: "Portfolio value", target: 284917.42, prefix: "$", color: "from-primary to-accent" },
    { label: "24h P&L", target: 12483.91, prefix: "+$", color: "from-primary to-[oklch(0.7_0.2_140)]" },
    { label: "Active bots", target: 14, prefix: "", color: "from-accent to-[oklch(0.7_0.2_300)]" },
    { label: "Win rate", target: 78.4, prefix: "", suffix: "%", color: "from-primary to-accent" },
  ];
  return (
    <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-6 md:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5"
        >
          <div className={`absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-20 bg-gradient-to-br ${s.color}`} />
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{s.label}</div>
          <div className="mt-3 font-display text-2xl font-bold md:text-3xl">
            <Counter value={s.target} prefix={s.prefix} suffix={s.suffix} />
          </div>
          <Sparkline />
        </motion.div>
      ))}
    </section>
  );
}

function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const formatted = value >= 100
    ? v.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : v.toFixed(1);
  return <span className="font-mono">{prefix}{formatted}{suffix}</span>;
}

function Sparkline() {
  const path = useMemo(() => {
    const pts = Array.from({ length: 24 }, () => 10 + Math.random() * 30);
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / 23) * 100} ${40 - p}`).join(" ");
  }, []);
  return (
    <svg viewBox="0 0 100 40" className="mt-4 h-10 w-full text-primary/70">
      <motion.path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ---------------- LIVE CHART ---------------- */
function LiveChart() {
  const [points, setPoints] = useState<number[]>(() =>
    Array.from({ length: 60 }, (_, i) => 50 + Math.sin(i / 4) * 18 + Math.random() * 6),
  );
  const [price, setPrice] = useState(68421.34);

  useEffect(() => {
    const id = setInterval(() => {
      setPoints((p) => {
        const next = [...p.slice(1), 50 + Math.sin(p.length / 4) * 18 + Math.random() * 22];
        return next;
      });
      setPrice((p) => p + (Math.random() - 0.45) * 120);
    }, 700);
    return () => clearInterval(id);
  }, []);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 90 - 5;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  const area = `${path} L 100 100 L 0 100 Z`;

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">BTC / USD · Live</div>
            <motion.div
              key={Math.floor(price)}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-2 font-display text-4xl font-bold md:text-5xl"
            >
              <span className="font-mono gradient-text">${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </motion.div>
          </div>
          <div className="flex gap-2 text-xs">
            {["1H", "1D", "1W", "1M", "ALL"].map((t, i) => (
              <button
                key={t}
                className={`rounded-full px-3 py-1.5 transition ${
                  i === 1 ? "bg-primary text-primary-foreground" : "border border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-6 aspect-[16/7]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.92 0.22 130)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="oklch(0.92 0.22 130)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#chartFill)" />
            <path d={path} fill="none" stroke="oklch(0.92 0.22 130)" strokeWidth="0.6" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRADING BOTS ---------------- */
const BOTS = [
  { name: "Helios", strat: "Momentum scalper", pnl: 4.82, trades: 312, color: "oklch(0.92 0.22 130)" },
  { name: "Nyx", strat: "Mean reversion", pnl: 2.14, trades: 184, color: "oklch(0.55 0.25 295)" },
  { name: "Atlas", strat: "Grid · ETH/USDT", pnl: 6.31, trades: 421, color: "oklch(0.75 0.18 200)" },
  { name: "Orion", strat: "Arbitrage triangle", pnl: 1.93, trades: 89, color: "oklch(0.85 0.18 80)" },
];

function TradingBots() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bot-card", {
        y: 80,
        opacity: 0,
        rotateX: -20,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Autonomous fleet</div>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl leading-[1.25] py-1">
            Bots that <span className="gradient-text">never sleep.</span>
          </h2>
        </div>
        <div className="hidden text-right text-sm text-muted-foreground md:block">
          14 active · 0 errors
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4" style={{ perspective: 1200 }}>
        {BOTS.map((b) => (
          <BotCard key={b.name} bot={b} />
        ))}
      </div>
    </section>
  );
}

function BotCard({ bot }: { bot: (typeof BOTS)[number] }) {
  const [ticks, setTicks] = useState<number[]>(() =>
    Array.from({ length: 20 }, () => 20 + Math.random() * 40),
  );
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTicks((t) => [...t.slice(1), 20 + Math.random() * 40]);
    }, 600);
    return () => clearInterval(id);
  }, [running]);

  return (
    <motion.div
      whileHover={{ y: -8, rotateX: 6, rotateY: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="bot-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-40"
        style={{ background: bot.color }}
      />

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: running ? [1, 1.5, 1] : 1, opacity: running ? [1, 0.4, 1] : 0.3 }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="h-2 w-2 rounded-full"
              style={{ background: bot.color, boxShadow: `0 0 12px ${bot.color}` }}
            />
            <span className="font-display text-lg font-bold">{bot.name}</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{bot.strat}</div>
        </div>
        <button
          onClick={() => setRunning((r) => !r)}
          className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          {running ? "Pause" : "Run"}
        </button>
      </div>

      <div className="mt-4 flex h-16 items-end gap-[3px]">
        {ticks.map((t, i) => (
          <motion.div
            key={i}
            layout
            animate={{ height: `${t}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 rounded-sm"
            style={{
              background: `linear-gradient(to top, ${bot.color}, transparent)`,
              opacity: 0.4 + (i / ticks.length) * 0.6,
            }}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-mono text-primary">+{bot.pnl.toFixed(2)}%</span>
        <span className="text-xs text-muted-foreground">{bot.trades} trades</span>
      </div>
    </motion.div>
  );
}

/* ---------------- CRYPTO INTEL ---------------- */
function CryptoIntel() {
  const facts = [
    {
      title: "DeFi TVL crossed $180B",
      body: "Decentralized finance protocols custody more value than most national banks. Liquidity is now programmable.",
    },
    {
      title: "Bots execute 73% of volume",
      body: "Algorithmic strategies dominate modern crypto markets. Speed is no longer optional — it's the entire game.",
    },
    {
      title: "Bitcoin halving · 2028 cycle",
      body: "Supply issuance halves every ~4 years. The next epoch tightens float and historically precedes new highs.",
    },
  ];
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Intel</div>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl leading-[1.25] py-1">
          The market, <span className="gradient-text">decoded.</span>
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {facts.map((f, i) => (
          <motion.article
            key={f.title}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <div className="font-mono text-xs text-primary">0{i + 1}</div>
            <h3 className="mt-3 font-display text-base font-bold leading-[1.25] py-1">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/40 via-accent/40 to-transparent" />
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- ACTIVITY ---------------- */
function Activity() {
  const seed = [
    { t: "Helios", a: "Bought 0.184 BTC", p: "+$312.40" },
    { t: "Atlas", a: "Sold 4.2 ETH", p: "+$842.10" },
    { t: "Nyx", a: "Rebalanced SOL/USDT", p: "+$104.32" },
    { t: "Orion", a: "Arbitrage · Kraken→Binance", p: "+$58.91" },
    { t: "Helios", a: "Bought 0.08 BTC", p: "+$186.00" },
    { t: "Atlas", a: "Grid trigger ETH 3580", p: "+$72.55" },
  ];
  const [items, setItems] = useState(seed);

  useEffect(() => {
    const id = setInterval(() => {
      setItems((arr) => {
        const next = [...arr];
        const head = seed[Math.floor(Math.random() * seed.length)];
        next.unshift({ ...head, p: `+$${(Math.random() * 800).toFixed(2)}` });
        return next.slice(0, 8);
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl leading-[1.25] py-1">Live activity</h2>
        <span className="text-xs text-muted-foreground">Streaming</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <AnimatePresence initial={false}>
          {items.map((it, i) => (
            <motion.div
              key={it.t + it.a + i}
              layout
              initial={{ opacity: 0, x: -40, backgroundColor: "oklch(0.92 0.22 130 / 0.1)" }}
              animate={{ opacity: 1, x: 0, backgroundColor: "oklch(0 0 0 / 0)" }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between border-b border-white/5 px-5 py-3 text-sm last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="font-display font-semibold">{it.t}</span>
                <span className="text-muted-foreground">{it.a}</span>
              </div>
              <span className="font-mono text-primary">{it.p}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mx-auto max-w-7xl px-6 py-12 text-center text-xs text-muted-foreground">
      Ciphera Desk · Demo environment · No real funds at risk.
    </footer>
  );
}
