import React from 'react';
import { ArrowRight } from 'lucide-react';
import logo from '../assets/icons/logo.svg';
import Section from "../components/Section";


const Home = () => {
  return (
    <>
      <div className="font-inktrap relative flex flex-col min-h-screen w-screen overflow-hidden selection:bg-lime-300 selection:text-emerald-900">

        {/* --- Stylish Background Layer --- */}
        <div className="absolute inset-0 bg-[#011a14] z-[-2]" />

        {/* Radial Glow */}
        <div className="absolute inset-0 z-[-1] opacity-60"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #065f46 0%, transparent 70%)'
          }}
        />

        {/* Curved Lines Pattern (SVG Overlay) */}
        <div className="absolute inset-0 z-[-1] opacity-50 pointer-events-none ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" preserveAspectRatio="xMidYMid meet">
            <rect fill="none" width="1000" height="1200" />
            <g fill="none" stroke="#ffff" strokeWidth="1.0" strokeOpacity="0.25" transform="translate(0,-100)">
              <path d="M-500 625c0 0 125-30 250-30S0 625 0 625s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30" />
              <path d="M-500 595c0 0 125-30 250-30S0 595 0 595s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30" />
              <path d="M-500 655c0 0 125-30 250-30S0 655 0 655s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30" />
              <path d="M-500 565c0 0 125-30 250-30S0 565 0 565s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30" />
              <path d="M-500 535c0 0 125-30 250-30S0 535 0 535s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30" />
              <path d="M-500 685c0 0 125-30 250-30S0 685 0 685s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30" />
            </g>
          </svg>
        </div>

        {/* --- Navigation --- */}
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4 group cursor-pointer">
            <img src={logo} className="w-10" alt="logo" />
            <span className="hidden sm:block text-white text-2xl font-bold tracking-tight">PassMan</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {["Features", "How It Works", "Security", "Tech Stack"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="!text-white/75 hover:!text-white font-medium transition-colors no-underline"
              >
                {item}
              </a>
            ))}
          </div>

          <button className="flex items-center gap-2 border border-white/40 text-white px-6 py-2 rounded-full hover:bg-white/10 transition-all font-medium min-w-0 max-w-[160px]">
            <p className="truncate">
              Login Now
            </p>
            <ArrowRight size={18} className="shrink-0" />
          </button>
        </nav>

        {/* --- Hero Content --- */}
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center px-4 ">
            <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tight mb-8 leading-tight max-w-3xl">
              All Your Passwords.<br />One Secure Vault.
            </h1>

            <p className="text-lg md:text-xl text-emerald-50/80 max-w-2xl leading-relaxed mb-12">
              Store, manage, and protect your credentials with
              end-to-end encryption, secure authentication,
              and seamless access across devices.
            </p>

            <button className="bg-[#bef264] hover:bg-[#a3e635] text-emerald-950 font-bold px-10 py-4 rounded-full text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-lime-900/20">
              Get Started Securely
            </button>
          </div>
        </main>

      </div>
      <Section
        id="features"
        title="Features"
        description="Everything you need to manage passwords securely."
      >

      </Section>
    </>
  );
};

export default Home;