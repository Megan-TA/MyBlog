---
title: node内存监控
catalog: true
date: 2020-11-12 18:52:17
subtitle:
header-img:
tags: node
categories: 前端
---

我们都知道，当使用Node在生产环境作为服务器语言时，并发量过大或者因为代码问题很容易造成OOM或者CPU满载这些常见问题，此时通过监控CPU、内存，再结合日志和Release就能很容易发现问题。

那么如何知道本地Node服务平时占用内存多少？或者说是如何知道某个进程消耗多少内存？

示例测试代码

```javascript
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  ctx.data = new Array(10000).fill(10000).map(x => 10)
  await next()
})

app.use(ctx => {
  ctx.body = 'hello, world'
})

app.listen(8080, () => console.log('Port: 8080'))
```

## 如何找到进程的pid

1. 通过多余参数结合ps定位进程；
2. 通过端口号结合lsof定位进程；

```bash
$ node index.js test

# 第一种 ps+多余参数
$ ps -ef | grep test

  501 90194 83348   0  7:02下午 ttys003    0:00.08 node index.js test
  501 90200 84062   0  7:02下午 ttys004    0:00.00 grep test

# 第二种 lsof+端口号定位
$ node  lsof -i:8080 | grep node

  node 90194 mac  22u  IPv6 0x49017005e24b683s      0t0  TCP *:http-alt (LISTEN)

```

## 压力测试

利用常用的ab进行测试

```bash
# -c 客户端数量
# -n 请求量
ab -c 200 -n 1600 http://127.0.0.1:8080/
```

## pidstat监控内存变化

pidstat 是 sysstat 系列 linux 性能调试工具的一个包，竟然用它来调试 linux 的性能问题，包括内存，网络，IO，CPU 等。

```bash
# -r: 指输出内存指标
# -p: 指定 pid
# 1: 每一秒输出一次
# 100: 输出100次

$ pidstat -r -p 90194 1 100

               UID    PID   minflt/s  majflt/s     VSZ    RSS    %MEM  Command
19时20分39秒     0     11401      0.00      0.00  566768  19800   0.12  node
19时20分40秒     0     11401      0.00      0.00  566768  19800   0.12  node
19时20分41秒     0     11401   9667.00      0.00  579024  37792   0.23  
```

RSS：常驻内存集，可理解为内存，是我们需要监控的指标。

VSZ：虚拟内存

## top监控内存变化

mac上可以使用htop

```bash
#安装
brew install htop

htop -p 90194
```

常用命令：

1. PID：进程标志号，是非零正整数
2. USER：进程所有者的用户名
3. PRI：进程的优先级别
4. NI：进程的优先级别数值
5. VIRT：进程占用的虚拟内存值
6. RES：进程占用的物理内存值，单位KB
7. SHR：进程使用的共享内存值
8. S：进程的状态，其中S代表休眠，R代表正在运行，Z表示僵死状态，N代表该进程优先级是负数
9. %CPU：该进程占用的cpu使用率
10. %MEM：该进程占用的物理内存和总内存的百分比
11. TIME+：该进程启动后占用的总的CPU时间
12. COMMAND：进程启动的启动命令名称

[![DS5c6J.png](https://s3.ax1x.com/2020/11/13/DS5c6J.png)](https://imgchr.com/i/DS5c6J)

ab命令施加压力，会明显看到内存数据在暴涨

[![DS5zh8.png](https://s3.ax1x.com/2020/11/13/DS5zh8.png)](https://imgchr.com/i/DS5zh8)
