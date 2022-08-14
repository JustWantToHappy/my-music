import React from 'react'
import { useRoutes } from "react-router-dom"
import routes from "../../routes"
import { PlayBar } from "../../components/PlayBar"
import pubsub from "pubsub-js"
const Container = function () {
    const element = useRoutes(routes);
    const [song, setSong] = React.useState<Music.song>();
    //播放音乐
    const play = async () => {
        if (localStorage.getItem("isPlay")) {
            let obj = JSON.parse(localStorage.getItem("song") as string);
            setSong(obj);
        }
    }
    pubsub.subscribe("play", function (_, data) {
        play();
    })
    React.useEffect(() => {
        //开启一个监听器，如果鼠标从视口底部移出，则显示音乐播放条
        document.addEventListener("mouseleave", (e) => {
            if (e.clientY >= window.innerHeight) {
                pubsub.publish("showPlayBar", true);
            }
        })
    }, []);
    return (
        <div>
            {element}
            {localStorage.getItem("isPlay") === 'true' && song && <PlayBar song={song} />}
            {/* 不知道底部信息做不做 */}
        </div>
    )
}
export default Container;