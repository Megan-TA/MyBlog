---
title: gitlab-runner搭建CI/CD平台
catalog: true
date: 2024-02-21 11:13:01
subtitle:
header-img:
tags: CI/CD
categories: 前端
---

## 项目架构图

![devflow](/img/article/gitlab-runner/devflow.png)

## 研发流程

1. Maintainer从master拉取本次迭代上线分支，命名规则以当前年度+发布日期，比如release/20240606；
2. 各个Developer从release/20240606拉取各自开发分支，命名规则以feat/个人姓名拼音首字母/发布日期，比如feat/a/20240606，feat/b/20240606
3. 开发完成，各自合并到fat-deploy分支，自动触发CI/CD流程，发布到fat环境；
4. 测试完成，需要走上线流程，将各自开发分支合并到原先拉取的发布分支release/20240606，自动触发uat发布，验证通过后，走pre发布，最后走pro发布；代码自动合并到master。
5. 若发现上线有问题，依次执行git回滚和部署代码回滚。

Maintainer关注：每次迭代拉取release发布分支，review上线的MR代码；
Developer关注：当前发布分支，本地fat测试以及MR走上线流程；


## CI/CD功能

1. MR到指定分支后，支持自动触发构建应用；
2. 并发构建应用；
3. PRO发布成功后，自动合并发布分支到master分支；
4. PRO发布成功后，直接一键git代码回滚，一键服务端部署回滚；
5. 支持不同环境发布，fat、uat、pre、pro；
6. CI/CD部署脚本和项目隔离，可复用；


## 遇到的问题

### gitlab-runner执行shell的nodejs版本和linux服务器的nodejs版本不一致

gitlab-runner的nodejs版本要使用yum的方式安装，不能使用nvm、本地下载后创建bin形式，这种方式默认不会给gitlab-runner给安装nodejs，yum是可以的

参考资料：

[nodesource](https://github.com/nodesource/distributions)

[centos7 之 yum 安装nodejs](https://juejin.cn/post/6844903938106327048)

### gitlab-runner拉取的分支merge到master分支一直不成功

gitlab默认拉取的是一个HEAD分支，HEAD分支是无法进行合并的，此时需要手动在本地拉取一个当前CommitID对应的分支，再进行merge操作；

### 初始化在清理git时一直不成功，提示Permission denied或其他权限相关报错（block最久的问题）

![.git权限不足1](/img/article/gitlab-runner/git-failed-write.png)
![.git权限不足2](/img/article/gitlab-runner/git-permisson-denied.png)
![.git权限不足3](/img/article/gitlab-runner/dist-permission.png)

出现这个问题，主要是因为在进行git merge，git revet，或者打包生成的新目录如dist时，操作的用户（比如 root）不是gitlab-runner这个用户，导致下次在初始化时重置当前项目时，一直提示权限不足

解决办法：在每次执行完任务时，重新给当前目录设置下可写等权限。需要注意处理下，job异常退出时未及时设置权限，导致下次构建又遇到权限异常的问题。

![chmod](/img/article/gitlab-runner/chmod.png)

![shell-catch](/img/article/gitlab-runner/shell-catch.png)


### git merge时提示没有权限推送到master分支

![push 403](/img/article/gitlab-runner/403.png)

默认gitlab-ci-token来拉取的，本身权限是比较低的，基本只有read权限，push时可通过https://用户名:用户密码@xxxx.git HEAD:master的方式来推送即可

![push](/img/article/gitlab-runner/push.png)


参考资料：

[Cannot push from gitlab-ci.yml](https://stackoverflow.com/questions/46472250/cannot-push-from-gitlab-ci-yml)


### 同一个stage下，无法同时构建应用

![build-1](/img/article/gitlab-runner/build-1.png)
![build-2](/img/article/gitlab-runner/build-2.png)
![build-3](/img/article/gitlab-runner/build-3.png)
![stage-1](/img/article/gitlab-runner/stage-1.png)
![stage-2](/img/article/gitlab-runner/stage-2.png)

这是因为gitlab-runner在同时并发构建job时，为了保证应用相互隔离和资源竞争等考虑，会在builds不同临时目录下去构建应用。此时若将拉取git代码和安装依赖单独放在一个stage下，build在单独一个stage下，则默认只会在一个目录下拉取git和安装依赖，在并发时，另一个目录不会重复此步骤，就会出现代码不一致，本地没安装依赖等情况。需要调整将两个stage合并为一个stage。

![stage-3](/img/article/gitlab-runner/stage-3.png)


