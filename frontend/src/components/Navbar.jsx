import React from 'react'
import logo from '../assets/icons/logo.svg';


const Navbar = () => {
    return (
        <>
            <div className='flex items-center gap-2 w-full'>
                <img src={logo} className="w-10" alt="logo" />
                <div className='font-semibold text-2xl text-left'>
                    PassMan
                </div>
                <div className='flex-1'></div>
                <div>
                    <button className='bg-gray-200 text-black rounded-full hover:bg-gray-100 text-nowrap py-[0.6em] px-[1.2em]'>Sign In</button>
                </div>
            </div>
        </>

    )
}

export default Navbar
