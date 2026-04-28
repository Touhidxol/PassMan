import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, checkLoggedin } from "../api/users";
import HamburgerIcon from "../assets/icons/hamburger.svg";

const Navbar = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkLoggedin()
            .then((data) => setUser(data || null))
            .catch(() => { });
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

    return (
        <header className="navbar">

            {/* Hamburger — mobile only */}
            <button
                onClick={openSidebar}
                className="navbar-hamburger"
                aria-label="Open sidebar"
            >
                <img src={HamburgerIcon} alt="menu" className="w-5" />
            </button>

            {/* Brand name */}
            <span className="navbar-brand">PassMan</span>

            <div className="flex-1" />

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="navbar-logout-btn"
            >
                Logout
            </button>

            {/* Avatar */}
            <div
                className="navbar-avatar"
                title={user?.name}
            >
                {initial}
            </div>

        </header>
    );
};

export default Navbar;