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
export function getRoleList() {
  // 用户列表 
  return request({
    url: '/sys/role/list',
    method: 'get',
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
