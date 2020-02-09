import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/role/getRoleList',
    method:'get',
    params:params
  })
}
export function allRole() {
  return request({
    url:'/role/getAllRole',
    method:'get'
  })
}

export function createRole(params) {
  return request({
    url:'/role/addRole',
    method:'post',
    params:params
  })
}

export function getRole(roleId) {
  return request({
    url:'/role/'+roleId,
    method:'get',
  })
}

export function updateRole(roleId,params) {
  return request({
    url:'/role/modifyRole/'+roleId,
    method:'post',
    params:params
  })
}

export function deleteRole(id) {
  return request({
    url:'/role/delete/'+id,
    method:'post',
  })
}
