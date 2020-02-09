import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/order/getOrderList',
    method:'get',
    params:params
  })
}

export function closeOrder(params) {
  return request({
    url:'/order/update/close',
    method:'post',
    params:params
  })
}

export function deleteOrder(params) {
  return request({
    url:'/order/deleteOrder',
    method:'post',
    params:params
  })
}

export function deliveryOrder(orderId,data) {
  return request({
    url:'/order/sendProduct/'+orderId,
    method:'get',
    params:data
  });
}
export function batchDeleteOrder(data) {
  return request({
    url:'/order/batchDeleteOrder',
    method:'post',
    data:data
  });
}
export function getOrderDetail(id) {
  return request({
    url:'/order/getOrderById/'+id,
    method:'get'
  });
}

export function updateReceiverInfo(data) {
  return request({
    url:'/order/update/receiverInfo',
    method:'post',
    data:data
  });
}

export function updateMoneyInfo(data) {
  return request({
    url:'/order/update/moneyInfo',
    method:'post',
    data:data
  });
}

export function updateOrderNote(params) {
  return request({
    url:'/order/update/note',
    method:'post',
    params:params
  })
}
