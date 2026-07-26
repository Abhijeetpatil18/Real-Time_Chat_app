const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_BASE_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, "")}/api`;

export const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api$/, "");