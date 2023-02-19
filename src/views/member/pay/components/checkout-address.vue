<template>
    <div class="checkout-address">
        <div class="text">
            <!-- 'addressList' {{addressList}} -->
            <div class="none" v-if="addressList?.length == 0">您需要先添加收货地址才可提交订单。</div>
            <template v-else-if="addressList">
                <ul>
                    <li>
                        <span>
                            收
                            <i />货
                            <i />人：
                        </span>
                        {{ defaultAddress.receiver }}
                    </li>
                    <li>
                        <span>联系方式：</span>
                        {{ hideAddress(defaultAddress.contact) }}
                    </li>
                    <li>
                        <span>收货地址：</span>
                        {{ fullAddress(defaultAddress) }}
                    </li>
                </ul>
                <a href="javascript:;" @click="updateAdsInfo">修改地址</a>
            </template>
        </div>
        <div class="action">
            <XtxButton class="btn" @click="changeAds">切换地址</XtxButton>
            <XtxButton class="btn" @click="insertAds">添加地址</XtxButton>
        </div>

        <XtxDialog :title="title" v-model:visible="adsInfoModel" titleLeft :showButton="false">
            <!-- <AddressSelected :list="addressList" @updateAds="updateAds" /> -->
            <!-- <AddressEdit @updateAds="updateAds"  @on-success="successHandler"/> -->
            <Component
                :is="currComp"
                :list="addressList"
                :isEdit="isEdit"
                :address='defaultAddress'
                @updateAds="updateAds"
                @on-success="successHandler"
                @close="adsInfoModel = false"
            ></Component>
        </XtxDialog>
    </div>
</template>
<script setup name="CheckoutAddress">
import { ref, watch } from "vue";

import XtxDialog from "@/views/xtx-dialog";

import Confirm from "@/components/library/Confirm";

const Props = defineProps({
    addressList: {
        type: Array,
    },
});

const Emits = defineEmits(["changeOrderAdsId", "changeAdsInfo"]);

/**
 * !读取是否有默认地址
 */
const defaultAddress = ref(null);

const setDefaultAds = () => {
    defaultAddress.value = Props.addressList?.find((ads) => {
        if (ads.isDefault == 0) {
            // console.log("默认地址", ads);
            Emits("changeOrderAdsId", ads.id);
            return ads;
        }
    });
};

watch(
    () => Props.addressList,
    () => {
        setDefaultAds();
    },
    { immediate: true,deep:true }
);

/**
 * 修改地址模态框 adsInfoModel
 */

const title = ref("");
const isEdit = ref(false)
const currComp = ref("AddressSelected");

const adsInfoModel = ref(false);
const changeAds = () => {
    //修改地址
    if (!Props.addressList) return false;
    if (Props.addressList.length == 0) {
        Confirm({
            title: "温馨提示",
            message: "您未填写地址，是否添加新的收货地址？",
        })
            .then(insertAds)
            .catch(() => {});
        return false;
    }
    adsInfoModel.value = true;
    title.value = "切换收货地址";
    currComp.value = "AddressSelected";
};

const updateAds = (ads) => {
    adsInfoModel.value = false;
    defaultAddress.value = ads;
    Emits("changeAdsInfo", { type: "selectAds", data: ads });
};

/**
 * 添加新的地址 insertAds
 */

const insertAds = () => {
    adsInfoModel.value = true;
    title.value = "新增收货地址";
    isEdit.value = false
    currComp.value = "AddressEdit";
};

const successHandler = (formData) => {
    adsInfoModel.value = false;
    formData.type
        ? Emits("changeAdsInfo", { type: "editAddress", data: formData })
        : Emits("changeAdsInfo", { type: "insertAds", data: formData });
};

/**
 * !更新地址信息
 */

const updateAdsInfo = () => {
    adsInfoModel.value = true;
    title.value = "修改地址信息";
    isEdit.value = true
    currComp.value = "AddressEdit";
};

/**
 *  computedFn
 */
const fullAddress = (ads) => ads.fullLocation + ads.address;
const hideAddress = (ads) =>
    String(ads)?.replace?.(/^(\d{3})\d{4}(\d{4})/, "$1******$2");
</script>
<style scoped lang="less">
.checkout-address {
    border: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    .text {
        flex: 1;
        min-height: 90px;
        display: flex;
        align-items: center;
        .none {
            line-height: 90px;
            color: #999;
            text-align: center;
            width: 100%;
        }
        > ul {
            flex: 1;
            padding: 20px;
            li {
                line-height: 30px;
                span {
                    color: #999;
                    margin-right: 5px;
                    > i {
                        width: 0.5em;
                        display: inline-block;
                    }
                }
            }
        }
        > a {
            color: @xtxColor;
            width: 160px;
            text-align: center;
            height: 90px;
            line-height: 90px;
            border-right: 1px solid #f5f5f5;
        }
    }
    .action {
        width: 420px;
        text-align: center;
        .btn {
            width: 140px;
            height: 46px;
            line-height: 44px;
            font-size: 14px;
            &:first-child {
                margin-right: 10px;
            }
        }
    }
}










</style>
