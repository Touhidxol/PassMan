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
            setPasswords(data || []);
            setError(null);
        } catch (err) {
            setError(err.message || "Unable to load passwords");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPasswords();
    }, [loadPasswords]);

    const editPassword = async (data) => {
        if (!data?._id) return;
        await updatePassword(data._id, data);
        await loadPasswords();
    };

    const removePassword = async (id) => {
        if (!id) return;
        await deletePassword(id);
        await loadPasswords();
    };
    

    return {
        passwords,
        setPasswords,
        loadPasswords,
        removePassword,
        editPassword,
        loading,
        error,
    };
};