import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Search from "./pages/Search"
import Chat from "./pages/Chat"


export const BASE_URL = "https://web-production-d2f1fe.up.railway.app"
export const WS_BASE_URL = "wss://web-production-d2f1fe.up.railway.app";


export default function App() {


  const routers = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/search", element: <Search /> },
    { path: "/chat", element: <Chat /> },
    { path: "/chat/:chatid", element: <Chat /> },
  ])

  return (
    <RouterProvider router={routers} />
  )
}