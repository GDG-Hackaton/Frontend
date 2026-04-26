import axios from "axios";
import baseClient from "../lib/axios";
import { apiBaseUrl } from "../lib/apiConfig";

const normalizeApiPath = (path = "") => {
  if (path.startsWith("/api/")) return path;
  if (path === "/api") return path;
  return `/api${path.startsWith("/") ? path : `/${path}`}`;
};

const createMethod =
  (method) =>
  (path, ...args) =>
    baseClient[method](normalizeApiPath(path), ...args);

const api = {
  get: createMethod("get"),
  post: createMethod("post"),
  put: createMethod("put"),
  patch: createMethod("patch"),
  delete: createMethod("delete"),
  defaults: baseClient.defaults,
  interceptors: baseClient.interceptors,
};

export const aiService = {
  assistant: async (payload) => {
    const response = await api.post("/ai/assistant", payload);
    return response.data;
  },

  extractInfo: async (payload) => {
    const response = await api.post("/ai/extract", payload);
    return response.data;
  },

  generateSummary: async (caseData) => {
    const response = await api.post("/ai/summarize", { caseData });
    return response.data;
  },

  analyzeImage: async (payload) => {
    const response = await api.post("/ai/analyze", payload);
    return response.data;
  },

  verifyFaces: async (payload) => {
    const response = await api.post("/ai/verify", payload);
    return response.data;
  },

  embedImage: async (payload) => {
    const response = await api.post("/ai/embed", payload);
    return response.data;
  },

  searchByEmbedding: async (payload) => {
    const response = await api.post("/ai/search", payload);
    return response.data;
  },
};

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(
      `${apiBaseUrl || ""}/health`.replace(/([^:]\/)\/+/g, "$1"),
    );
    return response.data;
  } catch (error) {
    return {
      status: "offline",
      error: error.message,
    };
  }
};

export default api;
