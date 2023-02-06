import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Table } from 'antd';
import { PlayCircleOutlined } from "@ant-design/icons"
import dayjs from 'dayjs';
import styles from "./index.module.scss"
import { musicIsUse } from "../../api/songlist"
import { addLocalStorage } from "../../utils/authorization"
import songsStore from "../../mobx/songs"
import PubSub from 'pubsub-js';
export default function RankSong(props: { songs: Array<Music.song> | undefined }) {
    const { Column } = Table;
    const navigate = useNavigate();
    //用于表示当前正在播放的歌曲
    const [song, setSong] = useState<Music.song>();
    const [songs, setSongs] = useState<Array<Music.song>>(props.songs as Music.song[]);
    if (props.songs !== songs) {
        props.songs && setSongs(props.songs);
    }
    //点击播放音乐
    const playMusic = async (currentSong: Music.song) => {
        songsStore.origin = "rank"
        setSong(currentSong);
        let { message } = await musicIsUse(currentSong.id);
        if (message === 'ok') {
            let items = [{ key: "isPlay", value: "true" }, { key: "song", value: JSON.stringify(currentSong) }, { key: "songs", value: JSON.stringify(songs) }]
            addLocalStorage(items);
            PubSub.publish("play", true);
        } else {
            message.info({ content: "亲爱的,暂无版权", style: { marginTop: '40vh' } }, 1);
        }
    }
    useEffect(() => {
    }, []);
    return (
        <div className={styles.table}>
            <Table dataSource={songs} pagination={false}>
                <Column title="" dataIndex="index" key="index" />
                <Column title="标题" dataIndex="name" key="name" render={(songName: string, currentSong: Music.song) => {
                    return <div className={styles.title}>
                        <span onClick={() => playMusic(currentSong)} style={song && currentSong.id === song.id ? { opacity: 1, color: "#F53F3F" } : {}} >
                            <PlayCircleOutlined />
                        </span>
                        <span>{songName}</span>
                    </div>
                }} />
                <Column title="时长" dataIndex="dt" key="dt" render={(dt: number) => {
                    return <>
                        {dayjs(dt).format("mm:ss")}
                    </>
                }} />
                <Column
                    title="歌手"
                    dataIndex="ar"
                    key="ar"
                    className={styles.singer}
                    render={(ar: Array<Music.singer>) => (
                        <>
                            {ar.slice(0, 2).map((artist, index) => {
                                return <span key={artist.id} className={styles.artist}>
                                    <span onClick={() => { navigate(`/artist?id=${artist.id}`) }}> {artist.name}</span>
                                    {ar.length > 1 && index < 1 && ' / '}
                                </span>
                            })}
                            {ar.length > 2 && '  ...'}
                        </>
                    )}
                />

            </Table>
        </div>
    )
}
