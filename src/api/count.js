import request from '@/utils/request'

// 获取系统数据
export function getSysNum() {
    return request({
        url: '/chart/getSysNums',
        method: 'get'
    })
}

// 获取近7天观看视屏人数
export function getVideoView() {
    return request({
        url: '/chart/getVideoView',
        method: 'get'
    })
}