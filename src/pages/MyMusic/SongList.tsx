import { useSearchParams, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { getListSong } from "../../api/songlist"
import { deleteSongList } from "../../api/user"
import Song from "../../components/Song";
import styles from "./styles/songlist.module.scss"
import { Button, Popconfirm } from "antd"
import { FormOutlined, DeleteOutlined } from "@ant-design/icons"
import PubSub from "pubsub-js";
const SongList = () => {
    interface myState {
        data: User.songList
        mylove: boolean
    }
    const [search, setSearch] = useSearchParams();
    const state = useLocation().state as myState;
    const currentlist = state.data;
    const mylove = state.mylove;
    const id = search.get("id");
    const navigate = useNavigate();
    const [songlist, setList] = useState<Array<Music.song>>();
    useEffect(() => {
        (async () => {
            let { songs } = await getListSong(parseInt(id as string));
            let arr: Array<Music.song> = [];
            songs.forEach((song: any, index: number) => {
                let obj: Music.song;
                obj = { index: index + 1, key: index, ...song };
                arr.push(obj);
            });
            setList(arr);
        })();
    }, [id]);
    //点击删除歌单
    const DeleteSongList = async () => {
        let res = await deleteSongList(currentlist.id);
        if (res.code === 200) {
            PubSub.publish("refresh");
        }
    }
    return (
        <div className={styles.songlist}>
            <header>
                <div>
                    <img src={currentlist.coverImgUrl} alt="图片无法显示" />
                </div>
                <div className={styles.content}>
                    <h3>{currentlist.name}</h3>
                    <figure>
                        <img alt="logo" src={currentlist.creator.avatarUrl} />
                        <div>
                            <small>{currentlist.creator.nickname}</small>
                            <small>{new Date(currentlist.createTime).toLocaleString()}创建</small>
                        </div>
                    </figure>
                    <small>歌单描述:&nbsp;{currentlist.description ? currentlist.description : '无'}</small>
                </div>
                {
                    !mylove && <div className={styles.btn}>
                        <span >
                            <FormOutlined onClick={() => { navigate(`/mymc/editsonglist?id=${id}`, { state: currentlist.name }) }} />
                            <Button type="text" onClick={() => { navigate(`/mymc/editsonglist?id=${id}`, { state: currentlist.name }) }}>编辑</Button>
                        </span>
                        <span >
                            <Popconfirm title="确定删除此歌单" icon={<DeleteOutlined style={{ color: 'black' }} />} okText="确定" cancelText="取消" onConfirm={DeleteSongList}>
                                <DeleteOutlined />
                                <Button type="text">删除</Button>
                            </Popconfirm>
                        </span>
                    </div>
                }
            </header >
            <div className={styles.head}>
                <span>
                    <h2>歌曲列表</h2>
                    <small>{songlist?.length}首歌</small>
                </span>
                <small>播放{currentlist.playCount}次</small>
            </div>
            <div className={styles.bar}></div>
            <Song songs={songlist} />
        </div >
    )
}
export default SongList;