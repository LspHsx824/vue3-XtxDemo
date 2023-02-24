import axios from 'axios';
import Router from "@/router"

import {
    getTokenAUTH
} from '@/utils/auth';

const pendingMap = new Map();


// 导出基准地址，原因：其他地方不是通过axios发请求的地方用上基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'


/**
 * 函数式请求配置，每次都会创建新的 server 请求发送器
 * @param {Object} confing -发送请求的默认配置对象
 * @returns  Promise
 */

function instance(confing, customOptions) {
    const service = axios.create({
        baseURL, // 如果请求是绝对路径，也可以直接填入url参数中，baseUrl 参数不并会再加上个前缀，这是baseUrl参数的特性哦。
        timeout: 5000,
    })

    // 自定义配置  适配器
    let custom_options = Object.assign({
        repeat_request_cancel: false, // 是否开启取消重复请求, 默认为 true
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

            //添加需要取消的重复请求参数
            if (custom_options.repeat_request_cancel) {
                removePending(config)
                addPending(config)
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
            error.config && removePending(error.config);
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

/**
 * 延迟自动取消请求！
 * @param {*Number} timeoutMs 
 * @returns Function
 */
function awaitAutobortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    return abortController.signal;
}


function AbortSignal(timeoutMs) {
    const abortController = new AbortController();
    const closeResponse = (timeoutMs) => {
        setTimeout(() => abortController.abort(), timeoutMs || 0);

    }
    return {
        signal: abortController.signal,
        close: closeResponse
    };
}


/**
 * 生成每个请求唯一的键
 * @param {*} config 
 * @returns string
 */
function getPendingKey(config) {
    // 判断重复请求并储存进队列
    // 首先我们要收集请求中的接口并判断哪些请求是重复请求，我们才能取消它，那么如何判断呢？
    // 很简单，只要是请求地址、请求方式、请求参数一样，那么我们就能认为是一样的
    let {
        url,
        method,
        params,
        data
    } = config;
    if (typeof data === 'string') data = JSON.parse(data); // response里面返回的config.data是个字符串对象
    //处理特殊 需要重复的请求地址参数
    if (params?.pageSize && params.page) {
        const newParams = {
            page: 1,
            pageSize: 10,
            orderState: 0
        }
        return [url, method, JSON.stringify(newParams), JSON.stringify(data)].join('&')
    }
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}



/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config 
 */
function addPending(config) {
    const pendingKey = getPendingKey(config);
    //   第一种 axios 取消请求方式
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
        if (!pendingMap.has(pendingKey)) {
            pendingMap.set(pendingKey, cancel);
        }
    });


    /**
     * axios 最新取消请求方式
     */
    // if (!pendingMap.has(pendingKey)) {
    //     const CancelToken = axios.CancelToken;
    //     const source = CancelToken.source();
    //     config.cancelToken = source.token
    //     pendingMap.set(pendingKey, source);
    // }

    /**
     * 带有延迟 取消请求
     */
    // if (!pendingMap.has(pendingKey)) {
    //延迟自动取消请求（ 不需要手动取消 ）
    // config.signal = awaitAutobortSignal(5000) 
    // }

    /*
    工厂函数封装 取消请求
    if (!pendingMap.has(pendingKey)) {
        const {
            signal,
            close
        } = AbortSignal()
        config.signal = signal
        pendingMap.set(pendingKey, close)
    }
    */

}

/**
 * 删除重复的请求
 * @param {*} config 
 */
function removePending(config) {
    const pendingKey = getPendingKey(config);
    if (pendingMap.has(pendingKey)) {
        const cancelToken = pendingMap.get(pendingKey);
        cancelToken(pendingKey);
        // cancelToken.cancel('request canceled by the user.')
        // cancelToken('Operation canceled by the user.')
        pendingMap.delete(pendingKey);
    }
}