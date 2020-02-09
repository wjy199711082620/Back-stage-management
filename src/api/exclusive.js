import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/exclusive/getExclusiveList',
    method:'get',
    params:params
  })
}
export function updateStatus(id,params) {
  return request({
    url:'/home/advertise/update/status/'+id,
    method:'post',
    params:params
  })
}
export function deleteExclusive(exclusiveId) {
  return request({
    url:'/exclusive/deleteExclusive/' + exclusiveId,
    method:'post',
  })
}
export function addExclusive(data) {
  return request({
    url:'/exclusive/addExclusive',
    method:'post',
    params:data,
  })
}
export function importExclusive(data) {
  return request({
    url:'/exclusive/importExclusive',
    method:'post',
    data:data,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}
export function getExclusive(params) {
  return request({
    url:'/exclusive/getExclusiveById',
    method:'get',
    params:params
  })
}

export function updateExclusive(exclusiveId,data) {
  return request({
    url:'/exclusive/modifyExclusive/'+exclusiveId,
    method:'get',
    params:data
  })
}

export function getCityList(params) {
  return request({
    url:'/city/getCityList/',
    method:'get',
    params:params
  })
}
//通过productId批量添加 变成会员专属商品

export function batchAdd(params) {
  const qs=require('qs');
  return request({
    url:'/exclusive/batchAdd?'+qs.stringify(params, { arrayFormat: 'repeat' }),
    method:'get'
  })
}