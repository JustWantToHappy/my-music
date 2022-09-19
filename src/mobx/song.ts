import { observable } from "mobx"
let content: { timer: number|undefined|ReturnType<typeof setTimeout>, clearTimer: () => void } = {
    //全局定时器
    timer: undefined,
    clearTimer: function () {
        clearInterval(this.timer);
    }
};

var songStore = observable(content);
export { songStore };