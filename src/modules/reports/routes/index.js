import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';

export default [
  {
    path: '/reports',
    meta: {
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "reports" */ '../Reports.vue'),
    children: [
      {
        path: '',
        name: 'reports',
        component: () => import(/* webpackChunkName: "reports" */ '../views/ReportsMain.vue'),
        beforeEnter: (to, from, next) => {
          store.dispatch('reports/setReports')
            .then(() => next())
            .catch((err) => next(errorHandler(err)));
        },
      },
    ],
  },
];
