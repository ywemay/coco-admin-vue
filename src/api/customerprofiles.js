import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/customer_profiles',
    method: 'get',
    params
  })
}

export function getItem(id) {
  return request({
    url: '/customer_profiles/' + id,
    method: 'get'
  })
}

export function createItem(data) {
  return request({
    url: '/customer_profiles',
    method: 'post',
    data
  })
}

export function updateItem(id, data) {
  return request({
    url: '/customer_profiles/' + id,
    method: 'put',
    data
  })
}

export function deleteItem(id) {
  return request({
    url: '/customer_profiles/' + id,
    method: 'delete'
  })
}
