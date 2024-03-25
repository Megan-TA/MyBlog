---
title: 常用npm包整理
catalog: false
date: 2019-07-03 09:56:32
subtitle:
header-img:
tags: npm
categories: 前端
---

## git 钩子

- husky
- lint-staged

## 代码风格相关

- commitizen
- eslint
- standard-version
- stylelint

```shell
npm install commitizen -g

commitizen init cz-conventional-changelog --yarn --dev --exact


yarn add standard-version -D

```

配置`package.json`

```json

"scripts": {
    "release": "standard-version"
},
"husky": {
    "hooks": {
        "pre-commit": "lint-staged"
    }
},
"lint-staged": {
    "src/**/*.{js}": [
        "eslint --fix",
        "git add"
    ]
}
```

参考链接：

1. [commitizen](https://github.com/commitizen/cz-cli)

## 工具命令

- tildify

将绝对路径转换为波形路径 比如/Users/sindresorhus/dev → ~/dev

- ora

这个模块用于在终端里有显示载入动画

- download-git-repo

一个用于下载 git 仓库的项目的模块

- inquirer

是一个命令行的回答的模块，你可以自己设定终端的问题，然后对这些回答给出相应的处理

- commander

可以将文字输出到终端当中 多用于提示 根据定义的 bin 的 name 触发对应脚本

## Node 服务

- protocol-buffers

nodejs 处理 rpc 通信的一种数据序列化格式模块 类似 JSON

- dotenv

nodejs 从文件(.env)中加载环境变量

- pino/koa-pino-logger

nodejs 日志库

- pm2
- pm2-web
- pm2-logrotate/pm2-logrotate-ext 日志按天分隔

pm2 可视化管理开启

pm2 monitor \${id}

参考资料：

1. [PM2 简易使用手册](https://juejin.im/post/5be406705188256dbb5176f9#heading-10)

## Typescript

- ts-node
- ts-node-dev

开发模式实时编译文件并输出到指定目录下

## 单元测试

- supertest

http 断言库

- jest

- mock-fs

在内存里模拟 fs 文件，进行 mock 文件测试

## 定时任务

- node-cron 定时脚本/任务

## 其他

- verdaccio

搭建私有 npm 库

- 安装本地包

npm install file:完整的相对路径 如 file:/User/Desktop/XXX

- vue-awesome-swiper

swiper vue 版本组件
