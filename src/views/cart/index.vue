<template>
    <div class="xtx-cart-page">
        <div class="container">
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <XtxBreadItem>购物车</XtxBreadItem>
            </XtxBread>
            <div class="cart">
                <table>
                    <thead>
                        <tr>
                            <th width="120">
                                <!-- <XtxCheckbox v-model="isCheckAll">全选</XtxCheckbox> -->
                                <XtxCheckbox :modelValue="isCheckAll" @change="updateCheckAll">全选</XtxCheckbox>
                            </th>
                            <th width="400">商品信息</th>
                            <th width="220">单价</th>
                            <th width="180">数量</th>
                            <th width="180">小计</th>
                            <th width="140">操作</th>
                        </tr>
                    </thead>
                    <!-- 有效商品 -->
                    <tbody>
                        <tr colspan="6" v-if="ValidList.length==0">
                            <td colspan="6">
                                <CartNone />
                            </td>
                        </tr>
                        <tr v-for="validItem in ValidList" :key="validItem.skuId">
                            <td>
                                <!-- 单选 -->
                                <XtxCheckbox
                                    :modelValue="validItem.selected"
                                    @change="($event)=> updateSelected(validItem.skuId,$event)"
                                />
                            </td>
                            <td>
                                <div class="goods">
                                    <RouterLink to="/">
                                        <img :src="validItem.picture" alt />
                                    </RouterLink>
                                    <div>
                                        <p class="name ellipsis">{{ validItem.name }}</p>
                                        <!-- 选择规格组件 -->
                                        <CartSku
                                            @change="$event=> resetSkuInfo(validItem,$event)"
                                            :attrsText="validItem.attrsText"
                                            :skuId="validItem.skuId"
                                        ></CartSku>
                                    </div>
                                </div>
                            </td>
                            <td class="tc">
                                <p>&yen;{{ validItem.nowPrice }}</p>
                                <p v-if="validItem.price - validItem.nowPrice > 0">
                                    比加入时降价
                                    <span
                                        class="red"
                                    >&yen;{{ validItem.price - validItem.nowPrice }}</span>
                                </p>
                            </td>
                            <td class="tc">
                                <XtxNumbox
                                    @change="($event)=> updateCount(validItem.skuId,$event)"
                                    :modelValue="validItem.count"
                                    :max="validItem.stock"
                                />
                            </td>
                            <td class="tc">
                                <p
                                    class="f16 red"
                                >&yen;{{vakudpPriceSum(validItem.nowPrice,validItem.count)}}</p>
                            </td>
                            <td class="tc">
                                <p>
                                    <a href="javascript:;">移入收藏夹</a>
                                </p>
                                <p>
                                    <a
                                        class="green"
                                        href="javascript:;"
                                        @click="deleteGoods(validItem.skuId)"
                                    >删除</a>
                                </p>
                                <p>
                                    <a href="javascript:;">找相似</a>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                    <!-- 无效商品 -->
                </table>
            </div>
            <!-- 操作栏 -->
            <div class="action">
                <div class="batch">
                    <!-- <XtxCheckbox v-model="isCheckAll">全选</XtxCheckbox> -->
                    <XtxCheckbox :modelValue="isCheckAll" @change="updateCheckAll">全选</XtxCheckbox>
                    <a href="javascript:;" @click="batchDeleteCart()">删除商品</a>
                    <a href="javascript:;">移入收藏夹</a>
                    <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
                </div>
                <div class="total">
                    共 {{ ValidList.length}} 件商品，已选择 {{SelectedTotal}} 件，商品合计：
                    <span
                        class="red"
                    >¥{{SelectedAmount.toFixed(2)}}</span>
                    <XtxButton type="primary" @click="Settlement()">下单结算</XtxButton>
                </div>
            </div>
            <!-- 猜你喜欢 -->
            <!-- <GoodRelevant /> -->
        </div>
    </div>
    <XtxConfirm v-if="show" @cancel="show=false">
        <i class="iconfont icon-warning"></i>
        <span>您确认从购物车删除该商品吗？</span>
    </XtxConfirm>
</template>
<script setup name="XtxCartPage">
import CartNone from "./components/cart-none.vue";
import CartSku from "./components/cart-sku.vue";

import { evaluate } from "mathjs";

import { computed, ref, warn } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import Message from "@/components/library/Message";
import Confirm from "@/components/library/Confirm";

const $store = useStore();
const $router = useRouter();

const show = ref(false);

// console.log(evaluate("0.1+0.2").toFixed(2));

/**
 * Vuex 数据在组件中是 只读的！
 */

/**
 * 全选 or 取消全选
 * 计算属性不应该修改。
const isCheckAll = computed({
    get: () => $store.getters["cart/isCheckAll"],
    set: (newStatus) => $store.dispatch("cart/checkAllGoods", newStatus),
});

 */
const isCheckAll = computed(() => $store.getters["cart/isCheckAll"]);

const updateCheckAll = (newStatus) => {
    $store.dispatch("cart/checkAllGoods", newStatus);
};

//有效商品
const ValidList = computed(() => $store.getters["cart/ValidList"]);
// 无效商品
const inValidList = computed(() => $store.getters["cart/inValidList"]);
const SelectedAmount = computed(() => $store.getters["cart/SelectedAmount"]);
const SelectedTotal = computed(() => $store.getters["cart/SelectedTotal"]);

// 更新 单个商品 选中
const updateSelected = (skuId, done) => {
    $store.dispatch("cart/singeSelected", { skuId, selected: done });
};

// 单个商品删除
const deleteGoods = (skuId) => {
    Confirm({ message: "亲，您确认要删除改商品吗？" })
        .then(() => {
            $store.dispatch("cart/deleteSigeGoods", skuId).then(() => {
                Message({ type: "success", text: "删除成功" });
            });
        })
        .catch((err) => {});
    // show.value = true;
};

// 商品 批量删除
const batchDeleteCart = (isClear) => {
    const message = `亲，您是否确认删除${isClear ? "失效" : "选中"}的商品`;
    const text = isClear ? "无效商品已清除" : "删除成功";
    Confirm({ message })
        .then(() => {
            $store.dispatch("cart/batchDeleteCart", isClear).then(() => {
                Message({ type: "success", text, timeout: 800 });
            });
        })
        .catch((err) => {});
};

// 单个商品的数量
const updateCount = (skuId, count) => {
    $store.dispatch("cart/singeSelected", { skuId, count });
};

// 重置有效的 sku 信息

const resetSkuInfo = (oldSkuInfo, newSkuInfo) => {
    $store.dispatch("cart/updateGoodsSku", { oldSkuInfo, newSkuInfo });
};

const vakudpPriceSum = (price, count) => {
    return evaluate(`${count}*${price}`).toFixed(2);
};

/**
 * 结算：
 *  1. 先判断是否有选中商品.
 */

const Settlement = () => {
    const sum = SelectedTotal.value;
    if (sum <= 0) {
        Message({ type: "error", text: "请选择想要购买的商品！" });
        return;
    }
    const token = $store.state.user.profile?.token;
    if (!token) {
        Confirm({
            title: "访问提示",
            message: "下单结算需要登录，您是否去登录？",
        })
            .then(() => {
                return $router.push("/member/checkout");
            })
            .catch((err) => {
                console.warn(err);
            });
        return;
    }
    $router.push("/member/checkout");
};

</script>
<style scoped lang="less">
.tc {
    text-align: center;
    .xtx-numbox {
        margin: 0 auto;
        width: 120px;
    }
}
.red {
    color: @priceColor;
}
.green {
    color: @xtxColor;
}
.f16 {
    font-size: 16px;
}
.goods {
    display: flex;
    align-items: center;
    img {
        width: 100px;
        height: 100px;
    }
    > div {
        width: 280px;
        font-size: 16px;
        padding-left: 10px;
        .attr {
            font-size: 14px;
            color: #999;
        }
    }
}
.action {
    display: flex;
    background: #fff;
    margin-top: 20px;
    height: 80px;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    padding: 0 30px;
    .xtx-checkbox {
        color: #999;
    }
    .batch {
        a {
            margin-left: 20px;
        }
    }
    .red {
        font-size: 18px;
        margin-right: 20px;
        font-weight: bold;
    }
}
.tit {
    color: #666;
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
}
.xtx-cart-page {
    .cart {
        background: #fff;
        color: #666;
        table {
            border-spacing: 0;
            border-collapse: collapse;
            line-height: 24px;
            th,
            td {
                padding: 10px;
                border-bottom: 1px solid #f5f5f5;
                &:first-child {
                    text-align: left;
                    padding-left: 30px;
                    color: #999;
                }
            }
            th {
                font-size: 16px;
                font-weight: normal;
                line-height: 50px;
            }
        }
    }
}



</style>
W
