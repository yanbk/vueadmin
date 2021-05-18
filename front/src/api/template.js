import service from '@/utils/request'

export const setTemplate = (data) => {
    return service({
        url: "/template",
        method: 'post',
        data
    })
}

export const previewTemplate = (data) => {
    return service({
        url: "/previewTemplate",
        method: 'post',
        data
    })
}
