const fs = require('fs')
const path = require('path')
const resolve = (...file) => path.resolve(__dirname, ...file)
const {
    vueTemplate,
    entryTemplate
} = require('../utils/template')

const previewTemplate = function(ctx) {
    // console.log(ctx.request.body)
    ctx.body = {
        code: 100,
        data: vueTemplate(ctx.request.body)
    }
}
const setTemplate = async function (ctx) {
    // console.log(ctx.request.body)
    const name = ctx.request.body.name
    // 组件名称
    const inputName = String(name).trim().toString()
    // Vue页面组件路径  **注意这里的路径，一定要写对，我这里是直接构建的vue-element-admin的项目，你们根据需要填写路径**
    const componentPath = resolve('../../front/src/views', inputName)
    // vue文件
    const vueFile = resolve(componentPath, 'index.vue')
    // 入口文件
    const entryFile = resolve(componentPath, 'index.js')
    // 判断组件文件夹是否存在
    const hasComponentExists = fs.existsSync(componentPath)
    if (hasComponentExists) {
        console.log(`${inputName}页面组件已存在，请重新输入`)
        ctx.body = {
            code: 100
        }
        return
    } else {
        console.log(`正在生成 component 目录 ${componentPath}`)
        await dotExistDirectoryCreate(componentPath)
    }
    try {
        // 获取组件名
        if (inputName.includes('/')) {
            const inputArr = inputName.split('/')
            componentName = inputArr[inputArr.length - 1]
        } else {
            componentName = inputName
        }
        console.log(`正在生成 vue 文件 ${vueFile}`)
        await generateFile(vueFile, vueTemplate(ctx.request.body.data))
        console.log(`正在生成 entry 文件 ${entryFile}`)
        await generateFile(entryFile, entryTemplate(componentName))
        console.log('生成成功')
    } catch (e) {
        console.log(e.message)
    }
    ctx.body = {
        code: 0
    }
}

// 生成文件
const generateFile = (path, data) => {
    if (fs.existsSync(path)) {
        console.log(`${path}文件已存在`)
        return
    }
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, 'utf8', err => {
            if (err) {
                console.log(err.message)
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
}

function dotExistDirectoryCreate(directory) {
    return new Promise((resolve) => {
        mkdirs(directory, function() {
            resolve(true)
        })
    })
}
// 递归创建目录
function mkdirs(directory, callback) {
    var exists = fs.existsSync(directory)
    if (exists) {
        callback()
    } else {
        mkdirs(path.dirname(directory), function() {
            fs.mkdirSync(directory)
            callback()
        })
    }
}

module.exports = {
    setTemplate,
    previewTemplate
}