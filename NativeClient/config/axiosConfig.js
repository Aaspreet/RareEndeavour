import axios from "axios";
import { auth } from "./firebaseConfig";

axios.defaults.baseURL = `${process.env.EXPO_PUBLIC_API_URL}/api`;

axios.interceptors.request.use(
  async (config) => {

    const token = await auth.currentUser?.getIdToken(true);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
