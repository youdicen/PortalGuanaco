export const API_URL = 'https://portalguanaco.com/api';

export class ApiError extends Error {
  raw: Record<string, any>;
  constructor(message: string, raw: Record<string, any>) {
    super(message);
    this.raw = raw;
  }
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // If we are sending FormData, we must let the browser set the Content-Type automatically (including boundaries)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  // Handle both HTTP error codes AND application-level errors in the body
  if (!response.ok || data.error) {
    throw new ApiError(data.error || 'Ocurrió un error en la solicitud', data);
  }
  return data;
};
