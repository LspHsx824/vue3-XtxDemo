 <template>
    <div class="tabs-line" :style="{width,height,left}"></div>
</template>
<script>

export default {
    name: "tabs-line",
    props: {
        width: {
            type: String,
            default: "40px",
        },
        height: {
            type: String,
            default: "5px",
        },
        left: {
            type: String,
            default: "0px",
        },
    },
};
</script>
<style lang='less' scoped>
.tabs-line {
    color: red;
    position: absolute;
    background-color: red;
    border-radius: 5px;
    transition: left 0.5s linear;
}


</style>