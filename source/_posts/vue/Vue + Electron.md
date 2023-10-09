---
title: Vue + Electron 集成
categories: Vue
cover: 'https://www.toopic.cn/public/uploads/small/1689775323165168977532363.png'
description: Vue + Electron 集成
abbrlink: 81931
date: 2023-10-08 17:30:00
updated: 2023-10-08 17:30:00
---

### 前言
> 笔者自己写了一个PC高颜值音乐播放器，原理其实还是一个网页，使用Electron使它变成了一个应用程序
> Electron内部集成了谷歌浏览器的内核
> 所以就是缩小版的web页面，本以为集成相当简单，然而是笔者格局小了
> 有缘的小友看到就可以防止踩坑了，这东西集成摸黑太EX.  

#### 集成
> 下载Vue，笔者假设你有Node.js了，这里不赘述Node.js
```shell
npm install -g @vue/cli
```
> 使用 vue ui 命令创建一个Vue项目
```shell
vue ui
```
> 安装Electron
```shell
npm install --save-dev electron 
```

> 读者应该是报错了
```shell
npm ERR! code 1
npm ERR! path D:\Vue Project\img-repository\node_modules\electron
npm ERR! command failed
npm ERR! command C:\Windows\system32\cmd.exe /d /s /c node install.js
npm ERR! RequestError: read ECONNRESET
npm ERR!     at ClientRequest.<anonymous> (D:\Vue Project\img-repository\node_modules\got\dist\source\core\index.js:970:111)
npm ERR!     at Object.onceWrapper (node:events:472:26)
npm ERR!     at ClientRequest.emit (node:events:377:35)
npm ERR!     at ClientRequest.origin.emit (D:\Vue Project\img-repository\node_modules\@szmarczak\http-timer\dist\source\index.js:43:20)
npm ERR!     at TLSSocket.socketErrorListener (node:_http_client:447:9)
npm ERR!     at TLSSocket.emit (node:events:365:28)
npm ERR!     at emitErrorNT (node:internal/streams/destroy:193:8)
npm ERR!     at emitErrorCloseNT (node:internal/streams/destroy:158:3)
npm ERR!     at processTicksAndRejections (node:internal/process/task_queues:83:21)
npm ERR!     at TLSWrap.onStreamRead (node:internal/stream_base_commons:211:20)

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\Administrator\AppData\Local\npm-cache\_logs\2023-10-08T09_01_23_438Z-debug.log
```
> 输入以下命令
> 操作系统是windows 笔者之前用linux搞了好久才解决
```shell
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
```
> 重新执行安装
```shell
npm install --save-dev electron
```

> 修改镜像
```shell
npm config edit
```
> 将下面两行代码添加到文件末尾
```text
electron_mirror=https://npm.taobao.org/mirrors/electron/
electron-builder-binaries_mirror=https://npm.taobao.org/mirrors/electron-builder-binaries/
```

> 添加 electron-builder 构建插件
```shell
vue add electron-builder
```

> 添加ts依赖 (我用的ts js的话好像不用)
```shell
npm install ts-loader@8 --save-dev
npm install typescript --save-dev
```

> 最后确保项目中已经引入了background.ts文件
> 在package.json中的main配置正确的background.ts路径
> 这样就算成功了
> npm 运行
```shell
npm run electron:serve
```
