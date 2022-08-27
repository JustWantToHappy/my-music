import { useState, useEffect } from 'react'
import styles from "./index.module.scss"
import { fetchTopListDetail } from "../../api/rank"
export default function Rank() {
    //用于判断那个榜单目前被选中
    const [current, setCurrent] = useState(0);
    //特色榜
    const [special, setSpecial] = useState<Array<Music.rank>>([]);
    //媒体榜
    const [media, setMedia] = useState<Array<Music.rank>>([]);
    useEffect(() => {
        (async () => {
            const res = await fetchTopListDetail();
            console.log(res, 'sdfsj')
            if (res.code === 200) {
                // console.log(res.artistToplist);歌手榜前三
                let arr: Array<Music.rank> = [];
                let brr: Array<Music.rank> = [];
                setCurrent(res.list[0].id);
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
    return (
        <div className={styles.rank}>
            <div className={styles.side}>
                <h4>云音乐特色榜</h4>
                <ul className={styles.special}>
                    {special.map(rank => {
                        return <li key={rank.id} style={{ background: rank.id === current ? '#CDD0D6' : "" }} onClick={() => setCurrent(rank.id)}>
                            <img src={rank.coverImgUrl} alt="logo" />
                            <small>{rank.name}</small>
                            <small>{rank.updateFrequency}</small>
                        </li>
                    })}
                </ul>
                <h4>全球媒体榜</h4>
                <ul className={styles.media}>
                    {media.map(rank => {
                        return <li key={rank.id} style={{ background: rank.id === current ? '#CDD0D6' : "" }} onClick={() => setCurrent(rank.id)}>
                            <img src={rank.coverImgUrl} alt="logo" />
                            <small>{rank.name}</small>
                            <small>{rank.updateFrequency}</small>
                        </li>
                    })}
                </ul>
            </div>
            <div className={styles.content}>

            </div>
        </div>
    )
}
