<template>
    <div>
        <div v-if="!userInfo">
            <div class="bgBox">
                <div class="loginBox">
                    <el-form :inline="true">
                    <table class="loginTabe">
                        <tr>
                            <td colspan="2">用户登录</td>
                        </tr>
                        <tr>
                            <td>
                                 <label for="userName">用户名</label>
                            </td>
                            <td>
                                <el-input id="userName" v-model="inputAcount" placeholder="请输入用户名"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="password">密码</label>
                            </td>
                            <td>
                                <el-input id="password" v-model="inputPassword" placeholder="请输入密码"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="password">权限</label>
                            </td>
                            <td>
                                <el-select v-model="roleValue">
                                    <el-option
                                            v-for="item in role"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>登录时长</label>
                            </td>
                            <td>
                                <el-select id="loginTime" v-model="loginType" placeholder="请选择登录时长">
                                    <el-option label="浏览器进程" value="1"></el-option>
                                    <el-option label="保存一天" value="2"></el-option>
                                    <el-option label="保存一个月" value="3"></el-option>
                                    <el-option label="保存一年" value="4"></el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="vcCode">验证码</label>
                            </td>
                            <td>
                                <el-input id="vcCode" v-model="verificationCode" placeholder="请输入验证码"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <img title="点击更换验证码" id="imgVerify" ref="imgVerify" src="http://127.0.0.1:8081/users/loginValidateCode" alt="更换验证码" height="40" width="90" @click="getVerify">
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                    <el-button type="primary" @click="login">登录</el-button>
                            </td>
                        </tr>
                    </table>
                    </el-form>
                </div>
            </div>
        </div>
        <div v-if="userInfo" >
            <div class="info">
                你好,{{this.userInfo.userName}}，当前有{{this.userInfo.bookCount}}个书签，剩余{{20-this.userInfo.bookCount}}个书签位置
            </div>
            <el-table
                    :data="bookCaseList"
                    @selection-change="handleSelectionChange"
                    border
                    fixed
                    class="el_table">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        type="index"
                        label="序号"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="author"
                        label="作者"
                        width="150">
                </el-table-column>
                <el-table-column
                        label="书本名称"
                        width="180">
                    <template slot-scope="scope">
                        <a :href="/book/+ scope.row.bookId ">{{scope.row.bookName}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        label="最新章节"
                        width="350">
                    <template slot-scope="scope">
                        <a :href="/book/+ scope.row.bookId +'/'+scope.row.lastUpdateChapterId"
                           >{{scope.row.lastUpdateChapterName}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="tagChapterName"
                        label="书签位置"
                        width="350">
                    <template slot-scope="scope">
                        <a  @click="goToTag(scope.row)"
                           >{{scope.row.tagChapterName}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        :formatter="dateFormat"
                        prop="tagLastUpdateTime"
                        label="书签更新时间"
                        width="120">
                </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot="header" >
                        <div v-if="this.multipleSelection.length != 0">
                            <el-button
                                    type="danger"
                                    size="mini"
                                    @click="handleDeleteChoose()">删除所选
                            </el-button>
                        </div>
                            <div v-if="this.multipleSelection.length == 0">
                                <el-button
                                        disabled
                                        type="danger"
                                        size="mini"
                                        @click="handleDeleteChoose()">删除所选
                                </el-button>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteOne(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
            </el-table>
            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%">
                <span>确定需要删除这条记录吗？</span>
                <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="deleteOne(scope.row)">确 定</el-button>
                            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import Qs from 'qs';
    export default {
        name: "bookCase",
        data() {
            return {
                multipleSelection: [],
                dialogVisible:false,
                userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
                loginType:'1',
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
                bookCaseList:[]
            }
        },
        mounted() {
            this.getUserInfo();
            if(this.userInfo != null){
                this.getbookCaseList();
            }
        },
        methods:{
            getUserInfo(){
                this.$axios.get("http://127.0.0.1:8081/users/getUserInfo").then((response)=>{
                    sessionStorage.setItem("userInfo",JSON.stringify(response.data.info.users));
                    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
                },(error) => {
                    // 对响应错误做点什么
                    this.userInfo = null
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            },
            handleDeleteChoose(){
                this.$confirm('此操作将永久删除这些书签数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.multipleSelection.forEach((item)=>{
                        this.$axios.delete("http://127.0.0.1:8081/bookCase/deleteOne/" + item.id).then(() => {
                        }, (error) => {
                            // 对响应错误做点什么
                            console.log(error)
                            this.$router.push({path: '/error'})
                        })
                    },(error) => {
                        // 对响应错误做点什么
                        console.log(error)
                        this.$router.push({path: '/error'})
                    });
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    history.go(0);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
                // this.$axios.delete("http://127.0.0.1:8081/bookCase/deleteChoose",this.multipleSelection).then(()=>{
                // },(error) => {
                //     // 对响应错误做点什么
                //     console.log(error)
                //     this.$router.push({path: '/error'})
                // });
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            goToTag(row){
              if(row.tagChapterId == 0){
                  this.$router.push({path: '/book/'+row.bookId});
              }else{
                  this.$router.push({path: '/book/'+row.bookId+'/'+row.tagChapterId});
              }
            },

            deleteOne(row) {
                this.$confirm('此操作将永久删除《'+row.bookName+'》书签数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("http://127.0.0.1:8081/bookCase/deleteOne/" + row.id).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        history.go(0);
                    }, (error) => {
                        // 对响应错误做点什么
                        console.log(error)
                        this.$router.push({path: '/error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            dateFormat(row, column){
                var date = row[column.property];
                if (date == undefined) {
                    return "";
                }
                return date.substr(0,10);
            },
            getbookCaseList() {
                this.$axios.get("http://127.0.0.1:8081/bookCase/getByUsersId/"+this.userInfo.usersId).then((response)=>{
                    this.bookCaseList = response.data.info.bookCaseList;
                },(error) =>{
                    // 对响应错误做点什么
                    console.log(error)
                    this.$router.push({path: '/error'})
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
                    "loginType":this.loginType,
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
                },(error) =>{
                    // 对响应错误做点什么
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            }
        }
    }
</script>

<style scoped>
    .el_table .info{
        text-align: center;
        width: 1350px;
        margin: auto;
    }
    .el_table .el-table-column{
        height: 20px
    }
    .el-table-column{
        text-align: center;
    }
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

a{
    text-decoration: none;
    color: deepskyblue;
    cursor:pointer;
}

</style>
