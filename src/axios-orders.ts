import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burguer-builder-app-a1f5e.firebaseio.com/'
});

export default instance;