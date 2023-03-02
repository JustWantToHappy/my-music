import React from 'react'
import { CloseCircleOutlined, MinusOutlined } from "@ant-design/icons";
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
    const [lyric, setLyric] = React.useState<Array<[number, { lyc: string, tlyc?: string }]>>();
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
        let left = 0, right = lyric.length - 1;
        let diff = Number.MAX_VALUE;
        while (left < right) {
            let mid = left + Math.floor((right - left) / 2);
            let lyricTime = lyric[mid][0];
            if (lyricTime < time * 1000) {
                mid = left + 1;
            } else if (lyricTime > time * 1000) {
                mid = right - 1;
            } else {
                return mid;
            }
        }
        return left;
    }

    const handleScroll = function (event: React.UIEvent<HTMLDivElement>) {
        setAllowAutoScroll(false);
        delayedExcution(() => { setAllowAutoScroll(true) }, 4000)();
    };
    React.useEffect(() => {
        const timer = setInterval(() => {
            if (allowAutoScroll && lyricRef.current) {
                // 歌词自动滚动...
                let index = binarySearchLyric(playcontroller.time);
                console.info(index);
                setIndex(index);
                lyricRef.current.scrollTop = index * 50;
            }
        }, 1000);

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
                onScroll={throttle(handleScroll, 500)}
            >
                {lyric?.map(([time, { lyc, tlyc }], index) => {
                    return (<p
                        key={time}
                        style={
                            playIndex === index ?
                                { height: `${height}px`, fontSize: "1rem", color: "#fff", fontWeight: "bolder" } :
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
