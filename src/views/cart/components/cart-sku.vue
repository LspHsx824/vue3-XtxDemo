<template>
    <div class="cart-sku">
        <div class="attrs" @click="toggle">
            <span class="ellipsis">{{ attrsText }}</span>
            <i class="iconfont icon-angle-down"></i>
        </div>
        <div class="layer" v-if="visible">
            <div class="loading" v-if="loading"></div>
            <template v-else>
                <div class="bg" @click="hideMask()"></div>
                <GoodsSku @change="resetSku" :goods="goods" :skuId="skuId"></GoodsSku>
                <XtxButton
                    @click="submitReset"
                    type="primary"
                    size="mini"
                    style="margin-left: 60px"
                >确认</XtxButton>
            </template>
        </div>
    </div>
</template>
<script setup name="CartSku">
import GoodsSku from "@/views/goods/components/goods-sku.vue";

import { ref } from "vue";

import { getSpecsAndSkus } from "@/api/cart";
import { awaitWrap } from "@/utils/utils";

const props = defineProps(["skuId", "attrsText"]);
const Emit = defineEmits(["change"]);

const visible = ref(false);
const goods = ref(null);

const loading = ref(false);

const show = async () => {
    visible.value = true;
    loading.value = true;
    const [err, { result }] = await awaitWrap(getSpecsAndSkus(props.skuId));
    if (err) return (visible.value = false);
    goods.value = result;
    loading.value = false;
};

const hide = () => {
    visible.value = false;
};
const toggle = () => {
    visible.value ? hide() : show();
};

// 重新 选择 sku 商品的规格

const newSku = ref(null);
const resetSku = (skuObj) => {
    newSku.value = skuObj;
};

const submitReset = () => {
    if (newSku.value?.skuId && newSku.value.skuId != props.skuId) {
        Emit("change", newSku.value);
        hide();
        return;
    }
};

//隐藏遮罩层
const hideMask = () => {
    hide();
};
</script>
<style scoped lang="less">
.bg {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: -1;
    background-color: rgba(0, 0, 0, 0);
}

.cart-sku {
    height: 28px;
    border: 1px solid #f5f5f5;
    padding: 0 6px;
    position: relative;
    margin-top: 10px;
    display: inline-block;
    .attrs {
        line-height: 24px;
        display: flex;
        span {
            max-width: 230px;
            font-size: 14px;
            color: #999;
        }
        i {
            margin-left: 5px;
            font-size: 14px;
        }
    }
    .layer {
        position: absolute;
        left: -1px;
        top: 40px;
        z-index: 10;
        width: 400px;
        border: 1px solid @xtxColor;
        box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
        background: #fff;
        border-radius: 4px;
        font-size: 14px;
        padding: 20px;
        &::before {
            content: "";
            width: 12px;
            height: 12px;
            border-left: 1px solid @xtxColor;
            border-top: 1px solid @xtxColor;
            position: absolute;
            left: 12px;
            top: -8px;
            background: #fff;
            transform: scale(0.8, 1) rotate(45deg);
        }
        .loading {
            height: 224px;
            background: url(../../../assets/images/loading.gif) no-repeat center;
        }
    }
}

</style>
