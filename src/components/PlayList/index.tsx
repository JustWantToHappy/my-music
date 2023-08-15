import React from 'react'
import styles from "./index.module.scss";
import PlayContent from './components/PlayContent';
import Lyric from './components/Lyric';

export interface Props {
    container: HTMLDivElement | null,
}

const PlayList: React.FC<Props> = (props) => {
    return (
        <div
            className={styles.playlist}
            onClick={e => e.stopPropagation()} >
            <PlayContent />
            <Lyric {...props} />
        </div>
    )
}

export default React.memo(PlayList);
