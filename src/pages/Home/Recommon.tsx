import React, { useEffect, useState, useRef } from "react"
import { getHightSongLists, getNewDiscs } from "../../api/recommond"
import { useNavigate } from "react-router-dom"
import styles from "./recommon.module.scss"
import { getImgsLoadEnd } from "../../utils/help"
//最热歌单
const RecommonList = () => {
    const navigate = useNavigate();
    const listRef = useRef<HTMLDivElement>(null);
    const [highSongLists, setHighSongLists] = useState<Array<Music.highLists>>();
    useEffect(() => {
        (async () => {
            const lists = await getHightSongLists();
            setHighSongLists(lists.playlists);
        })();
    }, []);
    useEffect(() => {
        //只有图片加载完成后才显示
        if (highSongLists && highSongLists.length > 0) {
            getImgsLoadEnd(highSongLists, "coverImgUrl", listRef);
        }
    }, [highSongLists])
    return (
        <div className={styles.recommon} ref={listRef}>
            <section className={styles.title}>
                <b>最热歌单</b>
                <span onClick={() => { navigate("/home/allplaylist") }}>更多</span>
                <hr className={styles.divider} />
            </section>
            {highSongLists?.map(list => {
                return <div key={list.id} onClick={() => {
                    navigate(`/playlist/${list.id}`)//跳转到歌单详情页面
                }}>
                    <img src={list.coverImgUrl} alt="图片无法显示" />
                    <span>{list.name}</span>
                </div>
            })}
        </div>
    )
}
//新碟上架
const NewDisc = () => {
    const [newDiscs, setNewDiscs] = useState<Array<Music.album>>();
    const albumRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            const data = await getNewDiscs();
            setNewDiscs(data.albums);
        })();
    }, []);
    useEffect(() => {
        if (newDiscs && newDiscs.length > 0) {
            getImgsLoadEnd(newDiscs, 'picUrl', albumRef);
        }
    }, [newDiscs]);
    const toArtistPage = (singer: Music.singer) => {
        navigate(`/artist?id=${singer.id}`, { state: singer });
    }
    return (
        <div className={styles.newBorn} ref={albumRef}>
            <b>最新专辑</b>
            {newDiscs?.map(album => {
                return <section key={album.id}>
                    <img src={album.picUrl} alt="图片无法显示" onClick={() => { navigate(`album?id=${album.id}`) }} />
                    <div>
                        <small onClick={() => { toArtistPage(album.artist) }}>{album.artist.name}</small>
                        <small onClick={() => { navigate(`album?id=${album.id}`) }}>{album.name}</small>
                    </div>
                </section>

            })}
        </div>
    )
}
export { RecommonList, NewDisc };
