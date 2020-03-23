<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'CheckToken',
  props: {

  },
  data(){
    return{
      userInfo:[]
    }
  },
  methods:{
    getUserInfo(){
      this.$axios.get("http://127.0.0.1:8081/users/getUserInfo").then((response)=>{
        sessionStorage.setItem("userInfo",JSON.stringify(response.data.info.users));
        this.userInfo = response.data.info.users;
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

