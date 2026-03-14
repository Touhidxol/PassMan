import { useState, useEffect, useCallback } from "react";
import { getPasswords, updatePassword, deletePassword } from "../api/passwords";

export const usePasswords = () => {
    const [passwords, setPasswords] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const loadPasswords = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPasswords();
            setPasswords(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPasswords();
    }, [loadPasswords]);

    const editPassword = async (data) => {
        await updatePassword(data);
        await loadPasswords();
    };

    const removePassword = async (site) => {
        await deletePassword(site);
        await loadPasswords();
    };
    

    return {
        passwords,
        setPasswords,
        loadPasswords,
        removePassword,
        loading,
        error,
    };
};