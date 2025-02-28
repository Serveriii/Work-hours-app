import axios from "axios";

const API_URL = "http://localhost:3000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Update your existing API functions to handle unauthorized responses
const handleUnauthorized = (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  throw error;
};

export const getProjects = async () => {
  try {
    const response = await api.get("/projects");
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post("/projects", {
      project: projectData,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/projects/${id}`, {
      project: {
        ...projectData,
        work_type: projectData.work_type || "development",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const updateWorkLogged = async (id, workLogData) => {
  try {
    const response = await api.put(`/projects/${id}/log_work`, {
      project: workLogData,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating work logged:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
