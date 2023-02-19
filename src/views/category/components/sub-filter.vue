<template>
    <!-- 筛选区 -->
    <div class="sub-filter" v-if="!dataLoading">
        <div class="item">
            <div class="head">品牌：</div>
            <div class="body">
                <a
                    href="javascript:;"
                    :class="{active:brand.id == filterData.selectedBrand}"
                    v-for="(brand) in filterData?.brands"
                    :key="brand.id"
                    @click="selectBrandsKey(brand.id)"
                >{{brand.name}}</a>
            </div>
        </div>
        <div class="item" v-for="spt in filterData?.saleProperties" :key="spt.id">
            <div class="head">{{spt.name}}：</div>
            <div class="body">
                <a
                    href="javascript:;"
                    :class="{active:item.id == spt.selectedProps}"
                    v-for="(item) in spt?.properties"
                    @click="selectedPropsKey(spt,item.id)"
                    :key="item.id"
                >{{item.name}}</a>
            </div>
        </div>
    </div>
    <div v-else class="sub-filter">
        <XtxSkeleton class="item" width="800px" height="25px" />
        <XtxSkeleton class="item" width="800px" height="25px" />
        <XtxSkeleton class="item" width="600px" height="25px" />
        <XtxSkeleton class="item" width="600px" height="25px" />
        <XtxSkeleton class="item" width="600px" height="25px" />
    </div>
</template>
<script naem='SubFilter' setup>
import { watch, ref, defineEmits } from "vue";
import { useRoute } from "vue-router";

import { findSubCategoryFilter } from "@/api/category";
import { awaitWrap } from "@/utils/utils";

const Route = useRoute();
const Emits = defineEmits(["filter"]);
const filterData = ref(null);
const dataLoading = ref(true);

watch(
    () => Route.params.subId,
    async (newVal) => {
        if (newVal && Route.meta["Category-type"] == "Sub-Categories") {
            dataLoading.value = true;
            const [err, data] = await awaitWrap(
                findSubCategoryFilter(Route.params.subId)
            );
            if (!err) {
                const fullData = data.result;
                fullData.selectedBrand = null;
                fullData.brands.unshift({
                    id: null,
                    name: "全部",
                    isActive: "true",
                });
                fullData.saleProperties.map((item) => {
                    item.selectedProps = null;
                    item.properties.unshift({
                        id: null,
                        name: "全部",
                        isActive: "true",
                    });
                });
                filterData.value = fullData;
                dataLoading.value = false;
            }
        }
    },
    { immediate: true }
);

/**
 *  selectBrandsKey 选中的品牌
 *  selectedPropsKey 属性筛选
 */

const getFilterParams = () => {
    const params = { brandId: null, attrs: [] };
    /**
     * Api 接口所需要数据 格式：
     *  参考数据：{brandId:'',attrs:[{groupName:'',propertyName:''},...]}
     */
    params.brandId = filterData.value.selectedBrand;
    filterData.value.saleProperties.forEach((item) => {
        if (item.selectedProps) {
            params.attrs.push({
                groupName: item.name,
                propertyName: item.selectedProps,
            });
        }
    });
    if (params.attrs.length === 0) params.attrs = null;
    return params;
};

const selectBrandsKey = (key) => {
    if (filterData.value.selectedBrand == key) return;
    filterData.value.selectedBrand = key;
    Emits("filter", getFilterParams());
};
const selectedPropsKey = (item, key) => {
    if (item.selectedProps == key) return;
    item.selectedProps = key;

    Emits("filter", getFilterParams());
};
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
    background: #fff;
    padding: 25px;
    .item {
        display: flex;
        line-height: 40px;
        .head {
            width: 80px;
            color: #999;
        }
        .body {
            flex: 1;
            a {
                margin-right: 36px;
                transition: all 0.3s;
                display: inline-block;
                &.active,
                &:hover {
                    color: @xtxColor;
                }
            }
        }
    }
    .xtx-skeleton {
        margin-top: 10px;
    }
}


</style>