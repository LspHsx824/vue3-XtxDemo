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