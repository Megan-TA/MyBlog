---
title: python爬虫框架scrapy
catalog: true
date: 2019-06-19 14:07:34
subtitle:
header-img:
tags: crawler
categories: python
---

### 基本用法

1.创建项目

```shell
scrapy startproject 项目名称
```

2.创建一个爬虫

```shell
scrapy genspider XX XX.com
```

3.启动脚本

```shell
scrapy crawl XX
```

也可以新建一个启动文件，比如`start.py`

```python
from scrapy.cmdline import execute

execute('scrapy crawl stockX'.split())
```

4.爬虫脚本

必须要有`name`，这个是和启动对应命令对应的的名称

`parse`以及`start_urls`和`allowed_domains`可选

```python
# -*- coding: utf-8 -*-
import scrapy

class BaiduSpider(scrapy.Spider):
    name = 'baidu'
    allowed_domains = ['baidu.com']
    start_urls = ['https://www.baidu.com/']

    def parse(self, response):
        print(response.text)
```

其中 start_urls 可以接受多个 url 参数，也可以拆分成多个步骤

```python
# -*- coding: utf-8 -*-
import scrapy

class BaiduSpider(scrapy.Spider):
    name = 'baidu'
    allowed_domains = ['baidu.com']
    # start_urls = ['https://www.baidu.com/']

    def start_requests(self):
        yield scrapy.Request('https://www.baidu.com')

    def parse(self, response):
        print(response.text)
```

---

1. `Items`相当于定义的需要输出的数据模型，用来存储数据，推送给`pipline`解析处理；

2. 如果要爬取多组数据，最好是建立多个模型，即`Item`；

---

## Pipline

### 1. 介绍

当 item 在 Spider 中被收集之后，会传递到 item pipline 中处理；

作用：

- 清理 html 数据
- 验证爬取数据
- 去重并丢弃
- 数据持久化

### 2. 编写 item pipline

2.1 必须实现的函数

- process_item

  每个`pipline`都是一个 python 类，负责接收到`item`并执行一些行为，内部必须实现`process_item(self, item, spider)`方法，必须返回一个`dict`或者`item`对象。

  `piplines`只能接受字典和`items`，在主程序通过`yield`推送到`piplines`

  2.2 可以选择实现

- `open_spider(self, spider)`表示当 spider 开启的时候调用的方法；
- `close_spider(self, spider)`标识当 spider 关闭的时候调用的方法；

注意：

- `pipline`写完需要在配置项`settings`的`ITEM_PIPELINES`里写入来启动

```python
ITEM_PIPELINE {
  demo.pipelines.testDemoPipeline : 300    // 300是优先级 越大优先级越高
}
```

- 文件流写入是缓冲一定字节的数据再一次性写入

  强制立刻写入

```python
self.file.flush()
```

---

2.3 如果编写多个`pipeline`，则会改成指定大小去依次执行每次推过来的`item`，如果需要丢弃`item`

```python
 from scrapy.exceptions import DropItem

 raise DropItem()
```

2.4 推送过来的`item`并不是一个 list，如果需要存储数据，则需要转成字典

```python
 self.json_file.writelines(json.dumps(dict(item), ensure_ascii=False) + '\r')
```
