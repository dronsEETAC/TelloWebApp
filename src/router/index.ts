import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import ConnectTab from '../views/ConnectTab.vue'
import OneDronePage from '../views/OneDronePage.vue'
import SwarmPage from '../views/SwarmPage.vue'
import PlayMQTTPage from '../views/PlayMQTTPage.vue'
import PlaySpeechMQTTPage from '../views/PlaySpeechMQTTPage.vue'
import PlayWSPage from '../views/PlayWSPage.vue'
import SetColorPage from '../views/SetColorPage.vue'
import ShowColorPage from '../views/ShowColorPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: ConnectTab
    //component: TabsPage

  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: 'OneDrone',
        component: OneDronePage,
        name: "OneDrone",
      },
      {
        path: 'Swarm',
        component: SwarmPage,
        name: "Swarm",
      },
      {
        path: 'PlayMQTT',
        component: PlayMQTTPage,
        name: "PlayMQTT",
      },
      {
        path: 'PlaySpeechMQTT',
        component: PlaySpeechMQTTPage,
        name: "PlaySpeechMQTT",
      },
      {
        path: 'PlayWS',
        component: PlayWSPage,
        name: "PlayWS",
      },
      {
        path: 'SetColor',
        component: SetColorPage,
        name: "SetColor",
      },
      {
        path: 'ShowColor',
        component: ShowColorPage,
        name: "ShowColor",
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
