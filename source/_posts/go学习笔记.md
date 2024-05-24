---
title: go学习笔记
catalog: true
date: 2024-04-25 11:30:45
subtitle:
header-img:
tags: go
categories: go
---

```shell

# 设置国内源
# ~/.zshrc  或者 ~/.bashrc下
export GOPROXY=https://goproxy.io


# 清除modcache缓存
go clean -modcache
# 重新下载依赖项
go build ./...

```
