//歌单组件
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from "./index.module.css"
const columns: ColumnsType<Music.song> = [
    {
        dataIndex: 'index',
        key: 'id',
        render: text => <li>1</li>,
    },
    {
        title: '歌曲标题',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '时长',
        dataIndex: "dt",
        key: "dt"
    },
    {
        title: '歌手',
        dataIndex: "ar",
        key: "ar",
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
        key: "al",
        render: (album) => {
            return <>{album.name}</>
        }
    },
];


const Song = (props: { songs: Array<Music.song> | undefined }) => {
    return (
        <Table columns={columns} dataSource={props.songs} pagination={false} />
    )
};


export default Song;