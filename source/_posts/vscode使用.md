---
title: vscode使用
catalog: true
date: 2020-05-11 13:57:25
subtitle:
header-img:
tags: IDE
categories: 前端
---

## 常用设置配置

```json
{
  "workbench.iconTheme": "vscode-icons",
  "editor.fontSize": 14,
  "editor.accessibilityPageSize": 14,
  "editor.formatOnSave": true,
  "editor.tabSize": 4,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "window.zoomLevel": 1,
  "fileheader.Author": "knight",
  "fileheader.LastModifiedBy": "knight",
  "fileheader.tpl": "/*\r\n * @Author: {author} \r\n * @Title:  \r\n * @Date: {createTime} \r\n * @Last Modified by:   {lastModifiedBy} \r\n * @Last Modified time: {updateTime} \r\n */\r\n",
  "git.autofetch": true,
  "merge-conflict.diffViewPosition": "Beside",
  "[vue]": {
    "editor.defaultFormatter": "octref.vetur"
  },
  "eslint.alwaysShowStatus": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "vue",
      "autoFix": true
    }
  ],
  "eslint.format.enable": true,
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "force-aligned"
    }
  },
  "vetur.format.enable": true,
  "vetur.format.defaultFormatter.ts": "prettier",
  "vetur.format.options.tabSize": 4,
  "javascript.preferences.quoteStyle": "single",
  "typescript.preferences.quoteStyle": "single",
  "pretty-formatter.quoteConvert": "single",
  "vetur.format.defaultFormatter.js": "vscode-typescript",
  "path-intellisense.absolutePathToWorkspace": true,
  "path-intellisense.mappings": {
    "@": "${workspaceRoot}/src",
    "@public": "${workspaceRoot}/src/_public"
  }
}
```

## 常用包

1. Visual Studio IntelliCode 智能补全
2. prettier 快速格式化 CMD+Shift+P
3. Regex Previewer 正则表达式测试
4. stylelint
5. vetur # 开发 vue，语法补全、提示助手 （必备插件）
6. vscode-icons # vscode 图标显示
7. 小程序助手
8. vscode-element-helper
9. SVG Viewer # 预览 SVG
10. Path Intellisense 路径自动补全
11. minapp # 小程序开发语法补全、提示助手
12. markdownlint markdown 语法支持和预览
13. Live Server
14. koroFileHeader # 函数注释、文件信息
15. GitLens # git 辅助工具
16. javascript code snippets # js 代码提示、补全
17. Eslint # 代码风格提示
18. Element UI Snippets
19. EditorConfig for vs code
20. Document This
21. Debugger for Chrome
22. Color HighLight
23. CodeIf
24. Code Runner
25. Chinese Lanfguage Pack for vs code
26. Bracket Pair Colorizer 括号以多彩颜色区分
27. Beautify # 美化代码
28. Auto Rename Tag # 自动重命名标签
29. Auto Close Tag # 自动闭合标签
30. Better Comments
31. DotENV
32. Git Graph git可视化工具
33. Git History Diff
34. git-commit-lint-vscode commit加上emoji
35. Import Cost 显示导入模块大小
36. Open file From Path 直接跳转到指定代码
37. VS Color Picker 取色工具
38. vscode-fileheader
39. image preview 侧边栏图片预览

## 项目配置项

给vscode文件目录设置别名，并在引入时有对应提示，需要在根目录下新增`jsconfig.json`的文件，类似`tsconfig.json`

```json
{
    "compilerOptions": {
        "target": "ES6",
        "module": "commonjs",
        "allowSyntheticDefaultImports": true,
        "baseUrl": "./",
        "paths": {
            "@/*": ["src/*"],
            "@public/*": ["src/_public/*"],
        }
    },
    "exclude": [
        "node_modules"
    ]
}
```

## launch.json 调试配置说明

```json
{
  "name": "调试 Node.js 程序",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/src/index.js"
}
```

- type 指定调试的语言
- request 有两种类型，launch | attach，前者是 vscode 打开这个程序进入调试，后者是外部打开这个程序，然后接通 Node.js 的内部调试协议来调试
- program 程序启动入口
- console 配置终端是使用外部还是内部的集成终端

如果不用 program 启动，还有其他方式启动

- runtimeExecutable 使用什么命令启动，此处是 node，也可以任意启动脚本命令 pm2 等其他第三方的命令（可能要 \${workspaceFolder}相对路径）
- args 启动程序的参数

```json
{
  "name": "调试 Node.js 程序 - args",
  "type": "node",
  "request": "launch",
  "runtimeExecutable": "node",
  "args": ["${workspaceFolder}/src/index.js"]
}
```

如果有其他编译前的准备，比如调试 TS 程序，依赖 typescript 和 ts-node 等命令

```json
{
  "name": "调试 TS Node 程序 - args",
  "type": "node",
  "request": "launch",
  "runtimeExecutable": "node",
  "runtimeArgs": ["-r", "ts-node/register"],
  "args": ["${workspaceFolder}/src/index.ts"]
}
```

- runtimeArgs 这个参数是为 runtimeExecutable 环境提供的配置，args 是为程序提供的配置，翻译为：通过 node 启动/src/index.ts，在启动时为 node 注入 ts-noe/register 模块，以便可以执行 ts 类型的文件，实际执行代码如下

```shell
node --inspect-brk=DEBUG_PORT -r ts-node/register ./src/index.ts
```

当然上述启动调试还有其他方式

```json
{
  "name": "调试 TS Node 程序 - preTask",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/out/index.js",
  "preLaunchTask": "tsc_build"
}
```

- preLaunchTask 在 launch 调试之前先执行一个任务，这个就设计到.vscode/task.json 文件中配置的名为 tsc_build 的任务了

```json
{
  "label": "tsc_build",
  "type": "typescript",
  "tsconfig": "tsconfig.json"
}
```

如果需要调试已启动的 Node.js 程序，比如先在外部使用 node ./src/index.js 命令启动程序后，此时如果我们想给这个程序断点调试，可以加入如下配置

```json
{
  "name": "Attach to node",
  "type": "node",
  "request": "attach",
  "processId": "${command:PickProcess}"
}
```

推荐使用 \${command:PickProcess} 作为 processId 的值，因为 VSCode 会遍历所有的 Node PID 列出来让你选择，当然如果你写死 processId 也可以这会直接跳过选择步骤

vscode 也能直接调试网页的 js 代码，安装 Debugger for Chrome 插件

```json
{
  "name": "调试网页的 JS 文件",
  "request": "launch",
  "type": "chrome",
  "file": "${workspaceFolder}/index.html"
}
```

参考资料：

1. [VSCode launch.json 配置详解](https://juejin.im/post/6844904198702645262)
