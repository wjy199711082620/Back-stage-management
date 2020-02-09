import router from './router'
import {aysncRouterMap,constantRouterMap} from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

var getRouter=false;

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();

if (localStorage.hasOwnProperty('WMuserInfo')) {//登陆后取得getToken后获得登录状态
   next();
      if(!getRouter){
          if (store.getters.roles===2||store.getters.roles===1||store.getters.roles===3) {
           store.dispatch('GenerateRoutes',constantRouterMap.concat(aysncRouterMap)).then(res=>{//添加管理员权限
            getRouter=true;
            next({ ...to, replace: true })
           })

            // store.dispatch('GenerateRoutes').then(res => {// 访问的路由表
            //   router.addRoutes(aysncRouterMap)
            //  next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            // }).catch((err) => {
            //   store.dispatch('FedLogOut').then(() => {
            //     console.log('err')
            //     Message.error(err || 'Verification failed, please login again')
            //     next({ path: '/' })
            //   })
            // })
          } else {//
            store.dispatch('GenerateRoutes',aysncRouterMap).then(res=>{
              console.log(res);
            })
            next()
          }


      }

  }else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})


