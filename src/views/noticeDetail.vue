<template>
    <div>
        <div class="MessageDiv">
            <b>{{noticeInfo.title}}</b>
        </div>
        <div class="Box">
            <span>发布者：{{noticeInfo.setter}}</span>
            <span v-if="noticeInfo.releaseTime != null">发布时间：
                {{noticeInfo.releaseTime.replace("T", " ").substr(0, 19)}}
            </span>
            <span v-if="noticeInfo.lastUpdateTime != null">最后修改时间：
                {{noticeInfo.lastUpdateTime.replace("T", " ").substr(0, 19)}}
            </span>
            <hr>
            <p>{{noticeInfo.content}}</p>
            <span class="fj" v-for="(item,index) in this.attachmentName" :key="index">
                <a :href="attachmentHref[index]"> 附件{{index+1}}：{{attachmentName[index]}}</a>
            </span>
        </div>
    </div>
</template>
<script>
    export default {
        name: '',
        components: {},
        data() {
            return {
                noticeInfo:[],
                attachmentName:[],
                attachmentHref:[]
            }
        },
        mounted(){
            this.getNoticeInfo()
        },
        methods: {
            getNoticeInfo(){
                this.$axios.get('http://127.0.0.1:8081/notice/getOne/' + this.$route.params.id).then((response)=>{
                    this.noticeInfo = response.data.info.notice
                    if(this.noticeInfo.attachmentName != null)
                        this.attachmentName = this.noticeInfo.attachmentName.split('|').splice(0,this.noticeInfo.attachmentHref.split('|').length-1)
                    if(this.noticeInfo.attachmentHref != null)
                        this.attachmentHref = this.noticeInfo.attachmentHref.split('|').splice(0,this.noticeInfo.attachmentHref.split('|').length-1)
                },(error) =>{
                    // 对响应错误做点什么
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            },
        }
    }
</script>
<style lang="postcss" scoped>
    .Box{
        border: 2px solid #88C6E5;
        overflow: hidden;
        width: 1200px;
        margin: 10px auto;
        text-align: center;
    }
    .fj{
        text-align: right;
        display: block;
    }
    .Box span{
        margin: 0 10px;
    }
    .Box p{
      text-align: left;
      text-indent: 2em;
    }
    .MessageDiv{
        line-height: 150%;
        width: 800px;
        text-align: center;
        background: lightblue;
        border-width: 1px;
        border-style: solid;
        border-color: #CCC;
        border-image: initial;
        margin: 10px auto auto;
        padding: 10px;
    }
    hr{
        border: 2px solid #88C6E5;
        line-height: 25px;
        overflow: hidden;
        width: 100%;
        margin: 5px auto;
    }
</style>
