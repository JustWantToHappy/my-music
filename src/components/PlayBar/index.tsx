//音乐播放条组件
import styles from "./index.module.scss"
import fullStyles from "./full_screen.module.scss";
import {
    StepBackwardOutlined,
    StepForwardOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    EllipsisOutlined,
    SoundFilled,
    DownOutlined,
    FullscreenExitOutlined,
    SyncOutlined,
    FullscreenOutlined
} from "@ant-design/icons"
import { Dropdown, Menu, Slider, Tooltip } from 'antd';
import React from "react"
import pubsub from "pubsub-js"
import { transTime } from "../../utils/help"
import { addLocalStorage } from "../../utils/authorization"
import { songStore } from "../../mobx/song"
import { getLyricBySongId } from "../../api/song"
import Lyric from "../Lyric";
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
    //是否展开歌曲播放页面
    const [expend, setExpend] = React.useState(false);
    //获取歌词
    const [lyric, setLyric] = React.useState<string>('');
    const [tlyric, setTlyric] = React.useState<string>('');
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
        pubsub.subscribe("showPlayBar", function (_, data) {
            if (data === true) {
                setBar(true);
            }
        });
    }, [isPlay]);
    //播放条样式获取
    const getStyle = (type: string) => {
        let arrStyle = type === 'start' ? [styles.playbar] : [styles['playbar-move']];
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
    //收起播放条
    const shrink = () => {
        setBar(false);
        setSloud(false);
    }
    //收起全屏
    const shrinkFullScreen = () => {
        setExpend(false);
        setBar(true);
        setSloud(false);
        let bar = myBarRef.current, img = imgRef.current;
        (bar as any).className = styles.playbar;
        (img as any).className = styles.coverImg;
    }
    //展开播放条
    const myBarRef = React.useRef<HTMLDivElement>(null);
    const imgRef = React.useRef<HTMLDivElement>(null);

    const spread = () => {
        setExpend(true);
        setSloud(false);
        let bar = myBarRef.current, img = imgRef.current;
        (bar as any).className = fullStyles.playbar;
        (img as any).className = fullStyles.coverImg;
        
    }
    return <>
        <audio ref={playBar} src={url} preload="auto">
            {/* preload="auto"表示预加载音频 */}
        </audio>
        <div className={showBar ? getStyle("start") : getStyle("move")} ref={myBarRef}>
            {!expend && <div style={{ flex: "1" }} className={styles["hidden-indicate"]}>
                <Tooltip placement="right" title={"展开"} >
                    <FullscreenOutlined onClick={spread} />
                </Tooltip>
                <Tooltip placement="right" title={"收起"} >
                    <DownOutlined onClick={shrink} />
                </Tooltip>
            </div>}
            {!expend && <div className={styles.playmusic} >
                {/*  */}
                {/* 播放上一首 */}
                <StepBackwardOutlined className={styles['playmusic-div1']} onClick={playLast} />
                {!isPlay && <PlayCircleOutlined className={styles['playmusic-div2']} onClick={() => { playMusic() }} />}
                {isPlay && <PauseCircleOutlined className={styles['playmusic-div2']} onClick={() => { playMusic() }} />}
                {/* 播放下一首 */}
                <StepForwardOutlined className={styles['playmusic-div3']} onClick={playNext} />
            </div>}
            <div className={styles.coverImg} ref={imgRef}>
                <img src={song.al?.picUrl} alt="logo" />
            </div>
            {expend && <div className={fullStyles.playmusic}>
                <Tooltip title="还原" placement="bottom">
                    <FullscreenExitOutlined className={fullStyles.shrink} onClick={shrinkFullScreen} />
                </Tooltip>
                <h2>{song.name}</h2>
                <p><>歌手:&nbsp;</>
                    {song.ar?.map((per, index) => {
                        if (index === 0)
                            return <small key={index}>{per.name}</small>
                    })}
                </p>
                <p><>专辑:&nbsp;</><small>{song.al && song.al.name}</small></p>
                <Lyric audioRef={playBar}  id={song.id} />
            </div>}
            {!expend && <div className={styles["music-bar"]} >
                {/* 歌曲名称 */}
                <small >
                    {/* 歌手名称 */}
                    <span>{song.name}</span>
                    {/* 进度条 */}
                    <span >
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
            </div>}
            {!expend && <div className={styles['play-method']}>
                {/* 音量调整 */}
                <span className={styles['play-sound']}>
                    {showSloud && <Slider vertical className={styles['play-sound-bar']} onChange={changeVoice} value={voice} />}
                    <SoundFilled className={styles['play-sound-btn']} onClick={() => { setSloud(!showSloud) }} />
                </span>
                {/* 播放方式 */}
                <Dropdown overlay={menu} placement="top" >
                    <EllipsisOutlined />
                </Dropdown>
            </div>}
            {expend && <div className={fullStyles['music-bar']}>
                <div>
                    <Slider min={0} max={song.dt} tipFormatter={null} step={song.dt / 1000} onChange={getCurrentTime} onAfterChange={changeCurrentTime} value={time} />
                </div>
                <div>
                    <small>{transTime(time, 2)}/{transTime(song.dt, 2)}</small>
                    <span>
                        <StepBackwardOutlined onClick={playLast} />
                        {!isPlay && <PlayCircleOutlined onClick={() => { playMusic() }} />}
                        {isPlay && <PauseCircleOutlined onClick={() => { playMusic() }} />}
                        <StepForwardOutlined onClick={playNext} />
                    </span>
                    <i>
                        <Dropdown overlay={menu} placement="top" >
                            <SyncOutlined />
                        </Dropdown>
                    </i>
                    <p>
                        {showSloud && <Slider vertical onChange={changeVoice} value={voice} className={fullStyles.soundBar} />}
                        <SoundFilled onClick={() => { setSloud(!showSloud) }} />
                    </p>
                </div>
            </div>}
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