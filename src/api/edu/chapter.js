import request from '@/utils/request'

// 通过课程ID 获取章节列表
export function getChapter(courseId) {
    return request({
        url: `/edu/chapter/getChapter/${courseId}`,
        method: "get",
    })
}