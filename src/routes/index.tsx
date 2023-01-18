//路由表文件，用于管理所有路由组件
import PlayList from "../pages/PlayList"
import { Navigate } from "react-router-dom"
import { lazy } from "react"
import PageNotFound from "../pages/PageNotFound"
import Video from "../components/Video"
const Home = lazy(() => import("../pages/Home"))
const Rank=lazy(()=>import("../pages/Rank"))
const Album=lazy(()=>import("../pages/Album"))
const MyMusic=lazy(()=>import("../pages/MyMusic"))
const SearchPage=lazy(()=>import("../pages/Search"))
const Login=lazy(()=>import ("../pages/MyMusic/LoginPage"))
const AllPlayList = lazy(() => import("../pages/AllPlayList"))
const DailySongsRecommend=lazy(()=>import("../pages/Home/DailyRecommendSongs"))
const Artist=lazy(()=>import("../pages/Artist"))
const SongList=lazy(()=>import("../pages/MyMusic/SongList"))
const EditSongList=lazy(()=>import("../pages/MyMusic/EditSongList"))

interface Router {
    name?: string;
    path: string;
    children?: Array<Router>;
    element: any;
}
const routes: Array<Router> = [
    {
        path: "/home",
        element:<Home/>,
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
    //搜索
    {
        path: "/search",
        element: <SearchPage />
    },
    //mv
    {
        path: "/mv",
        element: <Video />
    },
    {
        path: "*",
        element: <PageNotFound />
    }
]
export default routes;