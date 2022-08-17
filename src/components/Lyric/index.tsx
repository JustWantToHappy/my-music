import { useState, useEffect, useRef } from "react"
import styles from "./index.module.scss"
import { getLyricBySongId } from "../../api/song"
import { transUsTime, throttle } from "../../utils/help"
interface lyricType {
    audioRef: any,
    id: number
}
const Lyric = (props: lyricType) => {
    const { audioRef } = props;
    //原歌词
    const [lyric, setLyric] = useState<Array<{ time: string, content: string }>>([]);
    //翻译后歌词
    const [tlyric, setTlyric] = useState<Array<{ time: string, content: string }>>([]);
    const [id, setId] = useState<number>(props.id);
    //用于标记正在播放的歌词数组下标
    const [playIndex, setIndex] = useState<number>(0);
    if (id !== props.id) {
        setId(props.id);
    }
    const lyricRef = useRef<HTMLDivElement>(null);
    //用于分割歌词
    const handleStr = async (lyricStr: string, type: number) => {
        if (lyricStr.length > 0) {
            let arr = lyricStr.split("\n");
            let lyricArr: Array<{ time: string, content: string }> = [];
            arr.forEach(str => {
                let brr = str.split("]");
                let obj = { time: "", content: "" };
                obj.time = brr[0].slice(1);
                if (brr.length > 1) {
                    obj.content = brr[1];
                }
                lyricArr.push(obj);
            })
            type === 0 && await setLyric(lyricArr);
            type === 1 && await setTlyric(lyricArr);
        }
    }
    const timeupdate = () => {
        audioRef.current.addEventListener('timeupdate', () => {
            let index = binarySearchLyric(audioRef.current.currentTime);
            if (index !== playIndex && index > 0) {
                let tIndex = 0;
                for (let i = 0; i < tlyric.length; i++) {
                    if (lyric[index].time === tlyric[i].time) {
                        tIndex = i;
                        break;
                    }
                }
                let ref = lyricRef.current as any;
                ref.scrollTop = (tIndex) * 100 + (index - tIndex) * 50 - 150;
            }
            setIndex(index);
        });
    }
    //使用二分查找，根据准确的时间确定时间轴上的歌词,返回一个下标
    const binarySearchLyric = (time: number) => {
        let index = 0;
        if (lyric.length > 0) {
            let currentTime = Math.ceil(time * 1e6);
            let min = 0, max = lyric.length - 1;
            let min_value = Number.MAX_VALUE;
            while (min <= max) {
                let mid = Math.ceil((min + max) / 2);
                let diff = currentTime - transUsTime(lyric[mid].time);
                if (diff < 0) {
                    max--;
                    min_value = Math.min(min_value, diff);
                    index = mid;
                } else if (diff > 0) {
                    min++;
                } else if (diff === 0) {
                    index = mid;
                    break;
                }
            }
        }
        return index > 0 ? index - 1 : 0;
    }
    const getTlyricContent = (time: string) => {
        let content = "";
        for (let i = 0; i < tlyric.length; i++) {
            if (tlyric[i].time === time) {
                content = tlyric[i].content;
                break;
            }
        }
        return <small style={{ display: 'block', transform: 'translateY(-10px)' }}>{content}</small>
    }
    useEffect(() => {
        (async () => {
            let res = await getLyricBySongId(id);
            // console.log(ref, 'ccc')
            handleStr(res.lrc.lyric, 0);
            handleStr(res.tlyric.lyric, 1);
        })();
    }, [id]);
    useEffect(() => {
        timeupdate();
    }, [lyric]);
    return <div className={styles.lyric}>
        <div ref={lyricRef}>
            {lyric.map((scentence, index) => <div key={index} style={{ textAlign: 'center' }}>
                <small style={index === playIndex ? { color: "#409EFF" } : {}}>{scentence.content}</small>
                {tlyric.length > 0 && getTlyricContent(scentence.time)}
            </div>)}
        </div>
    </div>
}
export default Lyric;