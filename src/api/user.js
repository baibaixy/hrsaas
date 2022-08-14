import request from '@/utils/request'

/**
 *登录请求
 * @param {*} data
 * @returns
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

/**
 * 获取用户信息
 * @returns 用户基本信息
 */
export function getUserInfoApi() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 获取用户详细信息
 * @param {*} id 用户id
 * @returns
 */
export function getUserDetail(id) {
  return request({
    url: '/sys/user/' + id
  })
}

/** *
 *
 * 保存员工的基本信息
 * **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}


