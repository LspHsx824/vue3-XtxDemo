<template>
    <XtxDialog title="取消订单" v-model:visible="visibleDialog" :titleLeft="true" width="620">
        <!-- 组件内容 -->
        <div class="cancel-info">
            <p :style="{color:'red'}">取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
            <p class="tip">请选择取消订单的原因（必选）：</p>
            <div class="btn">
                <a
                    @click="curText = item"
                    v-for="item in cancelReason"
                    :key="item"
                    href="javascript:;"
                    :class="{ active: curText === item }"
                >{{ item }}</a>
            </div>
        </div>
        <!-- 按钮操作 -->
        <template #footer>
            <XtxButton type="gray" style="margin-right:20px" @click="close">取消</XtxButton>
            <XtxButton type="primary" @click="submit">确认</XtxButton>
        </template>
    </XtxDialog>
</template>
<script setup name='OrderCancel' >
import { ref } from "vue";

import { cancelReason } from "@/api/constants";
import { cancelOrder } from "@/api/order";
import Message from "@/components/library/Message";

const visibleDialog = ref(false);
const order = ref(null);

const open = (item) => {
    visibleDialog.value = true;
    curText.value = "";
    order.value = item;
};
const curText = ref("");

const close = () => {
    visibleDialog.value = false;
    curText.value = "";
};

// 确认取消
const submit = () => {
    if (!curText.value) return Message({ text: "亲，请选择取消原因" });
    cancelOrder({
        orderId: order.value.id,
        cancelReason: curText.value,
    })
        .then(() => {
            Message({ type: "success", text: "取消订单成功" });
            order.value.orderState = 6;
            visibleDialog.value = false;
        })
        .catch((err) => {
            console.warn(err);
            visibleDialog.value = false;
        });
};

/**
 *  !vue3 setup 单文件组件实例 是不暴露的， Proxy{__v_skip: true, open: ƒ}
 * 需要使用 defineExpose 属性单独暴露出来。
 * */
defineExpose({
    open,
});
</script>
<style scoped lang="less">
.cancel-info {
    p {
        font-size: 16px;
        line-height: 35px;
        margin-left: 20px;
        &.tip {
            color: #999;
        }
    }
    .btn {
        padding-top: 21px;
        margin: 0 15px;
        display: flex;
        flex-wrap: wrap;
        a {
            width: 256px;
            height: 45px;
            line-height: 45px;
            text-align: center;
            background-color: #ffffff;
            border: 1px solid #e4e4e4;
            margin-right: 20px;
            margin-bottom: 20px;
            color: #666;
            &:nth-child(2n) {
                margin-right: 0;
            }
            &:hover,
            &.active {
                background-color: #e3f9f4;
                border-color: @xtxColor;
            }
        }
    }
}

</style>