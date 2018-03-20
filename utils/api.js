function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function filterNull(obj) {
  for (var key in obj) {
    if (obj[key] === null) {
      delete obj[key]
    }
    if (toType(obj[key]) === 'string') {
      obj[key] = obj[key].trim()
    } else if (toType(obj[key]) === 'object') {
      obj[key] = filterNull(obj[key])
    } else if (toType(obj[key]) === 'array') {
      obj[key] = filterNull(obj[key])
    }
  }
  return obj
}

function apiAjax(method, url, params, cb){
  if (params) {
    params = filterNull(params)
  }
  wx.request({
    method: method,
    url: url,
    data: params,
    header: {
      'content-type': 'application/json'
    },
    complete: function (res) {
      cb(res);
    }
  })
}


module.exports = {
  get: function (url, params, cb) {
    return apiAjax('GET', url, params, cb)
  },
  post: function (url, params, cb) {
    return apiAjax('POST', url, params, cb)
  }
}