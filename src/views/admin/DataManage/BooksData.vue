<template>
    <div>
        <el-main>
            <el-table :data="tableData.list"
                      @selection-change="handleSelectionChange"
                      height="600px">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="书本编号">
                                <span>：{{ props.row.bookId }}</span>
                            </el-form-item>
                            <el-form-item label="作者">
                                <span>：{{ props.row.author }}</span>
                            </el-form-item>
                            <el-form-item label="书名">
                                <span>：{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="最后更新时间">
                                <span>：{{ props.row.lastUpdateTime }}</span>
                            </el-form-item>
                            <el-form-item label="最新章节">
                                <span>：{{ props.row.lastChapter }}</span>
                            </el-form-item>
                            <el-form-item label="书本类型">
                                <span>：{{ props.row.type }}</span>
                            </el-form-item>
                            <el-form-item label="章节数">
                                <span>：{{ props.row.chapterCount }}</span>
                            </el-form-item>
                            <el-form-item label="人气">
                                <span>：{{ props.row.heat }}</span>
                            </el-form-item>
                            <el-form-item label="简介" style="width:100%">
                                <span>{{ props.row.introduction }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                        type="selection"
                        width="50">
                </el-table-column>
                <el-table-column prop="bookId" label="编号" width="50">
                </el-table-column>
                <el-table-column prop="author" label="作者" width="140">
                </el-table-column>
                <el-table-column prop="name" label="书名" width="200">
                </el-table-column>
                <el-table-column prop="heat" label="人气" width="200">
                </el-table-column>
                <el-table-column prop="type" label="类型" width="100">
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="最后更新时间" width="200" :formatter="dateFormat">
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
        name: '',
        components: {},
        data() {
            return {
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
                this.getAllBooks(this.currentPage,this.pageSize);
        },
        methods: {
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
                this.$confirm('此操作将永久删除《' + row.name + '》书本数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("http://127.0.0.1:8081/books/deleteOne/" + row.bookId).then((rs) => {
                            this.$message({
                                type: rs.data.code!=200?'error':'success',
                                message: rs.data.msg
                            });
                        this.getAllBooks(this.currentPage,this.pageSize);
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
                this.$confirm('此操作将永久删除这些书本数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var ids= this.multipleSelection.map(item => item.bookId).join()
                    this.$axios.delete("http://127.0.0.1:8081/books/deleteAll/"+ids).then((rs) => {
                        console.log(rs.data.msg)
                        this.$message({
                            type: rs.data.code!=200?'error':'success',
                            message: rs.data.msg
                        });
                        this.getAllBooks(this.currentPage,this.pageSize);
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
                this.getAllBooks(this.currentPage, val);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAllBooks(val, this.pageSize);
            },
            getAllBooks(pageNum, limit) {
                this.$axios.get('http://127.0.0.1:8081/books/getAllBooks?pageNum=' + pageNum + '&limit=' + limit).then((response) => {
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
