import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, checkLoggedin } from "../api/users";
import HamburgerIcon from "../assets/icons/hamburger.svg";

const Navbar = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkLoggedin().then((data) => setUser(data || null)).catch(() => { });
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

    return (
        <header className="flex items-center gap-3 px-4 md:px-6 h-navbar">

            {/* Hamburger — mobile only */}
            <button
                onClick={openSidebar}
                className="md:!hidden icon-btn flex items-center w-9 h-9 rounded-lg text-secondary"
                aria-label="Open sidebar"
            >
                <img src={HamburgerIcon} alt="menu" className="w-5" />
            </button>

            {/* Brand name */}
            <span className="font-bold text-xl tracking-tight text-primary">
                PassMan
            </span>

            <div className="flex-1" />

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="hidden sm:block text-xs transition-fast px-3 py-1.5 rounded-full text-muted border border-subtle hover:text-primary hover:border-default"
            >
                Logout
            </button>

            {/* Avatar */}
            <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white cursor-pointer shrink-0 bg-brand-green-light"
                title={user?.name}
            >
                {initial}
            </div>
        </header>
    );
};

export default Navbar;
