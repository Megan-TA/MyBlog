---
title: pm2常用命令整理
catalog: true
date: 2019-07-25 22:34:15
subtitle:
header-img:
tags: node
categories: 前端
---

- pm2 start

之前一直使用过程中，都是指定一个启动文件（`pm2 start app.js`），后来在用`pm2`部署`nuxt.js`项目时候，发现这样的方式不太能用，查阅文档发现可以使用以 npm 方式执行 script 脚本命令

```shell
# pm2 start npm --name '进程名称' -- run 脚本命令
# package.json
#  script: {
#    "start:nuxt": "nuxt build"
#}
pm2 start npm -- run start:nuxt --name 'nuxt'
```
