<template>
    <div>
        <el-button type="primary" @click="add">新增</el-button>
        <el-table
            :data="tableData"
            style="width: 100%"
        >
            <el-table-column
                prop="name"
                label="名称"
            >
            </el-table-column>
            <el-table-column
                prop="c_name"
                label="名称(中文)"
            >
            </el-table-column>
        </el-table>
        <el-button type="primary" @click="previewTemplate">预览</el-button>
        <el-button type="primary" @click="foldDialog = true">生成</el-button>
        <el-dialog
            title="提示"
            v-model="dialog"
            width="30%"
        >
            <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称(中文)" prop="c_name">
                    <el-input v-model="form.c_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type">
                        <el-option label="string" value="string"></el-option>
                        <el-option label="number" value="number"></el-option>
                        <el-option label="select" value="select"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <div id="html"></div>
        <el-dialog
            title="提示"
            v-model="foldDialog"
            width="30%"
        >
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="文件名称" prop="name">
                    <el-input v-model="name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="setTemplateClick">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { setTemplate, previewTemplate } from '@/api/template'
import marked from "marked"
import hljs from "highlight.js";
import 'highlight.js/styles/atelier-plateau-light.css';
export default {
    name: '',
    data() {
    return {
        dialog: false,
        foldDialog: false,
        form: {
            name: '',
            c_name: '',
            type: ''
        },
        tableData: [

        ],
        rules: {
            name: [
                { required: true, message: '请输入' }
            ]
        },
        name: ''
    }
    },
    computed: {},
    mounted() {},
    methods: {
        add() {
            this.dialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.tableData.push(this.form)
                    this.dialog = false
                } else {
                    console.log('error submit!!')
                    return false;
                }
            })
        },
        previewTemplate() {
            previewTemplate(this.tableData).then(res => {
                console.log(res)
                res.data = '```\n' + res.data + '\n```'
                this.renderHtml(res.data)
            })
        },
        setTemplateClick() {
            setTemplate({ name: this.name, data: this.tableData }).then(res => {
                console.log(res)
            })
        },
        renderHtml(data) {
            marked.setOptions({
                renderer: new marked.Renderer(),
                highlight: function(code) {
                return hljs.highlightAuto(code).value;
                },
                pedantic: false,
                gfm: true,
                tables: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false
            })
            document.getElementById('html').innerHTML = marked(data)
        }
    }
}
</script>
<style>
</style>
