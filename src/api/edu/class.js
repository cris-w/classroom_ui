import request from '@/utils/request'

// 查询班级列表
export function getClassList(listQuery) {
    return request({
        url: '/edu/class/list',
        method: 'get',
        params: listQuery
    })
}

// 通过id 查询班级
export function getClassInfo(id) {
    return request({
        url: `/edu/class/getClassInfo/${id}`,
        method: 'get',
    })
}

// 新增班级
export function addClass(eduClass) {
    return request({
        url: '/edu/class/addClass',
        method: 'post',
        data: eduClass
    })
}
// 修改班级
export function updateClass(eduClass) {
    return request({
        url: '/edu/class/updateClass',
        method: 'post',
        data: eduClass
    })
}
// 删除班级
export function deleteClass(id) {
    return request({
        url: `/edu/class/deleteClass/${id}`,
        method: 'get',
    })
}