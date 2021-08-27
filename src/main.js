import Vue from 'vue'
import App from './App.vue'
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

Vue.use(ElementUI);

// 封装全局使用
// 请求axiox接口
Vue.prototype.$api = api
// 处理工具函数
Vue.prototype.handle = handle

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
