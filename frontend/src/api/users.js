// const base = "http://localhost:3000/api/users";
const base = `${import.meta.env.VITE_API_URL}/api/users`;

export const checkLoggedin = async () => {

    const res = await fetch(`${base}/me`, {
        credentials: "include",
    });

    if (!res.ok) {
        // const errData = await res.json();
        // console.log("Auth error:", errData);
        return null;
    }

    return res.json();
};

export const login = async (authData) => {

    const res = await fetch(`${base}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: authData,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
}

export const register = async (authData) => {

    const res = await fetch(`${base}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: authData,
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        console.log(data.message || "Registration failed");
    }

    return data;
}

export const logout = async () => {
    await fetch(`${base}/logout`, {
        method: "POST",
        credentials: "include",
    });
};

export const updateName = async (name) => {
    const res = await fetch(`${base}/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update name");
    return data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
    const res = await fetch(`${base}/me/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to change password");
    return data;
};

export const deleteAccount = async () => {
    const res = await fetch(`${base}/me`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete account");
    return data;
};