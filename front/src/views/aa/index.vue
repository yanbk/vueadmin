<template>
<el-dialog
    title="提示"
    v-model="dialog"
    width="30%"
>
    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="" prop="aa">
            <el-input v-model="form.aa" autocomplete="off"></el-input>
        </el-form-item>
    </el-form>
</el-dialog>
</template>
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
</style>