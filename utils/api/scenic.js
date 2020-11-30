// /scenicSpot/v1 / queryDestination
export function queryOrder(params) {
  return request({
    url: `/scenicSpot/v1/queryDestination?page=${page}&size=10`,
    method: "POST",
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    }
  })
}