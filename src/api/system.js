import request from '@/utils/request'

/**
 * 菜单模块
 */

// 获取菜单列表
export function getMenuList() {
  return request({
    url: '/sys/menu/list',
    method: 'get',
  })
}
// 添加菜单
export function createMenu(sysMenu) {
  return request({
    url: '/sys/menu/save',
    method: 'post',
    // 把对象转换为json传到后端
    data: sysMenu
  })
}
// 通过id查询菜单详情
export function getMenuInfo(id) {
  return request({
    url: `/sys/menu/info/${id}`,
    method: 'get',
  })
}
// 更新菜单
export function editMenu(sysMenu) {
  return request({
    url: '/sys/menu/update',
    method: 'post',
    // 把对象转换为json传到后端
    data: sysMenu
  })
}
// 删除菜单
export function deleteMenu(id) {
  return request({
    url: `/sys/menu/delete/${id}`,
    method: 'get',
  })
}

/**
 * 角色模块
 */
export function getRoleList(listQuery) {
  return request({
    url: `/sys/role/list`,
    method: 'get',
    params: listQuery
  })
}
// 通过id查询角色详情
export function getRoleInfo(id) {
  return request({
    url: `/sys/role/info/${id}`,
    method: 'get',
  })
}
// 添加角色
export function createRole(sysRole) {
  return request({
    url: '/sys/role/save',
    method: 'post',
    data: sysRole
  })
}
// 更新角色
export function editRole(sysMenu) {
  return request({
    url: '/sys/role/update',
    method: 'post',
    data: sysMenu
  })
}
// 删除角色
export function deleteRole(roleIds) {
  return request({
    url: '/sys/role/delete',
    method: 'post',
    data: roleIds
  })
}

/**
 * 用户模块
 */
export function getUserList(name) {
  // 用户列表 
  return request({
    url: '/sys/user/list',
    method: 'get',
    name
  })
}
