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
    UnorderedListOutlined,
    FullscreenOutlined,
    PlusCircleOutlined,
    CustomerServiceOutlined
} from "@ant-design/icons"
import {
    Dropdown,
    Menu,
    message,
    Slider,
    Tooltip
} from 'antd';
import React from "react"
import { transTime } from "../../utils/help"
import { addLocalStorage } from "../../utils/authorization"
import PlayBarReducer, { PlayBarAction } from "../../reducers/playBar";
import { songStore } from "../../mobx/song"
import CollectModal from "../CollectModal";
import PlayList from "../PlayList";
import Lyric from "../Lyric";
import playlist from "../../mobx/playlist";
export interface PlayBarType {
    showBar: boolean; //控制是否显示播放条
    showSloud: boolean;//控制音量条是否展示
    time: number;//进度条当前时间
    timer: null | number | ReturnType<typeof setTimeout>;//定时器
    voice: number; //音量条大小
    expend: boolean;//是否展开歌曲播放页面
    collect: boolean; //是否显示收藏音乐模态框
}
const PlayBar = () => {
    const playBar: any = React.useRef();
    const song = playlist.song;
    const url = `https://music.163.com/song/media/outer/url?id=${song.id}`;
    const initPlayBar: PlayBarType = {
        showBar: true,
        showSloud: false,
        time: 0,
        timer: null,
        voice: 1,
        expend: false,
        collect: false,
    }
    const [playBarState, dispatch] = React.useReducer(PlayBarReducer, initPlayBar);
    const {  showBar, showSloud, time, voice, expend, collect } = playBarState;
    //用于判断组件是否需要重新渲染,播放新的歌曲
/*     if (playBarState.song !== props.song) {
        playBar.current.currentTime = 0;
        playBar.current.pause();
        dispatch({
            type: PlayBarAction.Change,
            args: {
                showBar: true,
            }
        });
    } */
    // 当播放新的歌曲的时调用
    React.useEffect(() => {
        dispatch({ type: PlayBarAction.ClearTimer });
        /*  setTimeout(() => {
             var promise = playBar.current.play();
         }, 150) */
        playBar.current.addEventListener("play", () => {
            // setPlay(true);
        })
        playBar.current.addEventListener("ended", () => {
            dispatch({ type: PlayBarAction.ClearTimer });
        })
        return function () {
            dispatch({ type: PlayBarAction.ClearTimer });
        }
    }, []);
    //播放条样式获取
    const getStyle = (type: string) => {
        let arrStyle = type === 'start' ? [styles.playbar] : [styles['playbar-move']];
        return arrStyle.join(" ");
    }
    // 获取当前进度条事件
    const getCurrentTime = (value: number) => {
        dispatch({ type: PlayBarAction.ClearTimer });
        dispatch({ type: PlayBarAction.Change, args: { time: value } });
    }
    //当拉取进度条之后触发，设置当前播放时间
    const changeCurrentTime = (value: number) => {
        /*   playBar.current.currentTime = value / 1000;
          songStore.timer = setInterval(() => {
              setTime(playBar.current.currentTime * 1000);
          }, 1000); */
    }
    // 点击播放或者暂停
    const playMusic = async () => {
        /*  setPlay(!isPlay);
         isPlay ? playBar.current.pause() : playBar.current.play(); */
    }
    //改变音量
    const changeVoice = (value: any) => {
        playBar.current.volume = value * 0.01;
        dispatch({ type: PlayBarAction.Change, args: { voice: value } });
        addLocalStorage([{ key: "volume", value: playBar.current.volume }]);
    }
    //收起播放条
    const shrink = () => {
        dispatch({ type: PlayBarAction.Change, args: { expand: false, showSloud: false } })
    }
    //收起全屏
    const shrinkFullScreen = () => {
        let bar = myBarRef.current, img = imgRef.current;
        (bar as any).className = styles.playbar;
        (img as any).className = styles.coverImg;
        dispatch({ type: PlayBarAction.Change, args: { expand: false, showSloud: false, collect: true } })
    }
    //展开播放条
    const myBarRef = React.useRef<HTMLDivElement>(null);
    const imgRef = React.useRef<HTMLDivElement>(null);

    const spread = () => {
        let bar = myBarRef.current, img = imgRef.current;
        (bar as any).className = fullStyles.playbar;
        (img as any).className = fullStyles.coverImg;
        dispatch({ type: PlayBarAction.Change, args: { expand: true, showSloud: false, showBar: false } })
    }

    return <>
        <audio ref={playBar} src={url} preload="auto">
            {/* preload="auto"表示预加载音频 */}
        </audio>
        {collect && <CollectModal close={() => { }} songId={song.id} />}
        <div className={showBar ? getStyle("start") : getStyle("move")} ref={myBarRef}>
            {!expend && <PlayList />}
            {!expend && <div style={{ flex: "1" }} className={styles["hidden-indicate"]}>
                <Tooltip placement="right" title={"展开"} >
                    <FullscreenOutlined onClick={spread} />
                </Tooltip>
                <Tooltip placement="right" title={"收起"} >
                    <DownOutlined onClick={shrink} />
                </Tooltip>
            </div>}
            {!expend && <div className={styles.playmusic} >
                {/* 播放上一首 */}
                <StepBackwardOutlined className={styles['playmusic-div1']} onClick={() => { }} />
                {!playlist.state && <PlayCircleOutlined className={styles['playmusic-div2']} onClick={() => { }} />}
                {playlist.state && <PauseCircleOutlined className={styles['playmusic-div2']} onClick={() => { }} />}
                {/* 播放下一首 */}
                <StepForwardOutlined className={styles['playmusic-div3']} onClick={() => { }} />
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
                        return (<span key={index}></span>)
                    })}
                </p>
                <p><>专辑:&nbsp;</><small>{song.al && song.al.name}</small></p>
                <Lyric audioRef={playBar} id={song.id} />
            </div>}
            {!expend && <ul className={styles["music-bar"]} >
                <li >
                    {/* 其中tipFormatter=null不显示当前进度的刻度 */}
                    <Slider min={0} max={song.dt} tipFormatter={null} step={song.dt / 1000} onChange={getCurrentTime} onAfterChange={changeCurrentTime} value={time} />
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
            </ul>}
            {!expend && <div className={styles['play-method']}>
                {/* 音量调整 */}
                <span className={styles['play-sound']}>
                    {showSloud && <Slider vertical className={styles['play-sound-bar']} onChange={changeVoice} value={voice} />}
                    <SoundFilled className={styles['play-sound-btn']} onClick={(e) => { e.stopPropagation();  }} />
                </span>
                {/* 播放方式 */}
                <Dropdown overlay={menu} placement="top" >
                    <EllipsisOutlined />
                </Dropdown>
                {/* 播放队列 */}
                <CustomerServiceOutlined onClick={() => { }} />
                {localStorage.getItem("hasLogin") === 'true' && <Tooltip placement="left" title='收藏'>
                    <PlusCircleOutlined onClick={() => {  }} />
                </Tooltip>}
            </div>}
            {expend && <div className={fullStyles['music-bar']}>
                <div>
                    <Slider min={0} max={song.dt} tipFormatter={null} step={song.dt / 1000} onChange={getCurrentTime} onAfterChange={changeCurrentTime} value={time} />
                </div>
                <div>
                    <small>{transTime(time, 2)}/{transTime(song.dt, 2)}</small>
                    <span>
                        <StepBackwardOutlined onClick={() => { }} />
                        {!playlist.state && <PlayCircleOutlined onClick={() => { }} />}
                        {playlist.state && <PauseCircleOutlined onClick={() => { }} />}
                        <StepForwardOutlined onClick={() => { }} />
                    </span>
                    <i>
                        <Dropdown overlay={menu} placement="top" >
                            <UnorderedListOutlined />
                        </Dropdown>
                    </i>
                    <p >
                        {showSloud && <Slider vertical onChange={changeVoice} value={voice} className={fullStyles.soundBar} />}
                        <SoundFilled onClick={(e) => { e.stopPropagation();  }} />
                    </p>
                </div>
            </div>}

        </div>
    </>
}
const menu = () => {
    //默认时列表播放,改变播放方式
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