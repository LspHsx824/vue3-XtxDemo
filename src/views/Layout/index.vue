<template>
    <!-- 顶部导航 -->
    <XtxNavBar></XtxNavBar>

    <!-- 头部组件 -->
    <XtxHeader></XtxHeader>

    <!-- 吸顶头部组件 -->
    <XtxHeaderSticky></XtxHeaderSticky>

    <main class="app-main">
        <!-- 二级路由出口 -->
        <router-view></router-view>
    </main>
    <XtxFooter>底部宣传</XtxFooter>
</template>

<script setup>
import XtxNavBar from "@/components/app-navbar";
import XtxHeader from "@/components/app-header";
import XtxHeaderSticky from "@/components/app-header-sticky";
import XtxFooter from "@/components/app-footer";


</script>

<style scoped lang='less'>
.app-main{
    min-height: 50vh;
}










</style>

