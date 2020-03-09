// import Mock from 'mockjs'

const data = [
  {
    id: 0,
    name: 'Japan'
  },
  {
    id: 1,
    name: 'Koreya'
  }
]

export default [
  {
    url: '/countries',
    type: 'get',
    response: config => {
      return data
    }
  },
  {
    url: '/countries',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: "success"
      }
    }
  },
  {
    uri: '/countries/${id}',
    type: 'get',
    response: config => {
      const items = data
      return {
        data: items[id]
      }
    }
  },
  {
    uri: '/countries/${id}',
    type: 'put',
    response: config => {
      const items = data
      return {
        data: items[id]
      }
    }
  }
]
