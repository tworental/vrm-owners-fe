import { createRouter, createWebHistory } from 'vue-router';

import accountRoutes from '@/modules/account/routes';
import authRoutes from '@/modules/auth/routes';
import dashboardRoutes from '@/modules/dashboard/routes';
import reportsRoutes from '@/modules/reports/routes';
import statisticsRoutes from '@/modules/statistics/routes';
import errorsRoutes from '@/modules/errors/routes';

import store from './store';

const routes = [
  ...accountRoutes,
  ...authRoutes,
  ...dashboardRoutes,
  ...reportsRoutes,
  ...statisticsRoutes,
  ...errorsRoutes,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (Object.prototype.hasOwnProperty.call(to.meta, 'requiresAuth')) {
    if (to.meta.requiresAuth && !store.state.auth.isLoggedIn) {
      return next('/auth/signin');
    }

    if (!to.meta.requiresAuth && store.state.auth.isLoggedIn) {
      return next('/');
    }
  }

  if (to.matched && to.matched[0].path === '/errors') {
    return next();
  }
  return next();
});

export default router;
