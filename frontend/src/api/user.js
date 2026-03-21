const base = "http://localhost:3000/api/users";

export const checkLoggedin = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${base}/me`, {
        method: "GET",
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