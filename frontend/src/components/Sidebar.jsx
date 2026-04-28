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

const Sidebar = () => {
    const { openGeneratorModal } = useGeneratorModal();

    return (
        <aside className="sidebar sidebar-desktop">

            {/* Logo row */}
            <div className="sidebar-logo-row">
                <img src={LogoIcon} className="w-9 shrink-0" alt="PassMan logo" />
                <span className="sidebar-logo-label">PassMan</span>
            </div>

            {/* Nav links */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-item${isActive ? " active" : ""}`
                        }
                    >
                        <img src={item.icon} alt="" className="w-5 h-5 shrink-0" />
                        <span className="sidebar-item-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Generator button — pinned bottom */}
            <div className="sidebar-footer">
                <button
                    onClick={openGeneratorModal}
                    title="Open password generator"
                    className="sidebar-generator-btn"
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
                    <span className="sidebar-item-label">Generator</span>
                </button>
            </div>

        </aside>
    );
};

export default Sidebar;