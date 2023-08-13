import styles from "./index.module.scss"
import { CloseOutlined } from "@ant-design/icons"
import { addOrDeleteSongFromSongList } from "../../api/user"
import { message } from "antd"
import PubSub from "pubsub-js"
export default function CollectModal(props: { close: () => void, songId: number }) {
    const songList: Array<User.songList> = JSON.parse(localStorage.getItem("songlist") as string);
    //点击将歌曲加入歌单
    const addSongToSongList = async (listId: number) => {
        let res = await addOrDeleteSongFromSongList("add", String(listId), props.songId, localStorage.getItem("cookies") as string);
        if (res.status === 200) {
            message.success("收藏成功!", 1);
            PubSub.publish("getSongList");
        } else {
            message.error(res.message || res.msg, 2);
        }
        props.close();
    }
    return (
        <div className={styles.collect}>
            <div className={styles['collect-content']}>
                <header>
                    <h4>添加到歌单</h4>
                    <CloseOutlined onClick={() => { props.close() }} />
                </header>
                <ul>
                    {songList && songList.map((list) => {
                        return (
                            <div key={list.id} onClick={() => { addSongToSongList(list.id) }}>
                                <li className={styles['collect-songlist']} >
                                    <img src={list.coverImgUrl} alt="logo" />
                                    <div>
                                        <span>{list.name}</span>
                                        <small>{list.trackCount}首歌</small>
                                    </div>
                                </li>
                                <div className={styles['collect-divider']}></div>
                            </div>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}