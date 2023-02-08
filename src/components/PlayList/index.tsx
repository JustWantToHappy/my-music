import React from 'react'
import styles from "./index.module.scss";
import PlayContent from './components/PlayContent';
import Lyric from './components/Lyric';
export default function PlayList() {
    return (
        <div className={styles.playlist} onClick={e => e.stopPropagation()}>
            <PlayContent />
            <Lyric />
        </div>
    )
}
