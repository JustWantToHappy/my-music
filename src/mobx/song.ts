import { observable } from "mobx"
let content: { timer: any, clearTimer: () => void } = {
    //全局定时器
    timer: null,
    clearTimer: function () {
        clearInterval(this.timer);
    }
};

var songStore = observable(content);
export { songStore };