import vue from 'vue'
import YRouter from './yrouter'
import Home from '@/views/home.vue'


vue.use(YRouter)

export default new YRouter({
    routes: [
        {
            path: '/',
            component: Home,
            beforeEnter(from, to, next) {
                console.log(from, to)

                setTimeout(() => {
                    next()
                }, 0)
            }
        },
        {
            path: '/test',
            component: () => import('@/views/test.vue')
        }
    ]
})
