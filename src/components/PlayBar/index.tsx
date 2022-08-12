//音乐播放条组件
import styles from "./index.module.css"
import {
    StepBackwardOutlined,
    StepForwardOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    EllipsisOutlined,
    SoundFilled,
    DownOutlined
} from "@ant-design/icons"
import { Dropdown, Menu, Slider, Tooltip } from 'antd';
import React from "react"
import pubsub from "pubsub-js"
import { transTime } from "../../utils/help"
import { addLocalStorage } from "../../utils/authorization"
import { songStore } from "../../mobx/song"
const PlayBar = (props: { song: Music.song }) => {
    const playBar: any = React.useRef();
    //控制歌曲切换
    const [song, setSong] = React.useState<Music.song>(props.song);
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
    //用于判断组件是否需要重新渲染,播放新的歌曲
    if (song !== props.song) {
        setSong(props.song);
        setBar(true);
        setPlay(true);
    }

    // 当播放新的歌曲的时调用
    React.useEffect(() => {
        songStore.clearTimer();
        songStore.timer = null;
        playBar?.current.play();
        setTime(0);
        playBar.current.addEventListener("play", () => {
            //音乐一旦开始播放，设置音量初始值
            if (localStorage.getItem("volume")) {
                playBar.current.volume = parseFloat(localStorage.getItem("volume") as string);
            } else {
                playBar.current.volume = 0.4;
            }
            setVoice(Math.floor(playBar.current.volume * 100));
            songStore.clearTimer();
            songStore.timer = null;
            songStore.timer = setInterval(() => {
                setTime(playBar.current.currentTime * 1000);
            }, 1000);
        })
        playBar.current.addEventListener("ended", () => {
            let playway = localStorage.getItem("playway");
            clearInterval(songStore.timer);
            //1列表播放2顺序播放3单曲循环4随机播放
            switch (playway) {
                case '1':
                    pubsub.publish("playway", "1");
                    break;
                case '2':
                    pubsub.publish("playway", "2");
                    pubsub.subscribe("stopPlay", function (_, data) {
                        setPlay(false);
                    })
                    break;
                case '3':
                    pubsub.publish("play", "");
                    break;
                case '4':
                    pubsub.publish("playway", "4");
                    break;
                default:
                    break;

            }
        })
        return function () {
            songStore.clearTimer();
            songStore.timer = null;
        }
    }, [song]);
    React.useEffect(() => {
        if (!isPlay) {
            songStore.clearTimer();
            songStore.timer = null;
        }
    }, [isPlay]);
    //播放条样式获取
    const getStyle = (type: string) => {
        let arrStyle = type === 'start' ? [styles.playbar] : [styles['playbar-move'], styles['playbar-end']];
        return arrStyle.join(" ");
    }
    // 获取当前进度条事件
    const getCurrentTime = (value: number) => {
        songStore.clearTimer();
        songStore.timer = null;
        setTime(value);
    }
    //当拉取进度条之后触发，设置当前播放时间
    const changeCurrentTime = (value: number) => {
        playBar.current.currentTime = value / 1000;
        songStore.timer = setInterval(() => {
            setTime(playBar.current.currentTime * 1000);
        }, 1000);
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
        addLocalStorage([{ key: "volume", value: playBar.current.volume }]);
    }
    //播放上一首音乐
    const playLast = () => {
        pubsub.publish("changeMusic", "last");
    }
    //播放下一首音乐
    const playNext = () => {
        pubsub.publish("changeMusic", "next");
    }
    return <>
        <div className={showBar ? getStyle("start") : getStyle("move")}>
            <div style={{ flex: "1" }} className={styles["hidden-indicate"]}>
                <Tooltip placement="top" title={"收起"} >
                    <DownOutlined />
                </Tooltip>
            </div>
            {/* preload="auto"表示预加载音频 */}
            <audio ref={playBar} src={url} preload="auto">
            </audio>
            <div className={styles.playmusic}>
                {/* 播放上一首 */}
                <StepBackwardOutlined className={styles['playmusic-div1']} onClick={playLast} />
                {!isPlay && <PlayCircleOutlined className={styles['playmusic-div2']} onClick={() => { playMusic() }} />}
                {isPlay && <PauseCircleOutlined className={styles['playmusic-div2']} onClick={() => { playMusic() }} />}
                {/* 播放下一首 */}
                <StepForwardOutlined className={styles['playmusic-div3']} onClick={playNext} />
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
                    <Slider style={{ flex: "1" }} min={0} max={song.dt} tipFormatter={null} step={song.dt / 1000} onChange={getCurrentTime} onAfterChange={changeCurrentTime} value={time} />
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
const menu = () => {
    //默认时列表播放
    let playWay = localStorage.getItem("playway") || '1';
    const getPlayWay = (event: any) => {
        addLocalStorage([{ key: "playway", value: event.key }]);
    }
    return <Menu
        // 使用selectable和defaultSelectedKeys属性让下拉菜单给定一个默认选项高亮
        selectable
        defaultSelectedKeys={[playWay]}
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
                    <span>顺序播放</span>
                ),
            },
            {
                key: '3',
                label: (
                    <span>单曲循环</span>
                ),
            },
            {
                key: "4",
                label: (
                    <span>随机播放</span>
                )
            }
        ]}
        onSelect={getPlayWay}
    />
};
export { PlayBar };