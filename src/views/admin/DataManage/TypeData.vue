<template>
    <div>
    <el-main>
        <el-table :data="tableData.list"
                  @selection-change="handleSelectionChange"
                  height="600px">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="类型编号">
                            <span>：{{ props.row.typeId }}</span>
                        </el-form-item>
                        <el-form-item label="类型名称">
                            <span>：{{ props.row.name }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column prop="typeId" label="编号" width="50">
            </el-table-column>
            <el-table-column prop="name" label="类型名称" width="150">
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
        name: "TypeData",
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
                this.getAllType(this.currentPage,this.pageSize);
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
            deleteOne(row) {
                this.$confirm('此操作将永久删除(' + row.name + ')的数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("http://127.0.0.1:8081/type/deleteOne/" + row.typeId).then((rs) => {
                        this.$message({
                            type: rs.data.code!=200?'error':'success',
                            message: rs.data.msg
                        });
                        this.getAllType(this.currentPage,this.pageSize);
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
                this.$confirm('此操作将永久删除这些类型数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var ids= this.multipleSelection.map(item => item.typeId).join()
                    this.$axios.delete("http://127.0.0.1:8081/type/deleteAll/"+ids).then((rs) => {
                        console.log(rs.data.msg)
                        this.$message({
                            type: rs.data.code!=200?'error':'success',
                            message: rs.data.msg
                        });
                        this.getAllType(this.currentPage,this.pageSize);
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
                this.getAllType(this.currentPage, val);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAllType(val, this.pageSize);
            },
            getAllType(pageNum, limit) {
                this.$axios.get('http://127.0.0.1:8081/type/getAllTypeByPageHelper?pageNum=' + pageNum + '&limit=' + limit).then((response) => {
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
