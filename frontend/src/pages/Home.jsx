import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { checkLoggedin } from "../api/users";

import Footer from "../components/Footer";
import FeatureCard from "../components/FeatureCard";
import StepCard from "../components/StepCard";
import TechBadge from "../components/TechBadge";

import LogoIcon from "../assets/icons/logo.svg";
import ShieldIcon from "../assets/icons/shield.svg";
import BoltIcon from "../assets/icons/bolt.svg";
import KeyIcon from "../assets/icons/key.svg";
import DevicesIcon from "../assets/icons/devices.svg";
import WebIcon from "../assets/icons/webico.svg";
import CopyIcon from "../assets/icons/copy.svg";

/* ── Animated wave background paths ── */
const WAVE_PATHS = [
  "M-500 625c0 0 125-30 250-30S0 625 0 625s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30",
  "M-500 595c0 0 125-30 250-30S0 595 0 595s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30",
  "M-500 655c0 0 125-30 250-30S0 655 0 655s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30",
  "M-500 565c0 0 125-30 250-30S0 565 0 565s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30",
  "M-500 535c0 0 125-30 250-30S0 535 0 535s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30",
  "M-500 685c0 0 125-30 250-30S0 685 0 685s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30",
];

const FEATURES = [
  {
    icon: ShieldIcon,
    title: "AES-256 Encryption",
    description: "Every password is encrypted with AES-256-CBC before it touches the database. Your master key never leaves your device.",
    accent: "#10b981",
  },
  {
    icon: KeyIcon,
    title: "One Secure Vault",
    description: "All your credentials in one organised place. Add, edit, copy and delete passwords in seconds, all behind JWT authentication.",
    accent: "#3b82f6",
  },
  {
    icon: BoltIcon,
    title: "Password Generator",
    description: "Instantly create strong, cryptographically random passwords with custom length and character rules.",
    accent: "#f59e0b",
  },
  {
    icon: DevicesIcon,
    title: "Works Everywhere",
    description: "Fully responsive design so your vault is just as comfortable on a phone as on a desktop. Dark and light mode included.",
    accent: "#a855f7",
  },
  {
    icon: WebIcon,
    title: "Smart Organiser",
    description: "Favourite the sites you visit most, sort by strength or date, and search across all stored credentials instantly.",
    accent: "#ec4899",
  },
  {
    icon: CopyIcon,
    title: "One-click Copy",
    description: "Copy usernames or passwords to clipboard with a single tap. No need to reveal or type sensitive data.",
    accent: "#14b8a6",
  },
];

const STEPS = [
  {
    title: "Create your account",
    description: "Sign up with your email and choose a strong master password. Your account is hashed with bcrypt — we never store it in plaintext.",
  },
  {
    title: "Add your first password",
    description: "Enter the site, username and password. Or let the built-in generator create a strong one for you. It's saved encrypted instantly.",
  },
  {
    title: "Access from anywhere",
    description: "Log in on any device and your vault is right there. JWT tokens in HTTP-only cookies keep you authenticated securely.",
  },
  {
    title: "Stay secure over time",
    description: "Use the Statistics page to spot weak passwords, mark favourites, and update credentials with a single click.",
  },
];

const TECH = [
  { label: "React 19", color: "#61dafb" },
  { label: "Vite", color: "#646cff" },
  { label: "Tailwind CSS 4", color: "#38bdf8" },
  { label: "Framer Motion", color: "#ff0055" },
  { label: "Node.js", color: "#6abf4b" },
  { label: "Express 5", color: "#ffffff" },
  { label: "MongoDB", color: "#47a248" },
  { label: "Mongoose", color: "#880000" },
  { label: "bcrypt", color: "#f97316" },
  { label: "JWT", color: "#fb923c" },
  { label: "AES-256", color: "#10b981" },
  { label: "Nodemailer", color: "#3b82f6" },
];

const SECURITY_POINTS = [
  ["AES-256-CBC Encryption", "Passwords are encrypted with a scrypt-derived key before storage. Even a database breach reveals nothing."],
  ["bcrypt Password Hashing", "Your master password is hashed with bcrypt (cost 10). We cannot recover it — only you know it."],
  ["HTTP-only JWT Cookies", "Auth tokens are stored in HTTP-only cookies — invisible to JavaScript and safe from XSS attacks."],
  ["Rate Limiting & Helmet", "All API routes are rate-limited and protected with security headers via helmet.js."],
  ["OTP Password Reset", "Lost access? A time-limited OTP is sent to your verified email. No insecure password links."],
];

/* ─────────────────────────────────────────────────────────────── */

const Home = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const heroRef = useRef(null);

  /* ── Parallax on radial glow ── */
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 600], [0, 120]);

  useEffect(() => {
    checkLoggedin()
      .then((data) => setUser(data || null))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const scrollDown = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const initial = user?.name?.charAt(0).toUpperCase();

  return (
    <div className="font-inktrap selection:bg-lime-300 selection:text-emerald-900 overflow-x-hidden">

      {/* ════════════════════════════════════════
                HERO
        ════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex flex-col min-h-screen w-screen overflow-hidden bg-lp-hero"
      >
        {/* Background layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Radial glow with parallax */}
          <motion.div
            className="absolute inset-0 opacity-60 lp-hero-glow"
            style={{ y: glowY }}
          />
          {/* Secondary lime glow — kept as style because it's a one-off radial */}
          <div
            className="absolute opacity-25"
          />
          {/* Wave lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1200"
            preserveAspectRatio="xMidYMid meet"
          >
            <g fill="none" stroke="#fff" strokeWidth="1" strokeOpacity="0.3"
              transform="translate(0,-100)">
              {WAVE_PATHS.map((d, i) => <path key={i} d={d} />)}
            </g>
          </svg>
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04] lp-grid-bg" />
        </div>

        {/* ── Navbar ── */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <img src={LogoIcon} className="w-9" alt="PassMan" />
            <span className="hidden sm:block text-white text-xl font-bold tracking-tight">PassMan</span>
          </div>

          {/* Nav links — desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {["Features", "How It Works", "Security", "Tech Stack"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                className="text-sm !text-white/65 hover:!text-white transition-colors font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA — auth aware */}
          {authLoading ? (
            <div className="w-28 h-9 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white bg-brand-green-light"
                title={user.name}
              >
                {initial}
              </div>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 btn-lp-lime px-5 py-2 text-sm"
              >
                Dashboard
                <ArrowRight size={15} className="shrink-0" />
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 border border-white/35 !text-white px-5 py-2 rounded-full hover:bg-white/10 transition-all text-sm font-medium"
            >
              Login
              <ArrowRight size={15} className="shrink-0" />
            </Link>
          )}
        </nav>

        {/* ── Hero content ── */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="flex flex-col items-center text-center max-w-3xl">

            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-medium lp-badge"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AES-256 Encrypted · MERN Stack · Open source
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-tight mb-6"
            >
              All Your Passwords.
              <br />
              <span className="inline-block text-gradient-lime">
                One Secure Vault.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-emerald-100/70 max-w-xl leading-relaxed mb-10"
            >
              Store, manage and protect your credentials with end-to-end
              encryption, JWT authentication, and a clean dashboard that
              works on every device.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-lp-lime px-8 py-3.5 text-base shadow-lime"
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-lp-lime px-8 py-3.5 text-base shadow-lime"
                  >
                    Get Started — it's free
                  </Link>
                  <Link
                    to="/login"
                    className="!text-white/70 hover:!text-white text-sm underline underline-offset-4 transition-colors"
                  >
                    Already have an account?
                  </Link>
                </>
              )}
            </motion.div>

            {/* Scroll hint */}
            <motion.button
              onClick={scrollDown}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors"
              aria-label="Scroll down"
            >
              <span className="text-xs tracking-widest uppercase">Explore</span>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                <ChevronDown size={18} />
              </motion.div>
            </motion.button>
          </div>
        </main>
      </section>


      {/* ════════════════════════════════════════
                FEATURES
                ════════════════════════════════════════ */}
      <section id="features" className="w-screen py-24 px-4 md:px-8 bg-lp-hero">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/60 mb-3">
              What you get
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-emerald-100 mb-4">Features</h2>
            <p className="text-emerald-100/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Everything you need to manage passwords safely — encryption,
              search, generator, statistics and more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
                HOW IT WORKS
                ════════════════════════════════════════ */}
      <section id="howitworks" className="w-screen py-24 px-4 md:px-8 bg-lp-alt">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/60 mb-3">
              Getting started
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-emerald-100 mb-4">How It Works</h2>
            <p className="text-emerald-100/60 text-sm md:text-base leading-relaxed">
              Up and running in under a minute.
            </p>
          </motion.div>

          <div className="relative flex flex-col gap-10">
            {/* Vertical connector line */}
            <div className="absolute left-5 top-10 bottom-10 w-px lp-step-line" />
            {STEPS.map((s, i) => (
              <StepCard key={s.title} number={i + 1} {...s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
                SECURITY
                ════════════════════════════════════════ */}
      <section id="security" className="w-screen py-24 px-4 md:px-8 bg-lp-hero">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center">

            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/60 mb-3">
                Built to be trusted
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-emerald-100 mb-6">Security</h2>

              <div className="space-y-5">
                {SECURITY_POINTS.map(([title, desc], i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 lp-check-wrap">
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{title}</p>
                      <p className="text-emerald-100/55 text-xs leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: decorative card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative hidden md:block"
            >
              {/* Glow overlay */}
              <div className="absolute inset-0 rounded-3xl lp-security-glow" />

              {/* Card */}
              <div className="relative rounded-3xl p-8 flex flex-col gap-5 lp-card">
                <img
                  src={ShieldIcon}
                  className="w-14 h-14 lp-shield-glow"
                  alt=""
                />
                <p className="text-white text-xl font-semibold">
                  Your data is yours alone.
                </p>
                <p className="text-emerald-100/60 text-sm leading-relaxed">
                  PassMan never sends your raw passwords anywhere. All
                  encryption and decryption happens server-side with keys
                  you configure — not us.
                </p>
                {/* Mini security badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {["AES-256", "bcrypt", "HTTP-only", "Rate limited", "Helmet.js"].map((b) => (
                    <span key={b} className="text-xs px-2.5 py-1 rounded-full lp-mini-badge">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
                TECH STACK
        ════════════════════════════════════════ */}
      <section id="techstack" className="w-screen py-24 px-4 md:px-8 bg-lp-alt">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/60 mb-3">
              Under the hood
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-emerald-100 mb-4">Tech Stack</h2>
            <p className="text-emerald-100/60 text-sm md:text-base leading-relaxed mb-12 max-w-lg mx-auto">
              Modern, battle-tested tools chosen for performance, security and
              developer experience.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {TECH.map((t, i) => (
              <TechBadge key={t.label} {...t} delay={i * 0.04} />
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
                BOTTOM CTA BANNER
                ════════════════════════════════════════ */}
      <section className="w-screen py-24 px-4 md:px-8 bg-lp-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
            Ready to take control of your passwords?
          </h2>
          <p className="text-emerald-100/60 mb-10 text-sm md:text-base leading-relaxed">
            Join PassMan for free. No ads, no tracking, no nonsense.
          </p>

          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 btn-lp-lime px-10 py-4 text-lg shadow-lime-sm"
            >
              Open Dashboard
              <ArrowRight size={20} />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 btn-lp-lime px-10 py-4 text-lg shadow-lime-sm"
              >
                Create Free Account
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="!text-emerald-200/70 hover:!text-emerald-100 transition-colors text-sm underline underline-offset-4"
              >
                Sign in instead
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;