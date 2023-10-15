import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../components/MainPage.vue'
import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import ChatPage from '../components/ChatPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatPage,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
