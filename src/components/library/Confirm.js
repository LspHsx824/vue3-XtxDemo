import {
    createVNode,
    render
} from "vue";

import XtxConfirm from './xtx-confirm.vue'
import {
    lockPageOpen,
    lockPageClose
} from "@/utils/utils";

export default ({
    title,
    message
}) => {

    const div = document.createElement('div')
    div.setAttribute('class', 'xtx-confirm-container')
    document.body.appendChild(div)

    return new Promise((resolve, reject) => {

        // 点击取消触发的函数
        const cancelCallback = () => {
            // render(null, div)
            div.remove() // element 自杀式删除
            lockPageClose()
            reject(new Error('点击取消'))
        }
        // 点击确认触发的函数
        const submitCallback = () => {
            div.remove()
            lockPageClose()
            resolve()
        }

        const Vnode = createVNode(XtxConfirm, {
            title,
            message,
            cancelCallback,
            submitCallback
        })
        render(Vnode, div)
        lockPageOpen()
    })
}