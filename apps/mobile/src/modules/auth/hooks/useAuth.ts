import { useEffect, useState, } from "react";
import { clearAuthStorage } from "../services/authStorage.service";
import { logout } from "../services/auth.service";
import { getStoredUser, isAuthenticated, } from "../services/authStorage.service";

export function useAuth() {
    const [authenticated, setAuthenticated,] = useState(false);
    const [user, setUser,] = useState<any>(null);
    const [loading, setLoading,] = useState(true);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const logged = await isAuthenticated();
        setAuthenticated(logged);
        if (logged) {
            const stored = await getStoredUser();
            setUser(stored);
        }
        setLoading(false);
    };

    const signOut = async () => {
        try {
            await logout();
        } catch {
            // Si el token ya expiró o la petición falla, igualmente eliminamos la sesión local.
        }

        setLoading(true);
        await clearAuthStorage();
        setAuthenticated(false);
        setUser(null);
        setLoading(false);
    };

    return {
        authenticated,
        user,
        loading,
        reload: load,
        signOut,
    };
}