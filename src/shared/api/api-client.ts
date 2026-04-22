const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const API_BASE_ROOT = BASE_URL.replace(/\/api$/, "");

/**
 * Resolves a file path to its full URL on the backend.
 */
export const getFileUrl = (path: string | null | undefined): string => {
  if (!path) return "#";
  if (path.startsWith("http")) return path;
  // Ensure we don't end up with double slashes
  const cleanPath = path.replace(/^\//, "");
  return `${API_BASE_ROOT}/${cleanPath}`;
};

/**
 * Generic Fetch Wrapper (API Client)
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cleanBaseUrl = BASE_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${cleanBaseUrl}${cleanEndpoint}`;
  
  const isFormData = options.body instanceof FormData;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    // Return the JSON data
    return (await response.json()) as T;
  } catch (error: any) {
    console.error(`[API Client Error] [${url}]:`, error.message);
    throw error;
  }
}

/**
 * Convenience methods for CRUD
 */
export const http = {
  get: <T>(url: string, options?: RequestInit) => 
    apiClient<T>(url, { ...options, method: "GET" }),
  
  post: <T>(url: string, body: any, options?: RequestInit) => 
    apiClient<T>(url, { 
      ...options, 
      method: "POST", 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  
  put: <T>(url: string, body: any, options?: RequestInit) => 
    apiClient<T>(url, { 
      ...options, 
      method: "PUT", 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  
  patch: <T>(url: string, body: any, options?: RequestInit) => 
    apiClient<T>(url, { 
      ...options, 
      method: "PATCH", 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  
  delete: <T>(url: string, options?: RequestInit) => 
    apiClient<T>(url, { ...options, method: "DELETE" }),
};
