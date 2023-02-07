/**
 * 播放条组件reducer
 */
import type { PlayBarType } from "../components/PlayBar";

const PlayBarReducer = (playBarState:PlayBarType,action:{type:string,args?:any}) => {
    const {type,args} = action;
    switch (type) {
        case "playNewMusic":
            playBarState.song = args;
            playBarState.showBar = true;
            playBarState.isPlay = true;
            break;
        
        default:
            break;
        }
        return playBarState;
}
export default PlayBarReducer;