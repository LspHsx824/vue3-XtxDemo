<script setup name='MemberHomeOverview'>
import MemblePasnnel from "./components/membel-pannel.vue";
import GoodsRelevan from "@/views/goods/components/goods-relevant.vue";
import GoodsItem from "@/views/category/components/goods-item.vue";

import { useStore } from "vuex";
import { ref, computed } from "vue";
import { findCollect } from "@/api/member";

const store = useStore();
// console.log(store.state.user.profile);

const userInfo = computed(() => store.state.user.profile);

/**
 * !Mockjs 测试数据
 * import request from "@/utils/request";
 * 
 *  request({
    url: "/Mockdata/test",
    method: "get",
}).then((data) => {
    console.log(data);
});
 */

const collectList = ref([]);
const movetList = ref([]);

findCollect({ page: 1, pageSize: 4 }).then(({ result }) => {
    console.log(result.items);
    collectList.value = result.items;
});
findCollect({ page: 1, pageSize: 4, }).then(({ result }) => {
    console.log(result.items);
    movetList.value = result.items;
});
</script>
<template>
    <div class="member-home">
        <!-- 概览 -->
        <div class="home-overview">
            <!-- 用户信息 -->
            <div class="user-meta">
                <div class="avatar">
                    <img :src="userInfo.avatar" />
                </div>
                <h4>徐菲菲</h4>
                <!-- <h4>{{userInfo.nickname}}</h4> -->
            </div>
            <div class="item">
                <a href="javascript:;">
                    <span class="iconfont icon-hy"></span>
                    <p>会员中心</p>
                </a>
                <a href="javascript:;">
                    <span class="iconfont icon-aq"></span>
                    <p>安全设置</p>
                </a>
                <a href="javascript:;">
                    <span class="iconfont icon-dw"></span>
                    <p>地址管理</p>
                </a>
            </div>
        </div>
        <MemblePasnnel title="我的收藏">
            <GoodsItem v-for="item in collectList" :key="item.id" :goods="item" />
        </MemblePasnnel>
        <MemblePasnnel title="我的足迹">
            <GoodsItem v-for="item in movetList" :key="item.id" :goods="item" />
        </MemblePasnnel>
        <GoodsRelevan></GoodsRelevan>
    </div>
</template>
<style scoped lang="less">
.home-overview {
    height: 132px;
    background: url("@/assets/images/center-bg.png") no-repeat center / cover;
    display: flex;
    .user-meta {
        flex: 1;
        display: flex;
        align-items: center;
        .avatar {
            width: 85px;
            height: 85px;
            border-radius: 50%;
            overflow: hidden;
            margin-left: 60px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        h4 {
            padding-left: 26px;
            font-size: 18px;
            font-weight: normal;
            color: white;
        }
    }
    .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-around;
        &:first-child {
            border-right: 1px solid #f4f4f4;
        }
        a {
            color: white;
            font-size: 16px;
            text-align: center;
            .iconfont {
                font-size: 32px;
            }
            p {
                line-height: 32px;
            }
        }
    }
}

/deep/ .xtx-carousel .carousel-btn.prev {
    left: 0;
}
/deep/ .xtx-carousel .carousel-btn.next {
    right: 0;
}




</style>