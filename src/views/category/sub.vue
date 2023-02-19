<template>
    <div class="sub-categroy">
        <div class="container">
            <!-- 面包屑 -->
            <SubBread />
            <!-- 筛选区 -->
            <SubFilter @filter="filterData" />
            <!-- 商品面板（排序+列表） -->
            <div class="goods-list">
                <SubSort @sort-change="sortChange" />
                <ul>
                    <li v-for="goods in goodsList" :key="goods.id">
                        <GoodsItem :goods="goods" />
                    </li>
                </ul>
                <!-- 无限加载组件 -->
                <XtxList :loading="loading" :finished="finished" @infinite="getData" />
            </div>
        </div>
    </div>
</template>
<script setup name='SubCategory'>
import SubBread from "./components/sub-bread";
import SubFilter from "./components/sub-filter";
import SubSort from "./components/sub-sort";
import GoodsItem from "./components/goods-item";
import { ref, watch, nextTick } from "vue";
import { findSubCategoryGoods } from "@/api/category";
import { useRoute } from "vue-router";

import { awaitWrap } from "@/utils/utils";

const route = useRoute();
// 加载中
const loading = ref(false);
// 是否加载完毕
const finished = ref(false);
// 商品列表数据
const goodsList = ref([]);

// 请求参数
let Params = {
    page: 1,
    pageSize: 20,
};
const getData = () => {
    loading.value = true;
    // 设置二级分类的ID
    Params.categoryId = route.params.subId;
    awaitWrap(findSubCategoryGoods(Params)).then(([err, { result }]) => {
        // 获取数据成功
        if (!err) {
            if (result.items.length) {
                // 有数据就追加数据
                goodsList.value.push(...result.items);
                // 把page改成下一页页码
                Params.page++;
            } else {
                // 没有数据，代表加载完成
                finished.value = true;
                loading.value = false;
                return;
            }
            loading.value = false;
        }
    });
};

watch(
    () => route.params.subId,
    (newValue) => {
        if (newValue && route.meta["Category-type"] == "Sub-Categories") {
            finished.value = false;
            goodsList.value = [];
            Params = {
                page: 1,
                pageSize: 20,
            };
        }
    }
);

// 1. 更改排序组件的筛选数据，重新请求
const sortChange = (sortParams) => {
    finished.value = false;
    Params = Object.assign(Params, sortParams, {
        page: 1,
    });
    goodsList.value = [];
    nextTick(() => {
        getData();
    });
};
// 1.filterData 过滤数据

const filterData = (filterParams) => {
    finished.value = false;
    goodsList.value = [];
    Params = Object.assign(Params, filterParams, {
        page: 1,
    });
    nextTick(() => {
        getData();
    });
};
</script>
<style scoped lang="less">
.goods-list {
    background: #fff;
    padding: 0 25px;
    margin-top: 25px;
    ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 5px;
        li {
            margin-right: 20px;
            margin-bottom: 20px;
            &:nth-child(5n) {
                margin-right: 0;
            }
        }
    }
}

</style>
