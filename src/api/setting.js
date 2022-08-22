import request from '@/utils/request'

/**
 * 根据id查询企业
 * @param {*} companyId 
 * @returns 
 */
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

export function getRoleList(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}