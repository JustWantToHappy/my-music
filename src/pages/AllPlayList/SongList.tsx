import { useState, useEffect } from 'react'
import { Pagination } from "antd"
import styles from "./styles/songlist.module.scss"
import { getHightSongLists } from "../../api/recommond"
export default function SongList(props: { cat: string, total: number }) {
    const { cat, total } = props;
    //每页显示的歌单数量
    const [pageSize, setPageSize] = useState(35);
    //当前页
    const [current, setCurrent] = useState(1);
    useEffect(() => {
        (async () => {
            const res = await getHightSongLists(35, cat, (current - 1) * pageSize);
            console.log(res, 'sbbbb');
        })();
    }, []);
    return (
        <>
            <div className={styles.songlist}>

            </div>
            {/* 分页 */}
            <footer>
                <Pagination defaultCurrent={current} total={total} />
            </footer>
        </>
    )
}
