import React, { useState,useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import dashboard from "../assets/icons/dashboard.svg";
import passwords from "../assets/icons/passwords.svg";
import favorites from "../assets/icons/favorite.svg";
import settings from "../assets/icons/settings.svg";
import logo from '../assets/icons/logo.svg';


const MobileSidebar = ({ closeSidebar, sidebarOpen }) => {
    const menuItems = [
        { icon: passwords, label: "All Passwords", path: "/dashboard/passwords" },
        { icon: dashboard, label: "Statistics", path: "/dashboard/stats" },
        { icon: favorites, label: "Favorites", path: "/dashboard/favorites" },
        { icon: settings, label: "Settings", path: "/dashboard/settings" },
    ];


    return (
        <>
            {/* ---------------- LEFT MobileSIDEBAR ---------------- */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`top-0 left-0 h-screen w-full max-w-80 bg-[#242424] transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 z-50`}
            >

                {/* Header */}
                <div className="px-5 pt-6 pb-5 border-b border-white/10">
                    <div className="flex items-center">
                        <div className="flex items-center gap-2">
                            <img src={logo} className="w-16" alt="logo" />
                        </div>

                        <div className="flex-1"></div>

                    </div>

                    {/* Optional subtitle / spacing */}
                    <p className="text-xs text-white/80 mt-3">
                        Manage your passwords securely
                    </p>
                </div>

                <ul className="p-3 space-y-2 text-sm">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 h-12 !text-white/90 rounded-md cursor-pointer transition-all ${isActive ? "bg-[#52ff361a] !text-white" : "hover:bg-white/10"}`
                            }
                        >
                            <img src={item.icon} alt={item.label} className="w-6 h-6" />
                            <p>{item.label}</p>
                        </NavLink>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default MobileSidebar
