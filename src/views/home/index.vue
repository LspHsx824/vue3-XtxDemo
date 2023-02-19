<template>
    <div class="home-entry">
        <div class="container">
            <!-- 左侧分类 -->
            <HomeCategory />
            <!-- 轮播图 box-->
            <HomeBanner />
        </div>
        <!-- 新鲜好物 -->
        <HomeNew />

        <!-- 人气推荐 -->
        <HomeHot />
        <!-- 热门品牌 -->
        <HomeBrand />

        <!-- 商品列表    -->
        <HomeProduct />

        <!-- 最新专题 -->
        <HomeSpecial/>
    </div>
</template>

<script setup>
import HomeCategory from "./components/home-category.vue";
import HomeBanner from "./components/home-banner.vue";
import HomeNew from "./components/home-new.vue";
import HomeHot from "./components/home-hot.vue";
import HomeBrand from "./components/home-brand.vue";
import HomeProduct from "./components/home-product.vue";
import HomeSpecial from "./components/home-special.vue";
</script>

<style lang='less' scoped></style>




