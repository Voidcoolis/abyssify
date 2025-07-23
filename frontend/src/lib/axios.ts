import axios from "axios";

export const axiosInstance = axios.create({
    // make it dynamic in development and production
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
    withCredentials: true,
    // the baseUrl is the server of the backend
});
