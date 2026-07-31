import { useCallback, useEffect, useState, } from "react";
import { Business } from "@/modules/customer/types/Business";
import { BusinessDetail } from "@/modules/business/types/BusinessDetail";

import {
    getMyBusinesses,
    getBusiness,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    updateBusinessStatus,
} from "../services/business.service";

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

    const find = async (id: number): Promise<BusinessDetail> => {
        return await getBusiness(id);
    };

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

    const updateStatus = async (id: number, status: "open" | "closed") => {
        const updated = await updateBusinessStatus(id, status);
        await reload();
        return updated;
    };

    const remove = async (id: number) => {
        try {
            console.log("Deleting business:", id);
            await deleteBusiness(id);
            console.log("Delete successful");
            await reload();
        } catch (error) {
            console.log("Delete error:", error);
        }
    };

    return {
        business,
        loading,
        reload,
        create,
        update,
        updateStatus,
        remove,
        find,
    };
}