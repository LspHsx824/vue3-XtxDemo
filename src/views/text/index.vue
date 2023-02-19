<template>
    <div class="container">
        <h2>组件测试-复习</h2>
        <hr />

        <h3>checkBox 组件封装</h3>
        <!-- <ReviewCheckBox>吃饭</ReviewCheckBox> -->
        <!-- <ReviewCheckBox>睡觉</ReviewCheckBox> -->
        <ReviewCheckBox v-model="checked" @change="changeModel">打豆豆</ReviewCheckBox>

        <XtxButton @click="open">打开弹层</XtxButton>
        <XtxButton @click="close">关闭弹层</XtxButton>
        <!-- <Dialog v-model:visible="show" @close="close" @confirm="close">
            <template #default>
                <div>默认插槽</div>
            </template>
            <template #footer>
                <XtxButton @click="close">打开弹层</XtxButton>
                <XtxButton @click="close">关闭弹层</XtxButton>
            </template>
        </Dialog> -->

        <h3>函数式（编程式）调用 Dialog 组件</h3>

        <XtxButton @click="command_createDialog()">服务式生成 Dialog</XtxButton>
    </div>
</template>

<script setup name='text-Page'>
import ReviewCheckBox from "@/components/Review/Review-checkBox.vue";

// import Dialog from "@/views/xtx-dialog";

import Dialog from "@/views/xtx-dialog/Dialog";

import { ref } from "vue";

import { lockPageOpen, lockPageClose } from "@/utils/utils";

const checked = ref(true);

const changeModel = (newVlue) => {
    console.log(newVlue);
};

const show = ref(false);

const open = () => {
    console.log("打开弹层");
    show.value = true;
    lockPageOpen();
};
const close = () => {
    console.log("关闭弹层");
    show.value = false;
    lockPageClose();
};

// 命令式生成 Dialog
const command_createDialog = () => {
    Dialog({
        title: "<h3 style='color:red'>支付确认</h3>",
        message: "您确定支付 $400 ?",
        onConfirm: () => {
            // 与 Confirm 自定义事件映射
            console.log("确认回调");
        },
        onClose: () => {
            console.log("close3 关闭的回调");
        },
        allowHtml: true,
        // showButton:false
    })
        .then(() => {})
        .catch((err) => {
            console.warn(err);
        });
};
</script>

<style lang='less' scoped>
hr {
    // background-color: red;
    border-color: red;
}






</style>