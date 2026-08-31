import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn(
    "EXPO_PUBLIC_API_URL is not defined."
  );
}

console.log("API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      "API REQUEST:",
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );

    return config;
  },
  error => {
    console.log("API REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(
      "API RESPONSE:",
      response.status,
      response.config.url
    );

    return response;
  },
  error => {
    console.log(
      "API RESPONSE ERROR:",
      error?.response?.status,
      error?.response?.data ?? error.message
    );

    return Promise.reject(error);
  }
);

export default api;