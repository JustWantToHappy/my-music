import React, { Suspense } from 'react'
import { useLocation, useRoutes } from "react-router-dom"
import routes from "../../routes"
import { PlayBar } from "../../components/PlayBar"
import PubSub from "pubsub-js"
const Container = function (props: any) {
    const element = useRoutes(routes);
    const [song, setSong] = React.useState<Music.song>();
    const location = useLocation();
    //播放音乐
    const play = () => {
        if (localStorage.getItem("isPlay")) {
            let obj = JSON.parse(localStorage.getItem("song") as string);
            setSong(obj);
        }
    }
    PubSub.subscribe("play", function (_, data) {
        play();
    })
    React.useEffect(() => {
        //开启一个监听器，如果鼠标从视口底部移出，则显示音乐播放条
        document.addEventListener("mouseleave", (e) => {
            if (e.clientY >= window.innerHeight && location.pathname !== '/mv') {
                PubSub.publish("showPlayBar", true);
            }
        })
    }, []);
    return (
        <div style={{ transform: "translateY(13vh)" }}>
            <Suspense fallback={<h1>loading</h1>}>
                {element}
            </Suspense>
            {localStorage.getItem("isPlay") === 'true' && song && <PlayBar song={song} />}
            {/* 不知道底部信息做不做 */}
        </div>
    )
}
export default Container;