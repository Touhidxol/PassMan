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
    <footer className="footer-root">

        {/* Main grid */}
        <div className="footer-grid">

            {/* Brand column */}
            <div className="footer-brand-col">
                <div className="flex items-center gap-3 mb-4">
                    <img src={LogoIcon} className="w-10" alt="PassMan" />
                    <span className="text-white text-xl font-bold tracking-tight">
                        PassMan
                    </span>
                </div>

                <p className="footer-brand-tagline">
                    A modern, open-source password manager built with the MERN stack.
                    Your credentials, encrypted and under your control.
                </p>

                <a
                    href="https://github.com/Touhidxol/PassMan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 footer-link"
                >
                    <img src={GithubIcon} className="w-4 h-4 opacity-70 invert" alt="GitHub" />
                    View on GitHub
                </a>
            </div>

            {/* Link columns */}
            {Object.entries(LINKS).map(([group, items]) => (
                <div key={group}>
                    <p className="footer-group-label">{group}</p>
                    <ul className="space-y-2.5">
                        {items.map((item) => (
                            <li key={item.label}>
                                {item.to ? (
                                    <Link to={item.to} className="footer-link">
                                        {item.label}
                                    </Link>
                                ) : (
                                    <a href={item.href} className="footer-link">
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
        <div className="footer-bottom">
            <p className="footer-copy">
                © {new Date().getFullYear()} PassMan. Open source under ISC.
            </p>
            <p className="footer-copy">Built with React · Node.js · MongoDB</p>
        </div>

    </footer>
);

export default Footer;