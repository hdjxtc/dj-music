import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import api from './api/request.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import handle from '@/model/handle'
import store from './store'

Vue.use(ElementUI);

// 封装全局变量
// 封装接口
Vue.prototype.$api = api
Vue.prototype.handle = handle


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
