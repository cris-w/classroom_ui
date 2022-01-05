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
// 修改角色权限
export function permRole(roleId, menuIds) {
  return request({
    url: `/sys/role/perm/${roleId}`,
    method: 'post',
    data: menuIds
  })
}

/**
 * 用户模块
 */

// 获取用户列表
export function getUserList(listQuery) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: listQuery
  })
}

// 通过id查询用户详情
export function getUserInfo(id) {
  return request({
    url: `/sys/user/info/${id}`,
    method: 'get',
  })
}

// 添加用户
export function createUser(sysUser) {
  return request({
    url: '/sys/user/save',
    method: 'post',
    data: sysUser
  })
}

// 更新用户信息
export function editUser(sysUser) {
  return request({
    url: '/sys/user/update',
    method: 'post',
    data: sysUser
  })
}
// 删除用户
export function deleteUser(userIds) {
  return request({
    url: '/sys/user/delete',
    method: 'post',
    data: userIds
  })
}

// 修改用户角色
export function rolePerm(userId, roleIds) {
  return request({
    url: `/sys/user/role/${userId}`,
    method: 'post',
    data: roleIds
  })
}

// 重置密码
export function repass(userId) {
  return request({
    url: `/sys/user/repass`,
    method: 'post',
    data: userId
  })
}

// 修改用户头像
export function editAvatar(bo) {
  return request({
    url: `/sys/user/editAvatar`,
    method: 'post',
    data: bo
  })
}

// 上传excel
export function addUserBatch(file) {
  return request({
    url: `/sys/user/addUserBatch`,
    method: 'post',
    data: file
  })
}