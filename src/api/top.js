import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/top/getTopList',
    method:'get',
    params:params
  })
}

export function updateRecommendStatus(data) {
  return request({
    url:'/top/batchUpdateRecommendStatus',
    method:'post',
    data:data
  })
}

export function deleteGroupon(data) {
  return request({
    url:'/top/deleteTop',
    method:'post',
    data:data
  })
}

export function createGroupon(data) {
  return request({
    url:'/top/batchAdd',
    method:'post',
    data:data
  })
}

export function updateGrouponSort(params) {
  return request({
    url:'/top/updateSort/'+params.id,
    method:'post',
    params:params
  })
}
