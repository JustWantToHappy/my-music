//歌单组件
import { Table } from 'antd';
import styles from "./index.module.css"
import { transTime } from "../../utils/help"
import { PlayCircleOutlined } from "@ant-design/icons"
import { PlayBar } from "../../components/PlayBar"
import React from "react"
const { Column } = Table;

const Song = (props: { songs: Array<Music.song> | undefined }) => {
    //用于记录播放的歌曲
    let playArr: Array<boolean> = Array(props.songs?.length).fill(false);
    //播放列表(队列)
    let playList = Array(props.songs?.length);
    const [arr, setArr] = React.useState(playArr);
    //给播放条组件传递的歌曲信息
    const [song, setSong] = React.useState<Music.song>();
    const changePlayState = (index: number): void => {
        playArr[index] = true;
        setArr(playArr);
        setSong(props?.songs && props?.songs[index-1]);
    }
    
    return (
        <>
            <Table
                dataSource={props.songs}
                pagination={false}
                scroll={{ y: 385 }}//实现固定表头
            >
                <Column dataIndex="index" render={
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
                <Column title="歌曲标题" dataIndex="name"
                    render={(text: string) => {
                        return <span className={styles['song-header']}>{text}</span>
                    }}
                />
                <Column title="时长" dataIndex="dt"
                    render={(text) => {
                        return <li>{transTime(text,1)}</li>
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
            {/* 用于展示播放条的容器 */}
            {song && <PlayBar song={song} />}
        </>
    )
};


export default Song;