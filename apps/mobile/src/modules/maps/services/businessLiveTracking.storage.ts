import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY = "business_live_tracking_ids";

export async function getActiveTrackingBusinessIds(): Promise<number[]> {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];

        return [...new Set(parsed.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
    } catch {
        return [];
    }
}

export async function saveActiveTrackingBusinessIds(ids: number[]) {
    const uniqueIds = [...new Set(ids)];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueIds));
}

export async function addActiveTrackingBusiness(id: number) {
    const ids = await getActiveTrackingBusinessIds();

    if (!ids.includes(id)) {
        ids.push(id);
    }

    await saveActiveTrackingBusinessIds(ids);
}

export async function removeActiveTrackingBusiness(id: number) {
    const ids = await getActiveTrackingBusinessIds();
    await saveActiveTrackingBusinessIds(ids.filter((businessId) => businessId !== id));
}