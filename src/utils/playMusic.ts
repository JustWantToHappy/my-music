import { musicIsUse } from "../api/songlist"
import { addLocalStorage } from "../utils/authorization"
import PubSub from "pubsub-js";
import constantsStore from "../mobx/constants"
const { playWay } = constantsStore;
//播放下一首音乐
export async function playNextMusic(song: Music.song, songs: Array<Music.song>, type: string): Promise<number> {
    let nextIndex = await getSongIndex(song, songs, type);
    //nextIndex===-1表示单曲循环
    nextIndex !== -1 && addLocalStorage([{ key: "song", value: JSON.stringify(songs[nextIndex]) }])
    return nextIndex;
}


//随机播放获取歌曲的下标
async function getRandomPlayMusicIndex(song: Music.song, songs: Array<Music.song>): Promise<number> {
    let nextIndex = 0;
    while (true) {
        let index = Math.ceil(Math.random() * songs.length);
        if (index < songs.length) {
            const { message } = await musicIsUse(songs[index].id);
            if (message === 'ok') {
                nextIndex = index;
                break;
            }
        }
    }
    return nextIndex;
}
//根据不同的播放方式得到下一首需要播放歌曲的下标
async function getSongIndex(song: Music.song, songs: Array<Music.song>, type: string) {
    let playway = localStorage.getItem("playway");
    let index = song.index - 1;
    let nextIndex = -1;
    switch (playway) {
        case playWay.ListPlay:
            while (true) {
                type === 'last' && (index = (index - 1 + songs.length) % songs.length);
                type === 'next' && (index = (index + 1) % songs.length);
                const { message } = await musicIsUse(songs[index].id);
                if (message === 'ok') {
                    nextIndex = index;
                    break;
                }
            }
            break;
        case playWay.OrderPlay:
            PubSub.publish("stopPlay", true);
            while (true) {
                type === 'next' && (index = index + 1);
                type === 'last' && (index = index - 1);
                if (index < songs.length && index >= 0) {
                    const { message } = await musicIsUse(songs[index].id);
                    if (message === 'ok') {
                        nextIndex = index;
                        break;
                    }
                } else {
                    break;
                }
            }
            break;
        case playWay.SingleCycle:
            break;
        case playWay.RandomPlay:
            nextIndex = await getRandomPlayMusicIndex(song, songs);
            break;
        default:
            break;
    }
    return nextIndex;
}
