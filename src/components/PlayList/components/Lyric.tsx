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
    const lyricRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLSpanElement>(null);
    const userDragScrollBarThumbRef = React.useRef(false)
    const [autoScroll, setAutoScroll] = React.useState(true);
    const [thumbTop, setThumbTop] = React.useState(0)
    const [playIndex, setPlayIndex] = React.useState<number>(0);
    const [lyric, setLyric] = React.useState<Array<[number, { lyc: string, tlyc?: string }]>>([]);

    //使用二分查找，根据现在的时间确定时间轴上的歌词,返回一个下标
    const binarySearchLyric = React.useCallback((time: number) => {
        if (!lyric) return 0;
        const targetTime = time * 1000; // 将时间单位转换为微秒
        let left = 0, right = lyric.length - 1, ans = 0;
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

    //恢复自动滚动
    const recoverAutoScroll = () => {
        timerRef.current = window.setTimeout(() => {
            setAutoScroll(true)
            mouseWheelRef.current = false;
        }, recoverAutoScrollInterval)
    }

    const handleUserScroll = () => {
        window.clearTimeout(timerRef.current)
        if (mouseWheelRef.current || userDragScrollBarThumbRef.current) {
            setAutoScroll(false)
        }
        recoverAutoScroll()
    }

    const handleWheelScroll = (event: React.WheelEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
        const { height } = (thumbRef.current as HTMLSpanElement).getBoundingClientRect()
        mouseWheelRef.current = true;
        setThumbTop(Math.min(clientHeight - height, scrollTop / scrollHeight * clientHeight))
    }

    const handleMouseDown = () => {
        userDragScrollBarThumbRef.current = true
    };

    const handleMouseUp = () => {
        userDragScrollBarThumbRef.current = false
        recoverAutoScroll()
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        console.info(event.clientY, 'hhh')
        if (userDragScrollBarThumbRef.current) {
            clearTimeout(timerRef.current)
            //setThumbTop(event.clientY)
        }
    }

    const thumbHeight = React.useMemo(() => {
        let ratio = 1;
        if (lyricRef.current) ratio = lyricRef.current.clientHeight / (lyric.length * itemHeight + paddingTopHeight);
        return ratio >= 1 ? 0 : ratio * lyricRef.current!.clientHeight;
    }, [lyric])

    React.useMemo(() => {
        const lyricEle = lyricRef.current;
        const thumbEle = thumbRef.current;
        if (lyricEle && thumbEle) {
            const scrollTop = Math.max(playIndex * itemHeight + paddingTopHeight - lyricEle.clientHeight / 2, 0);
            lyricEle.scrollTop = scrollTop;
            !userDragScrollBarThumbRef.current && setThumbTop(Math.min((paddingTopHeight + playIndex * itemHeight) / lyricEle.scrollHeight * lyricEle.clientHeight, lyricEle.clientHeight - thumbEle.clientHeight))
        }
    }, [playIndex]);

    React.useEffect(() => {
        (async () => {
            const res = await getLyricBySongId(song.id);
            playcontroller.handleLyric(res.lrc.lyric, res.tlyric ? res.tlyric.lyric : "");
            setLyric(playcontroller.getLyric());
        })();
    }, [song.id]);

    React.useEffect(() => {
        if (autoScroll && isPlay && lyricRef.current) {
            const index = binarySearchLyric(time);
            setPlayIndex(index);
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
                onWheel={handleWheelScroll}
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
                <div className={styles['scrollbar-track']}>
                    <span
                        ref={thumbRef}
                        style={{ height: `${thumbHeight}px`, top: `${thumbTop}px` }}
                        onMouseUp={handleMouseUp}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        className={styles['scrollbar-thumb']}>
                    </span>
                </div>
            </div>
        </div>
    )
});
