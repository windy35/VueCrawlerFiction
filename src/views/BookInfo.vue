<template>
    <div>
    <div class="bookInfoBox">
        <div class="tab">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{bookInfo.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="imgBox">
            <img :src="bookInfo.localCoverImgPath"  @error="imgError(bookInfo)">
        </div>
        <div class="mainInfo">
            <h2>{{bookInfo.name}}</h2>
            <span>作者：{{bookInfo.author}}</span>
            <span>动作：
                <a href="javascript:void(0) "  @click="addBookCase">加入书架&nbsp;&nbsp;</a>
                <a href="javascript:void(0) "  @click="recommend">推荐本书&nbsp;&nbsp;</a>
                <a href="#footer" >直达底部&nbsp;&nbsp;</a>
            </span>
            <span>最后更新：{{bookInfo.lastUpdateTime}}</span>
            <span>最新章节：<router-link :to="{path: '/book/'+bookInfo.bookId+'/'+bookInfo.lastUpdateChapterId}">{{bookInfo.lastChapter}}</router-link></span>
            <div class="introduction">
                {{bookInfo.introduction}}
            </div>
        </div>
        <div class="recommendList">推荐阅读：</div>
    </div>
    <div class="chapterBox">
        <dl>
            <dd v-for="(item,key) in chapterInfo" :key="key" class="chapterTxt">
                <router-link :to="{path: '/book/'+bookInfo.bookId+'/'+item.id}">{{item.title}}</router-link>
            </dd>
        </dl>
    </div>
    </div>
</template>

<script>
    // import Qs from 'qs';
    export default {
        name: "BookInfo",
        data(){
          return{
              bookInfo:[],
              chapterInfo:[]
          }
        },
        mounted() {
            this.getBookInfo()
        },
        methods:{
            getUserInfo(){
                this.$axios.get("http://127.0.0.1:8081/users/getUserInfo").then((response)=>{
                    sessionStorage.setItem("userInfo",JSON.stringify(response.data.info.users));
                });
            },
            imgError(pic) {
                pic.localCoverImgPath = '/static/images/cover/error.jpeg';
            },
            addBookCase(){
                this.getUserInfo()
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
                        "tagChapterName": "章节目录",
                        "tagChapterId":0,
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
            getBookInfo(){
                this.$axios.get('http://127.0.0.1:8081/books/getOneBookChapterList/' + this.$route.params.bookId).then((response)=>{
                    response.data.info.bookInfo.lastUpdateTime = response.data.info.bookInfo.lastUpdateTime.replace("T"," ").substr(0,19)
                    this.bookInfo = response.data.info.bookInfo
                    this.chapterInfo = response.data.info.chapterList;
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
    .bookInfoBox {
        border: 2px solid #88C6E5;
        overflow: hidden;
        width: 1200px;
        margin:auto;
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
    .chapterBox{
        border: 2px solid #88C6E5;
        overflow: hidden;
        width: 1200px;
        margin: 10px auto;
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
