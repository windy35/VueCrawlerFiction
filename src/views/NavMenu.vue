<template>
    <div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                 background-color="#545c64"
                 text-color="#88C6E5"
                 active-text-color="#ffd04b"
        >
            <el-menu-item index="1"><router-link :to="{path: '/'}">首页</router-link></el-menu-item>
            <el-menu-item index="2"><router-link :to="{path: '/bookCase'}">我的书架</router-link></el-menu-item>
            <el-menu-item index="3"><router-link :to="{path: '/fenlei/'+'xhxs'}">玄幻小说</router-link></el-menu-item>
            <el-menu-item index="4"><router-link :to="{path: '/fenlei/'+'xzxs'}">修真小说</router-link></el-menu-item>
            <el-menu-item index="5"><router-link :to="{path: '/fenlei/'+'dsxs'}">都市小说</router-link></el-menu-item>
            <el-menu-item index="6"><router-link :to="{path: '/fenlei/'+'cyxs'}">穿越小说</router-link></el-menu-item>
            <el-menu-item index="7"><router-link :to="{path: '/fenlei/'+'wyxs'}">网游小说</router-link></el-menu-item>
            <el-menu-item index="8"><router-link :to="{path: '/fenlei/'+'khxs'}">科幻小说</router-link></el-menu-item>
            <el-menu-item index="9"><router-link :to="{path: '/allBooks'}">全部小说</router-link></el-menu-item>
            <el-menu-item index="10" v-show="adminSign"><router-link :to="{path: '/admin'}">管理员后台功能</router-link></el-menu-item>
        </el-menu>
    </div>
</template>
<script>
    export default {
        name: '',
        components: {},
        data() {
            return {
                activeIndex: sessionStorage.activeIndex,
                userInfo:JSON.parse(sessionStorage.getItem("userInfo")),
                adminSign:false,
            };
        },
        mounted(){
            this.getUserInfo();
        },
        methods: {
            getUserInfo(){
                this.$axios.get("http://127.0.0.1:8081/users/getUserInfo").then((response)=>{
                    sessionStorage.setItem("userInfo",JSON.stringify(response.data.info.users));
                    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
                    if(this.userInfo != null)
                        this.adminSign = this.userInfo.role;
                },(error) => {
                    // 对响应错误做点什么
                    this.userInfo = null
                    console.log(error)
                    this.$router.push({path: '/error'})
                });
            },
            handleSelect(key) {
                sessionStorage.activeIndex = key;
                this.activeIndex = sessionStorage.activeIndex;
                // console.log(key, keyPath);
            }
        },
    }
</script>
<style lang="postcss" scoped>
    .el-menu a{
        text-decoration: none;
    }
</style>
