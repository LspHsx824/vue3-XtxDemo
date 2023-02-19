<template>
    <Form
        class="xtx-form"
        ref="targetForm"
        :validation-schema="schema"
        autocomplete="off"
        v-slot="{errors}"
    >
        <div class="user-info">
            <img :src="avatar" alt />
            <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-phone"></i>
                <Field
                    class="input"
                    type="text"
                    placeholder="绑定的手机号"
                    name="mobile"
                    v-model="form.mobile"
                    :class="{err:errors.mobile}"
                />
            </div>
            <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-code"></i>
                <Field
                    class="input"
                    type="text"
                    placeholder="短信验证码"
                    name="code"
                    v-model="form.code"
                    :class="{err:errors.code}"
                />
                <span class="code" @click="sendCode">{{time===0?'发送验证码':`${time}秒后发送`}}</span>
            </div>
            <div v-if="errors.code" class="error">{{errors.code}}</div>
        </div>
        <a href="javascript:;" class="submit" @click="qqBindLogin()">立即绑定</a>
    </Form>
</template>

<script setup name='CallbackBind'>
import { ref, reactive, onUnmounted } from "vue";

import { Form, Field } from "vee-validate";
import schema from "@/utils/vee-validate-schema";
import Message from "@/components/library/Message";

import { userQQBindCode, userQQBindLogin } from "@/api/user";

import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const Store = useStore();
const Route = useRoute();
const Router = useRouter();

const props = defineProps(["unionId"]);

// 3. 发送验证吗（校验，定义api，调用，完成倒计时）
// 4. 进行绑定（绑定成功就是登录成功）
const nickname = ref("null");
const avatar = ref("null");
// 1. 准备下信息：unionId(openId) qq头像 昵称
if (QC.Login.check()) {
    QC.api("get_user_info").success((res) => {
        avatar.value = res.data.figureurl_qq_1;
        nickname.value = res.data.nickname;
    });
}

// 2. 完成表单校验
// 表单数据对象
const form = reactive({
    mobile: null,
    code: null,
});

// 表单对象
const targetForm = ref(null);

/**
 * 1. 发送验证码
 */
import { useIntervalFn } from "@vueuse/core";

const time = ref(0);
const sendCode = async () => {
    const valid = schema.mobile(form.mobile);
    // 13975531470 13666666666
    if (Object.is(true, valid)) {
        if (time.value === 0) {
            // 没有倒计时才可以发送
            userQQBindCode(form.mobile)
                .then((res) => {
                    Message({ type: "success", text: "发送成功" });
                    time.value = 60;
                    resume();
                })
                .catch((err) => {
                    Message({ type: "error", text: err.response.data.message });
                });
        }
    } else {
        console.log(valid);
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        targetForm.value.setFieldError("mobile", valid);
    }
};

const { pause, resume } = useIntervalFn(
    () => {
        time.value--;
        if (time.value <= 0) {
            pause();
        }
    },
    1000,
    { immediate: false }
);
onUnmounted(() => {
    pause();
});

/**
 * QQ 绑定 登录
 */

const qqBindLogin = async () => {
    const valid = await targetForm.value.validate();
    if (valid) {
        //QQ 绑定登录
        userQQBindLogin({
            unionId: props.unionId,
            ...form,
        })
            .then((data) => {
                // console.log(data);
                handleLoginInfo(data.result);
            })
            .catch((err) => {
                Message({ type: "error", text: err.response.data.message });
            });
    }
};

const handleLoginInfo = (result) => {
    // !成功
    // 1. 存储信息
    const { id, account, nickname, avatar, token, mobile } = result;
    const payload = { id, account, nickname, avatar, token, mobile };
    Store.commit("user/setUser", payload);
    // 2. 提示
    Message({ type: "success", text: "登录成功" });
    Router.push("/");
};
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
        background: #f2f2f2;
        width: 50px;
        height: 50px;
    }
    p {
        padding-left: 10px;
    }
}
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