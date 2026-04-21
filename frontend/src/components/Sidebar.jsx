import React from "react";
import { NavLink } from "react-router-dom";
import { useGeneratorModal } from "../context/GeneratorModalContext";

import dashboard from "../assets/icons/dashboard.svg";
import passwords from "../assets/icons/passwords.svg";
import favorites from "../assets/icons/favorite.svg";
import settings from "../assets/icons/settings.svg";
import logo from "../assets/icons/logo.svg";

const menuItems = [
    { icon: passwords, label: "All Passwords", path: "/dashboard/passwords" },
    { icon: dashboard, label: "Statistics", path: "/dashboard/stats" },
    { icon: favorites, label: "Favorites", path: "/dashboard/favorites" },
    { icon: settings, label: "Settings", path: "/dashboard/settings" },
];

const Sidebar = () => {
    const { openGeneratorModal } = useGeneratorModal();

    return (
        <div className="top-0 left-0 h-screen w-20 lg:w-64 bg-[#242424] border-r border-white/20 flex flex-col z-50">

            {/* Logo */}
            <div className="p-2 h-16 flex items-center justify-center lg:justify-normal lg:p-5 text-lg font-semibold border-b border-gray-700 shrink-0">
                <span className="flex gap-4 items-center">
                    <img src={logo} className="w-10" alt="logo" />
                    <p className="hidden lg:block">PassMan</p>
                </span>
            </div>

            {/* Nav links */}
            <ul className="p-3 space-y-2 text-sm flex-1">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center justify-center lg:justify-normal gap-3 p-0 lg:p-3 h-12 !text-white/90 rounded-md cursor-pointer transition-all ${isActive ? "bg-[#52ff361a] !text-white" : "hover:bg-white/10"
                            }`
                        }
                    >
                        <img src={item.icon} alt={item.label} className="w-6 h-6" />
                        <p className="hidden lg:block">{item.label}</p>
                    </NavLink>
                ))}
            </ul>

            {/* Generator button — pinned at the bottom */}
            <div className="p-3 border-t border-white/10 shrink-0">
                <button
                    onClick={openGeneratorModal}
                    title="Open password generator"
                    className="w-full flex items-center justify-center lg:justify-start gap-3 p-0 lg:p-3 h-12 rounded-md text-white/50 hover:text-white/90 hover:bg-white/10 transition-all"
                >
                    {/* Dice icon */}
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0"
                    >
                        <polyline points="16 3 21 3 21 8" />
                        <line x1="4" y1="20" x2="21" y2="3" />
                        <polyline points="21 16 21 21 16 21" />
                        <line x1="15" y1="15" x2="21" y2="21" />
                        <line x1="4" y1="4" x2="9" y2="9" />
                    </svg>
                    <span className="hidden lg:block text-sm">Generator</span>
                </button>
            </div>

        </div>
    );
};

export default Sidebar;