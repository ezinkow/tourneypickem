import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const STORAGE_KEY_TOKEN = "token";
const STORAGE_KEY_NAME  = "name";

/**
 * useAuth — shared authentication hook.
 *
 * Returns:
 *   user        { name } | null
 *   login(name, password) → { success, error }
 *   logout()
 *   loading     boolean (true while verifying token on mount)
 */
export default function useAuth() {
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, verify any stored token
    useEffect(() => {
        async function verify() {
            const token = localStorage.getItem(STORAGE_KEY_TOKEN);
            const name  = localStorage.getItem(STORAGE_KEY_NAME);
            if (!token || !name) { setLoading(false); return; }

            try {
                const { data } = await axios.post("/api/auth/verify-token", { name, token });
                if (data.success) {
                    setUser({ name: data.name });
                } else {
                    localStorage.removeItem(STORAGE_KEY_TOKEN);
                    localStorage.removeItem(STORAGE_KEY_NAME);
                }
            } catch {
                // Network error — leave stored credentials alone, just show logged-out
            } finally {
                setLoading(false);
            }
        }
        verify();
    }, []);

    const login = useCallback(async (name, password) => {
        try {
            const { data } = await axios.post("/api/auth/verify", { name, password });
            if (data.success) {
                localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
                localStorage.setItem(STORAGE_KEY_NAME,  data.name);
                setUser({ name: data.name });
                return { success: true };
            }
            return { success: false, error: "Invalid username or password" };
        } catch {
            return { success: false, error: "Login failed — please try again" };
        }
    }, []);

    const logout = useCallback(async () => {
        const token = localStorage.getItem(STORAGE_KEY_TOKEN);
        if (token) {
            try { await axios.post("/api/auth/logout", { token }); } catch { /* best effort */ }
        }
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_NAME);
        setUser(null);
    }, []);

    return { user, login, logout, loading };
}