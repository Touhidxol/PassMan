const baseAuth = "http://localhost:3000/api/auth";

export const sendOTP = async (email) => {
    const res = await fetch(`${baseAuth}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.message || `Request failed: ${res.status}`);
    }

    return data;
};

export const resetPassword = async ({ email, otp, newPassword }) => {
    const res = await fetch(`${baseAuth}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            email: email.toLowerCase(),
            otp: String(otp),
            newPassword,
        }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.message || `Request failed: ${res.status}`);
    }

    return data;
};