<template>
    <div class="xtx-goods-page">
        <div class="container">
            <!-- 面包屑 -->
            <XtxBread v-if="data">
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <XtxBreadItem :to="`/category/${goods_breads.top.id}`">{{goods_breads.top?.name}}</XtxBreadItem>
                <XtxBreadItem
                    :to="`/category/sub/${goods_breads.sub.id}`"
                >{{goods_breads.sub?.name}}</XtxBreadItem>
                <XtxBreadItem>{{ goods_breads.curr }}</XtxBreadItem>
            </XtxBread>
            <!-- 商品信息 -->
            <div class="goods-info">
                <div class="media">
                    <GoodsImage :images="data?.mainPictures" />
                    <GoodsSales />
                </div>
                <div class="spec" v-if="data">
                    <!-- 商品信息 -->
                    <GoodsNameInfo :goods="data"></GoodsNameInfo>
                    <GoodsSku :goods="data" @change="changeSku"></GoodsSku>
                    <XtxNumbox v-model="num" :max="data.inventory">数量</XtxNumbox>
                    <XtxButton @click="insertCart()" type="primary" style="margin-top:20px;">加入购物车</XtxButton>
                </div>
            </div>
            <!-- 商品推荐 -->
            <GoodsRelevant />
            <!-- 商品详情 -->
            <div class="goods-footer">
                <div class="goods-article">
                    <!-- 商品+评价 -->
                    <div class="goods-tabs"></div>
                    <!-- 注意事项 -->
                    <div class="goods-warn"></div>
                </div>
                <!-- 24热榜+专题推荐 -->
                <div class="goods-aside"></div>
            </div>
        </div>
    </div>
</template>

<script setup name="XtxGoodsPage">
import GoodsRelevant from "./components/goods-relevant";
import GoodsImage from "./components/goods-images";
import GoodsSales from "./components/goods-sales.vue";
import GoodsNameInfo from "./components/goods-name.vue";
import GoodsSku from "./components/goods-sku.vue";

import { computed, reactive, watch, ref } from "vue";

import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useGoods } from "@/hooks/goods";

import Message from "@/components/library/Message";

const Route = useRoute();
const Store = useStore();

/**
 *  商品面包屑 数据搜集
 */
const goods_breads = reactive({
    top: {},
    sub: {},
    curr: "",
});
const goods_id = computed(() => Route.params.id);
const { error, data } = useGoods(goods_id);
watch(data, () => {
    if (!error.value) {
        data.value?.categories.some((item) => {
            goods_breads.top = item.parent;
            goods_breads.sub = item;
            goods_breads.curr = data.value.name;
            return true;
        });
    }
});

const num = ref(1);
const currSku_goods = ref(null);

const changeSku = (currSku_info) => {
    // 修改商品的现价原价库存信息
    if (currSku_info.skuId) {
        data.value.price = currSku_info.price;
        data.value.oldPrice = currSku_info.oldPrice;
        data.value.inventory = currSku_info.inventory;
    }
    // 当前选中的 sku 商品信息 + 规格
    currSku_goods.value = currSku_info;
};

/**
 * 加入购物车
 */
const insertCart = () => {
    if (currSku_goods.value && currSku_goods.value.skuId) {
        // id skuId name attrsText picture price nowPrice selected stock count isEffective
        const {
            skuId,
            specsText: attrsText,
            inventory: stock,
        } = currSku_goods.value; // 当前有效 sku 商品信息
        const { id, name, price, mainPictures } = data.value; // 商品信息

        Store.dispatch("cart/insertCart", {
            skuId,
            attrsText,
            stock,
            id,
            name,
            price,
            nowPrice: price,
            picture: mainPictures[0],
            selected: true,
            isEffective: true,
            count: num.value,
        }).then(() => {
            Message({ type: "success", text: "加入购物车成功" });
        });
    } else {
        Message({ text: "请选择有效规格商品" });
    }
};
</script>

<style scoped lang="less">
.goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;
    .media {
        width: 580px;
        height: 600px;
        padding: 30px 50px;
    }
    .spec {
        flex: 1;
        padding: 30px 30px 30px 0;
    }
}
.goods-footer {
    display: flex;
    margin-top: 20px;
    .goods-article {
        width: 940px;
        margin-right: 20px;
    }
    .goods-aside {
        width: 280px;
        min-height: 1000px;
    }
}
.goods-tabs {
    min-height: 600px;
    background: #fff;
}
.goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
}




</style>
