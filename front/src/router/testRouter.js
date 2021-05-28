
let Vue
class TRouter{
    static install(_Vue) {
        Vue = _Vue
        Vue.mixin({
            beforeCreate() {
                Vue.prototype.$kkbrouter = '1111'
            }
        })
    }
}
const router = new TRouter()
export default router
