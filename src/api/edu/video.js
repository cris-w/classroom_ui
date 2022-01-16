import request from '@/utils/request'

// 通过小节id 查询小节信息
export function getVideoById(videoId) {
    return request({
        url: `/edu/video/getVideoById/${videoId}`,
        mehtod: "get"
    })
}

// 添加小节
export function addVideo(eduVideo) {
    return request({
        url: "/edu/video/addVideo",
        method: "post",
        data: eduVideo
    })
}

// 修改小节信息
export function updateVideo(eduVideo) {
    return request({
        url: "/edu/video/updateVideo",
        method: "post",
        data: eduVideo
    })
}

// 删除小节
export function delVideoById(videoId) {
    return request({
        url: `/edu/video/delVideo/${videoId}`,
        mehtod: "get"
    })
}

// 删除小节视频
export function deleteVideo(fileName) {
    return request({
        url: `/oos/fileOos/delete/${fileName}`,
        method: 'get'
    })
}
// 批量删除小节视频
export function deleteBatch(fileList) {
    return request({
        url: '/oos/fileOos/deleteBatch',
        method: 'post',
        data: fileList
    })
}