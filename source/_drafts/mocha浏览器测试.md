---
title: mocha浏览器测试
catalog: true
date: 2020-05-25 12:55:34
subtitle:
header-img:
tags: mocha
---

[下载phantomJS](https://phantomjs.org/download.html)

```shell
// mac
// 将phantomjs添加到全局的bin位置
sudo ln -s /Users/XXXXXXXXXXXXx/phantomjs/bin/phantomjs /usr/local/bin/phantomjs
```

运行mocha脚本

```shell
npx mocha-phantomjs -p /usr/local/bin/phantomjs ./test/index.html
```
