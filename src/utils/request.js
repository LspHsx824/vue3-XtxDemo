import axios from 'axios';
import Router from "@/router"

import {
    getTokenAUTH
} from '@/utils/auth';



// 导出基准地址，原因：其他地方不是通过axios发请求的地方用上基准地址

export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

/**
 * 函数式请求配置，每次都会创建新的 server 请求发送器
 * @param {Object} confing -发送请求的默认配置对象
 * @returns  Promise
 */

function instance(confing, customOptions) {
    const service = axios.create({
        baseURL,
        timeout: 5000,
    })

    // 自定义配置  适配器
    let custom_options = Object.assign({
        // repeat_request_cancel: false, // 是否开启取消重复请求, 默认为 true
        reduct_data_format: true, // 是否开启简洁的数据结构响应, 默认为true
        error_message_show: true, // 是否开启接口错误信息展示,默认为true
    }, customOptions);


    service.interceptors.request.use(
        config => {
            //根据 适配器参数来判断 是否需要取消重复请求
            // 自动携带token
            const Token = getTokenAUTH()
            if (Token) { //检测执行的环境存不存在window 对象
                config.headers.Authorization = `Bearer ${getTokenAUTH()}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    service.interceptors.response.use(
        response => {
            return custom_options.reduct_data_format ? response.data : response;
        },
        error => {
            // 【取消请求】这个说法不对，应该叫【忽略响应】。
            // error.config && removePending(error.config);
            custom_options.error_message_show && httpErrorStatusHandle(error) // 处理错误状态码
            return Promise.reject(error); // 错误继续返回给到具体页面
        }
    );
    return service(confing)
}

export default instance


/**
 * 处理异常
 * @param {*} error 
 */
function httpErrorStatusHandle(error) {
    // 处理被取消的请求
    if (axios.isCancel(error)) return console.error('请求的重复请求：' + error.message);
    let message = '';
    if (error && error.response) {
        switch (error.response.status) {
            case 302:
                message = '接口重定向了！';
                break;
            case 400:
                message = '参数不正确！';
                break;
            case 401:
                message = '您未登录，或者登录已经超时，请先登录！';
                redirectLogin()
                break;
            case 403:
                message = '您没有权限操作！';
                break;
            case 404:
                message = `请求地址出错: ${error.response.config.url}`;
                break; // 在正确域名下
            case 408:
                message = '请求超时！';
                break;
            case 409:
                message = '系统已存在相同数据！';
                break;
            case 500:
                message = '服务器内部错误！';
                break;
            case 501:
                message = '服务未实现！';
                break;
            case 502:
                message = '网关错误！';
                break;
            case 503:
                message = '服务不可用！';
                break;
            case 504:
                message = '服务暂时无法访问，请稍后再试！';
                break;
            case 505:
                message = 'HTTP版本不受支持！';
                break;
            default:
                message = '异常问题，请联系管理员！';
                break
        }
    }
    if (error.message.includes('timeout')) message = '网络请求超时！';
    if (error.message.includes('Network')) message = window.navigator.onLine ? '服务端异常！' : '您断网了！';
    console.warn(message);
    return Object.assign(error, {
        CustomizationError: message
    })
}

// 重定向登录。
function redirectLogin() {
    Router.replace({
        name: 'login',
        query: {
            returnUrl: Router.currentRoute.value.fullPath
        }
    })
}