import { Link } from "react-router-dom";
import LogoIcon from "../assets/icons/logo.svg";
import GithubIcon from "../assets/icons/github.svg";

const LINKS = {
    Product: [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#howitworks" },
        { label: "Security", href: "#security" },
        { label: "Tech Stack", href: "#techstack" },
    ],
    Account: [
        { label: "Login", to: "/login" },
        { label: "Register", to: "/register" },
        { label: "Dashboard", to: "/dashboard" },
    ],
};

const Footer = () => (
    <footer className="w-full font-inktrap selection:bg-lime-300 selection:text-emerald-900 bg-lp-footer border-t border-lp-footer">

        {/* Main grid */}
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                    <img src={LogoIcon} className="w-10" alt="PassMan" />
                    <span className="text-white text-xl font-bold tracking-tight">PassMan</span>
                </div>
                <p className="text-emerald-100/60 text-sm leading-relaxed max-w-xs">
                    A modern, open-source password manager built with the MERN stack.
                    Your credentials, encrypted and under your control.
                </p>

                {/* GitHub link */}
                <a
                    href="https://github.com/Touhidxol/PassMan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 text-xs text-emerald-300/70 hover:text-emerald-200 transition-colors"
                >
                    <img src={GithubIcon} className="w-4 h-4 opacity-70 filter invert" alt="GitHub" />
                    View on GitHub
                </a>
            </div>

            {/* Link columns */}
            {Object.entries(LINKS).map(([group, items]) => (
                <div key={group}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/60 mb-4">
                        {group}
                    </p>
                    <ul className="space-y-2.5">
                        {items.map((item) => (
                            <li key={item.label}>
                                {item.to ? (
                                    <Link
                                        to={item.to}
                                        className="!text-emerald-100/60 hover:!text-emerald-200 text-sm transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <a
                                        href={item.href}
                                        className="!text-emerald-100/60 hover:!text-emerald-200 text-sm transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-lp-divider">
            <p className="text-xs text-emerald-100/30">
                © {new Date().getFullYear()} PassMan. Open source under ISC.
            </p>
            <p className="text-xs text-emerald-100/30">
                Built with React · Node.js · MongoDB
            </p>
        </div>
    </footer>
);

export default Footer;
