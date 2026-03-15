const base = "http://localhost:3000/api/passwords";

export const getPasswords = async () => {
    const token = localStorage.getItem("token");
    if (!token) return [];
    const res = await fetch(base, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
};

export const createPassword = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(base, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const updatePassword = async (id, data) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch(`${base}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const deletePassword = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch(`${base}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
};