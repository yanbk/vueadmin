let Vue
class YRouter{
    static install(_Vue) {
        Vue = _Vue
        Vue.mixin({
            beforeCreate() {
                Vue.prototype.$kkbrouter = '1111'
                // console.log(this.$options)
                if (this.$options.router) {
                    Vue.prototype.$yrouter = this.$options.router
                    this.$options.router.init()
                }
                
            }
        })
    }
    constructor(options) {
        this.$options = options
        this.routeMap = {}
        this.app = new Vue({
            data: {
                current: '/'
            }
        })
    }

    init() {
        this.bindEvents()
        this.createRouteMap()
        this.initComponent()

        console.log(this.routeMap)
    }

    initComponent() {
        Vue.component('router-view', {
            render: h => {
                const component = this.routeMap[this.app.current].component
                return h(component)
            }
        })

        Vue.component('router-link', {
            props: {
                to: String
            },
            // template: '<a :href="to"><slot></slot></a>'
            render(h) {
                // h三个参数，组件名，参数，子元素
                return h('a', {
                    attrs: {
                        href: '#' + this.to
                    }
                },
                [this.$slots.default]
                )
            }
        })
    }

    createRouteMap() {
        this.$options.routes.forEach(item => {
            this.routeMap[item.path] = item
        })
    }

    bindEvents() {
        console.log('绑定事件')
        window.addEventListener('hashchange', this.onHashChange.bind(this), false)
        window.addEventListener('load', this.onHashChange.bind(this), false)
    }

    getHash() {
        return window.location.hash.slice(1) || '/'
    }

    getFrom(e) {
        let from, to
        if (e.newURL) {
            from = e.oldURL.split('#')[1]
            to = e.newURL.split('#')[1]
        } else {
            from = ''
            to = this.getHash()
        }

        return { from, to }
    }

    push(url) {
        window.location.hash = url
    }

    onHashChange(e) {
        console.log('hash变了', e)
        let hash = this.getHash()
        let router = this.routeMap[hash]
        let { from, to } = this.getFrom(e)
        if (router.beforeEnter) {
            router.beforeEnter(from, to, () => {
                this.app.current = hash
            })
        } else {
            this.app.current = hash
        }
    }
}

export default YRouter