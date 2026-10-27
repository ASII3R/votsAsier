import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'
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
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const store = useAppStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    return { name: 'login' }
  }

  if (to.name === 'login' && store.isLoggedIn) {
    return { name: 'votacions' }
  }

  return true
})

export default router