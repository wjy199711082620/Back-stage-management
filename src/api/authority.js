import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/authority/getAuthorityList',
    method:'get',
    params:params
  })
}
export function authorityList() {
  return request({
    url:'/authority/getAuthoritys',
    method:'get',
  })
}

export function createAuthority(params) {
  return request({
    url:'/authority/addAuthority',
    method:'post',
    params:params
  })
}

export function getAuthority(authorityId) {
  return request({
    url:'/authority/'+authorityId,
    method:'get',
  })
}

export function updateAuthority(authorityId,params) {
  return request({
    url:'/authority/modifyAuthority/'+authorityId,
    method:'post',
    params:params
  })
}

export function deleteAuthority(authorityId) {
  return request({
    url:'/authority/deleteAuthority/'+authorityId,
    method:'post',
  })
}
