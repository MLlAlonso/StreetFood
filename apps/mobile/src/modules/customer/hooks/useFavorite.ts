import { useEffect, useState } from "react";

import { addFavorite, removeFavorite, getFavoriteStatus, } from "../services/favorites.service";
import { isAuthenticated } from "@/modules/auth/services/authStorage.service";

export function useFavorite(businessId: number) {
    const [favorite, setFavorite,] = useState(false);
    const [loading, setLoading,] = useState(true);

    useEffect(() => {
        if (!businessId) {
            return;
        }

        loadStatus();
    }, [businessId]);

    const loadStatus = async () => {
        const logged = await isAuthenticated();

        if (!logged) {
            setLoading(false);
            return;
        }

        try {
            const status = await getFavoriteStatus(businessId);
            setFavorite(status);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async () => {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            if (favorite) {
                await removeFavorite(businessId);
                setFavorite(false);
            } else {
                await addFavorite(businessId);
                setFavorite(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        favorite,
        loading,
        toggleFavorite,
        refresh: loadStatus,
    };
}