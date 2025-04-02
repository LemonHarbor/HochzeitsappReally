// router.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// Lazy-loaded components
const Dashboard = () => import('./pages/Dashboard.vue');
const LoginPage = () => import('./pages/auth/LoginPage.vue');
const RegisterPage = () => import('./pages/auth/RegisterPage.vue');
const AppointmentCalendarDemo = () => import('./storyboard/AppointmentCalendarDemo.vue');
const ContractManagementDemo = () => import('./storyboard/ContractManagementDemo.vue');
const ProfilePage = () => import('./pages/ProfilePage.vue');
const SettingsPage = () => import('./pages/SettingsPage.vue');
const NotFoundPage = () => import('./pages/NotFoundPage.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { guest: true }
  },
  {
    path: '/appointment-calendar',
    name: 'AppointmentCalendarDemo',
    component: AppointmentCalendarDemo,
    meta: { requiresAuth: true }
  },
  {
    path: '/contract-management',
    name: 'ContractManagementDemo',
    component: ContractManagementDemo,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('supabase.auth.token') !== null;
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest) && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
