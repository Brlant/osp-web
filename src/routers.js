import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

//  专门用来展示静态HTML文件的组件
// const Html = {
//   template: '<div v-html="html"></div>',
//   data: () => ({
//     html: ''
//   }),
//   beforeRouteEnter(to, from, next) {
//     axios.get('/static/html/' + to.params.file).then(response => {
//       next(vm => {
//         vm.html = response.data;
//         vm.$nextTick(() => vm.$emit('loaded'));
//       });
//     });
//   },
//   beforeRouteUpdate(to, from, next) {
//     this.$emit('loaded', 1);
//     axios.get('/static/html/' + to.params.file).then(response => {
//       this.html = response.data;
//       this.$nextTick(() => {
//         this.$emit('loaded', 0);
//         next();
//       });
//     });
//   }
// };
export const routes = [
  {
    path: '/',
    component: () => import('./components/index.vue'),
    children: [
      {
        path: '/api',
        component: () => import('./components/system/index.vue'),
        meta: {moduleId: 'api', title: 'API账户管理', icon: 'setting', perm: 'api-account-config'},
        children: [
          {
            path: '/api/account',
            component: () => import('./components/account/org/account.vue'),
            meta: {moduleId: 'api', title: 'API账户管理', perm: 'api-account-manager'}
          },
          {
            path: '/api/role',
            component: () => import('./components/account/role/role.vue'),
            meta: {moduleId: 'api', title: '接口角色管理', perm: 'api-user-role-manager'}
          }
        ]
      },
      {
        path: '/permission',
        component: () => import('./components/system/index.vue'),
        meta: {moduleId: 'permission', title: '系统设置', icon: 'setting', perm: 'system-config'},
        children: [
          {
            path: '/permission/account',
            component: () => import('./components/system/account/list.vue'),
            meta: {moduleId: 'permission', title: '单位用户管理', perm: 'mdm-org-user-manager'}
          },
          {
            path: '/permission/role',
            component: () => import('./components/system/role/role.vue'),
            meta: {moduleId: 'permission', title: '角色管理', perm: 'access-role-watch'}
          }
        ]
      },
      {
        path: '/request-log',
        component: () => import('./components/request-log/list.vue'),
        meta: {moduleId: 'request-log', title: '请求日志', icon: 'basic', perm: 'openapi-request-log'},
        children: []
      },
      {
        path: '/api/swagger-ui.html#/',
        meta: {moduleId: 'openapi-word', title: '文档地址', icon: 'wave', perm: 'show', isLink: true},
        children: []
      }
    ]
  },
  {path: '/resetpsw', component: () => import('./components/login/resetpsw.vue')},
  {path: '/404', component: () => import('./components/error/error_404.vue')},
  {path: '/500', component: () => import('./components/error/error_500.vue')},
  {path: '/login', component: () => import('./components/login/login.vue')},
  {path: '/forget', component: () => import('./components/login/forget.vue')},
  {path: '/code/:id', component: () => import('./components/login/resetpwd.vue')},
  {path: '*', redirect: '/'}
];

//  不需要鉴权的路径
// const permissive = ['/login', '/404', '/500'];

const router = new VueRouter({
  //  mode: 'history',
  routes: routes,
  base: '/'
});

router.beforeEach((to, from, next) => {
  return next();
});

export default router;
