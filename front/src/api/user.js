import service from '@/utils/request'

export const getUsers = () => {
    return service({
        url: "/getUsers",
        method: 'get'
    })
}

