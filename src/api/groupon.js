import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'groupon/getGrouponList',
    method:'get',
    params:params
  })
}

export function updateGroupon(id,data) {
  return request({
    url:'rule/modifyRule/'+id,
    method:'post',
    data:data
  })
}
export function updateStatus(data) {
  return request({
    url:'rule/update/recommendStatus',
    method:'post',
    data:data
  })
}
export function deleteGroupon(data) {
  return request({
    url:'groupon/deleteGroupon'+data,
    method:'get'
  })
}

export function getGroupon(id) {
  return request({
    url:'rule/getRuleById/'+id,
    method:'get'

  })
}

export function createGroupon(data) {
  return request({
    url:'groupon/addGroupon',
    method:'post',
    data:data,
   // headers: {'Content-Type':'application/json;charset=utf-8'} 
  })
}

export function updateGrouponSort(params) {
  return request({
    url:'groupon/update/sort/'+params.id,
    method:'post',
    params:params
  })
}
