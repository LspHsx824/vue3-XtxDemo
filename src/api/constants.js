/**
 *  !定义常量数据，（接口未返回时，防止白屏）
 */

import axios from "axios"


// 顶级分类
export const topCategory = [
  '居家',
  '美食',
  '服饰',
  '母婴',
  '个护',
  '严选',
  '数码',
  '运动',
  '杂货'
]


// 订单状态数据 

export const orderStatus = [
  { name: 'all', label: '全部订单' },
  { name: 'unpay', label: '待付款' },
  { name: 'deliver', label: '待发货' },
  { name: 'receive', label: '待收货' },
  { name: 'comment', label: '待评价' },
  { name: 'complete', label: '已完成' },
  { name: 'cancel', label: '已取消' }
]



// 获取城市数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示

export const getCityData = () => {
  // 这个位置可能有异常操作，封装成promise
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      // 有缓存
      resolve(window.cityData)
    } else {
      // 无缓存
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        window.cityData = res.data
        resolve(window.cityData)
      })
    }
  })
}