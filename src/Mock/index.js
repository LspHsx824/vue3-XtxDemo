import Mock from 'mockjs'

import QS from 'qs'

import {
    getMemberCollect
} from "./mockFn"


Mock.setup({
    timeout: '500-1000' //随机延迟
})

// 拦截接口  /my/test
// 1. 接口地址路径规则，需要匹配到它
// 2. 请求方式
// 3. 返回数据（函数返回数据）

Mock.mock(/\/Mockdata\/test/, 'get', () => {
    // 随机数据逻辑 目标：5条数据  [{id:'',name:''},...]
    const arr = []
    for (let i = 0; i < 5; i++) {
        // arr.push(Mock.mock('@id'))
        arr.push(Mock.mock({
            id: '@id',
            name: '@cname'
        }))
    }
    /**
     * !返回数据和后端 保持一致
     */
    return {
        msg: 'Mock获取测试数据成功',
        result: arr
    }
})

/**
 * 拦截 我的收藏数据
 */

Mock.mock(/\/member\/collect/, 'get', config => {

    // console.log(config);
    // console.log(config.url);
    const query = QS.parse(config.url.split('?')[1])
    return {
        msg: '获取收藏商品成功',
        result: {
            counts: 35,
            pageSize: +query.pageSize,
            page: +query.page,
            items:getMemberCollect(+query.pageSize,Mock)
        }
    }
})