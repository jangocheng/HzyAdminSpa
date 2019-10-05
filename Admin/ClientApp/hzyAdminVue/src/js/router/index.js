import Vue from 'vue'
import VueRouter from 'vue-router'
//
import { Loading } from 'element-ui';
//
import Main from '../../views/Main';
import Login from '../../views/Login';
//
Vue.use(VueRouter);
//检查权限
var checkRouter = function(to, next) {
    //判断权限
    var _menuId = to['meta']['menuId'];
    var _powerState = global.$powerAll.find(w => w.MenuID == _menuId);
    if (!_powerState || !_powerState.Have) {
        global.tools.msg('权限不足!', '错误');
        return next({ path: "/Login" });
    }
    //添加选项卡
    global.$store.commit('app/addOrCheckedTab', {
        title: to['meta']['title'],
        name: to.name,
        active: true
    });
    global.$power = _powerState;
    return next();
};

// const routers = [{
//         path: '/',
//         component: Main,
//         children: [{
//             path: '/Home',
//             name: "/Home",
//             component: Home,
//             meta: { title: '首页' },
//         }, {
//             path: '/Sys/User',
//             name: '/Sys/User',
//             component: User,
//             meta: { title: '用户管理1' },
//         }, {
//             path: '/Sys/Role',
//             name: '/Sys/Role',
//             component: Role,
//             meta: { title: '角色管理' },
//         }]
//     },
//     { path: '/Login', name: '/Login', component: Login },
//     { path: '*', redirect: "/Home" }
// ];

//动态获取 组件
function loadViews(path) {
    return () =>
        import (`@/views${path}.vue`);
}

const vueRouter = new VueRouter({
    //mode: 'history',
    routes: [
        { path: '/Login', name: '/Login', component: Login }
    ]
});

let _loading = null;
//路由拦截器
vueRouter.beforeEach((to, from, next) => {
    //console.log('路由拦截器 from=', from, 'to=', to);

    if (to.path == '/Login') return next();

    //检查是否登录授权
    if (!global.tools.getCookie('Authorization')) return next({ path: "/Login" });

    //_loading = Loading.service({ fullscreen: true });

    //获取后台菜单数据 然后动态添加路由
    if (global.$menu.length == 0) {
        global.$store.dispatch('app/getMenus', (data) => {
            var _allList = data.allList;
            var _list = data.list;
            var _powerAll = data.powerState;
            //路由组装
            var _children = [];
            for (var i = 0; i < _allList.length; i++) {
                var _menu = _allList[i];
                if (!_menu.Menu_Url) continue;
                var _item = _children.find(w => w.path == _menu.Menu_Url);
                if (_item) continue;
                _children.push({
                    path: _menu.Menu_Url,
                    name: _menu.Menu_Url,
                    component: loadViews(_menu.Menu_Url),
                    meta: { title: _menu.Menu_Name, menuId: _menu.Menu_ID },
                });
            }
            //
            var _router = [{
                    path: '/',
                    component: Main,
                    children: _children
                },
                { path: '*', redirect: "/" }
            ];
            vueRouter.addRoutes(_router);
            global.$store.commit('app/setRouterConfig', vueRouter.options.routes);
            //
            if (to.meta.hasOwnProperty('title'))
                return checkRouter(to, next);
            return next();
        });
    }
    //
    if (to.meta.hasOwnProperty('title'))
        return checkRouter(to, next);
    return next();
});
vueRouter.afterEach(to => {
    if (_loading) _loading.close();
});

export default vueRouter;