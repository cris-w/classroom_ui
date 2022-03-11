import request from '@/utils/request'

// 查询课程列表
export function getCourseList(listQuery) {
    return request({
        url: '/edu/course/list',
        method: 'get',
        params: listQuery
    })
}

// 添加课程
export function addCourseInfo(courseInfo) {
    return request({
        url: "/edu/course/addCourse",
        method: "post",
        data: courseInfo
    })
}

// 获取教师列表
export function getTeacherList() {
    return request({
        url: "/sys/userRole/getTeacherList",
        method: "get"
    })
}

// 获取班级列表
export function getClassList() {
    return request({
        url: "/edu/class/getClassList",
        method: "get"
    })
}

// 通过课程ID查询课程信息
export function getCourseInfo(courseId) {
    return request({
        url: `/edu/course/getCourseInfo/${courseId}`,
        method: "get"
    })
}

// 修改课程信息
export function updateCourseInfo(courseInfo) {
    return request({
        url: '/edu/course/updateCourseInfo',
        method: "post",
        data: courseInfo
    })
}

// 通过id 获取发布课程信息
export function getCoursePublishInfo(courseId) {
    return request({
        url: `/edu/course/getCoursePublishInfo/${courseId}`,
        method: 'get'
    })
}

// 发布课程
export function publishCourse(courseId) {
    return request({
        url: `/edu/course/publishCourse/${courseId}`,
        method: "post",
    })
}

// 删除课程信息
export function deleteCourse(courseId) {
    return request({
        url: `/edu/course/deleteCourse/${courseId}`,
        method: "get",
    })
}

// 通过班级id查已发布的课程
export function getCourseByClassId(classId) {
    return request({
        url: `/edu/course/getCourseByClassId/${classId}`,
        method: "get",
    })
}
