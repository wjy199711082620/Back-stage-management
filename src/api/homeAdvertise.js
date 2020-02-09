import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/banner/getBannerList',
    method:'get',
    params:params
  })
}
export function updateStatus(id,params) {
  return request({
    url:'/banner/updateActivatedStatus/'+id,
    method:'post',
    params:params
  })
}
export function deleteHomeAdvertise(data) {
  return request({
    url:'/banner/deleteBanner',
    method:'post',
    data:data
  })
}
export function batchDeleteHomeAdvertise(data) {
  return request({
    url:'/banner/deleteBannerBatch',
    method:'post',
    data:data
  })
}

export function createHomeAdvertise(data) {
  return request({
    url:'/banner/addBanner',
    method:'post',
    //headers: {'Content-Type':'application/x-www-form-urlencoded'},
    params:data //data和params好像都可以啊
  })
}
export function getHomeAdvertise(bannerId) {
  return request({
    url:'/banner/getBannerById/'+bannerId,
    method:'get',
  })
}

export function updateHomeAdvertise(bannerId,data) {
  return request({
    url:'/banner/modifyBanner/'+bannerId,
    method:'post',
    data:data
  })
}
