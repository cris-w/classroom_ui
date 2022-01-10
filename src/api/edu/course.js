import request from '@/utils/request'

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