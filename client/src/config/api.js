let rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").trim().replace(/\/+$/, "");

// Auto-upgrade deployed remote server to http:// (Nginx redirects http to http with 301, which browsers block during CORS preflight)
if (rawUrl.startsWith("http://") && !rawUrl.includes("localhost") && !rawUrl.includes("127.0.0.1")) {
  rawUrl = rawUrl.replace(/^http:\/\//, "http://");
}

export const API_BASE_URL = rawUrl;
