import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/work_logs";

export const getWorkLogs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getProjects = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addWorkLog = async (workLog) => {
  const response = await axios.post(API_URL, workLog);
  return response.data;
};

export const deleteWorkLog = async (workLog) => {
  const response = await axios.delete(API_URL, workLog);
  return response.data;
};




