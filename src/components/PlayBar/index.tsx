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
    const { song, isShow } = playlist;
    const { time, voice, showSloud, collect, showBar, isPlay } = playcontroller;
    const url = `https://music.163.com/song/media/outer/url?id=${song.id}`;

    const playMusic = function () {
        if (isPlay && playBar.current) {
            const promise = playBar.current.play();
            promise.then(() => {
                playcontroller.play();
            }).catch((err: any) => {
                console.info(err);
                message.info({ content: "该歌曲需要购买vip!", duration: 2 });
                playcontroller.pause();
            })
        }
    }

    const changePlayTime = function () {
        playcontroller.setTime(playBar.current.currentTime * 1000);
    }

    //如果是自动播放完歌曲
    const endMusic = () => {
        playlist.playNextSong();
    };
    // 当播放新的歌曲的时候调用
    React.useEffect(() => {
        playBar.current.currentTime = 0;
        playMusic();
    }, [song]);
    //当点击播放按钮时调用
    React.useEffect(() => {
        if (isPlay) {
            playMusic();
        }
    }, [isPlay]);

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
        playBar.current.addEventListener("canplaythrough", playMusic);
        playBar.current.addEventListener("timeupdate", changePlayTime);
        playBar.current.addEventListener("ended", endMusic);
        return function () {
            window.removeEventListener("click", handleClik);
            window.removeEventListener("mouseout", handleHover);
            playBar.current.removeEventListener("canplaythrough", playMusic);
            playBar.current.removeEventListener("timeupdate", changePlayTime);
            playBar.current.removeEventListener("ended", endMusic);
        }
    }, []);

    //拖拽进度条时触发
    const changeTime = function (value: number) {
        playBar.current.removeEventListener("timeupdate", changePlayTime);
        playBar.current.volume = 0;
        playBar.current.currentTime = value / 1000;
        playcontroller.setTime(value);
        playcontroller.changeDraging(true);
    }
    //当拉取进度条之后触发
    const changeCurrentTime = () => {
        playBar.current.volume = playcontroller.voice / 100;
        playcontroller.changeDraging(false);
    }
    //播放上一首音乐
    const playPrevSong = function () {
        playlist.playPrevSong();
    }
    //播放下一首音乐
    const playNextSong = function () {
        playlist.playNextSong(true);
    }

    console.info(playcontroller.showBar, 'hhh');
    return <>
        {/* preload="auto"表示预加载音频 */}
        <audio ref={playBar} src={url} preload="auto">
        </audio>
        {collect && <CollectModal close={() => playcontroller.showCollect()} songId={song.id} />}
        <div
            className={showBar ? styles.playbar : styles['playbar-move']}
            onClick={e => e.stopPropagation()}
        >
            {isShow && <PlayList />}
            <div style={{ flex: "1" }} className={styles["hidden-indicate"]}>
                <Tooltip placement="right" title={"收起"} >
                    <DownOutlined onClick={() => { }} />
                    {/*<DownOutlined onClick={() => playcontroller.shrink()} />*/}
                </Tooltip>
                <Tooltip placement="right" title='收藏'>
                    <PlusSquareOutlined />
                </Tooltip>
            </div>
            <div className={styles.playmusic} >
                {/* 播放上一首 */}
                <StepBackwardOutlined className={styles['playmusic-div1']} onClick={playPrevSong} />
                {!isPlay && <PlayCircleOutlined className={styles['playmusic-div2']} onClick={() => playcontroller.playPause()} />}
                {isPlay && <PauseCircleOutlined className={styles['playmusic-div2']} onClick={() => playcontroller.playPause()} />}
                {/* 播放下一首 */}
                <StepForwardOutlined className={styles['playmusic-div3']} onClick={playNextSong} />
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