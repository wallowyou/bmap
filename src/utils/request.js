import axios from "axios";
import qs from "qs";
// create an axios instance
const service = axios.create({
  baseURL: "", // url = base url + request url
  timeout: 5000, // request timeout
  transformRequest: [
    function(data, header) {
      if (header["Content-type"] === "multipart/form-data") {
        // 如果是上传文件则不需要处理
      } else if (header["Content-Type"] === "application/json") {
        // 如果是application/json
        return JSON.stringify(data);
      } else if (
        header["Content-Type"] === "application/x-www-form-urlencoded"
      ) {
        // 如果是表单上传,需要传递类似key1=val1&key2=val2等类型数据时使用
        return qs.stringify(data);
      }
    }
  ]
});
// request interceptor
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // do something with request error
    return Promise.reject(error);
  }
);

// 返回拦截器
service.interceptors.response.use();
/**
 *
 * 封装get方法,参数为url和请求参数对象，具体的返回的resolve根据后台确定,以下的其他请求方法参数类似也可以修改
 * @export
 * @param {*} url
 * @param {*} [params={}]
 * @returns
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params: params
      })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/**
 *
 *封装post方法,参数为url 和请求参数对象，具体的返回的resolve根据后台确定
 * @export
 * @param {*} url
 * @param {*} [data={}]
 * @returns
 */
export function post(
  url,
  data = {},
  config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
) {
  return new Promise((resolve, reject) => {
    service.post(url, data, config).then(
      response => {
        resolve(response);
      },
      err => {
        reject(err);
      }
    );
  });
}
export default service;
