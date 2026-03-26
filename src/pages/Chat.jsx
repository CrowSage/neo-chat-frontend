import { useEffect, useState, useRef } from "react"
import { BASE_URL } from "../App"
import { useAuth } from "../context/AuthContext"
import { useChat } from "../hooks/useChat"
import { useNavigate, useParams } from "react-router-dom"
import { useWebSocket } from "../hooks/useWebSocket"
import { useCallback } from "react"


export default function Chat() {




    const navigate = useNavigate()
    const [messageInput, setMessageInput] = useState("")
    const { fetchChats, chats, fetchMessages, messages, setMessages, createDM } = useChat()
    const { chatid } = useParams()
    const { token, userId } = useAuth()
    const bottomRef = useRef(null)
    const [searchInput, setSearchInput] = useState("")
    const [newUsers, setNewUsers] = useState([])



    if (!token) {
        navigate("/login")
    }

    const filteredChat = chats ? chats.filter((chat) => chat.name.toLowerCase().includes(searchInput.toLowerCase())) : []

    async function fetchUser() {


        const response = await fetch(`${BASE_URL}/api/user/search/?q=${searchInput}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })

        const data = await response.json()
        if (response.ok) {
            setNewUsers(data)
        }



    }


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])
    useEffect(() => {
        fetchChats()
        if (chatid) {
            fetchMessages(chatid)
        }
    }, [chatid])


    useEffect(() => {

        if (!searchInput.trim()) {
            setNewUsers([]);
            return;
        }
        const timeout = setTimeout(() => {
            fetchUser()
        }, 500)


        return () => clearTimeout(timeout);
    }, [searchInput])

    const onMessage = useCallback((message) => {
        setMessages(prevMessages => [...prevMessages, message])

        const chatExists = chats.some((chat) => chat.id == chatid)
        fetchChats()
    }, [setMessages])

    const { sendMessage } = useWebSocket(chatid, token, onMessage)



    const colors = [
        "#F44336", "#E91E63", "#9C27B0", "#673AB7",
        "#3F51B5", "#1565C0", "#0277BD", "#00838F",
        "#00695C", "#2E7D32", "#558B2F", "#827717",
        "#6A1B9A", "#EF6C00", "#D84315", "#5D4037",
        "#616161", "#455A64"
    ];

    function getAvatarColor(name) {
        if (!name) return "#555";

        const firstLetter = name[0].toUpperCase();
        const index = firstLetter.charCodeAt(0) - 65; // A=0

        return colors[index % colors.length];
    }
    return (
        <div className={`chatMainContainer ${chatid ? "viewingChat" : ""}`}>
            <div className="chatList">
                <h2>Neo<span style={{ fontWeight: "50" }}>Chat</span></h2>
                <input type="text" placeholder="Search or start a new chat" className="searchInput" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                {filteredChat.length > 0 && filteredChat.map((chat) => (
                    <div className="chatButton" onClick={() => { navigate(`/chat/${chat.id}`) }} key={chat.id} id={chatid && chatid == chat.id ? "active" : ""}>
                        <span className="profilePic" style={{ backgroundColor: getAvatarColor(chat?.name[0]) }}>{chat?.name[0] || "U"}</span>
                        <span>{chat?.name}</span>
                    </div>
                ))}

                {searchInput && <div className="divider">New Users</div>}
                {searchInput && newUsers.map((newUser) => (
                    <div className="chatButton" onClick={async () => {
                        const chat_id = await createDM(newUser?.username)
                        if (chat_id) {
                            navigate(`/chat/${chat_id}`)
                        } else {
                            console.error("Could not create DM chat for user", newUser)
                            alert("Unable to create chat. Please try again or refresh the page.")
                        }
                        setSearchInput("")
                    }} key={newUser.id}>
                        <span className="profilePic" style={{ backgroundColor: getAvatarColor(newUser?.username[0]) }}>{newUser?.username[0] || "U"}</span>
                        <span>{newUser?.username}</span>
                    </div>
                ))}
            </div>
            {chatid && <div className="chatView">
                <div className="chatHeader">
                    <button className="backButton" onClick={() => navigate("/chat")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <span className="profilePic" style={{ backgroundColor: getAvatarColor(chats.find((chat) => chat.id == chatid)?.name[0]) }}>{chats.find((chat) => chat.id == chatid)?.name[0] || ""}</span>
                    <span>{chats.find((chat) => chat.id == chatid)?.name || ""}</span>


                </div>

                <div className="messageContainer">

                    {messages.length > 0 && messages.map((message) => (
                        <span className={message.sender == userId ? "message messageSent" : "message"}>
                            <span key={message.id || message.tempId || Math.random()}>{message.content || message.message || message.text}</span>
                            <span className="messageTimestamp">
                                {new Date(message.timestamp).toLocaleTimeString("en-PK", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                })}
                            </span>
                        </span>
                    ))}
                </div>
                <div ref={bottomRef} />
                <form className="messageForm" onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage({ message: messageInput })
                    setMessageInput("")
                }}>

                    <input type="text" placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} className="messageInput" />
                    <button type="submit"

                        disabled={messageInput === ""}
                    ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFF" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal-icon lucide-send-horizontal"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" /><path d="M6 12h16" /></svg></button>
                </form>
            </div>}
            {!chatid && <div className="defaultChatView">
                <h2 style={{ fontSize: "50px" }}>Neo<span style={{ fontWeight: "50" }}>Chat</span></h2>
                <span style={{ fontSize: "16px", fontWeight: "200", marginTop: "5px" }}>A minimal chat app.</span>
            </div>

            }
        </div>
    )
}