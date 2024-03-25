---
title: vue项目接入sentry
catalog: true
date: 2019-10-11 15:51:00
subtitle:
header-img:
tags: sentry
categories: 前端
---

首先需要下载官方提供的 sdk，在项目入口处加入进去。

```shell
yarn add @sentry/browser
yarn add @sentry/integrations
```

在应用的入口文件，比如 app.js，加入如下配置：

```javascript
import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

Sentry.init({
 dsn: 'https://xxxx@sentry.io/1772852',
 integrations: [new Integrations.Vue({ Vue, attachProps: true })]
})
```

其中 dsn 是在 sentry 创建的项目的设置中，找到 dsn 的选项 tab，找到项目的默认 dsn

当然如果 application 打包的时候，觉得入口文件体积很大，或者是出于打包速度优化的考虑，可以将 sentry 相关插件通过 cdn 方式引用

```html
<!-- <script src="https://browser.sentry-cdn.com/5.7.1/bundle.es6.min.js" integrity="sha384-h+FyW7fMq0eyUQeRnmnwiWXMxycy0z8n5sOtIH3NJx5GfqxdletL62letiWALtKy" crossorigin="anonymous"></script> -->
<script
 src="https://browser.sentry-cdn.com/5.7.1/bundle.min.js"
 integrity="sha384-KMv6bBTABABhv0NI+rVWly6PIRvdippFEgjpKyxUcpEmDWZTkDOiueL5xW+cztZZ"
 crossorigin="anonymous"
></script>

<!-- If you include the integration it will be available under Sentry.Integrations.Vue -->
<script
 src="https://browser.sentry-cdn.com/5.7.1/vue.min.js"
 crossorigin="anonymous"
></script>
```

做完第一步骤之后，此时项目已经具备有异常错误向 sentry 上报日志的功能，如果我们有更精确知道某些异常错误是哪个发布版本带上的，导致相关异常的开发者是谁，还有想要统计某个版本相对于之前的发布版本，错误情况如何等需求，此时需要使用 sentry 提供的 release 功能。

默认接入 release 官方有几种方式，由于我们发布版本并没有走 gitlab、github 等的 ci 流程，我们采用`sentry-cli`提供的全局命令编写脚本去集成到项目发布流程中。

简单的 release 脚本如下：

```shell
#!/bin/sh
export SENTRY_AUTH_TOKEN=9b4f6bf1c75e478cab30bb714e0f8e83d712c02a920640e7b7fbf4dc307c1b33
export SENTRY_ORG=poizon

PROJECT="ticket-platform"

VERSION=`sentry-cli releases propose-version`


# Create a release
sentry-cli releases -p PROJECT new $VERSION

# upload sourcemap
# upload-sourcemaps 指定打包后的js文件在项目的路径
# --url-prefix 外部通过url访问到js静态资源的路径
sentry-cli releases -p $PROJECT files $VERSION upload-sourcemaps ./dist/js/ --url-prefix ~/js/

```

同时需要在初始化 sentry 的入口出加上版本号（commitid），和后台看到的版本名称要一致，比如当前 git 的 commitid 前 6 为是 123456，需要改成如下设置：

```javascript
Sentry.init({
 release: '123456',
 dsn: 'https://xxxx@sentry.io/1772852',
 integrations: [new Integrations.Vue({ Vue, attachProps: true })]
})
```

这时候我们在 sentry 后台系统下查看当前项目的的 release 的 tab 下，能看到已经将 sourcemap 文件都上传到 sentry 服务器。默认`sentry-cli`提供的 release 版本号是根据最后一次 git 提交的 commitid，这样会导致我们在查看版本的时候，面对一连串的 commitid，并不能很简单明了的看到当前版本号，所以需要我们手动指定版本号。

1. 通过手动指定版本号

```shell
#!/bin/sh
export SENTRY_AUTH_TOKEN=9b4f6bf1c75e478cab30bb714e0f8e83d712c02a920640e7b7fbf4dc307c1b33
export SENTRY_ORG=poizon

TAG="ticket-platform@2.10.1"

PROJECT="ticket-platform"

sentry-cli releases -p $PROJECT new $TAG

sentry-cli releases -p $PROJECT files $TAG upload-sourcemaps ./dist/js/ --url-prefix ~/js/

```

初始化的入口处传入的 release 也设置为`ticket-platform@2.10.1`，可以看到这样的方式很繁琐。

2. 通过官方提供的 webpack 插件`@sentry/webpack-plugin`

前提：项目下新建一个`.sentryclirc`文件，写好 sentry 配置项

```
[defaults]
url=https://xxx.xxxx.com
org=xxx
project=ticket-platform

[auth]
token=9b4f6bf1c75e478cab30bb714e0f8e83d712c02a920640e7b7fbf4dc307c1b33
```

修改项目本身的 webpack 配置

```javascript
const SentryCliPlugin = require('@sentry/webpack-plugin');

const config = {
  plugins: [
    new SentryCliPlugin({
      include: './dist/js',
      ignore: ['node_modules']
      urlPrefix: '~/js/'
    }),
  ],
};
```

可以看到默认提供的插件也是按照 commitid，在我们项目中在构建的过程时流程大概如下：

- 标准的 git coommit（commitizen/cz-cli）
- 发版前 standard-version 生成本次的版本号
- 打包时 获取`package.json`的 version 传入`SentryCliPlugin`的配置项`release`

至此 vue 项目完美接入 sentry

参考资料：

1. [sentry 文档接入 vue](https://docs.sentry.io/platforms/javascript/vue/)
2. [@sentry/webpack-plugin](https://www.npmjs.com/package/@sentry/webpack-plugin)
3. [Sentry 前端部署拓展篇（sourcemap 关联、issue 关联、release 控制）](https://segmentfault.com/a/1190000014683598#articleHeader5)
4. [前端日志监控平台 sentry 使用 @sentry/browser @sentry/webpack-plugin](https://juejin.im/post/5bfe0d5be51d4562587b40b9)
