import axios from 'axios'
import qs from 'qs'

export default (function () {
  const method = 'post';
  const postFunction = (url, params) => {
    const data = qs.stringify(params);
    return axios({
      method,
      url,
      data,
    })
      .then(res => res.data);
  };
  return {
    authentication(params) {
      return postFunction('/user/userAuthentication', params)
    },
  };
})()
