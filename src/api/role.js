import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {*} params
 * @returns
 */
export function getRolesApi(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 *添加角色
 * @param {*} params
 * @returns
 */
export function addRolesApi(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

/**
 * 根据id提供角色
 * @param {*} id
 * @returns
 */
export function getRolesInfo(id) {
  return request({
    url: '/sys/role/' + id
  })
}

/**
 * 给角色分配权限
 * @param {*} data  {id, premIds}
 * @returns  promise
 */
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
