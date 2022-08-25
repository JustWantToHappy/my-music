import React from 'react'
import { Carousel } from 'antd';
import { getRecommondmv } from "../../api/recommond"
import styles from "./index.module.scss"
import { RecommonList, NewDisc } from "./Recommon"
import MyRecommend from './MyRecommend';
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons"
import { Outlet, useLocation } from "react-router-dom"

export default function Container() {
    let { useEffect, useState } = React;
    const [arr, setArr] = useState<Array<Music.recommomMv>>();
    const { pathname } = useLocation();
    //当页面初始化时调用
    useEffect(() => {
        (async () => {
            const mvs = await getRecommondmv();
            setArr(mvs.data);
        })();
    }, []);
    const onChange = (currentSlide: number) => {
        // console.log(currentSlide);
    };
    return (
        <>
            <Outlet />
            {pathname === '/home' && <div className={styles.container}>
                <DoubleLeftOutlined style={{ color: '#fff', fontSize: "25px" }} />
                <Carousel arrows={true} afterChange={onChange} style={{ width: "75vw" }}>
                    {arr?.map(mv => {
                        return <div key={mv.id}>
                            <img src={mv.cover} alt="图片无法显示" style={{ width: '100%', height: '70vh' }} />
                        </div>
                    })}
                </Carousel>
                <DoubleRightOutlined style={{ color: '#fff', fontSize: "25px" }} />
            </div>}
            {localStorage.getItem("hasLogin") === 'true' && pathname === '/home' && <div className={styles['my-recommon']}>
                <MyRecommend />
            </div>}
            {/* 精选歌单和新碟上架*/}
            {pathname === '/home' && <div className={styles.content}>
                <RecommonList />
                <NewDisc />
            </div>}

        </>
    )
}
