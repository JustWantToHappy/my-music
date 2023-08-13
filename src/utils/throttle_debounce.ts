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
    return function (...args) {
        if (timer) {
            return;
        }
        timer = setTimeout(()=>{
            fn.apply(this, args);
            timer = null;
        }, delay)
    }
}