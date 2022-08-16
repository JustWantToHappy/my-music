import React from 'react'
import { Carousel } from 'antd';
import { getRecommondmv } from "../../api/recommond"
import styles from "./index.module.css"
import { RecommonList, NewDisc } from "./Recommon"
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons"

export default function Container() {
    let { useEffect, useState } = React;
    const [arr, setArr] = useState<Array<Music.recommomMv>>();
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
            <div className={styles.container}>
                <DoubleLeftOutlined style={{ color: '#fff', fontSize: "25px" }} />
                <Carousel arrows={true} afterChange={onChange} style={{ width: "75vw" }}>
                    {arr?.map(mv => {
                        return <div key={mv.id}>
                            <img src={mv.cover} alt="图片无法显示" style={{ width: '100%', height: '70vh' }} />
                        </div>
                    })}
                </Carousel>
                <DoubleRightOutlined style={{ color: '#fff', fontSize: "25px" }} />
            </div>
            {/* 精选歌单和 */}
            <div className={styles.content}>
                <RecommonList />
                <NewDisc />
            </div>
        </>
    )
}
