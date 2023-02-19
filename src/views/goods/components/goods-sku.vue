<template>
    <div class="goods-sku">
        <dl v-for="item in goods.specs" :key="item.id">
            <dt>{{item.name}}</dt>
            <dd>
                <template v-for="val in item.values" :key="val.name">
                    <img
                        @click="changeSku(val,item)"
                        v-if="val.picture"
                        :src="val.picture"
                        :class="{selected:val.selected,disabled:val.isdisabled}"
                        :title="val.name"
                    />
                    <span
                        @click="changeSku(val,item)"
                        :class="{selected:val.selected,disabled:val.isdisabled}"
                        v-else
                    >{{val.name}}</span>
                </template>
            </dd>
        </dl>
    </div>
</template>
<script setup  name='GoodsSku'>
import bwPowerSet from "@/vender/power-set";

const props = defineProps({
    goods: {
        type: Object,
        default: () => ({}),
        required: true,
    },
    skuId: {
        type: String,
        default: "",
    },
});

const Emits = defineEmits(["change"]);

// 1.  选中与 取消选中
const changeSku = (val, item) => {
    // 当按钮是禁用的阻止程序运行
    if (val.isdisabled) return;
    if (val.selected) {
        val.selected = false;
    } else {
        item.values.forEach((sku) => (sku.selected = false));
        val.selected = true;
    }
    // ☆点击按钮时：更新按钮禁用状态
    updateDisabledStatus();

    // !将你选择的sku信息通知父组件 {skuId,price,oldPrice,inventory,specsText}
    // 1. 选择完整的sku组合按钮，才可以拿到这些信息，提交父组件
    // 2. 不是完整的sku组合按钮，提交空对象父组件

    const validSelectedValues = getSelectedValues().filter(Boolean);
    if (validSelectedValues.length === props.goods.specs.length) {
        // 获取完整 skuIDs
        const skuIds = getPathMap[validSelectedValues.join(spliter)];
        const sku = props.goods.skus.find((sku) => sku.id === skuIds[0]);

        Emits("change", {
            skuId: sku.id,
            price: sku.price,
            oldPrice: sku.oldPrice,
            inventory: sku.inventory,
            // 属性名：属性值 属性名1：属性值1 ... 这样的字符串
            specsText: sku.specs
                .reduce((p, c) => `${p} ${c.name}：${c.valueName}`, "")
                .trim(),
        });
    } else {
        Emits("change", {});
    }
};

// 1. 设置路径字典

const getPathMap = {};
const spliter = "★";

props.goods.skus.forEach((sku) => {
    if (sku.inventory > 0) {
        // 可选值数组
        const valueArr = sku.specs.map((val) => val.valueName);
        // 可选值数组 子集
        const valueArrPowerSet = bwPowerSet(valueArr);
        valueArrPowerSet.forEach((key) => {
            const voild_key = key.join(spliter);
            if (getPathMap[voild_key]) {
                getPathMap[voild_key].push(sku.id);
            } else {
                getPathMap[voild_key] = [sku.id];
            }
        });
    }
});

// 获取已选中的值数组
const getSelectedValues = () => {
    const arr = [];
    props.goods.specs.forEach((item) => {
        // 选中的按钮对象
        const seletedVal = item.values.find((val) => val.selected);
        arr.push(seletedVal ? seletedVal.name : undefined);
    });
    return arr;
};

/**
 * 1. 初始化 禁用按钮
 */

const updateDisabledStatus = () => {
    props.goods.specs.forEach((item, index) => {
        const selectedValues = getSelectedValues();
        item.values.forEach((val) => {
            // 1. 判断当前是否选中
            if (val.selected) return;
            // 2. 过滤 undefined
            selectedValues[index] = val.name;
            const key = selectedValues.filter((value) => value).join(spliter);
            val.isdisabled = !getPathMap[key];
        });
    });
};

/**
 *  默认选中的 sku
 */
const initDefaultSelected = () => {
    const voild_Sku = props.goods.skus.find((val) => val.id == props.skuId);
    props.goods.specs.forEach((item, i) => {
        item.values.find((v) => {
            if (v.name == voild_Sku.specs[i].valueName) {
                v.selected = true;
                return v;
            }
        });
    });
};

/**
 * 先默认选中，在处理是否合规
 */
if (props.skuId) {
    initDefaultSelected();
}
updateDisabledStatus();
</script>
<style scoped lang="less">
.sku-state-mixin () {
    border: 1px solid #e4e4e4;
    margin-right: 10px;
    cursor: pointer;
    &.selected {
        border-color: @xtxColor;
    }
    &.disabled {
        opacity: 0.6;
        border-style: dashed;
        cursor: not-allowed;
    }
}
.goods-sku {
    padding-left: 10px;
    padding-top: 20px;
    dl {
        display: flex;
        padding-bottom: 20px;
        align-items: center;
        dt {
            width: 50px;
            color: #999;
        }
        dd {
            flex: 1;
            color: #666;
            > img {
                width: 50px;
                height: 50px;
                .sku-state-mixin ();
            }
            > span {
                display: inline-block;
                height: 30px;
                line-height: 28px;
                padding: 0 20px;
                margin-top: 10px;
                .sku-state-mixin ();
            }
        }
    }
}

</style>