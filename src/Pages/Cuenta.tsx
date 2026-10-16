import { useState } from 'react';

export default function SwitchForm() {
  // 1. Estado para almacenar la configuración del formulario
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    marketingEmails: false,
  });

  // 2. Manejador de cambios genérico para los switches
  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key], // Invierte el booleano actual
    }));
  };

  // 3. Manejador para el envío de datos
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    console.log('Datos enviados al servidor:', settings);
    alert('Configuración guardada con éxito.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md"
      >
        <h2 className="mb-6 text-xl font-bold text-gray-800">
          Ajustes de la Aplicación
        </h2>

        <div className="space-y-6">
          {/* Switch 1: Notificaciones */}
          <label className="flex tyrannical items-center justify-between cursor-pointer select-none">
            <div>
              <span className="block text-sm font-medium text-gray-900">
                Permitir Notificaciones
              </span>
              <span className="text-xs text-gray-500">
                Recibe alertas en tiempo real sobre tu cuenta.
              </span>
            </div>
            
            {/* Contenedor del Switch */}
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
                className="sr-only peer" // 'sr-only' oculta el checkbox original de forma accesible
              />
              {/* Fondo del Switch */}
              <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2"></div>
              {/* Botón/Círculo deslizante */}
              <div className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></div>
            </div>
          </label>

          {/* Switch 2: Modo Oscuro */}
          <label className="flex items-center justify-between cursor-pointer select-none">
            <div>
              <span className="block text-sm font-medium text-gray-900">
                Modo Oscuro
              </span>
              <span className="text-xs text-gray-500">
                Cambia la interfaz a colores oscuros.
              </span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
                className="sr-only peer"
              />
              <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2"></div>
              <div className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></div>
            </div>
          </label>

          {/* Switch 3: Correos de Marketing */}
          <label className="flex items-center justify-between cursor-pointer select-none">
            <div>
              <span className="block text-sm font-medium text-gray-900">
                Correos comerciales
              </span>
              <span className="text-xs text-gray-500">
                Recibe ofertas especiales y descuentos.
              </span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={() => handleToggle('marketingEmails')}
                className="sr-only peer"
              />
              <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2"></div>
              <div className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></div>
            </div>
          </label>
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="mt-8 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Guardar Configuración
        </button>
      </form>
    </div>
  );
}
