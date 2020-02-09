import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/purchaseRule/getPurchaseRuleList',
    method:'get',
    params:params
  })
}

export function deletePurchaseRule(data) {
  return request({
    url:'/purchaseRule/delete',
    method:'post',
    data:data
  })
}

export function createPurchaseRule(data) {
  return request({
    url:'/purchaseRule/addPurchaseRule',
    method:'post',
    data:data
  })
}

export function updatePurchaseRule(purchaseRuleId,data) {
  return request({
    url:'/purchaseRule/modifyPurchaseRule/'+purchaseRuleId,
    method:'post',
    data:data
  })
}
export function getPurchaseRule(ruleId) {
  return request({
    url:'/purchaseRule/getPurchaseRuleById/'+ruleId,
    method:'get'
  })
}

export function getPurchaseRuleInfo(productCategoryId) {
  return request({
    url:'/purchaseRule/attrInfo/'+productCategoryId,
    method:'get'
  })
}
