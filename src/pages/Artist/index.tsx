import styles from "./index.module.scss"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Song from "../../components/Song"
import { fetchAllSongBySingerId, fetchFiftySongs, fetchSingerDes } from "../../api/artist"
import { Tabs } from 'antd';
import React from 'react';

const { TabPane } = Tabs;

const onChange = (key: string) => {
};


const Artist = () => {
    const location = useLocation();
    let singer = location.state as Music.singer;
    //歌手所有歌曲
    const [songs, setSongs] = useState<Array<Music.song>>();
    //歌手50首热门歌曲
    const [fiftySongs, setFifty] = useState<Array<Music.song>>();
    //歌手介绍
    const [desc, setDesc] = useState("")
    const handleRequst = (res: any) => {
        let arr: Array<Music.song> = [];
        // console.log(res.songs[0])
        for (let i = 0; i < res.songs.length; i++) {
            let song: Music.song;
            song = {
                index: i + 1,
                al: res.songs[i].al,
                album: res.songs[i].al,
                ar: res.songs[i].ar,
                artists: res.songs[i].ar,
                id: res.songs[i].id,
                name: res.songs[i].name,
                dt: res.songs[i].dt,
                publishTime: 0
            }
            arr.push(song);
        }
        return arr;
    }
    const getAllSongs = async () => {
        let res = await fetchAllSongBySingerId(singer.id);
        let arr = handleRequst(res);
        setSongs(arr);
    }
    const getFiftySongs = async () => {
        let res = await fetchFiftySongs(singer.id);
        let arr = handleRequst(res);
        setFifty(arr);
    }
    const getSingerDes = async () => {
        let res = await fetchSingerDes(singer.id);
        setDesc(res.briefDesc);
    }
    useEffect(() => {
        getAllSongs();
        getFiftySongs();
        getSingerDes();
    }, []);
    return (
        <div className={styles.artist}>
            <div className={styles.content}>
                <span>
                    <h1>{singer.name}</h1>
                    <span> {singer.alias.join("、")}</span>
                </span>
                <img src={singer.picUrl} alt="logo" />
                <hr />
                <Tabs defaultActiveKey="1" onChange={onChange}>
                    <TabPane tab="全部歌曲" key="1">
                        <div className={styles.songs}>
                            <Song songs={songs} />
                        </div>
                    </TabPane>
                    <TabPane tab="热门50首" key="2">
                        <div>
                            <Song songs={fiftySongs} />
                        </div>
                    </TabPane>
                    <TabPane tab="艺人介绍" key="3">
                        <div className={styles.description}>
                            <span>{desc}</span>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}
//歌手
export default Artist;