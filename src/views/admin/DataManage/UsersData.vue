<template>
    <div>
        <el-main>
            <el-table :data="tableData.list"
                      @selection-change="handleSelectionChange"
                      height="600px">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="用户编号">
                                <span>：{{ props.row.usersId }}</span>
                            </el-form-item>
                            <el-form-item label="用户名">
                                <span>：{{ props.row.userName }}</span>
                            </el-form-item>
                            <el-form-item label="昵称">
                                <span>：{{ props.row.nickName }}</span>
                            </el-form-item>
                            <el-form-item label="性别">
                                <span v-if="props.row.gender == 0">：女</span>
                                <span v-if="props.row.gender == 1">：男</span>
                            </el-form-item>
                            <el-form-item label="密码">
                                <span>：{{ props.row.password }}</span>
                            </el-form-item>
                            <el-form-item label="登录状态">
                                <span v-if="props.row.status == 0">：正在登陆</span>
                                <span v-if="props.row.status == 1">：离线</span>
                            </el-form-item>
                            <el-form-item label="权限">
                                <span v-if="props.row.role == 0">：普通用户</span>
                                <span v-if="props.row.role == 1">：管理员</span>
                            </el-form-item>
                            <el-form-item label="邮箱">
                                <span>：{{ props.row.email }}</span>
                            </el-form-item>
                            <el-form-item label="QQ">
                                <span>：{{ props.row.qq }}</span>
                            </el-form-item>
                            <el-form-item label="微信">
                                <span>：{{ props.row.weChat }}</span>
                            </el-form-item>
                            <el-form-item label="手机号">
                                <span>：{{ props.row.phone }}</span>
                            </el-form-item>
                            <el-form-item label="书签数">
                                <span>：{{ props.row.bookCount }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                        type="selection"
                        width="50">
                </el-table-column>
                <el-table-column prop="usersId" label="编号" width="50">
                </el-table-column>
                <el-table-column prop="userName" label="用户名" width="150">
                </el-table-column>
                <el-table-column prop="nickName" label="昵称" width="150">
                </el-table-column>
                <el-table-column prop="role" label="权限" width="100" :formatter="getRole">
                </el-table-column>
                <el-table-column prop="gender" label="性别" width="100" :formatter="getGender">
                </el-table-column>
                <el-table-column prop="bookCount" label="书签数" width="100">
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
            <div class="block">
                <el-pagination
                        @selection-change="handleSelectionChange"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="this.tableData.totalNum"
                        :prev="this.tableData.havePerPage"
                        :next="this.tableData.haveNexPage"
                        :pager="this.tableData.totlePage">
                </el-pagination>
            </div>
        </el-main>
    </div>
</template>

<script>
    export default {
        name: "UsersData",
        data(){
            return{
                userInfo:JSON.parse(sessionStorage.getItem("userInfo")),
                tableData:[],
                currentPage:1,
                pageSize:20,
                multipleSelection:[],
            }
        },
        mounted(){
            this.getUserInfo();
            if(this.userInfo!="null")
                this.getAllUsers(this.currentPage,this.pageSize);
        },
        methods:{
            getRole(row, column){
                var data = row[column.property];
                if (data == undefined) {
                    return "";
                }
                return data?'管理员':'用户';
            },
            getGender(row, column){
                var data = row[column.property];
                if (data == undefined) {
                    return "";
                }
                return data?'男':'女';
            },
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
            deleteOne(row) {
                this.$confirm('此操作将永久删除(' + row.userName + ')的数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("http://127.0.0.1:8081/users/deleteOne/" + row.usersId).then((rs) => {
                        this.$message({
                            type: rs.data.code!=200?'error':'success',
                            message: rs.data.msg
                        });
                        this.getAllUsers(this.currentPage,this.pageSize);
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
            handleDeleteChoose() {
                this.$confirm('此操作将永久删除这些用户数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var ids= this.multipleSelection.map(item => item.usersId).join()
                    this.$axios.delete("http://127.0.0.1:8081/users/deleteAll/"+ids).then((rs) => {
                        console.log(rs.data.msg)
                        this.$message({
                            type: rs.data.code!=200?'error':'success',
                            message: rs.data.msg
                        });
                        this.getAllUsers(this.currentPage,this.pageSize);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },
            dateFormat(row, column) {
                var date = row[column.property];
                if (date == undefined) {
                    return "";
                }
                return date.replace("T", " ").substr(0, 19);
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.getAllUsers(this.currentPage, val);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAllUsers(val, this.pageSize);
            },
            getAllUsers(pageNum, limit) {
                this.$axios.get('http://127.0.0.1:8081/users/getAllUsersByPageHelper?pageNum=' + pageNum + '&limit=' + limit).then((response) => {
                    this.tableData = response.data.info.page;
                }, (error) => {
                    // 对响应错误做点什么
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            },
        }
    }
</script>

<style lang="postcss" scoped>
    body {
        background-color: #ff0000;
    }
    .el-container .el-main{
        background-color: #E9FAFF;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
