---
title: centos下利用nvm安装node
catalog: true
date: 2019-07-24 14:43:38
subtitle:
header-img:
tags: linux
categories: 前端
---

- 安装 github

yum install git -y

- 下载 nvm

git clone git://github.com/creationix/nvm.git ~/nvm

- 设置 nvm 自动运行;

echo "source ~/nvm/nvm.sh" >> ~/.bashrc
source ~/.bashrc

- 查询 node 版本

nvm list-remote

- 安装 node.js

nvm install v10.15.1

- 使用 nodejs
  nvm use v10.15.1
