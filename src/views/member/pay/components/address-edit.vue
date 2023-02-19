 <template>
    <div class="xtx-form" autocomplete="off">
        <div class="xtx-form-item">
            <div class="label">收货人：</div>
            <div class="field">
                <input
                    v-model="formData.receiver"
                    @blur="checkName(formData.receiver)"
                    class="input"
                    type="text"
                    placeholder="请输入收货人"
                />
            </div>
        </div>
        <div class="xtx-form-item">
            <div class="label">手机号：</div>
            <div class="field">
                <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
            </div>
        </div>
        <div class="xtx-form-item">
            <div class="label">地区：</div>
            <div class="field">
                <XtxCity
                    :fullLocation="formData.fullLocation"
                    @change="handleCity"
                    placeholder="请选择所在地区"
                />
            </div>
        </div>
        <div class="xtx-form-item">
            <div class="label">详细地址：</div>
            <div class="field">
                <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
            </div>
        </div>
        <div class="xtx-form-item">
            <div class="label">邮政编码：</div>
            <div class="field">
                <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
            </div>
        </div>
        <div class="xtx-form-item">
            <div class="label">地址标签：</div>
            <div class="field">
                <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
            </div>
        </div>
        <div class="xtx-form-item">
            <XtxButton @click="closeModel">取消</XtxButton>
            <XtxButton type="primary" @click="submit">确定</XtxButton>
        </div>
    </div>
</template>
<script >
import { ref, reactive } from "vue";

import { addAddress, editAddress } from "@/api/order";

import { awaitWrap, checkField as userNameCheckField } from "@/utils/utils";
import Message from "@/components/library/Message";

export default {
    name: "AddressEdit",
    props: ["isEdit",'address'],
    setup(props, { emit }) {
        // 表单对象
        // 定义表单数据对象
        const formData = reactive({
            receiver: null,
            contact: null,
            provinceCode: null,
            cityCode: null,
            countyCode: null,
            address: null,
            postalCode: null,
            addressTags: null,
            isDefault: 0,
            id: "",
            // 城市组件显示文字（完整行政区地址）
            fullLocation: null,
        });

        console.log(formData);

        // 城市选中
        const handleCity = (result) => {
            formData.provinceCode = result.provinceCode;
            formData.cityCode = result.cityCode;
            formData.countyCode = result.countyCode;
            formData.fullLocation = result.fullLocation;
        };

        // 名称检验

        const checkName = (value) => {
            if (value ?? "" !== "") {
                const isValidName = userNameCheckField(value);
                if (Object.is(isValidName, true)) {
                    console.log("有效名称");
                } else {
                    formData.receiver = "";
                }
            }
        };

        const submit = async () => {
            // const [err,{result}] = await awaitWrap(addAddress(formData));
            // if (err) {
            // Message({ type: "error", text: err.response.data.message });
            // } else {
            // Message({ type: "success", text: "添加收货地址成功" });
            // 触发自定义事件
            // formData.id = result.id
            // emit("on-success", formData);
            // }
            if (props.isEdit) {
                formData.type = "editAddress";
                emit("on-success", formData);
            } else {
                formData.id = "测试ID：1667901333";
                emit("on-success", formData);
            }
        };

        const closeModel = () => {
            emit("close", false);
        };

        const handleFormData = (address) => {
            if (props.isEdit) {
                for (const key in formData) {
                    formData[key] = address[key];
                }
            } else {
                for (const key in formData) {
                    key == "isDefault" ? "" : (formData[key] = "");
                }
            }
        };

        handleFormData(props.address);

        return {
            handleCity,
            formData,
            checkName,
            submit,
            closeModel,
        };
    },
};
</script>
<style lang='less' scoped>
.xtx-form {
    padding: 0;
    input {
        outline: none;
        &::placeholder {
            color: #ccc;
        }
    }
    .xtx-form-item:last-child {
        justify-content: space-evenly !important;
        margin-top: 3.2rem;
    }
    .xtx-city {
        width: 320px;
        /deep/ .select {
            height: 50px !important;
            line-height: 48px !important;
            display: flex;
            padding: 0 10px;
            justify-content: space-between;
            .placeholder {
                color: #ccc;
            }
            i {
                color: #ccc;
                font-size: 18px;
            }
            .value {
                font-size: 14px;
            }
        }
        /deep/ .option {
            top: 49px !important;
        }
    }
}


</style>