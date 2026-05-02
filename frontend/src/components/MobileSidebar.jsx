import { NavLink } from "react-router-dom";
import { useGeneratorModal } from "../context/GeneratorModalContext";

import DashboardIcon from "../assets/icons/dashboard.svg";
import PasswordsIcon from "../assets/icons/passwords.svg";
import FavoritesIcon from "../assets/icons/favorite.svg";
import SettingsIcon from "../assets/icons/settings.svg";
import LogoIcon from "../assets/icons/logo.svg";

const menuItems = [
    { icon: PasswordsIcon, label: "All Passwords", path: "/dashboard/passwords" },
    { icon: DashboardIcon, label: "Statistics", path: "/dashboard/stats" },
    { icon: FavoritesIcon, label: "Favorites", path: "/dashboard/favorites" },
    { icon: SettingsIcon, label: "Settings", path: "/dashboard/settings" },
];

const MobileSidebar = ({ closeSidebar }) => {
    const { openGeneratorModal } = useGeneratorModal();

    return (
        <div className="sidebar sidebar-mobile">

            {/* Header */}
            <div className="sidebar-logo-row lg:justify-start px-5 py-5">
                <img src={LogoIcon} className="w-10 shrink-0" alt="PassMan logo" />
                <div>
                    <p className="font-bold text-base sidebar-logo-label !block">
                        PassMan
                    </p>
                    <p className="text-xs sidebar-item-label !block opacity-60">
                        Manage your passwords securely
                    </p>
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `sidebar-item-mobile${isActive ? " active" : ""}`
                        }
                    >
                        <img src={item.icon} alt="" className="w-5 h-5 shrink-0 theme-icon" />
                        <span className="text-sm dark:text-white/90 text-black/90">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Generator button */}
            <div className="sidebar-footer">
                <button
                    onClick={() => { closeSidebar(); openGeneratorModal(); }}
                    className="sidebar-item-mobile w-full"
                >
                    <svg
                        width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor"
                        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
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