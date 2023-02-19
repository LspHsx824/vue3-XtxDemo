<template>
    <div class="xtx-carousel" @mouseenter="stop" @mouseleave="start">
        <!-- 轮播图主题 图 -->
        <ul class="carousel-body">
            <li
                class="carousel-item"
                :class="{ fade: curIndex == index }"
                v-for="(item, index) in sliders"
                :key="item.id"
            >
                <RouterLink to="/">
                    <img v-lazy="item.imgUrl" alt />
                </RouterLink>
            </li>
        </ul>

        <!-- 左右图标按钮 -->
        <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)">
            <!-- 上一张 -->
            <i class="iconfont icon-angle-left"></i>
        </a>
        <a href="javascript:;" class="carousel-btn next" @click="toggle(1)">
            <!-- 下一章 -->
            <i class="iconfont icon-angle-right"></i>
        </a>

        <!-- 原型小按钮 -->
        <div class="carousel-indicator">
            <!-- active 激活 -->
            <span
                v-for="(item, index) in sliders"
                @click="curIndex = index"
                :key="index"
                :class="{ active: curIndex == index }"
            ></span>
        </div>
    </div>
</template>

<script>
import { onUnmounted, ref, watch } from "vue";
export default {
    name: "XtxCarousel",
    props: {
        sliders: {
            type: Array,
            default: () => [],
        },
        autoPay: {
            type: Boolean,
            default: true,
        },
        duration: {
            type: Number,
            default: 3000,
        },
    },
    setup(props) {
        const curIndex = ref(0);

        // 自动播放 定时器轮播
        let autoPayTimer = null;

        const autoPayFn = () => {
            /**
             * 避免重复开启定时器， hot 热跟新项目每次保存都会开启新的 timer
             */
            clearInterval(autoPayTimer);
            autoPayTimer = setInterval(() => {
                processingCounters(curIndex.value);
            }, props.duration);
        };

        function processingCounters(index) {
            if (index >= props.sliders.length - 1) {
                curIndex.value = 0;
            } else {
                curIndex.value++;
            }
        }

        //处理自动播放 和 暂停
        const stop = () => {
            if (autoPayTimer) clearInterval(autoPayTimer);
        };

        const start = () => {
            if (props.sliders.length && props.autoPay) {
                autoPayFn();
            }
        };

        watch(
            () => props.sliders,
            function (newVal) {
                if (newVal.length && props.autoPay) {
                    autoPayFn();
                }
            },
            {
                immediate: true,
            }
        );

        // 前后切换
        const toggle = (step) => {
            const newIndex = curIndex.value + step;
            // 范围处理
            if (newIndex > props.sliders.length - 1) {
                curIndex.value = 0;
                return;
            }
            if (newIndex < 0) {
                curIndex.value = props.sliders.length - 1;
                return;
            }
            curIndex.value = newIndex;
        };

        // 组件卸载 销毁 effect

        onUnmounted(() => {
            clearInterval(autoPayTimer);
        });
        return {
            curIndex,
            toggle,
            stop,
            start,
        };
    },
};
</script>

<style scoped lang="less">
.xtx-carousel {
    width: 100%;
    height: 100%;
    min-width: 300px;
    min-height: 150px;
    position: relative;
    .carousel {
        &-body {
            width: 100%;
            height: 100%;
        }
        &-item {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            transition: opacity 0.5 linear;
            &.fade {
                opacity: 1;
                z-index: 1;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        &-btn {
            width: 44px;
            height: 44px;
            background-color: rgba(0, 0, 0, 0.2);
            color: #fff;
            border-radius: 50%;
            position: absolute;
            top: 228px;
            z-index: 2;
            text-align: center;
            line-height: 44px;
            opacity: 0;
            transition: all 0.5;
            &.prev {
                left: 20px;
            }
            &.next {
                right: 20px;
            }
        }
        &-indicator {
            position: absolute;
            left: 0;
            bottom: 20px;
            z-index: 2;
            width: 100%;
            text-align: center;
            span {
                display: inline-block;
                width: 12px;
                height: 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
                cursor: pointer;
                ~ span {
                    margin-left: 12px;
                }
                &.active {
                    background: #fff;
                }
            }
        }
    }
    &:hover {
        .carousel-btn {
            opacity: 1;
        }
    }
}


</style>
