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
    const deleteSong = function (event: React.MouseEvent, id: number) {
        playlist.delete(id);
        event.stopPropagation();
    }
    const playMusic = (song: Music.song) => {
        playlist.song = song;
        playlist.changeState(true);
    }
    return (
        <div className={styles.playlist}>
            <header>
                <span>播放列表({size})</span>
                <span><CloseCircleOutlined onClick={() => playlist.isShow = false} /></span>
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
                            onClick={() => playMusic(song)}
                        >
                            <span style={song.id === playSong.id ? { color: "#f53f3f" } : {}}>
                                {song.id === playSong.id && <CaretRightOutlined />}
                            </span>
                            <span>
                                <a href="" title={song.name}>{song.name}</a>
                            </span>
                            <span>
                                <i><HeartOutlined /></i>
                                <i onClick={e => deleteSong(e, song.id)}><DeleteOutlined /></i>
                            </span>
                            <span>
                                <a href="" title={song.ar && song.ar.map(ar => ar.name).join("/")}>
                                    {song.ar && song.ar.map(ar => ar.name).join("/")}
                                </a>
                            </span>
                            <span>{transTime(song.dt, 2)}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
