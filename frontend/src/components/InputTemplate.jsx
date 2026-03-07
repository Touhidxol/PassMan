import React from 'react'

const InputTemplate = ({ id, title, children }) => {
    return (
        <div className='relative w-full my-5'>
            {children}
            <label
                htmlFor={id}
                className="
                    absolute left-3 top-0
                    bg-[#002e22] px-2
                    text-gray-400 text-sm
                    transition-all

                    peer-placeholder-shown:top-3
                    peer-placeholder-shown:text-base

                    peer-focus:-top-3
                    peer-focus:text-sm
                    peer-focus:text-lime-300

                    peer-not-placeholder-shown:-top-3
                    peer-not-placeholder-shown:text-sm"
            >
                {title}
            </label>
        </div>
    )
}

export default InputTemplate
