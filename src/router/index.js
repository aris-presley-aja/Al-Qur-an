import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SurahDetail from '../views/SurahDetail.vue'

const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/surah/:nomor', // Pastikan parameter nomor ada
    component: SurahDetail,
    props: true, // Opsional: Jika Anda ingin mengirim parameter sebagai props
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
