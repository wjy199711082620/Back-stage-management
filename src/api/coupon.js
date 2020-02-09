import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/coupon/getCouponList',
    method:'get',
    params:params
  })
}

export function createCoupon(data) {
  return request({
      url:'/coupon/addCoupon',
    method:'post',
    data:data
  })
}

export function getCoupon(id) {
  return request({
    url:'/coupon/getCouponById/'+id,
    method:'get',
  })
}

export function updateCoupon(id,data) {
  return request({
    url:'/coupon/modifyCoupon/'+id,
    method:'post',
    data:data
  })
}

export function deleteCoupon(couponId) {
  return request({
    url:'/coupon/deleteCoupon/'+couponId,
    method:'post',
  })
}
