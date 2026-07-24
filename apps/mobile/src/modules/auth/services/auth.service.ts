import api from "@/services/api/api";

export async function logout() {
    return api.post("/auth/logout");
}