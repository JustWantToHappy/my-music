//歌曲列表组件
import { Table, Pagination, Popconfirm } from 'antd';
import styles from "./index.module.css"
import { transTime, removeSongFromSongList } from "../../utils/help"
import { PlayCircleOutlined, DeleteOutlined, PropertySafetyFilled } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import React from "react"
import { useSearchParams } from "react-router-dom"
import { observer } from "mobx-react";
import { runInAction } from 'mobx';
import playlist from '../../mobx/playlist';
const { Column } = Table;
interface Iprops {
    songs: Array<Music.song> | undefined,
    showOperation?: boolean,
}
const Song: React.FC<Iprops> = observer(function (props) {
    const [start, setStart] = React.useState(0);
    const [end, setEnd] = React.useState(20);
    const pageSize = 20;
    //歌单id
    const [search] = useSearchParams();
    const songListId = search.get("id");
    const navigate = useNavigate();
    const changeCurrentPage = (current: number, size: number) => {
        setStart((current - 1) * size);
        setEnd(current * size);
    }
    const getCurrentIndex = function (index: number) {
        return start + index + 1;
    }
    const playMusic = (song: Music.song) => {
        runInAction(() => {
            playlist.song = song;
            playlist.add(song);
            playlist.changeState(true);
        })
    }
    const playSong = playlist.song;
    return (
        <>
            <Table
                dataSource={props.songs?.slice(start, end)}
                pagination={false}
                rowKey={"id"}
            >
                <Column dataIndex="id" key="id" width={100} render={
                    (id: number, song: Music.song, index: number) => {
                        return <span className={styles["song-order"]}>
                            {/* 暂停按钮，点击播放音乐*/}
                            <>{getCurrentIndex(index)}</>
                            <span className="span-pause" onClick={() => { playMusic(song) }}>
                                <PlayCircleOutlined
                                    className={playSong && playSong.id === id ? styles["song-order-svg1"] : styles['song-order-svg']}
                                />
                            </span>
                        </span>;
                    }
                } />
                <Column title="歌曲标题" dataIndex="name" key="name"
                    render={(text: string) => {
                        return <span className={styles['song-header']}>{text}</span>
                    }}
                />
                <Column title="时长" dataIndex="dt" width={100} key="dt"
                    render={(text) => {
                        return <li>{transTime(text, 1)}</li>
                    }}
                />
                <Column title="歌手" dataIndex="ar" key="ar"
                    render={(singers: Array<Music.song>) => {
                        return <div className={styles.song}>
                            {
                                singers.slice(0, 3).map(singer => {
                                    return (
                                        <span key={singer.id} onClick={() => { navigate(`/artist?id=${singer.id}`); }}>
                                            {singer.name}
                                        </span>
                                    )
                                })
                            }
                        </div>
                    }}
                />
                <Column title="专辑" dataIndex="al" key="al"
                    render={
                        (album: Music.album) => {
                            return <span className={styles['song-album']} onClick={() => navigate(`/home/album?id=${album.id}`)}>{album.name}</span>
                        }
                    }
                />
                {props.showOperation && <Column title="操作" dataIndex="id" key="id"
                    render={
                        (text: number) => {
                            return <div className={styles['song-operation']}>
                                <Popconfirm title="从歌单中移出此歌曲" okText="确认" cancelText="取消" icon={<DeleteOutlined />} onConfirm={() => { removeSongFromSongList(songListId as string, text) }}>
                                    <DeleteOutlined />
                                </Popconfirm>
                            </div>
                        }
                    }
                />}
            </Table>
            <Pagination total={props.songs?.length} style={{ float: "right", marginTop: "5vh", marginRight: "2vw" }} pageSize={pageSize} hideOnSinglePage onChange={changeCurrentPage} showSizeChanger={false} />
        </>
    )
});

export default React.memo(Song);