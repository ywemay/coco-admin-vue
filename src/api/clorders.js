import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/clorders',
    method: 'get',
    params
  })
}

export function getItem(id) {
  return request({
    url: '/clorders/' + id,
    method: 'get'
  })
}

export function createItem(data) {
  return request({
    url: '/clorders',
    method: 'post',
    data
  })
}

export function updateItem(id, data) {
  return request({
    url: '/clorders/' + id,
    method: 'put',
    data
  })
}

export function deleteItem(id) {
  return request({
    url: '/clorders/' + id,
    methos: 'delete'
  })
}
