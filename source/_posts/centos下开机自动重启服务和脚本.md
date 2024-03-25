---
title: centos下开机自动重启服务和脚本
catalog: true
date: 2019-07-08 10:45:59
subtitle:
header-img:
tags: linux
categories: 运维
---

1. ### 利用`chkconfig`添加开机自启服务

```shell
chkconfig

--list 各项服务状态栏显示出来
--level 设置某个服务在该状态栏显示出来

单独开启某一服务的命令：chkconfig 服务名 on

单独关闭某一服务的命令：chkconfig 服务名 off

查看某一服务的状态：/etc/intd.d/服务名 status

```

我这里以docker 服务为例，设置如下两条命令即可：

```shell
1  # systemctl enable docker.service #设置docker服务为自启动服务 相当于我们的 chkconfig docker on
2 # systemctl start docker.service #启动docker服务

```

2. ### 添加开机自启脚本

- 方法一

    1. 赋予脚本可执行权限（/opt/script/duDefaultService.sh是你的脚本路径）

    2. 打开/etc/rc.d/rc.local文件，在末尾增加如下内容

    ```shell
    echo "/opt/script/duDefaultService.sh" >> /etc/rc.d/rc.local
    ```

    3. 在centos7中，/etc/rc.d/rc.local的权限被降低了，所以需要执行如下命令赋予其可执行权限

    ```shell
    chmod +x /etc/rc.d/rc.local
    ```

- 方法二

    0. 设置sh启动脚本必要参数

    ```shell
    #!/bin/sh
    #chkconfig: 2345 80 80
    #description: auto start web server

    ```

    第一句：必须的
    声明sh
    第二句：必须的
    2345 表示linux 有 0-6种状态 在2345下启动
    80：表示启动顺序
    80：表示关闭顺序
    后面两个参数小于 100
    第三句：必须的
    描述

    结果截图如下：
    {% asset_img WX20190708-113220.png 自动重启服务列表截图 %}

    1. 将脚本移动到/etc/rc.d/init.d目录下

    ```shell
    mv  /opt/script/duDefaultService.sh /etc/rc.d/init.d
    ```

    2. 增加脚本的可执行权限

    ```shell
    chmod +x  /etc/rc.d/init.d/duDefaultService.sh
    ```

    3. 添加脚本到开机自动启动项目中

    ```shell
    cd /etc/rc.d/init.d
    chkconfig --add duDefaultService.sh
    chkconfig duDefaultService.sh on
    ```

- 方法三

    1.建立服务文件

    vim /lib/systemd/system/nginx.service

    [Unit]

    Description=nginx

    After=network.target

    [Service]

    Type=forking

    ExecStart=/www/lanmps/init.d/nginx start

    ExecReload=/www/lanmps/init.d/nginx restart

    ExecStop=/www/lanmps/init.d/nginx  stop

    PrivateTmp=true

    [Install]

    WantedBy=multi-user.target

    [Unit]:服务的说明

    Description:描述服务

    After:描述服务类别

    [Service]服务运行参数的设置

    Type=forking是后台运行的形式

    ExecStart为服务的具体运行命令

    ExecReload为重启命令

    ExecStop为停止命令

    PrivateTmp=True表示给服务分配独立的临时空间

    注意：[Service]的启动、重启、停止命令全部要求使用绝对路径

    [Install]服务安装的相关设置，可设置为多用户

    2.保存目录

    以754的权限保存在目录：

    /lib/systemd/system  

    3.设置开机自启动

    systemctl enable nginx.service  

    ```shell
    systemctl enable XXXX.service
    ```
