import request from '@/utils/request'

/**
 * 根据id查询企业
 * @param {*} companyId 
 * @returns 
 */
export function getCompanyIdApi(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
