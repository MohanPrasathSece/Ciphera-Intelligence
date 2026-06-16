import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollToTop } from "@/components/ScrollToTop";
import { toast } from "sonner";
import { submitContactForm } from "../lib/contact-fns";
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

export const Route = createFileRoute("/loggedin")({
  head: () => ({
    meta: [
      { title: "Ciphera Intelligence · Investment Terminal" },
      { name: "description", content: "Your real-time cinematic investment terminal." },
    ],
  }),
  component: LoggedInPage,
});

type UserSession = { name: string; email: string; phone?: string };

function LoggedInPage() {
  const [user, setUser] = useState<UserSession | null>(null);
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

  function handleLogout() {
    localStorage.removeItem("ciphera-user");
    toast.success("Successfully logged out.");
    navigate({ to: "/" });
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
                Live Feed · Secure connection
              </div>
              <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.9] tracking-tight">
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
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Market Indexing</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <CryptoAssetCard name="Bitcoin" symbol="BTC" initialPrice={68420.50} color="var(--color-primary)" trend={true} />
              <CryptoAssetCard name="Ethereum" symbol="ETH" initialPrice={3485.20} color="var(--color-accent)" trend={true} />
              <CryptoAssetCard name="Solana" symbol="SOL" initialPrice={148.95} color="oklch(0.85 0.18 80)" trend={false} />
            </div>
          </section>

          {/* Dynamic Portfolio Insights / Simulator */}
          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Projected yields */}
            <div className="surface-glass rounded-3xl p-8 shadow-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent">
                  <Activity className="h-4 w-4" />
                  Yield projection
                </div>
                <h3 className="mt-3 font-display text-3xl font-bold">Compound Growth Simulator</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Estimate returns across custodial nodes and staking pools. Select investment level to simulate earnings.
                </p>
                
                <GrowthSimulator />
              </div>
            </div>

            {/* Portfolio breakdown */}
            <div className="surface-glass rounded-3xl p-8 shadow-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary">
                  <Briefcase className="h-4 w-4" />
                  Diversification
                </div>
                <h3 className="mt-3 font-display text-3xl font-bold">Asset Allocation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ciphera-recommended balanced portfolio weightings.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    { label: "Bitcoin Custody (Tier 1)", percentage: 55, color: "bg-primary" },
                    { label: "Ethereum Liquid Staking", percentage: 25, color: "bg-accent" },
                    { label: "DeFi Yield Pools", percentage: 12, color: "bg-[oklch(0.85_0.18_80)]" },
                    { label: "Solana Indexing", percentage: 8, color: "bg-[oklch(0.55_0.25_295)]" },
                  ].map((item, idx) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-mono font-medium">{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-primary">
                  <Coins className="h-4 w-4" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Allocations optimize automatically based on real-time volatility indices.
                </span>
              </div>
            </div>
          </section>

          {/* Quick Contact Form */}
          <section id="terminal-contact" className="border-t border-white/5 pt-16">
            <div className="mx-auto max-w-3xl">
              <div className="text-center mb-10">
                <div className="text-xs uppercase tracking-[0.18em] text-accent">VIP Support</div>
                <h2 className="mt-2 font-display text-3xl font-bold">Request Consultation</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our private desk partners are available. Submit details for direct secure contact.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="surface-glass rounded-2xl p-6 md:p-8 border border-white/10"
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

/* ---------------- COMPOUND simulator ---------------- */
function GrowthSimulator() {
  const [principal, setPrincipal] = useState(25000);
  const [years, setYears] = useState(5);
  const [riskProfile, setRiskProfile] = useState<"conservative" | "moderate" | "aggressive">("moderate");

  const apy = {
    conservative: 6.2,
    moderate: 11.4,
    aggressive: 18.9,
  };

  const finalValue = useMemo(() => {
    const rate = apy[riskProfile] / 100;
    return principal * Math.pow(1 + rate, years);
  }, [principal, years, riskProfile]);

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Initial Investment ($)</span>
          <input
            type="number"
            min="1000"
            step="1000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full mt-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Duration (Years)</span>
          <select
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full mt-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            {[1, 3, 5, 10].map((y) => (
              <option key={y} value={y} className="bg-background">
                {y} {y === 1 ? "Year" : "Years"}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Risk Profile / Allocations</span>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {(["conservative", "moderate", "aggressive"] as const).map((profile) => (
            <button
              key={profile}
              onClick={() => setRiskProfile(profile)}
              className={`rounded-lg px-3 py-2 text-xs font-medium border capitalize transition ${
                riskProfile === profile
                  ? "bg-accent text-accent-foreground border-accent shadow-[0_0_20px_oklch(0.75_0.18_200/0.3)]"
                  : "border-white/10 hover:border-white/30 text-muted-foreground"
              }`}
            >
              {profile} ({apy[profile]}%)
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Projected Valuation</span>
          <div className="font-mono text-2xl font-bold text-accent">
            ${finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Net Earnings</span>
          <div className="font-mono text-sm font-semibold text-primary">
            +${(finalValue - principal).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>
    </div>
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
        data: {
          name,
          email,
          phone,
          message,
          sourceId: "ciphera_vip_consultation",
        },
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
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent"
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
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent"
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
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent"
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
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-accent resize-none"
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
              Request Private Review
              <span>→</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
