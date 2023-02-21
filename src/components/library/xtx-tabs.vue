

<script>
import { provide, ref, nextTick } from "vue";
import { useVModel } from "@vueuse/core";

import getActualWidthOfChars from "@/utils/auth";

export default {
    name: "Xtx-tabs",
    props: {
        modelValue: {
            type: [Number, String],
            required: true,
        },
    },
    render() {
        const items = this.$slots.default();

        // console.log(items);
        /**
         * 动态 panel
         * 当使用 v-for 循环遍历 tab的时候  节点类型为 文档碎片
         */
        const dynamicPanels = [];
        items.forEach((item) => {
            if (item?.type.name == "Xtx-tab") {
                dynamicPanels.push(item);
            } else if (typeof item.type == "symbol") {
                dynamicPanels.push(...item.children);
            }
        });
        // 内容对应的导航栏
        const navs = (
            <nav class="xtx-tab-navs">
                {dynamicPanels.map((comp, i) => {
                    return (
                        <a
                            href="javascript:;"
                            class={{
                                active: comp.props.name == this.modelValue,
                                ellipsis: true,
                            }}
                            onClick={() => this.tabClick(comp, i, navs)}
                        >
                            {comp.props.label}
                        </a>
                    );
                })}
            </nav>
        );
        const props = {
            width: this.lineWidth,
            left: this.lineLeft,
        };
        if (this.lineWidth == "0px") this.getContentWidth(navs);
        return (
            <div class="xtx-tabs">
                {[navs, <tabs-line {...props} />, dynamicPanels]}
            </div>
        );
    },
    setup(props, { emit }) {
        let lineWidth = ref("0px");
        let lineLeft = ref("0px");
        let marginLeft = ref("0");
        let elementWidth = ref("0");
        const activeName = useVModel(props, "modelValue", emit);

        // 点击选项卡触发函数
        const tabClick = (comp, index, navs) => {
            activeName.value = comp.props.name;
            // 提供一个tab-click自定义事件
            emit("tab-click", { name: comp.props.name, index });
            getLineOffsetLeft(navs, index);
        };

        const getContentWidth = (navs, index = 0) => {
            nextTick(() => {
                const element = navs.children[0].children[index].el;
                const elementCssObject = getComputedStyle(element);
                const text = element.innerText;
                const size = elementCssObject
                    .getPropertyValue("font-size")
                    .replace(/px/, "");
                const eleWidth = getActualWidthOfChars(text, { size });
                elementWidth.value = element.offsetWidth; // 默认第一个元素的 width
                const left = (element.offsetWidth - eleWidth) / 2;
                // console.log(left);
                lineWidth.value = eleWidth + "px"; //线的宽度
                lineLeft.value = left + "px"; // 元素 marginLeft 值
                marginLeft.value = left 
            });
        };

        const getLineOffsetLeft = (navs, index) => {
            // const element = navs.children[0].children[index].el;
            lineLeft.value = elementWidth.value * index + marginLeft.value + "px";
        };

        // 给每一个panel传当前激活的name
        provide("activeName", activeName);
        return {
            tabClick,
            activeName,
            lineWidth,
            lineLeft,
            getContentWidth,
        };
    },
};
</script>


<style lang="less">
.xtx-tabs {
    background: #fff;
    > nav {
        height: 60px;
        line-height: 60px;
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        > a {
            width: 110px;
            border-right: 1px solid #f5f5f5;
            text-align: center;
            font-size: 16px;
            &.active {
                border-top: 2px solid @xtxColor;
                height: 60px;
                background: #fff;
                line-height: 56px;
            }
        }
    }
}













</style>