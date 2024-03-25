---
title: 利用verdaccio搭建私有npm仓库
catalog: true
date: 2019-06-16 08:25:18
subtitle: 
header-img:
tags: npm
categories: 前端
---

随着时间的推移，前端的工程日益庞大，越来越复杂的依赖包需要包管理器来维护。相比搭建没有优势bower仓储，更好的方式是在局域网搭建NPM仓储，维护项目中package.json中的各个插件的版本即可维护项目依赖。

[verdaccio]([https://github.com/verdaccio/verdaccio](https://github.com/verdaccio/verdaccio)
)是一个部署简易的可以实现github仓储私有化的npm组件，fork于`sinopia`项目，由于`sinopia`项目现在不太维护，存在一些bug，不建议使用。

使用verdaccio的优势

- 配置简单，开箱即用；
- 不需要数据库,verdaccio内置一个数据库了；
- 当源为verdaccio时, verdaccio不存在要安装的包时,会自动去设置的远程npm把包缓存到本地；

## 1. 安装verdaccio

```javascript
npm i verdaccio -g
```

## 2. 启动verdaccio

- 默认开启方式

 ```shell
verdaccio
```

启动成功截图

![image.png](https://upload-images.jianshu.io/upload_images/6655013-ec7bd2397fb9d6bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其中`config.yaml`是配置文件，相关配置文件说明如下

```shell
storage: ./storage  //npm包存放的路径

auth:
  htpasswd:
    file: ./htpasswd   //保存用户的账号密码等信息
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    max_users: -1  //默认为1000，改为-1，禁止注册

# a list of other known repositories we can talk to
uplinks:
  npmjs:
    url: http://registry.npm.taobao.org/  //默认为npm的官网，由于国情，改为淘宝源

packages:  //配置权限管理
  '@*/*':
    # scoped packages
    access: $all
    publish: $authenticated

  '*':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    access: $all  // 所有人都能下载

    # allow all known users to publish packages
    # (anyone can register by default, remember?)
    publish: $authenticated // 所有人都有发布包的权限，若想指定默认发布改成对应人的名字

    # if package is not available locally, proxy requests to 'npmjs' registry
    proxy: npmjs  // 若安装的报在simopia没有，会去配置的npmjs地址去下载

# log settings
logs:
  - {type: stdout, format: pretty, level: http}
  #- {type: file, path: verdaccio.log, level: info}

# you can specify listen address (or simply a port)
listen: 0.0.0.0:4873  // 默认没有，只能在本机访问，添加后可以通过外网访问。
```

若在服务端部署，需要以守护进程的方式，推荐使用`pm2`去开启

```shell
pm2 start `which verdaccio`
```

pm2启动成功截图

![image.png](https://upload-images.jianshu.io/upload_images/6655013-dcf94831d7b96096.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

---

## 如何使用

 打开浏览器输入对应的暴露的地址，比如`192.168.0.1:4873`，

截图如下

![image.png](https://upload-images.jianshu.io/upload_images/6655013-d6ae317646b0afc3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

按照截图提示，注册一个用户

```shell
npm adduser --registry http://192.168.0.1:4873
```

安装提示输入账号，密码

## 更改下载源

在每一个客户端中需要更改下载源为verdaccio，这里推荐使用`nrm`，这是一个包下载源管理器。

```shell
npm install -g nrm

nrm add verdaccio http://x.x.x.x:4873/

nrm use verdaccio
```

## 维护

如果需要发布一个包，需要先进行登录

```shell
npm login
```

登录成功之后，在对应的包文件夹下，改好`package.json`版本号，再执行创建发布命令

```shell
npm publish
```
