//路由表文件，用于管理所有路由组件
import Home from "../pages/Home"
import PlayList from "../pages/PlayList"
import { Navigate } from "react-router-dom"
import PageNotFound from "../pages/PageNotFound"
import MyMusic from "../pages/MyMusic"
import Artist from "../pages/Artist"
import Login from "../pages/MyMusic/LoginPage"
import SongList from "../pages/MyMusic/SongList"
import EditSongList from "../pages/MyMusic/EditSongList"
import DailySongsRecommend from "../pages/Home/DailyRecommendSongs"
import AllPlayList from "../pages/AllPlayList"
import Album from "../pages/Album"
import Rank from "../pages/Rank"
const routes = [
    {
        path: "/home",
        element: <Home />,
        children: [
            {
                //所有歌单
                path: "allplaylist",
                element: <AllPlayList />
            },
            {
                //个人推荐歌曲页面
                path: "dailyrecommend",
                element: <DailySongsRecommend />
            },
            //专辑
            {
                path: "album",
                element: <Album />
            }
        ]
    },
    {
        path: "/",
        element: <Navigate to="/home" />
    },
    //我的音乐
    {
        path: "/mymc",
        element: <MyMusic />,
        children: [
            {
                path: "mysonglist",
                element: <SongList />
            },
            {
                path: "editsonglist",
                element: <EditSongList />
            }
        ]
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
    //排行榜
    {
        path: "/rank",
        element: <Rank />
    },
    {
        path: "*",
        element: <PageNotFound />
    }
]
export default routes;