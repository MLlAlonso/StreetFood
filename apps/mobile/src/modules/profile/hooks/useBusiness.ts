import { useCallback, useEffect, useState, } from "react";
import { getMyBusinesses, createBusiness, updateBusiness, deleteBusiness, } from "../services/business.service";
import { Business } from "@/modules/customer/types/Business";

export function useBusiness() {
    const [business, setBusiness,] = useState<Business[]>([]);
    const [loading, setLoading,] = useState(true);

    const reload = useCallback(
        async () => {
            try {
                const data = await getMyBusinesses();
                setBusiness(data);
            }
            finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => { reload(); }, [reload]);

    const create = async (data: any) => {
        const created = await createBusiness(data);
        await reload();
        return created;
    };

    const update = async (id: number, data: any) => {
        const updated = await updateBusiness(id, data);
        await reload();
        return updated;
    };

    const remove = async (id: number) => {
        await deleteBusiness(id);
        await reload();
    };

    return {
        business,
        loading,
        reload,
        create,
        update,
        remove,
    };
}