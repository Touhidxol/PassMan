import React from 'react'
import { useState, useEffect } from 'react';
import logo from '../assets/icons/logo.svg';


const Navbar = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            try {
                const res = await fetch("http://localhost:3000/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.log(err);
            }
        };

        checkUser();
    }, []);

    return (
        <>
            <div className="navv w-full sm:w-2/3 h-20 px-4 flex items-center justify-center">
                <div className='flex items-center gap-2 w-full'>
                    <img src={logo} className="w-10" alt="logo" />
                    <div className='font-semibold text-2xl text-left'>
                        PassMan
                    </div>
                    <div className='flex-1'></div>
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-semibold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </>

    )
}

export default Navbar
