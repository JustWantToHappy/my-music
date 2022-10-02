import React, { useEffect, useState, useRef } from "react"
import { getHightSongLists, getNewDiscs } from "../../api/recommond"
import { Tooltip } from "antd"
import { useNavigate } from "react-router-dom"
import styles from "./recommon.module.scss"
//最热歌单
const RecommonList = () => {
    const navigate = useNavigate();
    const listRef = useRef<HTMLDivElement>(null);
    const [highSongLists, setHighSongLists] = useState<Array<Music.list>>();
    useEffect(() => {
        (async () => {
            const lists = await getHightSongLists();
            setHighSongLists(lists.playlists);
        })();
    }, []);
    return (
        <div className={styles.recommon} ref={listRef}>
            <section className={styles.title}>
                <b>最热歌单</b>
                <span onClick={() => { navigate("/home/allplaylist") }}>更多</span>
                <hr className={styles.divider} />
            </section>
            <div className={styles['host-lists']}>
                {highSongLists?.map(list => {
                    return <div key={list.id} onClick={() => {
                        navigate(`/playlist/${list.id}`)//跳转到歌单详情页面
                    }} >
                        <img src={list.coverImgUrl} alt="图片无法显示" />
                        <span>{list.name}</span>
                    </div>
                })}
            </div>
        </div>
    )
}
//新碟上架
const NewDisc = () => {
    const [newDiscs, setNewDiscs] = useState<Array<Music.album>>();
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            const data = await getNewDiscs();
            setNewDiscs(data.albums);
        })();
    }, []);
    const toArtistPage = (singer: Music.singer) => {
        navigate(`/artist?id=${singer.id}`, { state: singer });
    }
    return (
        <div className={styles.album}>
            <b>最新专辑</b>
            <hr />
            <div className={styles.newBorn} >
                {newDiscs?.map(album => {
                    return <section key={album.id}>
                        <img src={album.picUrl} alt="图片无法显示" onClick={() => { navigate(`album?id=${album.id}`) }} />
                        <small onClick={() => { toArtistPage(album.artist) }}>
                            <Tooltip placement="top" title={album.artist.name} mouseEnterDelay={0.2}  overlayInnerStyle={{color:'black'}} color="#fff">
                                {album.artist.name}
                            </Tooltip>
                        </small>
                        <small onClick={() => { navigate(`album?id=${album.id}`) }}>
                        <Tooltip placement="bottom" title={album.name} mouseEnterDelay={0.2} overlayInnerStyle={{color:'black'}} color="#fff">
                                {album.name}
                            </Tooltip>
                        </small>
                    </section>

                })}
            </div>
        </div>
    )
}
export { RecommonList, NewDisc };
