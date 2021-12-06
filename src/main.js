import Vue from 'vue'


import '@/styles/index.scss' // global css

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import axios from 'axios'

import '@/icons' // icon
import '@/permission' // permission control


// 按需引入 element ui
/* import { Button, Row, Col, Card, DatePicker, Container, Aside, Header, Main, Menu, Submenu, MenuItemGroup, MenuItem, Dropdown, DropdownMenu, DropdownItem, Form, FormItem, Input, Image, Icon, Breadcrumb, BreadcrumbItem } from 'element-ui';

Vue.config.productionTip = false
Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Card.name, Card)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Container.name, Container)
Vue.component(Aside.name, Aside)
Vue.component(Header.name, Header)
Vue.component(Main.name, Main)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItemGroup.name, MenuItemGroup)
Vue.component(MenuItem.name, MenuItem)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.component(Image.name, Image)
Vue.component(Icon.name, Icon)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(BreadcrumbItem.name, BreadcrumbItem) */

// set ElementUI 
Vue.use(ElementUI)

// 全局引入axios
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
