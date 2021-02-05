import axios from 'axios';

const Service = {
  getProfile: username => {
    return axios({
      method: 'post',
      url: '/user/profile',
      data: JSON.stringify(username),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      return res.data;
    }, (err) => {
      console.log(err);
    });
  },
  getSearchResults: search => {
    return axios({
      method: 'post',
      url: '/user/search',
      data: JSON.stringify(search),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      return res.data;
    }, (err) => {
      console.log(err);
    });
  },
}

export default Service;