<template>
    <div class="xtx-checkbox" @click="changeChecked">
        <i v-if="modelValue" class="iconfont icon-checked"></i>
        <i v-else class="iconfont icon-unchecked"></i>
        <span v-if="$slots.default">
            <slot />
        </span>
    </div>
</template>
<script>
import { ref } from "vue";

import { useVModel } from "@vueuse/core";

export default {
    name: "XtxCheckbox",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        /**
         * 1. 普通封装
         * const checked = ref(false);
            const changeChecked = () => {
            checked.value = !checked.value;
        };
         */

        /**
         *  使用 v-model 封装
         *  const changeChecked = () => {
                emit("update:modelValue", !props.modelValue);
            };
         */

        /**
         * 使用第三方 hooks‘
         */
        const checked = useVModel(props, "modelValue", emit);

        const changeChecked = () => {
            const newVal = !checked.value;
            checked.value = newVal;
            emit("change", newVal);
        };

        return { changeChecked };
    },
};
</script>
<style scoped lang="less">
.xtx-checkbox {
    display: inline-block;
    margin-right: 2px;
    .icon-checked {
        color: @xtxColor;
        ~ span {
            color: @xtxColor;
        }
    }
    i {
        position: relative;
        top: 1px;
    }
    span {
        margin-left: 2px;
    }
}




</style>