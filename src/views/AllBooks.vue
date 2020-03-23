<template>
    <div>
    <div class="MessageDiv">
        <b>提示：本站收录的全部小说均在此页， 推荐使用Ctrl+F 来查找小说。</b>
    </div>
    <div class="Box">
        <dl>
            <dd v-for="(item,key) in allBooksList" :key="key" class="Txt">
                <router-link :to="{path: '/book/'+item.bookId}">{{item.name}}</router-link>
            </dd>
        </dl>
    </div>
    </div>
</template>

<script>
    export default {
        name: "AllBooks",
        data(){
            return{
                allBooksList:[]
            }
        },
        mounted(){
          this.getAllBooks();
        },
        methods:{
            getAllBooks(){
                this.$axios.get('http://127.0.0.1:8081/books/getAllBooksNotLimit').then((response)=>{
                    this.allBooksList=response.data.info.bookList;

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
    a{
        text-decoration: none;
        color: deepskyblue;
    }
    .Box{
        border: 2px solid #88C6E5;
        overflow: hidden;
        width: 1200px;
        margin: 10px auto;
    }
    .Txt{
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
</style>
