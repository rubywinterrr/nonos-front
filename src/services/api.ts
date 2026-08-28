const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem('nonos_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem('nonos_refresh_token');

    if (refreshToken) {
      try {
        // Intentamos renovar el token vencido
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem('nonos_token', data.token);
          localStorage.setItem('nonos_refresh_token', data.refreshToken);

          // Reintentamos la petición original con el nuevo token
          headers['Authorization'] = `Bearer ${data.token}`;
          const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });

          return retryResponse.json();
        }
      } catch {
        // Si falla el refresco, continuamos a limpiar sesión
      }
    }

    // Si no había refreshToken o si falló la renovación, cerramos sesión
    localStorage.removeItem('nonos_token');
    localStorage.removeItem('nonos_refresh_token');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor vuelve a iniciar sesión.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};