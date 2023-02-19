import request from '@/utils/request'

/**
 * 获取新的商品信息
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getNewCartGoods = (skuId) => {
    return request({
        url: `/goods/stock/${skuId}`,
        method: 'get'
    })
}


/**
 * 获取商品的specs和skus
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getSpecsAndSkus = (skuId) => {
    return request({
        url: `/goods/sku/${skuId}`,
        method: 'get'
    })
}

/**
 * 合并本地购物车
 * @param {Array<object>} cartList - 本地购物车数组
 * @param {String} item.skuId - 商品SKUID
 * @param {Boolean} item.selected - 是否选中
 * @param {Integer} item.count - 数量
 */
export const api_MergeLocalCart = (cartList) => {
    return request({
        url: "/member/cart/merge",
        method: 'Post',
        data: cartList
    })
}

/**
 * 已登录——获取购物车列表
 */
export const api_FindCart = () => {
    return request({
        url: '/member/cart',
        method: 'get',
    })
}

/**
 * 已登录—— 将商品插入购物车
 */

export const api_InsertCart = (data) => {
    return request({
        url: '/member/cart',
        method: 'post',
        data
    })
}

/**
 * 
 * @param {*Array<string>}   skuId 集合
 * @returns 
 */
export const api_DeleteCart = (skuIds) => {
    return request({
        url: '/member/cart',
        method: 'delete',
        data: {
            ids: skuIds
        }
    })
}


/**
 * 
 * @param {Number<require>} skuId -> 商品 skuId  
 * @param {?:String} selected -> 商品 selected   ?: 可选·
 * @param {?:String} count -> 商品 count  
 * @returns 
 */
export const api_UpdateCart = ({
    skuId,
    selected,
    count
}) => {
    return request({
        url: `/member/cart/${skuId}`,
        method: 'put',
        data: {
            selected,
            count
        }
    })
}

/**
 * 
 * @param {*Object} data 
 * @returns 
 */

export const api_CheckAll = (data) => {
    return request({
        url: '/member/cart/selected',
        method: 'put',
        data,
    })
}