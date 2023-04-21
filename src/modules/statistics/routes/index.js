export default [
  {
    path: '/statistics',
    meta: {
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "statistics" */ '../Statistics.vue'),
    children: [
      {
        path: '',
        name: 'statistics',
        component: () => import(/* webpackChunkName: "statistics" */ '../views/StatisticsMain.vue'),
      },
    ],
  },
];
