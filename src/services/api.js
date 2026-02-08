import axios from "axios"
import { logout } from "../utils/auth"

const api = axios.create({
    baseURL: "https://smart-id-backend-x3ug.onrender.com/api", // change later
    timeout: 10000,
})

// REQUEST INTERCEPTOR → attach JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR → handle expiry / unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 ||
                error.response.status === 403)
        ) {
            logout()
            alert("Session expired. Please login again.")
            // Using window.location.reload() to force a reset to login state
            window.location.reload()
        }

        return Promise.reject(error)
    }
)

export default api
