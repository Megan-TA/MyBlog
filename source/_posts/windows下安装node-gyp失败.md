---
title: windows下安装node-gyp失败
catalog: true
date: 2020-07-31 15:40:58
subtitle:
header-img:
tags: npm
categories: 前端
---

- 用作为当前目录的以上路径启动了 CMD.EXE。UNC 路径不受支持。默认值设为 Windows 目录。

处理：

cmd下运行如下命令

```shell
 reg add "HKEY_CURRENT_USER\Software\Microsoft\Command Processor" /v "DisableUNCCheck" /t "REG_DWORD" /d "1" /f
```

- Could not find any Visual Studio installation to use

处理：

下载`windows-build-tools`

管理员权限打开`powershell`，输入如下命令

```shell
npm install --global --production windows-build-tools
```

安装完毕，使用如下方式安装

```shell
npm install --msvs_version=2013

```

若报错，检查报错提示，一般表示vscode版本不对

```shell
gyp ERR! find VS msvs_version was set from command line or npm config
gyp ERR! find VS - looking for Visual Studio version 2013
gyp ERR! find VS VCINSTALLDIR not set, not running in VS Command Prompt
gyp ERR! find VS checking VS2017 (15.9.28307.1216) found at:
gyp ERR! find VS "C:\Program Files\Microsoft Visual Studio\2017\BuildTools"
gyp ERR! find VS - found "Visual Studio C++ core features"
gyp ERR! find VS - found VC++ toolset: v141
gyp ERR! find VS - found Windows SDK: 10.0.17763.0
gyp ERR! find VS - msvs_version does not match this version

```

提示`VS2017`版本存在，换用2017

```shell
npm install --msvs_version=2017

```

下载成功
