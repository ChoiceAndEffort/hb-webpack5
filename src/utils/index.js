/*
    按钮点击事件·节流
    fn:函数，
    delay:延迟时间/秒
    适用情景：提交按钮（避免高频率重复点击）
    调用:
    1.import 引入
    2.throttle(butClick事件,500)
*/
export function throttle(fn, delay) {
  let first = true;
  let timestamp;
  let ctx = this;
  return function() {
    if (first) {
      timestamp = Date.now();
      fn.apply(ctx, arguments);
      first = false;
    } else {
      let t = Date.now();
      if (t - timestamp < delay) {
        timestamp = t;
        return;
      } else {
        fn.apply(ctx, arguments);
      }
      timestamp = t;
    }
  };
}

/*
  输入框input事件·防抖
  fn:函数，
  delay:延迟时间/秒
  适用情景：输入框、搜索框input事件，等待一次性输入完后请求
  调用:
  1.import 引入
  2.throttle(input事件,500)
*/
export function bounce(fn, delay, ctx = window) {
  let timer = null;
  return function(...args) {
    return new Promise(resolve => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        if (fn instanceof Promise) {
          fn.apply(ctx, args).then(res => {
            resolve(res);
          });
        } else {
          resolve(fn.apply(ctx, args));
        }
      }, delay);
    });
  };
}
