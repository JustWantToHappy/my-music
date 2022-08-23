//防抖函数
var timer: any;
export function debounce(fn: Function, delay: number) {
    clearTimeout(timer);
    timer = setTimeout(() => {
        fn();
    }, delay);
}
//节流函数
export function throttle(fn: Function, delay: number): Function {
    let timer: any;
    return function () {
        var args = arguments;
        if (timer) {
            return;
        }
        timer = setTimeout(function () {
            fn.apply(window, args);
            timer=null;//在delay后执行完fn之后清空timer，此时throttle触发可以进入定时器
        }, delay)
    }

}