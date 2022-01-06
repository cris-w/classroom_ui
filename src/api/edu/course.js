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