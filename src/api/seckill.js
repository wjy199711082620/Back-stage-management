import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/seckill/getSeckillList',
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
export function deleteHomeAdvertise(data) {
  return request({
    url:'/home/advertise/delete',
    method:'post',
    data:data
  })
}
export function createHomeAdvertise(data) {
  return request({
    url:'/site/addSite',
    method:'post',
    data:data,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}

export function getSite(siteId) {
  return request({
    url:'/site/getSiteById/'+siteId,
    method:'get',
  })
}

export function updateSite(siteId,data) {
  return request({
    url:'/site/modifySite/'+siteId,
    method:'put',
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
