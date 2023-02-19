import {
  api_FindCart,
  getNewCartGoods,
  api_InsertCart,
  api_MergeLocalCart,
  api_DeleteCart,
  api_UpdateCart,
  api_CheckAll,
} from "@/api/cart";
import { awaitWrap } from "@/utils/utils";

import Message from "@/components/library/Message";

// 购物车状态
export default {
  namespaced: true,
  state: () => {
    return {
      list: [],
    };
  },
  getters: {
    // 有效商品列表
    ValidList(state) {
      return state.list.filter((item) => item.stock > 0 && item.isEffective);
    },
    // 无效商品列表
    inValidList(state) {
      return state.list.filter((item) => !(item.stock > 0 && item.isEffective));
    },
    // 有效商品件数
    ValidTotal(state, getters) {
      return getters.ValidList.reduce((p, c) => p + c.count, 0);
    },
    // 有效商品总金额
    ValidAmount(state, getters) {
      return (
        getters.ValidList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) /
        100
      );
    },
    // 选中商品列表
    SelectedList(state, getters) {
      return getters.ValidList.filter((item) => item.selected);
    },
    // 选中商品件数
    SelectedTotal(state, getters) {
      return getters.SelectedList.reduce((p, c) => p + c.count, 0);
    },
    // 选中商品总金额
    SelectedAmount(state, getters) {
      return (
        getters.SelectedList.reduce(
          (p, c) => p + c.nowPrice * 100 * c.count,
          0
        ) / 100
      );
    },
    // 是否全选
    isCheckAll(state, getters) {
      return (
        getters.ValidList.length === getters.SelectedList.length &&
        getters.SelectedList.length !== 0
      );
    },
  },
  mutations: {
    /**
     *  插入购物车
     */
    insertCart(state, payLoad) {
      const sameIndex = state.list.findIndex(
        (goods) => goods.skuId === payLoad.skuId
      );
      if (sameIndex != -1) {
        // state.list = []
        const count = state.list[sameIndex].count;
        payLoad.count += count;
        // 删除原来
        state.list.splice(sameIndex, 1);
      }
      // 追加新的
      state.list.unshift(payLoad);
    },
    // 修改单个商品的属性（属性存在 && 特别key 不能为假值）
    liveUpdatesCart(state, payLoad) {
      // goods 商品对象 必需有 skuId
      const goods = state.list.find((item) => item.skuId === payLoad.skuId);
      for (const key in payLoad) {
        // 属性存在真值 就更新
        if (
          payLoad[key] !== undefined &&
          payLoad[key] !== null &&
          payLoad[key] !== ""
        ) {
          goods[key] = payLoad[key];
        }
      }
    },
    // 删除单个购物车 商品
    deleteSigeGoods(state, skuId) {
      const index = state.list.findIndex((goods) => goods.skuId == skuId);
      state.list.splice(index, 1);
    },
    /**
     * 设置购物车
     * [] >>> 清空购物车
     */
    setCart(state, payload = []) {
      state.list = payload;
    },
  },
  actions: {
    //合并购物车
    async mergeCart(ctx) {
      const cartList = ctx.getters.ValidList.map(
        ({ skuId, selected, count }) => ({
          skuId,
          selected,
          count,
        })
      );
      const [err, { result }] = await awaitWrap(api_MergeLocalCart(cartList));
      if (err) {
        Message({
          type: "error",
          text: err.CustomizationError,
        });
      } else {
        ctx.commit("setCart", []);
      }
    },
    // 新增商品
    insertCart(ctx, data) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          api_InsertCart({
            skuId: data.skuId,
            count: data.count,
          })
            .then(() => api_FindCart())
            .then((data) => {
              ctx.commit("setCart", data.result);
            });
          resolve();
        } else {
          // 未登录
          ctx.commit("insertCart", data);
          resolve();
        }
      });
    },
    // 实时更新购物车商品 信息
    liveUpdatesList(ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录后 获取服务器购物车数据
          api_FindCart().then((data) => {
            ctx.commit("setCart", data.result);
          });
          resolve();
        } else {
          // 未登录
          const promiseList = ctx.state.list.map((goods) => {
            // if (goods.skuId == 300456115) {
            //   return getNewCartGoods(7777)
            // }
            return getNewCartGoods(goods.skuId);
          });
          Promise.allSettled(promiseList).then((dataList) => {
            dataList.forEach((item, i) => {
              // 请求调查成功状态 的商品 更新状态信息
              if (item.status == "fulfilled") {
                const { result } = item.value;
                ctx.commit("liveUpdatesCart", {
                  skuId: ctx.state.list[i].skuId,
                  ...result,
                });
              }
            });
          });
          resolve();
        }
      });
    },
    // 删除单个商品
    deleteSigeGoods(ctx, skuId) {
      return new Promise((resolve) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          api_DeleteCart([skuId])
            .then(() => api_FindCart())
            .then((data) => {
              ctx.commit("setCart", data.result);
              resolve();
            });
        } else {
          // 未登录
          ctx.commit("deleteSigeGoods", skuId);
          resolve();
        }
      });
    },
    // 删除 or 清除失效商品
    batchDeleteCart(ctx, isClear) {
      return new Promise((resolve) => {
        if (ctx.rootState.user.profile.token) {
          // token 已登录
          const ids = ctx.getters[isClear ? "inValidList" : "SelectedList"].map(
            (item) => item.skuId
          );
          api_DeleteCart(ids)
            .then(() => api_FindCart())
            .then((data) => {
              ctx.commit("setCart", data.result);
              resolve();
            });
        } else {
          // 未登录
          ctx.getters[isClear ? "inValidList" : "SelectedList"].forEach(
            (goods) => {
              ctx.commit("deleteSigeGoods", goods.skuId);
            }
          );
          resolve();
        }
      });
    },
    // 全选 or 取消全选
    checkAllGoods(ctx, selected) {
      return new Promise(async (resolve) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          console.time("api_CheckAll initialize");
          const ids = ctx.getters.ValidList.map((item) => item.skuId);
          await api_CheckAll({
            selected,
            ids,
          });
          const { result } = await api_FindCart();
          ctx.commit("setCart", result);
          console.timeEnd("api_CheckAll initialize");
          resolve();
        } else {
          // 未登录
          ctx.getters.ValidList.forEach((item) => {
            // item.selected = !done; // actions 里面不建议直接·1修改 state。
            // 调用 commit 修改 mutation
            ctx.commit("liveUpdatesCart", {
              skuId: item.skuId,
              selected,
            });
          });
          resolve();
        }
      });
    },
    //单选 or 单个商品数量（）
    singeSelected(ctx, payload) {
      return new Promise((resolve) => {
        if (ctx.rootState.user.profile.token) {
          // token 已登录
          api_UpdateCart(payload)
            .then(() => api_FindCart())
            .then((data) => {
              ctx.commit("setCart", data.result);
            });
        } else {
          // 未登录
          ctx.commit("liveUpdatesCart", payload);
          resolve();
        }
      });
    },
    // 修改商品的 sku
    updateGoodsSku(ctx, { oldSkuInfo, newSkuInfo }) {
      return new Promise(async (resolve) => {
        if (ctx.rootState.user.profile.token) {
          // token 已登录
          const oldSkuGoods = ctx.state.list.find(
            (goods) => goods.skuId === oldSkuInfo.skuId
          );
          await api_DeleteCart([oldSkuGoods.skuId]);
          const [err] = await awaitWrap(
            api_InsertCart({
              skuId: newSkuInfo.skuId,
              count: oldSkuGoods.count,
            })
          );
          if (!err) {
            const { result } = await api_FindCart();
            ctx.commit("setCart", result);
            resolve();
          }
        } else {
          // 未登录
          /**
           * 更改 购物车 sku信息 步骤。
           * 1. 找出旧的 skuID 删除商品
           * 2. 合并 sku 信息， 插入新的 sku 对应的商品信息
           */
          const oldSkuGoods = ctx.state.list.find(
            (goods) => goods.skuId === oldSkuInfo.skuId
          );
          ctx.commit("deleteSigeGoods", oldSkuGoods.skuId);
          const {
            skuId,
            price: nowPrice,
            specsText: attrsText,
            inventory: stock,
          } = newSkuInfo;
          const newSkuGoods = {
            ...oldSkuInfo,
            skuId,
            nowPrice,
            attrsText,
            stock,
          };
          ctx.commit("insertCart", newSkuGoods);
          resolve();
        }
      });
    },
  },
};
