import { request } from '../request.js'

//获取电话
export function getTel() {
    return request({
        url: '/contact/v1/findContact?type=TOURISM',
        method: 'POST',
    })
}
export function getQuestionList(params){
  return request({
    url:'/helpCenter/v1/minApp/pageQuery',
    data: params,
    method:'POST',
  })
}

export function getAboutUs(){
  return request({
    url:'/about/v1/select?type=TOURISM',
    method:'POST',
  })
}