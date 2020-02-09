import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/brand/getBrandList',
    method:'get',
    params:params
  })
}
export function createBrand(data) {
  return request({
    url:'/brand/addBrand',
    method:'post',
    data:data,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}
export function updateShowStatus(data) {
  return request({
    url:'/brand/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateFactoryStatus(data) {
  return request({
    url:'/brand/update/factoryStatus',
    method:'post',
    data:data
  })
}

export function deleteBrand(id) {
  return request({
    url:'/brand/deleteBrand/'+id,
    method:'get',
  })
}

export function getBrand(id) {
  return request({
    url:'/brand/'+id,
    method:'get',
  })
}

export function updateBrand(id,data) {
  return request({
    url:'/brand/modifyBrand/'+id,
    method:'post',
    data:data,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}

