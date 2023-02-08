import React from 'react'
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.scss";
import playlist from '../../../mobx/playlist';
export default function Lyric() {
    const { song } = playlist;
    return (
        <div className={styles.lyric}>
            <header>
                <span>{song.name}</span>
                <span><CloseCircleOutlined onClick={() => playlist.isShow = false} /></span>
            </header>
            <div className={styles["lyric-content"]}>
                <p>作词</p>
                <p>作词得分的说法是地方VS地方胜多负少东风的方式</p>
                <p>作词</p>
                <p>作词</p>
                <p>作词</p>
                <p>作词</p>
                <p>作词</p>
                <p>作词</p>
                <p>作词</p>
                <p>作词</p>
            </div>
        </div>
    )
}
