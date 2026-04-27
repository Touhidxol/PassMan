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
        <div className="h-screen w-full max-w-xs flex flex-col bg-sidebar border-r border-sidebar">

            {/* Header */}
            <div className="px-5 py-5 shrink-0 flex items-center gap-3 border-b border-sidebar">
                <img src={LogoIcon} className="w-10" alt="PassMan logo" />
                <div>
                    <p className="font-bold text-base text-primary">PassMan</p>
                    <p className="text-xs text-muted">Manage your passwords securely</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-0.5">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `sidebar-item${isActive ? " active" : ""}`
                        }
                    >
                        <img src={item.icon} alt="" className="w-5 h-5 shrink-0" />
                        <span className="text-sm text-primary">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Generator button */}
            <div className="p-3 shrink-0 border-t border-sidebar">
                <button
                    onClick={() => { closeSidebar(); openGeneratorModal(); }}
                    className="sidebar-item w-full text-muted"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="shrink-0">
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
