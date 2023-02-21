/**
 * 生成指定规则 Mock 数据的 规则函数
 */

export const getMemberCollect = (size, Mock) => {
    const items = []
    for (let i = 0; i < size; i++) {
        items.push(Mock.mock({
            id: '@id',
            name: '@ctitle(10,20)',
            desc: '@ctitle(4,10)',
            price: "@float(100,200,2,2)",
            picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
        }))
    }
    return items
}