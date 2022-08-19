//路由表文件，用于管理所有路由组件
import Home from "../pages/Home"
import PlayList from "../pages/PlayList"
import { Navigate } from "react-router-dom"
import PageNotFound from "../pages/PageNotFound"
import MyMusic from "../pages/MyMusic"
import Artist from "../pages/Artist"
import Login from "../pages/MyMusic/LoginPage"
const routes = [
    {
        path: "/home",
        element: <Home />
    },
    {
        path: "/",
        element: <Navigate to="/home" />
    },
    //我的音乐
    {
        path: "/mymc",
        element: <MyMusic />
    },
    //歌单
    {
        path: "/playlist/:id",
        element: <PlayList />
    },
    //歌手
    {
        path: "/artist",
        element: <Artist />
    },
    //登录页面
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "*",
        element: <PageNotFound />
    }
]
export default routes;