import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom"
import { Input, Tabs } from "antd"
import styles from "./styles/index.module.scss"
import constantsStore from "../../mobx/constants"
import SingleSong from './components/SingleSong'
import Singer from './components/Singer'

export default function SearchPage() {
  const [input] = useSearchParams();
  const { Search } = Input;
  const { SearchList } = constantsStore;
  const navigate = useNavigate();
  //搜索关键字
  const keywords = input.get("keywords");
  const [search, setSearch] = useState<string | null>("");
  //标签之间的间隔
  const [tabGap, setTabGap] = useState(0);
  //搜索的歌曲

  if (search !== keywords) {
    setSearch(keywords);
  }
  //点击搜索图标或者回车发送请求
  const getSearchData = (value: string) => {
    if (value) {
      navigate(`/search?keywords=${value}`);
    }
  }
  useEffect(() => {
    setTabGap(window.innerWidth * 0.75 / 10);
  }, []);
  //如果搜索关键字发生变化则发送请求
  useEffect(() => {
    getSearchData("");
  }, [search]);
  return (
    <div className={styles.search}>
      <header>
        <Search onSearch={getSearchData}
          style={{ width: "45%" }}
          size="large"
        />
      </header>
      {/* 导航 */}
      <div className={styles.tabs} >
        <Tabs size="large" tabBarGutter={tabGap} centered defaultActiveKey={String(SearchList.SingleSong)} >
          <Tabs.TabPane tab="单曲" key={SearchList.SingleSong}>
            <SingleSong keywords={keywords} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="歌手" key={SearchList.Singer}>
            <Singer keywords={keywords} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="专辑" key={SearchList.Album}>
          </Tabs.TabPane>
          <Tabs.TabPane tab="视频" key={SearchList.MV}>
          </Tabs.TabPane>
          <Tabs.TabPane tab="歌词" key={SearchList.Lyric}>
          </Tabs.TabPane>
          <Tabs.TabPane tab="歌单" key={SearchList.SongList}>
          </Tabs.TabPane>
          <Tabs.TabPane tab="用户" key={SearchList.User}>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}
