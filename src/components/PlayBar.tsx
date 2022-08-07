//音乐播放条组件
import styles from "../components/style/index.module.css"
import {
    StepBackwardOutlined,
    StepForwardOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    EllipsisOutlined,
    SoundFilled,
} from "@ant-design/icons"
import { Dropdown, Menu, Slider } from 'antd';
import { transTime } from "../utils/help"
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
const PlayBar = (props: { song: Music.song }) => {
    const [song, setSong] = React.useState<Music.song>(props.song);
    const playBar: any = React.useRef();
    const url = `https://music.163.com/song/media/outer/url?id=${song.id}`;
    //控制是否播放音乐
    const [isPlay, setPlay] = React.useState(true);
    //控制是否显示播放条
    const [showBar, setBar] = React.useState(true);
    //控制音量条是否展示
    const [showSloud, setSloud] = React.useState(false);
    //进度条当前时间
    const [time, setTime] = React.useState(0)
    //音量条大小
    const [voice, setVoice] = React.useState(1);
    //用于判断组件是否需要重新渲染
    if (song !== props.song) {
        setSong(props.song);
        setBar(true);
        setPlay(true);
        setTime(0);
    }
    React.useEffect(() => {
        /*   setTimeout(() => {
              setBar(false);
          }, 2000) */
        isPlay && playBar?.current.play();
        let timer: any;
        playBar.current.addEventListener("play", () => {
            //音乐一旦开始播放，设置音量初始值
            playBar.current.volume=0.4;
            setVoice(Math.floor(playBar.current.volume * 100));
            timer = setInterval(() => {
                setTime(playBar.current.currentTime);
                console.log(playBar.current.currentTime)
            }, 1000)
        })
        return function () {
            clearInterval(timer);
        }
    });
    const getStyle = (type: string) => {
        let arrStyle = type === 'start' ? [styles.playbar] : [styles['playbar-move'], styles['playbar-end']];
        return arrStyle.join(" ");
    }
    // 获取当前进度条事件
    const getCurrentTime = (value: number) => {
        setTime(value);
    }
    // 点击播放或者暂停
    const playMusic = () => {
        setPlay(!isPlay);
        isPlay ? playBar.current.pause() : playBar.current.play();
    }
    //改变音量
    const changeVoice = (value: any) => {
        playBar.current.volume = value * 0.01;
        setVoice(value);
    }
    return <>
        <div className={showBar ? getStyle("start") : getStyle("move")}>
            <div style={{ flex: "1" }}></div>
            {/* preload="auto"表示预加载音频 */}
            <audio ref={playBar} src={url} preload="auto">
            </audio>
            <div className={styles.playmusic}>
                {/* 播放上一首 */}
                <StepBackwardOutlined className={styles['playmusic-div1']} />
                {!isPlay && <PlayCircleOutlined className={styles['playmusic-div2']} onClick={() => { playMusic() }} />}
                {isPlay && <PauseCircleOutlined className={styles['playmusic-div2']} onClick={() => { playMusic() }} />}
                {/* 播放下一首 */}
                <StepForwardOutlined className={styles['playmusic-div3']} />
            </div>
            <div className={styles.coverImg}>
                <img src={song.al?.picUrl} alt="图片无法显示" />
            </div>
            <div className={styles["music-bar"]}>
                {/* 歌曲名称 */}
                <small style={{ marginLeft: "30px" }}>
                    {/* 歌手名称 */}
                    <span>{song.name}</span>
                    {/* 进度条 */}
                    <span style={{ marginLeft: "3vw" }}>
                        {song.ar?.map((per, index) => {
                            if (index === 0)
                                return <span key={index}>{per.name}</span>
                        })}
                    </span>
                </small>
                <span >
                    {/* 其中tipFormatter=null不显示当前进度的刻度 */}
                    <Slider style={{ flex: "1" }} max={song.dt} tipFormatter={null} onChange={getCurrentTime} value={time} />
                    <small>{transTime(time, 2)}/{transTime(song.dt, 2)}</small>
                </span>
            </div>
            <div className={styles['play-method']}>
                {/* 音量调整 */}
                <span className={styles['play-sound']}>
                    {showSloud && <Slider vertical className={styles['play-sound-bar']} onChange={changeVoice} value={voice} />}
                    <SoundFilled className={styles['play-sound-btn']} onClick={() => { setSloud(!showSloud) }} />
                </span>
                {/* 播放方式 */}
                <Dropdown overlay={menu} placement="top" >
                    <EllipsisOutlined />
                </Dropdown>
            </div>
        </div>
    </>
}
export { PlayBar };