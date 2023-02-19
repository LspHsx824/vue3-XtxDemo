<template>
    <HomePanel title="最新专题" ref="target">
        <template v-slot:right>
            <XtxMore />
        </template>
        <div class="special-list" ref="homeSpecial">
            <div class="special-item" v-for="(item) in data" :key="item.id">
                <RouterLink to="/">
                    <img v-lazy="item.cover" alt />
                    <div class="meta">
                        <p class="title">
                            <span class="top ellipsis">{{item.title}}</span>
                            <span class="sub ellipsis">{{item.summary}}</span>
                        </p>
                        <span class="price">&yen;{{item.lowestPrice}}</span>
                    </div>
                </RouterLink>
                <div class="foot">
                    <span class="like">
                        <i class="iconfont icon-hart1"></i>
                        {{item.collectNum}}
                    </span>
                    <span class="view">
                        <i class="iconfont icon-see"></i>
                        {{item.viewNum}}
                    </span>
                    <span class="reply">
                        <i class="iconfont icon-message"></i>
                        {{item.replyNum}}
                    </span>
                </div>
            </div>
        </div>
    </HomePanel>
</template>

<script>
import HomePanel from "./home-panel";

import { findSpecial } from "@/api/home";
import { useLazyData } from "@/hooks";

export default {
    name: "HomeSpecial",
    components: { HomePanel },
    setup() {
        const { target, data } = useLazyData(findSpecial);
        return {
            target,
            data,
        };
    },
};
</script>

<style scoped lang='less'>
.home-panel {
    background: #f5f5f5;
}
.special-list {
    display: flex;
    height: 380px;
    justify-content: space-between;
    padding-bottom: 20px;
    .special-item {
        width: 404px;
        background: #fff;
        .hoverShadow();
        a {
            display: block;
            width: 100%;
            height: 288px;
            position: relative;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .meta {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: linear-gradient(
                    to top,
                    rgba(0, 0, 0, 0.8),
                    transparent 50%
                );
                display: flex;
                align-items: flex-end;
                .title {
                    width: 70%;
                    height: 70px;
                    display: flex;
                    color: #fff;
                    flex-direction: column;
                    padding-left: 15px;
                    justify-content: space-between;
                    .top {
                        color: #fff;
                        font-size: 22px;
                        display: block;
                    }
                    .sub {
                        display: block;
                        font-size: 19px;
                        color: #999;
                        padding-bottom: 5px ;
                    }
                }
                .price {
                    background-color: #fff;
                    padding: 4px 8px 4px 7px;
                    line-height: 1;
                    margin: 0 16px 25px auto;
                    color: @priceColor;
                    font-size: 17px;
                    border-radius: 2px;
                }
            }
        }
        .foot {
            height: 72px;
            line-height: 72px;
            padding: 0 20px;
            font-size: 16px;

            i {
                display: inline-block;
                width: 15px;
                height: 14px;
                margin-right: 5px;
                color: #999;
            }
            .like,
            .view {
                float: left;
                margin-right: 25px;
                vertical-align: middle;
            }
            .reply {
                float: right;
                vertical-align: middle;
            }
        }
    }
}







</style>
