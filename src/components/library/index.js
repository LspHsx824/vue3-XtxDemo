/**
 * ! Vue3 插件扩展
 * Vue3 的扩展全部都应该挂载上 app实力上 而不是 vue2的 VUE构造函数
 */


// import {
//     handleSFCName
// } from "@/utils/utils"

import defaultImg from '@/assets/images/200.png'

import Message from './Message'
import XtxDialog from "@/views/xtx-dialog";

import AddressSelected from "@/views/member/pay/components/address-selected"
import AddressEdit from "@/views/member/pay/components/address-edit.vue"


// 导入library文件夹下的所有组件
// 批量导入需要使用一个函数 require.context(dir,deep,matching)
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
const importFn = require.context("./", false, /\.vue$/);

export default {
    install(app) {
        /**
         * 全局批量注册组件
         */
        const files = importFn.keys();
        files.forEach((path, key) => {
            const component = importFn(path).default
            app.component(component.name, component);
        });

        /**
         * 手动全局注册 component is属性  动态组件使用
         */
        app.component('AddressSelected', AddressSelected);
        app.component('AddressEdit', AddressEdit);
        app.component('XtxDialog', XtxDialog);

        // 定义指令
        defineDirective(app)

        // 如果你想挂载全局的属性，能够通过组件实例调用的属性   this.$message
        app.config.globalProperties.$message = Message // 原型函数


    },
};

// 定义指令
const defineDirective = app => {
    // 1. 图片懒加载指令 v-lazy
    // 原理：先存储图片地址不能在src上，
    // 当图片进入可视区，将你存储图片地址设置给图片元素即可。
    app.directive('lazy', {
        mounted(el, binding) {
            const observe = new IntersectionObserver(([{
                isIntersecting
            }]) => {
                if (isIntersecting) {
                    observe.unobserve(el)
                    el.onerror = () => {
                        el.src = defaultImg
                    }
                    el.src = binding.value
                }
            }, {
                threshold: 0
            })

            observe.observe(el)
        }
    })
    app.directive('patchContent', {
        mounted(el, binding) {
            console.log(binding);
            // if (binding.arg) {
            //     el.innerHTML = binding.arg.message;
            // } else {
            //     el.innerText = binding.arg.message;
            // }
        },
    })
}