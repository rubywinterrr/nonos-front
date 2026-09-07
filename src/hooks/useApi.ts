import {useState, useCallback} from "react";
import { getDeCache, guardarEnCache } from './cache';

interface EstadoApi<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface OpcionesEjecutar {
  cacheKey?: string;
  ttlMs?: number;
}

export function useApi<T>(){
    const [estado, setEstado] = useState<EstadoApi<T>>({
        data: null,
        loading: false,
        error: null
    });

      const ejecutar = useCallback(async (fetchFn: () => Promise<T>, opciones?: OpcionesEjecutar) => {
        if (opciones?.cacheKey) {
          const cacheado = getDeCache<T>(opciones.cacheKey, opciones.ttlMs ?? 60000);
          if (cacheado) {
            setEstado({ data: cacheado, loading: false, error: null });
            return cacheado;
          }
        } 
    
        setEstado({ data: null, loading: true, error: null });
        try {
          const resultado = await fetchFn();
          if (opciones?.cacheKey) {
            guardarEnCache(opciones.cacheKey, resultado);
          }
          setEstado({ data: resultado, loading: false, error: null });
          return resultado;
        } catch (err) {
          const mensaje = err instanceof Error ? err.message : 'Error desconocido';
          setEstado({ data: null, loading: false, error: mensaje });
          throw err;
        }
      }, []);

  return { ...estado, ejecutar };

}

