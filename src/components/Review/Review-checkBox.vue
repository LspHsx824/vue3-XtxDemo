 <template>
    <div class="checkbox-container" @click="changeChecked()">
        <!-- <i class="iconfont icon-checked" v-if="modelValue"></i> -->
        <i class="iconfont icon-checked" v-if="checked"></i>
        <i class="iconfont icon-unchecked" v-else></i>
        <span v-if="$slots.default">
            <slot />
        </span>
    </div>
</template>
<script setup>
import { ref } from "vue";

/**
export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        // const checked = ref(false);

        const changeChecked = () => {
            // checked.value = !checked.value
            emit("update:modelValue", !props.modelValue);
        };

        return {
            changeChecked,
        };
    },
};

 */
import { useVModel } from "@vueuse/core";
// v-model  ====>  :modelValue  +   @update:modelValue  setup name='Revielw-checkBox'
const Props = defineProps(["modelValue"]);
const Emit = defineEmits(["update:modelValue", "change"]);

const checked = useVModel(Props, "modelValue", Emit);

const changeChecked = () => {
    const newState = !checked.value;
    checked.value = newState;
    Emit("change", newState);
};
</script>

<style lang='less' scoped>
.checkbox-container {
    margin-right: 3px;
    .icon-checked {
        color: @xtxColor;
        ~ span {
            color: @xtxColor;
        }
    }
    span {
        margin-left: 1px;
    }
}

</style>