import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { public: true },
  },
  {
    path: '/form',
    name: 'form',
    component: () => import('@/pages/ProveedorForm.vue'),
    meta: { roles: ['proveedor'] },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/ReviewerDashboard.vue'),
    meta: { roles: ['revisor_compras', 'revisor_excelencia', 'admin'] },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (!to.meta.public && !auth.token) {
    return { name: 'login' }
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.rol)) {
    if (auth.rol === 'proveedor') return { name: 'form' }
    if (['revisor_compras', 'revisor_excelencia', 'admin'].includes(auth.rol)) return { name: 'dashboard' }
    return { name: 'login' }
  }

  if (to.name === 'login' && auth.token) {
    if (auth.rol === 'proveedor') return { name: 'form' }
    return { name: 'dashboard' }
  }
})

export default router
