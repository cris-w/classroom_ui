import request from '@/utils/request'

// 获取所有知识点
export function getKnowledgePointList() {
    return request({
        url: '/edu/knowledgePoint/list',
        method: 'get'
    })
}

// 通过id获取知识点
export function getById(id) {
    return request({
        url: `/edu/knowledgePoint/getById/${id}`,
        method: 'get'
    })
}

// 创建知识点
export function addKnowledgePoint(point) {
    return request({
        url: `/edu/knowledgePoint/save`,
        method: 'post',
        data: point
    })
}

// 修改知识点
export function updateKnowledgePoint(point) {
    return request({
        url: `/edu/knowledgePoint/update`,
        method: 'post',
        data: point
    })
}

// 通过id删除知识点
export function delByIds(ids) {
    return request({
        url: '/edu/knowledgePoint/delete',
        method: 'post',
        data: ids
    })
}
