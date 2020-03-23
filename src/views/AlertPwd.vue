<template>
    <div>
        <div v-if="userInfo">
            <div class="bgBox">
                <div class="loginBox">
                    <el-form :inline="true" :model="alertPwdFormData" ref="alertPwdForm" id="alertPwdForm" :rules="rules">
                    <table class="loginTabe">
                        <tr>
                            <td colspan="2">修改密码</td>
                        </tr>
                        <tr>
                            <td>
                                 <label for="inputPwd">原密码</label>
                            </td>
                            <td>
                                <el-form-item prop="inputPwd">
                                    <el-input id="inputPwd" v-model="alertPwdFormData.inputPwd" placeholder="请输入原密码"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="inputNewPwd">新密码</label>
                            </td>
                            <td>
                                <el-form-item prop="inputNewPwd">
                                    <el-input id="inputNewPwd" v-model="alertPwdFormData.inputNewPwd" placeholder="请输入新密码"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="inputComPwd">再次输入新密码</label>
                            </td>
                            <td>
                                <el-form-item prop="inputComPwd">
                                    <el-input id="inputComPwd" prop="" v-model="alertPwdFormData.inputComPwd" placeholder="请再次输入新密码"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                    <el-button type="primary" @click="alertPwd('alertPwdForm')">修改密码</el-button>
                            </td>
                        </tr>
                    </table>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "bookCase",
        data() {
            const validatePwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入原密码'));
                }
                // if (value.length<6 || value.length>20) {
                //     callback(new Error('请输入6-20位原密码'));
                // }
                if(this.userInfo.password != value){
                    callback(new Error('输入的原密码不正确'));
                }
                callback();
            };
            const validateNewPwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                }
                if (value.length<6 || value.length>20) {
                    callback(new Error('请输入6-20位新密码'));
                } else {
                    //6-20位包含字符、数字和特殊字符
                    var ls = 0;
                    if (value !== '') {
                        if(value.match(/([a-z])+/)){
                            ls++;
                        }
                        if(value.match(/([0-9])+/)){
                            ls++;
                        }
                        if(value.match(/([A-Z])+/)){
                            ls++;
                        }
                        if(value.match(/[~'!@#$%^&*()-+_=:]+/)){
                            ls++;
                        }
                        if(value.match(/([\u4E00-\u9FA5])+/)){
                            callback(new Error('不能包含中文字符'));
                            ls=0;
                        }
                    }
                    if(ls<3){
                        callback(new Error('数字、小写字母、大写字母以及英文状态输入的特殊字符中四选三'))
                        ls=0;
                    }
                    callback();
                }
            };
            const validateComPwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                }
                if (value.length<6 || value.length>20) {
                    callback(new Error('请再次输入6-20位新密码'));
                }
                if(value != this.alertPwdFormData.inputNewPwd){
                    callback(new Error('两次输入的新密码不一致'));
                }
                callback();
            };
            return {
                userInfo:JSON.parse(sessionStorage.getItem("userInfo")),
                alertPwdFormData:{
                    inputPwd:'',
                    inputNewPwd:'',
                    inputComPwd:'',
                },
                rules: {
                    inputPwd: [
                        {required: true,validator: validatePwd, trigger: ['blur', 'change']}
                    ],
                    inputNewPwd: [
                        {required: true,validator: validateNewPwd, trigger: ['blur', 'change']}
                    ],
                    inputComPwd: [
                        {required: true,validator: validateComPwd, trigger: ['blur', 'change']}
                    ],
                },
            }
        },
        mounted() {
            this.getUserInfo();
            if(this.userInfo == null){
                this.$router.push({path: '/error'})
            }
        },
        methods:{
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            alertPwd(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let formData = new FormData();//创建formData对象
                        for(let key in this.alertPwdFormData){
                            formData.append(key,this.alertPwdFormData[key]);
                        }
                        this.$axios({
                            method:"put",
                            url:"http://127.0.0.1:8081/users/alertPwd",
                            headers: {
                                "Content-Type": "multipart/form-data"
                            },
                            withCredentials:true,
                            data:formData
                        }).then((response)=>{
                            this.$message({
                                message: response.data.msg,
                                type: 'success'
                            });
                            this.logout();

                        });
                        this.resetForm(formName);
                    } else {
                        console.log('提交出现错误!');
                        return false;
                    }
                });
            },
            getUserInfo(){
                this.$axios.get("http://127.0.0.1:8081/users/getUserInfo").then((response)=>{
                    sessionStorage.setItem("userInfo",JSON.stringify(response.data.info.users));
                    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
                },(error) => {
                    // 对响应错误做点什么
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            },
            logout(){
                this.$axios.get("http://127.0.0.1:8081/users/logout").then((response)=>{
                    if(response.data.code == 200) {
                        this.$message({
                            showClose: true,
                            message: "登出成功",
                            type: 'success',
                            duration: 2000
                        });
                        sessionStorage.clear();
                        this.$router.push({path: '/'})
                        history.go(0)
                    }else{
                        this.$message({
                            showClose: true,
                            message: "登出失败",
                            type: 'error',
                            duration: 2000
                        });
                        this.$router.push({path: '/'})
                        history.go(0)
                    }
                });
            },
        }
    }
</script>

<style scoped>
.bgBox{
    width: 1000px;
    /*height: 500px;*/
    margin: auto;
}
.loginBox{
    width: 500px;
    /*height: 500px;*/
    margin: auto;
}
.loginTabe{
    margin: auto;
    text-align: center;
    border: 1px lightskyblue solid;
}
    .loginTabe tr{
        height: 45px;
    }
.loginTabe tr td{
    border: 1px lightskyblue dashed;
}

</style>
