import React from 'react';
import { ArrowRight } from 'lucide-react';
import logo from '../assets/icons/logo.svg';


const Home = () => {
  return (
    <div className="font-inktrap relative min-h-screen w-screen overflow-hidden selection:bg-lime-300 selection:text-emerald-900">

      {/* --- Stylish Background Layer --- */}
      <div className="absolute inset-0 bg-[#022c22] z-[-2]" /> {/* Base Dark Emerald */}

      {/* Radial Glow */}
      <div className="absolute inset-0 z-[-1] opacity-60"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #065f46 0%, transparent 70%)'
        }}
      />

      {/* Curved Lines Pattern (SVG Overlay) */}
      <div className="absolute inset-0 z-[-1] opacity-30 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0" />
              <stop offset="50%" stopColor="#4ade80" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Mapping curves across the screen */}
          {[...Array(20)].map((_, i) => (
            <path
              key={i}
              d={`M ${-200 + i * 100} 1200 Q ${400 + i * 50} 400 ${1400 + i * 100} -200`}
              stroke="url(#line-grad)"
              strokeWidth="1"
              fill="transparent"
            />
          ))}
        </svg>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 group cursor-pointer">
          <img src={logo} className="w-10" alt="logo" />
          <span className="text-white text-2xl font-bold tracking-tight">PassMan</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {[
            "Features", "How It Works", "Security", "Tech Stack"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="!text-white/75 hover:!text-white font-medium transition-colors no-underline"
              >
                {item}
              </a>
            ))}
        </div>

        <button className="flex items-center gap-2 border border-white/40 text-white px-6 py-2 rounded-full hover:bg-white/10 transition-all font-medium">
          Login Now<ArrowRight size={18} />
        </button>
      </nav>

      {/* --- Hero Content --- */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
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
      </main>

    </div>
  );
};

export default Home;