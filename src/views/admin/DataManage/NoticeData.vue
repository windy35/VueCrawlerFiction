<template>
    <div>
    <el-main>
        <el-table :data="tableData.list"
                  @selection-change="handleSelectionChange"
                  height="600px">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="通知编号">
                            <span>：{{ props.row.noticeId }}</span>
                        </el-form-item>
                        <el-form-item label="标题">
                            <span>：{{ props.row.title }}</span>
                        </el-form-item>
                        <el-form-item label="发布时间">
                            <span>：{{ props.row.releaseTime }}</span>
                        </el-form-item>
                        <el-form-item label="最后修改时间">
                            <span>：{{ props.row.lastUpdateTime }}</span>
                        </el-form-item>
                        <el-form-item label="附件路径">
                            <span>：{{ props.row.attachmentHref }}</span>
                        </el-form-item>
                        <el-form-item label="附件名称">
                            <span>：{{ props.row.attachmentName }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column prop="noticeId" label="编号" width="50">
            </el-table-column>
            <el-table-column prop="title" label="标题" width="150">
            </el-table-column>
            <el-table-column prop="releaseTime" label="发布时间" width="200" :formatter="dateFormat">
            </el-table-column>
            <el-table-column prop="lastUpdateTime" label="最后修改时间" width="200" :formatter="dateFormat">
            </el-table-column>
            <el-table-column prop="attachmentHref" label="附件" width="150">
            </el-table-column>
            <el-table-column
                    label="操作"  width="100px">
                <template slot="header">
                    <el-button
                            type="danger"
                            size="mini"
                            @click="showDialog()">发布通知
                    </el-button>
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
                    <el-button type="text" @click="updateOne(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
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
        <div>
            <el-dialog title="发布通知" :visible.sync="dialogFormVisible">
                <el-form :model="noticeFormData" status-icon ref="noticeForm" :rules="rules">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="noticeFormData.title" autocomplete="off" placeholder="50字以内通知标题"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content" >
                        <el-input type="textarea" v-model="noticeFormData.content"  placeholder="请输入通知内容" ></el-input>
                    </el-form-item>
                    <el-upload
                            ref="upload"
                            class="upload-demo"
                            :action=upLoadUrl()
                            :before-upload="beforeUpload"
                            :on-preview="handlePreview"
                            :before-remove="beforeRemove"
                            :on-remove="handleRemove"
                            accept="image/jpeg,image/gif,image/png,image/bmp,aplication/zip"
                            multiple
                            :limit="3"
                            :on-exceed="handleExceed"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">最多只能上传三个zip文件，且每个不超过500kb</div>
                    </el-upload>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('noticeForm')">重置</el-button>
                    <el-button type="primary" @click="release('noticeForm')">发布</el-button>
                </div>
            </el-dialog>
        </div>
    </el-main>
    </div>
</template>

<script>
    export default {
        name: "NoticeData",
        data(){
            const validateTitle = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入通知标题'));
                }
                if (value.length>50) {
                    callback(new Error('标题只能50字以内'));
                }
                callback();
            };
            return{
                dialogFormVisible:false,
                params: '', // 表单要提交的参数
                fileList: [],
                noticeFormData: {
                    title: '',
                    content: '',
                },
                userInfo:JSON.parse(sessionStorage.getItem("userInfo")),
                tableData:[],
                currentPage:1,
                pageSize:20,
                multipleSelection:[],
                rules: {
                    title: [
                        {required: true,validator: validateTitle, trigger: ['blur', 'change']}
                    ],
                    content: [
                        {required: true, message: '请输入通知内容', trigger: ['blur', 'change']}
                    ],
                },
            }
        },
        mounted(){
            this.getUserInfo();
            if(this.userInfo!="null")
                this.getAllNotice(this.currentPage,this.pageSize);
        },
        methods:{
            upLoadUrl(){
              return "/notice/insertOne"
            },
            beforeUpload (file) {
                // 2.1，重新写一个表单上传的方法
                this.params = new FormData()
                this.fileList.push(file) // 把单个文件变成数组
                let files = [...this.fileList] // 把数组存储为一个参数，便于后期操作
                files.forEach((f) => {
                    this.params.append(`files`, f) // 把单个图片重命名，存储起来（给后台）
                })
                return false
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file) {
                if (file && file.status==="success") {
                    //移除前方法
                    return this.$confirm(`确定移除 ${ file.name }？`);
                }
            },
            handleRemove(file, fileList) {
                if (file && file.status==="success") {
                    console.log(this.fileList)
                    this.fileList.splice(0,1);
                    console.log(file, fileList);
                    console.log(this.fileList)
                }
            },
            release(formName){
                this.$refs[formName].validate((valid) => {
                    this.$refs.upload.submit()
                    if(this.params==''){
                        this.params = new FormData()
                    }
                    if (valid) {
                        this.dialogFormVisible = false;
                        for(let key in this.noticeFormData){
                            this.params.append(key,this.noticeFormData[key]);
                        }
                        console.log(this.params)
                        this.$axios({
                            method:"post",
                            url:"http://127.0.0.1:8081/notice/insertOne",
                            headers: {
                                "Content-Type": "multipart/form-data"
                            },
                            withCredentials:true,
                            data:this.params
                        }).then((response)=>{
                            this.$message({
                                message: response.data.msg,
                                type: 'success'
                            });
                        });
                        this.resetForm(formName);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            showDialog(){
              this.dialogFormVisible = true;
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
            updateOne(row){
                console.log(row)
            },
            deleteOne(row) {
                this.$confirm('此操作将永久删除(' + row.title + ')的通知, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("http://127.0.0.1:8081/notice/deleteOne/" + row.noticeId).then((rs) => {
                        this.$message({
                            type: rs.data.code!=200?'error':'success',
                            message: rs.data.msg
                        });
                        this.getAllNotice(this.currentPage,this.pageSize);
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
                this.$confirm('此操作将永久删除这些通知数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var ids= this.multipleSelection.map(item => item.noticeId).join()
                    this.$axios.delete("http://127.0.0.1:8081/notice/deleteAll/"+ids).then((rs) => {
                        console.log(rs.data.msg)
                        this.$message({
                            type: rs.data.code!=200?'error':'success',
                            message: rs.data.msg
                        });
                        this.getAllNotice(this.currentPage,this.pageSize);
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
                this.getAllNotice(this.currentPage, val);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAllNotice(val, this.pageSize);
            },
            getAllNotice(pageNum, limit) {
                this.$axios.get('http://127.0.0.1:8081/notice/getAllNoticeByPageHelper?pageNum=' + pageNum + '&limit=' + limit).then((response) => {
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
        width: 100%;
        text-overflow: ellipsis;
        display: -webkit-box; /** 将对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 2; /** 显示的行数 **/
        overflow: hidden;  /** 隐藏超出的内容 **/
    }
    span{
        /*text-indent: 2em;*/
        /*font-size: 12px;*/
        /*line-height: 20px;*/
        /*color: grey;*/
        /*text-align: left;*/
        /*word-break: break-all;*/
        /*text-overflow: ellipsis;*/
        /*display: -webkit-box; !** 将对象作为伸缩盒子模型显示 **!*/
        /*-webkit-box-orient: vertical; !** 设置或检索伸缩盒对象的子元素的排列方式 **!*/
        /*-webkit-line-clamp: 5; !** 显示的行数 **!*/
        /*overflow: hidden;  !** 隐藏超出的内容 **!*/
    }
</style>
