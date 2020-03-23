<template>
    <div>
        <el-container>
            <el-main>
                <div class="heat-books">
                <div class="item" v-show="key<6" v-for="(item,key) in heatBookList" v-bind:key="key">
                    <div class="image">
                        <router-link :to="{path: '/book/'+item.bookId}"><img :src=item.localCoverImgPath  :alt="item.author" class="img-shadow"  @error="imgError(item)"></router-link>
                    </div>
                    <dl>
                        <dt class="dt-txt">
                            <span>{{item.author}}</span>
                            <router-link :to="{path: '/book/'+item.bookId}">{{item.name}}</router-link>
                        </dt>
                        <hr class="hr-link">
                        <dd class="txt">
                            {{item.introduction}}
                        </dd>
                    </dl>
                </div>
                </div>
            </el-main>
            <el-aside width="400px">
                <div class="notice">
                    <h2 class="noticeTitle">公告栏</h2>
                    <ul>
                        <li v-for="(item,index) in noticeList.list" :key="index">
                            <router-link :to="{path:'/noticeDetail/'+ item.noticeId}"><span class="title">{{item.title.substr(0, 20)}}</span></router-link>
                            <span class="time">{{item.releaseTime.replace("T", " ").substr(5, 5)}}</span>
                        </li>
                    </ul>
                    <div class="block">
                        <el-pagination
                                @size-change="handleNoticeSizeChange"
                                @current-change="handleNoticeCurrentChange"
                                :current-page="noticeCurrentPage"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="noticePageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="this.noticeList.totalNum"
                                :prev="this.noticeList.havePerPage"
                                :next="this.noticeList.haveNexPage"
                                :pager="this.noticeList.totlePage">
                        </el-pagination>
                    </div>
                </div>
            </el-aside>
        </el-container>
        <el-container>
            <el-main>
                <div class="books-type">
                    <div v-for="(itemOuter,key) in typeBookList" v-bind:key="key">
                        <div class="item2" v-if="itemOuter.length">
                            <div v-for="(item,key) in itemOuter" v-bind:key="key">
                                <div v-if="!key">
                                    <h2 class="h2txt">{{item.type}}</h2>
                                    <div class="image">
                                        <router-link :to="{path: '/book/'+item.bookId}">
                                            <img :src="item.localCoverImgPath" :alt="item.author" class="img-shadow" @error="imgError(item)">
                                        </router-link>
                                    </div>
                                    <dl>
                                        <dt class="dt-txt">
                                            <span>作者：{{item.author}}</span>
                                              <router-link :to="{path: '/book/'+item.bookId}">
                                                {{item.name}}
                                              </router-link>
                                        </dt>
                                        <hr class="hr-link">
                                        <dd class="txt">
                                            {{item.introduction}}
                                        </dd>
                                    </dl>
                                </div>
                                <div class="BookItem " style="width: 500px" v-if="key">
                                    <router-link :to="{path: '/book/'+item.bookId}">
                                        <span class="name">{{item.name}}</span>
                                    </router-link>
                                        <span class="author">作者：{{item.author}}</span>
                                </div>
                                <div class="BookItem" style="width: 500px" v-if="key">
                                    <hr>
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            </el-main>
        </el-container>
        <el-container>
            <el-main>
                <div class="border">
                    <h2 class="border">小说推荐</h2>
                <div class="BookItem"  v-for="(item,key) in this.page.list" :key="key">
                    <span class="type">[{{item.type}}]</span>
                    <router-link :to="{path: '/book/'+item.bookId}">
                        <span class="name">{{item.name}}</span>
                    </router-link>
                    <router-link :to="{path: '/book/'+item.bookId+'/'+item.chapterCount}">
                        <span class="lastChapter">最新章节：{{item.lastChapter}}</span>
                    </router-link>
                    <span class="author">作者：{{item.author}}</span>
                    <div class="BookItem">
                        <hr>
                    </div>
                </div>
                <div class="BookItem">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 40, 80]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="this.page.totalNum"
                            :prev="this.page.havePerPage"
                            :next="this.page.haveNexPage"
                            :pager="this.page.totlePage">
                    </el-pagination>
                </div>
                </div>
            </el-main>
            <el-aside width="500px" class="border">
                <h2 class="border">综合热门小说推荐</h2>
                <div  class="hotBook" v-for="(item,key) in this.heatBookList" :key="key">
                    <router-link :to="{path: '/book/'+item.bookId}">
                        <span class="hotBookName">{{item.name}}</span>
                    </router-link>
                    <span class="hotBookAuthor">作者：{{item.author}}</span>
                </div>
            </el-aside>
        </el-container>
    </div>
</template>

<style>
    ul li .title{
        float: left;
        color: deepskyblue;
        overflow: hidden;
        cursor: pointer;
        margin-left: 10px;
    }
    ul li .time{
        float: right;
        color: darkgray;
        overflow: hidden;
        margin-right: 10px;
    }
    .txt{
        text-indent: 2em;
        font-size: 12px;
        line-height: 20px;
        color: grey;
        text-align: left;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box; /** 将对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 5; /** 显示的行数 **/
        overflow: hidden;  /** 隐藏超出的内容 **/
    }
    .item{
        float: left;
        height: 160px;
        width: 350px;
        overflow: hidden;
    }
    .BookType{
        width: 500px;
    }
    .BookItem{
        margin: 0;
        width: 1000px;
        text-align: center;
        overflow: hidden;
    }

    .border{
        color: deepskyblue;
        box-shadow:1px 1px 5px #333;
        -webkit-box-shadow:1px 1px 5px #333;
        -moz-box-shadow:1px 1px 5px  #333;
        margin-bottom: 10px;
    }
    .BookItem{
        margin: 0;
        width: 1000px;
        margin: 0 auto;
    }
    .BookItem span{
        font-weight: 400;
        margin: 0 10px;
    }
    .BookItem .name{
        float: left;
        color: deepskyblue;
    }

    .BookItem a{
        text-decoration: none;
    }

    .lastChapter{
        color: deepskyblue;
    }

    .type{
        float: left;
        color: coral;
    }

    .BookItem .author{
        float: right;
        color: #B3B3B3;
    }
    .BookItem hr{
        border: 1px solid #88C6E5;
        overflow: hidden;
        margin: 0 5px;
    }
    .item2{
        float: left;
        height: 400px;
        width: 500px;
        overflow: hidden;
        padding: 0;
    }
    .item2 .txt{
        -webkit-line-clamp: 4; /** 显示的行数 **/
    }
    .item2 .h2txt{
        font-size: 14px;
        font-weight: bold;
        padding-left: 5px;
        line-height: 20px;
        height: 20px;
        overflow: hidden;
        margin-right: 2px;
        margin-bottom: 10px;
        color: deepskyblue;
        box-shadow:1px 1px 5px #333;
        -webkit-box-shadow:1px 1px 5px #333;
        -moz-box-shadow:1px 1px 5px  #333;
    }

    .item2 .image{
        height: 130px;
        width: 96px;
    }

    .item2 .image img{
        float: left;
        height: 120px;
        width: 96px;
    }
    .item .image img{
        float: left;
        height: 150px;
        width: 120px;
    }
    .img-shadow{
        background:#000;
        box-shadow:1px 1px 5px #333;
        -webkit-box-shadow:1px 1px 5px #333;
        -moz-box-shadow:1px 1px 5px  #333;
    }
    .image{
        float: left;
        height: 150px;
        width: 120px;
        margin: 0 10px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        /*line-height: 200px;*/
    }
    .el-container{
        margin: 0;
        padding: 0;
    }
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: left;
        padding: 0;
        margin: 0;
        /*min-height: 10px;*/
    }

    .dt-txt span{
        color: #B3B3B3;
        float: right;
        font-weight: 400;
    }
    .dt-txt a{
        /*float: left;*/
        /*font-weight: 400;*/
        text-decoration: none;
        color: deepskyblue;
    }
    .heat-books{
        width: 1100px;
        height: 300px;
        margin: auto;
    }
    .books-type{
        margin: 0 auto;
        width: 1500px;
        height: 320px;
    }
    .hr-link{
        border: 1px solid #88C6E5;
        overflow: hidden;
        margin: 5px auto;
    }
    .noticeTitle{
        text-align: left;
        background-color: #88C6E5;
        font-size: 14px;
        font-weight: 700;
        height: 30px;
        line-height: 30px;
        /*border-bottom: 1px solid rgb(221, 221, 221);*/
        overflow: hidden;
        margin: 0px;
        padding: 0px 0px 0px 10px;
    }
    img{
        cursor: pointer;
    }
    .hotBook{
        height: 25px;
        width: 500px;
        margin: 0 auto;
        border-bottom: 1px solid #88C6E5;
    }
    .hotBook .author{
        padding: 0 20px;
        width: 400px;
    }
    .hotBookName{
        margin-left: 20px;
        float: left;
        color: deepskyblue;
        overflow: hidden;
    }
    .hotBook span{
        font-weight: 400;
        margin: 0 10px;
    }
    .hotBookAuthor{
        color: #B3B3B3;
        margin-right: 20px;
        float: right;
    }
</style>
<script>
  export default {
    name: 'home',
    props:{
    },
    data(){
      return{
          heatBookList:[],
          typeBookList:[],
          page:[],
          currentPage:1,
          pageSize:20,
          noticeList:[],
          noticeCurrentPage:1,
          noticePageSize:5,
          book:[],
      }
      },
    components: {
    },
     mounted(){
        this.getOne(10);
        this.updateChapterCount();
         this.getAllBooksLimit(0,20);
         this.getEachByTypeLimit(0,10);
         this.getAllBooks(this.currentPage,this.pageSize);
         this.getAllNotice(this.noticeCurrentPage,this.noticePageSize)
      },
    methods:{
        getOne(id){
            this.$axios.get('http://127.0.0.1:8081/books/getBookInfo/'+id).then((response)=>{
                this.book = response.data.info.bookInfo;
            },(error) =>{
                // 对响应错误做点什么
                console.log(error)
                this.$router.push({path: '/error'})
            });
        },
        dateFormat(row, column) {
            var date = row[column.property];
            if (date == undefined) {
                return "";
            }
            return date.replace("T", " ").substr(0, 19);
        },
        handleNoticeSizeChange(val) {
            this.noticePageSize = val;
            this.noticeCurrentPage = 1;
            this.getAllNotice(this.noticeCurrentPage, val);
        },
        handleNoticeCurrentChange(val) {
            this.noticeCurrentPage = val;
            this.getAllNotice(val, this.noticePageSize);
        },
        getAllNotice(pageNum, limit) {
            this.$axios.get('http://127.0.0.1:8081/notice/getAllNoticeByPageHelper?pageNum=' + pageNum + '&limit=' + limit).then((response) => {
                this.noticeList = response.data.info.page;
            }, (error) => {
                // 对响应错误做点什么
                console.log(error)
                this.$router.push({path: '/error'})
            });
        },
        imgError(pic) {
            pic.localCoverImgPath = '/static/images/cover/error.jpeg';
        },
        updateChapterCount(){
            this.$axios.put('http://127.0.0.1:8081/books/updateChapterCount').then(()=>{
            },(error) =>{
                // 对响应错误做点什么
                console.log(error)
                this.$router.push({path: '/error'})
            });
        },
        passwordPercentFormat(percentage){
            return percentage === 100 ? '符合' : `不符`;
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.registerFormData.passwordPercent = 0;
        },
        register(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogFormVisible = false;
                    let formData = new FormData();//创建formData对象
                    for(let key in this.registerFormData){
                        formData.append(key,this.registerFormData[key]);
                        // console.log(formData.get(key));
                    }
                    this.$axios({
                        method:"post",
                        url:"http://127.0.0.1:8081/users/register",
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
                    },(error) =>{
                        // 对响应错误做点什么
                        console.log(error)
                        this.$router.push({path: '/error'})
                    });
                    this.resetForm(formName);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        showRegisterBox(msg){
            this.dialogFormVisible = msg;
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getAllBooks(this.currentPage,val);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAllBooks(val,this.pageSize);
        },
        getAllBooks(pageNum,limit){
            this.$axios.get('http://127.0.0.1:8081/books/getAllBooks?pageNum='+pageNum+'&limit='+limit).then((response)=>{
                this.page = response.data.info.page;
            },(error) =>{
                // 对响应错误做点什么
                console.log(error)
                this.$router.push({path: '/error'})
            });
        },
        getAllBooksLimit(offset,limit){
            this.$axios.get('http://127.0.0.1:8081/books/getAllBooksLimit?offset='+offset+"&"+"limit="+limit).then((response)=>{
                this.heatBookList=response.data.info.bookList;
            },(error) =>{
                // 对响应错误做点什么
                console.log(error)
                this.$router.push({path: '/error'})
            });
        },
        getEachByTypeLimit(offset,limit){
            this.$axios.get('http://127.0.0.1:8081/books/getEachByTypeLimit?offset='+offset+"&"+"limit="+limit).then((response)=>{
                this.typeBookList = response.data.info.bookList;
            },(error) =>{
                // 对响应错误做点什么
                console.log(error)
                this.$router.push({path: '/error'})
            });
        }
    },
  }
</script>
