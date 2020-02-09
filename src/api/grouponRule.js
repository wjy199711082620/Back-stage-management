import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/grouponRule/getGrouponRuleList',
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
export function deleteHomeAdvertise(ruleId) {
  return request({
    url:'/grouponRule/deleteGrouponRule/' + ruleId,
    method:'post',
  })
}
export function addGrouponRule(data) {
  return request({
    url:'/grouponRule/addGrouponRule',
    method:'post',
    params:data,
  })
}
export function importGrouponRule(data) {
  return request({
    url:'/grouponRule/importGrouponRule',
    method:'post',
    data:data,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}
export function getGrouponRule(grouponRuleId) {
  return request({
    url:'/grouponRule/getGrouponRuleById/'+grouponRuleId,
    method:'get',
  })
}

export function updateGrouponRule(grouponRuleId,data) {
  return request({
    url:'/grouponRule/modifyGrouponRule/'+grouponRuleId,
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
