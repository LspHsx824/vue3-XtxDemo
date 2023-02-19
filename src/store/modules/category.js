// 分类模块

// 存储的分类数据
import {
    topCategory
} from '@/api/constants'
import {
    findAllCategory
} from '@/api/category'

export default {
    //     默认的模块，state 区分模块，其他 getters mutations actions 都在全局。
    // 带命名空间 namespaced: true 的模块，所有功能区分模块，更高封装度和复用。
    namespaced: true,
    state() {
        return {
            // 分类信息集合
            list: topCategory.map(item => ({
                name: item,
                open: false
            }))
        }
    },
    mutations: {
        setList(state, payload) {
            state.list = payload
        },
        show(state, id) {
            const category = state.list.find(item => item.id === id)
            category.open = true
        },
        hide(state, id) {
            const category = state.list.find(item => item.id === id)
            category.open = false
        }
    },
    actions: {
        async getList({
            commit
        }) {
            const data = await findAllCategory()
            commit('setList', data.result.map(item => ({
                ...item,
                open: false
            })))
        }
    }
}