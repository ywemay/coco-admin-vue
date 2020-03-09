import request from '@/utils/request'

export function getSaleOrderList(params) {
  return request({
    url: '/sale_orders',
    method: 'get',
    params
  })
}

export function getSaleOrder(id) {
  return request({
    url: '/sale_orders/' + id,
    method: 'get'
  })
}

export function createSaleOrder(data) {
  return request({
    url: '/sale_orders',
    method: 'post',
    data
  })
}

export function patchSaleOrder(id, data) {
  return request({
    url: '/sale_orders/' + id,
    method: 'put',
    data
  })
}
