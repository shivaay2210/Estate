import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://localhost:8000/api/",
    withCredentials: true
})

export default apiRequest
