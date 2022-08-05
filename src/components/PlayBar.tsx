//音乐播放条组件
import styles from "../components/style/index.module.css"
import {
    StepBackwardOutlined,
    StepForwardOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    EllipsisOutlined,
    SoundFilled
} from "@ant-design/icons"
import { Progress, Dropdown, Menu, Slider } from 'antd';
import React from "react"
const menu = (
    <Menu
        // 使用selectable和defaultSelectedKeys属性让下拉菜单给定一个默认选项高亮
        selectable
        defaultSelectedKeys={['1']}
        items={[
            {
                key: '1',
                label: (
                    <span>列表播放</span>
                ),
            },
            {
                key: '2',
                label: (
                    <span>循环播放</span>
                ),
            },
            {
                key: '3',
                label: (
                    <span>单曲循环</span>
                ),
            },
        ]}
    />
);
const PlayBar = (props: { id: number }) => {
    const playBar: any = React.useRef();
    let { id } = props;
    const url = `https://music.163.com/song/media/outer/url?id=33894312`;
    const [isPlay, setPlay] = React.useState(false);
    //控制音量条是否展示
    const [showSloud, setSloud] = React.useState(false);
    return <div className={styles.playbar}>
        <div style={{ flex: "1" }}></div>
        <audio ref={playBar} >
            <source src={url} type="audio/mp3" />
        </audio>
        <div className={styles.playmusic}>
            {/* 播放上一首 */}
            <StepBackwardOutlined className={styles['playmusic-div1']} />
            {!isPlay && <PlayCircleOutlined className={styles['playmusic-div2']} onClick={() => setPlay(!isPlay)} />}
            {isPlay && <PauseCircleOutlined className={styles['playmusic-div2']} onClick={() => { setPlay(!isPlay) }} />}
            {/* 播放下一首 */}
            <StepForwardOutlined className={styles['playmusic-div3']} />
        </div>
        <img src="" alt="图片无法显示" />
        <div className={styles["music-bar"]}>
            <small>歌曲名称</small>
            {/* 进度条 */}
            <span >
                {/* <Progress percent={0} showInfo={false} strokeColor={"#F53F3F"} style={{ flex: "1" }} /> */}
                <Slider style={{ flex: "1" }} />
                <small>歌曲总时长</small>
            </span>
        </div>
        <div className={styles['play-method']}>
            {/* 音量调整 */}
            <span className={styles['play-sound']}>
                {showSloud && <Slider vertical className={styles['play-sound-bar']} />}
                <SoundFilled className={styles['play-sound-btn']} onClick={() => { setSloud(!showSloud) }} />
            </span>
            {/* 播放方式 */}
            <Dropdown overlay={menu} placement="top" >
                <EllipsisOutlined />
            </Dropdown>
        </div>
    </div>
}
export { PlayBar };