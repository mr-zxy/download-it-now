/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layouts/main.vue'),
    redirect: "/home",
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: '/movies',
        name: 'movies',
        component: () => import('@/views/movies/index.vue')
      },
      {
        path: '/player',
        name: 'player',
        component: () => import('@/views/player/index.vue')
      },
      {
        path: '/resourceLibrary',
        name: 'resourceLibrary',
        component: () => import('@/views/resourceLibrary/index.vue')
      },
    ]
  },

]

export default constantRouterMap