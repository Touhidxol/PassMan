const base = "http://localhost:3000/api/users";

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