//播放列表,id为歌单id
import PubSub from "pubsub-js";
//获取歌单中每一首歌曲
import { getListSong, musicIsUse } from "../api/songlist"
import { addLocalStorage } from "../utils/authorization"
import songsStore from "../mobx/songs"
export default async function playList(id: number) {
    try {
        let { songs } = await getListSong(id);
        let index = 0;
        for (let i = 0; i < songs.length; i++) {
            let res = await musicIsUse(songs[i].id);
            if (res.message === 'ok') {
                index = i;
                break;
            }
        }
        addLocalStorage([{ key: "songs", value: JSON.stringify(songs) }, { key: "song", value: JSON.stringify(songs[index]) }]);
        PubSub.publish("play", true);
        //当播放条切换歌曲时调用
        changeSong();
    } catch (e) {
        console.log(e);
    }
}
const changeSong = () => {
    PubSub.subscribe("changeMusic", async (_, type: string) => {
        if (songsStore.origin === 'home') {
            let songs: Array<Music.song> = JSON.parse(localStorage.getItem("songs") as string);
            let song: Music.song = JSON.parse(localStorage.getItem("song") as string);
            let playway = localStorage.getItem("playway");
            //当前播放歌曲的index在歌单中的序号
            let index = 0;
            for (let i = 0; i < songs.length; i++) {
                if (songs[i].id === song.id) {
                    index = i;
                    break;
                }
            }
            if (type === 'last') {
                index = await getLastSongIndex(index, song, songs, playway);
            } else if (type === 'next') {
                index = await getNextSongIndex(index, song, songs, playway);
            }
            addLocalStorage([{ key: "song", value: JSON.stringify(songs[index]) }]);
            PubSub.publish("play", true);
        }
    })
}
const getLastSongIndex = async (index: number, song: Music.song, songs: Array<Music.song>, playway: string | null) => {
    let former = index;
    if (song && songs.length > 0) {
        switch (playway) {
            case '1':
                while (true) {
                    index = (index - 1 + songs.length) % songs.length;
                    let res = await musicIsUse(songs[index].id);
                    if (res.message === 'ok') {
                        break;
                    }
                }
                break;
            case '2':
                while (index > 0) {
                    index--;
                    let res = await musicIsUse(songs[index].id);
                    if (res.message === 'ok') {
                        break;
                    }
                }
                break;
            case '4':
                while (true) {
                    index = Math.ceil(songs.length * Math.random());
                    let res = await musicIsUse(songs[index].id);
                    if (res.message === 'ok') {
                        break;
                    }
                }
                break;
            default:
                break;
        }
    }
    let res = await musicIsUse(songs[index].id);
    if (res.message === 'ok') {
        return index;
    }
    return former;
}
const getNextSongIndex = async (index: number, song: Music.song, songs: Array<Music.song>, playway: string | null) => {
    let former = index;
    if (songs && songs.length > 0) {
        switch (playway) {
            case '1':
                while (true) {
                    index = (index + 1) % songs.length;
                    let res = await musicIsUse(songs[index].id);
                    if (res.message === 'ok') {
                        break;
                    }
                }
                break;
            case '2':
                while (index < songs.length) {
                    index++;
                    let res = await musicIsUse(songs[index].id);
                    if (res.message === 'ok') {
                        break;
                    }
                }
                break;
            case '4':
                while (true) {
                    index = Math.ceil(songs.length * Math.random());
                    let res = await musicIsUse(songs[index].id);
                    if (res.message === 'ok') {
                        break;
                    }
                }
                break;
            default:
                break;
        }
    }
    let res = await musicIsUse(songs[index].id);
    if (res.message === 'ok') {
        return index;
    }
    return former;
}