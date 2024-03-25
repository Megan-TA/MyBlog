---
title: mysql使用
catalog: true
date: 2020-04-10 12:28:07
subtitle:
header-img:
tags: mysql
---

## 安装

环境变量设置

Mac 下

```shell
vim ~/.bash_profile

PATH=$PATH:/usr/local/mysql/bin

source ~/.bash_profile
```

## 启动

Mac：

启动 mysql 服务 `sudo /usr/local/mysql/support-files/mysql.server start`

## 常用命令

登录 `mysql -uroot -p`

## 遇到的错误

1.Navicat Premium 12 连接 MySQL 数据库时会出现 Authentication plugin 'caching_sha2_password' cannot be loaded

出现这个原因是 mysql8 之前的版本中加密规则是 mysql_native_password,而在 mysql8 之后,加密规则是 caching_sha2_password, 解决问题方法有两种,一种是升级 navicat 驱动,一种是把 mysql 用户登录密码加密规则还原成 mysql_native_password.

第二种方式操作如下：

```shell
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;   #修改加密规则

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678';   #更新一下用户的密码

FLUSH PRIVILEGES;   #刷新权限
```

2.数据库不能插入中文

## 参考资料

1. [MySQL 连接出现 Authentication plugin 'caching_sha2_password' cannot be loaded](https://www.cnblogs.com/zhurong/p/9898675.html)
