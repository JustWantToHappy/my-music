import React from 'react'
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.scss";
import playlist from '../../../mobx/playlist';
import playcontroller from '../../../mobx/playcontroller';
import { getLyricBySongId } from "../../../api/song"
import { throttle } from "../../../utils/throttle_debounce";
export default function Lyric() {

    const height = 40;
    const top = 40;
    const { song } = playlist;
    const { time ,isPlay} = playcontroller;
    const [lyric, setLyric] = React.useState<Array<[number, { lyc: string, tlyc?: string }]>>();
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
    //使用二分查找，根据现在的时间确定时间轴上的歌词,返回一个下标
    const binarySearchLyric = function (time: number): number {
        if (!lyric) {
            return 0;
        }
        let left = 0, right = lyric.length - 1;
        while (left < right) {
            let mid = left + Math.floor((right - left) / 2);
            break;
        }
        return left;
    }

    const handleScroll = (function () {
        let timer = setTimeout(() => {
            let index = binarySearchLyric(time);
            if (lyricRef.current&&isPlay) {
                lyricRef.current.scrollTop = height * index;
            }
        }, 1000);
        return function (event: any) {
            // console.log(event);
            if (timer) {
                clearTimeout(timer);
            }
            if (isPlay) {
                 setTimeout(() => {
                timer = setTimeout(() => {
                    let index = binarySearchLyric(time);
                    if (lyricRef.current) {
                        lyricRef.current.scrollTop = height * index;
                    }
                }, 1000);
            }, 2000);
            }
        }
    })();

    React.useEffect(() => {
        lyricRef.current?.addEventListener("scroll", handleScroll)
        return function () {
            lyricRef.current?.removeEventListener("scroll", handleScroll);
        }
    }, []);
    return (
        <div className={styles.lyric}>
            <header>
                <span>{song.name}</span>
                <span><CloseCircleOutlined onClick={() => playlist.isShow = false} /></span>
            </header>
            <div className={styles["lyric-content"]} ref={lyricRef} style={{ paddingTop: `${top}px` }}>
                {lyric?.map(([time, { lyc, tlyc }], index) => {
                    return (<p
                        key={time}
                        style={
                            playIndex === index ?
                                { height: `${height}px`, fontSize: "1.2rem", color: "#fff", fontWeight: "bolder" } :
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
}
