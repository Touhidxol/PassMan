const base = "http://localhost:3000/api/users";

export const checkLoggedin = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${base}/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const errData = await res.json();
        console.log("Auth error:", errData);
        return;
    }

    return res.json();
};

export const login = async (credentials) => {

    const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: credentials,
        redirect: "follow"
    });

    const data = await res.json();

    if (!res.ok) {
        console.log(data.message || "Registration failed");
    } else {
        console.log("User LoggedIn:", data);

        // store token if returned
        if (data.token) {
            localStorage.setItem("token", data.token);
        }

    }

    return data;
}

export const Register = async (credentials) => {

    const res = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: credentials,
        redirect: "follow"
    });

    const data = await res.json();

    if (!res.ok) {
        console.log(data.message || "Registration failed");
    } else {
        console.log("User Registered:", data);

        // store token if returned
        if (data.token) {
            localStorage.setItem("token", data.token);
        }

    }

    return data;
}



