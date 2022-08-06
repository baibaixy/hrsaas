import request from '@/utils/request'

/**
 * 获取组织架构数据
 * @returns
 */
export function getDeptsApi() {
  return request({
    url: '/company/department'
  })
}

/**
 * 删除id
 * @param {*} id
 * @returns
 */
export function delDeptsApi(id) {
  return request({
    url: '/company/department/' + id,
    method: 'DELETE'
  })
}

/**
 * 添加部门
 * @param {*} data 
 * @returns 
 */
export function addDeptsApi(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}
