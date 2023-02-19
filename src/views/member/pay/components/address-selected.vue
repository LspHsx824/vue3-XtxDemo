 <template>
    <div class="box">
        <main class="text item" v-for="item in list" :key="item.id" @click="selectedAds(item)">
            <ul>
                <li>
                    <span>
                        收
                        <i />货
                        <i />人：
                    </span>
                    {{item.receiver}}
                </li>
                <li>
                    <span>联系方式：</span>
                    {{item.contact}}
                </li>
                <li>
                    <span>收货地址：</span>
                    {{item.fullLocation.replace(/\s/g,'')+item.address}}
                </li>
            </ul>
        </main>
    </div>
</template>
<script >
export default {
    name: "AddressSelected",
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    setup(props, { emit }) {
        const selectedAds = (currAds) => {
            emit("updateAds", currAds);
        };
        return {
            selectedAds,
        };
    },
};
</script>
<style lang='less' scoped>
.box {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    margin-top: 10px;
}
.text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    &.item {
        border: 1px solid #f5f5f5;
        margin-bottom: 10px;
        cursor: pointer;
        &.active,
        &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
        }
        > ul {
            padding: 10px;
            font-size: 14px;
            line-height: 30px;
        }
    }
}







</style>