<template>
    <ul class="app-header-navs">
        <li class="home">
            <RouterLink to="/">首页</RouterLink>
        </li>
        <li
            v-for="item in categoryList"
            :key="item.id"
            @mousemove="showSubcategory(item.id)"
            @mouseleave="hideSubcategory(item.id)"
            @click="hideSubcategory(item.id)"
        >
            <RouterLink :to="`/category/${item.id}`">{{item.name}}</RouterLink>
            <div class="layer" :class="{open:item.open}">
                <ul>
                    <li
                        v-for="sub in item.children"
                        :key="sub.id"
                        @click="hideSubcategory(item.id)"
                    >
                        <RouterLink :to="{path:`/category/sub/${sub.id}`}">
                            <img v-lazy="sub.picture" :alt="sub.name" />
                            <p>{{sub.name}}</p>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>

<script setup >
// 头部虚拟导航抽离

import { computed } from "vue";
import { useStore } from "vuex";

const Store = useStore();

const categoryList = computed(() => Store.state.category.list);

const showSubcategory = (id) => {
    Store.commit("category/show", id);
};
const hideSubcategory = (id) => {
    Store.commit("category/hide", id);
};
</script>

<style lang="less" scoped>
.app-header-navs {
    width: 820px;
    display: flex;
    justify-content: space-around;
    padding-left: 40px;
    position: relative;
    z-index: 999;
    > li {
        margin-right: 40px;
        width: 38px;
        text-align: center;
        > a {
            font-size: 16px;
            line-height: 32px;
            height: 32px;
            display: inline-block;
        }
        &:hover {
            > a {
                color: @xtxColor;
                border-bottom: 1px solid @xtxColor;
            }
        }
    }
}

.layer {
    &.open {
        height: 132px;
        opacity: 1;
    }
    width: 1240px;
    background-color: #fff;
    position: absolute;
    left: -200px;
    top: 56px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 0 5px #ccc;
    transition: all 0.2s 0.1s;
    ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 70px;
        align-items: center;
        height: 132px;
        li {
            width: 110px;
            text-align: center;
            img {
                width: 60px;
                height: 60px;
            }
            p {
                padding-top: 10px;
            }
            &:hover {
                p {
                    color: @xtxColor;
                }
            }
        }
    }
}





</style>