<template>
  <div>
  <el-container style="height: 700px">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="$route.path"
               router
               class="el-menu-vertical-demo">
        <template v-for="route in $router.options.routes">
          <template  v-if="route.children && route.children.length">
            <template v-for="item in route.children" >
              <el-menu-item
                      :key="route.path + '/' + item.path"
                      :index="item.path"
              >
                <i class="el-icon-menu"></i>
                <span slot="title">{{ item.name }}</span>
              </el-menu-item>
            </template>
          </template>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
    <router-view></router-view>
    </el-container>
  </el-container>
  </div>
</template>

<style>
.el-container .el-main .el-aside{
  background-color: #E9FAFF;
}
</style>
<script>
  export default {
    name: 'home',
    props:{
    },
    data: function () {
      return{
        userInfo:[],
      }
    },
    computed:{

    },
    components: {
    },
    mounted(){
      this.getUserInfo();
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
    }
  }
</script>
