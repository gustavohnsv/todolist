import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-todolist-rouge.vercel.app/'
});

export default api;