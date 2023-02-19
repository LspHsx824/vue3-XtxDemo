<template>
    <div class="sub-sort">
        <div class="sort">
            <a
                href="javascript:;"
                :class="{active:curActive == item.type}"
                v-for="(item,i) in items"
                @click="changeSort(item)"
                :key="i"
            >
                {{item.name}}
                <template v-if="item.icons">
                    <i class="arrow up" :class="{active:FilterCriteria.sortMethod=='asc'}" />
                    <i class="arrow down" :class="{active:FilterCriteria.sortMethod=='desc'}" />
                </template>
            </a>
        </div>
        <div class="check">
            <XtxCheckbox @change="changeCheck" v-model="FilterCriteria.inventory">仅显示有货商品</XtxCheckbox>
            <XtxCheckbox @change="changeCheck" v-model="FilterCriteria.onlyDiscount">仅显示特惠商品</XtxCheckbox>
        </div>
    </div>
</template>
<script setup name='SubSort'>
import { reactive, ref, defineEmits } from "vue";

const Emits = defineEmits(["sort-change"]);

const items = [
    {
        name: "默认排序",
        type: "default",
    },
    {
        name: "最新商品",
        type: "publishTime",
    },
    {
        name: "最高人气",
        type: "orderNum",
    },
    {
        name: "评论最多",
        type: "evaluateNum",
    },
    {
        name: "价格排序",
        type: "price",
        icons: true,
    },
];

const FilterCriteria = reactive({
    inventory: false, //是否显示库存
    onlyDiscount: false, //	只显示特惠
    sortField: null, // 排序字段，取值范围：[publishTime,orderNum,price,evaluateNum]
    sortMethod: null, //排序规则，asc为正序，desc为倒序，默认为desc	排序规则，asc为正序，desc为倒序，默认为desc
});

const curActive = ref("default");

const changeSort = (rule) => {
    curActive.value = rule.type;
    FilterCriteria.sortField = rule.type;
    if (rule.type == "price") {
        if ([null, "desc"].includes(FilterCriteria.sortMethod)) {
            FilterCriteria.sortMethod = "asc";
        } else {
            FilterCriteria.sortMethod = "desc";
        }
    } else {
        FilterCriteria.sortMethod = null;
    }

    Emits("sort-change", FilterCriteria);
};

const changeCheck = () => {
    Emits("sort-change",FilterCriteria)
};
</script>


<style scoped lang='less'>
.sub-sort {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .sort {
        display: flex;
        a {
            height: 30px;
            line-height: 28px;
            border: 1px solid #e4e4e4;
            padding: 0 20px;
            margin-right: 20px;
            color: #999;
            border-radius: 2px;
            position: relative;
            transition: all 0.3s;
            &.active {
                background: @xtxColor;
                border-color: @xtxColor;
                color: #fff;
            }
            .arrow {
                position: absolute;
                border: 5px solid transparent;
                right: 8px;
                &.up {
                    top: 3px;
                    border-bottom-color: #bbb;
                    &.active {
                        border-bottom-color: @xtxColor;
                    }
                }
                &.down {
                    top: 15px;
                    border-top-color: #bbb;
                    &.active {
                        border-top-color: @xtxColor;
                    }
                }
            }
        }
        a:last-child {
            background: #fff;
            color: #999;
        }
    }
    .check {
        .xtx-checkbox {
            margin-left: 20px;
            color: #999;
        }
    }
}













</style>