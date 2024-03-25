---
title: js中几种设计模式
catalog: true
date: 2019-07-14 21:50:10
subtitle:
header-img:
tags: javascript
categories: 前端
---

## 工厂模式

> 由工厂对象决定创建某一个对象类的实例

特点：

不关心创建过程，仅仅关心最终创建结果。

```javascript
// 案例1
var factory = funciton (name) {
    switch(name) {
        case 'nba':
            return new NBA()

        case 'cba':
            return new CBA()
    }
}

// 案例2
class Product {
  constructor(name) {
    this.name = name;
  }
}

class Creator {
  create(name) {
    return new Product(name);
  }
}

const creatorInstance = new Creator();

creatorInstance.create("张三");

```

应用场景：

- 针对同一类别对象，不同表现。比如登录成功之后针对不同用户提示不同话术
- React.createElement 也是工厂模式实现
- jquery的$选择器

## 建造者模式

> 高级版本的工厂模式

特点：

不仅关心结果，也关心创建过程

增加了结构的复杂性，如果对象粒度很小或者模块间很少复用或变动不大，最好创建完整对象。

```javascript
var Human = () => {};
var Name = () => {};
var Work = () => {};

var Person = (name, work) => {
  var human = new Human();
  human.name = new Name();
  human.work = new Work();
};

const person1 = new Person("建造者模式", "it");
const person2 = new Person("工厂模式", "it");
```

## 单例模式

一个类只有一个实例，并提供全局访问的方法

单例可以利用闭包实现，达到保护私有变量目的

特点：

1. 命名空间；
2. 模块分明

```javascript
class Single {
  login() {}
  shopping() {}

  user: {};

  shop: {};
}

Single.getInstance = (function() {
  let Instance;
  return () => {
    if (!Instance) {
      Instance = new Single();
    }
    return Instance;
  };
})();

const signleInstanceA = Single.getInstance();
const signleInstanceB = Single.getInstance();
console.log(signleInstanceA === signleInstanceB); // true
```

应用场景：

- 一般用于登录、购物车等比较单一状态应用场景

---

## 外观模式

> 为子系统提供更高级的统一接口，屏蔽子系统内部接口差异

就是常说的封装

```javascript
function addEvent(dom, type, fn) {
  if (dom.addEventListener) {
  } else if (dom.attachEvent) {
  } else {
    dom["on" + type] = fn;
  }
}

addEvent(div, "click", () => {});
```

应用场景：

比如处理 js 兼容性提供兼容模式

## 适配器模式

> 用来解决两个接口不兼容问题，由一个对象来包装不兼容的对象，比如参数转换，允许直接访问

```javascript
class Adapter {
  money() {
    return "人民币";
  }
}

class AdapterWrapper {
  constructor() {
    this.Adapter = new Adapter();
  }

  m2$() {
    const m = this.Adapter.money();
    return `人民币兑换成美元`;
  }
}

const adapterWrapper = new AdapterWrapper();
adapterWrapper.m2$();
```

应用场景：

- 处理接口返回字段不一致
- 多个对象合并成一个对象
- 欧式标准插头转换成中国标准插头

## 装饰器模式（AOP 编程）

> 在不改变源对象的自身方法的基础上，给源对象自身方法提供新的功能

```javascript
class Source {
  add(a, b) {
    return a + b;
  }
}

class DecorateSource {
  constructor() {
    this.source = new Source();
  }
  add(a, b) {
    console.log("传入的参数为", a, b);
    return this.source.add(a, b);
  }
}

const decorateSource = new DecorateSource();
decorateSource.add(1, 2); // 传入的参数为 1 2     3
```

应用场景：

- 处理 ajax 异常上报，数据分析
- Vue 中处理数组变异方法

## 观察者模式

> 定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知

```javascript
class Sub {
  constructor() {
    this.observers = [];
  }
  attach(observer) {
    this.observers.push(observer);
  }
  notify() {
    this.observers.forEach(observer => {
      observer.update();
    });
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  update() {
    console.log(`${this.name}触发更新`);
  }
}

const observerA = new Observer("A");
const observerB = new Observer("B");
const sub = new Sub();
sub.attach(observerA);
sub.attach(observerB);
sub.notify();
```

应用场景：JS 事件、promise、Vue 的 watch 方法

与订阅/发布模式区别 主要在于调度不同。观察者模式由具体目标方法调度，而订阅发布模式由统一调度中心去调度，所以观察者模式的观察者和目标会有依赖，而后者没有。
