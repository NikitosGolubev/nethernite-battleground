import MainLayout from '@/layouts/MainLayout/MainLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/',
        name: 'home',
        component: () =>
          import(/* webpackChunkName: "Home" */ '@/pages/Home/index.vue'),
        props: (route) => ({
          searchParam: route.query.search,
          limit: route.query.limit,
          page: route.query.page,
        }),
      },
      {
        path: '*',
        redirect: { name: 'home' },
      },
    ],
  },
];

export default routes;
