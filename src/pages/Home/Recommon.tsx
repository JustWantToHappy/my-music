import { useEffect, useState } from "react"
import { getHightSongLists, getNewDiscs } from "../../api/recommond"
import { useNavigate } from "react-router-dom"
import  styles from "./recommon.module.css"
//最热歌单
const RecommonList = () => {
    const navigate = useNavigate();
    const [highSongLists, setHighSongLists] = useState<Array<Music.highLists>>();
    useEffect(() => {
        (async () => {
            const lists = await getHightSongLists();
            setHighSongLists(lists.playlists);
        })();
    }, []);
    return (
        <div className={styles.recommon}>
            <section className={styles.title}>
                <b>最热歌单</b>
                <span >更多</span>
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
    useEffect(() => {
        (async () => {
            const data = await getNewDiscs();
            setNewDiscs(data.albums);
        })();
    }, []);
    return (
        <div className={styles.newBorn}>
            <b>最新专辑</b>
            {newDiscs?.map(album => {
                return <section key={album.id}>
                    <img src={album.picUrl} alt="图片无法显示" />
                    <div>
                        <small>{album.artist.name}</small>
                        <small>{album.name}</small>
                    </div>
                </section>

            })}
        </div>
    )
}
export { RecommonList, NewDisc };
