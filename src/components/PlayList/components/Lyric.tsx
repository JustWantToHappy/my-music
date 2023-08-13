import React from 'react'
import styles from "../index.module.scss";
import playlist from '../../../mobx/playlist';
import { getLyricBySongId } from "../../../api/song"
import { observer } from "mobx-react";
import playcontroller from '../../../mobx/playcontroller';
import { CloseCircleOutlined } from "@ant-design/icons";

export default observer(function Lyric() {
    const itemHeight = 60;
    const paddingTopHeight = 40;
    const { song } = playlist;
    const recoverAutoScrollInterval = 5000;//用户滚动后恢复自动滚动间隔
    const { isPlay, time } = playcontroller;
    const timerRef = React.useRef<number>();
    const mouseWheelRef = React.useRef(false);
    const prevPlayIndex = React.useRef(0)
    const [autoScroll, setAutoScroll] = React.useState(true);
    const [playIndex, setPlayIndex] = React.useState<number>(0);
    const lyricRef = React.useRef<HTMLDivElement>(null);
    const [lyric, setLyric] = React.useState<Array<[number, { lyc: string, tlyc?: string }]>>();

    //使用二分查找，根据现在的时间确定时间轴上的歌词,返回一个下标
    const binarySearchLyric = React.useCallback((time: number) => {
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
    }, [lyric])

    const handleUserScroll = () => {
        window.clearTimeout(timerRef.current)
        if (mouseWheelRef.current) {
            setAutoScroll(false)
        }
        timerRef.current = window.setTimeout(() => {
            setAutoScroll(true)
            mouseWheelRef.current = false;
        }, recoverAutoScrollInterval)
    }

    const heandleWheelScroll = () => {
        mouseWheelRef.current = true;
    }

    React.useMemo(() => {
        const lyricEle = lyricRef.current;
        if (lyricEle) {
            const scrollTop = playIndex * itemHeight + paddingTopHeight - lyricEle.clientHeight / 2;
            lyricEle.scrollTop = scrollTop;
        }
    }, [playIndex]);

    React.useEffect(() => {
        (async () => {
            let res = await getLyricBySongId(song.id);
            playcontroller.handleLyric(res.lrc.lyric, res.tlyric ? res.tlyric.lyric : "");
            setLyric(playcontroller.getLyric());
        })();
    }, [song.id]);

    React.useEffect(() => {
        if (autoScroll && isPlay && lyricRef.current) {
            window.requestAnimationFrame(() => {
                let index = binarySearchLyric(time);
                setPlayIndex(index);
            })
        }
    }, [autoScroll, isPlay, binarySearchLyric, time]);

    return (
        <div className={styles.lyric}>
            <header>
                <span>{song.name}</span>
                <span>
                    <CloseCircleOutlined onClick={() => playlist.isShow = false} />
                </span>
            </header>
            <div
                ref={lyricRef}
                className={styles["lyric-content"]}
                style={{ padding: `${paddingTopHeight}px 0` }}
                onScroll={handleUserScroll}
                onWheel={heandleWheelScroll}
            >
                {lyric?.map(([time, { lyc, tlyc }], index) => {
                    return (<p
                        key={time}
                        style={
                            playIndex === index ?
                                {
                                    height: `${itemHeight}px`,
                                    fontSize: "1rem",
                                    color: "#fff",
                                    fontWeight: "bolder",
                                } :
                                {
                                    height: `${itemHeight}px`,
                                }
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
