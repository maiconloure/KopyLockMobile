import axios from "axios";

export const api = axios.create({
  baseURL: 'http://172.30.170.242:3333'
})