import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/companies',
    method: 'get',
    params
  })
}

export function getItem(id) {
  return request({
    url: '/companies/' + id,
    method: 'get'
  })
}

export function createItem(data) {
  return request({
    url: '/companies',
    method: 'post',
    data
  })
}

export function updateItem(id, data) {
  return request({
    url: '/companies/' + id,
    method: 'put',
    data
  })
}

export function deleteItem(id) {
  return request({
    url: '/companies/' + id,
    methos: 'delete'
  })
}
