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

// 查询所有题目简要信息
export function getAllQuestionBriefList() {
    return request({
        url: '/edu/questionBank/getAll',
        method: 'get'
    })
}

// 创建试卷
export function createPaper(paperBo) {
    return request({
        url: '/edu/examPaper/save',
        method: 'post',
        data: paperBo
    })
}

// 修改试卷
export function updatePaper(paperBo) {
    return request({
        url: '/edu/examPaper/update',
        method: 'post',
        data: paperBo
    })
}

// 修改试卷的回显
export function listPaperQuestion(paperId) {
    return request({
        url: `/edu/examPaper/listPaperQuestionByPaperId/${paperId}`,
        method: 'get'
    })
}

//  发布试卷
export function publishPaper(examBo) {
    return request({
        url: '/edu/examPaper/publishExam',
        method: 'post',
        data: examBo
    })
}

export function getTimeLimit(paperId, classId) {
    return request({
        url: `/edu/examPaper/getTimeLimit/${paperId}/${classId}`,
        method: 'get'
    })
}

//  通过试卷ID 获取发布班级ID
export function listClassIdsByPaperId(paperId) {
    return request({
        url: `/edu/examPaper/listClassIdsByPaperId/${paperId}`,
        method: 'get',
    })
}

// 查询发布试卷信息
export function listPublishExam(listQuery) {
    return request({
        url: '/edu/examPaper/listPublishExam',
        method: 'get',
        params: listQuery
    })
}

// 通过id 删除发布试卷信息
export function deletePublishById(id) {
    return request({
        url: `/edu/examPaper/deletePublish/${id}`,
        method: 'get',
    })
}

// 查询所有学生考试记录
export function listStudentExam() {
    return request({
        url: '/edu/studentExam/list',
        method: 'get',
    })
}

// 通过id查询学生考试记录
export function listStudentExamById(paperId, classId) {
    return request({
        url: `/edu/studentExam/listExamById/${paperId}/${classId}`,
        method: 'get',
    })
}

// 通过学生ID 获取该学生考过的所有试卷
export function listByStudentId(studentId) {
    return request({
        url: `/edu/studentExam/listByStudentId/${studentId}`,
        method: 'get',
    })
}

// 通过学生ID 和 班级ID 获取考试题目信息
export function listQuestionById(studentId, paperId) {
    return request({
        url: `/edu/studentExam/listQuestionById/${studentId}/${paperId}`,
        method: 'get',
    })
}

// 新增学生考试记录
export function saveStudentPaper(studentPaperBo) {
    return request({
        url: '/edu/studentExam/save',
        method: 'post',
        data: studentPaperBo
    })
}

// 修改学生考试 题目成绩 updateStudentQuestion
export function updateStudentQuestion(question) {
    return request({
        url: '/edu/studentExam/updateStudentQuestion',
        method: 'post',
        data: question
    })
}

// 批阅试卷
export function updateStudentExam(exam) {
    return request({
        url: '/edu/studentExam/updateStudentExam',
        method: 'post',
        data: exam
    })
}
// 打回试卷
export function removeExamById(paperId, studentId) {
    return request({
        url: `/edu/studentExam/remove/${paperId}/${studentId}`,
        method: 'get'
    })
}

