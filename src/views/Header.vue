<template>
    <div>
        <el-container>
            <el-header style="height: 40px">
                <el-row>
                    <el-col :span="4" >
                        <div>
                                <a href="/" >
                                    <!--<i class="el-icon-paperclip"></i><b>保存小说网快捷方式</b>-->
                                    <img src="\static\images\logo.png">
                                </a>
                        </div>
                    </el-col>
                    <el-col :span="16" v-if="!userInfo">
                        <div class="bg-purple-light" type="flex">
                                <div class="middle_header">
                                    <div class="inputDiv">
                                         <span class="txt"><i class="el-icon-user"></i>账号：</span>
                                         <el-input v-model="inputAcount" placeholder="请输入内容"></el-input>
                                    </div>
                                    <div class="inputDiv">
                                        <span class="txt"><i class="el-icon-lock"></i> 密码：</span>
                                        <el-input placeholder="请输入密码" v-model="inputPassword" show-password></el-input>
                                    </div>
                                    <div class="inputDiv" style="width:100px;margin: 0px 20px" >
                                    <el-select v-model="roleValue">
                                        <el-option
                                                v-for="item in role"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                    </div>
                                    <div class="inputDiv">
                                        <img title="点击更换验证码" id="imgVerify" ref="imgVerify" src="http://127.0.0.1:8081/users/loginValidateCode" alt="更换验证码" height="40" width="90" @click="getVerify()">
                                        <el-input placeholder="请输入验证码" v-model="verificationCode"></el-input>
                                    </div>
                                    <div class="inputDiv" style="width:60px;margin: 0px 20px">
                                        <el-button type="primary" round @click="login">登录</el-button>
                                    </div>
                                </div>
                        </div>
                    </el-col>
                    <el-col :span="4" v-if="!userInfo">
                        <div class="grid-content bg-purple" type="flex">
                            <span class="pointer">忘记密码</span>
                            <span v-on:click="register" class="pointer">注册</span>
                        </div>
                    </el-col>
                    <el-col :span="20" v-if="userInfo">
                        <div class="grid-content bg-purple" type="flex">
                            <div class="userInfo">
                                你好，{{this.userInfo.userName}}，
                                当前权限为：
                                <span v-if="this.userInfo.role == 0">普通用户</span>
                                <span v-if="this.userInfo.role == 1">管理员</span>
                                <span class="pointer">
                                    <router-link :to="{path: '/bookCase'}">我的书架</router-link>
                                </span>
                                <span class="pointer">
                                    <router-link :to="{path: '/alertPwd'}">修改密码</router-link>
                                </span>
                                <a href="#" @click="logout">退出登录</a>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
        </el-container>
    </div>
</template>
<script>
    import Qs from 'qs';
    export default {
        name: 'Header',
        props:['dialogFormVisible'],
        inject:['reload'],
        data(){
            return{
                userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
                bookList:[],
                inputAcount: "",
                inputPassword:"",
                verificationCode:"",
                role: [{
                    value: '0',
                    label: '普通用户'
                }, {
                    value: '1',
                    label: '管理员权限'
                }],
                roleValue: '0',
            }
        },
        components: {},
        mounted(){
            this.getUserInfo();
        },
        methods:{
            getUserInfo(){
                this.$axios.get("http://127.0.0.1:8081/users/getUserInfo").then((response)=>{
                    sessionStorage.setItem("userInfo",JSON.stringify(response.data.info.users));
                    this.userInfo = response.data.info.users;
                },(error) => {
                    // 对响应错误做点什么
                    this.userInfo = null
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            },
            register(){
                this.$emit("registerBoxStatus",!this.dialogFormVisible)
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
                        this.reload();
                        history.go(0);
                    }else{
                        this.$message({
                            showClose: true,
                            message: "登出失败",
                            type: 'error',
                            duration: 2000
                        });
                        this.reload();
                        history.go(0);
                    }
                });
            },
            getVerify() {
                this.$refs.imgVerify.src = 'http://127.0.0.1:8081/users/loginValidateCode?random='+Math.random();
            },
            login(){
                var data = Qs.stringify({"role":this.roleValue,
                    "username":this.inputAcount,
                    "password":this.inputPassword,
                    "verificationCode":this.verificationCode,
                    "random":Math.random()});
                this.$axios.post("http://127.0.0.1:8081/users/login", data,
                    {headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    }).then((response)=>{
                    if(response.data.code == 200){
                        this.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'success',
                            duration: 2000
                        });
                        sessionStorage.setItem("userInfo",JSON.stringify(response.data.info.user));
                        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
                        history.go(0);
                    }else{
                        this.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'error',
                            duration: 2000
                        });
                        this.getVerify();
                    }
                });
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .pointer{
        margin: 0 5px;
        cursor: pointer;
    }
    .userInfo{
        float: right;
    }
    .el-row{
        box-sizing: border-box;
    }
    body > .el-container {
        /*margin-bottom: 40px;*/
    }
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 20px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .el-header a{
        text-decoration: none;
        margin: 20px;
        color: gray;
    }
    .headerColor {
        background-color:transparent;
        text-align: center;
     }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 20px;
        padding: 10px 0px;
        overflow: hidden;
    }

    .middle_header{
        float: left;
        /*margin: 0 20px;*/
        /*text-align: center;*/
        width: 1000px;
        height: 40px;
        overflow: hidden;
    }
    .middle_header .inputDiv{
        float: left;
        width: 250px;
    }
    .txt{
        color: grey;
        float: left;
        padding: 10px 0px;
        width: 100px;
    }
    .el-input{
        float: right;
        width: 120px;
    }
    .el-button{
        float: right;
        width: 70px;
    }

    .el-select{
        width:120px;
    }
</style>
