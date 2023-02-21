
<template>
    <div class="xtx-tab-content" v-show="activeName==name">
        <slot />
    </div>
</template>

<script >
import { inject } from "vue";

export default {
    name: "Xtx-tab",
    props: {
        label: {
            type: String,
            default: "",
        },
        name: {
            type: [String, Number],
            default: "",
        },
    },
    setup() {
        const activeName = inject("activeName");
        return {
            activeName,
        };
    },
};
</script>

<style lang="less" scoped>
.xtx-tab-content {
    margin-top: 1.5rem;
}

</style>