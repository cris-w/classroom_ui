import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/login?' + qs.stringify(data),
    method: 'post',
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getCaptcha() {
  return request({
    url: '/captcha',
    method: 'get'
  })
}