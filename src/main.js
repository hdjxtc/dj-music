import Vue from 'vue'
import App from './App.vue'
<<<<<<< HEAD
import store from './store'
import router from './router'
import api from './api/request.js'
import handle from '@/model/handle'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/app.css'
import '@/assets/iconfont/iconfont.css'


// 设置全局组件
import Empty from '@/components/contents/empty'
Vue.component('Empty', Empty)
=======
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import api from './api/request.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import handle from '@/model/handle'
import store from './store'
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de

Vue.use(ElementUI);

// 封装全局变量
<<<<<<< HEAD
// 请求axiox接口
Vue.prototype.$api = api
// 处理工具函数
Vue.prototype.handle = handle

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
=======
// 封装接口
Vue.prototype.$api = api
Vue.prototype.handle = handle


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
>>>>>>> 4393e5e0e5c3d46e4d4bcf9c689bad40725420de
}).$mount('#app')
