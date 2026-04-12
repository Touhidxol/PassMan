import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, checkLoggedin } from '../api/users';
import hamburger from "../assets/icons/hamburger.svg";

const Navbar = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const data = await checkLoggedin();

                setUser(data);
            } catch (err) {
                console.log(err);
            }
        };

        checkUser();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="navv w-full h-20 px-4 flex items-center justify-center">
            <div className="flex items-center gap-2 w-full">
                <img
                    onClick={openSidebar}
                    src={hamburger}
                    className="md:hidden w-6 cursor-pointer mr-5"
                    alt="menu"
                />
                <div className="font-semibold text-2xl text-left">PassMan</div>
                <div className="flex-1"></div>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="text-xs text-white/60 hover:text-white transition mr-3 hidden sm:block"
                >
                    Logout
                </button>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-semibold text-white cursor-pointer"
                    title={user?.name}
                >
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>
        </div>
    );
};

export default Navbar;