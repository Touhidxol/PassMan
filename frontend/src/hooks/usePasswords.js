import { useState, useEffect } from "react";
import { getPasswords } from "../api/passwords";

export const usePasswords = () => {
    const [passwords, setPasswords] = useState([]);

    const loadPasswords = async () => {
        const data = await getPasswords();
        setPasswords(data);
    };

    useEffect(() => {
        loadPasswords();
    }, []);

    return {
        passwords,
        setPasswords,
        loadPasswords,
    };
};