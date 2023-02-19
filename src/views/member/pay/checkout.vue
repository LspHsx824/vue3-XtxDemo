
<script setup name='XtxPayCheckoutPage'>
import CheckoutAddress from "./components/checkout-address";
import CartNone from "../../cart/components/cart-none";

import { ref, reactive, watch } from "vue";

import { useRouter } from "vue-router";
const $router = useRouter();

import { useFetch } from "@/hooks/order";

import { createOrder, findCheckoutInfo } from "@/api/order";
import Message from "@/components/library/Message";
import { awaitWrap } from "@/utils/utils";

/**
 * 使用 use api 获取订单信息
 */
const { loading, data, error } = useFetch({
    api: findCheckoutInfo,
});

watch(
    () => data,
    (newValue) => {
        if (newValue) {
            submitOrderInfo.goods = newValue.value.goods?.map(
                ({ skuId, count }) => ({
                    skuId,
                    count,
                })
            );
            testAdsList.value = newValue.value.userAddresses;
        }
    },
    { deep: true }
);

/**
 *  备用  提交订单 表单数据。
 */

let submitOrderInfo = reactive({
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: "",
    // 商品信息，获取订单信息后设置
    goods: [],
    // 收货地址，切换收货地址或者组件默认的时候设置
    addressId: null,
});

// 提交订单 按钮控制， 防止多次下单

let submitBtn = reactive({
    text: "提交订单",
    loading: false,
    disabled: false,
});

// 获取当前地址 id
const getOrderAdsId = (adsId) => (submitOrderInfo.addressId = adsId);

const testAdsList = ref([]);

// 获取当前地址 信息
const getAdsInfo = (payload) => {
    switch (payload.type) {
        case "selectAds": {
            return (submitOrderInfo = Object.assign(
                submitOrderInfo,
                payload.data
            ));
        }
        case "insertAds": {
            return testAdsList.value.unshift(payload.data);
        }
        case "editAddress": {
            let editAds = testAdsList.value.find(
                (ads) => payload.data.id == ads.id
            );
            if (editAds) {
                for (const key in payload.data) {
                    editAds[key] = payload.data[key];
                }
            }
        }
    }
};

const submitOrderFn = async () => {
    if (!submitOrderInfo.addressId) {
        return Message({ text: "亲，请选择收货地址" });
    } else {
        submitBtn.text = "订单生成中";
        submitBtn.loading = true;
        submitBtn.disabled = true;
        const [err, { result }] = await awaitWrap(createOrder(submitOrderInfo));
        if (err) {
            console.warn(err.response.data.message);
            $router.replace({
                path: "/",
            });
        } else {
            // 提交订单成功
            Message({ type: "success", text: "提交订单成功" });
            $router.push({
                path: "/member/pay",
                query: {
                    id: result.id,
                },
            });
        }
    }
};
</script>

<template>
    <div class="xtx-pay-checkout-page">
        <div class="container">
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <XtxBreadItem to="/cart">购物车</XtxBreadItem>
                <XtxBreadItem>填写订单</XtxBreadItem>
            </XtxBread>

            <div class="loading" v-if="loading"></div>

            <div class="wrapper" v-else>
                <!-- 收货地址 -->
                <!-- :addressList="data?.userAddresses" -->

                <CheckoutAddress
                    @changeOrderAdsId="getOrderAdsId"
                    @changeAdsInfo="getAdsInfo"
                    :addressList="testAdsList"
                ></CheckoutAddress>
                <!-- 商品信息 -->
                <h3 class="box-title">商品信息</h3>
                <div class="box-body">
                    <CartNone v-if="error"></CartNone>
                    <table v-else class="goods">
                        <thead>
                            <tr>
                                <th width="520">商品信息</th>
                                <th width="170">单价</th>
                                <th width="170">数量</th>
                                <th width="170">小计</th>
                                <th width="170">实付</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in data?.goods" :key="item.skuId">
                                <td>
                                    <a href="javascript:;" class="info">
                                        <img :src="item.picture" alt />
                                        <div class="right">
                                            <p>{{item.name}}</p>
                                            <p>{{item.attrsText}}</p>
                                        </div>
                                    </a>
                                </td>
                                <td>&yen;{{item.price}}</td>
                                <td>{{item.count}}</td>
                                <td>&yen;{{item.totalPayPrice}}</td>
                                <td>&yen;{{item.payPrice}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 配送时间 -->
                <template v-if="!error">
                    <h3 class="box-title">配送时间</h3>
                    <div class="box-body">
                        <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
                        <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
                        <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
                    </div>
                    <!-- 支付方式 -->
                    <h3 class="box-title">支付方式</h3>
                    <div class="box-body">
                        <a class="my-btn active" href="javascript:;">在线支付</a>
                        <a class="my-btn" href="javascript:;">货到付款</a>
                        <span style="color:#999">货到付款需付5元手续费</span>
                    </div>
                    <!-- 金额明细 -->
                    <h3 class="box-title">金额明细</h3>
                    <div class="box-body">
                        <div class="total">
                            <dl>
                                <dt>商品件数：</dt>
                                <dd>{{data?.summary.goodsCount}}件</dd>
                            </dl>
                            <dl>
                                <dt>商品总价：</dt>
                                <dd>¥{{data?.summary.totalPrice}}</dd>
                            </dl>
                            <dl>
                                <dt>
                                    运
                                    <i></i>费：
                                </dt>
                                <dd>¥{{data?.summary.postFee.toFixed(2)}}</dd>
                            </dl>
                            <dl>
                                <dt>应付总额：</dt>
                                <dd class="price">¥{{data?.summary.totalPayPrice.toFixed(2)}}</dd>
                            </dl>
                        </div>
                    </div>
                    <!-- 提交订单 -->
                    <div class="submit">
                        <XtxButton
                            type="primary"
                            @click="submitOrderFn"
                            :disabled="submitBtn.disabled"
                        >{{submitBtn.text}}</XtxButton>
                    </div>
                </template>
            </div>

            <Xtx-Dialog
                v-model:visible="submitBtn.loading"
                title="提交订单"
                width="450"
                :showButton="false"
                closeOnClickOverlay
                :showExit="false"
            >
                <div>
                    <img src="@/assets/images/load.gif" alt />
                    <span style="color:red;font-size:1.5rem">订单生成中。。。</span>
                </div>
            </Xtx-Dialog>
        </div>
    </div>
</template>

<style scoped lang="less">
.loading {
    height: 448px;
    background: url(../../../assets/images/loading.gif) no-repeat center;
}
.xtx-pay-checkout-page {
    .wrapper {
        background: #fff;
        padding: 0 20px;
        .box-title {
            font-size: 16px;
            font-weight: normal;
            padding-left: 10px;
            line-height: 70px;
            border-bottom: 1px solid #f5f5f5;
        }
        .box-body {
            padding: 20px 0;
        }
    }
}

.goods {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    .info {
        display: flex;
        text-align: left;
        img {
            width: 70px;
            height: 70px;
            margin-right: 20px;
        }
        .right {
            line-height: 24px;
            p {
                &:last-child {
                    color: #999;
                }
            }
        }
    }
    tr {
        th {
            background: #f5f5f5;
            font-weight: normal;
        }
        td,
        th {
            text-align: center;
            padding: 20px;
            border-bottom: 1px solid #f5f5f5;
            &:first-child {
                border-left: 1px solid #f5f5f5;
            }
            &:last-child {
                border-right: 1px solid #f5f5f5;
            }
        }
    }
}
.my-btn {
    width: 228px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-right: 25px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
        border-color: @xtxColor;
    }
}
.total {
    dl {
        display: flex;
        justify-content: flex-end;
        line-height: 50px;
        dt {
            i {
                display: inline-block;
                width: 2em;
            }
        }
        dd {
            width: 240px;
            text-align: right;
            padding-right: 70px;
            &.price {
                font-size: 20px;
                color: @priceColor;
            }
        }
    }
}
.submit {
    text-align: right;
    padding: 60px;
    border-top: 1px solid #f5f5f5;
}

</style>