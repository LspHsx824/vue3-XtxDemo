<template>
    <div class="home-banner">
        <!-- 轮播图组件 -->
        <XtxCarousel :sliders='sliders' />
    </div>
</template>

<script setup name='homeBanner' >
import { ref } from "vue";

import { findBanner } from "@/api/home";
import { awaitWrap } from "@/utils/utils";

let sliders = ref([]);

awaitWrap(findBanner()).then(([err, { result }]) => {
    if (!err) {
        sliders.value = result
    }
});
</script>

<style lang='less' scoped>
.home-banner {
    width: 1240px;
    height: 500px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 98;
}
.xtx-carousel {
    /deep/ .carousel-btn.prev {
        left: 270px;
    }

    /deep/ .carousel-indicator {
        padding-left: 250px;
    }
}










</style>