/**
 * 1. 商品相关 Api
 */

import request from "@/utils/request"

/**
 * 
 * @param {* String} id 
 * @returns 
 */
export const findGoods = id => {
    return request({
        url: '/goods',
        method: 'GET',
        params: {
            id,
        }
    })
}

/**
 * 获取商品同类推荐-未传入ID为猜喜欢
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 */
 export const findRelGoods = (id, limit = 16) => {
    // return request('/goods/relevant', 'get', { id, limit })
    return request({
        url: '/goods/relevant',
        method: 'GET',
        params: {
            id,
            limit
        }
    })
  }