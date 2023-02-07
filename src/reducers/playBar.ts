/**
 * 播放条组件reducer
 */
import type { PlayBarType } from "../components/PlayBar";

export enum PlayBarAction{
    Change = "changestate",//给state对象替换一些属性
    ClearTimer = "cleartimer",//清除定时器
    ResetTimer = "resettimer",//重置定时器
    shrinkPlayBar = "shrink",//收起播放条
}
export default function PlayBarReducer(playBarState:PlayBarType,action:{type:string,args?:{[key:string]:any}}) {
    const {type,args} = action;
    switch (type) {
        case PlayBarAction.Change:
            playBarState = Object.assign(playBarState, args);
            break;
        case PlayBarAction.ClearTimer:
            playBarState.timer = null;
            playBarState.time = 0;
            break;
        case PlayBarAction.ResetTimer:
            playBarState.time = 0;
            playBarState.timer = setInterval(() => {
                playBarState.time++;
            },1000);
            break;
        case PlayBarAction.shrinkPlayBar:
            playBarState.expend = false;
            break;
        default:
            break;
        }
        return playBarState;
}