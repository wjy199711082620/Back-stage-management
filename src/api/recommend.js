import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/recommend/getRecommendList',
    method:'get',
    params:params
  })
}

export function updateStatus(data) {
  return request({
    url:'/recommend/modifyStatus',
    method:'post',
    data:data
  })
}

export function deleteRecommend(data) {
  return request({
    url:'/recommend/deleteRecommend',
    method:'post',
    data:data
  })
}

export function createRecommend(params) {
  return request({
    url:'/recommend/addRecommend',
    method:'post',
    params:params
  })
}

export function updateRecommend(recommendId,params) {
  return request({
    url:'/recommend/modifyStatus',
    method:'post',
    params:params
  })
}
