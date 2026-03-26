import { useState } from "react"
import { BASE_URL } from "../App"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

export default function Login() {
    // For Navigation 
    const navigate = useNavigate()

    // useState for form
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")


    // getting login function from useAuth
    const { login } = useAuth()
    // To show errors, if.
    const [error, setError] = useState("")


    // use login function from useAuth to login
    async function handleSubmit(e) {
        e.preventDefault()
        const success = await login(username, password)

        if (success) {
            navigate("/chat")
        } else {
            setError("Invalid Username or Password!")
        }
    }
    return (
        <div className="formContainer">
            <h1>Login</h1>
            {error && <span className="errorMessage">{error}</span>}
            <form onSubmit={handleSubmit} className="loginForm">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <span className="authLink">Don't have an account? <Link to="/register" className="linkTag">Register</Link></span>
                <button type="submit" >Login</button>
            </form>
        </div>
    )
}