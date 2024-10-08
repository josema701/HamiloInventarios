import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProveedoresView from '../views/ProveedoresView.vue'
import ClientesView from '../views/ClientesView.vue'
import ProductosView from '../views/ProductosView.vue'
import ComprasView from '../views/ComprasView.vue'
import VentasView from '../views/VentasView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import LoginView from '../views/LoginView.vue'
import PerfilView from '../views/PerfilView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      component: ProveedoresView
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: ClientesView
    },
    {
      path: '/productos',
      name: 'productos',
      component: ProductosView
    },
    {
      path: '/compras',
      name: 'compras',
      component: ComprasView
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: VentasView
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
