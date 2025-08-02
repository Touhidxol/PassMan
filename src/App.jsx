import react, { useRef, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AddWindow from "./components/AddWindow";
import "./App.css";
import { useAddWindow } from "./context/AddWindowContext";
import { ToastContainer, toast } from 'react-toastify';

import webico from "./assets/icons/webico.svg";
import more from "./assets/icons/more.svg";
import edit from "./assets/icons/edit.svg";
import del from "./assets/icons/delete.svg";
import save from "./assets/icons/save.svg";
import copy from "./assets/icons/copy.svg";
import show from "./assets/icons/outlineeye.svg";
import hiide from "./assets/icons/oulinecrosseye.svg";
import done from "./assets/icons/done.svg"
import error from "./assets/icons/error.svg"


function App() {
  const [count, setCount] = useState(0);
  const { isOpen, openWindow } = useAddWindow();
  const [cardview, setcardview] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setshowDeleteConfirm] = useState(false)
  const [copyStatus, setCopyStatus] = useState(null);
  const [passwordArray, setpasswordArray] = useState([]);

  const [formediting, setformediting] = useState({
    site: "",
    username: "",
    password: "",
    note: "",
  })

  const handleEdit = (i) => {
    const index = passwordArray.findIndex(item => item.site === i.site);
    setformediting(passwordArray[index]);
  }

  const handleEditChange = (e) => {
    setformediting({ ...formediting, [e.target.name]: e.target.value });
  }

  const handlesave = async () => {
    const index = passwordArray.findIndex(item => item.site === formediting.site);
    if (index === -1) return;

    const res = await fetch("http://localhost:3000/", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formediting) });
    getpasswords();
    setIsEditable(false);
  }

  //----------Handle Delete-------------------------------------
  const [indexToRemove, setIndexToRemove] = useState(-1);
  const handleDelete = (i) => {
    const idx = passwordArray.findIndex(item => item.site === i.site);
    setIndexToRemove(idx);
    setshowDeleteConfirm(true);
  }
  const confirmDelete = async () => {
    if (indexToRemove === -1) return;
    const updatedArray = passwordArray.filter((_, index) => index !== indexToRemove);
    setpasswordArray(updatedArray);

    let res = await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ site: passwordArray[indexToRemove].site }) });
    getpasswords();
    setshowDeleteConfirm(false);
    setIndexToRemove(-1);
  }
  const cancelDelete = () => {
    setshowDeleteConfirm(false);
    setIndexToRemove(-1);
  }
//-------while deleting background shouldnt scrollable-----------
  useEffect(() => {
    if (showDeleteConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showDeleteConfirm]);
  //-------------------------------------------------------------

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied:", text);
      setCopyStatus("Copied");
      triggerCopied();
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyStatus("Failed to copy");
      triggerCopied();
    } finally {
      setTimeout(() => setCopyStatus(null), 2100); // Hide after 2s
    }
  };

  //---------------load password on render of add button--------------
  //----(so that when we save a password it requies the laod again)---
  const getpasswords = async () => {
    try {
      let res = await fetch("http://localhost:3000/");
      let password = await res.json();
      setpasswordArray(password);
      console.log(password);
    } catch (err) {
      console.error("Error fetching passwords:", err);
    }
  }
  useEffect(() => {
    getpasswords();
  }, [isOpen]);


  // for better ux only, not mandatory-----------------------------
  const [iscopied, setiscopied] = useState(false);
  const triggerCopied = () => {
    setiscopied(true);
    setTimeout(() => setiscopied(false), 2000);
  };
  const [shake, setShake] = useState(false);
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600); // match animation duration
  };
  //----------------------------------------------------------------


  return (
    <>
      {/*  -----------------------Custom allert for copied------------------------- */}
      <div className={`flex items-center justify-center gap-1 px-4 py-2 rounded-full absolute bottom-10 left-1/2 transform -translate-x-1/2 ${copyStatus == "Copied" ? "bg-green-400" : "bg-red-500"}  text-black transition-opacity duration-300 ${iscopied ? "opacity-100" : "opacity-0"} `} > <img src={copyStatus == "Copied" ? done : error} alt="" /><p>{copyStatus}</p> </div>
      {/* ------------------------------------------------------------------------- */}
      {/*  -----------------------Poppup to confirm delete------------------------- */}
      <div className={`z-10 w-8/10 max-w-md p-6 flex flex-col items-center justify-center gap-6 rounded-xl fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] text-white border border-gray-700 transition-opacity duration-300 shadow-xl shadow-black/50 ${showDeleteConfirm ? "opacity-100" : "opacity-0 pointer-events-none"} ${shake ? 'shake' : ''}`}>
        <div className="text-left w-full"><p className="text-lg font-semibold">Are you sure you want to delete this?</p><p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p></div>
        <div className="flex gap-4 mt-2 justify-end items-centre w-full">
          <button
            className="px-4 py-2 rounded-full border border-gray-500 text-gray-300 hover:bg-[#343434] transition"
            onClick={cancelDelete}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}

      {isOpen && <AddWindow />}

      <div className="w-screen min-h-screen items-center flex flex-col">
        <div className="navv w-full sm:w-2/3 h-20 px-2 flex items-center justify-center">
          <Navbar />
        </div>
        <div className="conthainer flex-1 flex flex-col w-full sm:w-2/3 rounded-xl">
          <div className="flex px-5 my-3 items-center">
            <p className="text-xl">Passwords</p>
            <div className="flex-1"></div>
            <button
              onClick={openWindow}
              className="py-[0.6em] px-[1.2em] bg-transparent border-2 border-blue-500 rounded-full text-sm hover:bg-[#1c244785]"
            >
              Add
            </button>
          </div>
          <p className="px-5 text-sm">
            Create, save, and manage your passwords so you can easily sign in to
            sites and apps.
          </p>
          <div className="flex-1">
            <ul className="cards p-5">
              {passwordArray.map((item) => {
                return (
                  <li key={item.site}>
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
                                onChange={handleEditChange}
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
                                onChange={handleEditChange}
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
                              onChange={handleEditChange}
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
                            onClick={() => handleDelete(item)}
                            className="deleteico group flex items-center p-1.5 rounded-full duration-300 hover:bg-[#282828] cursor-pointer max-w-[36px] hover:max-w-full transition-all overflow-hidden">
                            <img src={del} alt="" />
                            <p className="px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Delete</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
