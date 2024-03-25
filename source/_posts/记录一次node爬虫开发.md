---
title: 记录一次node爬虫开发
catalog: true
date: 2019-05-07 22:42:51
subtitle:
header-img:
tags: crawler
categories: 前端
---

在做一个爬虫开发需求的使用，由于目标网站是动态的，无法直接处理静态资源，这时候想到使用`google`推出的`node`无头浏览器`puppeteer`，借此尝试一下。

因为我当时开发的时候，在`mac`上开发，开发完毕之后需要部署到远程`centos7`的远程服务器上，部署的时候就有个小问题，如何判断系统环境是 mac、window 还是 linux，来决定导出的文件存放的目录。

```javascript
const os = require('os')
//Linux系统上'Linux'
//macOS 系统上'Darwin'
//Windows系统上'Windows_NT'
let sysType = os.type()
if (sysType === 'Windows_NT') {
 console.log("It's windows")
}
```

一切开发顺利，在`centos7`上部署的时候，遇到`pupeteer`几个问题：

- 无法下载（需要翻墙）
- 无法启动（具体解决见参考链接）

参考链接：

1. [centos 安装 puppeteer 启动失败解决处理](<[https://segmentfault.com/a/1190000011382062](https://segmentfault.com/a/1190000011382062)>)
