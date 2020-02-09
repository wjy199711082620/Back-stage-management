import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/commodity/getCommodityList',
    method:'get',
    params:params
  })
}

export function fetchSimpleList(params) {
  return request({
      url:'/product/simpleList',
    method:'get',
    params:params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url:'/commodity/deleteCommodity',
    method:'post',
    params:params
  })
}

export function updateNewStatus(params) {
  return request({
    url:'/product/updateIsScoreProduct',
    method:'post',
    params:params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url:'/product/update/recommendStatus',
    method:'post',
    params:params
  })
}


export function batchUpdateRecommendStatus(params) {
  return request({
    url:'/recommend/batchAddRecommend',
    method:'post',
    params:params
  })
}
export function batchDeleteRecommendStatus(params) {
  return request({
    url:'/recommend/batchDeleteRecommendByProductId',
    method:'post',
    params:params
  })
}

export function updatePublishStatus(params) {
  return request({
    url:'/commodity/modifyCommodityRecommend',
    method:'post',
    params:params
  })
}
export function updateCommodityRecommendStatus(params) {
  return request({
    url:'/commodity/modifyCommodityRecommend',
    method:'post',
    params:params
  })
}
export function updateCommodityActivated(params) {
  return request({
    url:'/commodity/modifyCommodityStatus',
    method:'post',
    params:params
  })
}
export function batchUpdatePublishStatus(params) {
  return request({
    url:'/product/batchUpdateIsOnSale',
    method:'post',
    params:params
  })
}


export function batchDelete(params) {
  return request({
    url:'/product/deleteProductBatch',
    method:'post',
    params:params
  })
}


export function createCommodity(data) {
  return request({
    url: '/commodity/addCommodity',
    method: 'post',
    data: data
  })
}

export function updateProduct(id,data) {
  return request({
    url:'/product/modifyProduct/'+id,
    method:'post',
    data:data
  })
}
export function getProduct(id) {
  return request({
    url:'/product/getProductById/'+id,
    method:'get',
  })
}
export function getCommodity(data) {
  return request({
    url:'/commodity/getCommodityById/',
    method:'get',
    params:data
  })
}
export function updateCommodity(data) {
  return request({
    url:'/commodity/modifyCommodity',
    method:'post',
    params:data
  })
}

