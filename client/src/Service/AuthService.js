const Service = {
  login: user => {
    return fetch('/user/login',{
      method: "post",
      body: JSON.stringify(user),
      headers: {
         'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => data);
  },
  register: user => {
    return fetch('/user/register', {
      method: "post",
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => data);
  },
  getProfile: username => {
    return fetch('/user/profile', {
      method: "post",
      body: JSON.stringify(username),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => data);
  },
  logout: () => {
    return fetch('/user/logout')
      .then(res => res.json())
      .then(data => data);
  },
  isAuthenticated: () => {
    return fetch('/user/authenticated')
      .then(res=>{
        if(res.status !== 401)
          return res.json().then(data => data);
        else
          return { isAuthenticated: false, user: null };
      });
  }
}

export default Service;