const resolveBaseUrl = () => {
  const envBase =
    (typeof process !== 'undefined' && process?.env?.REACT_APP_API_BASE_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
    (typeof window !== 'undefined' && window.REACT_APP_API_BASE_URL);

  if (envBase) {
    return envBase;
  }

  if (typeof window !== 'undefined') {
    const origin = window.location?.origin || '';
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return '';
    }
  }

  return 'https://nirvana-five-nu.vercel.app';
};

const API_BASE_URL = resolveBaseUrl();

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const buildUrl = (input) => {
  if (!input) {
    throw new Error('apiFetch requires a path or URL');
  }

  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (!trimmed.startsWith('/')) {
    return API_BASE_URL ? `${API_BASE_URL}/${trimmed}` : trimmed;
  }

  if (!API_BASE_URL) {
    return trimmed;
  }

  const base = API_BASE_URL.endsWith('/')
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  return `${base}${path}`;
};

export const apiFetch = async (path, options = {}) => {
  const { headers = {}, body, ...rest } = options;
  const url = buildUrl(path);

  const finalHeaders =
    body instanceof FormData
      ? headers
      : {
          ...defaultHeaders,
          ...headers,
        };

  const response = await fetch(url, {
    credentials: 'include',
    ...rest,
    headers: finalHeaders,
    body,
  });

  return response;
};
