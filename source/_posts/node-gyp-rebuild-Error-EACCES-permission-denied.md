---
title: "node-gyp rebuild Error: EACCES: permission denied"
catalog: true
date: 2020-03-09 10:48:45
subtitle:
header-img:
tags: npm
categories: 前端
---

1. 最近在安装 RN 项目时，执行`npm install`遇到如下报错

{% asset_img node-gyp-error.png %}

很明显是 fsevents 模块使用`node-gyp rebuild`失败

看提示信息提示权限相关问题，猜测可能是读写权限问题，

查看了下权限

{% asset_img root-rw.png %}

加上`sudo`，开启`root`账户模式，但并未成功。

经过查询相关资料发现，实际原因是由于用的是 root 账户权限执行 npm，而 npm 默认是不适用 root 权限创建内容，因此会出现权限问题而导致失败，加上参数
`--unsafe-perm=true --allow-root`即可解决问题。

{% asset_img node-gyp-success.png %}

2. `node-sass`安装提示`EACCES`错误 使用`--unsafe-perm`参数安装


总结：安装npm包时遇到`EACCES`相关错误时，先尝试`sudo`安装，若再提示相关问题加上`--unsafe-perm`参数






