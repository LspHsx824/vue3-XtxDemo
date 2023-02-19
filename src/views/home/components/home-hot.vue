<template>
    <div class="home-hot">
        <homePanel ref='target' title="人气推荐" subTitle="人气爆款 不容错过">
            <!-- 主体内容面板 -->
            <Transition name="fade">
                <template v-if="data?.length">
                    <ul ref="pannel" class="goods-list">
                        <li v-for="item in data" :key="item.id">
                            <RouterLink to="/">
                                <img v-lazy="item.picture" alt />
                                <p class="name">{{item.title}}</p>
                                <p class="desc">{{item.alt}}</p>
                            </RouterLink>
                        </li>
                    </ul>
                </template>
                <template v-else>
                    <panelskeleton  />
                </template>
            </Transition>
        </homePanel>
    </div>
</template>

<script setup name='homeHot'>
/**
 *  新鲜好物组件
 */

import { findHot } from "@/api/home";
import { useLazyData } from "@/hooks"
import { awaitWrap } from "@/utils/utils";

import homePanel from "./home-panel.vue";
import panelskeleton from "./home-panelskeleton.vue";


const { data,target } = useLazyData(findHot)

// awaitWrap(findHot()).then(([err, { result }]) => {
//     if (!err) {
//         goods = result;
//     }
// });
</script>

<style scoped lang="less">
.goods-list {
    display: flex;
    justify-content: space-between;
    height: 426px;
    li {
        width: 306px;
        height: 406px;
        .hoverShadow();
        img {
            width: 306px;
            height: 306px;
        }
        p {
            font-size: 22px;
            padding-top: 12px;
            text-align: center;
        }
        .desc {
            color: #999;
            font-size: 18px;
        }
    }
}






</style>