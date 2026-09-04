import {useState, useCallback} from "react";

interface EstadoApi<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useapi<T>(){
    const [estado, setEstado] = useState<EstadoApi<T>>({
        data: null,
        loading: false,
        error: null
    });

      const ejecutar = useCallback(async (fetchFn: () => Promise<T>) => {
    setEstado({ data: null, loading: true, error: null });
    try {
      const resultado = await fetchFn();
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

