import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchList, getListSong } from "../../api/songlist"
import styles from "./index.module.css"
import Song from "./Song"
const Onmit = (props: { isLong: boolean | undefined } = { isLong: false }) => {
    let { isLong } = props;
    if (isLong) {
        return (
            <>...</>
        )
    } else {
        return null;
    }
}
const PlayList = () => {
    const { id } = useParams();
    interface list {
        playlist: {
            description: string,
            tags: Array<string>,
            coverImgUrl: string,
            name: string,
            creator:{avatarUrl:string,nickname:string}//歌单建立者
        }
    };
    const [list, setList] = useState<list>();
    const [songs, setSongs] = useState<Array<Music.song>>();
    //拿取歌单信息
    useEffect(() => {
        (async function () {
            //获取歌单详情
            let ls = await fetchList(parseInt(id as string));
            await setList(ls);
        })();
        (async function () {
            //获取歌单中每首歌
            let sgs = await getListSong(parseInt(id as string));
            setSongs(sgs.songs);
        })();
    }, []);
    return (
        <>
            <div className={styles.container}>
                <span></span>
                <div className={styles.list}>
                    <span>
                        <img src={list?.playlist.coverImgUrl} alt="图片无法显示" />
                        <h4>歌单:{list?.playlist.name}</h4>
                        <div className={styles.creator}>
                            <img src={list?.playlist.creator.avatarUrl} alt="图片无法显示" />
                            <span>{list?.playlist.creator.nickname}</span>
                        </div>
                        <span>标签：{list?.playlist.tags.join("、")}</span>
                        <p>
                            {list?.playlist.description?.substring(0, 150)}
                            ...
                        </p>
                        <span id="symbol"></span>
                    </span>
                    <span className={styles.songs}>
                        <div >
                            <h3>歌曲列表</h3>
                            <small>共{songs?.length}首歌曲</small>
                        </div>
                        <hr />
                        <Song songs={songs}/>
                    </span>
                </div>
            </div>
        </>
    )
}
export default PlayList;