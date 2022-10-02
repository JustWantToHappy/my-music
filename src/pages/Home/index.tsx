import React from 'react'
import { Carousel } from 'antd';
import { getRecommondmv } from "../../api/recommond"
import styles from "./index.module.scss"
import { RecommonList, NewDisc } from "./Recommon"
import MyRecommend from './MyRecommend';
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons"
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
    const onChange = (currentSlide: number) => {

    };
    return (
        <>
            <Outlet />
            {pathname === '/home' && <div className={styles.container}>
                <DoubleLeftOutlined style={{ color: '#fff', fontSize: "25px" }} />
                <Carousel arrows={true} afterChange={onChange} style={{ width: "75vw" }} autoplay>
                    {arr?.map(mv => {
                        return <div key={mv.id}>
                            <img src={mv.cover} alt="图片无法显示" style={{ width: '100%', height: '70vh' }} />
                        </div>
                    })}
                </Carousel>
                <DoubleRightOutlined style={{ color: '#fff', fontSize: "25px" }} />
            </div>}
            {hasLogin && pathname === '/home' && <div className={styles['my-recommon']}>
                <MyRecommend />
            </div>}
            {/* 精选歌单*/}
            {pathname === '/home' && <RecommonList />}
            {/* 新碟上架*/}
            {pathname==='/home'&&<NewDisc/>}
        </>
    )
}
