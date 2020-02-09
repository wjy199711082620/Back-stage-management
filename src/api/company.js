import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/company/getCompanyList',
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
export function handleUpdateRecommend(id,params) {
  return request({
    url:'/technology/modifyTechnologyRecommend/'+id,
    method:'post',
    params:params
  })
}
export function deleteCompany(data) {
  return request({
    url:'/company/deleteCompany',
    method:'post',
    data:data
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
export function batchDeleteCompany(data) {
  return request({
    url:'/company/batchDeleteCompany',
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

export function getCompanyInfo(data) {
  return request({
    url: '/company/getCompanyInfo',
    method: 'get',
    params: data
  })
}

export function updateCompany(data) {
  return request({
    url:'/company/modifyCompany/',
    method:'post',
    data:data,
    contentType: "application/json; charset=UTF-8",
  })
}
