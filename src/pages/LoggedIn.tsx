import { useNavigate, Link } from "react-router-dom";
import { useEffect, useMemo, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import { motion, AnimatePresence } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollToTop } from "@/components/ScrollToTop";
import { toast } from "sonner";
import { submitContactForm } from "@/lib/contact";
import {
  TrendingUp,
  Coins,
  LogOut,
  DollarSign,
  Activity,
  Briefcase,
  User,
  ArrowUpRight,
  TrendingDown,
} from "lucide-react";


type UserSession = { name: string; email: string; phone?: string };

export default function LoggedInPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("ciphera-user") : null;
    if (!raw) {
      navigate("/");
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch {
      navigate("/");
    }
  }, [navigate]);

  if (!user) return null;

  function handleLogout() {
    localStorage.removeItem("ciphera-user");
    toast.success("Successfully logged out.");
    navigate("/");
  }

  return (
    <SmoothScroll>
      <main className="relative min-h-screen overflow-clip bg-background text-foreground">
        {/* Ambient background glows */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[oklch(0.92_0.22_130/0.12)] blur-[140px]" />
          <div className="absolute top-1/2 -right-60 h-[700px] w-[700px] rounded-full bg-[oklch(0.55_0.25_295/0.18)] blur-[160px]" />
          <div className="absolute inset-0 grid-bg opacity-30" />
        </div>

        {/* Top Navigation */}
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_20px_var(--color-primary)]" />
              Ciphera
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden text-right text-xs md:block">
                <div className="text-muted-foreground">Terminal Active</div>
                <div className="font-medium">{user.name}</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_35px_-5px_var(--color-primary)] text-primary-foreground font-bold text-sm uppercase">
                {user.name.slice(0, 2)}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-xs text-muted-foreground transition hover:border-white/30 hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>
        </motion.header>

        {/* Content sections */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 space-y-20">
          
          {/* Welcome section */}
          <section className="pt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full surface-glass px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                Live Feed - Secure connection
              </div>
              <h1 className="font-display text-[clamp(2.2rem,5.2vw,4.5rem)] font-bold leading-[1.25] tracking-tight py-2">
                Terminal Active.<br />
                Welcome, <span className="gradient-text">{user.name}</span>.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                You have successfully entered the Ciphera Intelligence private portal. Below is real-time performance analytics of major cryptocurrency indices, and projection tools for custom investments.
              </p>
            </motion.div>
          </section>

          {/* Crypto stats section */}
          <section className="space-y-6">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-primary">Live Assets</div>
              <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold leading-[1.25] py-1">Market Indexing</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <CryptoAssetCard name="Bitcoin" symbol="BTC" initialPrice={68420.50} color="var(--color-primary)" trend={true} />
              <CryptoAssetCard name="Ethereum" symbol="ETH" initialPrice={3485.20} color="var(--color-accent)" trend={true} />
              <CryptoAssetCard name="Solana" symbol="SOL" initialPrice={148.95} color="oklch(0.85 0.18 80)" trend={false} />
            </div>
          </section>

          {/* Automated Trading & Intel */}
          <TradingBots />
          <CryptoIntel />

          {/* Quick Contact Form */}
          <section id="terminal-contact" className="border-t border-white/5 pt-16">
            <div className="mx-auto max-w-3xl">
              <div className="text-center mb-10">
                <div className="text-xs uppercase tracking-[0.18em] text-accent">VIP Support</div>
                <h2 className="mt-2 font-display text-2xl font-bold leading-[1.25] py-1">Contact Us</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our private desk partners are available. Submit details for direct secure contact.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="surface-glass bg-white/[0.05] rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/20"
              >
                <LoggedInContactForm defaultUser={user} />
              </motion.div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-10 mt-16 bg-background/20">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-xs text-muted-foreground md:flex-row">
            <div className="flex items-center gap-2 font-display text-sm text-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              Ciphera Terminal
            </div>
            <div>© {new Date().getFullYear()} Ciphera Intelligence, Inc. SEC & FinCEN compliance active.</div>
            <div className="flex gap-6">
              <a href="#" className="transition hover:text-foreground">Security Core</a>
              <a href="#" className="transition hover:text-foreground">Audit Log</a>
              <a href="#" className="transition hover:text-foreground">API Docs</a>
            </div>
          </div>
        </footer>

        <ScrollToTop />
      </main>
    </SmoothScroll>
  );
}

/* ---------------- LIVE CARD COMPONENT ---------------- */
function CryptoAssetCard({
  name,
  symbol,
  initialPrice,
  color,
  trend,
}: {
  name: string;
  symbol: string;
  initialPrice: number;
  color: string;
  trend: boolean;
}) {
  const [price, setPrice] = useState(initialPrice);
  const [percentChange, setPercentChange] = useState(() => (Math.random() * 4 - 1.5));

  useEffect(() => {
    const id = setInterval(() => {
      setPrice((p) => {
        const delta = (Math.random() - 0.49) * (p * 0.001);
        const nextPrice = p + delta;
        
        // Calculate new percentage change
        const percentDelta = (delta / initialPrice) * 100;
        setPercentChange((c) => c + percentDelta);

        return nextPrice;
      });
    }, 1200);

    return () => clearInterval(id);
  }, [initialPrice]);

  const sparkPath = useMemo(() => {
    // Generate a beautiful randomized line
    const pts = Array.from({ length: 15 }, () => 10 + Math.random() * 20);
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / 14) * 100} ${40 - p}`).join(" ");
  }, []);

  const positive = percentChange >= 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04]"
    >
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-25"
        style={{ background: color }}
      />
      
      <div className="flex justify-between items-start">
        <div>
          <span className="font-display font-bold text-lg">{name}</span>
          <span className="ml-2 font-mono text-xs text-muted-foreground">{symbol}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-mono font-medium ${positive ? "text-primary" : "text-destructive"}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{positive ? "+" : ""}{percentChange.toFixed(2)}%</span>
        </div>
      </div>

      <div className="mt-4">
        <span className="font-mono text-2xl font-bold leading-none tracking-tight">
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Sparkline visualization */}
      <svg viewBox="0 0 100 40" className="mt-5 h-10 w-full opacity-70" style={{ color }}>
        <path d={sparkPath} fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}

/* ---------------- TRADING BOTS ---------------- */
const BOTS = [
  { name: "Helios", strat: "Momentum scalper", pnl: 4.82, trades: 312, color: "oklch(0.92 0.22 130)" },
  { name: "Nyx", strat: "Mean reversion", pnl: 2.14, trades: 184, color: "oklch(0.55 0.25 295)" },
  { name: "Atlas", strat: "Grid - ETH/USDT", pnl: 6.31, trades: 421, color: "oklch(0.75 0.18 200)" },
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
          14 active | 0 errors
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
      body: "Algorithmic strategies dominate modern crypto markets. Speed is no longer optional - it's the entire game.",
    },
    {
      title: "Bitcoin halving - 2028 cycle",
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

/* ---------------- SIGNED IN CONTACT FORM ---------------- */
function LoggedInContactForm({ defaultUser }: { defaultUser: UserSession }) {
  const [name, setName] = useState(defaultUser.name);
  const [email, setEmail] = useState(defaultUser.email);
  const [phone, setPhone] = useState(defaultUser.phone || "");
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
          sourceId: "ciphera_vip_consultation",
      });
      if (res.success) {
        toast.success("VIP Consultation request queued! A private adviser will contact you shortly.");
        setMessage("");
      } else {
        toast.error(res.error || "Failed to submit request.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
            Name
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Satoshi"
            className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:bg-white/[0.12]"
          />
        </label>
        
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@ciphera.io"
            className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:bg-white/[0.12]"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
          Phone Number
        </span>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 123-4567"
          className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:bg-white/[0.12]"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
          Private Message <span className="text-muted-foreground/40">(Optional)</span>
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mention target liquidity ranges, lock-in requirements or node questions..."
          rows={3}
          className="w-full rounded-xl border border-white/20 bg-white/[0.08] px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent focus:bg-white/[0.12] resize-none"
        />
      </label>

      <div className="flex justify-end pt-2">
        <motion.button
          type="submit"
          disabled={sending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative flex items-center justify-center gap-1.5 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-accent-foreground transition hover:shadow-[0_0_40px_-5px_oklch(0.75_0.18_200/0.4)] disabled:opacity-60"
        >
          {sending ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="h-3.5 w-3.5 rounded-full border-2 border-accent-foreground/40 border-t-accent-foreground"
            />
          ) : (
            <>
              Submit
              <span>→</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
