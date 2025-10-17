---
title: 前端知识点总结
catalog: true
date: 2018-07-21 10:24:38
subtitle:
header-img:
tags: javascript
categories: 前端
---

# 解码和编码

> 原因：因为链接里面会有中文或者特殊字符号无法跳转需要进行相关编码解码

## 编码

'encodeURI': 只对查询的参数做编码

'encodeURIComponent': 对整个url做编码，包括? & / #

```javascript
a = 'www.baidu.com/test?name="zhangsan"'
encodeURI(a) => 'www.baidu.com/test?name=%22zhangsan%22'
encodeURIComponent(a) => 'www.baidu.com%2Ftest%3Fname%3D%22zhangsan%22'
```

## 解码

'decodeURI': 只对查询参数做解码
'decodeURIComponent': 对整个URL做解码


# 序列化和反序列化

>

```
JSON.stringify()        // 序列化
JSON.parse()            // 反序列化
```

使用 ajax 需要设置请求头部信息

header: {'Content-Type': 'application/json; charset=utf-8;'}

> JSON.stringify() 可以简单的用来迅速判断两个对象是否相等，但不严谨（比如：序列化失败）

---

# 日期

```
new Date().getTime()   // 单位  秒
// 获取当前时间   （存在兼容性）
new Date().toLocaleDateString() // 2017/7/24
new Date().toLocaleTimeString() // 下午5:07:33
new Date().toLocaleString()     // 2017/7/24 下午5:07:33
// 若要显示24进制 需要option选项
new Date().toLocaleTimeString("UTC",{ hour12: false })  // 17:20:16
```

---

# 重排/重绘

1. 重排（回流）：几何属性发生变化 比如：内容、结构、位置或尺寸发生变化，需要重新计算样式和渲染树；

2. 重绘：元素发生的改变只影响了节点的一些样式（背景色、边框色、文字颜色等）

回流必定会发生重绘，重绘不一定会引发回流。

> 重排比重绘要消耗更多的资源


# typeof 和 instanceof

> ## typeof

会返回一个变量的基本类型，只有以下几种：number,boolean,string,object,function；

缺点：

- 不适用于来判断数组，因为不管是数组还是对象，都会返回 object。
- 判断不了 null null 也是对象

```
typeof [1]      // Object
```

> ## instanceof

通过原型链来判断，返回的是一个布尔值 "只能用来判断对象和函数"

```
var a = {};
alert(  a instanceof Object )     // true
var a  = [];
alert(  a instanceof Array )    // true
```

最靠谱也是最方便的办法使用`Object.prototype.toString.call()`来判断

---

# requestAnimationFrame （RAF） 动画 api 兼容 Ie 8/9

```
var i = 0

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})()

requestAnimFrame(animloop)

function animloop () {
    document.getElementById('test').style.top = i ++
}

```

## 优点
1. 解决毫秒的不精确性；
2. 避免过渡渲染；
3. 浏览器可以优化并行的动画动作，将合并的动作放入一个渲染周期；
4. 过程可控；

## css3动画高效的原因：
优点：
1. 强制使用硬件加速（GPU）；
2. 使用与RAF类似的机制；
3. 优化DOM操作 避免内存消耗来减少卡顿；

缺点：
1. 同时因为采用GPU， 导致浏览器一直出于高负荷运转，移动端电量损耗和一定卡顿；
2. 而且css不能完全被js控制
3. pc上兼容性

js 动画库 （比如 Velocity.js 和 GSAP）

---


# selection

> 获取鼠标划过文本的对象
> `window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();`

---

# 正则表达式

> 常用规则

- \n 回车
- \t 制表符
- \r 换行符
- \s 空格
- \u4e00-\u9fa5 中文
- \w 大小写字母\_数字
- \b : 独立的部分 （ 起始，结束，空格 ）
- {n, m} 至少出现 n 次 最多 m 次
- {n,} 至少 n 次
- \* 任意次
- \+ 至少一次
- {n} 至少 n 次
- () 分组符号
- [\s\S] 任意字符
- ^ 放在正则的最开始位置，就代表起始的意思，注意 /[^a] / 和 /^[a]/是不一样的，前者是排除的意思，后者是代表首位。
- \$正则的最后位置 , 就代表结束的意思
- ?<= 向前匹配 ?= 向后匹配
 
匹配中文: [\u4e00-\u9fa5]

例如：

```
var str = '2013-6-7';
var re1 = /\d-+/g;        // 全局匹配数字，横杠，横杠数量至少为1，匹配结果为：  3- 6-
var re1 = /(\d-）+/g;     // 全局匹配数字，横杠，数字和横杠整体数量至少为1   3-6-
var re2  = /(\d+)(-)/g;   // 全局匹配至少一个数字，匹配一个横杠 匹配结果：2013- 6-

--------------------------
var str = '2013-6-7';
var re = /(\d+)(-)/g;

str = str.replace(re,function($0,$1,$2){

    //replace()中如果有子项，
    //第一个参数：$0（匹配成功后的整体结果  2013-  6-）,
    // 第二个参数 : $1(匹配成功的第一个分组，这里指的是\d   2013, 6)
    //第三个参数 : $1(匹配成功的第二个分组，这里指的是-    - - )
    return $1 + '.';  //分别返回2013.   6.

});

```

- [] 表示某个集合中的任意一个
- [^a] 排除 a

```
// var re = /\bclassname\b/;

// 不能这样写，当正则需要用到参数时候，一定要用全称的写法，简写方式会
// 把classname当做一个字符串去匹配。

var re = new RegExp('\\b'+classname+'\\b');

// 匹配的时候，classname前面必须是起始或者空格，后面也是。

默认匹配成功就停止，所以就算有重复的也不会再匹配进去了。
```

---

# Object

    [[Prototype]] 
    .prototype: 只有函数才拥有的普通属性，用来给"将来被new 出来的实例"做原型

    ```javascript
    obj.__proto__ === Object.getPrototypeOf(obj) 

    // 创建原型
    Object.create()
    ```




    1. constructor

        实例的constructor 永远指向 构造函数 的 prototype.constructor

        理解成 实例是基于构造函数原型链生成的对象

```

function A(x){
    this.x = x;
}
var newA = new A(name);

此时：
newA.constructor == A.prototype.constructor;

```

    2. hasOwnProperty

        判断对象上某个属性是否属于自身 属于自身为true, 原型链上为false

```
    function a () {
        this.show = 'x';
    }
    a.prototype.hide = function () {
        console.log(111111);
    }
    var z = new a();
    z.hasOwnProperty('show');          // true
    z.hasOwnProperty('hide');          // false
```

    3. isPrototypeOf

        判断一个对象是否是另一个对象的原型

```
    var monkey = {
        hair : true,
        breathes : function(){
            alert('1')
        }
    }
    function Human(name){
        this.name = name;
    }
    // Human的原型链绑定monkey对象
    Human.prototype = monkey;

    var man = new Human('张三');
    monkey.isPrototypeOf(man);      // true

```

    4. prototype和__proto__

        prototype是一个函数的内置属性（每个函数都有一个prototype属性）

        __proto__ 是一个实例对象的内置属性 实例化的对象在内部通过此属性寻找原型链

```
var Person = function () {}
var zhangsan = new Person ()

zhansan.__prop__ = Person.prototype

new 的过程拆分成以下四步

1. var p = {}
2. p.__proto__ = Person.prototype
3. ret = Person.call(p, arguments)
4. 返回值ret若是对象则直接返回ret，不是则返回新的对象p
```

    5. Object.getPrototypeOf

        获取 实例化对象 原型链 的相关属性

```
function Test () {

}

test.prototype.showName = function () {
    console.log(1)
}

let obj = new Test ()
Object.getPrototypeOf(obj) == obj.__proto__

```

    6. Object.keys

        可以用来枚举可遍历的属性 返回一个数组

    7. Object.create

        在原型链上创建对象属性

```
    <!-- 属性创建在原型链上 -->
    Object.create({
        name: '张三'
    })

    <!-- 字面量方式创建的对象属性挂在自身 -->
    let test = {
        name: '张三'
    }

```

    8. Object.isExtensible

        判断对象是否可以新增属性

    9. Object.preventExtension

        锁住对象 使其不能新增属性 但是原来的属性可以修改删除

    10. Object.seal

        密封对象 不能增加新属性 也不能删除旧属性  但是能修改原来的属性

    11. Object.isSealed

        判断对象是否密封

    12. Object.freeze

        冻结对象 不能新增 不能修改 不能删除

    13. Object.isFrozen

        判断对象是否完全被冻结

    14. Object.getOwnPropertyNames

        获取自身属性名字 返回一个数组

    15. Object.getOwnPropertyDescriptor

        判断某个对象上某个属性的状态描述

    16. Object.defineProperty




    -----------

# 继承

> **调用另一个对象的方法，以另一个对象替换当前对象的上下文**
>
> > 缺点
> >
> > > 只能继承父级本身属性，原型链的属性无法继承

- **call**
  > 第二个参数可以省略
- **apply**
  > 第二个参数必须是数组或者用 arguments 代替
- **bind**
  > bind 与 call 和 apply 的区别在于 bind 是一个函数 不会立即执行 必须在后面再加上一对括号去立即执行

```
例子1：

function Add(a,b)
{
    this.add = function(a,b){
        alert(a+b)
    };
    this.xx = 333;
}
function Sub()
{
    this.sub = '张三';

    // call方法
    Add.call(this); // call继承Add所有方法(不包含原型链上的方法)

    // apply方法  参数不能指定的时候用[]或者arguments代替
    Add.apply(this, [])
    // 又可以写成
    Add.apply(this, arguments)

    // bind方法
    Add.bind(this)();
}

x = new Sub();
x.add(5,7)                  // 11

=====================================

例子2：

若只想继承父级构造函数某一个具体方法
需要先将父子对象都实例化后 调用父级的具体方法call

function Add(a,b)
{
    this.add = function(a,b){
        alert(a+b)
    };
    this.xx = 333;
}
function Sub()
{
    this.sub = '张三';
}

newAdd = new Add(7,8);
newSub = new Sub();

// Sub只继承了Add的add方法并执行相关方法

call方法：
newAdd.add.call(newSub, 10, 4);      // 14

apply方法：
newAdd.add.apply(newSub, [10, 4]);   // 14

bind方法：
newAdd.add.bind(newSub, 10, 4)();   // 14

```

> > **注意**
> >
> > > 若想要全部继承父级所有相关属性 得采用==原型链继承==的方式

```
function person(){
    this.hair = 'black';
    this.eye = 'black';
    this.skin = 'yellow';
    this.view = function(){
        return this.hair + ',' + this.eye + ',' + this.skin;
    }
}
function man(){
    this.feature = ['beard','strong'];
}
man.prototype = new person();

```

---

# cookie sessionStorage localStorage

    1. cookie
        * 4k的限制；
        * 服务端和客户端传递时都会带上cookie；
        * 本质上是对字符串的读取 存储内容过多消耗内存空间 导致页面变卡顿；
        * 不能被爬虫读取；
        * 设置时间之前一直有效，到时间就清除；
    2. sessionStorage
        * 临时存储：引入“浏览器窗口”的概念，同源同窗口数据不会销毁，不同标签页中数据不能共享，关闭浏览器时候销毁；
        * 减少网络流量，即减少数据在服务端和客户端之间的传递；
        * 性能更好，即本地读取数据比服务器获取快多了；
        * 不能跨tab标签页传值；
    3. localStorage
        * 减少网络流量，即减少数据在服务端和客户端之间的传递；
        * 体积更大 5M；
        * 持久存储在本地，直到手动清除；

```
localStorage.setItem('sss',1111);
localStorage.getItem('sss');
localStorage.removeItem('sss');
localStorage.clear();
```

---

# 闭包

    简单回答闭包就是 一个函数返回自身内部函数的调用

    为什么使用？

    因为js是链式的 一层一层向上级查找 所以外部函数无法访问内部函数;

> > 优点
> > 缺点
>
> - 不会被内存回收 容易出现性能问题

```
function foo(){
    var a = 2;

    function bar(){
        console.log(a);
    }

    return bar;
}
var newFoo = foo();
newFoo();               // a

```

---

# 深拷贝和浅拷贝

- **浅拷贝**
  > **复制对象的副本 指向同一内存区域 对副本的操作会影响父级对象**

浅拷贝方式：

1. 直接赋值；
2. Object.assign();
3. JSON 序列化；

- **深拷贝**
  > **复制对象的副本 指向不同的内存区域 与父级对象独立**

```
// 浅拷贝
var a = {
    name : 'zhangsan'
}

var b = a;
b.name = 'lisi';

console.log(a.name);    // "lisi"
console.log(b.name);    // "lisi"

// 深拷贝  (更完整的深拷贝还需要再详细优化)
function deepCopy(p, c){
    var c = c || {};
    for(var i in p ){
        // 数组和对象的时候再处理
        if(typeof p[i] === 'object'){
            c[i] = (p[i].constructor === Array) ? [] : {};
            deepCopy(p[i], c[i]);
        }else{
            // 基本类型直接赋值
            c[i] = p[i]
        }
    }
    return c;
}

var parent = {
    number: [1, 2, 3],
    obj: {
        prop: 1
    }
}

var copyParent = deepCopy(parent);
copyParent.number.push(4)
copyParent.number                   // 1,2,3,4
parent.number                       // 1,2,3
```

---

# 传值类型和引用类型

- **传值类型（基本类型）**
  > 值为基本类型时候为深拷贝
  >
  > > 基本类型就是 null，undefined，Boolean，string，number
  > >
  > > > ==独立不干扰==
- **引用类型**
  > 值为对象类型时候为浅拷贝
  >
  > > 值都是对对象的引用，即一个指向对象的指针
  > >
  > > > ==对副本的操作会影响父级对象==

```
// 传值类型
var  a = 1;
function voo(data)
{
    data = 2;
    console.log(data);   // 2
}
voo(a);
console.log(a);    // 1

// 引用类型
var  a = {
    name : "张三"
};
function voo(data)
{
    data.name = "李四";
    console.log(data);   //  Object {name: "李四"}
}
voo(a);
console.log(a);         //  Object {name: "李四"}

// 引用类型不会被基本类型覆盖
var  a = {
    name : "张三"
};
function voo(data)
{
    data = 3；
    console.log(data);   // 3
}
voo(a);
console.log(a);         //  Object {name: "张三"}

// 为了解决引用类型的问题  引入深拷贝的概念  参考上面一个概念

```

---

# 函数作用域提升与预编译

> 由于 js 没有其他强类型语言{}这类的块级作用域 只有函数作用域 函数的声明很随意导致各种问题出现


---

# AMD 和 CMD 区别

1. AMD 推崇依赖前置。 （requireJS）

   CMD 推崇依赖就近， （seaJS）

```
// CMD
define(function(require, exports, module) {
    var a = require('./a')
    a.doSomething()         // 此处略去 100 行
    var b = require('./b')  // 依赖可以就近书写
    b.doSomething()         // ...

})
// AMD 默认推荐
define(['./a', './b'], function(a, b) {
    // 依赖必须一开始就写好
    a.doSomething()    // 此处略去 100 行
    b.doSomething()
})
```

2. 对于依赖的模块，

   AMD 是提前执行（预执行），

   CMD 是延迟执行（懒执行）。

> 不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇 as lazy as possible.

3. AMD 的 API 默认是一个当多个用，

   CMD 的 API 严格区分，推崇职责单一

> 比如 AMD 里，require 分全局 require 和局部 require，都叫 require。CMD 里，没有全局 require，而是根据模块系统的完备性，提供 seajs.use 来实现模块系统的加载启动。CMD 里，每个 API 都简单纯粹。

---

# 事件冒泡和事件捕获

    * 事件冒泡兼容写法

    ```
    if (event.cancelBubble) {
        event.cancelBubble = true
    } else {
        event.stopPropagation()
    }
    ```
    --------------------------

# 数组

    1. push

        向数组末尾添加指定元素

    2. pop

        移除数组末尾的一个元素 并返回移除的元素

    3. shift

        移除数组第一项 并返回该元素

    4. unshift

        给数组第一项加上一个元素 返回数组长度

    5. join

        数组按照指定的字符换转成字符串

    6. sort

        数组按照ASCII排序  所以要完全按照从小到大的顺序排序的话需要指定参数 1 -1 0

    7. splice

        从0开始

    > 删除 ---------------------（**起始位置，截取个数**）

    > 插入 ---------------------（**起始位置，截取个数为0，要插入的项**）

    > 替换----------------------（**起始位置，截取个数为1，要插入的项**）

    8. slice

    9. concat

    10. reverse

    11. 遍历数组的方法

        > forEach
        > for in

        两者区别 在于 for in 会遍历数组原型链的属性值

        为了避免这样的情况 使用 hasOwnProperty 解决

---

# 22.正则

- ()：小括号，叫做分组符。
- \s : 空格
- \S : 非空格
- \d : 数字
- \D : 非数字
- \w : 字符 ( 字母 ，数字，下划线\_ )
- \W : 非字符
- .（点）——任意字符
- \. : 真正的点
- \b : 独立的部分 （ 起始，结束，空格 ）
- \B : 非独立的部分
- {n,m}：至少出现 n 次，最多 m 次
- {n,} :至少 n 次
  - - :任意次 相当于{0,}
- ？ ：零次或一次 相当于{0,1}
  - - ：一次或任意次相当于 {1,}
- {n}： 正好 n 次
- [] ： 表示某个集合中的任意一个 不能为空

---

> ## 字符串相关的正则方法

- ## match()

> 返回一个包含匹配内容的数组

```
var str = 'abcdef';

var re = /B/i;

str.match(re) // [b]
```

例子 2：

```
url = https://dimg.fws.qa.nt.ctripcorp.com/images/2d090m000000062hy59E5.jpg"
url.match(/[^\/]*$/) // 2d090m000000062hy59E5.jpg
url.match(/^[^\/]*/) // https
```

- ## search()

> 返回匹配到的第一个内容所在的位置

```
var str = 'abcdef';

var re = /B/i;

str.search(re) // 1

```

- ## replace()

> 查找符合正则的字符串并替换成==一个==对应的字符串。返回替换后的内容。

```
var str = "我爱北京天安门，天安门上太阳升。";
var re = /北京|天安门/g;  //  找到北京 或者天安门 全局匹配
var str2 = str.replace(re,'*'); // 我爱**，*上太阳升。

```

并不能解决一个文字\*的对应

```
var str = "我爱北京天安门，天安门上太阳升。";
var re = /北京|天安门/g;  //  找到北京 或者天安门 全局匹配
var str2 = str.replace(re,function(str){
            alert(str);
            //用来测试：参数代表每次搜索到的符合正则的字符，
            //所以第一次str指的是北京 第二次str是天安门 第三次str是天安门
            var result = '';
            for(var i=0;i<str.length;i++){
                result += '*';
            }
            return result; //所以搜索到了几个字就返回几个*
        });
alert(str2)
```

    ```
    var str = '2013-6-7';
    var re = /(\d+)(-)/g;

    str = str.replace(re,function($0,$1,$2){
            // replace()中如果有子项，
            // 第一个参数 ：$0（匹配成功后的整体结果  2013-  6-）,
            // 第二个参数 : $1(匹配成功的第一个分组，这里指的是\d   2013, 6)
            // 第三个参数 : $2(匹配成功的第二个分组，这里指的是-    - - )
        return $1 + '.';  //分别返回2013.   6.
    });

    alert( str );   //2013.6.7
    //整个过程就是利用子项把2013- 6- 分别替换成了2013. 6.  最终弹出2013.6.7
    ```

---

## 正则两个方法

- ## test()

> 匹配到指定内容返回 true

- ## ==exec()==

> 返回第一匹配项信息的数组 若没有返回 null
> 有两个属性 index input

    ```
    var text = 'mom and dad and baby'
    var pattern = /mom( and dad( and baby)?)?/gi
    var matches = pattern.exec(text)
    mathes.index // 0
    mathes.input // mom and dad and baby
    mathes[0] // mom and dad and baby
    mathes[1] //  and dad and baby
    mathes[2] // and baby
    ```

# 后退监听

> history.back() history.forward() history.replace()触发 onpopstate 事件

    ```
    window.onpopstate = function () {
        alert('2222')
        history.pushState(null, null, document.URL)
        return false
    }
    history.pushState(null, null, document.URL)
    ```

    onbeforeunload事件有坑 chrome51版本及以后不能自定义文字 并且 页面载入之后一定要有浏览器行为才能触发


# 进制转换

> 十进制转十六进制

    ```
    var s = 255
    s.toString(16) // ff
    ```

> 十六进制转十进制

    ```
    parseInt('0xFF')   // 255
    ```

# label 绑定事件一定要让事件委托到触发里面的 input

    所以事件委托的时候直接监听input


# Math

    1. Math.floor 向下舍入；
    2. Math.ceil  向上舍入;
    3. Math.cos   余弦;
    4. Math.round 四舍五入;
    5. Math.sin   正弦；
    6. Math.tan   正切；

# isNaN

    首先需要知道 '' == 0   'abc' != 0   [] == 0  [1] != 0   null == 0  {} != 0  undefined != 0

    ```
    isNaN('')   // false
    isNaN(' ')  // false
    isNaN('abc') // true
    isNaN(undefined) // true
    isNaN([])   // false
    isNaN({})   // true
    isNaN(null) // false

    ```

# Boolen

    首先需要知道  0 == false    1 == true  '' == false   undefined != false != true    null != false != true

    ```
    Boolean('') // false
    Boolean('ssss') // true
    Boolean([])  // true
    Boolean([1,2])  // true
    Boolen({})      // true
    Boolen(null)    // false
    Boolen(undefined)   // false
    ```

# 解决回调地狱 （多级回调）

    1. Promise

    2. aSync/await

    3. generator

# 字符串

    1. slice

        在 不修改目标数组 的情况下返回截取的指定元素（ **起始位置，截止位置**）

        从0开始 ==不包含最后一个数值==

        负数情况下 将负数加上自身长度得到的数值作为参数

    2. substr

        subdtr接收的是 起始位置 和 所要返回的字符串长度

        在负数情况下  将第一个参数与字符串长度相加后的数值作为第一个参数

    3. substring

        默认会将较小的参数作为第一个参数

        在 不修改目标数组 的情况下返回截取的指定元素 （ **起始位置，截止位置**）

        负数当做0处理

```
let test = 'abcdef'
test.slice(0, -1)   // abcde
test.slice(2, -3)   => test.slice(2,3)  // c

test.substring(1, -2) => a
test.substring(2, -3) => ab
```

    4. split

        字符串按照指定规则转换成数组

# let 与 var 区别

1. var存在变量提升， let不存在；
2. let不允许重复声明；
3. var挂载在window下，let挂载在块作用域下；

# 为什么 var 可以重复声明

V8引擎 负责整个代码编译和运行

编译器 负责词法分析、语法分析、代码生成等工作

编译器从左至右编译var a，如果a不存在则在作用域声明一个新的变量a，若存在a则忽略继续向下编译；

引擎遇到a = 2，按照作用域链向上查找 若存在变量a直接赋值，不存在则在作用域重新声明新的变量并赋值2

# CommonJS 中的 require/exports 和 ES6 的 import/export 有什么区别

1.

> CommomJS 模块 require 代码时候会立刻执行；
> ES6 模块是动态引用，不会立刻执行，仅仅作为一个加载模块的对象引用；

2.

> CommonJs 模块输出的是一个值的拷贝， 输出后的对象会被缓存（即 如果发现一个模块被多次引用，会直接返回已经执行的部分）；

```
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

```
// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3

```

> ES6 模块输出的是值的只读引用；

- 接口输出的变量是只读的，重新赋值会报错；
- export 通过接口输出的是同一个值，得到的都是同样的实例；


参考资料：

1. [ES6 模块与 CommonJS 模块的差异](http://es6.ruanyifeng.com/#docs/module-loader)


# 处理 js 双精度问题

    ```javascript
        0.1 + 0.2 = 0.30000000000000004
    ```

由于计算机是做二进制运算

0.1 => 0.0001 1001 1001 1001…（无限循环）

0.2 => 0.0011 0011 0011 0011…（无限循环）

双精度浮点数的小数部分最多支持 52 位

处理方法：

    1. 优先考虑服务端计算；
    2. 利用精度溢出结尾要么99999要么1111，可以利用Math.round()四舍五入；
    3. 外部第三方库处理


# postMessage

1. window.postMessage() 可以安全进行跨域、跨页面通信；
1. 页面加载完成后才能进行跨域通信；

发起端可以是 open 一个新窗口 或者 创建一个 iframe 往新窗口里发送数据

案例:

    ```javascript

<!-- 客户端两种方式 -->

<!-- 当前页面地址 http://www.webhek.com -->
<!-- open方式 -->

//弹出一个新窗口
var domain = 'http://fanyi.youdao.com';
var myPopup = window.open(domain, 'myWindow');

//周期性的发送消息
setInterval(function(){
var message = 'Hello! The time is: ' + (new Date().getTime());
console.log('blog.local: sending message: ' + message);
//send the message and target URI
myPopup.postMessage(message,domain);
},6000);

<!-- iframe方式 -->

//捕获 iframe
var domain = "http://fanyi.youdao.com";
var iframe = document.getElementById('myIFrame').contentWindow;

//发送消息
setInterval(function(){
var message = 'Hello! The time is: ' + (new Date().getTime());
console.log('blog.local: sending message: ' + message);
//send the message and target URI
iframe.postMessage(message,domain);
},6000);

<!-- 接收端 -->

//监听消息反馈
window.addEventListener('message',function(event) {
if(event.origin !== 'http://www.webhek.com') return;
console.log('received response: ',event.data);
},false);

    ```

> 截图如下：

![web骇客网站  接收端截图](https://wx4.sinaimg.cn/mw690/006ANKB8gy1fqhqrhftfmj30yu0objvr.jpg)
![有道翻译网站 接收端截图](https://wx2.sinaimg.cn/mw690/006ANKB8gy1fqhqri8fjlj30zk0h4tbk.jpg)

> 参考资料

1. [用 HTML5 里的 window.postMessage 在两个网页间传递数据](http://www.webhek.com/post/window-postmessage-api.html)

# Service Worker

> 背景

为了解决 web 业务不断增加带来更多消耗资源、耗时等复杂运算带来性能问题，w3c 初期提出 Web Worker 的 API，目的为了解放主线程。原理是 将复杂 耗时的操作独立出来交给 Web Worker，完成后通过 postMessage 方法告诉主线程。

缺点：临时存在，不能永久；为此提出 Service Worker，在 Web Worker 基础上增加持久缓存能力。

在 Service Worker 之前有 APPCache 这个持久缓存的 API，不过存在更新机主不完善，二次更新，大小限制，回滚等问题，具体参考下方链接 1。

Service Worker 的特性如下：

- 一个独立的 worker 线程，独立于当前网页进程，有自己独立的 worker context。

- 一旦被 install，就永远存在，除非被 uninstall

- 需要的时候可以直接唤醒，不需要的时候自动睡眠（有效利用资源，此处有坑）

- 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）

- 离线内容开发者可控

- 能向客户端推送消息

- 不能直接操作 DOM

- 出于安全的考虑，必须在 HTTPS 环境下才能工作

- 异步实现，内部大都是通过 Promise 实现

- 只能运行在 HTTPS 协议下

> 参考资料

1. [为什么 app cache 没有得到大规模应用？它有哪些硬伤吗？](https://www.zhihu.com/question/29876535)
2. [Service Worker 简介](https://lavas.baidu.com/doc/offline-and-cache-loading/service-worker/service-worker-introduction)
3. [如何优雅的为 PWA 注册 Service Worker](https://zhuanlan.zhihu.com/p/28161855)

# 加载更多/下拉刷新

原理：

scrollTop（滚动条滚动距离） + clientHeight（可见区域高度） == scrollHeight（元素实际高度）

备注：

offsetHeighgt = height + padding + border

clientHeight = height + padding

# js 标签中`async`和`defer`的作用与区别

没有 defer 或 async，浏览器会立即加载并执行指定的脚本，也就是说不等待后续载入的文档元素，读到就加载并执行。
并行加载，

- async

无顺序的加载，可能在`DOMContentLoaded`触发之前或之后执行。

- defer

会等待 document 解析完成，按照 defer 顺序执行对应脚本，全部执行完毕后会触发`DOMContentLoaded`事件


# JsBridge

## 实现js调用Native的方式，有三个方法：
- 注入api
- 劫持URL Scheme
- 弹窗拦截


【注入api】 通过webview提供的接口，向js的上下文（window）注入对象或方法，js直接调用相关方法
【劫持URL Scheme】通常是web端唤醒App（或跳到App某一个页面）。Native劫持Web的请求自定义处理。
【弹窗拦截】类似劫持URL Scheme原理，劫持弹窗、二次确认等方法。

## Native调用js的方法

Native调用js的方式本质就是 执行拼接的js字符串







