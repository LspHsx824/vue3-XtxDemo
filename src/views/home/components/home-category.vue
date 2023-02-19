<template>
    <div class="home-category" @mouseleave="curActiveCategoryId = null">
        <!-- 左侧分类列表 -->
        <ul class="menu">
            <li
                :class="{ active: curActiveCategoryId == item.id }"
                v-for="item in leftCategory"
                :key="item.id"
                @mouseenter="curActiveCategoryId = item.id"
            >
                <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>

                <template v-if="item.children">
                    <RouterLink
                        v-for="sub in item.children"
                        :key="sub.id"
                        :to="`/category/sub/${sub.id}`"
                    >{{ sub.name }}</RouterLink>
                </template>

                <template v-else>
                    <xtxSkeleton width="60px" height="18px" animated style="margin-left:5px"></xtxSkeleton>
                    <xtxSkeleton width="50px" height="18px" animated style="margin-left:5px"></xtxSkeleton>
                </template>
            </li>
        </ul>

        <!-- 当前分类id的弹层 -->
        <div class="layer">
            <h4>
                {{ curCategory?.brands ? "品牌推荐" : "分类推荐" }}
                <small>根据您的购买或浏览记录推荐</small>
            </h4>
            <ul v-if="curCategory?.goods">
                <li v-for="item in curCategory.goods" :key="item.id">
                    <RouterLink to="/">
                        <img v-lazy="item.picture" alt />
                        <div class="info">
                            <p class="name ellipsis-2">{{ item.name }}</p>
                            <p class="desc ellipsis">{{ item.desc }}</p>
                            <p class="price">
                                <i>¥</i>
                                {{ item.price }}
                            </p>
                        </div>
                    </RouterLink>
                </li>
            </ul>
            <ul v-if="curCategory?.brands">
                <li class="brand" v-for="item in curCategory.brands" :key="item.id">
                    <RouterLink to="/">
                        <img v-lazy="item.picture" alt />
                        <div class="info">
                            <p class="place">
                                <i class="iconfont icon-dingwei"></i>
                                {{ item.place }}
                            </p>
                            <p class="name ellipsis">{{ item.name }}</p>
                            <p class="desc ellipsis-2">{{ item.desc }}</p>
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup name="HomeCategory">
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";

// api 接口
import { findBrand } from "@/api/home";

const Store = useStore();

const brand = reactive({
    id: "brand",
    name: "品牌",
    children: [
        {
            id: "brand-id",
            name: "品牌推荐",
        },
    ],
    brands: [],
});

const leftCategory = computed(() => {
    const list = Store.state.category.list.map((item) => {
        return {
            id: item.id,
            name: item.name,
            children: item.children?.slice(0, 2),
            goods: item.goods,
        };
    });
    return [...list, brand];
});

/**
 * 根据当前选中id 显示对应弹层数据
 */
let curActiveCategoryId = ref(0);
const curCategory = computed(() =>
    leftCategory.value.find((item) => item.id == curActiveCategoryId.value)
);

/**
 * 获取 品牌数据
 */
findBrand().then((res) => {
    brand.brands = res.result;
});
</script>

<style scoped lang="less">
.home-category {
    width: 250px;
    height: 500px;
    background: rgba(0, 0, 0, 0.8);
    position: relative;
    z-index: 99;
    .menu {
        li {
            padding-left: 40px;
            height: 50px;
            line-height: 50px;
            &:hover,
            &.active {
                background: @xtxColor;
            }
            a {
                margin-right: 4px;
                color: #fff;
                &:first-child {
                    font-size: 16px;
                }
            }
        }
    }
    .layer {
        width: 990px;
        height: 500px;
        background: rgba(255, 255, 255, 0.8);
        position: absolute;
        left: 250px;
        top: 0;
        display: none;
        padding: 0 15px;
        h4 {
            font-size: 20px;
            font-weight: normal;
            line-height: 80px;
            small {
                font-size: 16px;
                color: #666;
            }
        }
        ul {
            display: flex;
            flex-wrap: wrap;
            li {
                width: 310px;
                height: 120px;
                margin-right: 15px;
                margin-bottom: 15px;
                border: 1px solid #eee;
                border-radius: 4px;
                background: #fff;
                &:nth-child(3n) {
                    margin-right: 0;
                }
                a {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    padding: 10px;
                    &:hover {
                        background: #e3f9f4;
                    }
                    img {
                        width: 95px;
                        height: 95px;
                    }
                    .info {
                        padding-left: 10px;
                        line-height: 24px;
                        width: 190px;
                        .name {
                            font-size: 16px;
                            color: #666;
                        }
                        .desc {
                            color: #999;
                        }
                        .price {
                            font-size: 22px;
                            color: @priceColor;
                            i {
                                font-size: 16px;
                            }
                        }
                    }
                }
            }
            li.brand {
                height: 180px;
                a {
                    align-items: flex-start;
                    img {
                        width: 120px;
                        height: 160px;
                    }
                    .info {
                        p {
                            margin-top: 8px;
                        }
                        .place {
                            color: #999;
                        }
                    }
                }
            }
        }
    }
    &:hover {
        .layer {
            display: block;
        }
    }
}

.xtx-skeleton {
    animation: fade 1s linear infinite alternate;
}
@keyframes fade {
    from {
        opacity: 0.2;
    }
    to {
        opacity: 1;
    }
}



</style>
