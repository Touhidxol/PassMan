import React, { useEffect, useState } from "react";
import { usePasswords } from "../hooks/usePasswords";
import PasswordCard from "../components/PasswordCard";

const Favorites = () => {
    const { passwords, loadPasswords } = usePasswords();
    const [cardOpen, setCardOpen] = useState(null);

    useEffect(() => {
        loadPasswords();
    }, [loadPasswords]);

    // const favoritePasswords = passwords.filter(item => item.isFavorite);
    const favoritePasswords = passwords;

    return (
        <>
            {cardOpen && (
                <PasswordCard
                    item={cardOpen}
                    onClose={() => setCardOpen(null)}
                />
            )}

            <div className="flex flex-col">
                <div className="flex px-5 my-3 items-center">
                    <h1 className="text-2xl font-semibold mb-6">Favorites</h1>
                </div>

                {favoritePasswords.length === 0 ? (
                    <p className="px-5 text-sm text-gray-400">
                        No favorite passwords yet.
                    </p>
                ) : (
                    <ul className="cards p-5">
                        {favoritePasswords.map((item) => (
                            <li
                                key={item._id}
                                onClick={() => setCardOpen(item)}
                                className="password-list"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-md bg-[#3a3a3a]">
                                        {item.site.charAt(0).toUpperCase()}
                                    </div>

                                    <p className="text-sm truncate">{item.site}</p>

                                    <div className="flex-1"></div>
                                    <span>›</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default Favorites;