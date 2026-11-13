# Accesibilidad de NONOS

Revisión del 13 de noviembre de 2026. Alcance: la aplicación web instalada o abierta en navegador, incluidos los recorridos del adulto mayor, de familiares y cuidadores, la ficha médica pública y la landing. No se evaluaron la pulsera, el botón físico ni el envío de avisos en producción.

El objetivo es **WCAG 2.2 nivel AA**. El [W3C explica que los mismos criterios cubren gran parte de las necesidades de las personas mayores](https://www.w3.org/WAI/older-users/): baja visión, menor precisión al tocar y dificultades para seguir instrucciones o recordar información. Además del mínimo normativo, conviene que las acciones principales se puedan tocar con comodidad (44 × 44 píxeles CSS como referencia), que las instrucciones queden junto a la acción y que el sistema no apure a la persona.

| Criterios de [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Qué se corrigió |
| --- | --- |
| 1.1.1, 1.3.1, 1.3.5: alternativas, estructura y propósito de los campos | Encabezados y regiones de navegación, imágenes decorativas, estructura de listas, etiquetas asociadas, autocompletado y tablas para consultar los datos de los gráficos. |
| 1.4.3, 1.4.4, 1.4.10: contraste, ampliación y redistribución | Se ajustaron colores puntuales, incluido el texto de la barra inferior. El ajuste de letra de NONOS ahora respeta el tamaño base elegido en el navegador. Las barras fijas reservan espacio y varios controles y textos pueden ocupar más de una línea. |
| 2.1.1, 2.4.1–2.4.3, 2.4.7, 2.4.11: teclado, salto, título, orden y visibilidad del foco | Enlace para saltar al contenido, títulos por pantalla, foco al navegar, regreso por teclado y salida de pantalla completa con devolución del foco. Los paneles modales conservan el comportamiento nativo de cierre con Escape. |
| 2.2.1, 2.2.2: tiempos y movimiento | La ficha se abre cuando la persona activa el botón de continuar. Se anuncia que el acceso está por vencer sin leer cada segundo. La landing permite pausar su animación y respeta la preferencia de movimiento reducido. |
| 2.5.3, 2.5.8, 4.1.2: nombre, estado y tamaño de controles | Se nombraron interruptores y controles de edición. Los gráficos densos tienen una opción con área cómoda para ver los mismos datos. Se retiraron falsos botones y se ampliaron algunos controles pequeños. |
| 3.3.1–3.3.3, 3.3.8 y 4.1.3: errores, ayuda, autenticación y estados | Errores anunciados, requisitos de contraseña asociados al campo, soporte de gestores de contraseñas y código médico de seis dígitos que se puede pegar o autocompletar en un solo campo. |

Se conservó el diseño general. Los cambios visibles se limitan a señales de foco, contraste, ajustes para texto ampliado y controles necesarios para acceder a datos o pausar movimiento. La pantalla de SOS muestra el 107 como texto informativo para evitar llamadas accidentales. El tutorial recorre los dos pasos disponibles y vuelve a Ayuda al terminar.

## Verificación realizada

- `npm run lint` y `npm run build` en los dos repositorios.
- Chrome con Playwright y axe-core, a 320 píxeles CSS y con datos simulados: 60 combinaciones de ruta y rol, incluida la landing, más los estados de código incorrecto, código verificado y ficha médica abierta. El barrido final no encontró infracciones en las reglas de WCAG activadas.
- Pruebas de teclado para el salto al contenido, el cambio de formulario, la visibilidad de contraseña, el ingreso y pegado del código, el paso a la ficha, el cierre de paneles y la devolución del foco, y la pausa de animación en la landing.
- Pruebas de texto ampliado con un tamaño base del 200 % y comprobación del ancho desplazable en las pantallas del adulto y el acceso médico inicial.

## Qué verificar antes de declarar conformidad

Una comprobación automatizada solo evalúa parte de WCAG. Hay que validar los recorridos completos en Safari con VoiceOver (iPhone y Mac) y en Chrome con TalkBack o NVDA. Conviene incluir a personas mayores y observar si pueden pedir o cancelar ayuda, entrar con su método habitual, encontrar un contacto, leer su medicación y volver a una pantalla conocida sin asistencia.

- **Teclado y foco:** recorrer con Tab y Mayús+Tab, abrir y cerrar paneles con Enter, Espacio y Escape, y comprobar que la barra fija no tape el control que recibe el foco.
- **Texto y lectura:** verificar zoom al 200 %, redistribución a 320 píxeles CSS, espaciado de texto personalizado y contraste en todos los estados, incluidos formularios abiertos, errores, datos largos y alto contraste del sistema.
- **Autenticación:** comprobar el botón de Google y el gestor de contraseñas en navegadores reales. La prueba local interceptó las solicitudes externas y usó datos simulados.
- **Ficha médica temporal:** confirmar con el equipo responsable si el plazo de 30 minutos se considera esencial para el acceso clínico. Si no lo es, acordar con el backend cómo dar más tiempo de forma segura según [WCAG 2.2, criterio 2.2.1](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html). El límite de seguridad sigue vigente.
- **Servicios reales:** probar alertas, notificaciones y pulsera con cuentas de prueba y un entorno autorizado.

Referencias: [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/), [guía de W3C para personas mayores](https://www.w3.org/WAI/older-users/), [patrón WAI de diálogo modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) y [tamaño mínimo de objetivos](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
