export default [
  {
    path: '/errors',
    meta: {
      requiresAuth: false,
    },
    component: () => import(/* webpackChunkName: "errors" */ '../Errors.vue'),
    children: [
      {
        path: '',
        redirect: '/errors/404',
      },
      {
        path: '401',
        component: () => import(/* webpackChunkName: "errors" */ '../views/ErrorsUnauthorized.vue'),
      },
      {
        path: '404',
        component: () => import(/* webpackChunkName: "errors" */ '../views/ErrorsNotFound.vue'),
      },
      {
        path: '403',
        component: () => import(/* webpackChunkName: "errors" */ '../views/ErrorsForbidden.vue'),
      },
      {
        path: '500',
        component: () => import(/* webpackChunkName: "errors" */ '../views/ErrorsInternalServerError.vue'),
      },
      {
        path: '502',
        component: () => import(/* webpackChunkName: "errors" */ '../views/ErrorsBadGateway.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/errors/404',
  },
];
