---
title: 常见css布局问题
catalog: true
date: 2020-03-19 22:30:45
subtitle:
header-img:
tags: css
categories: 前端
---

## 左右两边盒子宽度固定，中间盒子宽度自适应

- 利用相对定位

```html
<div class="box">
  <div class="left"></div>
  <div class="main"></div>
  <div class="right"></div>
</div>

<style>
  .box {
    position: relative;
  }

  .left {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid blue;
  }

  .right {
    width: 100px;
    height: 100px;
    position: absolute;
    right: 0;
    top: 0;
    border: 1px solid red;
  }

  .main {
    height: 100px;
    padding: 0 100px;
    border: 1px solid yellow;
  }
</style>
```

效果图如下：

[![8yjodJ.md.png](https://s1.ax1x.com/2020/03/19/8yjodJ.md.png)](https://imgchr.com/i/8yjodJ)

- flex 布局

```html
<div class="box1">
  <div class="left1"></div>
  <div class="main1"></div>
  <div class="right1"></div>
</div>

<style>
  .box1 {
    display: flex;
  }

  .left1 {
    width: 100px;
    height: 100px;
    background: blue;
  }

  .right1 {
    width: 100px;
    height: 100px;
    background: red;
  }

  .main1 {
    flex: 1;
    height: 100px;

    background: #000;
  }
</style>
```

效果图如下：

[![8yv3lV.md.png](https://s1.ax1x.com/2020/03/19/8yv3lV.md.png)](https://imgchr.com/i/8yv3lV)

---

## 圣杯布局

步骤：

1. 父盒子清除浮动，子盒子全部左浮动；
2. left2 和 right2 各设置固定宽度，中间 main2 盒子 width：100%，此时会把 left2 和 right2 挤到第二行来；
3. left2 盒子利用 margin-left: -100%，位置会到第一行最左侧，同时会挡住 main2；
4. 主盒子 box2 利用 padding-left 和 padding-right 给左右盒子留出位置；
5. 利用相对定位设置 left：-left2 宽度进行占位；
6. 同理，right2 盒子 margin-left：-right2 盒子宽度到第一行最右侧；
7. 设置 right：-right2 盒子宽度，去占右边空白位；

```html
<div class="box2">
  <div class="main2"></div>
  <div class="left2"></div>
  <div class="right2"></div>
</div>

<style>
  .box2 {
    overflow: hidden;
    padding-left: 100px;
    padding-right: 150px;
  }

  .main2,
  .left2,
  .right2 {
    float: left;
    position: relative;
  }

  .main2 {
    width: 100%;
    height: 100px;
    background: rgb(206, 201, 201);
  }

  .left2 {
    width: 100px;
    height: 100px;
    margin-left: -100%;
    left: -100px;
    background: rgba(95, 179, 235, 0.972);
  }

  .right2 {
    width: 150px;
    height: 100px;
    margin-left: -150px;
    right: -150px;
    background: rgb(231, 105, 2);
  }
</style>
```

效果图如下：

[![8yxkN9.md.png](https://s1.ax1x.com/2020/03/19/8yxkN9.md.png)](https://imgchr.com/i/8yxkN9)

---

## 双飞翼布局

和圣杯布局一致，不过多了一个元素

```html
<div class="box3">
  <div class="main3_box">
    <div class="main3"></div>
  </div>
  <div class="left3"></div>
  <div class="right3"></div>
</div>

<style>
  .box3 {
    overflow: hidden;
  }

  .main3_box,
  .left3,
  .right3 {
    float: left;
    height: 100px;
  }

  .main3_box {
    width: 100%;
    background: rgb(231, 105, 2);
  }

  .main3 {
    height: 100px;
    margin: 0 150px 0 100px;
    background: red;
  }

  .left3 {
    width: 100px;
    margin-left: -100%;
    background: rgb(206, 201, 201);
  }

  .right3 {
    width: 150px;
    margin-left: -150px;
    background: rgba(95, 179, 235, 0.972);
  }
</style>
```

效果图如下：

[![86CoXq.md.png](https://s1.ax1x.com/2020/03/19/86CoXq.md.png)](https://imgchr.com/i/86CoXq)
