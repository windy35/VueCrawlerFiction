<template>
    <div>
        <div class="text">
           访问错误 {{this.secs}}秒后自动跳转到首页界面……
        </div>
        <!--<a href="javascript:countDown"></a>-->
    </div>
</template>

<script>
    export default {
        name: "error",
        data(){
            return{
                timer:null,
                secs:5
            }
        },
        methods: {
            setTimer() {
                if(this.timer == null) {
                    this.timer = setInterval( () => {
                            if(--this.secs>0)
                                console.log(this.secs+" 秒后自动跳转到首页界面……");
                            else
                                this.$router.push({path: '/'})
                    }, 1000)
                }
            },
        },
        created(){
            // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
            clearInterval(this.timer)
            this.timer = null
            this.setTimer()
        },
        destroyed(){
            // 每次离开当前界面时，清除定时器
            clearInterval(this.timer)
            this.timer = null
        },
    }
</script>

<style scoped>
.text{
    height: 30px;
    width: 300px;
    margin: auto;
}
</style>
