<script setup name='user-avatar'>
//  修改作者头像
import { nextTick, onMounted, ref } from "vue";

import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

import { updateAvatar } from "@/api/user";
import { useStore } from "vuex";

import { compressImg } from "@/utils/auth"; //图片压缩 + 水印
import { onClickOutside } from "@vueuse/core";

const Store = useStore();
const Props = defineProps({
    url: {
        type: String,
        required: true,
    },
});

const Emits = defineEmits(["exit", "change-url"]);
const imgUrl = ref("");

imgUrl.value = Props.url;

const fileTarget = ref(null);
const fileObject = ref(null);

const changeUserAvatar = () => {
    const files = fileTarget.value.files[0];
    fileObject.value = files;
    const blob = URL.createObjectURL(files);
    imgUrl.value = blob;

    // 每次上传新的头像时，删除旧的 图片裁切容器
    const box = document.querySelector(".cropper-container");
    box.remove();
    createAvatar(avatar.value);
    fileTarget.value.value = "";
};

const avatar = ref(null);
onMounted(() => {
    getCanvasAvatar(avatar.value);
});

let cropper = ref(null);
const getCanvasAvatar = (element) => {
    cropper.value = new Cropper(element, {
        viewMode: 1,
        dragMode: "move",
        aspectRatio: 1,
        autoCropArea: 1,
        cropBoxMovable: false,
        cropBoxResizable: false,
        background: true,
    });
};

const createAvatar = (element) => {
    const parent = element.parentNode;
    const img = document.createElement("img");
    img.src = imgUrl.value;
    parent.appendChild(img);

    [...parent.children].forEach((img) => {
        if (!img.getAttribute("class")) {
            img.setAttribute("class", "cropper-hidden");
        }
    });

    nextTick(() => {
        getCanvasAvatar(img);
    });
};

const close = () => {
    Emits("exit", false);
};

const confirm = () => {
    cropper.value
        .getCroppedCanvas({
            imageSmoothingQuality: "high",
        })
        .toBlob(sava);
};

const sava = async (blob) => {
    const formData = new FormData();
    if (!fileObject.value) {
        // 此接口 不能传 blob 数据对象
        const file = new File([blob], `1.jpg`, { type: blob.type });
        compressImg(file).then((data) => {
            Emits("change-url", data);
        });
        formData.append("file", file);
        return close();
    } else {
        formData.append("file", fileObject.value);
    }
    const { result } = await updateAvatar(formData);
    console.log(result.avatar);
    Store.commit("user/setUserAvatar", result.avatar);
    close();
};

const modelTarget = ref(null);
const modelMove = (e) => {
    var x = e.pageX - modelTarget.value.offsetLeft;
    var y = e.pageY - modelTarget.value.offsetTop;

    function move(e) {
        modelTarget.value.style.left = e.pageX - x + "px";
        modelTarget.value.style.top = e.pageY - y + "px";
    }
    // (2) 鼠标移动的时候，把鼠标在页面中的坐标，减去 鼠标在盒子内的坐标就是模态框的left和top值
    document.addEventListener("mousemove", move);

    document.addEventListener("mouseup", function () {
        document.removeEventListener("mousemove", move);
    });
};

onClickOutside(modelTarget, close);
</script>

 <template>
    <div class="avatar" @mousedown="modelMove" ref="modelTarget">
        <div class="header">
            <p>
                <i class="iconfont icon-tuzi"></i>更换头像
            </p>
            <p>
                <span>
                    <i class="iconfont icon-suoxiao"></i>
                </span>
                <span @click="close">
                    <i class="iconfont icon-exit"></i>
                </span>
            </p>
        </div>
        <div class="content">
            <p class="file-btn">
                <span @click="fileTarget.click()">
                    <i class="iconfont icon-wenjianshangchuan"></i>上传本地照片
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        ref="fileTarget"
                        @change="changeUserAvatar"
                    />
                </span>
                <span>挑选推荐头像</span>
            </p>
            <div class="file-main">
                <img :src="imgUrl" ref="avatar" alt />
            </div>
        </div>

        <div class="footer">
            <XtxButton type="primary" size="mini" @click="confirm">确认</XtxButton>
        </div>
    </div>
</template>

<style lang='less' scoped>
.avatar {
    position: fixed;
    width: 400px;
    height: 600px;
    left: 50%;
    top: 50%;
    z-index: 9999;
    background-color: #eee;
    transform: translate(-50%, -50%);
    .iconfont {
        font-size: 20px;
        display: inline-block;
        vertical-align: middle;
    }
    .icon-wenjianshangchuan {
        font-size: 30px;
        // vertical-align: sub;
    }
    .header {
        display: flex;
        padding: 15px 15px 15px 25px;
        justify-content: space-between;
        background-color: rgb(126, 118, 117);
        color: #fff;
        p:last-child {
            display: flex;
            span:first-child {
                margin-right: 15px;
            }
        }
        p {
            vertical-align: middle;
        }
    }
    .content {
        padding: 15px;
        .file-btn {
            display: flex;
            span {
                height: 40px;
                width: 140px;
                text-align: center;
                line-height: 40px;
                padding: 0 10px;
                border: 1px solid #aaaa;
                background-color: #fff;
                color: #000;
            }
            span:first-child {
                margin-right: 25px;
            }
        }
        .file-main {
            margin-top: 15px;
            width: 100%;
            height: 400px;
            display: flex;
            background-color: #555;
            img {
                height: 100%;
                display: block;
                margin: 0 auto;
                max-width: 100%;
            }
        }
    }
    .footer {
        display: flex;
        justify-content: flex-end;
        margin-right: 15px;
    }
}

</style>