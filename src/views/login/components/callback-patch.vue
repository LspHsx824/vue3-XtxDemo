<template>
    <Form
        class="xtx-form"
        ref="targetForm"
        :validation-schema="new_schema"
        autocomplete="off"
        v-slot="{errors}"
    >
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-user"></i>
                <Field
                    class="input"
                    :class="{err:errors.account}"
                    type="text"
                    placeholder="请输入用户名"
                    name="account"
                    v-model="formData.account"
                />
            </div>
            <div v-if="errors.account" class="error">{{errors.account}}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-phone"></i>
                <Field
                    class="input"
                    :class="{err:errors.mobile}"
                    type="text"
                    placeholder="请输入手机号"
                    name="mobile"
                    v-model="formData.mobile"
                />
            </div>
            <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-code"></i>
                <Field
                    class="input"
                    :class="{err:errors.code}"
                    type="text"
                    placeholder="请输入验证码"
                    name="code"
                    v-model="formData.code"
                />
                <span class="code">发送验证码</span>
            </div>
            <div v-if="errors.code" class="error">{{errors.code}}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-lock"></i>
                <Field
                    class="input"
                    :class="{err:errors.password}"
                    type="password"
                    placeholder="请输入密码"
                    name="password"
                    v-model="formData.password"
                />
            </div>
            <div v-if="errors.password" class="error">{{errors.password}}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-lock"></i>
                <Field
                    class="input"
                    :class="{err:errors.onlyPassword}"
                    type="password"
                    placeholder="请确认密码"
                    name="onlyPassword"
                    v-model="formData.onlyPassword"
                />
            </div>
            <div v-if="errors.onlyPassword" class="error">{{errors.onlyPassword}}</div>
        </div>
        <a href="javascript:;" class="submit">立即提交</a>
    </Form>
</template>

<script setup name='CallbackPatch'>
import { ref, reactive, onUnmounted } from "vue";

import { Form, Field } from "vee-validate";
import schema from "@/utils/vee-validate-schema";
import Message from "@/components/library/Message";

const props = defineProps(["unionId"]);

const targetForm = ref(null);

const new_schema = {
    account: schema.onlyAccount,
    mobile: schema.mobile,
    code: schema.code,
    password: schema.password,
    onlyPassword: schema.onlyPassword,
};

const formData = reactive({
    account: null,
    mobile: null,
    code: null,
    password: null,
    onlyPassword: null,
});

/**
 * 1. 发送验证码
 */
// import { useIntervalFn } from "@vueuse/core";

// const time = ref(0);
// const sendCode = async () => {
//     const valid = schema.mobile(form.mobile);
//     // 13975531470 13666666666
//     if (Object.is(true, valid)) {
//         if (time.value === 0) {
//             // 没有倒计时才可以发送
//             userQQBindCode(form.mobile)
//                 .then((res) => {
//                     Message({ type: "success", text: "发送成功" });
//                     time.value = 60;
//                     resume();
//                 })
//                 .catch((err) => {
//                     Message({ type: "error", text: err.response.data.message });
//                 });
//         }
//     } else {
//         console.log(valid);
//         // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
//         targetForm.value.setFieldError("mobile", valid);
//     }
// };

// const { pause, resume } = useIntervalFn(
//     () => {
//         time.value--;
//         if (time.value <= 0) {
//             pause();
//         }
//     },
//     1000,
//     { immediate: false }
// );
// onUnmounted(() => {
//     pause();
// });
</script>

<style scoped lang='less'>
.code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;
    &:hover {
        cursor: pointer;
    }
}


</style>