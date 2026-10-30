# CONTEXTO DE CONTINUIDAD — NONOS FRONTEND

Este documento ayuda a otra instancia de Codex a continuar el trabajo en este repositorio. Resume la arquitectura actual, las decisiones confirmadas por la usuaria, las funciones trabajadas y las limitaciones conocidas. No sustituye las indicaciones de la tarea activa ni las fuentes de diseño.

## Estado actual

- Aplicación frontend de NONOS para adultos mayores, familiares y cuidadores.
- Rama habitual: `main`. Los cambios recientes se guardan con commits en español, normalmente con formato Conventional Commits (`style:`, `fix:`, `feat:`), y se suben con push normal cuando la usuaria lo pide.
- El último cambio funcional de interfaz revisado fue la edición de medidas anticipadas desde la pantalla familiar. `npm run build` pasó después de ese cambio. El servicio backend aún puede rechazar la edición desde familiares; ver **Pendientes y riesgos conocidos**.
- Antes de modificar, comprobar siempre `git status`, el contenido de los archivos actuales y los commits recientes: el remoto puede haber avanzado desde otra sesión. Si un push normal se rechaza, traer `origin/main`, rebasar el commit local y volver a hacer push normal; no forzar el historial salvo pedido explícito.

## Arquitectura y tecnologías

- React 19, TypeScript 6, Vite 8 y Tailwind CSS 4.3 con `@tailwindcss/vite`.
- Navegación con `react-router-dom` 7. `src/App.tsx` protege rutas y organiza los espacios `/adulto`, `/familia` y `/cuidador` mediante `RutaProtegida` y `RutaPorRol`.
- Las páginas se cargan principalmente con `React.lazy` y `Suspense` para separar chunks y reducir la carga inicial.
- `src/components/NavBar.tsx` es la navegación compartida que monta el layout. Tiene que señalar y navegar al destino equivalente para el rol activo; su indicador azul anima entre secciones.
- `src/context/AuthContext.tsx` y `src/hooks/useAuth.ts` proporcionan usuario, rol y sesión.
- `src/services/` contiene clientes de API. `usuariosService.ts` expone perfiles, vínculos, adultos mayores vinculados, medidas anticipadas, notificaciones y otros datos. Revisar comentarios y permisos documentados antes de asumir que un rol puede editar recursos de otro.
- `src/utils/` contiene funciones compartidas, por ejemplo `obtenerFechaActual.ts` y `calcularEdad.ts`.
- Estructura principal: `src/Pages/Adulto`, `src/Pages/Familia`, `src/Pages/Cuidador`, `src/components`, `src/services`, `src/context`, `src/hooks` y `src/utils`.
- `npm run build` ejecuta `tsc -b && vite build`. No agregar ni ejecutar pruebas sin que la usuaria lo pida; el build sirve como verificación de compilación cuando corresponda.

## Diseño y convenciones confirmadas

### Estructura de páginas

- Cada pantalla usa `<main className="mainBody">`. En `main` solo se permite añadir o cambiar una utilidad `gap-*`; el resto de estilos va en contenedores internos.
- Reutilizar `Header`, `VueltaAtras`, navbar y componentes existentes. No cambiar header ni navbar cuando la tarea pide únicamente una pantalla, salvo que lo pida explícitamente.
- La interfaz es mobile-first. Usar anchos máximos (`max-w-lg`), `w-full`, wrap y breakpoints cuando correspondan para que el contenido se adapte.
- El lenguaje de producto suele usar voseo rioplatense.

### Tailwind

- Preferir la escala predeterminada y relativa: `p-4`, `p-5`, `gap-3`, `size-10`, `text-lg`, `max-w-lg`. Evitar medidas arbitrarias como `p-[20px]` o `w-[390px]`.
- Usar proporciones para anchos cuando ayuden (`w-95/100`, `max-w-75/100`). No usar fracciones porcentuales para padding si el compilador no las genera.
- Consultar `GUIA_ESTILO_NONOS.md` para notas de Tailwind CSS 4.3, utilidades y puntos de corte.
- No instalar Tailwind: ya forma parte del proyecto.

### Iconos, botones y estados

- Usar `react-icons` para buscar un icono parecido al de Figma. No descargar SVG o imágenes para sustituir iconografía. Estilizar el componente con `size-*`, padding cuando corresponda y `text-*`; el fondo y radio pueden ir en el mismo elemento.
- Los botones deben tener `cursor-pointer`; el hover suele oscurecer un poco el fondo y `active` lo oscurece más. Añadir foco visible cuando sea apropiado. Los controles de una maqueta visual pueden no tener handler si no se pidió funcionalidad.
- Figma se usa como referencia visual, pero los textos y estados deben adaptarse a datos reales si ya existen funcionalidades/carga. Las fechas de home son dinámicas; no reemplazarlas por fechas fijas de muestra.

### Maquetas y lógica

- Para pantallas pedidas como diseño estático, escribir los textos y valores de ejemplo directamente en JSX y evitar arrays, `.map()` u objetos innecesarios. Crear componentes con props cuando la usuaria lo pida o haya una repetición reutilizable real.
- No añadir funcionalidad a una tarea de diseño salvo pedido expreso. Si se pide conservar backend, rutas o funciones existentes, preservarlos.
- En formularios, respetar cuando la usuaria lo haya solicitado los estados de selección, campos requeridos, selección de condiciones y medicamentos, y campos añadidos.
- Cuando una pantalla está conectada a backend, mantener estados de carga/error/guardado en el mismo bloque del contenido y no sustituir datos existentes por ejemplos de Figma.

### Popups y diálogos

- Los diálogos tipo hoja inferior entran desde abajo y salen hacia abajo. Se cierran con X, backdrop, agarradera superior y Escape/cancelación nativa.
- Mantener el diálogo montado/abierto hasta que termine la animación de salida y llamar `close()` al finalizar. La animación no debe desplazar el diálogo horizontalmente durante la entrada.
- Bloquear scroll de la página de fondo mientras está abierto. El popup no debe desbordarse en X; si necesita scroll, solo su contenido interior puede desplazarse en Y.
- Revisar el patrón más reciente en `src/Pages/Familia/contactos.tsx` y las animaciones `popup-subir`/`popup-bajar` en `src/index.css` antes de crear otro popup.

## Funcionalidad y pantallas trabajadas en la conversación

- Homes de adulto y familiar: maquetación móvil guiada por Figma; conservar nombre/datos ya cargados del adulto y usar la fecha del día con la utilidad dinámica del proyecto.
- Signos vitales del familiar y pantallas de home: datos de muestra puestos directamente donde aparecen, como secciones legibles, sin crear fallback complejo con arrays y muchos `const`.
- Navbar: rutas, indicador de página seleccionada según rol y animación del estado azul entre enlaces.
- Registro/configuración de cuenta: inputs requeridos, selección de condiciones médicas, opciones “Sí tengo/No tengo” y generación visual de campos nuevos donde se pidió.
- Contactos familiares: tarjetas basadas en `TarjetaContacto`, helpers para nombre corto e iniciales, popup de invitación. Los diálogos bloquean la interacción accidental y el scroll exterior.
- Cuenta, información del adulto, código de emergencia, medicación, configuración e historial de familiar/adulto/cuidador: varias pantallas maquetadas desde Figma. Mantener datos y backends que ya estén conectados.
- Historial familiar: filtros por todos/episodios/medicación/visitas, lista de registros y popup para registrar observaciones. El popup tiene límite de 400 caracteres y contador, tipo seleccionable, fecha/hora elegible, autor y prioridad; al guardar agrega el registro a la lista. El micrófono usa Web Speech API en español cuando el navegador la soporta, añade el dictado al texto y muestra errores/estado.
- Medidas anticipadas del adulto: `src/Pages/Adulto/Cuidados.tsx` lee y guarda `medidasAnticipadas` como un texto que contiene tres apartados (`Para evitar en una emergencia:`, `Quién quiero que me acompañe:`, `Cómo prefiero ser atendido:`), y mantiene `indicacionesCuidado` aparte. `CajaPreferencias` alterna lectura/edición y utiliza `InputCuidados`.
- Medidas anticipadas de familiar: `src/Pages/Familia/medidasAnticipadas.tsx` refleja Figma con tres tarjetas, contexto y datos de autor/confirmación. No tiene un botón para agregar una cuarta indicación ni el panel informativo sobrante debajo de los botones. Los tres botones “Editar indicación” abren textareas; “Confirmar” carga los adultos vinculados y usa `usuarioService.editarMedidasAnticipadas` para intentar guardar los tres campos en el mismo formato que Adulto. “Restablecer” recupera los textos de muestra localmente.
- Vite: se realizó lazy loading/code splitting de rutas; antes de tocar configuración de chunks, comprobar los tamaños actuales de build.

## Pendientes y riesgos conocidos

1. **Permiso de edición familiar de medidas anticipadas:** el comentario de `usuarioService.editarMedidasAnticipadas` dice que el endpoint es solo para el propio adulto. La página familiar intenta guardar en el adulto vinculado y muestra un error si el backend lo rechaza. Para que el guardado familiar sea real, confirmar la política y, si corresponde, crear/autorizar un endpoint en backend. No sortear controles de autorización desde el frontend.
2. **Acceso cuidador a medidas anticipadas:** `App.tsx` reutiliza la página familiar también en la ruta del cuidador, mientras la carga actual usa `getAdultosMayoresVinculados`, documentado para familiar. Verificar si el cuidador debe tener diseño/consulta propios y cuál API lista sus adultos asignados.
3. **Datos de muestra vs. datos reales en medidas familiares:** la pantalla contiene texto de Figma como valores iniciales cuando el backend no devuelve los apartados. Confirmar si esos ejemplos deben seguir como placeholder visual o dejarse vacíos en una implementación con datos reales.
4. **Matriz de permisos y alcance de perfiles:** consultar `CONTEXTO_PROYECTO_NONOS.md` antes de asumir qué rol puede ver o editar información médica, historial, alertas o medidas anticipadas.
5. **Última verificación:** un `npm run build` pasó tras conectar edición/carga en medidas anticipadas. No se comprobó dictado en un navegador real ni el permiso del backend para edición familiar.

## Fuentes del proyecto

- `GUIA_ESTILO_NONOS.md`: guía detallada de JSX, estilos, estados, medidas, componentes existentes y referencia práctica de Tailwind CSS.
- `CONTEXTO_PROYECTO_NONOS.md`: propósito, perfiles, alcance conceptual, privacidad y pendientes funcionales del proyecto.
- `README.md`: comandos del template. No copiar datos de conexión, credenciales o valores privados a documentación nueva.
