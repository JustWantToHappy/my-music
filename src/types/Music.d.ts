declare namespace Music {
    //推荐mv，轮播图
    type recommomMv = {
        id: number;
        name: string;
        cover: string;
        playCount: number;
    }
    //一首歌
    type song = {
        index: number;//序号
        key: number;
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
    type list = {
        ToplistType: string;
        coverImgUrl: string;
        description: string;
        id: number;
        name: string;
        tags: string[];//标签
        subscribers: any;//貌似是用户的信息头像，关于歌单的评论等
        creator: User.account;//制作歌单的人信息 
        tracks: Array<song>;//歌单中每一首歌曲信息
        playCount: number;//播放次数
        highQuality: true;
        commentCount: number;//歌单评论数
        commentThreadId: number;//歌单评论id
        createTime: number;//歌单创建时间
        shareCount: number;//分享数
        trackCount: number;//歌单中所有歌曲数量
        copywriter: string;//歌单签名
    }
    //歌手
    type singer = {
        id: number;
        name: string;
        cover: string;
        picUrl: string;
        musicSize?: number; //歌曲数量
        albumSize?: number; // 专辑数量
        videoCount?: number;//视频数量
        mvSize?: number; // mv 数量
        briefDesc?: string; // 简单描述
        followed: boolean;//我是否关注
        blacklist: boolean;//用户是否在黑名单中
        identifyTag: string[];//身份标签
        identities: string[];
        user: User.account
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
        blurPicUrl: string;//专辑封面?
        type: string;
        size: number;//歌曲数量
    }
    //精品歌单标签
    type tag = {
        name: string;
        type: number;
        category: number;//5个分类(0~4)
        hot: boolean;//表示是否最火
        resourceCount: number;//表示该标签下歌曲数量

    }
    //排行榜榜单
    type rank = {
        //'S'表示飙升榜，'N'表示新歌榜，'O'表示原创榜，'H'表示热歌榜，没有该字段表示普通榜单
        ToplistType: string;
        coverImgUrl: string;
        createTime: number;//创建时间
        description: string;
        id: number;
        name: string;
        playCount: number;//播放次数
        subscribedCount: number;//订阅次数
        trackCount: number;//所有歌曲数量
        trackNumberUpdateTime: number;
        trackUpdateTime: number;
        //该榜单前几名的歌曲名和歌手名
        tracks: Array<{ first: string, second: string }>
        updateFrequency: string;//更行频率
        updateTime: number;//上次更新时间
        tags: string[];//榜单标签
    }
    //mv
    type mv = {
        id: number;
        //应该是歌曲别名
        alias: string | null;
        artistId: number;
        artistName: string;
        cover: string;
        duration: number;
        name: string;
        playCount: number;
        artists: Array<{ id: number, name: string, alias: string[], transNames: string[] }>;
        desc: string | null;
        briefDesc: string | null;
    }
}