import { useEffect, useRef } from "react"
import { WS_BASE_URL } from "../App"
import { useAuth } from "../context/AuthContext"

export function useWebSocket(chatId, token, onMessage) {
    const socketRef = useRef(null)

    useEffect(() => {
        if (!chatId || !token) return


        // Connect the socket
        const socket = new WebSocket(`${WS_BASE_URL}/ws/chat/${chatId}/?token=${token}`)

        // setting socketRef to this socket
        socketRef.current = socket

        // Open
        socket.onopen = () => {
            console.log("Websocket connected!")
        }

        // Close
        socket.onclose = () => {
            console.log("Websocket disconnected!")
        }

        // Message
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (onMessage) {
                onMessage(data)
            }
        }

        // Error
        socket.onerror = (error) => {
            console.error("WebSocket error:", error)
        }

        // Cleanup when component unmont or chatId changes
        return () => {
            socket.close()
        }

    }, [chatId, token])

    function sendMessage(message) {
        if (socketRef.current && socketRef.current.readyState == WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message))
        } else {
            console.warn("Socket not connected")
        }
    }

    return { sendMessage }
}