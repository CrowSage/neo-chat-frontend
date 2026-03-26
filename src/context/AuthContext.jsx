import { createContext, useContext, useState } from "react";
import { BASE_URL } from "../App";
import { useNavigate } from "react-router-dom";



const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null)
    const [userId, setUserId] = useState(token ? JSON.parse(atob(token.split('.')[1])).user_id : null)



    async function login(username, password) {
        const response = await fetch(`${BASE_URL}/api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })

        if (response.ok) {
            const data = await response.json()
            setToken(data.access)
            localStorage.setItem("token", data.access)
            localStorage.setItem("refreshToken", data.refresh)


            const payload = JSON.parse(atob(data.access.split('.')[1]))
            setUserId(payload.user_id)

            return true
        }

        return false
    }

    function logout() {
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
    }


    async function refreshAccessToken() {

        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) return false


        const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken })
        })

        if (response.ok) {
            const data = await response.json()

            setToken(data.access)
            localStorage.setItem("token", data.access)
            return true
        }

        return false
    }


    async function authFetch(url, options = {}) {

        const accessToken = token || localStorage.getItem("token")

        const config = {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: accessToken ? `Bearer ${accessToken}` : ""
            },
        }

        let response = await fetch(url, config)

        if (response.status === 401) {

            const refreshed = await refreshAccessToken()

            if (refreshed) {
                const newToken = localStorage.getItem("token")

                const retryConfig = {
                    ...options,
                    headers: {
                        ...(options.headers || {}),
                        Authorization: `Bearer ${newToken}`,
                    },
                }

                response = await fetch(url, retryConfig)
            } else {
                logout
            }
        }

        return response
    }

    return (
        <AuthContext.Provider value={{ login, logout, refreshAccessToken, token, userId, authFetch }}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {
    return useContext(AuthContext)
}