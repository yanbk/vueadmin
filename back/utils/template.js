const vueTemplate = (data) => {
    let str = `<template>\n<el-dialog
    title="提示"
    v-model="dialog"
    width="30%"
>
    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">\n`;
    for (let i = 0; i < data.length; i++) {
        if (data[i].type === 'string') {
            str += `        <el-form-item label="${data[i].c_name}" prop="${data[i].name}">
            <el-input v-model="form.${data[i].name}" autocomplete="off"></el-input>
        </el-form-item>\n`
        }
        if (data[i].type === 'number') {
            str += `        <el-form-item label="${data[i].c_name}" prop="${data[i].name}">
            <el-input v-model.number="form.${data[i].name}" autocomplete="off"></el-input>
        </el-form-item>\n`
        }
    }

    str += `    </el-form>
</el-dialog>\n</template>
<script>
export default {
    name: '',
    data() {
        return {
            form: {

            }
        }
    }
}
</script>
<style>
</style>`

    return str
}



module.exports = {
    vueTemplate,
    entryTemplate: compoenntName => {
        return `import ${compoenntName} from './index.vue'
export default [{
    path: "/${compoenntName}",
    name: "${compoenntName}",
    component: ${compoenntName}
}]`
    }
}