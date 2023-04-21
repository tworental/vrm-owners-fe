export default [
  {
    path: '/account',
    name: 'account',
    meta: {
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "account" */ '../Account.vue'),
  },
];
