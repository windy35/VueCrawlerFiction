import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import BookInfo from '../views/BookInfo.vue'
import ChapterInfo from '../views/ChapterInfo.vue'
import Fenlei from '../views/Fenlei.vue'
import error from '../views/error.vue'
import test from '../views/test.vue'
import BookCase from '../views/BookCase.vue'
import AlertPwd from '../views/AlertPwd.vue'
import AllBooks from '../views/AllBooks.vue'
import Robots from '../views/Robots.vue'
import Admin from '../views/admin/Home.vue'
import BooksData from '../views/admin/DataManage/BooksData.vue'
import TypeData from '../views/admin/DataManage/TypeData.vue'
import UsersData from '../views/admin/DataManage/UsersData.vue'
import NoticeData from '../views/admin/DataManage/NoticeData.vue'
import NoticeDetail from '../views//noticeDetail.vue'

Vue.use(VueRouter)


const router = new VueRouter({
    mode:'history',
    routes : [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: About
        },
        {
            path: '/bookCase',
            name: 'bookCase',
            component: BookCase
        },
        {
            path: '/test',
            name: 'test',
            component: test
        },
        {
            path: '/book/:bookId',
            name: 'bookInfo',
            component: BookInfo
        },
        {
            path: '/book/:bookId/:id',
            name: 'chapterInfo',
            component: ChapterInfo
        },
        {
            path: '/fenlei/:type',
            name: 'fenlei',
            component: Fenlei
        },
        {
            path: '/alertPwd',
            name: 'alertPwd',
            component: AlertPwd
        },
        {
            path: '/allBooks',
            name: 'allBooks',
            component: AllBooks
        },
        {
            path: '/admin',
            redirect:'/admin/UsersData',
            name: 'admin',
            component: Admin,
            children: [
                        {path: '/admin/UsersData', name: '用户管理', component: UsersData,},
                        {path: '/admin/BooksData', name: '书本管理', component: BooksData,},
                        {path: '/admin/TypeData', name: '类别管理', component: TypeData,},
                        {path: '/admin/NoticeData', name: '通知管理', component: NoticeData,},
                    ],
        },
        {
            path: '/noticeDetail/:id',
            name: 'noticeDetail',
            component: NoticeDetail
        },
        {
            path: '/robots.txt',
            name: 'robots',
            component: Robots
        },
        {
            path:'*',
            component:error,
            name:'error',
            meta:{
                title:'页面没找到'
            }
        }
    ]
})

export default router
