//路由表文件，用于管理所有路由组件
import Home from "../pages/Home"
import PlayList from "../pages/PlayList"
import { Navigate } from "react-router-dom"
const routes = [
    {
        path: "/home",
        element: <Home />
    },
    {
        path: "/",
        element: <Navigate to="/home" />
    },
    //歌单
    {
        path:"/playlist/:id",
        element:<PlayList/>
    }
]
export default routes;