import axios from 'axios';
const api=axios.create({baseURL:'/api',headers:{'Content-Type':'application/json'}});
api.interceptors.request.use(config=>{const token=localStorage.getItem('staynest_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(r=>r,e=>{const message=e.response?.data?.message||e.message||'Something went wrong';return Promise.reject(new Error(message));});
export default api;
