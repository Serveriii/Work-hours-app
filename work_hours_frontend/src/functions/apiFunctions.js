import axios from "axios";

const API_URL = "http://localhost:3000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debug log

    if (token) {
      // Don't modify the token if it already includes 'Bearer'
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      console.log("Final Authorization header:", config.headers.Authorization); // Debug log
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

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
    const token = localStorage.getItem("token");
    console.log("Making projects request with token:", token); // Debug log

    const response = await api.get("/projects");
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    if (error.response) {
      console.log("Error response:", error.response.data); // Debug response data
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
