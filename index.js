/**
 * 代理沙箱
 */
class ProxySandbox {
  constructor() {
    const rawWindow = window;
    const fakeWindow = {};

    const proxy = new Proxy(fakeWindow, {
      set(target, prop, value) {
        target[prop] = value;
        return true;
      },
      get(target, prop) {
        return target[prop] || rawWindow[prop];
      }
    });

    this.proxy = proxy;
  }
}

/**
 * 快照沙箱
 */
class SnapshotSandbox {
  constructor() {
    this.proxy = window;
    this.modifyPropsMap = {};
    this.active();
  }
  active() {
    this.windowSnapshot = {}; // 拍照
    for (const prop in window) {
      if (window.hasOwnProperty(prop)) {
        this.windowSnapshot[prop] = window[prop];
      }
    }
    Object.keys(this.modifyPropsMap).forEach(prop => {
      window[prop] = this.modifyPropsMap[prop];
    });
  }
  inactive() {
    for (const prop in window) {
      if (window.hasOwnProperty(prop)) {
        if (window[prop] !== this.windowSnapshot[prop]) {
          this.modifyPropsMap[prop] = window[prop];
          window[prop] = this.windowSnapshot[prop];
        }
      }
    }
  }
}

// 代理沙箱测试
const snadbox1 = new ProxySandbox();
const snadbox2 = new ProxySandbox();
window.a = 1;
(window => {
  window.a = 'hello';
  console.log(window.a);
})(snadbox1.proxy);
(window => {
  window.a = 'world';
  console.log(window.a);
})(snadbox2.proxy);

// 快照沙箱测试
// const sandbox = new SnapshotSandbox();
// (window => {
//   window.a = 1;
//   window.b = 2;
//   console.log(window.a, window.b);
//   sandbox.inactive();
//   console.log(window.a, window.b);
//   sandbox.active();
//   console.log(window.a, window.b);
// })(sandbox.proxy);
