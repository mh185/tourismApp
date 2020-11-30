import { request } from '../request.js'
// 景区导览
export function scenicQueryAll(params) {
    return request({
      url: `/scenicSpotCoordinate/v1/queryAll`,
        method: 'POST',
        data: params,
    })
}
// 找公厕
export function findToilet(params) {
    return request({
      url: `/toilet/v1/miniApp/findToilet`,
        method: 'POST',
        data: params,
    })
}
// 导游 Api
export function searchGuide(params) {
    return request({
      url: `/guide/v1/miniApp/searchGuide?page=${params.page}&size=${params.size}`,
        method: 'POST',
        data: params,
    })
}
// 导览
export function selectByScenicIdAndType(params) {
    return request({
        url: '/scenicFacilities/v1/miniApp/selectByScenicIdAndType',
        method: 'POST',
        data: params,
    })
}

// 美食
export function pageQuery(params) {
    return request({
        url: '/deliciousFood/v1/miniApp/pageQuery',
        method: 'POST',
        data: params,
    })
}
// 美食城市
export function pageQueryByCityCode(params) {
    return request({
        url: '/regionAreas/v1/pageQueryByCityCode',
        method: 'POST',
        data: params,
    })
}
// 美食详情
export function selectOne(params) {
    return request({
        url: '/deliciousFood/v1/miniApp/selectOne',
        method: 'POST',
        data: params,
    })
}
// 美食特产
export function pageQuerySpecialty(params) {
    return request({
        url: '/gourmetSpecialty/v1/miniApp/pageQuery',
        method: 'POST',
        data: params,
    })
}
// 美食特产详情
export function selectOneSpecialty(params) {
    return request({
        url: '/gourmetSpecialty/v1/miniApp/selectOne',
        method: 'POST',
        data: params,
    })
}
// 美食特产详情点赞
export function likeOrNotGourmetSpecialty(params) {
    return request({
        url: '/gourmetSpecialtyLikeUser/v1/miniApp/likeOrNotGourmetSpecialty',
        method: 'POST',
        data: params,
    })
}
// 美食特产详情分享
export function shareGourmetSpecialty(params) {
    return request({
        url: '/gourmetSpecialty/v1/miniApp/shareGourmetSpecialty',
        method: 'POST',
        data: params,
    })
}