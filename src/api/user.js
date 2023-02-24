import request from '@/utils/request'

/**
 * 帐号登录
 * @param {String} account - 用户名
 * @param {String} password - 密码
 * @returns Promise
 */

export const userAccountLogin = ({
    account,
    password
}) => {

    return request({
        url: '/login',
        method: 'post',
        data: {
            account,
            password
        }
    })
}


/**
 * 获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg = (mobile) => {
    //  request('/login/code', 'get', { mobile })
    return request({
        url: '/login/code',
        method: "get",
        params: {
            mobile
        }
    })
}

/**
 * 短信登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userMobileLogin = ({
    mobile,
    code
}) => {

    return request({
        url: '/login/code',
        method: "post",
        data: {
            mobile,
            code
        }
    })
}


/**
 * 第三方登录
 * @param {String} unionId - 第三方登录唯一标识
 * @param {Integer} source - 来源 1为pc，2为webapp，3为微信小程序，4为Android，5为ios,6为qq,7为微信
 * @returns Promise
 */
export const userQQLogin = (unionId, source = 6) => {
    // return request('/login/social', 'post', { unionId, source })
    return request({
        url: '/login/social',
        method: "post",
        data: {
            unionId,
            source
        }
    })
}


/**
 * 获取QQ绑定的时候短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQBindCode = (mobile) => {
    // return request('/login/social/code', 'get', { mobile })
    return request({
        url: '/login/social/code',
        method: "get",
        params: {
            mobile
        }
    })

}

/**
 * QQ登录-绑定帐号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns
 */
export const userQQBindLogin = ({
    unionId,
    mobile,
    code
}) => {
    return request({
        url: '/login/social/bind',
        method: "post",
        data: {
            unionId,
            mobile,
            code
        }
    })
}


/**
 * 校验用户是否存在
 * @param {String} account - 帐号
 * @returns promise
 */
export const userAccountCheck = (account) => {
    return request({
        url: '/register/check',
        method: 'get',
        params: {
            account
        }
    })
}
/**
 * 校验用户是否存在
 * @param {String} account - 帐号
 * @returns promise
 */
export const updateAvatar = (data) => {
    // multipart/form-data
    return request({
        url: 'http://pcapi-xiaotuxian-front-devtest.itheima.net/member/profile/avatar',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data,
    })
}