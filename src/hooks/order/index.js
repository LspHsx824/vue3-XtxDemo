import {
    ref
} from "vue"

export const useFetch = ({
    api,
    params,
    skip
}) => {
    const loading = ref(false)
    const data = ref(null)
    const error = ref(null)

    const fetch = async (params) => {
            loading.value = true
            try {
                const result = await api(params)
                data.value = result.result
            } catch (ex) {
                error.value = ex
            } finally {
                loading.value = false
            }
        }
        // skip 是否跳过
        !skip && fetch()

    return {
        loading,
        data,
        error,
        fetch
    }
}