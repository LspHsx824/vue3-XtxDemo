<template>
    <div class="xtx-city" ref="target">
        <div class="select" @click="toggleDialog" :class="{ active }">
            <span class="placeholder" v-if="!fullLocation">{{placeholder}}</span>
            <span class="value" v-else>{{ fullLocation }}</span>
            <i class="iconfont icon-angle-down"></i>
        </div>
        <div class="option" v-if="active">
            <div class="loading" v-if="loading"></div>
            <template v-else>
                <span
                    class="ellipsis"
                    v-for="item in currList"
                    :key="item.code"
                    @click="handelLevel(item)"
                >{{ item.name }}</span>
            </template>
        </div>
    </div>
</template>

<script>
import { ref, computed, reactive } from "vue";
import { onClickOutside } from "@vueuse/core";

import { getCityData } from "@/api/constants";

export default {
    name: "XtxCity",
    props: ["fullLocation", "placeholder"],
    setup(props, { emit }) {
        // 控制展开收起,默认收起
        const loading = ref(false);
        const active = ref(false);
        const cityListAll = ref([]);

        const openDialog = () => {
            active.value = true;
            loading.value = true;
            getCityData().then((res) => {
                cityListAll.value = res;
                loading.value = false;
            });

            // 清空之前选择
            for (const key in changeResult) {
                changeResult[key] = "";
            }
        };
        const closeDialog = () => {
            active.value = false;
        };
        // 切换展开收起
        const toggleDialog = () => {
            if (active.value) closeDialog();
            else openDialog();
        };
        // 点击其他位置隐藏
        const target = ref(null);
        onClickOutside(target, () => {
            closeDialog();
        });

        /**
         *  当先显示的 地区列表
         *
         */

        const currList = computed(() => {
            //默认省一级
            let fileterList = cityListAll.value;
            if (changeResult.provinceCode && changeResult.provinceName) {
                /**
                 * 市
                 */
                fileterList = fileterList.find(
                    (p) => p.code === changeResult.provinceCode
                ).areaList;
            }

            if (changeResult.cityCode && changeResult.cityName) {
                /**
                 * 区
                 */
                fileterList = fileterList.find(
                    (p) => p.code === changeResult.cityCode
                ).areaList;
            }

            return fileterList;
        });

        // 定义选择的 省市区 数据
        const changeResult = reactive({
            provinceCode: "",
            provinceName: "",
            cityCode: "",
            cityName: "",
            countyCode: "",
            countyName: "",
            fullLocation: "",
        });

        const handelLevel = (item) => {
            if (item.level === 0) {
                // 省
                changeResult.provinceCode = item.code;
                changeResult.provinceName = item.name;
            }
            if (item.level === 1) {
                // 市
                changeResult.cityCode = item.code;
                changeResult.cityName = item.name;
            }
            if (item.level === 2) {
                // 地区
                changeResult.countyCode = item.code;
                changeResult.countyName = item.name;
                // 完整路径
                changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`;
                // 这是最后一级，选完了，关闭对话框，通知父组件数据
                closeDialog();
                emit("change", changeResult);
            }
        };

        return { active, toggleDialog, target, currList, loading, handelLevel };
    },
};
</script>

<style scoped lang="less">
.xtx-city {
    display: inline-block;
    position: relative;
    z-index: 400;
    .select {
        border: 1px solid #e4e4e4;
        height: 30px;
        padding: 0 5px;
        line-height: 28px;
        cursor: pointer;
        &.active {
            background: #fff;
        }
        .placeholder {
            color: #999;
        }
        .value {
            color: #666;
            font-size: 12px;
        }
        i {
            font-size: 12px;
            margin-left: 5px;
        }
    }
    .option {
        width: 542px;
        border: 1px solid #e4e4e4;
        position: absolute;
        left: 0;
        top: 29px;
        background: #fff;
        min-height: 30px;
        line-height: 30px;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        > span {
            width: 130px;
            text-align: center;
            cursor: pointer;
            border-radius: 4px;
            padding: 0 3px;
            &:hover {
                background: #f5f5f5;
            }
        }
        .loading {
            height: 290px;
            width: 100%;
            background: url(../../assets/images/loading.gif) no-repeat center;
        }
    }
}

</style>
