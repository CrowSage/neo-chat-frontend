import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate()



    return (
        <div className="mainHomeContainer">

            <h1>Neo<span style={{ fontWeight: "100" }}>Chat</span></h1>
            <p>A minimal chat app made using django rest framework and react.</p>

            <span className="authButtons">
                <button onClick={() => navigate("/register")}>Create Account</button>
            </span>


            <div className="design">

            </div>
        </div>
    )
}