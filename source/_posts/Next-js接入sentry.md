---
title: Next.js接入sentry
catalog: true
date: 2020-03-12 22:48:37
subtitle:
header-img:
tags: javascript
categories: 前端
---

## 问题

Next 接入 sentry 收集不到完整的错误

## 原因

Next 分为客户端和服务端，需要对双端都做上报

Next 获取逻辑和渲染是两个维度错误逻辑处理

## 如何发现

[参考 Next 官网 sentry 接入示例](https://github.com/zeit/next.js/blob/canary/examples/with-sentry/pages/_app.js)

## 如何修复

按照示例接入

其中 sentry 需要在客户端和服务端复用，建议是抽离放在一个文件去维护

综上需要更改有五处地方

- config/sentry.js
- \_app.js
- \_error.js
- server/app.js
- next.config.js

流程图如下：

![Next渲染流程](https://s1.ax1x.com/2020/03/13/8mXosf.png)

其中\_app.js 接入 sentry 初始化逻辑，并且在 getInitProps 方法内，使用 try/catch 执行对应 page 组件的 getInitProps

```javascript
// _app.ts

static async getInitialProps(appContext: AppContext) {
 try {
  const { Component, ctx } = appContext
  let pageProps = {}

  if (Component.getInitialProps) {
   pageProps = await Component.getInitialProps(ctx)
  }

  return {
   pageProps,
  }
 } catch (error) {
  console.log('app组件捕获到错误：', error)
  const { ctx } = appContext
  const errorEventId = captureException(error, ctx)
  return {
   errorEventId,
   hasError: true,
   pageProps: {},
  }
 }
}

```

render 错误需要在\_error.js 捕获处理

```javascript
// _error.ts
static getInitialProps(ctx: NextPageContext) {
 const { res, err } = ctx
 if (err) {
  console.log('Error组件捕获到错误', err)
  captureException(err, ctx)
 }
 const statusCode = res ? res.statusCode : err ? err.statusCode : null
 return { statusCode }
}
```

服务端配置

```javascript
// 此处加在了全局错误中间件处理 如果不使用全局错误中间件需要监听koa等实例全局error事件处理

const errHandler = async (ctx, next) => {
  try {
    await next();
    ctx.status = 200;
  } catch (err) {
    console.error("服务端捕获到错误：", err);
    // sentry上报错误
    captureException(err, ctx);

    ctx.status = err.code ? 200 : 500;
    ctx.body = {
      message: err.message,
      ...err
    };
  }
};

app.prepare().then(() => {
  const server = new Koa();

  server.use(errHandler);
});
```

sentry 配置

```javascript
import * as Sentry from '@sentry/node'
import { NextPageContext } from 'next'

interface SentryExport {
 Sentry: typeof Sentry
 captureException: (err: any, ctx: NextPageContext) => string
}

export default (release = process.env.SENTRY_RELEASE): SentryExport => {
 console.log('SENTRY_RELEASE:', process.env.SENTRY_RELEASE)
 const sentryOptions: Sentry.NodeOptions = {
  dsn: '***********',
  release: release || '',
  environment: process.env.NODE_ENV,
  maxBreadcrumbs: 10,
  attachStacktrace: true,
  // 只有生产环境发送到sentry
  enabled: process.env.NODE_ENV === 'production',
 }

 Sentry.init(sentryOptions)

 return {
  Sentry,
  captureException: (err, ctx) => {
   Sentry.configureScope((scope) => {
    if (err.message) {
     // De-duplication currently doesn't work correctly for SSR / browser errors
     // so we force deduplication by error message if it is present
     scope.setFingerprint([err.message])
    }

    if (err.statusCode) {
     scope.setExtra('statusCode', err.statusCode)
    }

    if (ctx) {
     const { req, res, query } = ctx

     if (res && res.statusCode) {
      scope.setExtra('statusCode', res.statusCode)
     }

     scope.setTag('ssr', 'true')
     scope.setExtra('url', req.url)
     scope.setExtra('method', req.method)
     scope.setExtra('headers', req.headers)
     scope.setExtra('query', query)
    }
   })

   return Sentry.captureException(err)
  },
 }
}
```

next 对应配置

```javascript
webpack: (config, { isServer, buildId }) => {
  if (!isServer) {
    config.resolve.alias["@sentry/node"] = "@sentry/browser";
  }

  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env.SENTRY_RELEASE": JSON.stringify(buildId)
    })
  );

  return config;
};
```

## 总结

Next 接入 sentry 需要考虑到方方面面，渲染逻辑和数据获取逻辑是两个维度，客户端和服务端又是一个维度。

## 参考资料

1. [sentry 官网 demo 接入 next](https://github.com/zeit/next.js/blob/canary/examples/with-sentry/server.js)
