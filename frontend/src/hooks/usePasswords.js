import { useState, useEffect, useCallback } from "react";
import { getPasswords } from "../api/passwords";

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

    return {
        passwords,
        setPasswords,
        loadPasswords,
        loading,
        error,
    };
};