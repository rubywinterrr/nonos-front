interface EntradaCache<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, EntradaCache<unknown>>();

export function getDeCache<T>(clave: string, ttlMs: number): T | null {
  const entrada = cache.get(clave);
  if (!entrada) return null;

  const haExpirado = Date.now() - entrada.timestamp > ttlMs;
  if (haExpirado) {
    cache.delete(clave);
    return null;
  }

  return entrada.data as T;
}

export function guardarEnCache<T>(clave: string, data: T): void {
  cache.set(clave, { data, timestamp: Date.now() });
}

export function invalidarCache(clave: string): void {
  cache.delete(clave);
}