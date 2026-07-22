import { useCallback, useEffect, useState } from "react";
import { getProfile, updateProfile, } from "../services/profile.service";
import { Profile } from "../types/Profile";

export function useProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async () => {
        try {
            const data = await getProfile();
            setProfile(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const saveProfile = async (values: Partial<Profile>) => {
        const updated = await updateProfile(values);
        setProfile(updated);
        return updated;
    };

    return {
        profile,
        loading,
        reload: loadProfile,
        saveProfile,
    };
}