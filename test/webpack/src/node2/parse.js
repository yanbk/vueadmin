const recast = require("recast");

const code =
  `
  function add(a, b) {
    return a +
      // 有什么奇怪的东西混进来了
      b
  }
  `
// 用螺丝刀解析机器
const ast = recast.parse(code);

// ast可以处理很巨大的代码文件
// 但我们现在只需要代码块的第一个body，即add函数
const add  = ast.program.body[0]

console.log(add)


// 引入变量声明，变量符号，函数声明三种“模具”
const {variableDeclaration, variableDeclarator, functionExpression} = recast.types.builders

// 将准备好的组件置入模具，并组装回原来的ast对象。
ast.program.body[0] = variableDeclaration("const", [
  variableDeclarator(add.id, functionExpression(
    null, // Anonymize the function expression.
    add.params,
    add.body
  ))
]);

//将AST对象重新转回可以阅读的代码
const output = recast.print(ast).code;

console.log(111, output)