import axios from 'axios';

const http = axios.create({
  baseURL: 'https://data.jsdelivr.com/v1',
});

export default http;
