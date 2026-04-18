const base = `${import.meta.env.VITE_API_URL}/api/users`;

// ── helper: on 401, try to refresh token once, then retry ────────────────────
async function fetchWithRefresh(url, options = {}) {
    let res = await fetch(url, { credentials: "include", ...options });

    if (res.status === 401) {
        // attempt silent refresh
        const refreshRes = await fetch(`${base}/refresh`, {
            method: "POST",
            credentials: "include",
        });
        if (refreshRes.ok) {
            // retry original request with fresh cookie
            res = await fetch(url, { credentials: "include", ...options });
        }
    }
    return res;
}
// ─────────────────────────────────────────────────────────────────────────────

export const checkLoggedin = async () => {
    const res = await fetchWithRefresh(`${base}/me`);
    if (!res.ok) return null;
    return res.json();
};

export const login = async (authData) => {
    const res = await fetch(`${base}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: authData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
};

// P3 fix: throw on !res.ok so callers get the real error
export const register = async (authData) => {
    const res = await fetch(`${base}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: authData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
};

export const logout = async () => {
    await fetch(`${base}/logout`, {
        method: "POST",
        credentials: "include",
    });
};

export const updateName = async (name) => {
    const res = await fetchWithRefresh(`${base}/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update name");
    return data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
    const res = await fetchWithRefresh(`${base}/me/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to change password");
    return data;
};

export const deleteAccount = async () => {
    const res = await fetchWithRefresh(`${base}/me`, {
        method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete account");
    return data;
};
