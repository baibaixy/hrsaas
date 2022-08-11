import request from '@/utils/request'

/**
 * 获取员工列表（简单）
 * @returns promise
 */
export function getEmployeesApi() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 *获取员工复杂列表
 * @param {*} params
 * @returns
 */
export function getEmployeesInfoApi(params) {
  return request({
    url: '/sys/user',
    params
  })
}
