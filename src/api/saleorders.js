import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/orders',
    method: 'get',
    params
  })
}

export function getOrder(id) {
  return request({
    url: '/orders/' + id,
    method: 'get'
  })
}

export function createOrder(data) {
  return request({
    url: '/orders',
    method: 'post',
    data
  })
}

export function updateOrder(id, data) {
  return request({
    url: '/orders/' + id,
    method: 'put',
    data
  })
}

export function deleteOrder(id) {
  return request({
    url: '/orders/' + id,
    method: 'delete'
  })
}
