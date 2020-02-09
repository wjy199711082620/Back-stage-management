import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/product/getProductList',
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
    url:'/product/deleteProduct',
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
    url:'/product/updateIsOnSale',
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


export function createProduct(data) {
  return request({
    url:'/product/addProduct',
    method:'post',
    data:data
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
export function getProductName(id) {
  return request({
    url:'/product/getProductName/'+id,
    method:'get',
  })
}

