/**
 * !订单相关 api 
 */

import request from "@/utils/request"
export const findCheckoutInfo = () => {
    return request({
        url: '/member/order/pre',
        method: 'get',
    })
}

/**
 * 再次购买--> 支付页--> 根据订单ID 查看商品是否全部有效 --> 生成新的订单信息
 * @param {Number} orderId 
 * @returns 
 */
export const repurchaseOrder = (orderId) => {
    return request({
        url: '/member/order/repurchase/' + orderId,
        method: 'get',
    })
}



/**
 * 
 * @param {Object} form 
 * @returns 
 */
export const addAddress = form => {
    return request({
        url: "/member/address",
        method: 'post',
        data: form
    })
}

export const editAddress = (form) => {
    return request({
        url: "/member/address",
        method: 'put',
        data: form
    })
}

/**
 * 提交订单
 * @param {Object} order - 订单信息对象
 */
export const createOrder = (order) => {
    return request({
        url: "/member/order",
        method: 'post',
        data: order
    })
}

/**
 * 获取订单详情
 * @param {String} id - 订单ID
 */
export const findOrderDetail = (id) => {
    return request({
        url: `/member/order/${id}`,
        method: 'get',
    })
}

/**
 * 模拟订单发货
 * @param {String} id 
 * @returns 
 */
export const orderShipping = id => {
    return request({
        url: `/member/order/consignment/${id}`,
        method: 'get',
    })
}

/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns Promise
 */
export const cancelOrder = ({
    orderId,
    cancelReason
}) => {
    // return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
    return request({
        url: `/member/order/${orderId}/cancel`,
        method: 'put',
        data: {
            cancelReason
        }
    })
}


/**
 * 删除订单
 * @param {String} orderId - 订单ID
 * @returns
 */
export const deleteOrder = (ids) => {
    // return request('/member/order', 'delete', { ids: [orderId] })
    return request({
        url: `/member/order`,
        method: 'delete',
        data: {
            ids
        }
    })
}

/**
 * 确认收货
 * @param {String} orderId - 订单ID
 * @returns
 */
export const confirmOrder = (orderId) => {
    return request({
        url: `/member/order/${orderId}/receipt`,
        method: 'put'
    })
}