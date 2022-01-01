import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/login?' + qs.stringify(data),
    method: 'post',
  })
}

export function getInfo() {
  return request({
    url: '/auth/userInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function getCaptcha() {
  return request({
    url: '/auth/captcha',
    method: 'get'
  })
}