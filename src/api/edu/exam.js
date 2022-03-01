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

// 获取题库题目（模糊查询）
export function getQuestionList(listQuery) {
    return request({
        url: '/edu/questionBank/list',
        method: 'get',
        params: listQuery
    })
}

// 通过id删除题库信息
export function deleteById(id) {
    return request({
        url: `/edu/questionBank/delete/${id}`,
        method: 'get',
    })
}

// 通过id查询题目
export function getQuestionById(id) {
    return request({
        url: `/edu/questionBank/getQuestionById/${id}`,
        method: 'get'
    })
}

// 修改题目信息
export function updateQuestion(bo) {
    return request({
        url: '/edu/questionBank/update',
        method: 'post',
        data: bo
    })
}
// 新增题目
export function saveQuestion(bo) {
    return request({
        url: '/edu/questionBank/addQuestion',
        method: 'post',
        data: bo
    })
}

// 获取考试列表
export function getPaperList(listQuery) {
    return request({
        url: '/edu/examPaper/list',
        method: 'get',
        params: listQuery
    })
}
// 通过ids批量删除
export function deleteByIds(ids) {
    return request({
        url: '/edu/examPaper/delete',
        method: 'delete',
        data: ids
    })
}

// 通过id获取考试题目详情
export function getPaperQuestionById(id) {
    return request({
        url: `/edu/examPaper/getPaperById/${id}`,
        method: 'get'
    })
}

// 通过类型 查询题库题目简要信息
export function getQuestionBriefList(listQuery) {
    return request({
        url: '/edu/questionBank/listBrief',
        method: 'get',
        params: listQuery
    })
}

// 手动创建试卷
export function createPaper(paperBo) {
    return request({
        url: '/edu/examPaper/save',
        method: 'post',
        data: paperBo
    })
}