import { useEffect, useState, } from "react";
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

    return {
        authenticated, user, loading, reload: load,
    };
}