---
title: rollup.js使用
catalog: true
date: 2019-09-25 11:29:27
subtitle:
header-img:
tags: javascript
---

output.format 生成包的格式，有如下格式：

1. amd -- 异步模块定义，用于像 RequestJS 这样的模块加载器。
2. cjs -- CommonJS, 适用于 Node 或 Browserify/webpack
3. es -- 将软件包保存为 ES 模块文件。
4. iife -- 一个自动执行的功能，适合作为 <script>标签这样的。
5. umd -- 通用模块定义，以 amd, cjs, 和 iife 为一体。
