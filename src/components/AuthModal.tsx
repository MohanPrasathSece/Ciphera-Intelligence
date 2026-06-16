import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { signUpUser, loginUser } from "../lib/auth-fns";
import { toast } from "sonner";

type Mode = "login" | "signup";

export function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-auth", onOpen);
    return () => window.removeEventListener("open-auth", onOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!name || !email || !phone || !password) {
          toast.error("Please fill in all fields.");
          setLoading(false);
          return;
        }
        const res = await signUpUser({
          data: { name, email, phone, password },
        });
        if (res.success && res.user) {
          localStorage.setItem("ciphera-user", JSON.stringify(res.user));
          toast.success("Account created successfully!");
          setOpen(false);
          navigate({ to: "/loggedin" });
        } else {
          toast.error(res.error || "Failed to create account.");
        }
      } else {
        if (!email || !password) {
          toast.error("Please fill in all fields.");
          setLoading(false);
          return;
        }
        const res = await loginUser({
          data: { email, password },
        });
        if (res.success && res.user) {
          localStorage.setItem("ciphera-user", JSON.stringify(res.user));
          toast.success("Welcome back!");
          setOpen(false);
          navigate({ to: "/loggedin" });
        } else {
          toast.error(res.error || "Invalid email or password.");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.92, rotateX: -10 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[oklch(0.18_0.02_270/0.95)] p-8 shadow-[0_30px_120px_-10px_oklch(0.92_0.22_130/0.25)]"
            style={{ perspective: 1000 }}
          >
            <div
              className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full blur-3xl"
              style={{ background: "oklch(0.92 0.22 130 / 0.35)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl"
              style={{ background: "oklch(0.55 0.25 295 / 0.35)" }}
            />

            <button
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 text-muted-foreground transition hover:text-foreground"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="relative">
              <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Ciphera Access
              </div>
              <motion.h2
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 font-display text-3xl font-bold tracking-tight"
              >
                {mode === "login" ? "Welcome back." : "Create your account."}
              </motion.h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to your cinematic trading desk."
                  : "30 seconds. No credit card. Pure motion."}
              </p>

              <div className="mt-6 flex gap-1 rounded-full border border-white/10 p-1 text-sm">
                {(["login", "signup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`relative flex-1 rounded-full px-3 py-1.5 transition ${
                      mode === m ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {mode === m && (
                      <motion.span
                        layoutId="auth-pill"
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative">{m === "login" ? "Log in" : "Sign up"}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <AnimatePresence mode="popLayout">
                  {mode === "signup" && (
                    <motion.div
                      key="signup-fields"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <Field
                        label="Name"
                        type="text"
                        value={name}
                        onChange={setName}
                        placeholder="Satoshi"
                        required
                      />
                      <Field
                        label="Phone Number"
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        placeholder="+1 (555) 019-2834"
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@ciphera.io"
                  required
                />
                <Field
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  required
                />

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:shadow-[0_0_60px_-5px_var(--color-primary)] disabled:opacity-60"
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                    />
                  ) : (
                    <>
                      {mode === "login" ? "Enter the terminal" : "Create account"}
                      <span>→</span>
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-5 text-center text-xs text-muted-foreground">
                Fully functional {mode === "login" ? "login" : "registration"} system
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-foreground outline-none transition focus:border-primary/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_oklch(0.92_0.22_130/0.15)]"
      />
    </label>
  );
}
