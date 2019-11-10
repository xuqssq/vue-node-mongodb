// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(infiniteScroll)
Vue.use(vueLazyLoad, {
    loading: "/static/loading-svg/Pacman.svg"
})
Vue.use(Vuex)

const store = new Vuex.Store({
        state: {
            nickName: '',
            cartCount: 0
        },
        mutations: {
            updateUserInfo(state, nickName) {
                state.nickName = nickName;
            },
            updateCartCount(state, cartCount) {
                state.cartCount += cartCount
            },
            initCartCount(state, cartCount) {
                state.cartCount = cartCount;
            }
        }
    })
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})