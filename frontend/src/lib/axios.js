import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "https://fitness-tracking-app-backend-i588.onrender.com/api", 
    withCredentials: true,
})