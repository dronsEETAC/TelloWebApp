import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import BootstrapVue3  from 'bootstrap-vue-3'
import  BootstrapVueIcons  from 'bootstrap-vue-3'
 
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'


 
 


import mitt from 'mitt';
const emitter = mitt();

import mqttVueHook from 'mqtt-vue-hook'
import VueSimpleAlert from "vue-simple-alert";

const app = createApp(App)
app.use(IonicVue)
app.use(router) 

app.provide('emitter', emitter);

// //app.use(mqttVueHook, 'mqtt://10.10.10.1:8000', {
//app.use(mqttVueHook, 'ws://broker.hivemq.com:8000/mqtt', {
app.use(mqttVueHook, 'ws://classpip.upc.edu:8000/mqtt', {
// //app.use(mqttVueHook, 'mqtt://localhost:8000', {
// //app.use(mqttVueHook, 'mqtt://192.168.1.46:8000', {
// app.use(mqttVueHook, 'mqtt://192.168.137.1:8000', {
   clean: true,
   keepalive: 60,
   //clientId: 'MobileAppDEE',
   clientId: undefined,
   connectTimeout: 4000,
   username: 'dronsEETAC',
   password: 'mimara1456.'
})

router.isReady().then(() => {
    app.use(BootstrapVue3)
    app.use(BootstrapVueIcons)
    app.mount('#app');
});
