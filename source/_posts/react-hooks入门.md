---
title: react-hooks入门
catalog: true
date: 2020-01-08 16:50:48
subtitle:
header-img:
tags: react
categories: 前端
---

react hooks 发布于 React16.8.0 版本，这样的一个新的特性的作用是什么呢？

众所周知，react 默认使用组件类的语法，当我们在编写和维护这些组件类的时候，往往会遇到如下一些问题：

1. 组件之间复用状态逻辑比较困难

React 本身没有提供将可复用性行为添加到组件的方式，当然针对这些问题有一些方案，比如 render props 和高阶组件；但是在使用这些方案时，往往会需要重新组织当前组件的结构，这会比较麻烦。另外由 providers、consumers、高阶组件组成的抽象组件会形成`嵌套地狱`。基于这样的问题需要 React 本身为共享状态逻辑提供更高的原生途径。

hooks 可以在无需更改组件结构的情况下，提取状态逻辑，单独测试并复用。

2. 复杂组件很难拆分、重构、测试

我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。比如生命周期常常包含不相关逻辑，如果状态逻辑之间有关联更容易产生问题，多数情况下，因为状态逻辑无处不在，导致不能将组件拆分为更小粒度。

hooks 可以将组件相关的部分拆分成更小的函数，而非强制按照生命周期划分。

## Hook 含义

Hook 就是加强版本的函数组件，如果需要外部功能（react 其他功能）和副作用，就用钩子把外部代码"钩"进来。

参考文档：

1. [React Hooks 入门教程](http://www.ruanyifeng.com/blog/2019/09/react-hooks.html)
2. [React 官方文档 Hook 简介](https://react.docschina.org/docs/hooks-intro.html)
