<template>
    <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem
            v-if="category_filter.top"
            :to="`/category/${category_filter.top?.id}`"
        >{{category_filter.top?.name}}</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
            <!-- 动画触发的条件是 Element 创建和移除  -->
            <XtxBreadItem v-if="category_filter.top">{{category_filter.sub.name}}</XtxBreadItem>
        </Transition>
    </XtxBread>
</template>
<script setup name='SubBread'>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const Store = useStore();
const Route = useRoute();

const category_filter = computed(() => {
    const cate = {};
    Store.state.category.list.some((top) => {
        const Map_id = top?.children?.find(
            (sub) => sub.id === Route.params.subId
        );
        if (Map_id) {
            cate.top = { id: top.id, name: top.name };
            cate.sub = { id: Map_id.id, name: Map_id.name };
        }
        return Map_id;
    });
    return cate;
});
</script>
<style scoped lang="less"></style>