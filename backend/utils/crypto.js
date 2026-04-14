import crypto from "crypto";
import "dotenv/config";

const algorithm = "aes-256-cbc";

if (!process.env.ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY is not set");
if (!process.env.ENCRYPTION_SALT) throw new Error("ENCRYPTION_SALT is not set");

const key = crypto.scryptSync(
    process.env.ENCRYPTION_KEY,
    process.env.ENCRYPTION_SALT,
    32
);

export const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
};

export const decrypt = (text) => {
    const [ivHex, encrypted] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};