<script  setup name='xtx-dialog'>
import XtxButton from "@/components/library/xtx-button.vue";
import { onClickOutside } from "@vueuse/core";

import { lockPageOpen, lockPageClose } from "@/utils/utils";

import { ref, useSlots, watch } from "vue";

// const $slots = useSlots();

const Props = defineProps({
    message: {
        type: String,
        default: "您确认要关闭吗？",
    },
    title: {
        type: String,
        default: "温馨提示",
    },
    close: {
        type: Function,
    },
    confirm: {
        type: Function,
    },
    // 以 v-html 渲染内容
    allowHtml: {
        type: Boolean,
        default: false,
    },
    //是否显示 底部按钮
    showButton: {
        type: Boolean,
        default: true,
    },
    // v-model  显示隐藏
    visible: {
        type: Boolean,
        default: (props) => {
            return true;
        },
    },
    // 标题右边
    titleLeft: {
        type: Boolean,
        default: false,
    },
    width: {
        type: [String, Number],
        default: 850,
    },
    //是否在点击遮罩层后关闭弹窗
    closeOnClickOverlay: {
        type: Boolean,
        default: false,
    },
    // 是否显示关闭按钮
    showExit: {
        type: Boolean,
        default: true,
    },
});
const emits = defineEmits(["confirm", "close", "update:visible"]);

const fade = ref(false);

const closeModal = () => {
    emits("update:visible", false);
};

// visible的值为true打开对话框，否则就是关闭对话框，其实控制fade的值即可
// vue3.0 v-model:visible 语法糖，拆解 （:visible + @update:visible）
// vue2.0 visible.sync 语法糖，拆解 （:visible + @update:visible）
watch(
    () => Props.visible,
    (newVal) => {
        setTimeout(() => {
            fade.value = newVal;
        }, 0);
        Props.visible ? lockPageOpen() : lockPageClose();
    },
    { immediate: true }
);

function Confirm() {
    Props.confirm?.();
    emits("confirm");
    closeModal();
}
function Close() {
    Props.close?.();
    emits("close");
    closeModal();
}

const target = ref(null);

onClickOutside(target, () => {
    Props.closeOnClickOverlay ? "" : Close()
});

// !如果是在<script setup>定义组件内的指令，
// !有一个语法糖可以使用：任何以v开头的驼峰式命名的变量都可以被用作一个自定义指令，然后在模板中使用。
const vPatchContent = {
    mounted(el, binding) {
        el[Props.allowHtml ? "innerHTML" : "innerText"] = binding.value;
    },
};
</script>

<template>
    <div class="xtx-dialog-wrap" v-if="visible" :class="{fade}">
        <div class="container" :style="`width:${width}px`" ref="target" :class="{fade}">
            <div class="title">
                <span class="content" :class="{titleLeft}" v-PatchContent="title"></span>
                <a
                    href="JavaScript:;"
                    class="iconfont icon-close-new"
                    v-if="showExit"
                    @click="Close"
                ></a>
            </div>
            <template v-if="$slots.default">
                <slot />
            </template>
            <template v-else>
                <div class="content" v-PatchContent="message"></div>
            </template>

            <div class="controll" v-if="$slots.footer">
                <slot name="footer"></slot>
            </div>
            <div class="controll" v-else-if="showButton">
                <XtxButton size="mini" type="gray" @click="Confirm">确认</XtxButton>
                <XtxButton size="mini" type="primary" @click="Close">取消</XtxButton>
            </div>
        </div>
    </div>
</template>

<style scoped lang='less'>
.xtx-dialog-wrap {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(15, 15, 15, 0.5);
    width: 100%;
    height: 100%;
    z-index: 2222;
    &.fade {
        transition: all 0.4s;
        background: rgba(0, 0, 0, 0.5);
    }
}
.container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -70%);
    min-width: 300px;
    min-height: 200px;
    max-height: 80vh;
    // width: 850px;
    padding: 10px;
    background: white;
    display: flex;
    flex-direction: column;
    &.fade {
        transition: all 0.4s;
        transform: translate(-50%, -50%);
        opacity: 1;
    }
}
.content {
    flex: 1;
    padding: 10px;
    text-align: left;
    font-size: 1.3rem;
    text-align: center;
}
.title {
    min-height: 30px;
    display: flex;
    span {
        flex: 1;
        text-align: center;
        font-size: 1.5rem;
    }
    a {
        width: 30px;
        font-size: 1.5rem;
    }
    .titleLeft {
        text-align: left;
    }
}
.controll {
    display: flex;
    width: 100%;
    justify-content: space-around;
}

</style>

