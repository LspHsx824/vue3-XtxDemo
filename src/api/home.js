/**
 * ! 首页相关后台数据接口。
 */
import request from '@/utils/request'

/**
 * 
 * @param {Integer } limit default = 6 
 * @returns AxiosPromise
 */
export const findBrand = (limit = 6) => {
    return request({
        url: '/home/brand',
        method: 'get',
        params: {
            limit
        }
    })
}

/**
 * 获取广告图
 * @returns Promise
 */
export const findBanner = () => {
    return request({
        url: '/home/banner',
        method: 'get',
    })
}

/**
 * 获取新鲜好物 data
 * @returns Promise
 */
export const findNews = () => {
    return request({
        url: 'home/new',
        method: 'get',
    })

}
/**
 * 获取人气推荐 data
 * @returns Promise
 */
export const findHot = () => {
    return request({
        url: 'home/hot',
        method: 'get',
    })

}
/**
 * 获取商品 data
 * @returns Promise
 */
export const findGoods = () => {
    return request({
        url: 'home/goods',
        method: 'get',
    })

}
/**
 * 获取最新专题 data
 * @returns Promise
 */
export const findSpecial = () => {
    return request({
        url: 'home/special',
        method: 'get',
    })

}