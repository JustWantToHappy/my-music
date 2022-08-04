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
}
//声明可以使用css模块化
declare module "*.css";