//歌单组件,此组件目前尚未使用
import { Table, Pagination } from 'antd';
import styles from "./index.module.css"
import { transTime } from "../../utils/help"
import { PlayCircleOutlined } from "@ant-design/icons"
import React from "react"
import { addLocalStorage } from "../../utils/authorization";
import pubsub from "pubsub-js"
import { musicIsUse } from '../../api/songlist';
const { Column } = Table;

const Song = (props: { songs: Array<Music.song> | undefined }) => {
    //用于记录正在播放的歌曲，其值取true
    let playArr: Array<boolean> = Array(props.songs?.length).fill(false);
    const [arr, setArr] = React.useState(playArr);
    const [start, setStart] = React.useState(0);
    const [end, setEnd] = React.useState(20);
    const [pageSize, setPageSize] = React.useState(20);
    const changePlayState = async (index: number): Promise<any> => {
        playArr[index] = true;
        setArr(playArr);
        let obj = JSON.stringify(props?.songs && props?.songs[index - 1]);
        let items = [{ key: "isPlay", value: "true" }, { key: "song", value: obj }];
        let id = props?.songs && props?.songs[index - 1].id;
        let { message } = await musicIsUse(id as number);
        if (message === 'ok') {
            addLocalStorage(items);
            //通知播放条播放音乐
            pubsub.publish("play", true);
        }
        async function randomPlay() {
            while (true) {
                index = Math.ceil((props.songs?.length as number) * Math.random());
                let obj1 = props?.songs && props?.songs[index];
                var objStr = "";
                if (obj1) {
                    objStr = JSON.stringify(obj1);
                }
                let items = [{ key: "isPlay", value: "true" }, { key: "song", value: objStr }, { key: "playway", value: "4" }];
                let id = props?.songs && props?.songs[index - 1].id;
                let { message } = await musicIsUse(id as number);
                if (message === 'ok') {
                    addLocalStorage(items);
                    let arr = Array(props.songs?.length).fill(false);
                    arr[index + 1] = true;
                    setArr(arr);
                    pubsub.publish("play", true);
                    break;
                }
            }
        }
        //接收改变播放方式的通知
        pubsub.subscribe("playway", async function (_, type: string) {
            try {
                let obj = JSON.parse(localStorage.getItem("song") as string);
                let index = obj.index - 1;
                let len = props.songs?.length as number;
                if (type === "1") {
                    while (true) {
                        let target = (++index) % len;
                        let obj1 = props?.songs && props?.songs[target];
                        if (obj1) {
                            let { message } = await musicIsUse(obj1.id);
                            if (message === 'ok') {
                                let items = [{ key: "isPlay", value: "true" }, { key: "song", value: JSON.stringify(obj1) }, { key: "playway", value: "1" }];
                                addLocalStorage(items)
                                //通知播放条播放音乐
                                pubsub.publish("play", true);
                                let arr = Array(props.songs?.length).fill(false);
                                arr[target + 1] = true;
                                setArr(arr);
                                break;
                            }
                        }
                    }
                } else if (type === '2') {
                    while (true) {
                        let target = ++index;
                        if (target >= len) {
                            pubsub.publish("stopPlay", true);
                        }
                        if (target < len) {
                            let obj1 = props?.songs && props?.songs[target];
                            let { message } = obj1 && await musicIsUse(obj1.id);
                            if (message === 'ok') {
                                let items = [{ key: "isPlay", value: "true" }, { key: "song", value: JSON.stringify(obj1) }, { key: "playway", value: "1" }];
                                addLocalStorage(items)
                                //通知播放条播放音乐
                                pubsub.publish("play", true);
                                let arr = Array(props.songs?.length).fill(false);
                                arr[target + 1] = true;
                                setArr(arr);
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                } else if (type === '4') {
                    randomPlay();
                }
            } catch (e) {

            }
        })
        pubsub.subscribe("changeMusic", async (_, type: string) => {
            try {
                let target = 0;
                let playway = localStorage.getItem("playway");
                let len = props.songs?.length as number;
                let obj = JSON.parse(localStorage.getItem("song") as string);
                // console.log(obj, 122, 'Song.tsx');
                let brr = Array(len).fill(false);
                if (type === 'last') {
                    switch (playway) {
                        case '1':
                            target = (obj.index - 2 + len) % len;
                            while (true) {
                                let id = props.songs && props.songs[target].id;
                                let { message } = await musicIsUse(id as number);
                                if (message === 'ok') {
                                    brr[target + 1] = true;
                                    setArr(brr);
                                    addLocalStorage([{ key: "song", value: JSON.stringify(props.songs && props.songs[target]) }]);
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
                                let id = props.songs && props.songs[target].id;
                                let { message } = await musicIsUse(id as number);
                                if (message === 'ok') {
                                    if (target >= 0) {
                                        brr[target + 1] = true;
                                        setArr(brr);
                                        addLocalStorage([{ key: "song", value: JSON.stringify(props.songs && props.songs[target]) }]);
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
                                let id = props.songs && props.songs[target].id;
                                let { message } = await musicIsUse(id as number);
                                if (message === 'ok') {
                                    brr[target + 1] = true;
                                    setArr(brr);
                                    addLocalStorage([{ key: "song", value: JSON.stringify(props.songs && props.songs[target]) }]);
                                    pubsub.publish("play", true);
                                    break;
                                } else {
                                    target = (target + 1) % len;
                                }
                            }
                            break;
                        case '2':
                            target = obj.index;
                            while (true && target < len) {
                                let id = props.songs && props.songs[target].id;
                                let { message } = await musicIsUse(id as number);
                                if (message === 'ok') {
                                    brr[target + 1] = true;
                                    setArr(brr);
                                    addLocalStorage([{ key: "song", value: JSON.stringify(props.songs && props.songs[target]) }]);
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
    }
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
                            {/* 暂停按钮*/}
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
                                singers.map(singer => {
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
            </Table>
            <Pagination total={props.songs?.length} style={{ float: "right", marginTop: "5vh", marginRight: "2vw" }} pageSize={pageSize} hideOnSinglePage onChange={changeCurrentPage} pageSizeOptions={[10, 15, 20]} onShowSizeChange={(current, size) => { setPageSize(size) }} />
        </>
    )
};


export default React.memo(Song);