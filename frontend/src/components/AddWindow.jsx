import React from "react";
import { useAddWindow } from "../context/AddWindowContext";
import show from "../assets/icons/show.svg";
import hiide from "../assets/icons/hide.svg";
import { useRef, useState, useEffect } from "react";

const AddWindow = () => {
    const { closeWindow } = useAddWindow();
    const [passwordArray, setpasswordArray] = useState([]);
    const [showError, setshowError] = useState("");
    const [form, setform] = useState({
        site: "",
        username: "",
        password: "",
        note: "",
    });

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
    }, []);


    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
        setshowError(false);
    };

    const eyeref = useRef();
    const passwordInputRef = useRef();
    const toogleshowpassword = () => {
        if (eyeref.current.src == hiide) {
            passwordInputRef.current.type = "text";
            eyeref.current.src = show;
        } else {
            passwordInputRef.current.type = "password";
            eyeref.current.src = hiide;
        }
    };

    const savepassword = async() => {
        const { site, password } = form;

        // Regex for simple domain validation (e.g., example.com, sub.example.org)
        const siteRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;

        if (!site || !password) {
            setshowError("Site and Password cannot be empty.");
            return;
        }

        if (!siteRegex.test(site)) {
            setshowError("Please enter a valid domain (e.g., example.com).");
            return;
        }

        if (passwordArray.some((item) => item.site === site)) {
            setshowError("This site name already exists.");
            return;
        }

        let res = await fetch("http://localhost:3000/",{method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(form)});
        // localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
        closeWindow();
    };

    return (
        <div className="z-10 h-screen w-screen flex items-center justify-center absolute bg-[#00000035] backdrop-blur-xs">
            <div className="bg-[#131313] min-w-full sm:min-w-[380px] sm:w-2/5 w-full rounded-xl shadow-lg flex flex-col">
                <div className="flex-1 p-4 px-6">
                    <div className="h-10">Add new password</div>
                    <div className="w-full flex flex-col">
                        <label
                            htmlFor="site"
                            className={` text-xs mt-5 mb-2 mx-1 ${showError ? "text-red-300" : "text-white"
                                } `}
                        >
                            {showError ? `* ${showError}` : "Site"}
                        </label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="site"
                            id="site"
                            placeholder="example.com"
                            className={`w-full h-10 px-4 text-sm text-white placeholder-gray-400 bg-[#2C2C2C] rounded-t-lg border-b-2 focus:outline-none focus:border-b-2 focus:border-b-blue-500 ${showError ? "border-red-300" : "border-b-[#444]"
                                }`}
                        />
                    </div>
                    <div className="w-full flex flex-col">
                        <label htmlFor="username" className="text-xs mt-5 mb-2 mx-1">
                            Username
                        </label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="username"
                            id="username"
                            placeholder=""
                            className="w-full h-10 px-4 text-sm text-white placeholder-gray-400 bg-[#2C2C2C] rounded-t-lg border-b-2 border-b-[#444] focus:outline-none focus:border-b-2 focus:border-b-blue-500"
                        />
                    </div>
                    <div className="w-full flex flex-col relative">
                        <label htmlFor="password" className="text-xs mt-5 mb-2 mx-1">
                            Password
                        </label>
                        <input
                            ref={passwordInputRef}
                            onChange={handleChange}
                            type="password"
                            name="password"
                            id="password"
                            placeholder=""
                            className="w-full h-10 px-4 text-sm text-white placeholder-gray-400 bg-[#2C2C2C] rounded-t-lg border-b-2 border-b-[#444] focus:outline-none focus:border-b-2 focus:border-b-blue-500"
                        />
                        <img
                            ref={eyeref}
                            src={hiide}
                            onClick={toogleshowpassword}
                            alt=""
                            className="w-[20px] absolute right-2 bottom-2 cursor-pointer"
                        />
                    </div>
                    <div className="text-xs h-12 flex items-center border-b border-[#2f2f2f]">
                        Make sure you're saving your current password for this site
                    </div>
                    <div className="w-full flex flex-col">
                        <label htmlFor="note" className="text-xs mt-5 mb-2 mx-1">
                            Note
                        </label>
                        <textarea
                            onChange={handleChange}
                            type="text"
                            name="note"
                            id="note"
                            placeholder=""
                            className="w-full h-[90px] px-4 py-2 text-sm text-white placeholder-gray-400 bg-[#2C2C2C] rounded-t-lg border-b-2 border-b-[#444] focus:outline-none focus:border-b-2 focus:border-b-blue-500 resize-none"
                        />
                    </div>
                </div>
                <div className="flex gap-2 my-4 px-4">
                    <div className="flex-1"></div>
                    <button
                        onClick={closeWindow}
                        className="border border-gray-200 rounded-full text-sm py-[0.6em] px-[1.2em]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={savepassword}
                        className="bg-blue-700 rounded-full text-sm py-[0.6em] px-[1.2em]"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddWindow;
