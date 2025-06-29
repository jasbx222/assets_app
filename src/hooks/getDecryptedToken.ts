import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "fallback-key";

export function getDecryptedToken() {
  const encryptedToken = localStorage.getItem("token");
  if (!encryptedToken || !SECRET_KEY) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Invalid token decryption");
    return decrypted;
  } catch (err) {
    console.error("فشل في فك تشفير التوكن:", err);
    return null;
  }
}