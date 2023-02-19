<template>
    <div class="xtx-skeleton" :style="{ width, height }" :class="{ shan: animated }">
        <!-- 1 盒子-->
        <div class="block" :class="{ round }" :style="{ backgroundColor: bg }"></div>
        <!-- 2 闪效果 xtx-skeleton 伪元素 --->
    </div>
</template>
<script>
export default {
    name: "XtxSkeleton",
    // 使用的时候需要动态设置 高度，宽度，背景颜色，是否闪下
    props: {
        bg: {
            type: String,
            default: "#efefef",
        },
        width: {
            type: String,
            default: "100px",
        },
        height: {
            type: String,
            default: "100px",
        },
        animated: {
            type: Boolean,
            default: false,
        },
        round: {
            type: Boolean,
            default: ({ width, height, round }) => {
                // 此方法只有在组件初始化的时候才会调用
                return (
                    round &&
                    width.slice(0, width.length - 2) ==
                        height.slice(0, width.length - 2)
                );
            },
        },
    },
};
</script>
<style scoped lang="less">
.xtx-skeleton {
    display: inline-block;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    .block {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        &.round {
            border-radius: 50%;
        }
    }
}
.shan {
    &::after {
        content: "";
        position: absolute;
        animation: shan 1.5s ease 0s infinite;
        top: 0;
        width: 50%;
        height: 100%;
        background: linear-gradient(
            to left,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        transform: skewX(-45deg);
    }
}
@keyframes shan {
    0% {
        left: -100%;
    }
    100% {
        left: 120%;
    }
}





</style>
