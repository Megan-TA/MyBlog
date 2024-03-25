---
title: git submodule
catalog: true
date: 2019-07-10 16:31:04
subtitle:
header-img:
tags: git
categories: 前端
---

子模块一些操作方法：

- 克隆带有子模块的项目

```shell
git clone --recursive 远程地址
```

- 拉取子模块更新

```shell
git submodule update --remote
```

- 提交子模块修改（需要切换到`master`分支）

```shell
git add .
git commit -m 'xxxx'
git push origin master
```

- 删除子模块

```shell
git submodule deinit themes/hugo-nuo
vim .gitmodules # 移除要删除的子模块
git add .gitmodules
git rm --cached themes/hugo-nuo
rm -rf .git/modules/themes/hugo-nuo
rm -rf themes/hugo-nuo
git commit -m "Remove submodule themes/hugo-nuo"
```

参考链接： 1. [Git Submodule 的使用](https://www.jianshu.com/p/0107698498af) 2. [Git Submodule](https://laozhu.me/post/git-submodule-tutorial/)

使用过程中遇到的问题：

1. `jenkins`构建过程中，使用 http 方式拉取子模块一直提示需要输入账号密码，将账号密码放在 url 前面

```shell

git config submodule.H5-Base.url http://账号:密码@远程地址/app/H5-Base.git


git submodule init
git submodule update --remote

yarn install
git submodule foreach 'yarn install'
yarn build
```
