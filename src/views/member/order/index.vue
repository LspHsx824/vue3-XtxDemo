
<script setup name='MemberOrder'>
import OrderItem from "./components/order-item.vue";
import CartNone from "../../cart/components/cart-none";

import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { orderStatus } from "@/api/constants";

import { findOrderList } from "@/api/member";

// import { useFetch } from "@/hooks/order"

const loading = ref(true);
const router = useRouter();

let activeName = ref("all");

const orderList = ref([]);

const changeData = (params) => {
    loading.value = true;
    findOrderList(params)
        .then(({ result }) => {
            loading.value = false;
            orderList.value = result.items;
            total.value = result.counts;
        })
        .catch(() => router.back())
        .finally(() => (loading.value = false));
};

/**
 * 修改 请求参数
 */
const requestParams = reactive({
    orderState: 0,
    page: 1,
});

const tabClick = (tab) => {
    // 此时：tab.index 就是订单的状态
    requestParams.orderState = tab.index;
    requestParams.page = 1;
};

watch(
    requestParams,
    () => {
        changeData(requestParams);
    },
    { immediate: true }
);
/**
 * 分页组件 content
 */
let total = ref(0);
const pageChange = (currPage) => {
    requestParams.page = currPage;
    window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
    });
};
</script>
 <template>
    <div class="MemberOrder">
        <!-- 我的订单
        <RouterLink to="/member/order/1366">订单一</RouterLink>
        <RouterLink to="/member/order/2388">订单二</RouterLink>
        // xtx-tab 测试
        <Xtx-tabs v-model="activeName">
            <Xtx-tab v-for="i in 4" :key="i" :label="`选项二${i}`" :name="`${i}`">内容{{i}}</Xtx-tab>
            <Xtx-tab label="收藏的商品收藏的商品" name="5">内容5</Xtx-tab>
        </Xtx-tabs>-->

        <!-- 订单状态 Tabs -->
        <Xtx-tabs v-model="activeName" @tab-click="tabClick">
            <Xtx-tab
                v-for="item in orderStatus"
                :key="item.name"
                :label="item.label"
                :name="item.name"
            />
        </Xtx-tabs>
        <div class="loading" v-if="loading"></div>
        <template v-else-if="!loading && orderList.length==0">
            <CartNone></CartNone>
        </template>
        <template v-else>
            <OrderItem
                v-for="order in orderList"
                :key="order.id"
                :order="order"
                @sell-success="changeData(requestParams)"
            ></OrderItem>
        </template>
        <!-- 分页组件 -->
        <template v-if="!loading && total>0 ">
            <XtxPagination
                :total="total"
                @current-change="pageChange"
                :currentPage="requestParams.page"
            ></XtxPagination>
        </template>
    </div>
</template>
<style lang='less' scoped>
.MemberOrder {
    position: relative;
    .loading {
        height: 100vh;
        width: 100%;
        background: #fff url(@/assets/images/load.gif) no-repeat center / 100px
            100px;
    }
}

</style>