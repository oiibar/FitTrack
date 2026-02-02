import axios from 'axios';

axios.defaults.withCredentials = true;

export const BASE_URL = "https://fit-track-serv.vercel.app/api";
// export const BASE_URL = "http://localhost:5000/api";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});