import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom"
import { Input, Tabs } from "antd"
import styles from "./styles/index.module.scss"
import constantsStore from "../../mobx/constants"
import SingleSong from './components/SingleSong'
import Singer from './components/Singer'
import Album from './components/Album'
export default function SearchPage() {
  const [input] = useSearchParams();
  const { Search } = Input;
  const { SearchList } = constantsStore;
  const navigate = useNavigate();
  //搜索关键字
  const keywords = input.get("keywords");
  const type=input.get("type")
  const [search, setSearch] = useState<string | null>("");
  //标签之间的间隔
  const [tabGap, setTabGap] = useState(0);
  //表示搜索的类型
  const [searchType, setSearchType] = useState(type);
  if (search !== keywords) {
    setSearch(keywords);
  }
  //点击搜索图标或者回车发送请求
  const getSearchData = (value: string) => {
    if (value) {
      navigate(`/search?keywords=${value}&type=${searchType}`);
    }
  }
  useEffect(() => {
    setTabGap(window.innerWidth * 0.75 / 10);
  }, []);
  //如果搜索关键字发生变化则发送请求
  useEffect(() => {
    getSearchData("");
  }, [search]);
  //切换标签时调用
  const changeTab=(activeKey:string)=>{
      setSearchType(activeKey);
      navigate(`/search?keywords=${keywords}&type=${activeKey}`)
  }
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
        <Tabs size="large" tabBarGutter={tabGap} centered
          defaultActiveKey={String(searchType)}
          onChange={changeTab}
        >
          <Tabs.TabPane tab="单曲" key={SearchList.SingleSong}>
            <SingleSong keywords={keywords} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="歌手" key={SearchList.Singer}>
            <Singer keywords={keywords} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="专辑" key={SearchList.Album}>
            <Album keywords={keywords} />
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
