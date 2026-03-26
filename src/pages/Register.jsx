import { useState } from "react"
import { BASE_URL } from "../App"
import { useNavigate, Link } from "react-router-dom"

export default function Register() {

    // For Navigation 
    const navigate = useNavigate()

    // useState for form
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // To show errors, if.
    const [error, setError] = useState("")


    // Do what it says
    async function handleSubmit(e) {
        e.preventDefault()

        // Checking if both password are same
        if (password !== confirmPassword) {
            setError("Password Don't Match!")
            return
        }

        // Sending registration request to server if both password are same
        const response = await fetch(`${BASE_URL}/api/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        })

        // turning response into json
        const data = await response.json()


        // Sending to login page if registration was successful or showing error if not
        if (response.ok) {
            navigate("/login")
        } else {
            setError(data.error || "Registration Failed!")
        }
    }
    return (
        <div className="formContainer">
            <h1>Register</h1>
            {error && <span className="errorMessage">{error}</span>}
            <form onSubmit={handleSubmit} className="registerForm">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <span className="authLink">Already have an account? <Link to="/login" className="linkTag">Login</Link></span>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}