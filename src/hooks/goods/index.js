/**
 * goods 相关 hooks
 */

import {
    ref,
    isRef,
    unref,
    watchEffect
} from "vue";


import { useRoute } from "vue-router"


import {
    findGoods
} from "@/api/product";
import {
    awaitWrap
} from "@/utils/utils";

export const useGoods = (id) => {
    const data = ref(null);
    const error = ref(null);
    const Route = useRoute()

    function doFetch() {
        // 在请求之前重设状态...
        data.value = null;
        error.value = null;
        // unref() 解包可能为 ref 的值
        if(Route.meta?.type != 'product') return 
        awaitWrap(findGoods(unref(id))).then(([err, {
            result
        }]) => {
            if (!err) data.value = result;
            error.value = err;
        });
    }

    if (isRef(id)) {
        // 若输入的 URL 是一个 ref，那么启动一个响应式的请求
        watchEffect(doFetch);
    } else {
        // 否则只请求一次
        // 避免监听器的额外开销
        doFetch();
    }

    return {
        data,
        error,
    };
};