---
title: 前端CSS知识点总结
catalog: true
date: 2022-06-17 09:12:34
subtitle:
header-img:
tags: CSS
categories: 前端
---


# BFC是什么？BFC能用来干什么？怎么才能触发BFC？

BFC（块格式化上下文）

BFC 是页面中一块独立的“渲染特区”，里面的子元素无论如何折腾（浮动、margin 折叠等），都不会影响到外部；外部也干扰不到它。

## 为什么要有 BFC
正常流里有两个老大难：
1. 浮动元素会“脱流”，父级高度塌陷；
2. 垂直 margin 会“合并”，相邻元素间距失控。

BFC 就是给一段盒子加上“结界”，让它重新按一套更严格的规则计算布局和高度，从而包住浮动、阻止 margin 折叠、阻止文字环绕。

触发BFC几种方式：
- 浮动 （float不为none即可）
- 绝对定位（position: absoulte 或 fixed）
- display: inline-block | table-cell | flex | inline-flex
- overflow （除了visible之外的值）

```javascript
.bfc { display: flow-root; } 
```

BFC特点
- 如果两个块级元素属于同一个BFC，上下margin会重叠，以较大的为准；
- BFC区域不会与浮动元素的区域重叠；
- 页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。

BFC作用
- 清除元素浮动；
- margin重叠；
- 两栏布局；