/**
 * Dialog -> 对话框组件
 */

import {
    createVNode,
    render
} from "vue";

import Dialog from "./index.vue";

import {
    lockPageOpen,
    lockPageClose
} from "@/utils/utils";


function removeContainer(container) {
    render(null, container)
    document.querySelector('.xtx-dialog-container').remove()
    lockPageClose()
}


const dialog = (options) => {

    const container = document.createElement("div");
    container.setAttribute("class", "xtx-dialog-container");

    return new Promise((resolve, reject) => {
        const props = {
            ...options,
            close: () => {
                props.onClose?.()
                removeContainer(container)
                reject(new Error("手动取消"))
            },
            confirm: () => {
                props.onConfirm?.()
                removeContainer(container)
                resolve()
            }
        };
        const vm = createVNode(Dialog, props);
        render(vm, container)
        document.body.appendChild(container)
        lockPageOpen()
    })
};

export default dialog