//歌单组件
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from "./index.module.css"
import { transTime } from "../../utils/help"
import { PlayCircleOutlined } from "@ant-design/icons"
const columns: ColumnsType<Music.song> = [
    {
        dataIndex: 'index',
        key: 'id',
        width: 150,
        render: (text) => {
            return <span className={styles["song-order"]}>
                <>{text}</>
                <PlayCircleOutlined className={styles['song-order-svg']}/>
            </span>;
        },
    },
    {
        title: '歌曲标题',
        dataIndex: 'name',
        key: 'id',
        width: 200,
        render: (text) => {
            return <span className={styles['song-header']}>{text}</span>
        }
    },
    {
        title: '时长',
        dataIndex: "dt",
        key: "id",
        width: 150,
        render: (text) => {
            return <li>{transTime(text)}</li>
        }
    },
    {
        title: '歌手',
        dataIndex: "ar",
        key: "id",
        width: 150,
        render: (singers: Array<Music.song>) => {
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
        }
    },
    {
        title: '专辑',
        dataIndex: "al",
        key: "id",
        render: (album) => {
            return <span className={styles['song-album']}>{album.name}</span>
        }
    },
];


const Song = (props: { songs: Array<Music.song> | undefined }) => {
    return (
        <Table
            columns={columns}
            dataSource={props.songs}
            pagination={false}
            scroll={{ y: 385 }}//实现固定表头
        />
    )
};


export default Song;