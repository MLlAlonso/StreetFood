import AsyncStorage
    from "@react-native-async-storage/async-storage";

export async function getStoredUser() {
    const user = await AsyncStorage.getItem("user");

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}

export async function getStoredToken() {
    return AsyncStorage.getItem(
        "token"
    );
}

export async function isAuthenticated() {
    const token = await getStoredToken();
    return !!token;
}