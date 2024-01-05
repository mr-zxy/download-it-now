
if (!~process.resourcesPath.indexOf("node_modules")) {
  process.env.NODE_ENV = "production";
}

const { app, BrowserWindow } = require('electron')
const subscribe = require("./js/subscribe")
const path = require('path');

function createWindowStart() {

  //app控制应用程序的生命周期
  //BrowserWindow 创建窗口
  function createWindow() {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: true, // 通过frame创建无边框窗口
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true, // 这里是关键设置
      }
    });

    subscribe(win);
    require("./js/menu")

    if (process.env.NODE_ENV === "production") {
      win.loadFile(path.resolve(__dirname, "./dist/index.html"))
    } else {
      win.loadURL("http://localhost:8080/#/");
      win.webContents.openDevTools() // 打开调试工具
    }

  }

  //完成初始化，触发一次
  app.whenReady().then(() => {
    createWindow()
  })
  //热加载
  // const reloader = require('electron-reloader')
  // reloader(module) //module是全局对象
};

createWindowStart();