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
import CollectModal from "../CollectModal";
import PlayList from "../PlayList";
import { observer } from "mobx-react";
import playlist from "../../mobx/playlist";
import playcontroller from "../../mobx/playcontroller";
const PlayBar = observer(() => {
    const playBar: any = React.useRef();
    const { song, isShow, size, way } = playlist;
    const { state, time, voice, showSloud, collect, showBar, isPlay } = playcontroller;
    const url = `https://music.163.com/song/media/outer/url?id=${song.id}`;
    const loadingStart = () => {
        playcontroller.changeState(false);
    }
    const musicIsUse = () => {
        playcontroller.changeState(true);
        playMusic();
    }
    const changePlayTime = function () {
        playcontroller.setTime(playBar.current.currentTime * 1000);
    }
    //如果是自动播放完歌曲
    const endMusic = () => {
        playBar.current.removeEventListener("ended", endMusic);
        playcontroller.changeState(false);
        if (size === 1 || way.desc.includes("单曲")) {
            playcontroller.setTime(0);
            playBar.current.currentTime = 0;
        } else {
            playlist.playNextSong()
        }
    }
    // 当播放新的歌曲的时调用
    React.useEffect(() => {
        playBar.current.removeEventListener("loadstart", loadingStart);
        playBar.current.addEventListener("loadstart", loadingStart);
        playBar.current.removeEventListener("canplaythrough", musicIsUse);
        playBar.current.addEventListener("canplaythrough", musicIsUse);
        playBar.current.removeEventListener("timeupdate", changePlayTime);
        playBar.current.addEventListener("timeupdate", changePlayTime);
        playBar.current.removeEventListener("ended", endMusic);
        playBar.current.addEventListener("ended", endMusic);
    }, [song]);
    const handleClik = function (e: MouseEvent) {
        playlist.isShow = false;
        playcontroller.showVoice(false);
    }
    const handleHover = function (e: any) {
        if (e.toElement == null && e.clientY > 100) {
            playcontroller.expend();
        }
    }
    React.useEffect(() => {
        playcontroller.init(playBar)
        window.addEventListener("click", handleClik);
        window.addEventListener("mouseout", handleHover);
        return function () {
            window.removeEventListener("click", handleClik);
        }
    }, []);
    const playMusic = function () {
        if (isPlay && playBar.current) {
            const promise = playBar.current.play();
            promise.catch((err: any) => {
                console.info(err);
                message.info({ content: "出现小问题啦!", duration: 2 });
                playcontroller.pause();
                playcontroller.changeState(false);
            })
        }
    }
    React.useEffect(() => {
        playMusic();
    }, [isPlay]);
    //播放条样式获取
    const getStyle = (type: string) => {
        let arrStyle = type === 'start' ? [styles.playbar] : [styles['playbar-move']];
        return arrStyle.join(" ");
    }
    //拖拽进度条时触发
    const changeTime = function (value: number) {
        playBar.current.removeEventListener("timeupdate", changePlayTime);
        playBar.current.volume = 0;
        playBar.current.currentTime = value / 1000;
        playcontroller.setTime(value);
    }
    //当拉取进度条之后触发
    const changeCurrentTime = (value: number) => {
        playBar.current.volume = playcontroller.voice / 100;
    }

    return <>
        {/* preload="auto"表示预加载音频 */}
        <audio ref={playBar} src={url} preload="auto">
        </audio>
        {collect && <CollectModal close={() => playcontroller.showCollect()} songId={song.id} />}
        <div className={showBar ? getStyle("start") : getStyle("move")} onClick={e => e.stopPropagation()}>
            {isShow && <PlayList />}
            <div style={{ flex: "1" }} className={styles["hidden-indicate"]}>
                <Tooltip placement="right" title={"收起"} >
                    <DownOutlined onClick={() => playcontroller.shrink()} />
                </Tooltip>
                <Tooltip placement="right" title='收藏'>
                    <PlusSquareOutlined />
                </Tooltip>
            </div>
            <div className={styles.playmusic} >
                {/* 播放上一首 */}
                <StepBackwardOutlined className={styles['playmusic-div1']} onClick={() => playlist.playPrevSong()} />
                {!isPlay && <PlayCircleOutlined className={styles['playmusic-div2']} onClick={() => playcontroller.playPause()} />}
                {isPlay && <PauseCircleOutlined className={styles['playmusic-div2']} onClick={() => playcontroller.playPause()} />}
                {/* 播放下一首 */}
                <StepForwardOutlined className={styles['playmusic-div3']} onClick={() => playlist.playNextSong(true)} />
            </div>
            <div className={styles.coverImg} >
                <img src={song.al?.picUrl} alt="logo" />
            </div>
            <ul className={styles["music-bar"]} >
                <li >
                    {/* 其中tipFormatter=null不显示当前进度的刻度 */}
                    <Slider min={0} max={song.dt} tipFormatter={null} step={song.dt / 1000} onChange={changeTime} onAfterChange={changeCurrentTime} value={time} />
                    <small>{transTime(time, 2)}/{transTime(song.dt, 2)}</small>
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
                    <SoundFilled className={styles['play-sound-btn']} onClick={() => playcontroller.showVoice()} />
                    {showSloud && <div className={styles['play-sound-container']}>
                        <Slider vertical className={styles['play-sound-bar']} onChange={(num) => { playcontroller.changeVolume(num) }} value={voice} />
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