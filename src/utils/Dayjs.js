

/**
 * 时间转换处理 utilsFn 
 */

import dayjs from "dayjs"

/**
 * 秒转 指定格式时间
 */

export const trsUnix = (time) => dayjs.unix(time).format('mm分ss秒')