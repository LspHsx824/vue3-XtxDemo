/**
 *
 * @param {*} promise
 * @returns [(err | null),(data | null)]
 */
export const awaitWrap = (promise) => {
    return promise.then((data) => [null, data]).catch((err) => [err, {}]);
};

export const handleSFCName = (SFC, key) => {
    if (SFC.name) {
        return SFC.name;
    } else {
        const replacingInvalidCharacters = new RegExp(/(\.\/)|(\.vue)|-/g);
        return key.replace(replacingInvalidCharacters, "");
    }
};

export const isPromise = (obj) => {
    return (
        !!obj && //有实际含义的变量才执行方法，变量null，undefined和''空串都为false
        (typeof obj === "object" || typeof obj === "function") && // 初始promise 或 promise.then返回的
        typeof obj.then === "function"
    );
};

export const lockPageOpen = () => {
    //阻止滚动
    var mo = function (e) {
        e.preventDefault();
    };
    // document.body.style.overflow = "hidden";
    document.addEventListener("touchmove", mo, {
        passive: false
    }); //禁止页面滑动
}
export const lockPageClose = () => {
    //取消阻止滚动
    var mo = function (e) {
        e.preventDefault();
    };
    // document.body.style.overflow = ""; //出现滚动条
    document.removeEventListener("touchmove", mo, {
        passive: false
    });
}

let scrollbarWidth = ""

function getScrollbarWidth() {
    var oP = document.createElement('p'),
        styles = {
            width: '100px',
            height: '100px',
            overflowY: 'scroll'
        },
        i;
    for (i in styles) oP.style[i] = styles[i];
    document.body.appendChild(oP);
    scrollbarWidth = oP.offsetWidth - oP.clientWidth;
    oP.remove();

    var box = document.createElement('div')
    return scrollbarWidth
}


/**
 * 
 * @param {*String} value -- Input 值
 * @param {*} byteLength  -- 最大长度限制， 一个汉子 == 2个字符
 * @param {*} type 
 * @returns 
 */

let curTime = 0
export const checkField = (value, byteLength = 15) => {
    let time = Date.now(); // 节流
    // value是input框的值,byteLength是需求限制的字符，attribute是input的id名

    var newvalue = value.replace(/[^\x00-\xff]/g, "**");
    var length = newvalue.length;

    //当填写的字节数小于设置的字节数
    if (length * 1 <= byteLength * 1) {
        return true;
    }
    var limitDate = newvalue.substr(0, byteLength);
    var count = 0;
    var limitvalue = "";
    for (var i = 0; i < limitDate.length; i++) {
        var flat = limitDate.substr(i, 1);
        if (flat == "*") {
            count++;
        }
    }
    var size = 0;
    var istar = newvalue.substr(byteLength * 1 - 1, 1); //校验点是否为“×”
    //if 基点是×; 判断在基点内有×为偶数还是奇数
    if (count % 2 == 0) {
        //当为偶数时
        size = count / 2 + (byteLength * 1 - count);
        limitvalue = value.substr(0, size);
    } else {
        //当为奇数时
        size = (count - 1) / 2 + (byteLength * 1 - count);
        limitvalue = value.substr(0, size);
    }
    const lang = byteLength / 2;
    if (time - curTime > 800) {
        curTime = time;
        return `最大输入${byteLength}个字节,相当${Math.floor(lang)}个汉字`;
    }
    return true
}



/**
 * 滚动到顶部 兼容性好
 */
export const scrollToTop = () => {
    let sTop = document.documentElement.scrollTop || document.body.scrollTop
    if (sTop > 0) {
        window.requestAnimationFrame(scrollToTop)
        window.scrollTo(0, sTop - sTop / 8)
    }
}

// window.scrollTo({
//     left: 0,
//     top: 0,
//     behavior: 'smooth'
// })


// function findscroller(element) {
//     element.onscroll = function () {
//         console.log(element);
//         // element
//         element.addEventListener('wheel', (e) => {
//             e.preventDefault()
//         })
//         element.scrollTop = 0 + 'px'
//     }

//     Array.from(element.children).forEach(findscroller)
// }


export const scroll_utils = {
    // 找到“目标容器”，即：有滚动条的dom。
    getScrollEventTarget: (element, rootParent = window) => {
        let currentNode = element;
        while (
            currentNode &&
            currentNode.tagName !== "HTML" &&
            currentNode.tagName !== "BODY" &&
            currentNode.nodeType === 1 &&
            currentNode !== rootParent
        ) {
            const overflowY = this.getComputedStyle(currentNode).overflowY;
            if (overflowY === "scroll" || overflowY === "auto") {
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }
        return rootParent;
    },

    // getScrollTop： 获取元素的滚动条高度。

    // Element.scrollTop 属性可以获取或设置一个元素的内容垂直滚动的像素数。

    // 一个元素的 scrollTop 值是这个元素的顶部到它的最顶部可见内容（ 的顶部） 的距离的度量。
    // 当一个元素的内容没有产生垂直方向的滚动条， 那么它的 scrollTop 值为0。
    getScrollTop(element) {
        return "scrollTop" in element ? element.scrollTop : element.pageYOffset;
    },

    // 元素顶部至页面顶部的距离
    getElementTop(element) {
        return (
            (element === window ? 0 : element.getBoundingClientRect().top) +
            this.getScrollTop(window)
        );
    },
    // 获取元素高度
    getVisibleHeight(element) {
        return element === window ?
            element.innerHeight :
            element.getBoundingClientRect().height;
    },
};