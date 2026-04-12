const base = "http://localhost:3000/api/passwords";

export const getPasswords = async () => {
    const res = await fetch(base, {
        credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed: ${res.status}`);
    }

    return res.json();
};

export const createPassword = async (data) => {
    const res = await fetch(base, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });
    return res.json();
};

export const updatePassword = async (id, data) => {
    const res = await fetch(`${base}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });
    return res.json();
};

export const deletePassword = async (id) => {
    const res = await fetch(`${base}/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    return res.json();
};