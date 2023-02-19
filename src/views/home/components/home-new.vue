<template>
    <div class="home-new">
        <HomePanel ref="target" title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
            <template #right>
                <XtxMore />
            </template>
            <!-- 主体内容面板 -->
            <Transition name="fade">
                <template v-if="data?.length">
                    <ul class="goods-list">
                        <li v-for="item in data" :key="item.id">
                            <RouterLink :to="`/product/${item.id}`">
                                <img v-lazy="item.picture" alt />
                                <p class="name ellipsis">{{item.name}}</p>
                                <p class="price">&yen;{{item.price}}</p>
                            </RouterLink>
                        </li>
                    </ul>
                </template>
                <template v-else>
                    <Panelskeleton bg="#f0f9f4" />
                </template>
            </Transition>
        </HomePanel>
    </div>
</template>

<script setup name='homeNew'>
/**
 *  新鲜好物组件
 */
import { ref } from "vue";

import { findNews } from "@/api/home";
import { useLazyData } from "@/hooks";

import HomePanel from "./home-panel.vue";
import Panelskeleton from "./home-panelskeleton.vue";

// const target = ref(null);
// const goods = ref(useLazyData(target,findNews));

const { target, data } = useLazyData(findNews);

// awaitWrap(findNews()).then(([err, { result }]) => {
//     if (!err) {
//         goods = result;
//     }
// });
</script>

<style scoped lang="less">
.goods-list {
    display: flex;
    justify-content: space-between;
    height: 406px;
    li {
        width: 306px;
        height: 406px;
        background: #f0f9f4;
        .hoverShadow();
        img {
            width: 306px;
            height: 306px;
        }
        p {
            font-size: 22px;
            padding: 12px 30px 0 30px;
            text-align: center;
        }
        .price {
            color: @priceColor;
        }
    }
}








</style>