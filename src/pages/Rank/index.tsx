import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import styles from "./index.module.scss"
import { fetchTopListDetail } from "../../api/rank"
import { fetchList, getListSong } from "../../api/songlist"
import { ClockCircleOutlined } from "@ant-design/icons"
import dayjs from 'dayjs';
import RankSong from '../../components/RankSong'
export default function Rank() {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("id");
    //用于判断那个榜单目前被选中
    const [current, setCurrent] = useState<Music.rank>();
    //特色榜
    const [special, setSpecial] = useState<Array<Music.rank>>([]);
    //媒体榜
    const [media, setMedia] = useState<Array<Music.rank>>([]);
    //歌单详情
    const [songlist, setSongList] = useState<Array<Music.list>>([]);
    //当前榜单中的歌曲信息
    const [songs, setSongs] = useState<Array<Music.song>>();
    useEffect(() => {
        (async () => {
            const res = await fetchTopListDetail();
            if (res.code === 200) {
                // console.log(res.artistToplist);歌手榜前三
                let arr: Array<Music.rank> = [];
                let brr: Array<Music.rank> = [];
                setCurrent(res.list[0]);
                navigate(`/rank?id=${res.list[0].id}`);
                for (let i = 0; i < res.list.length; i++) {
                    if (res.list[i].ToplistType) {
                        arr.push(res.list[i]);
                    } else {
                        brr.push(res.list[i]);
                    }
                }
                setSpecial(arr);
                setMedia(brr);
            }
        })();
    }, []);
    useEffect(() => {
        try {
            if (id) {
                (async () => {
                    const res = await fetchList(parseInt(id as string));
                    if (res.code === 200) {
                        setSongList(res.playlist);
                    }
                })();
                (async () => {
                    const res = await getListSong(parseInt(id as string));
                    if (res.code === 200) {
                        let arr: Array<Music.song> = [];
                        for (let i = 0; i < res.songs.length; i++) {
                            let song = { ...res.songs[i], index: i + 1, key: i };
                            arr.push(song);
                        }
                        setSongs(arr);
                    }
                })();
            }
        } catch (e) {
            console.log(e)
        }
    }, [id]);
    const shiftTopList = async (rank: Music.rank) => {
        setCurrent(rank);
        navigate(`/rank?id=${rank.id}`);
    }
    return (
        <div className={styles.rank}>
            <div className={styles.side}>
                <h4>云音乐特色榜</h4>
                <ul className={styles.special}>
                    {special.map(rank => {
                        return <li key={rank.id} style={{ background: current && rank.id === current.id ? '#CDD0D6' : "" }} onClick={() => { shiftTopList(rank) }}>
                            <img src={rank.coverImgUrl} alt="logo" />
                            <small>{rank.name}</small>
                            <small>{rank.updateFrequency}</small>
                        </li>
                    })}
                </ul>
                <h4>全球媒体榜</h4>
                <ul className={styles.media}>
                    {media.map(rank => {
                        return <li key={rank.id} style={{ background: current && rank.id === current?.id ? '#CDD0D6' : "" }} onClick={() => shiftTopList(rank)}>
                            <img src={rank.coverImgUrl} alt="logo" />
                            <small>{rank.name}</small>
                            <small>{rank.updateFrequency}</small>
                        </li>
                    })}
                </ul>
            </div>
            <div className={styles.content}>
                <header>
                    <img src={current?.coverImgUrl} alt="图片无法显示" />
                    <div>
                        <h2>{current?.name}</h2>
                        <small>
                            <ClockCircleOutlined />
                            <span> 最近更新 {dayjs(current?.updateTime).format("MM月DD日")}&nbsp;&nbsp;({current?.updateFrequency})</span>
                        </small>
                        <span>

                        </span>
                    </div>
                </header>
                <div className={styles.header}>
                    <span >
                        <div>
                            <h2>歌曲列表</h2>
                            <small>{current?.trackCount}首歌</small>
                        </div>
                        <small>播放
                            <small style={{ color: 'red' }}>{current?.playCount}</small>
                            次</small>
                    </span>
                    <hr />
                </div>
                <RankSong songs={songs} />
            </div>
        </div>
    )
}
