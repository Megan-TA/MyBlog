---
title: 记录typescript使用的几个注意点
catalog: true
date: 2019-07-22 13:38:34
subtitle:
header-img:
tags: typescript
categories: 前端
---

近期在做前端团队公共模块和方法的私有 npm 包的时候，采用`typescript`保证包的代码质量，在使用`ts`的过程遇到一些小问题，特此记录下遇到的一些小问题。

1. 不想一个个导入类型文件，希望有全局引用类型文件

一开始在给每个文件定义类型的时候，都会将文件类型放在`types`文件夹下，通过`es6`模块暴露出来并在项目中引入对应的类型文件，开始引用方式如下：

```javascript
// types/test.d.ts
export declare const test = '123'

// src/test.ts
import { test } from '../types/test'

```

这样的话默认也是把`.d.ts`文件当做一个模块，但是每次都引入的时候会比较麻烦，有没有更简便的方法，不需要引入类型文件？

答案是有的：利用全局的`namespace`和`tsconfig.json`配置

以下是`tsconfig.json`一些配置项：

```javascript
{
    "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "outDir": "./dist/lib",
      "declaration": true,  // 开启打包之后会输出.d.ts文件
      "declarationDir": "./dist/types",  // 默认.d.ts会输出到文件所在目录下，也可以指定.d.ts存放路径
      "strict": true,
      "jsx": "preserve",
      "importHelpers": true,
      "removeComments": true,
      "moduleResolution": "node",
      "experimentalDecorators": true,
      "allowJs": false,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "sourceMap": false,
      "baseUrl": ".",
      "types": [
        "node",
        "./types"  // 本地types所在目录，必须在此引入
      ],
      "lib": [
        "esnext",
        "dom",
        "dom.iterable",
        "scripthost"
      ]
    },
    "include": [
      "src/**/*.ts",
      "src/**/**/*.ts"
    ],
    "exclude": [
      "node_modules"
    ]
}

```

注意上面的 types 配置需要将自己定义的`types`文件导入进来，这样一个未知类型会在这个指定范围去查找。

项目代码使用：

```javascript
//types/test.d.ts
declare namespace Test {
    interface Detail {
        name: string
    }
}

// src/test.ts
function getTestDetail (detail: Test.Detail){}

```

这样就不需要项目代码去引用类型文件，缺点是暴露全局的`namespace`，需要自己根据情况作出取舍。

2. 定义自定义对象的属性枚举值

定义一个配置对象，除了`key`之外其他属性一样，利用枚举特性定义`key`

```javascript
declare enum ENV {
  dev = 'dev',
  prod = 'prod'
}

export interface ConfigResult {
  region: string
  accessKeyId: string
  accessKeySecret: string
  expAfter: number
  bucket: string
  maxSize: number
  startsWith: string
  ossHost: string
  host: string
}

export interface Config {
  [key: string]: {
    [key in ENV]: ConfigResult
  }
}

```

3. 类型文件里面不能导出/定义`枚举值`，枚举值需要单独定义在代码层面，不然会报

```shell
Error: Debug Failure. False expression: Output generation failed
```

4. 开发第三方库的时候遇到，开发完之后库打包之后，在项目中导入相关方法并没有相关方法的提示，别人是怎么定义包内部方法的提示呢？在 github 上查阅了几个库，在`https://github.com/alibaba/pont`这个项目下发现别人`typing`指向的路径指向本身项目暴露出来的 ts 入口文件，这样就达到使用 ts 的时候有对应的方法提示。

```json
"main": "lib/index.js",   // 这个是编译后的库入口文件，一般是js
"typings": "src/index.ts", // 这个是给ts用的本身项目开发的出口文件
```

5. 使用`paths`做路径映射时候，一定要当前项目配置文件指定`baseUrl`为当前目录，遇到继承外部项目公共基础配置，公共基础配置设置`baseUrl`之后，`paths`路径映射是以外部项目为基准；

6. `paths`做了映射之后，利用提供的`tsc`编译后的代码并没有做响应的路径转换，比如`$src/index.ts`，最后编译出来的代码依然是原样，后来是采用`rollup.js`做了打包处理这个问题。
