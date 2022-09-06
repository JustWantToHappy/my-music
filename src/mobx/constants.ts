//全局常量
import { observable } from "mobx"
//播放方式
enum playway {
    ListPlay = '1',
    OrderPlay = '2',
    SingleCycle = '3',
    RandomPlay = '4'
}
const constantsStore = {
    publicURL: "http://localhost:5000",
    playWay: playway
}
export default observable(constantsStore);