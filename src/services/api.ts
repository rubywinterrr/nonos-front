const BASE_URL = import.meta.env.PROD
  ? '/api'
  : 'https://proyectos-tic.ort.edu.ar/nonos/api'; //cambiar si se quiere apuntar a otro back

// hace UN pedido al back, con el token que haya guardado en ese momento
const hacerPedido = async (endpoint: string, options: RequestInit) => { //requestInit es un tipo de TS que describe las opciones que podes pasarle a fetch, como method, body, headers, etc
  const token = localStorage.getItem('nonos_token');

  const headers: Record<string, string> = { //record deja meter una clave mas al objeto y aclara que deben ser strings
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`; //arma request header de autorizacion como pide el back, con el token si existe
  }

  return await fetch(`${BASE_URL}${endpoint}`, { ...options, headers }); //devuelve fetch con url completa y header armado 

};

// cambia token vencido por uno nuevo. promete un booleano; true si pudo, false si no
const renovarToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('nonos_refresh_token');
  if (!refreshToken) {
    return false;
  }

  try { // todo lo que sigue corre normal, pero si algo va mal, el codigo se va directo al catch
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) { // la respuesta no fue un ok (codigos entre 200-299 aka bien), entonces no se pudo renovar el token
      return false;
    }

    const data = await response.json(); //lee el json y lo convierte en un objeto de js
    localStorage.setItem('nonos_token', data.token);
    localStorage.setItem('nonos_refresh_token', data.refreshToken);
    return true;
  } catch {
    return false;
  }
};

// borra la sesión y manda al login
const cerrarSesion = () => {
  localStorage.removeItem('nonos_token');
  localStorage.removeItem('nonos_refresh_token');
  window.location.href = '/';
};

// convierte la respuesta en datos, o tira un error si algo salió mal
const leerRespuesta = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); //cuando el back dice que no, manda un JSON explicando por qué (errorData) (esto lo intenta leer, y si no puede, devuelve un objeto vacio por el catch)
    throw new Error( // 
      errorData.message || errorData.error || `Error ${response.status}: ${response.statusText}`
    );
  }

  if (response.status === 204) {
    return undefined as T; // 204 = sin contenido, no hay nada que leer, pero que sea T asi ts no se queja 
  }

  return response.json(); // objeto { token, refreshToken } 
};

// función que usan todos los services
export const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  let response = await hacerPedido(endpoint, options);

  // 401 = el token venció, intentamos renovarlo y repetimos el pedido
  if (response.status === 401) {
    const pudoRenovar = await renovarToken();

    if (!pudoRenovar) {
      cerrarSesion();
      throw new Error('Sesión expirada. Por favor vuelve a iniciar sesión.');
    }

    response = await hacerPedido(endpoint, options);
  }

  return leerRespuesta<T>(response); //cumple promesa de t 
};