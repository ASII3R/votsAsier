
import { createRouter, createWebHistory } from 'vue-router'

import LoginScreen from '@/pages/LoginScreen.vue'
import VotacionsScreen from '@/pages/VotacionsScreen.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginScreen,
  },
  {
    path: '/votacions',
    name: 'votacions',
    component: VotacionsScreen,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
