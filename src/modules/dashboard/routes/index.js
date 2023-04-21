import moment from 'moment';
import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';

export default [
  {
    path: '/',
    meta: {
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "dashboard" */ '../Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/DashboardMain.vue'),
        beforeEnter: (to, from, next) => store.dispatch('dashboard/setUnits')
          .then(() => next())
          .catch((err) => next(errorHandler(err))),
      },
      {
        path: '/dashboard/:id',
        name: 'property-detail',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/DashboardDetail.vue'),
        beforeEnter: (to, from, next) => Promise.all([
          store.dispatch('dashboard/setUnit', to.params.id),
          store.dispatch('dashboard/setBookings', {
            unitId: to.params.id,
            startDate: moment().startOf('month').subtract(1, 'month').toISOString(),
            endDate: moment().startOf('month').add(1, 'month').toISOString(),
          }),
        ])
          .then(() => next())
          .catch((err) => next(errorHandler(err))),
      },
    ],
  },
];
