<template>
    <div class="xtx-pay-page">
        <div class="container">
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <XtxBreadItem to="/cart">购物车</XtxBreadItem>
                <XtxBreadItem>支付订单</XtxBreadItem>
            </XtxBread>
            <!-- 付款信息 -->
            <div class="pay-info" v-if="!loading">
                <span class="icon iconfont icon-queren2"></span>
                <div class="tip">
                    <p>订单提交成功！请尽快完成支付。</p>
                    <p v-if="orderInfo.countdown > -1">
                        支付还剩
                        <span style="color:red" v-if="timeTrxText">{{timeTrxText}}</span>
                        <span v-else class="loading"></span> , 超时后将取消订单
                    </p>
                    <p style="color:red" v-else>
                        订单已超时,
                        <b @click="$router.replace('/')">请重新下单！</b>
                    </p>
                </div>
                <div class="amount">
                    <span>应付总额：</span>
                    <span>¥ {{orderInfo.totalMoney.toFixed(2)}}</span>
                </div>
            </div>
            <!-- 付款方式 -->
            <div class="pay-type">
                <p class="head">选择以下支付方式付款</p>
                <div class="item">
                    <p>支付平台</p>
                    <a class="btn wx" href="javascript:;"></a>
                    <a class="btn alipay" @click="openPayModel" :href="payUrl" target="_blank"></a>
                </div>
                <!-- jfjbwb4477@sandbox.com -->
                <div class="item">
                    <p>支付方式</p>
                    <a class="btn" href="javascript:;">招商银行</a>
                    <a class="btn" href="javascript:;">工商银行</a>
                    <a class="btn" href="javascript:;">建设银行</a>
                    <a class="btn" href="javascript:;">农业银行</a>
                    <a class="btn" href="javascript:;">交通银行</a>
                </div>
            </div>

            <XtxDialog
                title="正在支付..."
                titleLeft
                v-model:visible="visiblePayModel"
                width="600"
                :showButton="false"
                closeOnClickOverlay
                :showExit="false"
            >
                <template #default>
                    <div class="pay-wait">
                        <img src="@/assets/images/load.gif" alt />
                        <div v-if="!loading">
                            <p>如果支付成功：</p>
                            <RouterLink :to="`/member/order/${orderId}`">查看订单详情></RouterLink>
                            <p>如果支付失败：</p>
                            <RouterLink to="/">查看相关疑问></RouterLink>
                        </div>
                    </div>
                </template>
            </XtxDialog>
        </div>
    </div>
</template>
<script setup name='XtxPayPage'>
import { ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import { findOrderDetail } from "@/api/order";

import { awaitWrap } from "@/utils/utils";

// import { useIntervalFn } from "@vueuse/core";
// import { trsUnix } from "@/utils/Dayjs";
import { usePayTime } from "@/hooks";

import { baseURL } from "@/utils/request";

const $route = useRoute();
const $router = useRouter();

console.log($route.query);
const orderId = $route.query?.id;

const loading = ref(true);

let orderInfo = ref(null);

awaitWrap(findOrderDetail(orderId)).then(([err, { result }]) => {
    if (err) return $router.replace("/");
    console.log(result);
    loading.value = false;
    orderInfo.value = result;
    /**
     *  支付倒计时
     */
    result.countdown > -1 && start(result.countdown);
});

const { start, timeTrxText } = usePayTime();

/**
 * 支付流程
 * !. 前端数据不安全，支付金额容易被篡改。 支付流程 主体由后端控制，
 * !. 前端传 订单ID 和 回调地址给后端就行
 */
/**
 *  跳转到支付 页面
 *  !支付页面完整 URL 为  ( 后台服务器基础地址 + 支付页面地址 + 订单ID + 回调地址 (redirectURL) )
 *  后台服务器基础地址  --> baseURL
 *  支付页面地址  --> /pay/aliPay
 *  回调地址 （ 自己设置 ） # 支付地址回调地址（可变）
 */

let visiblePayModel = ref(false);
const callbackURL = "http://www.corho.com:8080/#/pay/callback";

const redirect = encodeURIComponent(callbackURL); // 进行转码
const payUrl = `${baseURL}/pay/aliPay?orderId=${orderId}&redirect=${redirect}`;

const openPayModel = () => (visiblePayModel.value = true);
</script>
<style scoped lang="less">
.pay-wait {
    display: flex;
    justify-content: space-around;
    p {
        margin-top: 30px;
        font-size: 1rem;
    }
    a {
        color: @xtxColor;
    }
}

.pay-info {
    background: #fff;
    display: flex;
    align-items: center;
    height: 240px;
    padding: 0 80px;
    .loading {
        width: 1rem;
        height: 1rem;
        display: inline-block;
        background: url("@/assets/images/loding.png") no-repeat center;
        -webkit-animation: spin 1s linear 1s 5 alternate;
        animation: spin 1s linear infinite;
    }

    .icon {
        font-size: 80px;
        color: #1dc779;
    }
    .tip {
        padding-left: 10px;
        flex: 1;
        p {
            &:first-child {
                font-size: 20px;
                margin-bottom: 5px;
            }
            &:last-child {
                color: #999;
                font-size: 16px;
            }
        }
    }
    .amount {
        span {
            &:first-child {
                font-size: 16px;
                color: #999;
            }
            &:last-child {
                color: @priceColor;
                font-size: 20px;
            }
        }
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.pay-type {
    margin-top: 20px;
    background-color: #fff;
    padding-bottom: 70px;
    p {
        line-height: 70px;
        height: 70px;
        padding-left: 30px;
        font-size: 16px;
        &.head {
            border-bottom: 1px solid #f5f5f5;
        }
    }
    .btn {
        width: 150px;
        height: 50px;
        border: 1px solid #e4e4e4;
        text-align: center;
        line-height: 48px;
        margin-left: 30px;
        color: #666666;
        display: inline-block;
        &.active,
        &:hover {
            border-color: @xtxColor;
        }
        &.alipay {
            background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png)
                no-repeat center / contain;
        }
        &.wx {
            background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg)
                no-repeat center / contain;
        }
    }
}




</style>