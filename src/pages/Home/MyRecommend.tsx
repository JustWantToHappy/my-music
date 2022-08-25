import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { fetchMyRecommendSongList, fetchMyRecommendSongs } from "../../api/songlist"
import styles from "./my-recommend.module.scss"
import { getImgsLoadEnd } from "../../utils/help"
import { transPlayCount, transNumber } from "../../utils"
import playList from "../../utils/playlist"
import { PlayCircleOutlined, CustomerServiceOutlined } from "@ant-design/icons"
export default function MyRecommend() {
    const [songList, setSongList] = useState<Array<User.recommendList>>([]);
    const [songs, setSongs] = useState<Array<Music.song>>([]);
    const myRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            const res = await fetchMyRecommendSongList();
            if (res.code === 200) {
                setSongList(res.recommend);
                getImgsLoadEnd(res.recommend, "picUrl", myRef);
            }
        })();
    }, []);
    useEffect(() => {
        (async () => {
            const { data } = await fetchMyRecommendSongs();
            if (data.code === 200) {
                let arr: Array<Music.song> = [];
                data.dailySongs.forEach((song: Music.song, index: number) => {
                    arr.push({ ...song, index: index + 1, album: song.al, artists: song.ar });
                })
                setSongs(arr);
            }
        })();
    }, []);
    const playRecommendSongList = (event: React.MouseEvent, id: number) => {
        playList(id);
        // event.stopPropagation();阻止事件向上冒泡
    }
    return (
        <div className={styles['my-recommend']} ref={myRef}>
            <h3>个性推荐</h3>
            <span></span>
            <div>
                <div className={styles['songs-recommend']}>
                    <div>
                        <h3>
                            星期{transNumber(new Date().getDay())}
                        </h3>
                        <span>
                            {new Date().getDate()}
                        </span>
                    </div>
                    <footer>
                        每日歌曲推荐
                    </footer>
                </div>
                {songList.slice(0, 9).map((songlist: User.recommendList) => {
                    return <div key={songlist.id} className={styles.content} onClick={() => { navigate(`/playlist/${songlist.id}`) }}>
                        <div style={{ backgroundImage: `url(${songlist.picUrl})`, backgroundRepeat: "no-repeat" }}>
                            <figcaption onClick={(e) => { e.stopPropagation(); }}>
                                <span>
                                    <CustomerServiceOutlined />
                                    <small>{transPlayCount(songlist.playcount)}</small>
                                </span>
                                <PlayCircleOutlined onClick={(e) => { playRecommendSongList(e, songlist.id); }} />
                            </figcaption>
                        </div>
                        <span>{songlist.name}</span>
                    </div>
                })}
            </div>
        </div>
    )
}
