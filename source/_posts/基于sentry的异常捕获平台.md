---
title: 基于sentry的异常捕获平台
catalog: true
date: 2019-11-05 14:53:56
subtitle:
header-img:
tags: sentry
categories: 前端
---

## sentry 介绍

sentry 是一个开源的实时错误追踪系统，可以帮助开发者实时监控和统计异常信息。比如客户端和 h5 的 crash 的信息，有了 sentry 以后我们就可以第一时间来处理和解决系统的问题，就不需要过度地依赖用户反馈来定位问题了。sentry 主要包括服务端和客户端 SDK,对于系统集成这一块，sentry 提供了主流语言和框架的支持，包括 java、android、ios、javascript 等都提供官方了 SDK,同时 sentry 提供了一些比较流行的服务的集成插件，比如 jira、github、gitlab、pagerduty、dingding 等。

## sentry 架构

sentry 的架构分位客户端和服务端，而且 sentry 官方提供不同语言和框架的集成 SDK。我们选择相应的 SDK 后就可以将错误信息实时上报到 sentry 的服务端。而 sentry 的服务端分为 web、cron、worker 这几个部分，主要工作流程为，应用程序或者客户端发生错误后将错误信息上报给 web 模块，web 模块处理后放入消息队列(rocketmq)或 redis 内存队列，worker 从队列中消费数据进行处理并存储 postgresql 中，如果配置相应报警规则根据配置报警工具进行报警。下图为 sentry 工作示意图：

<img data-role="image" src="https://cdn.nlark.com/yuque/0/2019/png/484053/1571292721535-807923a9-6f5a-4059-bfe5-b00c206dbe5e.png" data-raw-src="https://cdn.nlark.com/yuque/0/2019/png/484053/1571292721535-807923a9-6f5a-4059-bfe5-b00c206dbe5e.png" class="image lake-drag-image" alt="image.png" title="image.png" style="visibility: visible; width: 746px; height: 283px;">

## sentry 安装

Sentry 本身是基于 Django 开发的，而且也依赖到其他的如 Postgresql、 Redis 等组件，所以一般有两种途径进行安装：通过 Docker 或用 Python 搭建。官网下分别有以下的两个介绍：
Docker 安装 <https://docs.sentry.io/server/installation/docker/>
Python 安装 <https://docs.sentry.io/server/installation/python/>
我们采用的是 docker 安装方式，如果是采用 docker 安装的方式，那么还有一种更加便捷的方式，那么就是采用 docker-compose 了，具体安装步骤如下：

注意，通过 Docker 本地搭建 Sentry 的时候，需要 docker 版本为 1.10.0 以上，docker-compose 版本为 1.17.0 以上，同时要求最低有 3GB 的可用内存。

1. 安装 docker、docker-compose

这里采用 yum 安装，具体安装步骤如下：

```shell
#安装一些必要的系统工具
yum install -y yum-utils device-mapper-persistent-data lvm2
#添加软件源信息
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
#更新 yum 缓存
yum makecache fast
#安装 Docker-ce
yum -y install docker-ce
#启动 Docker 后台服务
systemctl start docker
#下载docket-compose
curl -L https://github.com/docker/compose/releases/download/1.17.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
#修改权限
chmod +x /usr/local/bin/docker-compose
```

2. 安装 sentry

其实 sentry 社区了提供一个基于 docker-composed 的开源项目，通过它我们可以一键部署 sentry。首先我克隆该项目：

```shell
git clone https://github.com/getsentry/onpremise.git
cd onpremise
-rw-r--r-- 1 root root  2017 Oct 15 22:27 config.yml
-rw-r--r-- 1 root root  1427 Oct 16 16:27 docker-compose.yml
-rw-r--r-- 1 root root    43 Oct 15 18:05 Dockerfile
-rwxr-xr-x 1 root root  2766 Oct 15 18:05 install.sh
-rw-r--r-- 1 root root 11356 Oct 15 18:05 LICENSE
-rw-r--r-- 1 root root   548 Oct 15 18:05 Makefile
-rw-r--r-- 1 root root  2167 Oct 15 18:05 README.md
-rw-r--r-- 1 root root    42 Oct 16 17:24 requirements.txt
-rw-r--r-- 1 root root 11493 Oct 15 18:05 sentry.conf.py
-rwxr-xr-x 1 root root  1020 Oct 15 18:05 test.sh
```

如果并没有特殊要求或者额外的组件配置的话，可以直接运行 ./install.sh 将 sentry 及其依赖都通过 docker 安装。由于我们 redis 和 postgresql 是采用阿里云托管的，所以我们不能采用这种方式进行安装。具体步骤如下：

2.1 创建环境变量文件

```shell
#新建环境变量文件.env,根据.env.example拷贝一份即可
cp .env.example .env
```

2.2 修改 docker-compose.xml 文件

删除 redis、postgresql 等镜像依赖，并配置容器的时区，具体配置内容如下：

```shell
version: '3.4'

x-defaults: &defaults
  restart: unless-stopped
  build:
    context: .
#  depends_on:
#    - redis
#    - postgres
#    - memcached
#    - smtp
  env_file: .env
# 时区配置
  environment:
    - TZ=Asia/Shanghai
#    SENTRY_MEMCACHED_HOST: memcached
#    SENTRY_REDIS_HOST: redis
#    SENTRY_POSTGRES_HOST: postgres
#    SENTRY_EMAIL_HOST: smtp
  volumes:
    - sentry-data:/var/lib/sentry/files
    # 时区配置
    - /etc/localtime:/etc/localtime:ro
    - /etc/timezone:/etc/timezone:ro

services:
#  smtp:
#    restart: unless-stopped
#    image: tianon/exim4

"docker-compose.yml" [readonly] 72L, 1432C                                                                                                         1,1           Top
#  memcached:
#    restart: unless-stopped
#    image: memcached:1.5-alpine

#  redis:
#    restart: unless-stopped
#    image: redis:3.2-alpine

#  postgres:
#    restart: unless-stopped
#    image: postgres:9.5
#    volumes:
#      - sentry-postgres:/var/lib/postgresql/data

  web:
    <<: *defaults
    #web端口号，默认为9000
    ports:
      - '9000:9000'

  cron:
    <<: *defaults
    command: run cron

# work为了保证高可用，起了两个节点
  worker1:
    <<: *defaults
    command: run worker

  worker2:
    <<: *defaults
    command: run worker

volumes:
    sentry-data:
      external: true
    sentry-postgres:
      external: true
```

2.3 构建 docker-compose 镜像

```shell
docker-compose build --pull
```

2.4 生成 sentry 密钥

sentry 是用于 sentry 容器内部免密通信，并把这个值配置到 .env 的 SENTRY_SECRET_KEY key 中

```shell
docker-compose run --rm web config generate-secret-key
```

2.5 配置 redis 和 postgresql 连接信息

在.env 文件中添加以下配置：

```shell
#秘钥，由于容器内部免密通信
SENTRY_SECRET_KEY=
#pg host
SENTRY_POSTGRES_HOST=
#pg port
SENTRY_POSTGRES_PORT=
#pg 数据库名称
SENTRY_DB_NAME=
#pg 用户
SENTRY_DB_USER=
#pg 用户密码
SENTRY_DB_PASSWORD=
#redis host
SENTRY_REDIS_HOST=
#redis passowrd
SENTRY_REDIS_PASSWORD=
#redis 端口号
SENTRY_REDIS_PORT=
#redis 数据名
SENTRY_REDIS_DB=
```

注意：这里 postgresql 官方建议采用 9.5 和 9.6，由于阿里云没有这两个版本，所以我们采用 10 的版本。目前运行没有发现任何问题。redis 需要 3.2 以上版本，并且 sentry 不支持集群版的 redis。我们采用的 4.0 单机主从版。进行 Web 服务迁移

2.6 进行 Web 服务迁移

主要是初始化表结构和建用户等操作。具体操作执行以下命令：

```shell
docker-compose run --rm web upgrade
```

注意：注意在这个过程中命令行会提示你是否创建超级用户，如果确定，则输入邮箱和密码。如果没有创建用户，可以在升级结束后可以手动创建一个用户，具体执行以下命令：

```shell
docker-compose run --rm web createuser
```

2.7 运行 sentry

```shell
#启动容器
docker-compose up -d

```

3. 配置邮件信息

当 sentry 采集到了异常信息就可以通过邮件的方式，发送给指定的处理人。而且这些配置信息是无法在 web console 中修改的，具体操作是在.env 环境变量文件，添加以下配置项：

```shell
#邮件的发送地址
ENTRY_SERVER_EMAIL=
#smtp服务器主机地址
SENTRY_EMAIL_HOST=
#smtp 服务器用户
SENTRY_EMAIL_USER=
#smtp服务器密码
SENTRY_EMAIL_PASSWORD=
# smtp服务器端口,注意如果采用qq的企业邮箱，这里不是foxmail中配置的465，而是25（巨坑）。
SENTRY_EMAIL_PORT=
#是否使用TLS，默认为false
SENTRY_EMAIL_USE_TLS=
```

重启 sentry 服务

```shell
docker-compose build
docker-compose run --rm web upgrade
docker-compose up -d
```

4. 集成钉钉及时通讯工具

我们公司使用钉钉作为内部通讯和工作辅助工作，平时工作中大家都可以通过 pc 端和 app 端第一时间查看到消息，并且报警对即时性要求比较高，所以集成钉钉很有必要，下面介绍一下 sentry 集成钉钉的步骤。

1. 安装 sentry-dingding 插件，sentry 的强大和可扩展是它很受欢迎的原因。目前开源社区相关 sentry 的插件也是很丰富的,sentry 钉钉插件 github 地址：<https://github.com/anshengme/sentry-dingding>。
   sentry 为了方便我们安装插件，提供了一个 requirements.txt 文件。我们只需要将我们现需要安装的插件配置进去，重新构建镜像就可以完成安装和集成。修改 requirements.txt：

```shell
#添加钉钉插件
sentry-dingding~=0.0.3
```

2. 重启 sentry 服务

```shell
docker-compose build
docker-compose run --rm web upgrade
docker-compose up -d
```

5. 集成 LDAP

跟集成钉钉一样，sentry 社区也提供了集成插件，sentry ldap 插件地址：<https://github.com/Banno/getsentry-ldap-auth>。 1.安装 ldap 插件，这里跟安装钉钉插件有一定区别，钉钉是直接配置在 requirements.txt 中就可以了。而 ldap 插件如果采用这样的方式可能会报错，原因是 ldap 插件需要依赖 python-ldap 相关环节，所以我们需要在先安装这些依赖。具体安装步骤如下：

1. 安装 sentry ldap 插件
   修改 DokerFile 文件，在文件添加以下内容：

```shell
#切换成国内的源，提高下载速度。但是貌似没啥用，下载还是很慢，后面在看看是什么原因
RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
RUN apt-get clean
#更新源，这一步很重要不能省略，否则后面会下载失败
RUN apt-get update
#安装python-ldap相关依赖
RUN apt-get install -y libsasl2-dev python-dev libldap2-dev libssl-dev
#安装sentry-ldap插件
RUN pip install sentry-ldap-auth
```

2. 配置 ldap 插件
   在 sentry.conf.py 文件添加以下配置项:

```python
import ldap
from django_auth_ldap.config import LDAPSearch, GroupOfUniqueNamesType
#设置ldap服务器地址
AUTH_LDAP_SERVER_URI = 'ldap://secad.poizon.com:3489'
#ldap管理员账号
AUTH_LDAP_BIND_DN = 'xxx'
#ldap管理员密码
AUTH_LDAP_BIND_PASSWORD = 'xxxxx'
#ldap搜索路径，这里配置成技术部，需要注意如果有中文需要转成unicode的格式
OU=unicode('OU=技术部,OU=识装,DC=sz,DC=du', 'utf8')

AUTH_LDAP_USER_SEARCH = LDAPSearch(
    OU,
    ldap.SCOPE_SUBTREE,
    '(mail=%(user)s)',
)

AUTH_LDAP_GROUP_SEARCH = LDAPSearch(
    '',
    ldap.SCOPE_SUBTREE,
    '(objectClass=groupOfUniqueNames)'
)

AUTH_LDAP_GROUP_TYPE = GroupOfUniqueNamesType()
AUTH_LDAP_REQUIRE_GROUP = None
AUTH_LDAP_DENY_GROUP = None

AUTH_LDAP_USER_ATTR_MAP = {
    'name': 'cn',
    'email': 'mail'
}

AUTH_LDAP_FIND_GROUP_PERMS = False
AUTH_LDAP_CACHE_GROUPS = True
AUTH_LDAP_GROUP_CACHE_TIMEOUT = 3600

#如果ldap认证成功，默认给用户加入poizon组织中
AUTH_LDAP_DEFAULT_SENTRY_ORGANIZATION = u'poizon'
#默认的用户的角色是member
AUTH_LDAP_SENTRY_ORGANIZATION_ROLE_TYPE = 'member'
#开通相应的操作权限
AUTH_LDAP_SENTRY_ORGANIZATION_GLOBAL_ACCESS = True
#指定sentry的username字段名称
AUTH_LDAP_SENTRY_USERNAME_FIELD = 'uid'
#指定sentry的角色和ldap的角色的绑定关系，这里我们暂时不设置
AUTH_LDAP_SENTRY_GROUP_ROLE_MAPPING = {}
#扩展登录方式，采用Ldap的方式进行认证
AUTHENTICATION_BACKENDS = AUTHENTICATION_BACKENDS + (
    'sentry_ldap_auth.backend.SentryLdapBackend',
)

#LOG配置
import logging
logger = logging.getLogger('django_auth_ldap')
logger.addHandler(logging.StreamHandler())
logger.setLevel('DEBUG')
```
