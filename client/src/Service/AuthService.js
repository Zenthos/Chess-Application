import axios from 'axios';

const Service = {
  login: user => {
    return axios({
      method: 'post',
      url: '/user/login',
      data: JSON.stringify(user),
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
  register: user => {
    return axios({
      method: 'post',
      url: '/user/register',
      data: JSON.stringify(user),
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
  logout: () => {
    return axios.get('/user/logout')
      .then((res) => {
        return res.data;
      }, (err) => {
        console.log(err);
      });
  },
  isAuthenticated: () => {
    return axios.get('/user/authenticated')
      .then((res) => {
        return res.data;
      }, (err) => {
        console.log(err);
      });
  }
}

export default Service;