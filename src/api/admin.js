import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/admin/getAdminList',
    method:'get',
    params:params
  })
}

export function createAdmin(params) {
  return request({
    url:'/admin/addAdmin',
    method:'post',
    params:params
  })
}

export function getAdmin(id) {
  return request({
    url:'/admin/'+id,
    method:'get',
  })
}

export function updateAdmin(adminId,params) {
  return request({
    url:'/admin/modifyAdmin/'+adminId,
    method:'post',
    params:params
  })
}

export function deleteAdmin(adminId) {
  return request({
    url:'/admin/deleteAdmin/'+adminId,
    method:'post',
  })
}
