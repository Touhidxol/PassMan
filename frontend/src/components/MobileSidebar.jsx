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

const MobileSidebar = ({ closeSidebar, sidebarOpen }) => {
    const { openGeneratorModal } = useGeneratorModal();

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={`top-0 left-0 h-screen w-full max-w-80 bg-[#242424] flex flex-col transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 z-50`}
        >
            {/* Header */}
            <div className="px-5 pt-6 pb-5 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                    <img src={logo} className="w-16" alt="logo" />
                </div>
                <p className="text-xs text-white/50 mt-3">Manage your passwords securely</p>
            </div>

            {/* Nav */}
            <ul className="p-3 space-y-2 text-sm flex-1">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 h-12 !text-white/90 rounded-md cursor-pointer transition-all ${isActive ? "bg-[#52ff361a] !text-white" : "hover:bg-white/10"
                            }`
                        }
                    >
                        <img src={item.icon} alt={item.label} className="w-6 h-6" />
                        <p>{item.label}</p>
                    </NavLink>
                ))}
            </ul>

            {/* Generator button */}
            <div className="p-3 border-t border-white/10 shrink-0">
                <button
                    onClick={() => { closeSidebar(); openGeneratorModal(); }}
                    className="w-full flex items-center gap-3 p-3 h-12 rounded-md text-white/50 hover:text-white/90 hover:bg-white/10 transition-all"
                >
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
                    <span className="text-sm">Password generator</span>
                </button>
            </div>

        </div>
    );
};

export default MobileSidebar;