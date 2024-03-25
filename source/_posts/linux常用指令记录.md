---
title: linux常用指令记录
catalog: true
date: 2019-03-25 20:41:36
subtitle:
header-img:
tags: linux
categories: 运维
---

- 软连接

ln -s 软件源目录 /usr/local/bin/

比如安装完 node 将`/app/software/nodejs/bin/node`的命令提示符直接通过`node`去访问

```shell
# ln -s 源文件bin目录 系统bin目录
ln -s /app/software/nodejs/bin/node /usr/local/bin/node
```

删除软连接

```shell
rm -rf /usr/local/bin/node
```

- 创建文件

```shell
touch XXX
```

- 查看进程

```shell
netstat -ntpl
```

- 查看使用指定端口的进程

lsof -i:XXXX

- 设置环境变量

`vi /etc/profile`在文件的最下方倒数第三行里面编写变量名，例如：`export NGINX=/usr/local/webserver/nginx/conf` 保存之后不会立即生效，需要输入`source /etc/profile`，之后`echo $NGINX`查看是否生效

- `rsync`跨服务器传输文件

```shell
  rsync  -rzte 'ssh -p 22' 源目录 目的地目录
```

要是服务器 A 要传文件到服务器 B，可能会存在没有权限的问题，这个时候就要 A 生成公钥`ssh-keygen`，将 A 的公钥`id_rsa.pub`内容复制到 B 服务器`.ssh/authorized_keys`内容下方，就可以解决权限问题了。

---

- 设置新建立的`shell`等脚本拥有可执行权限

```shell
chmod +x 路径
```

- 将指定用户/用户组加入到其他组

```shell
 gpasswd -a www root   // www将入到root组
```

- 给指定目录以指定用户/用户组的所有权限

事例：chown 用户名 目录

```shell
chown -R www:www /data/www-data/test
```

---

- source

用户登录系统会自动创建一个父`shell`，如果在这个父`shell`里面执行一个`shell`则为子`shell`，两者创建的变量是不会共享的，如果需要登陆的`shell`可以访问内部的`shell`变量，需要用`source`命令，在当前父`shell`窗口立刻执行子`shell`，能访问子`shell`变量，也不用注销用户登录。
`export`是父`shell`暴露变量给子`shell`使用

[source 详解](https://www.cnblogs.com/ThatsMyTiger/p/6865817.html)

环境变量

比如npm全局一些命令，如eslint、vue等这些，需要在`~`目录下新建`.bash_profile`文件

```shell
# 已重新设置npm全局目录为.npm-global
export PATH=~/.npm-global/bin:$PATH 
```

每次打开一个子shell窗口时，都需要`source`命令来共享父shell暴露出来的变量，这样会很麻烦，可以新建一个`vim ~/.zshrc`文件

```shell
source ~/.bash_profile
```

这个文件每次用户登录系统之后会默认执行此文件内容，这样就会在新建子shell的时候获取到父shell暴露出来的环境变量

---

- curl

  -O 将指定地址的文件下载到本地

```shell
curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-4.0.6.tgz
```

---

- tar 解压/压缩

  -c: 压缩

  -x：解压

  -t：查看内容

  -r：向压缩归档文件末尾追加文件

  -u：更新原压缩包中的文件

  -f：（必选且必须在最后一个参数）使用源文件名字

  -z：有 gzip 属性的

  -j：有 bz2 属性的

  -Z：有 compress 属性的

  -v：显示所有过程

  -O：将文件解开到标准输出

```shell
tar -zxvf 源文件
```

- zip

  -x 排除某个文件

---

- grep

查找字符串中指定的字符

```shell
# grep -r '我要查找的字符' ./src
grep [-acinv] [--color=auto] '搜寻字符串' filename
```

选项与参数：
-r : 在指定目录下搜索含有关键字的文件
-a ：将 binary 文件以 text 文件的方式搜寻数据
-c ：计算找到 '搜寻字符串' 的次数
-i ：忽略大小写的不同，所以大小写视为相同
-n ：顺便输出行号
-v ：反向选择，亦即显示出没有 '搜寻字符串' 内容的那一行！
--color=auto ：可以将找到的关键词部分加上颜色的显示喔！

---

- rm

-r 向下遍历目录文件依次删除
-f 强制删除

全部删除但排除某个文件

比如：排除.git 之外的所有文件

```shell
rm -rf `ls |grep -v .git`
```

---

- cp

cp -r 源目录地址 目标目录地址

- 新打开一个 shell 自动执行一些配置项 在/root/.bashrc 下编辑默认环境变量 全部 shell 共享需要修改/etc/profile

- ansible

远程服务器 切换目录`chdir`

```shell
ansible -i /opt/script/xxx.hosts duapp-node-common-service -u root -m shell -a 'chdir=/data/www-data/hupu.com/node-common sh start.sh'
```

---

- 全局查找某个文件

```shell
find / -name 文件名
```

常见错误处理参考链接：

1. [nginx 在 reload 时候报错 invalid PID number](https://www.cnblogs.com/tielemao/p/6163419.html)
2. [nginx: [emerg] invalid socket number ](https://blog.csdn.net/bikeorcl/article/details/78850265)

---

- 进程查看

ps -ef | grep

- head 查看文档的开始指定数量的字符块，默认显示文档的前 10 行

  - -c 显示文档开始的前c个字节
  - -n 显示文档前n行
  - -q 不显示包含给定文件名的文件头
  - -v 显示包含给定文件名的文件头

```bash
lsof -i:8080 | grep node | head -n 1

head -c 5 head.txt
```

- vim 多行编辑

ctrl+v，选中多行，按 s 键进入插入模式，再次输入编辑的文案，最后按 ESC 键，即可完成多行编辑

- bash 隐藏用户主机名称

在 vim ~/.bash_profile 文件中更改 export PS1

若啥也不显示 export PS1=''
简单显示 export PS1='\[\033[01;32m\]→ \W \[\033[00m\]'
