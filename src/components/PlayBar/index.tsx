//音乐播放条组件
import styles from "./index.module.scss"
import {
    StepBackwardOutlined,
    StepForwardOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    SoundFilled,
    DownOutlined,
    PlusSquareOutlined,
    // <LockOutlined />
    // <UnlockOutlined />
} from "@ant-design/icons"
import PlayListIcon from "../../assets/logo/playlist.svg";
import {
    message,
    Slider,
    Tooltip
} from 'antd';
import React from "react"
import { transTime } from "../../utils/help"
import { addLocalStorage } from "../../utils/authorization"
import PlayBarReducer, { PlayBarAction } from "../../reducers/playBar";
import CollectModal from "../CollectModal";
import PlayList from "../PlayList";
import { observer } from "mobx-react";
import playlist from "../../mobx/playlist";
export interface PlayBarType {
    showBar: boolean; //控制是否显示播放条
    showSloud: boolean;//控制音量条是否展示
    voice: number; //音量条大小
    collect: boolean; //是否显示收藏音乐模态框
}
const PlayBar = observer(() => {
    const playBar: any = React.useRef();
    const { song, isShow, state } = playlist;
    const url = `https://music.163.com/song/media/outer/url?id=${song.id}`;
    const initPlayBar: PlayBarType = {
        showBar: true,
        showSloud: false,
        voice: 1,
        collect: false,
    }
    const [time, setTime] = React.useState(0);
    const [playBarState, dispatch] = React.useReducer(PlayBarReducer, initPlayBar);
    const { showBar, showSloud, voice, collect } = playBarState;

    const loadingStart = () => {
        playlist.changeState(false);
    }
    const playMusic = () => {
        playlist.changeState(true);
        const promise = playBar.current.play();
        promise.catch((err: any) => {
            console.info(err);
            message.info({ content: "此歌曲暂无版权", duration: 2 });
        })
    }
    // 当播放新的歌曲的时调用
    React.useEffect(() => {
        playBar.current.addEventListener("loadstart", loadingStart);
        playBar.current.addEventListener("canplaythrough", playMusic);
    }, [state, song]);
    const handleClik = function (e: MouseEvent) {
        dispatch({ type: PlayBarAction.Change, args: { showSloud: false } });
        playlist.isShow = false;
    }
    React.useEffect(() => {
        window.addEventListener("click", handleClik);
        return function () {
            window.removeEventListener("click", handleClik);
        }
    }, []);
    //播放条样式获取
    const getStyle = (type: string) => {
        let arrStyle = type === 'start' ? [styles.playbar] : [styles['playbar-move']];
        return arrStyle.join(" ");
    }
    // 获取当前进度条事件
    const getCurrentTime = (value: number) => {
        dispatch({ type: PlayBarAction.Change, args: { time: value } });
    }
    //当拉取进度条之后触发，设置当前播放时间
    const changeCurrentTime = (value: number) => {
        playBar.current.currentTime = value / 1000;

        /*   playBar.current.currentTime = value / 1000;
          songStore.timer = setInterval(() => {
              setTime(playBar.current.currentTime * 1000);
          }, 1000); */
    }
    // 点击播放或者暂停
    const playPuase = async () => {
        playlist.changeState();
        state ? playBar.current.pause() : playBar.current.play();
    }
    //播放上一首音乐
    const playPrevSong = () => {
        playlist.playPrevSong()
    }
    //播放下一首音乐
    const playNextSong = () => {
        playlist.playNextSong(true);
    }
    //展示隐藏音量条
    const clickSloud = () => {
        dispatch({ type: PlayBarAction.Change, args: { showSloud: !showSloud } });
    }
    //改变音量
    const changeVoice = (value: any) => {
        playBar.current.volume = value * 0.01;
        dispatch({ type: PlayBarAction.Change, args: { voice: value } });
        addLocalStorage([{ key: "volume", value: playBar.current.volume }]);
    }
    //收起播放条
    const shrink = () => {
        // dispatch({ type: PlayBarAction.Change, args: {  } })
    }

    return <>
        <audio ref={playBar} src={url} preload="auto">
            {/* preload="auto"表示预加载音频 */}
        </audio>
        {collect && <CollectModal close={() => { }} songId={song.id} />}
        <div className={showBar ? getStyle("start") : getStyle("move")} onClick={e => e.stopPropagation()}>
            {isShow && <PlayList />}
            <div style={{ flex: "1" }} className={styles["hidden-indicate"]}>
                <Tooltip placement="right" title={"收起"} >
                    <DownOutlined onClick={shrink} />
                </Tooltip>
                <Tooltip placement="right" title='收藏'>
                    <PlusSquareOutlined />
                </Tooltip>
            </div>
            <div className={styles.playmusic} >
                {/* 播放上一首 */}
                <StepBackwardOutlined className={styles['playmusic-div1']} onClick={playPrevSong} />
                {!state && <PlayCircleOutlined className={styles['playmusic-div2']} onClick={playPuase} />}
                {state && <PauseCircleOutlined className={styles['playmusic-div2']} onClick={playPuase} />}
                {/* 播放下一首 */}
                <StepForwardOutlined className={styles['playmusic-div3']} onClick={playNextSong} />
            </div>
            <div className={styles.coverImg} >
                <img src={song.al?.picUrl} alt="logo" />
            </div>
            <ul className={styles["music-bar"]} >
                <li >
                    {/* 其中tipFormatter=null不显示当前进度的刻度 */}
                    <Slider min={0} max={song.dt} tipFormatter={null} step={song.dt / 1000} onChange={getCurrentTime} onAfterChange={changeCurrentTime} value={time} />
                    <small>{transTime(time, 2)}/{transTime(song.dt, 2)}{playlist.time}</small>
                </li>
                <li>
                    <div>
                        {/* 歌曲名称 */}
                        <span>{song.name}&nbsp;&nbsp;</span>
                        {/* 歌手名称 */}
                        <span >{song.ar && song?.ar[0].name}</span>
                    </div>
                </li>
            </ul>
            <div className={styles['play-method']}>
                {/* 音量调整 */}
                <span className={styles['play-sound']}>
                    <SoundFilled className={styles['play-sound-btn']} onClick={clickSloud} />
                    {showSloud && <div className={styles['play-sound-container']}>
                        <Slider vertical className={styles['play-sound-bar']} onChange={changeVoice} value={voice} />
                    </div>}
                </span>
                {/* 播放方式 */}
                <img src={playlist.way.icon} alt="logo" title={playlist.way.desc} onClick={() => { playlist.changePlayWay() }} />
                {/* 播放队列 */}
                <div onClick={() => playlist.isShow = !playlist.isShow}>
                    <img src={PlayListIcon} alt="logo" title="播放列表" />
                    <span>&nbsp;{playlist.size}</span>
                </div>
            </div>
        </div>
    </>
});
export default PlayBar;