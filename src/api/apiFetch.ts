interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

export async function apiCall<T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: 'GET',
    headers: options.headers,
    ...options,
  });

  const contentType = response.headers.get('content-type');
  let data: any;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else if (contentType && (contentType.includes('application/xml') || contentType.includes('text/xml'))) {
    data = await response.text();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error: any = new Error(data?.message || data?.error || response.statusText || 'An error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return {
    data: data,
    status: response.status,
    ok: response.ok,
  };
}

export const api = {
  get: function<T = any>(url: string, options?: ApiOptions): Promise<ApiResponse<T>> {
    return apiCall<T>(url, options);
  },
};

export default api;

