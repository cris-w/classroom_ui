import request from '@/utils/request'

// 通过课程ID 获取章节列表
export function getChapter(courseId) {
    return request({
        url: `/edu/chapter/getChapter/${courseId}`,
        method: "get",
    })
}

// 通过章节id 查询章节信息
export function getChapterById(chapterId) {
    return request({
        url: `/edu/chapter/getChapterInfo/${chapterId}`,
        mehtod: "get"
    })
}

// 添加章节
export function addChapter(eduChapter) {
    return request({
        url: "/edu/chapter/addChapter",
        method: "post",
        data: eduChapter
    })
}

// 修改章节信息
export function updateChapter(eduChapter) {
    return request({
        url: "/edu/chapter/updateChapter",
        method: "post",
        data: eduChapter
    })
}

// 删除章节
export function delChapterById(chapterId) {
    return request({
        url: `/edu/chapter/deleteChapter/${chapterId}`,
        mehtod: "get"
    })
}

// 获取学生已经观看的小节id
export function listStudentVideo(listQuery) {
    return request({
        url: '/edu/chapter/listStudentVideo',
        mehtod: "get",
        params: listQuery
    })
}

// 保存学生观看记录
export function saveStudentVideo(studentVideo) {
    return request({
        url: '/edu/chapter/saveStudentVideo',
        method: "post",
        data: studentVideo
    })
}
