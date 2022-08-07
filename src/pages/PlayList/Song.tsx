//歌单组件
import { Table } from 'antd';
import styles from "./index.module.css"
import { transTime } from "../../utils/help"
import { PlayCircleOutlined } from "@ant-design/icons"
import React from "react"
import { addLocalStorage } from "../../utils/authorization";
import pubsub from "pubsub-js"
const { Column } = Table;

const Song = (props: { songs: Array<Music.song> | undefined }) => {
    //用于记录播放的歌曲
    let playArr: Array<boolean> = Array(props.songs?.length).fill(false);
    //播放列表(队列)
    let playList = Array(props.songs?.length);
    const [arr, setArr] = React.useState(playArr);
    const changePlayState = (index: number): void => {
        playArr[index] = true;
        setArr(playArr);
        let obj = JSON.stringify(props?.songs && props?.songs[index - 1]);
        let items = [{ key: "isPlay", value: "true" }, { key: "song", value: obj }];
        addLocalStorage(items);
        //通知播放条播放音乐
        pubsub.publish("play", true);
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