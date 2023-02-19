<template>
    <div class="xtx-confirm" @click="cancel" :class="{fade}">
        <div class="wrapper" :class="{fade}">
            <div class="header">
                <h3>{{title}}</h3>
                <a href="JavaScript:;" class="iconfont icon-close-new" @click="cancel"></a>
            </div>
            <div class="body">
                <template v-if="$slots.default">
                    <slot></slot>
                </template>
                <template v-else>
                    <i class="iconfont icon-warning"></i>
                    {{message}}
                </template>
            </div>
            <div class="footer">
                <XtxButton size="mini" type="gray" @click="cancel">{{cancelButtonText}}</XtxButton>
                <XtxButton size="mini" type="primary" @click="comfirm">{{confirmButtonText}}</XtxButton>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from "vue";
/**
 *  XtxButton 是 Vue全局注册的组件，但 弹窗一般是在全局
 *  所以 函数式组件使用时  无法解析 外部非管理组件
 *  解决办法： 文件内单独在次 引用。
 */
import XtxButton from "./xtx-button.vue";

export default {
    name: "XtxConfirm",
    components: { XtxButton },
    props: {
        title: {
            type: String,
            default: "温馨提示",
        },
        confirmButtonText: {
            type: String,
            default: "确认",
        },
        cancelButtonText: {
            type: String,
            default: "取消",
        },
        message: String,
        cancelCallback: {
            type: Function,
        },
        submitCallback: {
            type: Function,
        },
    },
    setup(props, { emit, slots }) {
        const cancel = () => {
            if (slots.default) {
                emit("cancel");
                return;
            }
            props.cancelCallback?.();
        };
        const comfirm = () => {
            if (slots.default) {
                emit("comfirm");
                return;
            }
            props.submitCallback?.();
        };
        const fade = ref(false);

        onMounted(() => {
            // 过渡效果需要在元素创建完毕后延时一会加上才会触发
            setTimeout(() => {
                fade.value = true;
            }, 0);
        });
        return { cancel, comfirm, fade };
    },
};
</script>
<style scoped lang="less">
.xtx-confirm {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 8888;
    background: rgba(0, 0, 0, 0);
    &.fade {
        transition: all 0.4s;
        background: rgba(0, 0, 0, 0.5);
    }
    .wrapper {
        width: 400px;
        background: #fff;
        border-radius: 4px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -75%);
        visibility: visible;
        &.fade {
            transition: all 0.4s;
            transform: translate(-50%, -50%);
            opacity: 1;
        }
        .header,
        .footer {
            height: 50px;
            line-height: 50px;
            padding: 0 20px;
        }
        .body {
            padding: 20px 40px;
            font-size: 16px;
        }
        .footer {
            text-align: right;
            .xtx-button {
                margin-left: 20px;
            }
        }
        .header {
            position: relative;
            h3 {
                font-weight: normal;
                font-size: 18px;
            }
            a {
                position: absolute;
                right: 15px;
                top: 15px;
                font-size: 20px;
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                color: #999;
                &:hover {
                    color: #666;
                }
            }
        }
    }
}







</style>