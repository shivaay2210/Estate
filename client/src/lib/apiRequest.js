import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://estate-backend2.onrender.com/api",
    withCredentials: true
})

export default apiRequest
