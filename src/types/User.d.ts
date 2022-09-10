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