import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/report/getReportList',
    method:'get',
    params:params
  })
}

export function updateRecommendStatus(data) {
  return request({
    url:'/home/recommendProduct/update/recommendStatus',
    method:'post',
    data:data
  })
}

export function deleteHotProduct(data) {
  return request({
    url:'/report/batchDelete',
    method:'post',
    data:data
  })
}

export function createHotProduct(data) {
  return request({
    url:'/home/recommendProduct/create',
    method:'post',
    data:data
  })
}

export function updateHotProductSort(params) {
  return request({
    url:'/report/modifyReport/'+params.reportId,
    method:'put',
    params:params
  })
}
