import React from 'react'
import { CloseCircleOutlined, SafetyCertificateTwoTone } from "@ant-design/icons";
import styles from "../index.module.scss";
import playlist from '../../../mobx/playlist';
import playcontroller from '../../../mobx/playcontroller';
import { getLyricBySongId } from "../../../api/song"
import { throttle } from "../../../utils/throttle_debounce";
import { delayedExcution } from "../../../utils"
import { observer } from "mobx-react";

export default observer(function Lyric() {
    const height = 50;
    const top = 40;
    const { song } = playlist;
    const { isPlay } = playcontroller;
    const [lyric, setLyric] = React.useState<Array<[number, { lyc: string, tlyc?: string }]>>();
    //区分用户滚动和自动滚动,避免同一回调的触发
    const [scrollByUser, setScrollByUser] = React.useState(false);
    //是否自动滚动
    const [allowAutoScroll, setAllowAutoScroll] = React.useState(true);
    //用于标记正在播放的歌词数组下标
    const [playIndex, setIndex] = React.useState<number>(0);
    const lyricRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        (async () => {
            let res = await getLyricBySongId(song.id);
            playcontroller.handleLyric(res.lrc.lyric, res.tlyric ? res.tlyric.lyric : "");
            setLyric(playcontroller.getLyric());
        })();
    }, [song.id]);
    //使用二分查找，根据现在的时间确定时间轴上的歌词,返回一个下标，时间单位是us
    const binarySearchLyric = function (time: number): number {
        if (!lyric) {
            return 0;
        }
        const targetTime = time * 1000; // 将时间单位转换为微秒
        let left = 0,
            right = lyric.length - 1;
        let ans = 0;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (lyric[mid][0] <= targetTime) {
                ans = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return ans;
    }

    const handleUserScroll = function (event: React.UIEvent<HTMLDivElement>) {
        setScrollByUser(true);
        if (scrollByUser && allowAutoScroll) {
            setAllowAutoScroll(state => {
                return !state ? state : !state;
            });
            delayedExcution(() => {
                setAllowAutoScroll(true);
                setScrollByUser(false);
            }, 4000)();
        }
    };
    React.useEffect(() => {
        const handleAutoScroll = function () {
            if (allowAutoScroll && isPlay && lyricRef.current) {
                // 歌词自动滚动...
                let index = binarySearchLyric(playcontroller.time);
                setIndex(index);
                lyricRef.current.scrollTop = index * height + top - lyricRef.current.clientHeight / 2;
            }
        }
        const timer = setInterval(() => {
            window.requestAnimationFrame(handleAutoScroll);
        }, 100);
        return function () {
            clearInterval(timer);
        }
    }, [allowAutoScroll]);
    
    return (
        <div className={styles.lyric}>
            <header>
                <span>{song.name}</span>
                <span><CloseCircleOutlined onClick={() => playlist.isShow = false} /></span>
            </header>
            <div
                className={styles["lyric-content"]}
                ref={lyricRef}
                style={{ paddingTop: `${top}px` }}
                onScroll={throttle(handleUserScroll, 500)}
            >
                {lyric?.map(([time, { lyc, tlyc }], index) => {
                    return (<p
                        key={time}
                        style={
                            playIndex === index ?
                                {
                                    height: `${height}px`,
                                    fontSize: "1rem",
                                    color: "#fff",
                                    fontWeight: "bolder",
                                } :
                                { height: `${height}px` }
                        }>
                        <small>{lyc}</small>
                        <br />
                        <small>{tlyc}</small>
                    </p>)
                })}
            </div>
        </div>
    )
});
