//歌单组件
import { Table, Pagination, Popconfirm } from 'antd';
import styles from "./index.module.css"
import { transTime, removeSongFromSongList } from "../../utils/help"
import { PlayCircleOutlined, DeleteOutlined } from "@ant-design/icons"
import React, { useEffect } from "react"
import { addLocalStorage } from "../../utils/authorization";
import pubsub from "pubsub-js"
import { useSearchParams } from "react-router-dom"
import { musicIsUse } from '../../api/songlist';
import songsStore from "../../mobx/songs"
const { Column } = Table;

const Song = (props: { songs: Array<Music.song> | undefined, showOperation?: boolean }) => {
    songsStore.data = props.songs as Music.song[];
    //用于记录正在播放的歌曲，其值取true
    let playArr: Array<boolean> = Array(songsStore.data?.length).fill(false);
    const [arr, setArr] = React.useState(playArr);
    const [start, setStart] = React.useState(0);
    const [end, setEnd] = React.useState(20);
    const [pageSize, setPageSize] = React.useState(20);
    //歌单id
    const [search] = useSearchParams();
    const songListId = search.get("id");
    async function randomPlay() {
        while (true) {
            let index = Math.ceil((songsStore.data?.length as number) * Math.random());
            if (index < songsStore.data.length) {
                let obj1 = songsStore.data[index];
                var objStr = "";
                if (obj1) {
                    objStr = JSON.stringify(obj1);
                }
                let items = [{ key: "isPlay", value: "true" }, { key: "song", value: objStr }, { key: "playway", value: "4" }];
                let id = songsStore.data[index - 1].id;
                let res = await musicIsUse(id as number);
                if (res.message === 'ok') {
                    addLocalStorage(items);
                    let arr = Array(songsStore.data.length).fill(false);
                    arr[index + 1] = true;
                    setArr(arr);
                    pubsub.publish("play", true);
                    break;
                }
            }
        }
    }
    const changePlayState = async (index: number): Promise<any> => {
        playArr[index] = true;
        setArr(playArr);
        songsStore.origin = "other";
        let obj = JSON.stringify(props?.songs && props?.songs[index - 1]);
        let items = [{ key: "isPlay", value: "true" }, { key: "song", value: obj }, { key: "songs", value: JSON.stringify(props.songs) }];
        let id = props?.songs && props?.songs[index - 1].id;
        let { message } = await musicIsUse(id as number);
        if (message === 'ok') {
            addLocalStorage(items);
            //通知播放条播放音乐
            pubsub.publish("play", true);
        } else if (message.indexOf("亲爱的")) {
            message.info({ content: "亲爱的,暂无版权", styles: { marginTop: '40vh' } }, 1)
        }
    }
    useEffect(() => {
        pubsub.subscribe("changeMusic", async (_, type: string) => {
            try {
                let target = 0;
                let playway = localStorage.getItem("playway");
                let len = songsStore.data?.length as number;
                let obj = JSON.parse(localStorage.getItem("song") as string);
                let brr = Array(len).fill(false);
                if (type === 'last') {
                    switch (playway) {
                        case '1':
                            target = (obj.index - 2 + len) % len;
                            while (true) {
                                let id = songsStore.data && songsStore.data[target].id;
                                let { message } = await musicIsUse(id as number);
                                if (message === 'ok') {
                                    brr[target + 1] = true;
                                    setArr(brr);
                                    addLocalStorage([{ key: "song", value: JSON.stringify(songsStore.data && songsStore.data[target]) }]);
                                    pubsub.publish("play", true);
                                    break;
                                } else {
                                    target = (target - 1 + len) % len;
                                }
                            }
                            break;
                        case '2':
                            target = obj.index - 2;
                            while (true && target >= 0) {
                                let id = songsStore.data && songsStore.data[target].id;
                                let { message } = await musicIsUse(id as number);
                                if (message === 'ok') {
                                    if (target >= 0) {
                                        brr[target + 1] = true;
                                        setArr(brr);
                                        addLocalStorage([{ key: "song", value: JSON.stringify(songsStore.data && songsStore.data[target]) }]);
                                        pubsub.publish("play", true);
                                        break;
                                    }
                                } else {
                                    target -= 1;
                                }
                            }
                            break;
                        case '3':
                            pubsub.publish("play", true);
                            break;
                        case '4':
                            randomPlay();
                            break;
                        default:
                            break;
                    }

                } else if (type === 'next') {
                    switch (playway) {
                        case '1':
                            target = (obj.index) % len;
                            while (true) {
                                let id = songsStore.data && songsStore.data[target].id;
                                let { message } = await musicIsUse(id as number);
                                if (message === 'ok') {
                                    brr[target + 1] = true;
                                    setArr(brr);
                                    addLocalStorage([{ key: "song", value: JSON.stringify(songsStore.data && songsStore.data[target]) }]);
                                    pubsub.publish("play", true);
                                    break;
                                } else {
                                    target = (target + 1) % len;
                                }
                            }
                            break;
                        case '2':
                            target = obj.index;
                            if (target >= len) {
                                pubsub.publish("stopPlay", true);
                            }
                            while (true && target < len) {
                                let id = songsStore.data && songsStore.data[target].id;
                                let { message } = await musicIsUse(id as number);
                                if (message === 'ok') {
                                    brr[target + 1] = true;
                                    setArr(brr);
                                    addLocalStorage([{ key: "song", value: JSON.stringify(songsStore.data && songsStore.data[target]) }]);
                                    pubsub.publish("play", true);
                                    break;
                                } else {
                                    target++;
                                }
                            }
                            break;
                        case '3':
                            pubsub.publish("play", true);
                            break;
                        case '4':
                            randomPlay();
                            break;
                        default:
                            break;
                    }
                }
            } catch (e) { }
        })
    }, []);
    const changeCurrentPage = (current: number, size: number) => {
        setStart((current - 1) * size);
        setEnd(current * size);
    }
    return (
        <>
            <Table
                dataSource={props.songs?.slice(start, end)}
                pagination={false}
            // scroll={{ y: 385 }}实现固定表头
            >
                <Column dataIndex="index" key="index" width={100} render={
                    (text: number) => {
                        return <span className={styles["song-order"]}>
                            <>{text}</>
                            {/* 暂停按钮，点击播放音乐*/}
                            <span className="span-pause" onClick={() => { changePlayState(text) }}>
                                <PlayCircleOutlined className={!arr[text] ? styles['song-order-svg'] : styles['song-order-svg1']} />
                            </span>
                        </span>;
                    }
                } />
                <Column title="歌曲标题" dataIndex="name" key="name"
                    render={(text: string) => {
                        return <span className={styles['song-header']}>{text}</span>
                    }}
                />
                <Column title="时长" dataIndex="dt" width={100}
                    render={(text) => {
                        return <li>{transTime(text, 1)}</li>
                    }}
                />
                <Column title="歌手" dataIndex="ar"
                    render={(singers: Array<Music.song>) => {
                        return <div className={styles.song}>
                            {
                                singers.slice(0, 3).map(singer => {
                                    return (
                                        <span key={singer.id}>
                                            {singer.name}
                                        </span>
                                    )
                                })
                            }
                        </div>
                    }}
                />
                <Column title="专辑" dataIndex="al"
                    render={
                        (album) => {
                            return <span className={styles['song-album']}>{album.name}</span>
                        }
                    }
                />
                {props.showOperation && <Column title="操作" dataIndex="id"
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
            <Pagination total={props.songs?.length} style={{ float: "right", marginTop: "5vh", marginRight: "2vw" }} pageSize={pageSize} hideOnSinglePage onChange={changeCurrentPage} pageSizeOptions={[10, 15, 20]} onShowSizeChange={(current, size) => { setPageSize(size) }} />
        </>
    )
};


export default React.memo(Song);