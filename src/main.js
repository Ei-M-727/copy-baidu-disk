import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Verify from './utils/Verify';




//完整引入element-plus
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css';

//图标
import '@/assets/icon/iconfont.css';
import '@/assets/base.scss';
//引入cookies
import VueCookies from 'vue-cookies';




//自定义组件
import Dialog from '@/components/Dialog.vue';

const app = createApp(App);
app.use(ElementPlus);


app.component("Dialog", Dialog);

app.use(router);


// 配置全局变量
app.config.globalProperties.Verify = Verify;

app.mount('#app');
