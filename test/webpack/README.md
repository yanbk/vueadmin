### 我们的目的是将这两个模块打包为一个能在浏览器端运行的文件，这个文件其实叫bundle.js。
```
// index.js
var add = require('add.js').default
console.log(add(1 , 2))

// add.js
exports.default = function(a,b) {return a + b}

```
* 假设在浏览器中直接执行这个程序肯定会有问题 最主要的问题是浏览器中没有exports对象与require方法所以一定会报错。

#### 1. 模拟exports对象
首先我们知道如果在nodejs打包的时候我们会使用fs.readfileSync()来读取js文件。这样的话js文件会是一个字符串。而如果需要将字符串中的代码运行会有两个方法分别是new Function与Eval。在这里面我们选用执行效率较高的eval。
```
exports = {}
eval('exports.default = function(a,b) {return a + b}') // node文件读取后的代码字符串
exports.default(1,3)
```
* 上面这段代码的运行结果可以将模块中的方法绑定在exports对象中。由于子模块中会声明变量，为了不污染全局我们使用一个自运行函数来封装一下。
```
var exports = {}
(function (exports, code) {
	eval(code)
})(exports, 'exports.default = function(a,b){return a + b}')
```
#### 2. 模拟require函数
```
function require(file) {
	var exports = {};
	(function (exports, code) {
		eval(code)
	})(exports, 'exports.default = function(a,b){return a + b}')
  return exports
}
var add = require('add.js').default
console.log(add(1 , 2))

```
* 完成了固定模块，我们下面只需要稍加改动，将所有模块的文件名和代码字符串整理为一张key-value表就可以根据传入的文件名加载不同的模块了。
```
(function (list) {
  function require(file) {
    var exports = {};
    (function (exports, code) {
      eval(code);
    })(exports, list[file]);
    return exports;
  }
  require("index.js");
})({
  "index.js": `
    var add = require('add.js').default
    console.log(add(1 , 2))
        `,
  "add.js": `exports.default = function(a,b){return a + b}`,
});

```
* 当然要说明的一点是真正webpack生成的bundle.js文件中还需要增加模块间的依赖关系。叫做依赖图（Dependency Graph）
例如：
```
{
  "./src/index.js": {
    "deps": { "./add.js": "./src/add.js" },
    "code": "....."
  },
  "./src/add.js": {
    "deps": {},
    "code": "......"
  }
}
```
* 总结一下思路，webpack打包可以分为以下三个步骤：
* 1、分析依赖
* 2、ES6转ES5
* 3、替换exports和require

### 功能实现
* 处理模块化
* 多模块合并打包 - 优化网络请求

```
//add.js

export default (a, b) => a + b

//index.js
import add from "./add.js";
console.log(add(1 , 2))
```

#### 1. 分析模块
模块的分析相当于对读取的文件代码字符串进行解析。这一步其实和高级语言的编译过程一致。需要将模块解析为抽象语法树AST。我们借助babel/parser来完成
* 1、读取文件
* 2、收集依赖
* 3、编译与AST解析
```
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

function getModuleInfo(file) {
  // 读取文件
  const body = fs.readFileSync(file, "utf-8");

  // 转化AST语法树
  const ast = parser.parse(body, {
    sourceType: "module", //表示我们要解析的是ES模块
  });

  // 依赖收集
  const deps = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const abspath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  });

  // ES6转成ES5
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  const moduleInfo = { file, deps, code };
  return moduleInfo;
}
const info = getModuleInfo("./src/index.js");
console.log("info:", info);

```
#### 2. 收集依赖
上一步开发的函数可以单独解析某一个模块，这一步我们需要开发一个函数从入口模块开始根据依赖关系进行递归解析。最后将依赖关系构成为依赖图（Dependency Graph）
```
function parseModules(file) {
  const entry = getModuleInfo(file);
  const temp = [entry];
  const depsGraph = {};

  getDeps(temp, entry);

  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });
  return depsGraph;
}

/**
 * 获取依赖
 * @param {*} temp 
 * @param {*} param1 
 */
function getDeps(temp, { deps }) {
  Object.keys(deps).forEach((key) => {
    const child = getModuleInfo(deps[key]);
    temp.push(child);
    getDeps(temp, child);
  });
}
```
#### 3. 生成bundle文件
这一步我们需要将刚才编写的执行函数和依赖图合成起来输出最后的打包文件。
```
function bundle(file) {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`;
}


!fs.existsSync("./dist") && fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", content);

```