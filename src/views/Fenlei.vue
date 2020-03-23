<template>
    <div>
        <el-container>
            <el-main>
                <div class="topBookBox">

                    <div v-show="key<6" class="item" v-for="(item,key) in topBookList" v-bind:key="key">

                        <div class="image">
                            <router-link :to="{path: '/book/'+item.bookId}"><img :src="item.localCoverImgPath" :alt="item.author" class="img-shadow" @error="imgError(item)"></router-link>
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
        </el-container>
        <el-container>
            <el-main>
                <div class="border">
                    <h2 class="border">{{this.getType(this.$route.params.type)}}推荐</h2>
                    <div class="BookItem"  v-for="(item,key) in this.page.list" :key="key">
                        <span class="type">[{{item.type}}]</span>
                        <router-link :to="{path: '/book/'+item.bookId}">
                            <span class="name">{{item.name}}</span>
                        </router-link>
                        <router-link :to="{path: '/book/'+item.bookId+'/'+item.chapterCount}">
                            <span class="lastChapter">最新章节：{{item.lastChapter}}</span>
                        </router-link>
                        <span class="author">作者：{{item.author}}</span>
                        <hr class="hr">
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
                <h2 class="border">热门{{this.getType(this.$route.params.type)}}</h2>
                <div  class="hotBook" v-for="(item,key) in this.page.list" :key="key">
                    <router-link :to="{path: '/book/'+item.bookId}">
                        <span class="hotBookName">{{item.name}}</span>
                    </router-link>
                    <span class="hotBookAuthor">作者：{{item.author}}</span>
                    <!--<hr class="hr">-->
                </div>
            </el-aside>
        </el-container>
    </div>
</template>
<script>
    // import __ from '__' // __是需要手动引入的文件
    export default {
        name: 'Fenlei',
        components: {},
        data() {
            return {
                topBookList:[],
                bookType:'',
                typeBookList:[],
                page:[],
                currentPage:1,
                pageSize:20,
                hotBookList:[],
            }
        },
        created() {
            this.bookType = this.$route.params.type;
        },
        mounted(){
            this.getByTypeLimit(0,20);
            this.getBookByType(this.currentPage,this.pageSize);
        },
        methods: {
            imgError(pic) {
                pic.localCoverImgPath = '/static/images/cover/error.jpeg';
            },
            getBookByType(pageNum,limit){
            this.$axios.get('http://127.0.0.1:8081/books/getByType/'+this.getType(this.$route.params.type)+'?pageNum='+pageNum+'&limit='+limit).then((response)=>{
                this.typeBookList=response.data.info.bookList;
                this.page=response.data.info.page;
            },(error) =>{
                // 对响应错误做点什么
                console.log(error)
                this.$router.push({path: '/error'})
            });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.getBookByType(this.currentPage,val);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getBookByType(val,this.pageSize);
            },
            getType(type){
                switch (type) {
                    case "xhxs":return "玄幻小说";
                    case "xzxs":return "修真小说";
                    case "dsxs":return "都市小说";
                    case "cyxs":return "穿越小说";
                    case "wyxs":return "网游小说";
                    case "khxs":return "科幻小说";
                    default:return "";
                }
            },
            getByTypeLimit(offset,limit){
                this.$axios.get('http://127.0.0.1:8081/books/getByTypeLimit/'+this.getType(this.$route.params.type)+'?offset='+offset+"&"+"limit="+limit).then((response)=>{
                    this.topBookList=response.data.info.bookList;
                },(error) =>{
                    // 对响应错误做点什么
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            },
        },
        watch: {
            '$route'() {
                // to表示的是你要去的那个组件，from 表示的是你从哪个组件过来的，它们是两个对象，你可以把它打印出来，它们也有一个param 属性
                this.bookType = this.$route.params.type;
                this.getByTypeLimit(0,6);
                this.getBookByType(this.currentPage,this.pageSize);
            }
        },
    }
</script>
<style>
    .border{
        color: deepskyblue;
        box-shadow:1px 1px 5px #333;
        -webkit-box-shadow:1px 1px 5px #333;
        -moz-box-shadow:1px 1px 5px  #333;
        margin-bottom: 10px;
    }
    .BookItem span{
        font-weight: 400;
        margin: 0 10px;
    }
    .BookItem .name{
        float: left;
        color: deepskyblue;
    }

    .BookItem .hotBook a{
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
    .hotBook{
        width: 500px;
        margin: 1px auto;
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
    .hr{
        border: 1px solid #88C6E5;
        overflow: hidden;
        margin: 0 5px;
    }
    .BookItem{
        margin: 0;
        width: 1000px;
        margin: 0 auto;
    }
    .border{
        color: deepskyblue;
        box-shadow:1px 1px 5px #333;
        -webkit-box-shadow:1px 1px 5px #333;
        -moz-box-shadow:1px 1px 5px  #333;
        margin-bottom: 10px;
    }
    .topBookBox{
        width: 1100px;
        height: 300px;
        margin: auto;
    }
    .item{
        float: left;
        height: 160px;
        width: 350px;
        overflow: hidden;
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
    .image{
        float: left;
        height: 150px;
        width: 120px;
        margin: 0 10px;
    }
    .hr-link{
        border: 1px solid #88C6E5;
        overflow: hidden;
        margin: 5px auto;
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
</style>
