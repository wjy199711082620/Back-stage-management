import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/productType/getProductTypeList',
    method:'get',
    params:params
  })
}
export function updateStatus(id,params) {
  return request({
    url:'/flash/update/status/'+id,
    method:'post',
    data:params
  })
}
export function deleteFlash(typeId) {
  return request({
    url:'/productType/deleteProductType/'+typeId,
    method:'post'
  })
}
export function createFlash(params) {
  return request({
    url:'/productType/addProductType',
    method:'post',
    data:params,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}
export function updateFlash(typeId,params) {
  return request({
    url:'/productType/modifyProductType/'+typeId,
    method:'post',
    data:params
  })
}
export function fetchListWithChildren() {
  return request({
    url: '/productType/all',
    method: 'get'
  })
}
