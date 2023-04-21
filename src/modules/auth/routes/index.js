import { validateRequest } from '../services';

export default [
  {
    path: '/auth',
    component: () => import(/* webpackChunkName: "auth" */ '../Auth.vue'),
    children: [
      {
        path: '',
        redirect: '/auth/signin',
      },
      {
        path: 'signin',
        name: 'signin',
        meta: { requiresAuth: false },
        component: () => import(/* webpackChunkName: "auth" */ '../views/AuthSignin.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        meta: { requiresAuth: false },
        component: () => import(/* webpackChunkName: "auth" */ '../views/AuthForgotPassword.vue'),
      },
      {
        path: 'change-password',
        name: 'change-password',
        meta: { requiresAuth: false },
        component: () => import(/* webpackChunkName: "auth" */ '../views/AuthChangePassword.vue'),
        beforeEnter: (to, from, next) => validateRequest('token', to.query)
          .then(() => next())
          .catch(() => next({ name: 'signin' })),
      },
      {
        path: 'confirmation',
        name: 'confirmation',
        meta: { requiresAuth: false },
        component: () => import(/* webpackChunkName: "auth" */ '../views/AuthConfirmation.vue'),
        beforeEnter: (to, from, next) => validateRequest('token', { type: 'confirmation', ...to.query })
          .then(() => next())
          .catch(() => next({ name: 'signin' })),
      },
      {
        path: 'verification/phone',
        name: 'verification-phone',
        component: () => import(/* webpackChunkName: "auth" */ '../views/AuthPhoneVerification.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'signout',
        name: 'signout',
        meta: { requiresAuth: true },
        component: () => import(/* webpackChunkName: "auth" */ '../views/AuthSignout.vue'),
      },
    ],
  },
];
