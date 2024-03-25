---
title: js部分代码模拟实现
catalog: true
date: 2020-03-14 01:22:37
subtitle:
header-img:
tags: js
---

## 原生 ajax 实现

```javascript
const xhr = new XMLHttpRequest();

// get请求
xhr.open("get", `${url}?${参数}`, true);

// post请求
xhr.open("post", url, true);
xhr.setRequestHeader("Content-type", "application/json");
xhr.send("username=1&age=19");

xhr.onreadystatechange = function() {
  if (xhr.status == 200 && xhr.readyState == 4) {
    var result = xhr.responseText;

    return result;
  }
};
```
