declare namespace Music {
    //mv
    type recommomMv = {
        id: number;
        name: string;
        cover: string;
        playCount: number;
    }
    //一首歌
    type song = {
        index: number;//序号
        name: string;
        id: number;
        dt: number;//歌曲时长
        //歌手
        ar?: singer[];
        artists?: Array<singer>;
        //专辑
        al?: album;
        album?: ablum;
        publishTime: number;//歌曲发布时间
    }
    //歌单
    type highLists = {
        coverImgUrl: string;
        description: string;
        id: number;
        name: string;
        creator: any;
        tags: string[];//标签
        subscribers: any;//貌似是用户的信息头像，关于歌单的评论等
        creator: any;//制作歌单的人信息 
        tracks: Array<song>;//歌单中每一首歌曲信息
    }
    //歌手
    type singer = {
        id: number;
        name: string;
        picUrl: string;
        musicSize?: number; //歌曲数量
        albumSize?: number; // 专辑数量
        mvSize?: number; // mv 数量
        briefDesc?: string; // 简单描述
        alias: string[];//别名
        followed: boolean;//我是否关注
    }
    //专辑
    type album = {
        id: number;
        name: string;
        company: string;//发行公司
        picUrl: string;//专辑封面
        artist: singer;//歌手
        publishTime: number;//发布时间
        description: string;//专辑描述
    }
    //精品歌单标签
    type tags = {
        id: number;
        name: string;
        type: number;
        category: number;//5个分类(0~4)
    }
}
declare namespace User {
    //用户信息
    type account = {
        userId: number;
        playlistCount: number;//歌单数量
        nickname: string;//用户昵称
        gender: number;//0表示女，1表示男
        follows: number;//我关注的数量
        followeds: number;//粉丝数量
        city: number;//所在城市
        province: number;//所在省份
        birthday: number;//出生日期
        backgroundUrl: string;//背景图
        avatarUrl: string;//头像
        description: string;

    }
    //用户歌单
    type songList = {
        creator: account;//歌单建立者
        createTime: number;
        tags: [];
        name: string;
        id: number;
        coverImgUrl: string;//歌单封面
        updateTime: number;//更新时间
        description: string;
        playCount: number;//播放次数
        trackCount: number;//歌单中歌曲数量
    }
    //用户推荐歌单
    type recommendList = {
        copywriter: string;//歌单介绍
        id: number;
        name: string;
        picUrl: string;
        playcount: number;
        trackCount: number;
        userId: number;//歌单建立者id
        creator: account;//歌单建立者
    }
}