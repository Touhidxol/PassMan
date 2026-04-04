import React, { useState } from 'react'
import { NavLink } from "react-router-dom";

import dashboard from "../assets/icons/dashboard.svg";
import passwords from "../assets/icons/passwords.svg";
import favorites from "../assets/icons/favorite.svg";
import settings from "../assets/icons/settings.svg";
import logo from '../assets/icons/logo.svg';



const Sidebar = () => {
    const menuItems = [
        { icon: passwords, label: "All Passwords", path: "/dashboard/passwords" },
        { icon: dashboard, label: "Dashboard", path: "/dashboard/stats" },
        { icon: favorites, label: "Favorites", path: "/dashboard/favorites" },
        { icon: settings, label: "Settings", path: "/dashboard/settings" },
    ];

    return (
        <>
            {/* ---------------- LEFT SIDEBAR ---------------- */}
            <div className={`top-0 left-0 h-screen w-20 lg:w-64 bg-[#242424] border-r border-white/20 transform lg:translate-x-0 transition-transform duration-300 z-50`}>

                <div className="p-2 h-16 flex items-center justify-center lg:justify-normal lg:p-5 text-lg font-semibold border-b border-gray-700">
                    <span className='flex gap-4 items-center'>
                        <img src={logo} className="w-10" alt="logo" />
                        <p className='hidden lg:block'>PassMan</p>
                    </span>

                </div>

                <ul className="p-3 space-y-2 text-sm">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center justify-center lg:justify-normal gap-3 p-0 lg:p-3 h-12 !text-white/90 rounded-md cursor-pointer transition-all ${isActive ? "bg-white/20 !text-white" : "hover:bg-white/10"}`
                            }
                        >
                            <img src={item.icon} alt={item.label} className="w-6 h-6" />
                            <p className='hidden lg:block'>{item.label}</p>
                        </NavLink>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Sidebar
