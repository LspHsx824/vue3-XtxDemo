 <template>
    <div class="order-list">
        <div class="order-item">
            <div class="head">
                <span>下单时间：{{order.createTime}}</span>
                <span>订单编号：{{order.id}}</span>
                <template v-if="order.orderState === 1">
                    <span class="down-time">
                        <i class="iconfont icon-down-time"></i>
                        <b>
                            付款截止：
                            <span class="red">{{timeTrxText}}</span>
                        </b>
                    </span>
                </template>
                <a
                    href="javascript:;"
                    class="del"
                    v-if="[5,6].includes(order.orderState)"
                    @click="deleteOrder(order)"
                >删除</a>
            </div>
            <div class="body">
                <div class="column goods">
                    <ul>
                        <li v-for="goods in order.skus" :key="goods.id">
                            <Router-link class="image" :to="`/product/${goods.spuId}`">
                                <img :src="goods.image" alt />
                            </Router-link>
                            <div class="info">
                                <p class="name ellipsis-2">{{goods.name}}</p>
                                <p class="attr ellipsis">
                                    <span>{{goods.attrsText}}</span>
                                </p>
                            </div>
                            <div class="price">¥{{goods.realPay}}</div>
                            <div class="count">x{{goods.quantity}}</div>
                        </li>
                    </ul>
                </div>
                <div class="column state">
                    <template v-if="order.orderState==2">
                        <XtxButton
                            :style="{width:'85px'}"
                            @click="sellGoods(order.id)"
                            type="primary"
                            size="small"
                        >发货</XtxButton>
                    </template>
                    <p>{{orderStatus[order.orderState].label}}</p>
                    <Info></Info>
                </div>
                <div class="column amount">
                    <p class="red">¥{{order.payMoney}}</p>
                    <p>（含运费：¥{{order.postFee}}）</p>
                    <p>在线支付</p>
                </div>
                <div class="column action">
                    <template v-if="order.orderState===1">
                        <XtxButton
                            type="primary"
                            size="small"
                            @click="$router.push(`/member/pay?id=${order.id}`)"
                        >立即付款</XtxButton>
                    </template>
                    <template v-if="order.orderState===3">
                        <XtxButton type="primary" size="small" @click="confirmGoods(order)">确认收货</XtxButton>
                    </template>
                    <p>
                        <a
                            @click="$router.push(`/member/order/${order.id}`)"
                            href="javascript:;"
                        >查看详情</a>
                    </p>
                    <p v-if="order.orderState===1">
                        <a href="javascript:;" @click="cancelorder(order)">取消订单</a>
                    </p>
                    <p v-if="[2,3,4,5].includes(order.orderState)">
                        <Router-link :to="`/member/checkout?orderId=${order.id}`">再次购买</Router-link>
                    </p>
                    <p v-if="[4,5].includes(order.orderState)">
                        <a href="javascript:;">申请售后</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup name='orderItem'>
import { orderStatus } from "@/api/constants";
import { usePayTime } from "@/hooks";
import { defineComponent } from "vue";

import { orderShipping } from "@/api/order";
import { scrollToTop } from "@/utils/utils";
import Message from "@/components/library/Message";

/**
 * 模拟发货
 */
const sellGoods = async (id) => {
    await orderShipping(id); // 订单状态错误
    Emits("sell-success");
    Message({ type: "success", text: "商家已发货" });
    scrollToTop();
};

const Props = defineProps({
    order: {
        type: Object,
        required: true,
    },
});
const Emits = defineEmits([
    "sell-success",
    "on-cancel",
    "on-delete",
    "on-confirm-order",
]);

//取消订单
const cancelorder = (order) => {
    Emits("on-cancel", order);
};
//删除订单
const deleteOrder = (order) => {
    Emits("on-delete", order);
};
//删除订单
const confirmGoods = (order) => {
    Emits("on-confirm-order", order);
};

const { start, timeTrxText } = usePayTime();

start(Props.order.countdown);
/**
 * 显示信息组件
 */
const Info = defineComponent({
    render() {
        const state = Props.order.orderState;
        if (state === 3) {
            return (
                <p>
                    <a class="green" href="javascript:;">
                        查看物流
                    </a>
                </p>
            );
        } else if (state === 4) {
            return (
                <p>
                    <a class="green" href="javascript:;">
                        评价商品
                    </a>
                </p>
            );
        } else if (state === 5) {
            return (
                <p>
                    <a class="green" href="javascript:;">
                        查看评价
                    </a>
                </p>
            );
        }
        return "";
    },
});
</script>
<style lang='less' scoped>
.order-list {
    background: #fff;
    padding: 20px;
}
.order-item {
    margin-bottom: 20px;
    border: 1px solid #f5f5f5;
    .head {
        height: 50px;
        line-height: 50px;
        background: #f5f5f5;
        padding: 0 20px;
        overflow: hidden;
        span {
            margin-right: 20px;
            &.down-time {
                margin-right: 0;
                float: right;
                i {
                    vertical-align: middle;
                    margin-right: 3px;
                }
                b {
                    vertical-align: middle;
                    font-weight: normal;
                }
            }
        }
        .del {
            margin-right: 0;
            float: right;
            color: #999;
        }
    }
    .red {
        color: @priceColor;
    }
    .body {
        display: flex;
        align-items: stretch;
        .column {
            border-left: 1px solid #f5f5f5;
            text-align: center;
            padding: 20px;
            > p {
                padding-top: 10px;
            }
            &:first-child {
                border-left: none;
            }
            &.goods {
                flex: 1;
                padding: 0;
                align-self: center;
                ul {
                    li {
                        border-bottom: 1px solid #f5f5f5;
                        padding: 10px;
                        display: flex;
                        &:last-child {
                            border-bottom: none;
                        }
                        .image {
                            width: 70px;
                            height: 70px;
                            border: 1px solid #f5f5f5;
                        }
                        .info {
                            width: 220px;
                            text-align: left;
                            padding: 0 10px;
                            p {
                                margin-bottom: 5px;
                                &.name {
                                    height: 38px;
                                }
                                &.attr {
                                    color: #999;
                                    font-size: 12px;
                                    span {
                                        margin-right: 5px;
                                    }
                                }
                            }
                        }
                        .price {
                            width: 100px;
                        }
                        .count {
                            width: 80px;
                        }
                    }
                }
            }
            &.state {
                width: 120px;
                .green {
                    color: @xtxColor;
                }
            }
            &.amount {
                width: 200px;
                .red {
                    color: @priceColor;
                }
            }
            &.action {
                width: 140px;
                a {
                    display: block;
                    &:hover {
                        color: @xtxColor;
                    }
                }
            }
        }
    }
}

</style>
