import React from 'react'
import { Carousel } from 'antd';
import { getRecommondmv } from "../../api/recommond"
import styles from "./index.module.scss"
import { RecommonList, NewDisc } from "./Recommon"
import MyRecommend from './MyRecommend';
import { Outlet, useLocation } from "react-router-dom"
import PubSub from 'pubsub-js';
export default function Container() {
    let { useEffect, useState } = React;
    const [arr, setArr] = useState<Array<Music.recommomMv>>();
    const { pathname } = useLocation();
    //当登录后显示个人推荐
    const [hasLogin, setHasLogin] = useState(false);
    //当页面初始化时调用
    useEffect(() => {
        (async () => {
            const mvs = await getRecommondmv();
            setArr(mvs.data);
        })();
        PubSub.subscribe("showRecommend", (_, show: boolean) => {
            setHasLogin(show);
        })
        localStorage.getItem("hasLogin") === 'true' && setHasLogin(true);
    }, []);
    return (
        <>
            <Outlet />
            {pathname === '/home' && <div className={styles.container}>
                <Carousel
                    style={{ height: '100%', width: '100vw'}}
                    autoplay>
                    {arr?.map(mv => {
                        return <img src={mv.cover} className={styles.carousel} alt={mv.name} />
                    })}
                </Carousel>
            </div>}
            {hasLogin && pathname === '/home' && <div className={styles['my-recommon']}>
                <MyRecommend />
            </div>}
            {/* 精选歌单*/}
            {pathname === '/home' && <RecommonList />}
            {/* 新碟上架*/}
            {pathname === '/home' && <NewDisc />}
        </>
    )
}
