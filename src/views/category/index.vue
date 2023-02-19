<template>
    <div class="top-category">
        <div class="container">
            <!-- 面包屑 -->
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <Transition name="fade-right" mode="out-in">
                    <!-- 动画触发的条件是 Element 创建和移除  -->
                    <XtxBreadItem :key="topCategory?.id">
                        {{
                        topCategory?.name
                        }}
                    </XtxBreadItem>
                </Transition>
            </XtxBread>
            <!-- 轮播图 -->
            <XtxCarousel :sliders="sliders" style="height: 500px" />
            <!-- 所有二级分类 -->
            <div class="sub-list">
                <h3>全部分类</h3>
                <ul>
                    <li v-for="item in topCategory?.children" :key="item.id">
                        <a href="javascript:;">
                            <img v-lazy="item.picture" />
                            <p>{{ item.name }}</p>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- 分类关联商品 -->
            <div class="ref-goods" v-for="subG in subGoods" :key="subG?.id">
                <div class="head">
                    <h3>- {{ subG?.name }} -</h3>
                    <p class="tag">温暖柔软，品质之选</p>
                    <XtxMore :path="`/category/sub/${subG.id}`" />
                </div>
                <div class="body">
                    <GoodsItem v-for="sub in subG.goods" :key="sub.id" :goods="sub" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup name="TopCategory">

import { watch,ref,computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { findBanner } from "@/api/home";
import { findTopCategory } from "@/api/category";
import { awaitWrap } from "@/utils/utils";

import GoodsItem from "./components/goods-item.vue";

const Store = useStore();
const Route = useRoute();

/**
 * 轮播图数据
 */
let sliders = ref([]);
awaitWrap(findBanner()).then(([err, { result }]) => {
    if (!err) {
        sliders.value = result;
    }
});

/**
 * 面包屑+所有子分类（ vuex数据 )
 *
 */
let topCategory = computed(() =>
    Store.state.category.list.find((item) => item.id == Route.params.id)
);

/**
 * 推荐商品
 */
let subGoods = ref([]);

const getSubList = () => {
    awaitWrap(findTopCategory(Route.params.id)).then(([err, { result }]) => {
        if (!err) {
            subGoods.value = result.children;
        }
    });
};

watch(
    () => Route.params.id,
    (newVal) => {
        /**
         *  情况分明：
         *   1. 当首页进入 顶级泪目 => id 从无到有，此时需要发送请求获取数据
         *   2. 当顶级泪目跳转到其他地方 => id从有到无
         *   3. 一级泪目跳二级泪目 id也会发生变化，此时需要判断 当前路由级别
         */
        if (newVal && Route.meta["Category-type"] === "Top-Categories")
            getSubList();
    },
    {
        immediate: true,
    }
);
</script>

<style scoped lang="less">
.top-category {
    h3 {
        font-size: 28px;
        color: #666;
        font-weight: normal;
        text-align: center;
        line-height: 100px;
    }
    .sub-list {
        margin-top: 20px;
        background-color: #fff;
        ul {
            display: flex;
            padding: 0 32px;
            flex-wrap: wrap;
            li {
                width: 168px;
                height: 160px;
                a {
                    text-align: center;
                    display: block;
                    font-size: 16px;
                    img {
                        width: 100px;
                        height: 100px;
                    }
                    p {
                        line-height: 40px;
                    }
                    &:hover {
                        color: @xtxColor;
                    }
                }
            }
        }
    }
    .ref-goods {
        background-color: #fff;
        margin-top: 20px;
        position: relative;
        .head {
            .xtx-more {
                position: absolute;
                top: 20px;
                right: 20px;
            }
            .tag {
                text-align: center;
                color: #999;
                font-size: 20px;
                position: relative;
                top: -20px;
            }
        }
        .body {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding: 0 65px 30px;
        }
    }
}




</style>
