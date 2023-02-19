import {
    createStore
} from "vuex"
import createPersistedState from "vuex-persistedstate"

import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'


const store = createStore({
    modules: {
        user,
        cart,
        category
    },
    plugins: [createPersistedState({
        key: 'xtx-vue3app-pc-store',
        paths: ['user', 'cart']
    })]
})

export default store