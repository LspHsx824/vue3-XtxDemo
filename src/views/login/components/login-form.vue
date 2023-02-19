<template>
    <div class="account-box">
        <div class="toggle">
            <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
                <i class="iconfont icon-user"></i> 使用账号登录
            </a>
            <a @click="isMsgLogin=true" href="javascript:;" v-else>
                <i class="iconfont icon-msg"></i> 使用短信登录
            </a>
        </div>
        <VeeForm
            class="form"
            ref="targetForm"
            :validation-schema="schema"
            autocomplete="off"
            v-slot="{errors}"
        >
            <template v-if="!isMsgLogin">
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field
                            name="account"
                            v-model="formData.account"
                            :class="{error:errors.account}"
                            type="text"
                            placeholder="请输入用户名或手机号"
                        />
                    </div>
                    <div class="error" v-if="errors.account">
                        <i class="iconfont icon-warning" />
                        {{errors.account}}
                    </div>
                </div>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-lock"></i>
                        <Field
                            name="password"
                            v-model="formData.password"
                            :class="{error:errors.password}"
                            type="password"
                            placeholder="请输入密码"
                        />
                    </div>
                    <div class="error" v-if="errors.password">
                        <i class="iconfont icon-warning" />
                        {{errors.password}}
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field
                            name="mobile"
                            v-model="formData.mobile"
                            :class="{error:errors.mobile}"
                            type="text"
                            placeholder="请输入手机号"
                        />
                    </div>
                    <div class="error" v-if="errors.mobile">
                        <i class="iconfont icon-warning" />
                        {{errors.mobile}}
                    </div>
                </div>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-code"></i>
                        <Field
                            name="code"
                            v-model="formData.code"
                            :class="{error:errors.code}"
                            type="password"
                            placeholder="请输入验证码"
                        />
                        <span class="code" @click="sendCode()">{{time===0?'发送验证码':`${time}秒后发送`}}</span>
                    </div>
                    <div class="error" v-if="errors.code">
                        <i class="iconfont icon-warning" />
                        {{errors.code}}
                    </div>
                </div>
            </template>
            <div class="form-item">
                <div class="agree">
                    <Field as="XtxCheckbox" name="isAgree" v-model="formData.isAgree" />
                    <span @click="formData.isAgree = !formData.isAgree">我已同意</span>
                    <a href="javascript:;">《隐私条款》</a>
                    <span>和</span>
                    <a href="javascript:;">《服务条款》</a>
                </div>
                <div class="error" v-if="errors.isAgree">
                    <i class="iconfont icon-warning" />
                    {{errors.isAgree}}
                </div>
            </div>

            <a @click="login()" v-if="!isMsgLogin" href="javascript:;" class="btn">登录</a>
            <a @click="mobileLogin()" v-else href="javascript:;" class="btn">手机号登录</a>
        </VeeForm>
        <div class="action">
            <!-- QQ 登录 按钮 -->
            <!-- <span id="qqLoginBtn"></span> -->
            <a
                href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
            >
                <img
                    src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
                    alt
                />
            </a>
            <div class="url">
                <a href="javascript:;">忘记密码</a>
                <a href="javascript:;">免费注册</a>
            </div>
        </div>

        <!-- <XtxMessage text='测试文字'></XtxMessage> -->
    </div>
</template>

<script setup name='LoginForm'>
import { ref, reactive, watch, onUnmounted, onMounted } from "vue";

import { Form as VeeForm, Field } from "vee-validate";

import schema from "@/utils/vee-validate-schema";

import Message from "@/components/library/Message";

import {
    userAccountLogin,
    userMobileLoginMsg,
    userMobileLogin,
} from "@/api/user";
import { awaitWrap } from "@/utils/utils";

import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const Store = useStore();
const Route = useRoute();
const Router = useRouter();

// 是否短信登录
const isMsgLogin = ref(false);
// 表单信息对象
const formData = reactive({
    isAgree: true,
    account: "xiaotuxian001",
    password: "123456",
    mobile: "",
    code: "",
});

// onMounted(() => {
//     // 组件渲染完毕，使用QC生成QQ登录按钮
//     QC.Login({
//         btnId: "qqLoginBtn",
//     });
// });

// 表单对象
const targetForm = ref(null);

watch(isMsgLogin, () => {
    // 清空数据
    for (const key in formData) {
        formData[key] = "";
    }
    formData.isAgree = true;
});

// 需要在点击登录的时候对整体表单进行校验
const login = async () => {
    // Form组件提供了一个 validate 函数作为整体表单校验，当是返回的是一个promise
    const valid = await targetForm.value.validate();
    if (valid) {
        awaitWrap(
            userAccountLogin({
                account: formData.account,
                password: formData.password,
            })
        ).then(([err, { result }]) => {
            if (err) {
                Message({ type: "error", text: err.response.data.message });
                return;
            }
            handleLoginInfo(result);
        });
    }
};

// 手机号登录
const mobileLogin = async () => {
    const valid = await targetForm.value.validate();
    if (valid) {
        awaitWrap(
            userMobileLogin({
                mobile: formData.mobile,
                code: formData.code,
            })
        ).then(([err, { result }]) => {
            if (err) {
                Message({ type: "error", text: err.response.data.message });
                return;
            }
            handleLoginInfo(result);
        });
    }
};

/**
 * 1.登录成功
 * 2.设置 vuex信息
 * 3. 路由跳转 + 消息提示
 */

const handleLoginInfo = (result) => {
    // !成功
    // 1. 存储信息
    const { id, account, nickname, avatar, token, mobile } = result;
    const payload = { id, account, nickname, avatar, token, mobile };
    Store.commit("user/setUser", payload);
    // 2. 提示

    Store.dispatch("cart/mergeCart").then(() => {
        Message({ type: "success", text: "登录成功" });
        const path = Route.query.returnUrl || "/";
        console.log("回调 URL：", path);
        Router.push({
            path,
        });
    });
};

/**
 * 1.发送验证码先 验证手机号格式
 */
const time = ref(0);
let timer = null;
onUnmounted(() => {
    clearInterval(timer);
});
const sendCode = async () => {
    const valid = schema.mobile(formData.mobile);
    // 13975531470 13666666666
    if (Object.is(true, valid)) {
        if (time.value === 0) {
            userMobileLoginMsg(formData.mobile)
                .then((res) => {
                    Message({ type: "success", text: "发送成功" });
                    time.value = 60;
                    clearInterval(timer);
                    timer = setInterval(() => {
                        time.value--;
                        if (time.value <= 0) {
                            clearInterval(timer);
                        }
                    }, 1000);
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
</script>


<style lang="less" scoped>
// 账号容器
.account-box {
    .toggle {
        padding: 15px 40px;
        text-align: right;
        a {
            color: @xtxColor;
            i {
                font-size: 14px;
            }
        }
    }
    .form {
        padding: 0 40px;
        &-item {
            margin-bottom: 28px;
            .input {
                position: relative;
                height: 36px;
                > i {
                    width: 34px;
                    height: 34px;
                    background: #cfcdcd;
                    color: #fff;
                    position: absolute;
                    left: 1px;
                    top: 1px;
                    text-align: center;
                    line-height: 34px;
                    font-size: 18px;
                }
                input {
                    padding-left: 44px;
                    border: 1px solid #cfcdcd;
                    height: 36px;
                    line-height: 36px;
                    width: 100%;
                    &.error {
                        border-color: @priceColor;
                    }
                    &.active,
                    &:focus {
                        border-color: @xtxColor;
                    }
                }
                .code {
                    position: absolute;
                    right: 1px;
                    top: 1px;
                    text-align: center;
                    line-height: 34px;
                    font-size: 14px;
                    background: #f5f5f5;
                    color: #666;
                    width: 90px;
                    height: 34px;
                    cursor: pointer;
                }
            }
            > .error {
                position: absolute;
                font-size: 12px;
                line-height: 28px;
                color: @priceColor;
                i {
                    font-size: 14px;
                    margin-right: 2px;
                }
            }
        }
        .agree {
            a {
                color: #069;
            }
        }
        .btn {
            display: block;
            width: 100%;
            height: 40px;
            color: #fff;
            text-align: center;
            line-height: 40px;
            background: @xtxColor;
            &.disabled {
                background: #cfcdcd;
            }
        }
    }
    .action {
        padding: 20px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .url {
            a {
                color: #999;
                margin-left: 10px;
            }
        }
    }
}

</style>
