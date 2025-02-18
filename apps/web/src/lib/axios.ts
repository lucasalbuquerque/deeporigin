import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001", // TODO: move to env
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
