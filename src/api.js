import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/scenarios',
  baseURL: 'http://localhost:5000/vehicles',
});


  
export default api;
