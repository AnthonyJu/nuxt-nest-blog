import type { LoginInfo } from './../interfaces/login'

export function authLogin(data: LoginInfo) {
  return request({
    url: '/auth',
    method: 'post',
    data,
  })
}
