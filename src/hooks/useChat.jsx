import { useState } from "react"
import { BASE_URL } from "../App"
import { useAuth } from "../context/AuthContext"


export function useChat() {
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const { token, authFetch } = useAuth()

    async function fetchChats() {
        const response = await authFetch(`${BASE_URL}/api/chats/`, {
            method: "GET",
        })

        const data = await response.json()
        setChats(data || [])
    }


    async function createDM(other_user) {
        const response = await authFetch(`${BASE_URL}/api/create/dm/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ other_user: other_user })
        })

        const data = await response.json()
        if (response.ok) {
            return data.chat_id
        }
    }


    async function fetchMessages(chatId) {

        const response = await authFetch(`${BASE_URL}/api/chat/${chatId}`, {
            method: "GET",
        })

        if (response.ok) {
            const data = await response.json()
            setMessages(data)
            return true
        } else {
            setMessages([])
            return false
        }

    }
    return { fetchChats, chats, setChats, fetchMessages, messages, setMessages, createDM }
}