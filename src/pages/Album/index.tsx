import { useState, useEffect } from 'react'
import { useSearchParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { Tag } from "antd"
import styles from "./index.module.scss"
import { fetchAlbumContent } from "../../api/album"
import Song from '../../components/Song'
import dayjs from "dayjs"
export default function Album() {
    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    //专辑信息
    const [msg, setMsg] = useState<Music.album>();
    //专辑中所有歌曲
    const [songs, setSongs] = useState<Array<Music.song>>();
    useEffect(() => {
        (async () => {
            let res = await fetchAlbumContent(id as string);
            if (res.code === 200) {
                setMsg(res.album);
                let arr: Array<Music.song> = [];
                for (let i = 0; i < res.songs.length; i++) {
                    let song = { ...res.songs[i], index: i + 1, key: i };
                    arr.push(song);
                }
                setSongs(arr);
            }
        })();
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className={styles.album}>
            <header>
                <img src={msg?.blurPicUrl} alt="图片无法显示" />
                <figcaption>
                    <label>
                        <Tag color="#F53F3F">专辑</Tag>
                        <h3>{msg?.name}</h3>
                    </label>
                    <label>歌手:&nbsp;
                        <span onClick={() => { navigate(`/artist?id=${msg?.artist.id}`) }}>{msg?.artist.name}</span>
                    </label>
                    <span >发布时间:&nbsp;{dayjs(msg?.publishTime).format('YYYY-MM-DD')}</span>
                    <span>发行公司:&nbsp;{msg?.company}</span>
                </figcaption>
            </header>
            <div className={styles.desc}>
                <h4>专辑介绍:</h4>
                <p>{msg?.description}</p>
            </div>
            <footer>
                <h2>包含歌曲列表</h2>
                <span>{msg?.size}首歌</span>
            </footer>
            <hr />
            <Song songs={songs} />
        </div>
    )
}
