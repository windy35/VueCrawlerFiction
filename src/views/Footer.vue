<template>
    <div>
        <el-container>
            <el-footer>
                <div class="footer-link"></div>
                <div class="footer_cont" id="footer">
                    <p>本站所有小说为转载<a href="http://www.xbiquge.la/">新笔趣阁</a>网站中的作品，所有章节均由网友上传，转载至本站只是为了宣传本书让更多读者欣赏。本网站仅用于个人学习搭建网站，如有侵权请联系删除</p>
                    <p>Copyright © 2020-XXXX <a href="http://www.xbiquge.la/">点击访问新笔趣阁</a> All Rights Reserved.</p>
                </div>
            </el-footer>
        </el-container>
    </div>
</template>
<script>
    export default {
        name: 'Footer',
        components: {},
        data() {
            return {}
        },
        methods: {}
    }
</script>
<style lang="postcss" scoped>
    .el-footer {
        background-color: transparent;
        color: #333;
        text-align: center;
        line-height: 20px;
        padding: 0;
    }
    .footer-link{
        border-bottom: 3px solid #88C6E5;
        height: 5px;
        line-height: 25px;
        overflow: hidden;
        width: 92%;
        margin: 5px auto;
    }
    .footer_cont p{
        color:#88C6E5;
        margin: 0;
    }
    a{
        text-decoration: none;
        color:deepskyblue;
    }
</style>
