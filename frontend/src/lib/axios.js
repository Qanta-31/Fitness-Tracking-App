import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: "https://fitness-tracking-app-backend-i588.onrender.com/api", 
    withCredentials: true,
})