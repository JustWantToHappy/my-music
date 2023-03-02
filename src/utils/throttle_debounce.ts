//防抖函数
var timer: ReturnType<typeof setTimeout>;
export function debounce(fn: Function, delay: number) {
    clearTimeout(timer);
    timer = setTimeout(() => {
        fn();
    }, delay);
}
//节流函数
export function throttle(fn: Function, delay: number): React.UIEventHandler {
    let timer: ReturnType<typeof setTimeout>|null;
    return function () {
        const args = arguments;
        const that = this as any;
        if (timer) {
            return;
        }
        timer = setTimeout(()=>{
            fn.apply(that, args);
            timer=null;//在delay后执行完fn之后清空timer，此时throttle触发可以进入定时器
        }, delay)
    }
}