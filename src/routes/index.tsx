//路由表文件，用于管理所有路由组件
import Home from "../pages/Home"
import PlayList from "../pages/PlayList"
import { Navigate } from "react-router-dom"
import PageNotFound from "../pages/PageNotFound"
import MyMusic from "../pages/MyMusic"
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
    },
    //我的音乐
    {
        path:"/mymc",
        element:<MyMusic/>
    },
    {
        path:"*",
        element:<PageNotFound/>
    }
]
export default routes;