import Vue from 'vue'
import Router from 'vue-router'
import goodsList from '@/views/goodsList'
import cart from '@/views/cart'
import address from '@/views/address'
import addNewAddress from '@/views/addNewAddress'
import OrderConfirm from '@/views/OrderConfirm'
import orderSuccess from '@/views/OrderSuccess'



Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'goodsList',
        component: goodsList
    }, {
        path: '/cart',
        name: 'cart',
        component: cart
    }, {
        path: '/address',
        name: 'address',
        component: address
    }, {
        path: '/addNewAddress',
        name: 'addNewAddress',
        component: addNewAddress
    }, {
        path: '/OrderConfirm',
        name: 'OrderConfirm',
        component: OrderConfirm
    }, {
        path: '/orderSuccess',
        name: 'orderSuccess',
        component: orderSuccess
    }]
})