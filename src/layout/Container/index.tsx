import React, { Suspense } from 'react'
import { useLocation, useRoutes } from "react-router-dom"
import routes from "../../routes"
import { PlayBar } from "../../components/PlayBar"
import { Signal } from "../../mobx/constants";
import playlist from '../../mobx/playlist';
import { observer } from "mobx-react";
import PubSub from "pubsub-js"
const Container = observer(function () {
    const element = useRoutes(routes);
    const [song, setSong] = React.useState<Music.song>();
    const location = useLocation();
    //播放音乐
    PubSub.subscribe(Signal.PlayMusic, function () {
        if (playlist.state&&song!==playlist.song) {
            setSong(playlist.song);
        }
    })
    React.useEffect(() => {
        //开启一个监听器，如果鼠标从视口底部移出，则显示音乐播放条
        document.addEventListener("mouseleave", (e) => {
            if (e.clientY >= window.innerHeight && location.pathname !== '/mv') {
                PubSub.publish(Signal.ShowPlayBar, true);
            }
        })
    }, [location.pathname]);
    return (
        <div style={{ marginTop: "13vh" }}>
            <Suspense fallback={<h1>loading</h1>}>
                {element}
            </Suspense>
            {playlist.song&&<PlayBar/>}
        </div>
    )
});
export default Container;