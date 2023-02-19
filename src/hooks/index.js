import { useIntersectionObserver, useIntervalFn } from "@vueuse/core";

import { ref, onUnmounted } from "vue";

import { awaitWrap } from "@/utils/utils";

import { trsUnix } from "@/utils/Dayjs";

/**
 *  数据懒加载 Fun
 * @param {* Element } target  需要监听目标元素
 * @param {* Function} api 获取请求 API Function
 * @return {* Array }  [(err | null),(data | null)]
 */
export const useLazyData = (api) => {
  const data = ref(null);
  const target = ref(null);
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        stop();
        awaitWrap(api()).then(([err, { result }]) => {
          if (!err) {
            data.value = result;
          }
        });
      }
    },
    // 配置选项，相交的比例大于0就触发
    {
      threshold: 0,
    }
  );
  return {
    data,
    target,
  };
};

/**
 * 订单支付倒计时
 */

export const usePayTime = () => {
  let timeDown = ref("30 * 60");
  let timeTrxText = ref("");

  const { pause, resume } = useIntervalFn(
    () => {
      timeTrxText.value = trsUnix(timeDown.value);
      timeDown.value--;
      if (timeDown.value < 0) pause();
    },
    1000,
    {
      immediate: false,
    }
  );

  onUnmounted(() => {
    pause();
  });

  const start = (countDown) => {
    timeDown.value = countDown;
    resume();
  };
  return {
    timeTrxText,
    start,
  };
};
