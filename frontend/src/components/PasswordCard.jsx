import React from 'react'

import react, { useRef, useState, useEffect } from "react";
import { getPasswords, updatePassword, deletePassword } from '../api/passwords';

import webico from "../assets/icons/webico.svg";
import more from "../assets/icons/more.svg";
import edit from "../assets/icons/edit.svg";
import del from "../assets/icons/delete.svg";
import save from "../assets/icons/save.svg";
import copy from "../assets/icons/copy.svg";
import show from "../assets/icons/outlineeye.svg";
import hiide from "../assets/icons/oulinecrosseye.svg";

const PasswordCard = ({ item }) => {
    const [showDeleteConfirm, setshowDeleteConfirm] = useState(false)

    const [count, setCount] = useState(0);
    const [cardview, setcardview] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
            <li>
                <div className="cardd p-2 py-4 my-2 rounded-lg bg-[#323232] shadow-md ">
                    <div className="cardd flex items-center gap-3 ">
                        <img src={webico} alt="" className="ml-3" />
                        <p>{item.site}</p>
                        <div className="flex-1"></div>
                        <button
                            onClick={() => {
                                if (isEditable || showDeleteConfirm) {
                                    triggerShake(); // instead of collapsing
                                    return;
                                }
                                setcardview(cardview === item.site ? null : item.site);
                                setShowPassword(false)
                            }}
                            className="p-1 rounded-full cursor-pointer !outline-none"
                        >
                            <img src={more} alt="" className={` ${(cardview == item.site) ? "-rotate-90" : ""} transition-transform duration-300`}
                            />
                        </button>
                    </div>

                    <div className={`transition-max-height  overflow-hidden  ${cardview === item.site ? "max-h-90" : "max-h-[0px]"} text-sm text-gray-300 px-3`}>
                        <div className="my-2 flex flex-wrap gap-5">
                            <div className="UserandPassdiv min-w-60 w-4/10">
                                <div className="relative">
                                    <p className="p-1 text-xs">
                                        Username
                                    </p>
                                    <input
                                        type="text"
                                        name="username"
                                        value={isEditable && formediting.site === item.site ? formediting.username : item.username}
                                        disabled={!isEditable}
                                        // onChange={handleEditChange}
                                        className={`p-2 outline-none w-full rounded ${isEditable ? "bg-[#222]" : "bg-[#2a2a2a] "} w`}
                                    />
                                    <img onClick={() => { copyText(item.username) }} src={copy} alt="" className="w-7  absolute cursor-pointer p-1 top-7 right-1" />
                                </div>
                                <div className="relative">
                                    <p className="p-1 text-xs">
                                        Password
                                    </p>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={isEditable && formediting.site === item.site ? formediting.password : item.password}
                                        disabled={!isEditable}
                                        // onChange={handleEditChange}
                                        className={`p-2 outline-none w-full rounded ${isEditable ? "bg-[#222]" : "bg-[#2a2a2a] "} w`}
                                    />
                                    <img
                                        src={showPassword ? show : hiide}
                                        onClick={() => setShowPassword(!showPassword)}
                                        alt=""
                                        className="w-[20px] absolute right-10 bottom-2 cursor-pointer"
                                    />
                                    <img onClick={() => { copyText(item.password) }} src={copy} alt="" className="w-7  absolute cursor-pointer p-1 top-7 right-1" />
                                </div>
                            </div>
                            <div className="Note min-w-60 w-4/10">

                                <p className="p-1 text-xs">
                                    Note
                                </p>
                                <textarea
                                    type="text"
                                    name="note"
                                    value={isEditable && formediting.site === item.site ? formediting.note : item.note}
                                    disabled={!isEditable}
                                    // onChange={handleEditChange}
                                    className={`p-2 w-full h-[95px] outline-none overflow-auto whitespace-pre-wrap break-words rounded ${isEditable ? "bg-[#222]" : "bg-[#2a2a2a] "} resize-none`}
                                />

                            </div>

                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1"></div>
                            {!isEditable && (
                                <div onClick={() => { setIsEditable(true); handleEdit(item) }} className="editico group flex items-center p-1.5 rounded-full duration-300  hover:bg-[#282828] cursor-pointer max-w-[36px] hover:max-w-full transition-all overflow-hidden">
                                    <img src={edit} alt="" />
                                    <p className="px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Edit</p>
                                </div>
                            )}
                            {isEditable && (
                                <div onClick={() => { setIsEditable(false); handlesave() }} className={`editico group flex items-center p-1.5 rounded-full duration-300  hover:bg-[#282828] cursor-pointer max-w-[36px] hover:max-w-full transition-all overflow-hidden ${shake ? 'shake' : ''}`}>
                                    <img src={save} alt="" />
                                    <p className="px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Save</p>
                                </div>
                            )}
                            <div
                                onClick={() => deletePassword(item.site)}
                                className="deleteico group flex items-center p-1.5 rounded-full duration-300 hover:bg-[#282828] cursor-pointer max-w-[36px] hover:max-w-full transition-all overflow-hidden">
                                <img src={del} alt="" />
                                <p className="px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Delete</p>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </>
    )
}

export default PasswordCard
