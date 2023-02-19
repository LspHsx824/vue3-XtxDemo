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