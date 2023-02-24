
<script setup name='OrderDetailPage'>
import DetailAction from "./components/detail-action";
import DetailSteps from "./components/detail-steps";

import { ref } from "vue";
import { findOrderDetail } from "@/api/order";
import { useRoute } from "vue-router";
const route = useRoute();

const order = ref(null);
findOrderDetail(route.params.id).then((data) => {
    order.value = data.result;
});
</script>
 <template>
    <div class="order-detail-page" v-if="order">
        <!-- 操作栏 -->
        <DetailAction :order="order" />
        <!-- 步骤条 组件xtx-steps.vue-->
        <DetailSteps :order="order" />
        <!-- 物流栏 -->
        <!-- 订单商品信息 -->
    </div>
</template>
<style lang='less' scoped>
.order-detail-page {
    background-color: #fff;
    height: 100%;
}


</style>