<template>
    <div class="xtx-pagination">
        <a href="javascript:;" :style="{'border':'none'}">共 {{data.pageTotal}} 页</a>
        <a href="javascript:;" v-if="CurrentPage>1" @click="prePage">上一页</a>
        <a href="javascript:;" class="disabled" v-else>上一页</a>
        <a href="javascript:;" v-if="isShowFirst" @click="changePage(1)">1</a>
        <span v-if="data.start>1 && CurrentPage>4">...</span>
        <a
            href="javascript:;"
            :class="{active:CurrentPage==btnValue}"
            v-for="btnValue in data.btnList"
            :key="btnValue"
            @click="changePage(btnValue)"
        >{{btnValue}}</a>
        <span v-if="data.end < data.pageTotal && !isShowLast ">...</span>
        <a
            href="javascript:;"
            v-if="isShowLast"
            @click="changePage(data.pageTotal)"
        >{{ data.pageTotal}}</a>
        <a href="javascript:;" v-if="CurrentPage < data.pageTotal" @click="nextPage">下一页</a>
        <a href="javascript:;" class="disabled" v-else>下一页</a>
        <a href="javascript:;">
            前往
            <input
                type="number"
                class="input-page"
                :value="CurrentPage"
                @blur="change"
                min="1"
                :max="data.pageTotal"
            />
            页
        </a>
    </div>
</template>
<script>
import { computed, ref, watch } from "vue";
export default {
    name: "XtxPagination",
    props: {
        total: {
            type: Number,
            required: true,
        },
        currentPage: {
            type: Number,
            default: 1,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
    },
    setup(props, { emit }) {
        // 总条数
        const Total = ref(100);
        // 每页条数
        const PageSize = ref(10);
        // 当前第几页
        const CurrentPage = ref(8);
        // 按钮个数
        const btnCount = 5;

        const data = computed(() => {
            //总页码
            const pageTotal = Math.ceil(Total.value / PageSize.value);
            /**
             * 按钮数组
             * 1. 假设 当前页为 5（中间值）， 按钮数组为  3 4 5 6 7
             */
            const btnOffset = Math.floor(btnCount / 2);

            // 理想值
            let start = CurrentPage.value - btnOffset;
            let end = btnCount + start - 1;

            // 特殊值
            if (start < 1) {
                start = 1;
                end =
                    btnCount + start - 1 > pageTotal
                        ? pageTotal
                        : btnCount + start - 1;
            }
            // 结束页 大于 总页数
            if (end > pageTotal) {
                end = pageTotal;
                //  8 - 5 = 3    3 4 5 6 7 8
                //  8 - 4 = 4    4 5 6 7 8
                start = pageTotal - 4 < 1 ? 1 : pageTotal - 4;
            }
            const btnList = [];
            for (let i = start; i <= end; i++) {
                btnList.push(i);
            }
            return { btnList, pageTotal, start, end };
        });

        const prePage = () => {
            const newPage = CurrentPage.value - 1;
            if (newPage < 1) return;
            emit("current-change", newPage);
        };

        const nextPage = () => {
            const newPage = CurrentPage.value + 1;
            if (newPage > data.value.pageTotal) return;
            emit("current-change", newPage);
        };

        const changePage = (currPage) => {
            if (currPage !== CurrentPage.value)
                emit("current-change", currPage);
        };
        const change = (e) => {
            const currPage = e.target.value;
            if (
                currPage !== CurrentPage.value &&
                currPage <= data.value.pageTotal
            ) {
                emit("current-change", +currPage);
            } else {
                e.target.value = CurrentPage.value;
            }
        };
        watch(
            props,
            (newProps) => {
                Total.value = newProps.total;
                PageSize.value = newProps.pageSize;
                CurrentPage.value = newProps.currentPage;
            },
            { immediate: true }
        );

        const isShowFirst = computed(() => {
            if (data.value.pageTotal <= btnCount) return false;
            if (CurrentPage.value > 3) return true;
            return false;
        });
        const isShowLast = computed(() => {
            if (data.value.pageTotal <= btnCount) return false;
            if (CurrentPage.value + 3 == data.value.pageTotal) return true;
            return false;
        });
        return {
            data,
            CurrentPage,
            prePage,
            nextPage,
            changePage,
            change,
            isShowFirst,
            isShowLast,
        };
    },
};
</script>
<style scoped lang="less">
.xtx-pagination {
    display: flex;
    justify-content: center;
    padding: 30px;
    > a {
        display: inline-block;
        padding: 5px 10px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        margin-right: 10px;
        &:hover {
            color: @xtxColor;
        }
        &.active {
            background: @xtxColor;
            color: #fff;
            border-color: @xtxColor;
        }
        &.disabled {
            cursor: not-allowed;
            opacity: 0.4;
            &:hover {
                color: #333;
            }
        }
    }
    > span {
        margin-right: 10px;
    }
    .input-page {
        min-width: 40px;
        max-width: 80px;
        background-color: #fff !important;
        outline: none;
        padding-left: 1rem;
        border: none;
    }
}

</style>