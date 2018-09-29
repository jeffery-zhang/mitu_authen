import axios from 'axios';

export default (function () {
  const method = 'get';
  const getFunction = (url, params) => {
    return axios({
      method,
      url,
      params,
    })
      .then(res => res.data);
  };
  return {
    getAuthenInfo(userId) {
      return getFunction('/user/get_auth_info', { userId })
    },
  };
})()
