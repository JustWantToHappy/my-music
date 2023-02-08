/**
 * 播放条组件reducer
 */
import type { PlayBarType } from "../components/PlayBar";

export enum PlayBarAction{
    Change = "changestate",//给state对象替换一些属性
    shrinkPlayBar = "shrink",//收起播放条
}
export default function PlayBarReducer(playBarState:PlayBarType,action:{type:string,args?:{[key:string]:any}}) {
    const {type,args} = action;
    switch (type) {
        case PlayBarAction.Change:
            playBarState = Object.assign({},playBarState, args);
            break;
        default:
            break;
    }
        return playBarState;
}