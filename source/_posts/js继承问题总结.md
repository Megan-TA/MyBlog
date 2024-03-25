---
title: js继承问题总结
catalog: true
date: 2019-09-24 12:24:41
subtitle:
header-img:
tags: javascript
categories: 前端
---

如果要用 js 实现一个类的话，我们会用构造函数来模拟一个类，代码如下：

```javascript
function Animal(name) {
  this.name = name;
  this.height = function() {
    console.log(this.name + "的高度未知");
  };
}

Animal.prototype.eat = function(food) {
  console.log(this.name + "正在吃" + food);
};
```

那现在我们需要继承这个`Animal`的类来实现一个具体的`Dog`类，我们一般会使用`组合继承`，方法如下：

```javascript
function Dog(name, age) {
  Animal.call(this, name);
  this.age = age;
}

Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;
```

目测是比较完美的继承方式了，但是仔细思考会发现有个问题：

1. 在`Dog.prototype = new Animal()`执行了一次`Animal`实例；
2. 在 Dog 类实例化时候，内部使用 call 方法的时候又执行了一次`Animal`实例化；

所以这并不是最完美的继承方式。那么我们应该使用什么样的办法才能解决上述问题呢？这个时候就需要用到`寄生继承`方式，代码如下：

```javascript
function Dog(name, age) {
  Animal.call(this, name);
  this.age = age;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```

利用一个中间对象先继承父类，减少了第一次继承父类原型的时候会实例化父类的缺点，这应该是目前最完美的继承方法。

参考资料：

1. [JS 组合继承（寄生继承）](https://www.jianshu.com/p/8a83ed26ecbb)
2. [Javascript 完美继承方式 - 寄生组合](https://www.jianshu.com/p/5d53d06ea918)
3. [理清原型对象、 实例对象、构造函数](https://juejin.im/post/5e6dec09f265da572c54a6e4)
