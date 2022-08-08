//歌单组件
import { Table } from 'antd';
import styles from "./index.module.css"
import { transTime } from "../../utils/help"
import { PlayCircleOutlined } from "@ant-design/icons"
import React from "react"
import { addLocalStorage } from "../../utils/authorization";
import pubsub from "pubsub-js"
import { musicIsUse } from '../../api/songlist';
const { Column } = Table;

const Song = (props: { songs: Array<Music.song> | undefined }) => {
    //用于记录播放的歌曲
    let playArr: Array<boolean> = Array(props.songs?.length).fill(false);
    const [arr, setArr] = React.useState(playArr);
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
        //接收改变播放方式的通知
        pubsub.subscribe("playway", async function (_, type) {
            try {
                if (type === "1") {
                    let obj = JSON.parse(localStorage.getItem("song") as string);
                    let index = obj.index - 1;
                    while (true) {
                        let len = props.songs?.length as number;
                        let target=(++index) % len;
                        let obj1 = props?.songs && props?.songs[target];
                        if (obj1) {
                            let { message } = await musicIsUse(obj1.id);
                            if (message === 'ok') {
                                let items = [{ key: "isPlay", value: "true" }, { key: "song", value: JSON.stringify(obj1) }, { key: "playway", value: "1" }];
                                addLocalStorage(items)
                                //通知播放条播放音乐
                                pubsub.publish("play", true);
                                let arr = Array(props.songs?.length).fill(false);
                                arr[target+1] = true;
                                setArr(arr);
                                break;
                            }
                        }
                    }
                } else if (type === '2') {
                    
                } else if (type === '4') {
                    console.log("hhh")
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
            } catch (e) {

            }
        })
    }
    return (
        <>
            <Table
                dataSource={props.songs}
                pagination={false}
                scroll={{ y: 385 }}//实现固定表头
            >
                <Column dataIndex="index" key="index" render={
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
                <Column title="时长" dataIndex="dt"
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
        </>
    )
};


export default React.memo(Song);