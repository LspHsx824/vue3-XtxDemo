import request from '@/utils/request'

/**
 * 获取收藏分页数据
 * @param {Integer} collectType - 收藏类型，1为商品，2为专题，3为品牌
 * @returns
 */
export const findCollect = ({
    page = 1,
    pageSize = 10,
    collectType = 1 //默认获取收藏的商品
}) => {
    return request({
        url: "/member/collect",
        method: 'get',
        params: {
            page,
            pageSize,
            collectType,
        }
    })
}

/**
 * 获取订单列表
 * @param {String} page - 页码
 * @param {String} pageSize - 每页条数
 * @param {String} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @returns
 */
export const findOrderList = ({
    page = 1,
    pageSize = 10,
    orderState = 0
} = {
    page: 1,
    pageSize: 10,
    orderState: 0
}) => {
    return request({
        url: '/member/order',
        method: 'get',
        params: {
            page,
            pageSize,
            orderState
        }
    })
}