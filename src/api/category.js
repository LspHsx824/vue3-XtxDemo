// 定义首页需要的接口函数
import request from '@/utils/request'

/**
 * 获取首页头部分类数据
 */
export const findAllCategory = () => {
  return request({
    url: '/home/category/head',
    method: 'get'
  })
}


/**
 * 获取单个顶级分类信息
 * @param {String} id - 顶级分类ID
 */

export const findTopCategory = (id) => {
  return request({
    url: '/category',
    method: 'get',
    params: {
      id
    }
  })
}
/**
 * 获取单个二级分类信息
 * @param {String} id - 顶级分类ID
 */

export const findSubCategoryFilter = (id) => {
  return request({
    url: '/category/sub/filter',
    method: 'get',
    params: {
      id
    }
  })
}



/**
 * 获取分类下的商品（带筛选条件）
 * @param {Object} data - 可参考接口文档
 */
export const findSubCategoryGoods = (data) => {
  return request({
    url: '/category/goods/temporary',
    method: 'post',
    data
  })
}