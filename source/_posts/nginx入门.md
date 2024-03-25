---
title: nginx入门
catalog: true
date: 2019-06-19 13:34:23
subtitle:
header-img:
tags: nginx
categories: 运维
---

1. 环境

   CENTOS>=7.0,位数 X64 CENTOS 7.2

2. 关闭 iptables

   iptables 命令是 Linux 上常用的防火墙软件

   | 功能           | 命令                                |
   | :------------- | :---------------------------------- |
   | 停止防火墙     | systemctl stop firewalld.service    |
   | 永久关闭防火墙 | systemctl disable firewalld.service |

3. 安装依赖

   ```shell
   yum  -y install gcc gcc-c++ autoconf pcre pcre-devel make automake
   yum  -y install wget httpd-tools vim
   ```

4. 开始安装 nginx

   新建一个文件

   ```shell
   vi /etc/yum.repos.d/nginx.repo
   ```

   内容输入如下：

   ```shell
   [nginx]
   name=nginx repo
   baseurl=http://nginx.org/packages/centos/7/$basearch/
   gpgcheck=0
   enabled=1
   ```

   其中 centos/7 根据自己运行环境配置 系统名/版本号

   下载 nginx

   ```shell
   yum install nginx -y
   nginx -v
   nginx -V
   ```

---

## nginx 常用操作

1. 查看配置文件和目录

   ```shell
   rpm -ql nginx
   ```

   相关文件说明：

   | 类型     | 路径                                                                                                                              | 用途                                           |
   | :------- | :-------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- |
   | 配置文件 | /etc/logrotate.d/nginx                                                                                                            | 用于 logrotate 服务的日志切割                  |
   | 配置文件 | /etc/nginx /etc/nginx/nginx.conf /etc/nginx/conf.d /etc/nginx/conf.d/default.conf                                                 | 主配置文件                                     |
   | 配置文件 | /etc/nginx/fastcgi_params /etc/nginx/scgi_params /etc/nginx/uwsgi_params                                                          | cgi 配置,fastcgi 配置                          |
   | 配置文件 | /etc/nginx/koi-utf /etc/nginx/koi-win /etc/nginx/win-utf                                                                          | 编码转换映射转化文件                           |
   | 配置文件 | /etc/nginx/mime.types                                                                                                             | 设置 http 协议的 Content-Type 与扩展名对应关系 |
   | 配置文件 | /usr/lib/systemd/system/nginx-debug.service /usr/lib/systemd/system/nginx.service /etc/sysconfig/nginx /etc/sysconfig/nginx-debug | 用于配置系统守护进程管理器管理方式             |
   | 配置文件 | /etc/nginx/modules /usr/lib64/nginx/modules                                                                                       | nginx 模块目录                                 |
   | 命令     | /usr/share/doc/nginx-1.14.0 /usr/share/doc/nginx-1.14.0/COPYRIGHT                                                                 | nginx 的手册和帮助文件                         |
   | 目录     | /var/cache/nginx                                                                                                                  | nginx 的缓存目录                               |
   | 目录     | /var/log/nginx                                                                                                                    | nginx 的日志目录                               |

2. 启动和重新加载以及关闭

   ```shell
   systemctl restart nginx.service
   systemctl reload nginx.service
   systemctl stop nginx.service

   nginx -s reload
   ```

   如果在启动的时候可能会遇到下列问题：

   1. 端口被占用；

   ```shell
   Starting nginx: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)

   nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
   nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
   nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
   nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
   nginx: [emerg] still could not bind

   ```

   可以先查看进程，再杀死对应进程

   ```shell
   netstat -ntpl

   kill 进程号
   ```

3. 配置 nginx

> /etc/nginx/nginx.conf

查看日志命令 tailf -f log 目录

```shell
  user  nginx;   设置nginx服务的系统使用用户
  worker_processes  1;  工作进程数,一般和CPU数量相同

  error_log  /var/log/nginx/error.log warn;   nginx的错误日志
  pid        /var/run/nginx.pid;   nginx服务启动时的pid

  events {
      worker_connections  1024;每个进程允许的最大连接数 10000
  }

  http {
      include       /etc/nginx/mime.types;//文件后缀和类型类型的对应关系
      default_type  application/octet-stream;//默认content-type

      log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';  //日志记录格式

      access_log  /var/log/nginx/access.log  main;//默认访问日志 日志格式与log_format main 对应

      sendfile        on;//启用sendfile
      #tcp_nopush     on;//懒发送 客户端请求数据不会每次都时时相应 让数据塞满一次性发送给客户端（多用于下载、断点 续传）
      #tcp_nodelay on; // 默认开启 与nopush互斥 提高实时请求响应效率

      keepalive_timeout  65;//超时时间是65秒

      #gzip  on;gzip压缩

      include /etc/nginx/conf.d/*.conf;//包含的子配置文件
  }
```

> /etc/default.conf

```shell
  server {
      listen       80;
      # 用域名方式访问的地址
      server_name  localhost;

      #charset koi8-r; //编码
      #access_log  /var/log/nginx/host.access.log  main;  //访问日志文件和名称

      # 代理http协议请求
      location /api {
          proxy_pass http://localhost:3000;
      }

      # 代理ws协议请求
      location /ws {
        proxy_pass http://localhost:3000;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection ‘Upgrade‘;
      }



        # 代理/api/路径的请求 并去掉/api/路径进行转发
        location ~ /api/ {
            rewrite /api/(.*)$ /$1 break;
            proxy_pass  http://www.baidu.com;
        }

        location ~ / {
            root /data/www-data/bolton/;
            try_files $uri $uri/ /index.html;
            index index.html;
        }







      # 转发请求静态资源（js、css）规则
      location ~ .*\.(html|js|css)$ {
          # CORS
          add_header Access-Control-Allow-Origin *;
          add_header Access-Control-Allow-Methods GET,POST,DELETE;
          add_header Access-Control-Allow-Headers Content-Type;
          # 默认带上客户端cookie
          add_header Access-Control-Allow-Credentials true;
          # 缓存1h
          expires 1h;
          # 开启gzip
          gzip on;
          # gzip压缩HTTP版本号 一般是1.1
          gzip_http_version 1.1;
          # gzip压缩等级 越大压缩率越高 1-9
          gzip_comp_level 2;
          # 默认不指定不会缓存css资源 需要指定text/css类型
          gzip_types application/javascript text/css;
          # 资源目录
          root /data/html;
      }

      # 设置图片请求规则
      location ~ .*\.(gif|png|jpg|webp)$ {
          expires 1h;
          gzip on;
          gzip_http_version 1.1;
          gzip_comp_level 3;
          gzip_types image/jpeg image/png image/gif image/webp;
          ## 防盗链
          ## valid_referers 合法的域名 *.baidu.com
          ## <meta name="referrer" content="never">
          valid_referers none blocked xx.xxx.xxx.xx;
          if ($invalid_referer) {
              return 403;
          }
          # 资源目录
          root /data/html;
      }

      location ~ ^/download {
          # 默认先查找当前目录下的后缀为.gz文件 有直接返回给客户端 不需要再压缩
          # linux下运行gzip 文件名会生成压缩gz文件
          # url最直接访问该文件路径就会自动启动下载该资源
          gzip_static on;
          tcp_nopush on;
          root /data/download;
      }

      location / {
          root   /usr/share/nginx/html;  //静态文件根目录
          index  index.html index.htm;  //首页的索引文件
      }

      #error_page  404              /404.html;  //指定错误页面

      # redirect server error pages to the static page /50x.html
      # 把后台错误重定向到静态的50x.html页面
      error_page   500 502 503 504  /50x.html;
      location = /50x.html {
          root   /usr/share/nginx/html;
      }

      # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
      # 把PHP脚本9000端口上监听的FastCGI服务
      #location ~ \.php$ {
      #    root           html;
      #    fastcgi_pass   127.0.0.1:9000;
      #    fastcgi_index  index.php;
      #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
      #    include        fastcgi_params;
      #}

      # 不允许访问.htaccess文件 只允许指定的ip访问
      location ~ /\.ht {
          allow 127.0.0.1
          deny  all;
      }
  }
```

> 实现负载均衡

1. 解决高并发、海量数据问题
2. 配置类型

   1. 轮询（默认） 每个请求按照时间顺序逐一分配不同的后端服务器；
   2. ip_hash 每个请求按访问 ip 的 hash 结果分配，这样每个访客固定放一个后端服务器，可以解决 session 的问题；
   3. weight（加权轮询）指定轮询策略，weight 和访问比率成正比，用于后端服务器性能不均的情况；
   4. least_conn 最小连接数，哪个连接少就分给谁。

   集群状态：

| 状态         | 描述                                  |
| :----------- | :------------------------------------ |
| down         | 不参与负载均衡                        |
| backup       | 备份的服务器                          |
| max_fails    | 允许请求失败的次数                    |
| fail_timeout | 经过 max_fails 失败后，服务暂停的时间 |
| max_conts    | 限制最大的接收的连接数                |

```shell
    upstream test1 {
        ip_hsah;
        server http://localhost:3000 weight=2;
        server http://localhost:4000 weight=1;
        server http://localhost:5000 down;
    }

    server {
        # 访问负载均衡构造的集群
        location / {
            # 和upstrem的name对应
            proxy_pass http://test1;
        }
    }
    server {
        listen 80;
        server_name www.test1.com;
        location / {
            proxy_pass http://localhost:3000;
        }
    }
    server {
        listen 80;
        server_name www.test2.com;
        location / {
            proxy_pass http://localhost:4000;
        }
    }
    server {
        listen 80;
        server_name www.test3.com;
        location / {
            proxy_pass http://localhost:5000;
        }
    }

```

此时访问`www.test.com`通过代理到访问`www.test1.com`，而访问 test1 的请求被负载均衡按照策略访问 test1 或者 test2
