<template>
    <div>
    <div class="bookInfoBox">
        <div class="tab">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><router-link :to="{path: '/book/'+bookInfo.bookId}">{{bookInfo.name}}</router-link></el-breadcrumb-item>
                <el-breadcrumb-item>{{this.chapterInfo.title}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </div>
    <div class="chapterBox">
        <h1>{{this.chapterInfo.title}}</h1>
        <div class="opt">
            <span><a href="javascript:void(0) "  @click="recommend">推荐本书</a></span>
           <span> <a href="javascript:void(0) "  @click="preFlushCom">上一章节</a></span>
            <span><a href="javascript:void(0) "  @click="nextFlushCom">下一章节</a></span>
            <span><router-link :to="{path: '/book/'+bookInfo.bookId}">本书目录</router-link></span>
            <span><a href="javascript:void(0) "  @click="addBookmarks">加入书签</a></span>
        </div>
        <hr>
        <pre>{{this.chapterInfo.content}}</pre>
        <hr>
        <div class="opt">
            <span> <a href="javascript:void(0) "  @click="recommend">推荐本书</a></span>
            <span> <a href="javascript:void(0) "  @click="preFlushCom">上一章节</a></span>
            <span><a href="javascript:void(0) "  @click="nextFlushCom">下一章节</a></span>
            <span><router-link :to="{path: '/book/'+bookInfo.bookId}">本书目录</router-link></span>
            <span><a href="javascript:void(0) "  @click="addBookmarks">加入书签</a></span>
        </div>
    </div>
    </div>
</template>

<script>
    export default {
        name: "BookInfo",
        data(){
          return{
              bookInfo:[],
              chapterInfo:''
          }
        },
        mounted() {
            this.getBookInfo();
            this.getChapterInfo();
        },
        methods:{
            getUserInfo(){
                this.$axios.get("http://127.0.0.1:8081/users/getUserInfo").then((response)=>{
                    sessionStorage.setItem("userInfo",JSON.stringify(response.data.info.users));
                });
            },
            addBookmarks(){
                this.getUserInfo();
                if(sessionStorage.userInfo == "null"){
                    this.$notify.info({
                        title: '消息',
                        message: '请先登录账号'
                    }, (error) => {
                        // 对响应错误做点什么
                        console.log(error)
                        this.$router.push({path: '/error'})
                    });
                }
                if(sessionStorage.userInfo != "null") {
                    var bookCase ={
                        "bookName": this.bookInfo.name,
                        "usersId": JSON.parse(sessionStorage.getItem('userInfo')).usersId,
                        "bookId": this.bookInfo.bookId,
                        "author": this.bookInfo.author,
                        "tagChapterName": this.chapterInfo.title,
                        "tagChapterId":this.chapterInfo.chapterId,
                        "lastUpdateChapterId": this.bookInfo.lastUpdateChapterId,
                        "lastUpdateChapterName":this.bookInfo.lastChapter
                    };
                    this.$axios({
                        method:'post',
                        url:'http://127.0.0.1:8081/bookCase/insertOne/',
                        data:bookCase,
                        // headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    }).then((res) => {
                        this.$notify.success({
                            title: '消息',
                            message: res.data.msg
                        }, (error) => {
                            // 对响应错误做点什么
                            console.log(error)
                            this.$router.push({path: '/error'})
                        });
                    })
                }
            },
            recommend(){
                this.$axios.put('http://127.0.0.1:8081/books/addBookHeat/'+this.bookInfo.bookId).then(() => {
                    this.$notify.success({
                        title: '消息',
                        message: '推荐《'+this.bookInfo.name+'》成功，本书热度加1'
                    });
                }, (error) => {
                    // 对响应错误做点什么
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            },
            preFlushCom(){
                //router是路由实例,例如:var router = new Router({})
                //router.go(n)是路由的一个方法，意思是在history记录中前进或者后退多少步，0就表示还是当前，类似window.history.go(n)
                if(this.chapterInfo.preChapterId == 0)
                {
                    this.$notify.info({
                        title: '消息',
                        message: '已经是第一章'
                    });
                }else{
                    this.$router.push({path: '/book/'+this.bookInfo.bookId+'/'+(this.chapterInfo.preChapterId)})
                    this.$router.go(0);
                }

            },
            nextFlushCom(){
                if(this.chapterInfo.nextChapterId == 0){
                    this.$notify.info({
                        title: '消息',
                        message: '已经是最后一章'
                    });
                }else{
                    this.$router.push({path: '/book/'+this.bookInfo.bookId+'/'+(this.chapterInfo.nextChapterId)})
                    this.$router.go(0);
                }
            },
            getBookInfo(){
                this.$axios.get('http://127.0.0.1:8081/books/getOneBookBasicInfo/' + this.$route.params.bookId).then((response)=>{
                    this.bookInfo = response.data.info.bookBasicInfo
                },(error) =>{
                    // 对响应错误做点什么
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            },
            getChapterInfo(){
                console.log(this.$route.params)
                this.$axios.get('http://127.0.0.1:8081/chapter/getOneChapterById/' + this.$route.params.id).then((response)=>{
                    this.chapterInfo = response.data.info.chapterInfo
                    this.chapterInfo.content = this.chapterInfo.content.split('   ').join('\n\n    ').replace('','   ')
                },(error) =>{
                    // 对响应错误做点什么
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            },
        }
    }
</script>

<style scoped>
    .opt{
        text-align: center;
    }
    .opt span{
        margin:10px 30px;
    }
    pre{
        white-space:pre-wrap;
        white-space:-moz-pre-wrap;
        white-space:-o-pre-wrap;
        word-wrap:break-word;
        margin: 10px 10px;
        font-size: 19pt;
        line-height: 25pt;
        font-family: 黑体;
        font-weight: 500;
    }
    .chapterBox{
        border: 2px solid #88C6E5;
        overflow: auto;
        width: 1200px;
        margin: 10px auto;
        white-space:pre;

    }
    .bookInfoBox {
        border: 2px solid #88C6E5;
        overflow: hidden;
        width: 1200px;
        margin:auto;

    }
    .chapterBox h1{
        font-size: 19pt;
        line-height: 25pt;
        font-family: 黑体;
        font-weight: 500;
        text-align: center;
    }
    .chapterBox hr{
        margin:10px 0px;
        border:1px dashed #88C6E5;
    }
    .tab{
        border-bottom: #88C6E5 1px solid;
        text-align: left;
        padding: 10px 10px;
        background-color: #E1ECED;
    }
    .imgBox{
        float: left;
        height: 150px;
        width: 120px;
        margin: 10px 10px;
    }
    .imgBox img{
        height: 150px;
        width: 120px;
    }
    .mainInfo{
        float: right;
        width: 1050px;
        text-align: left;
        overflow: hidden;
        margin: auto;
    }
    .mainInfo span{
        height: 25px;
        line-height: 25px;
        padding-top: 2px;
        width: 500px;
        margin: auto;
        overflow: hidden;
        float: left;
    }
    .introduction{
        width: 96%;
        overflow: hidden;
        line-height: 150%;
        border-top: 1px dashed #88C6E5;
        padding: 10px;
        font-size: 16px;
        text-indent: 2em;
    }
    .recommendList{
        width: 1200px;
        padding: 5px;
        float: left;
    }
    .chapterTxt{
        border-bottom: 1px dashed #CCC;
        display: inline;
        float: left;
        height: 25px;
        margin-bottom: 5px;
        overflow: hidden;
        text-align: left;
        text-indent: 10px;
        /*vertical-align: middle;*/
        width: 25%;
    }
    .chapterTxt a{
        text-decoration: none;
        color: deepskyblue;
    }
</style>
