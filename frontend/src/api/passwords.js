
export const getPasswords = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("http://localhost:3000/", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.json();
};

export const updatePassword = async (data) => {
    const res = await fetch("http://localhost:3000/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const deletePassword = async (site) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ site }),
    });
    return res.json();
};