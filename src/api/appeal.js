import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/appeal/getAppealList',
    method:'get',
    params:params
  })
}

export function deleteAppeal(appealId) {
  return request({
    url:'/appeal/deleteAppeal' + appealId,
    method:'post',
    params:params
  })
}
export function updateApplyStatus(id,data) {
  return request({
    url:'/appeal/update/status/'+id,
    method:'post',
    data:data
  })
}
export function batchDeleteApply(data) {
  return request({
    url:'/appeal/deleteAppealBatch',
    method:'post',
    data:data
  })
}
export function getApplyDetail(id) {
  return request({
    url:'/appeal/'+id,
    method:'get'
  })
}
