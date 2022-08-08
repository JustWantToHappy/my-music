import { observable, computed, action } from "mobx"
let content: { timer: any, Timer: void, clearTimer: () => void } = {
    //全局定时器
    timer: null,
    set Timer(timer: any) {
        this.timer = timer;
    },
    clearTimer: function () {
        clearInterval(this.timer);
    }
};

var songStore = observable(content);

export { songStore };