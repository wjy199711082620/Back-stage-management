import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

export const constantRouterMap = [//主办方没有的权限    展示在sidebar上的路由权限

  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  },
  {
    path: '/sms',
    component: Layout,
    redirect: '/sms/admin',
    name: 'sms',
    meta: {title: '系统', icon: 'order-setting '},
    children: [

      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/sms/admin/index'),
        meta: {title: '管理员列表', icon: 'sms-hot'}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/sms/role/index'),
        meta: {title: '角色列表', icon: 'sms-subject'}
      },
      {
        path: 'authority',
        name: 'authority',
        component: () => import('@/views/sms/authority/index'),
        meta: {title: '权限列表', icon: 'sms-ad'}
      }
    ]
  },
  {
    path:'/cms',
    component: Layout,
    redirect: '/cms/advertise',
    name: 'cms',
    meta: {title: '运营', icon: 'product-comment'},
    children: [

      {
        path: 'advertise',
        name: 'homeAdvertise',
        component: () => import('@/views/cms/advertise/index'),
        meta: {title: '广告列表', icon: 'sms-ad'}
      },
      {
        path: 'report',
        name: 'report',
        component: () => import('@/views/cms/report/index'),
        meta: {title: '举报列表', icon: 'form'}
      },
      {
        path: 'feedback',
        name: 'feedback',
        component: () => import('@/views/cms/feedback/index'),
        meta: {title: '反馈列表', icon: 'sms-subject'}
      },
      {
        path: 'addAdvertise',
        name: 'addHomeAdvertise',
        component: () => import('@/views/oms/advertise/add'),
        meta: {title: '添加广告'},
        hidden:true
      },
      {
        path: 'updateAdvertise',
        name: 'updateHomeAdvertise',
        component: () => import('@/views/oms/advertise/update'),
        meta: {title: '编辑广告'},
        hidden:true
      }
    ]
  },
  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/user',
    name: 'ums',
    meta: {title: '活动', icon: 'sms'},
    children: [
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('@/views/ums/coupon/index'),
        meta: {title: '优惠券列表', icon: 'sms-coupon'}
      },
      {
        path: 'addCoupon',
        name: 'addCoupon',
        component: () => import('@/views/ums/coupon/add'),
        meta: {title: '添加优惠券'},
        hidden:true
      },
      {
        path: 'updateCoupon',
        name: 'updateCoupon',
        component: () => import('@/views/ums/coupon/update'),
        meta: {title: '修改优惠券'},
        hidden:true
      },
      {
        path: 'recommend',
        name: 'recommend',
        component: () => import ('@/views/ums/recommend/index'),
        meta: {title: '首页推荐列表', icon: 'sms-hot'}
      },

      {
        path: 'top',
        name: 'top',
        component: () => import ('@/views/ums/top/index'),
        meta: {title: '首页榜单列表', icon: 'sms-hot'}
      },

      {
        path: 'seckill',
        name: 'seckill',
        component: () => import ('@/views/ums/seckill/index'),
        meta: {title: '限时抢购列表', icon: 'sms-flash'}
      },
      {
        path: 'groupon',
        name: 'groupon',
        component: () => import ('@/views/ums/groupon/index'),
        meta: {title: '团购列表', icon: 'example'}
      },
            {
        path: 'addGroupon',
        name: 'addGroupon',
        component: () => import('@/views/ums/groupon/add'),
        meta: {title: '添加拼团'},
        hidden:true
      },
      {
        path: 'updateGroupon',
        name: 'updateGroupon',
        component: () => import('@/views/ums/groupon/update'),
        meta: {title: '修改拼团'},
        hidden:true
      },
      {
        path: 'grouponRule',
        name: 'grouponRule',
        component: () => import ('@/views/ums/grouponRule/index'),
        meta: {title: '团购规则列表', icon: 'example'}
      },
      {
        path: 'addGrouponRule',
        name: 'addGrouponRule',
        component: () => import ('@/views/ums/grouponRule/add'),
        meta: {title: '添加团购规则', icon: 'example'},
        hidden: true
      },
      {
        path: 'updateGrouponRule',
        name: 'updateGrouponRule',
        component: () => import ('@/views/ums/grouponRule/update'),
        meta: {title: '更新团购规则', icon: 'example'},
        hidden: true
      },
       {
        path: 'exclusive',
        name: 'exclusive',
        component: () => import ('@/views/ums/exclusive/index'),
        meta: {title: '会员专属列表', icon: 'example'}
      },
      {
        path: 'addExclusive',
        name: 'addExclusive',
        component: () => import ('@/views/ums/exclusive/add'),
        meta: {title: '添加会员专属', icon: 'example'},
        hidden: true
      },
      {
        path: 'updateExclusive',
        name: 'updateExclusive',
        component: () => import ('@/views/ums/exclusive/update'),
        meta: {title: '更新会员专属', icon: 'example'},
        hidden: true
      },
    ]
  },

  {
    path: '/scms',
    component: Layout,
    redirect: '/scms/group',
    name: 'scms',
    meta: {title: '统计', icon: 'total-week'},
    children: [
      {
        path: 'balance',
        name: 'balance',
        component: () => import('@/views/scms/balance/index'),
        meta: {title: '对账列表', icon: 'product-list'}
      },
      {
        path: 'deal',
        name: 'deal',
        component: () => import('@/views/scms/deal/index'),
        meta: {title: '交易列表', icon: 'sms-coupon'}
      },


    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/technology',
    name: 'wms',
    meta: {title: '技术人员', icon: 'order'},
    children: [
      {
        path: 'technology',
        name: 'technology',
        component: () => import('@/views/wms/technology/index'),
        meta: {title: '技术人员列表', icon: 'product-list'}
      },
      {
        path: 'technologyDetail',
        name: 'technologyDetail',
        component: () => import('@/views/wms/technology/update'),
        meta: {title: '技术人员详情', icon: 'order-return'},
        hidden: true
      }

    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/technologyType',
    name: 'wms',
    meta: {title: '技术人员类型', icon: 'order'},
    children: [
      {
        path: 'technologyType',
        name: 'technologyType',
        component: () => import('@/views/wms/technologyType/index'),
        meta: {title: '技术人员类型列表', icon: 'product-list'}
      },
      {
        path: 'technologyTypeDetail',
        name: 'technologyTypeDetail',
        component: () => import('@/views/wms/technologyType/update'),
        meta: {title: '技术人员类型详情', icon: 'product-list'},
        hidden: true
      }
    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/company',
    name: 'wms',
    meta: {title: '主办方', icon: 'order'},
    children: [
      {
        path: 'company',
        name: 'company',
        component: () => import('@/views/wms/company/index'),
        meta: {title: '主办方列表', icon: 'product-list'}
      },
      {
        path: 'companyDetail',
        name: 'companyDetail',
        component: () => import('@/views/wms/company/update'),
        meta: {title: '主办方详情', icon: 'order-return'},
        hidden: true
      }

    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/merchant',
    name: 'merchant',
    meta: {title: '店铺信息', icon: 'order'},
    children: [
      {
        path: 'merchant',
        name: 'merchant',
        component: () => import('@/views/wms/merchant/index'),
        meta: {title: '店铺列表', icon: 'product-list'}
      },
      {
        path: 'merchantDetail',
        name: 'merchantDetail',
        component: () => import('@/views/wms/merchant/update'),
        meta: {title: '店铺详情', icon: 'order-return'},
        hidden: true
      },
      {
        path: 'addMerchant',
        name: 'addMerchant',
        component: () => import('@/views/wms/merchant/addMerchant'),
        meta: {title: '添加店铺', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'addCoupon',
        name: 'addCoupon',
        component: () => import('@/views/wms/coupon/addCoupon'),
        meta: {title: '添加店铺优惠券', icon: 'product-add'},
        hidden: true
      }

    ]
  },
  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    name: 'pms',
    meta: {title: '商品', icon: 'product', roles: ['admin']},
    children: [

      {
        path: 'product',
        name: 'product',
        component: () => import('@/views/pms/product/index'),
        meta: {title: '商品列表', icon: 'product-list'}
      },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: () => import('@/views/pms/product/add'),
        meta: {title: '添加商品', icon: 'product-add'}
      },
      {
        path: 'updateProduct',
        name: 'updateProduct',
        component: () => import('@/views/pms/product/update'),
        meta: {title: '修改商品', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'productType',
        name: 'productType',
        component: () => import('@/views/pms/productType/index'),
        meta: {title: '商品类型', icon: 'product-cate'}
      } ,
      {
        path: 'brand',
        name: 'brand',
        component: () => import('@/views/pms/brand/index'),
        meta: {title: '品牌列表', icon: 'product-cate'}
      },
      {
        path: 'addProductAttr',
        name: 'addProductAttr',
        component: () => import('@/views/pms/productAttr/addProductAttr'),
        meta: {title: '添加商品属性'},
        hidden: true
      },
      {
        path: 'updateProductAttr',
        name: 'updateProductAttr',
        component: () => import('@/views/pms/productAttr/updateProductAttr'),
        meta: {title: '修改商品属性'},
        hidden: true
      },
      {
        path: 'purchaseRule',
        name: 'purchaseRule',
        component: () => import('@/views/pms/purchaseRule/index'),
        meta: {title: '进货规则列表' ,icon: 'order-setting'},
      },
      {
        path: 'purchase',
        name: 'purchase',
        component: () => import('@/views/pms/purchase/index'),
        meta: {title: '进货列表', icon: 'order-return-reason'}
      },
      {
        path: 'addPurchase',
        name: 'addPurchase',
        component: () => import('@/views/pms/purchase/add'),
        meta: {title: '添加进货', icon: 'order-return-reason'},
        hidden:true
      }
    ]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    name: 'oms',
    meta: {title: '订单', icon: 'order'},
    children: [
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/oms/order/index'),
        meta: {title: '订单列表', icon: 'product-list'}
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/oms/order/orderDetail'),
        meta: {title: '订单详情'},
        hidden:true
      },
      {
        path: 'deliverOrderList',
        name: 'deliverOrderList',
        component: () => import('@/views/oms/order/deliverOrderList'),
        meta: {title: '发货列表'},
        hidden:true
      },
      {
        path: 'orderSetting',
        name: 'orderSetting',
        component: () => import('@/views/oms/order/setting'),
        meta: {title: '订单设置', icon: 'order-setting'}
      },
      {
        path: 'appeal',
        name: 'appeal',
        component: () => import('@/views/oms/appeal/index'),
        meta: {title: '申诉列表', icon: 'order-return'}
      }

    ]
  },
  //暂时先不给主办方展示
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/activity',
    name: 'activity',
    meta: {title: '活动信息', icon: 'order'},
    hidden: true,
    children: [
      {
        path: 'activityList',
        name: 'activityList',
        component: () => import('@/views/wms/activity/index'),
        meta: {title: '活动信息', icon: 'product-list'},
        hidden: true
      },      {
        path: 'addActivity',
        name: 'addActivity',
        component: () => import('@/views/wms/activity/add'),
        meta: {title: '活动信息', icon: 'product-add'},
        hidden: true
      },      {
        path: 'updateActivity',
        name: 'updateActivity',
        component: () => import('@/views/wms/activity/update'),
        meta: {title: '活动信息', icon: 'product-update'},
        hidden: true
      },
    ]
  },


]

export  const  aysncRouterMap=[//如果是主办方 sideBar上添加路由权限 加了商品列表，订单列表，活动信息，严选租赁，优惠券


  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/commodity',
    name: 'wms',
    meta: {title: '严选租赁', icon: 'product'},
    children: [

      {
        path: 'commodity',
        name: 'commodity',
        component: () => import('@/views/wms/commodity/index'),
        meta: {title: '严选租赁商品列表', icon: 'product-list'}
      },
      {
        path: 'addCommodity',
        name: 'addCommodity',
        component: () => import('@/views/wms/commodity/add'),
        meta: {title: '添加严选商品', icon: 'product-add'}
      },
      {
        path: 'updateCommodity',
        name: 'updateCommodity',
        component: () => import('@/views/wms/commodity/update'),
        meta: {title: '修改严选商品', icon: 'product-add'},
        hidden: true
      }
    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/coupon',
    name: 'coupon',
    meta: {title: '优惠券', icon: 'product'},
    hidden: true,
    children: [

      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('@/views/wms/coupon/index'),
        meta: {title: '店铺优惠券列表', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'updateCoupon',
        name: 'updateCoupon',
        component: () => import('@/views/wms/coupon/update'),
        meta: {title: '店铺优惠券列表', icon: 'product-list'},
        hidden: true
      }
    ]
  },
   {path: '*', redirect: '/404', hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true}
]

 const actuallyRouterMap = [//公用路由权限（暂时也是主办方的权限）
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  },
  {
    path: '/sms',
    component: Layout,
    redirect: '/sms/admin',
    name: 'sms',
    meta: {title: '系统', icon: 'order-setting '},
    children: [

      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/sms/admin/index'),
        meta: {title: '管理员列表', icon: 'sms-hot'}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/sms/role/index'),
        meta: {title: '角色列表', icon: 'sms-subject'}
      },
      {
        path: 'authority',
        name: 'authority',
        component: () => import('@/views/sms/authority/index'),
        meta: {title: '权限列表', icon: 'sms-ad'}
      }
    ]
  },
  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    name: 'pms',
    meta: {title: '商品', icon: 'product', roles: ['admin']},
    children: [

      {
        path: 'product',
        name: 'product',
        component: () => import('@/views/pms/product/index'),
        meta: {title: '商品列表', icon: 'product-list'}
      },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: () => import('@/views/pms/product/add'),
        meta: {title: '添加商品', icon: 'product-add'}
      },
      {
        path: 'updateProduct',
        name: 'updateProduct',
        component: () => import('@/views/pms/product/update'),
        meta: {title: '修改商品', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'productType',
        name: 'productType',
        component: () => import('@/views/pms/productType/index'),
        meta: {title: '商品类型', icon: 'product-cate'}
      } ,
      {
        path: 'brand',
        name: 'brand',
        component: () => import('@/views/pms/brand/index'),
        meta: {title: '品牌列表', icon: 'product-cate'}
      },
      {
        path: 'addProductAttr',
        name: 'addProductAttr',
        component: () => import('@/views/pms/productAttr/addProductAttr'),
        meta: {title: '添加商品属性'},
        hidden: true
      },
      {
        path: 'updateProductAttr',
        name: 'updateProductAttr',
        component: () => import('@/views/pms/productAttr/updateProductAttr'),
        meta: {title: '修改商品属性'},
        hidden: true
      },
      {
        path: 'purchaseRule',
        name: 'purchaseRule',
        component: () => import('@/views/pms/purchaseRule/index'),
        meta: {title: '进货规则列表' ,icon: 'order-setting'},
      },
      {
        path: 'purchase',
        name: 'purchase',
        component: () => import('@/views/pms/purchase/index'),
        meta: {title: '进货列表', icon: 'order-return-reason'}
      },
      {
        path: 'addPurchase',
        name: 'addPurchase',
        component: () => import('@/views/pms/purchase/add'),
        meta: {title: '添加进货', icon: 'order-return-reason'},
        hidden:true
      }
    ]
  },
  {
    path:'/cms',
    component: Layout,
    redirect: '/cms/advertise',
    name: 'cms',
    meta: {title: '运营', icon: 'product-comment'},
    children: [

      {
        path: 'advertise',
        name: 'homeAdvertise',
        component: () => import('@/views/cms/advertise/index'),
        meta: {title: '广告列表', icon: 'sms-ad'}
      },
      {
        path: 'report',
        name: 'report',
        component: () => import('@/views/cms/report/index'),
        meta: {title: '举报列表', icon: 'form'}
      },
      {
        path: 'feedback',
        name: 'feedback',
        component: () => import('@/views/cms/feedback/index'),
        meta: {title: '反馈列表', icon: 'sms-subject'}
      },
      {
        path: 'addAdvertise',
        name: 'addHomeAdvertise',
        component: () => import('@/views/oms/advertise/add'),
        meta: {title: '添加广告'},
        hidden:true
      },
      {
        path: 'updateAdvertise',
        name: 'updateHomeAdvertise',
        component: () => import('@/views/oms/advertise/update'),
        meta: {title: '编辑广告'},
        hidden:true
      }
    ]
  },
  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/user',
    name: 'ums',
    meta: {title: '活动', icon: 'sms'},
    children: [
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('@/views/ums/coupon/index'),
        meta: {title: '优惠券列表', icon: 'sms-coupon'}
      },
      {
        path: 'addCoupon',
        name: 'addCoupon',
        component: () => import('@/views/ums/coupon/add'),
        meta: {title: '添加优惠券'},
        hidden:true
      },
      {
        path: 'updateCoupon',
        name: 'updateCoupon',
        component: () => import('@/views/ums/coupon/update'),
        meta: {title: '修改优惠券'},
        hidden:true
      },
      {
        path: 'recommend',
        name: 'recommend',
        component: () => import ('@/views/ums/recommend/index'),
        meta: {title: '首页推荐列表', icon: 'sms-hot'}
      },

      {
        path: 'top',
        name: 'top',
        component: () => import ('@/views/ums/top/index'),
        meta: {title: '首页榜单列表', icon: 'sms-hot'}
      },

      {
        path: 'seckill',
        name: 'seckill',
        component: () => import ('@/views/ums/seckill/index'),
        meta: {title: '限时抢购列表', icon: 'sms-flash'}
      },
      {
        path: 'groupon',
        name: 'groupon',
        component: () => import ('@/views/ums/groupon/index'),
        meta: {title: '团购列表', icon: 'example'}
      },
            {
        path: 'addGroupon',
        name: 'addGroupon',
        component: () => import('@/views/ums/groupon/add'),
        meta: {title: '添加拼团'},
        hidden:true
      },
      {
        path: 'updateGroupon',
        name: 'updateGroupon',
        component: () => import('@/views/ums/groupon/update'),
        meta: {title: '修改拼团'},
        hidden:true
      },
      {
        path: 'grouponRule',
        name: 'grouponRule',
        component: () => import ('@/views/ums/grouponRule/index'),
        meta: {title: '团购规则列表', icon: 'example'}
      },
      {
        path: 'addGrouponRule',
        name: 'addGrouponRule',
        component: () => import ('@/views/ums/grouponRule/add'),
        meta: {title: '添加团购规则', icon: 'example'},
        hidden: true
      },
      {
        path: 'updateGrouponRule',
        name: 'updateGrouponRule',
        component: () => import ('@/views/ums/grouponRule/update'),
        meta: {title: '更新团购规则', icon: 'example'},
        hidden: true
      },
       {
        path: 'exclusive',
        name: 'exclusive',
        component: () => import ('@/views/ums/exclusive/index'),
        meta: {title: '会员专属列表', icon: 'example'}
      },
      {
        path: 'addExclusive',
        name: 'addExclusive',
        component: () => import ('@/views/ums/exclusive/add'),
        meta: {title: '添加会员专属', icon: 'example'},
        hidden: true
      },
      {
        path: 'updateExclusive',
        name: 'updateExclusive',
        component: () => import ('@/views/ums/exclusive/update'),
        meta: {title: '更新会员专属', icon: 'example'},
        hidden: true
      },
    ]
  },

  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    name: 'oms',
    meta: {title: '订单', icon: 'order'},
    children: [
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/oms/order/index'),
        meta: {title: '订单列表', icon: 'product-list'}
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/oms/order/orderDetail'),
        meta: {title: '订单详情'},
        hidden:true
      },
      {
        path: 'deliverOrderList',
        name: 'deliverOrderList',
        component: () => import('@/views/oms/order/deliverOrderList'),
        meta: {title: '发货列表'},
        hidden:true
      },
      {
        path: 'orderSetting',
        name: 'orderSetting',
        component: () => import('@/views/oms/order/setting'),
        meta: {title: '订单设置', icon: 'order-setting'}
      },
      {
        path: 'appeal',
        name: 'appeal',
        component: () => import('@/views/oms/appeal/index'),
        meta: {title: '申诉列表', icon: 'order-return'}
      }

    ]
  },
  {
    path: '/scms',
    component: Layout,
    redirect: '/scms/group',
    name: 'scms',
    meta: {title: '统计', icon: 'total-week'},
    children: [
      {
        path: 'balance',
        name: 'balance',
        component: () => import('@/views/scms/balance/index'),
        meta: {title: '对账列表', icon: 'product-list'}
      },
      {
        path: 'deal',
        name: 'deal',
        component: () => import('@/views/scms/deal/index'),
        meta: {title: '交易列表', icon: 'sms-coupon'}
      },


    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/technology',
    name: 'wms',
    meta: {title: '技术人员', icon: 'order'},
    children: [
      {
        path: 'technology',
        name: 'technology',
        component: () => import('@/views/wms/technology/index'),
        meta: {title: '技术人员列表', icon: 'product-list'}
      },
      {
        path: 'technologyDetail',
        name: 'technologyDetail',
        component: () => import('@/views/wms/technology/update'),
        meta: {title: '技术人员详情', icon: 'order-return'},
        hidden: true
      }

    ]
  },
   {
     path: '/wms',
     component: Layout,
     redirect: '/wms/technologyType',
     name: 'wms',
     meta: {title: '技术人员类型', icon: 'order'},
     children: [
       {
         path: 'technologyType',
         name: 'technologyType',
         component: () => import('@/views/wms/technologyType/index'),
         meta: {title: '技术人员类型列表', icon: 'product-list'}
       },
       {
         path: 'technologyTypeDetail',
         name: 'technologyTypeDetail',
         component: () => import('@/views/wms/technologyType/update'),
         meta: {title: '技术人员类型详情', icon: 'product-list'},
         hidden: true
       }
     ]
   },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/company',
    name: 'wms',
    meta: {title: '主办方', icon: 'order'},
    children: [
      {
        path: 'company',
        name: 'company',
        component: () => import('@/views/wms/company/index'),
        meta: {title: '主办方列表', icon: 'product-list'}
      },
      {
        path: 'companyDetail',
        name: 'companyDetail',
        component: () => import('@/views/wms/company/update'),
        meta: {title: '主办方详情', icon: 'order-return'},
        hidden: true
      }

    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/merchant',
    name: 'merchant',
    meta: {title: '店铺信息', icon: 'order'},
    children: [
      {
        path: 'merchant',
        name: 'merchant',
        component: () => import('@/views/wms/merchant/index'),
        meta: {title: '店铺列表', icon: 'product-list'}
      },
      {
        path: 'merchantDetail',
        name: 'merchantDetail',
        component: () => import('@/views/wms/merchant/update'),
        meta: {title: '店铺详情', icon: 'order-return'},
        hidden: true
      },
      {
        path: 'addMerchant',
        name: 'addMerchant',
        component: () => import('@/views/wms/merchant/addMerchant'),
        meta: {title: '添加店铺', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'addCoupon',
        name: 'addCoupon',
        component: () => import('@/views/wms/coupon/addCoupon'),
        meta: {title: '添加店铺优惠券', icon: 'product-add'},
        hidden: true
      }

    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/activity',
    name: 'activity',
    meta: {title: '活动信息', icon: 'order'},
    hidden: true,
    children: [
      {
        path: 'activityList',
        name: 'activityList',
        component: () => import('@/views/wms/activity/index'),
        meta: {title: '活动信息', icon: 'product-list'},
        hidden: true
      },      {
        path: 'addActivity',
        name: 'addActivity',
        component: () => import('@/views/wms/activity/add'),
        meta: {title: '活动信息', icon: 'product-add'},
        hidden: true
      },      {
        path: 'updateActivity',
        name: 'updateActivity',
        component: () => import('@/views/wms/activity/update'),
        meta: {title: '活动信息', icon: 'product-update'},
        hidden: true
      },
    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/commodity',
    name: 'wms',
    meta: {title: '严选租赁', icon: 'product'},
    children: [

      {
        path: 'commodity',
        name: 'commodity',
        component: () => import('@/views/wms/commodity/index'),
        meta: {title: '严选租赁商品列表', icon: 'product-list'}
      },
      {
        path: 'addCommodity',
        name: 'addCommodity',
        component: () => import('@/views/wms/commodity/add'),
        meta: {title: '添加严选商品', icon: 'product-add'}
      },
      {
        path: 'updateCommodity',
        name: 'updateCommodity',
        component: () => import('@/views/wms/commodity/update'),
        meta: {title: '修改严选商品', icon: 'product-add'},
        hidden: true
      }
    ]
  },
  {
    path: '/wms',
    component: Layout,
    redirect: '/wms/coupon',
    name: 'coupon',
    meta: {title: '优惠券', icon: 'product'},
    hidden: true,
    children: [

      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('@/views/wms/coupon/index'),
        meta: {title: '店铺优惠券列表', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'updateCoupon',
        name: 'updateCoupon',
        component: () => import('@/views/wms/coupon/update'),
        meta: {title: '店铺优惠券列表', icon: 'product-list'},
        hidden: true
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: actuallyRouterMap
})
