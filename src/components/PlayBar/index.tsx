//音乐播放条组件
import React from "react"
import { Slider, Tooltip } from 'antd';
import styles from "./index.module.scss"
import {
    StepBackwardOutlined,
    StepForwardOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    SoundFilled,
    DownOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons"
import { transTime } from "../../utils/help"
import CollectModal from "../CollectModal";
import PlayList from "../PlayList";
import { observer } from "mobx-react";
import playlist from "../../mobx/playlist";
import playcontroller from "../../mobx/playcontroller";
import PlayListIcon from "../../assets/logo/playlist.svg";

const PlayBar = observer(() => {
    const { song, isShow } = playlist;
    const playBar = React.useRef<HTMLAudioElement>(null);
    const playBarContainer = React.useRef<HTMLDivElement>(null);
    const { time, voice, showSloud, collect, showBar, isPlay } = playcontroller;
    const url = `https://music.163.com/song/media/outer/url?id=${song.id}`;
    const playMusic = React.useCallback(function () {
        if (playBar.current && isPlay) {
            const promise = playBar.current.play();
            promise.then(() => {
                playcontroller.play();
            }).catch((err: any) => {
                playcontroller.pause();
            })
        }
    }, [isPlay])

    const changePlayTime = function () {
        playcontroller.setTime(playBar.current!.currentTime * 1000);
    }

    //如果是自动播放完歌曲
    const endMusic = () => {
        playlist.playNextSong();
    };

    const handleMouseLeaveDocument = function (e: Event) {
        if (!playcontroller.showBar) {
            playcontroller.expend();
        }
    }

    // 当播放新的歌曲的时候调用
    React.useEffect(() => {
        playMusic();
    }, [song, playMusic]);

    React.useEffect(() => {
        if (isPlay) {
            playMusic();
        }
    }, [isPlay, playMusic]);

    React.useEffect(() => {
        const audio = playBar.current;
        playcontroller.init(playBar)
        audio?.addEventListener("canplaythrough", playMusic);
        audio?.addEventListener("timeupdate", changePlayTime);
        audio?.addEventListener("ended", endMusic);
        document.addEventListener('mouseleave', handleMouseLeaveDocument)
        return function () {
            audio?.removeEventListener("canplaythrough", playMusic);
            audio?.removeEventListener("timeupdate", changePlayTime);
            audio?.removeEventListener("ended", endMusic);
            document.removeEventListener('mouseleave', handleMouseLeaveDocument)
        }
    }, [playMusic]);

    //拖拽进度条时触发
    const changeTime = function (value: number) {
        playBar.current!.removeEventListener("timeupdate", changePlayTime);
        playBar.current!.volume = 0;
        playBar.current!.currentTime = value / 1000;
        playcontroller.setTime(value);
        playcontroller.changeDraging(true);
    }
    //当拉取进度条之后触发
    const changeCurrentTime = () => {
        playBar.current!.volume = playcontroller.voice / 100;
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

    return <>
        <audio ref={playBar} src={url} preload="auto" />
        {collect && <CollectModal close={() => playcontroller.showCollect()} songId={song.id} />}
        <div
            ref={playBarContainer}
            className={styles.playbar}
            style={!showBar ? { bottom: '-3.5rem' } : { bottom: '0' }}>
            {isShow && <PlayList container={playBarContainer.current} />}
            <div style={{ flex: "1" }} className={styles["hidden-indicate"]}>
                <Tooltip placement="right" title='收起' >
                    <DownOutlined onClick={() => playcontroller.shrink()} />
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
                    <Slider min={0} max={song.dt} tipFormatter={null} step={song.dt / 1000} onChange={changeTime} onAfterChange={changeCurrentTime} value={time} />
                    <small>{transTime(time, 2)}/{transTime(song.dt, 2)}</small>
                </li>
                <li>
                    <div>
                        {/* 歌曲名称 */}
                        <span>{song.name}&nbsp;&nbsp;</span>
                        {/* 歌手名称 */}
                        <span >{song?.ar?.[0].name}</span>
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
            {/*<div
                onMouseEnter={() => playcontroller.expend()}
                className={styles['play-lock']}>
                <img
                    style={{ height: '50%' }}
                    src={require('../../assets/img/unlock.png')}
                    title='上锁'
                    alt='上锁' />
            </div>*/}
        </div>
    </>
});
export default PlayBar;