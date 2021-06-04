const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

function getModuleInfo(file) {
    // 读取文件
    const body = fs.readFileSync(file, "utf-8");
    console.log('body:11111', body)

    // 转化AST语法树(抽象语法树)
    const ast = parser.parse(body, {
        sourceType: "module", //表示我们要解析的是ES模块
    });
    // console.log('ast:222222', ast)
    // 依赖收集
    const deps = {};
    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(file);
            const abspath = "./" + path.join(dirname, node.source.value);
            deps[node.source.value] = abspath;
        },
    });
    // console.log('ast:33333', ast)

    // ES6转成ES5
    const { code } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"],
    });

    console.log('ast:44444', code)
    const moduleInfo = { file, deps, code };
    console.log('ast:5555', moduleInfo)
    return moduleInfo;
}

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
    console.log(depsGraph)
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

const info = bundle("./src/index.js");
// console.log("info:", info);
!fs.existsSync("./dist") && fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", info);

console.log(exports)