---
title: centos下通过docker安装文档共享平台mm-wiki
catalog: true
date: 2024-03-25 14:43:38
subtitle:
header-img:
tags: linux
categories: 前端
---

通过docker容器化的方式部署，此镜像基于centos7和mysql5.7，mm-wiki的版本为v0.2.1。


## 一、准备工作

1. 安装docker

2. 拉取所需镜像

```shell
docker pull centos:7

docker pull mysql:5.7
```
3. 创建所需目录

```shell
mkdir -p /home/mm-wiki/{mmwiki/{build_images,data},mysql/{sql,data}}
```
目录说明：

/home/mm-wiki/

├── mmwiki ## mm-wiki相关目录
│   ├── build_images  #构建mm-wiki镜像的目录
│   └── data   #存放运行mm-wiki镜像后容器的数据目录，用户持久化
└── mysql #myql相关目录
    ├── data #存放运行mysql镜像后容器的数据目录，用户持久化
    └── sql  #存放运行mysql镜像后容器的初始化sql文件

4. 下载mm-wiki安装包

```shell
wget https://github.com/phachon/mm-wiki/releases/download/v0.2.1/mm-wiki-v0.2.1-linux-amd64.tar.gz -o /home/mm-wiki/mmwiki/build_images/mm-wiki-v0.2.1-linux-amd64.tar.gz

```

## 二、运行mysql镜像生成容器

1. 编写初始化sql文件和运行镜像生成容器

```shell
cat << EOF > /home/mm-wiki/mysql/sql/init.sql  #路径和参考链接有变化
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE mmwiki;
CREATE USER 'mmwiki'@'%' IDENTIFIED BY "mmwiki@123";
GRANT ALL ON mmwiki.* TO 'mmwiki'@'%' IDENTIFIED BY "mmwiki@123";
FLUSH PRIVILEGES;
EOF
```

2. 运行镜像生成容器的命令

```shell
docker run -itd --name mysql -h mysql -p 33306:3306 -v  /home/mm-wiki/mysql/sql:/docker-entrypoint-initdb.d/ -v  /home/mm-wiki/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7 

```
3. 命令行登陆测试

```shell
mysql -ummwiki -p -h 10.230.77.18 -P 33306  #回车输入密码再次回车即可，密码是上面的mmwiki@123
```
说明
"-ummwiki"是指定了MySQL用户名为"mmwiki"

-p表示需要输入密码

-h后跟主机IP地址（需要替换成对应服务器地址）

-P后跟端口号


## 运行mm-wiki镜像生成容器

1. 构建mm-wi镜像

> 编写dockerfile文件

```dockerfile
cat << EOF > /home/mm-wiki/mmwiki/build_images/dockerfile
#基础镜像
FROM centos:7
#指定维护者信息
MAINTAINER huangchen hc1132107224@163.com
#安装基础工具，可跳过
#RUN yum -y install wget vim telnet
#创建所需目录,分别是安装目录和数据目录
RUN mkdir -p /opt/mmwiki/{mm-wiki,data}
#下载安装包，网速慢的话可以跳过
#RUN wget https://github.com/phachon/mm-wiki/releases/download/v0.2.1/mm-wiki-v0.2.1-linux-amd64.tar.gz -o /opt/mm_wiki/mm-wiki.tar.gz
#将本地的安装包上传到容器中
ADD mm-wiki-v0.2.1-linux-amd64.tar.gz /opt/mmwiki/mm-wiki
#设置主目录
WORKDIR /opt/mmwiki/mm-wiki
#后台启动,用ENTRYPOINT代替
#CMD ./install/install
#拷贝启动脚本文件
COPY docker-entrypoint.sh /usr/bin/docker-entrypoint.sh
#赋予脚本启动权限
RUN  chmod +x /usr/bin/docker-entrypoint.sh
#暴露启动端口,如果没有--port参数，默认为8090；如果有启动--port参数，必须和docker-entrypoint.sh启动脚本中的--port参数的端口一致
EXPOSE 8090 8080
#挂起进程，便于下次容器启动时可以运行
ENTRYPOINT ["docker-entrypoint.sh"] 
EOF
```

> 编写docker-entrypoint启动脚本（目的是在容器运行时后台进程挂起）

```shell
cat << EOF > /home/mm-wiki/mmwiki/build_images/docker-entrypoint.sh
#!/bin/bash
if [ -d /opt/mmwiki/mm-wiki ]; then  #判断容器内的安装目录释放存在
  cd /opt/mmwiki/mm-wiki
else
  echo "/opt/mmwiki/mm-wiki not found"
  return 51
fi

if [ -f ./install.lock ]; then  #判断容器内./install.lock是否存在，不存在则是install，否则为正常启动状态       
  ./mm-wiki --conf ./conf/mm-wiki.conf
else
  cd install && ./install  #如果需要指定端口，后面加--port=8087即可
fi
EOF
```

> 构建镜像

在 /home/mm-wiki/mmwiki/build_images/ 目录下

```shell
docker build -t mm-wiki:v0.2.1 .
```

2. 运行mm-wiki镜像

```shell
docker run -itd --name mm-wiki -h wiki --link mysql:db -p 8090:8090 -p 8080:8080 -v /home/mm-wiki/mmwiki/data:/opt/mmwiki/data mm-wiki:v0.2.1

```

## 浏览器引导安装

1. 浏览器输入安装地址   http://10.230.77.18:8090/

2. 界面配置

[![系统配置](https://s21.ax1x.com/2024/03/25/pF4hjH0.png)](https://imgse.com/i/pF4hjH0)
[![数据库配置](https://s21.ax1x.com/2024/03/25/pF4hrtO.png)](https://imgse.com/i/pF4hrtO)
[![安装成功](https://s21.ax1x.com/2024/03/25/pF4h076.png)](https://imgse.com/i/pF4h076)

3. 界面访问登录

> 重启mm-wiki容器

```shell
docker restart mm-wiki

# 查看运行日志
docker logs -f mm-wiki
```

> 界面登录访问

http://10.230.77.18:8080/