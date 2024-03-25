---
title: 浅析node进程与线程
catalog: true
date: 2020-03-13 18:37:20
subtitle:
header-img:
tags: node
categories: 前端
---


## 概念

进程：是一个具有一定独立功能的程序在一个数据集上的一次动态执行的过程，是操作系统进行资源分配和调度的一个独立单位，是应用程序运行的载体。

线程：是程序执行中一个单一的顺序控制流，它存在于进程之中，是比进程更小的能独立运行的基本单位。

个人不成熟的通俗理解为：

进程好比一个货物工厂的传送带，每个传送带是相互独立，执行各自任务，其中线程就是传送带上的机械手臂，控制货物在传送带上的具体摆放。

## 单线程

常说的 node 是单线程，往往说的只是 node 只有一个 js 执行主线程，实际 node 有其他多个线程组成；

示例

```javascript
require("http")
  .createServer((req, res) => {
    res.writeHead(200);
    res.end("Hello World");
  })
  .listen(8000);
console.log("process id", process.pid);
```

此时 8000 端口的服务 pid 为 35919，在 linux 下通过`top -pid 35919`查看详细信息如下：

```javacript
PID    COMMAND      %CPU TIME     #TH  #WQ  #POR MEM    PURG CMPRS  PGRP  PPID  STATE    BOOSTS     %CPU_ME
35919  node         0.0  00:00.09 7    0    35   8564K  0B   8548K  35919 35622 sleeping *0[1]      0.00000
```

其中 TH 是进程信息，表明当前进程有 7 个线程。

事实上一个 Node 进程通常包含：

- 1 个 Javascript 执行主线程；
- 1 个 watchdog 监控线程用于处理调试信息；
- 1 个 v8 task scheduler 线程用于调度任务优先级，加速延迟敏感任务执行；
- 4 个 v8 线程，主要用来执行代码调优与 GC 等后台任务以及用于异步 I / O 的 libuv 线程池。

```c++
// v8 初始化线程
const int thread_pool_size = 4; // 默认 4 个线程
default_platform = v8::platform::CreateDefaultPlatform(thread_pool_size);
V8::InitializePlatform(default_platform);
V8::Initialize();
```

其中异步 I/O 线程池，如果执行程序中不包含 I/O 操作如文件读写等，则默认线程池大小为 0，否则 Node 会初始化大小为 4 的异步 I/O 线程池，当然我们也可以通过 process.env.UV_THREADPOOL_SIZE 自己设定线程池大小。需要注意的是在 Node 中网络 I/O 并不占用线程池。

![Node进程结构图](https://user-gold-cdn.xitu.io/2019/12/28/16f4bf755017c54b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 事件循环

Node 高并发是通过 libuv 实现的一个异步，非阻塞 I/O 的事件循环机制，参考浏览器事件循环，可保证程序时时刻刻都能保证响应

![Node事件环](https://user-gold-cdn.xitu.io/2019/12/28/16f4bf749b92cfe4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 子进程

Node 在处理 I/O 密集场景下的高并发，但在遇到 CPU 密集场景下，主线程被长时间阻塞导致无法处理额外请求。

为了处理这样场景以及发挥多核 CPU 性能，官方提供了`child_process`模块。

- 通信

在 Linux 中，子进程之间可以通过管道、消息队列、信号量、共享内存、socket 等手段实现进程通信。

Node 中使用 IPC 信道收发消息，IPC 由 libuv 通过 pipe 实现。

父子进程通过`process.send`和`on('message')`这样发布订阅模式形式实现通信。

```javascript
// fork模式用来创建父子通信模式
const { fork } = require("child_process");
const child = fork("./a.js");
child.start();

child.on("message", () => {});

child.on("exit", () => {});
```

## cluster

为了更好管理进程、负载均衡以及端口复用，官方引入了`cluster`模块，遵循主从节点模式。

## 工作线程

Node10 以后，由于进程创建、销毁、切换时系统开销较大，为了减小 CPU 密集型任务计算的系统开销，官方提供了`worker_threads`模块。

使用 parentPort （继承于 EventEmitter）进行父子线程通信

参考资料：

- [政采云前端-浅析 Node 进程与线程](https://juejin.im/post/5e0728ce518825122b0f99f2)
