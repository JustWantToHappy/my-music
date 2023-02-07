import React from 'react'
import {
    CloseCircleOutlined,
    DeleteOutlined,
    CaretRightOutlined,
    HeartOutlined
} from "@ant-design/icons"
import styles from "./index.module.scss";
import playlist from '../../mobx/playlist';
import { transTime } from '../../utils/help';

//播放列表组件
export default function PlayList() {
    const { size, songs, song: playSong } = playlist;
    return (
        <div className={styles.playlist}>
            <header>
                <span>播放列表({size})</span>
                <span><CloseCircleOutlined /></span>
                <div>
                    <span><DeleteOutlined /></span>
                    <span onClick={() => { playlist.clearAll() }}>清除</span>
                </div>
            </header>
            {size === 0 && <p>你还没有添加任何歌曲</p>}
            <ul className={styles.songlist}>
                {songs.map(song => {
                    return (
                        <li
                            className={styles.song}
                            key={song.id}
                            style={song.id === playSong.id ? { background: "rgba(0,0,0,0.8)" } : {}}
                        >
                            <span style={song.id === playSong.id ? { color: "#f53f3f" } : {}}>
                                {song.id === playSong.id && <CaretRightOutlined />}
                            </span>
                            <span>{song.name}</span>
                            <span>
                                <i><HeartOutlined /></i>
                                <i
                                    onClick={
                                        () => {
                                            playlist.delete(song.id)
                                        }
                                    }><DeleteOutlined /></i>
                            </span>
                            <span>
                                {song.ar && song.ar.map(ar => ar.name).join("/")}
                            </span>
                            <span>{transTime(song.dt, 2)}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
