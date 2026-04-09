const baseAuth = "http://localhost:3000/api/auth";

export const sendOTP = async (email) => {
    const res = await fetch(`${baseAuth}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed: ${res.status}`);
    }

    return data;
};

export const resetPassword = async ({ email, otp, newPassword }) => {
    const res = await fetch(`${baseAuth}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            otp,
            newPassword,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed: ${res.status}`);
    }

    const data = await res.json();

    return data;
};