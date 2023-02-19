<template>
    <HomePanel ref="target" title="热门品牌" sub-title="国际经典 品质保证">
        <template v-slot:right>
            <a
                @click="toggle(0)"
                :class="{disabled:index==0}"
                href="javascript:;"
                class="iconfont icon-angle-left prev"
            ></a>
            <a
                @click="toggle(-1)"
                :class="{disabled:index==-1}"
                href="javascript:;"
                class="iconfont icon-angle-right next"
            ></a>
        </template>

        <Transition name="fade">
            <template v-if="data">
                <div class="box">
                    <ul class="list" :style="{transform:`translateX(${index*1240}px)`}">
                        <li v-for="item in data" :key="item.id">
                            <RouterLink to="/">
                                <img v-lazy="item.picture" alt />
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </template>
            <template v-else>
                <div class="skeleton">
                    <XtxSkeleton
                        class="item"
                        v-for="i in 5"
                        :key="i"
                        animated
                        bg="#e4e4e4"
                        width="240px"
                        height="305px"
                    />
                </div>
            </template>
        </Transition>
    </HomePanel>
</template>

<script setup name='HomeBrand'>
import { ref } from "vue";
import { useLazyData } from "@/hooks";
import { findBrand } from "@/api/home";

import HomePanel from "./home-panel";
import Panelskeleton from "./home-panelskeleton.vue";

// 注意：useLazyData需要的是API函数，如果遇到要传参的情况，自己写函数再函数中调用API
const { data, target } = useLazyData(() => findBrand(10));

const index = ref(0);
/**
 * 左右切换 1 -1
 */
const toggle = (step) => {
    index.value = step;
};
</script>

<style scoped lang="less">
.skeleton {
    width: 100%;
    display: flex;
    .item {
        margin-right: 10px;
        &:nth-child(5n) {
            margin-right: 0;
        }
    }
}
.home-panel {
    background: #f5f5f5;
}
.iconfont {
    width: 20px;
    height: 20px;
    background: #ccc;
    color: #fff;
    display: inline-block;
    text-align: center;
    margin-left: 5px;
    background: @xtxColor;
    &::before {
        font-size: 12px;
        position: relative;
        top: -2px;
    }
    &.disabled {
        background: #ccc;
        cursor: not-allowed;
    }
}
.box {
    display: flex;
    width: 100%;
    height: 345px;
    overflow: hidden;
    padding-bottom: 40px;
    .list {
        width: 200%;
        display: flex;
        transition: all 1s;
        li {
            margin-right: 10px;
            width: 240px;
            &:nth-child(5n) {
                margin-right: 0;
            }
            img {
                width: 240px;
                height: 305px;
            }
        }
    }
}



</style>
