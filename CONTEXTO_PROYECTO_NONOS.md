# NONOS: contexto del proyecto

**Leído y guardado:** 26 de octubre de 2026. **Fuente:** [Nonos.pdf](output/pdf/Nonos.pdf), 19 páginas y 29 secciones. La copia conserva el archivo recibido sin modificaciones.

Este documento resume el propósito, el alcance y las decisiones que presenta el PDF. Describe la propuesta del proyecto; no confirma que esas funcionalidades estén implementadas. Las tareas y preguntas internas del PDF quedan registradas como contexto, no como órdenes de ejecución. Las solicitudes posteriores del usuario pueden actualizar estas definiciones.

La [guía de estilo de NONOS](GUIA_ESTILO_NONOS.md) complementa este contexto con los patrones visuales y de JSX/Tailwind observados en el frontend.

## 1. Propósito y problema central

NONOS es un sistema de acompañamiento y asistencia para adultos mayores que combina una plataforma web, una pulsera o wearable y un botón físico de emergencia. Busca preservar la autonomía de la persona y facilitar el trabajo de su red de cuidado.

El problema principal es la **fragmentación de la información y del cuidado**: familiares, cuidadores y profesionales pueden tener información parcial o desactualizada. La propuesta consiste en reunir los datos relevantes, registrar cambios y facilitar la comunicación y la respuesta ante emergencias.

El documento delimita la función del sistema a organizar información y acompañamiento. Excluye realizar diagnósticos, indicar tratamientos, sustituir a las personas que cuidan o convertirse en una historia clínica. También busca evitar una experiencia de vigilancia permanente.

**Fuente:** secciones 1-3 y 29, páginas 1-3 y 19.

## 2. Usuarios y red de cuidado

| Perfil | Experiencia y participación previstas |
| --- | --- |
| Adulto mayor | Interfaz especialmente simple y accesible. La interacción física prioritaria es pedir ayuda con el botón de emergencia. Puede consultar información y el código temporal. |
| Familiar | Acompañamiento y seguimiento: consulta información, recibe alertas y conoce cambios según sus permisos. |
| Cuidador | Interfaz operativa para consultar información, registrar cambios, actualizar datos autorizados y actuar ante situaciones que necesitan asistencia. |
| Profesional de emergencia | Acceso temporal de solo lectura al perfil de emergencia mediante QR y código. Sin cuenta permanente, administración ni acceso general a la plataforma. |

Hay **tres perfiles principales**. Cuidador físico y cuidador digital son dos configuraciones del mismo perfil, con la misma interfaz, navegación y funcionalidades. La diferencia está en las notificaciones activadas por defecto:

- Familiar y cuidador físico: se priorizan las categorías más importantes.
- Cuidador digital: todas las categorías están activadas por defecto.
- El documento contempla que puedan configurar categorías e incluso desactivar todas las notificaciones. La definición concreta de categorías prioritarias sigue pendiente.

La red de cuidado puede incluir personas de confianza que reciban un contacto de emergencia sin tener cuenta ni acceso completo. Pertenecer a la red, recibir alertas, consultar datos y modificarlos son capacidades distintas.

**Fuente:** secciones 1, 4, 5, 13 y 16, páginas 1-4 y 9-12.

## 3. Núcleo funcional del MVP

| Área | Alcance descrito |
| --- | --- |
| Información relevante | Identificación, condiciones importantes, alergias y otros datos útiles para el cuidado y la asistencia. El conjunto exacto sigue pendiente. |
| Medicación actual | Medicamentos, dosis, frecuencia y fecha de actualización. Se contempla conservar cambios, autor y fecha. |
| Historial | Acontecimientos relevantes, consultas, situaciones que afecten el cuidado y cambios de medicación; fecha del evento y, cuando corresponda, autor del registro. |
| Medidas anticipadas | Preferencias e indicaciones del adulto mayor para situaciones en las que no pueda comunicarse. Su formulación, validación e inclusión en el perfil de emergencia requieren definición adecuada. |
| Red de cuidado y permisos | Personas vinculadas, responsabilidades y acceso según su función. |
| Notificaciones y alertas | Categorías configurables y avisos asociados a eventos relevantes. |
| Emergencia | Botón físico único, equivalente digital y aviso a los contactos correspondientes. |
| Perfil de emergencia | Vista limitada de información necesaria para asistir a la persona, consultable desde un celular. |
| Acceso protegido | QR de la pulsera más código temporal. |
| Plataforma y accesibilidad | Uso desde celular y computadora; accesibilidad transversal. |

La medicación registra **qué debería estar tomando actualmente la persona**. El control de si tomó cada dosis queda fuera del alcance. El médico no actualiza datos dentro de NONOS: comunica la indicación en la consulta; el adulto mayor puede registrar esa indicación o avisar a su familiar/cuidador para actualizar la plataforma. Los permisos concretos de edición todavía deben detallarse.

**Fuente:** secciones 6-9 y 21, páginas 4-7 y 14-15.

## 4. Emergencia y acceso a los datos

Flujo conceptual de la alerta:

```text
Adulto mayor presiona el botón físico o la acción digital
→ NONOS recibe la señal
→ se genera una alerta
→ se avisa a los contactos correspondientes
→ las personas autorizadas pueden consultar información para asistirlo
```

El dispositivo físico se simplifica a un único botón dedicado a emergencias. La solución técnica, la comunicación Bluetooth y el tamaño del dispositivo siguen en evaluación.

Flujo del acceso de emergencia:

```text
Escanear el QR de la pulsera
→ abrir la página de NONOS
→ ingresar el código temporal
→ validar el código
→ consultar el perfil de emergencia
→ invalidar inmediatamente el código utilizado
```

El código se renueva cada **30 minutos** y se invalida tras un acceso exitoso. Lo pueden consultar el adulto mayor y los familiares o cuidadores autorizados. El QR por sí solo no revela la información.

La vista de emergencia podría contener identificación, información médica relevante, alergias, medicación actual, medidas anticipadas cuando corresponda, contactos y fecha de actualización. La composición definitiva requiere validación. El acceso del profesional es de solo lectura y queda limitado a esa vista.

Están pendientes el orden de aviso, la prioridad de contactos, qué ocurre si nadie responde, qué datos recibe cada destinatario y cómo se registra el evento.

**Fuente:** secciones 10-14 y 20, páginas 7-10 y 13-14.

## 5. Criterios de UX/UI y privacidad

La experiencia del adulto mayor debe reducir las decisiones y la complejidad: botones grandes, texto legible, buen contraste, lenguaje sencillo, jerarquía clara y navegación consistente. La accesibilidad se aplica a todas las funciones.

El azul se considera parte posible de la identidad; las combinaciones de color necesitan validarse durante el diseño. Ato aparece como referencia para pensar interacciones simples y naturales, no como una integración de voz comprometida para el MVP.

La privacidad se basa en dar a cada persona el acceso necesario para su función. El perfil de emergencia contiene una selección de datos y no abre el resto de la plataforma. La matriz detallada de permisos todavía debe definirse.

**Fuente:** secciones 11-13 y 16-18, páginas 8-12.

## 6. Fuera de alcance, pendiente y futuro

| Situación | Elementos mencionados en el documento |
| --- | --- |
| Descartados del alcance actual | Comunidad NONOS, Google Maps relacionado con Alzheimer, cámaras, pastillero físico, control de tomas, QR público y médico habitual como usuario permanente. |
| Pendientes de definición o validación | Datos médicos exactos, permisos, organización de la red, prioridades de contactos, flujo completo de emergencia, categorías de notificación, estructura visual del historial y medidas anticipadas. |
| Pendientes de justificación funcional | Ubicación, datos adicionales del wearable y uso concreto de IA dentro del MVP. La frecuencia cardíaca aparece como posibilidad por evaluar. |
| Pendientes técnicos | Solución física del botón, comunicación Bluetooth e integración del wearable. |
| Posibles ampliaciones futuras | Difusión comercial, compra de la pulsera, visualización 3D del dispositivo, asistencia por llamada y monitoreo permanente. |
| Fuera del proyecto de 2026 | Análisis económico de costos, ingresos y rentabilidad. |

El enfoque de negocio actual prioriza demostrar el problema, la deseabilidad y la factibilidad técnica. Se contempla recurrir a componentes o hardware de terceros cuando ayuden a concentrar el trabajo propio en la plataforma, la experiencia, los permisos, la información y las emergencias.

**Fuente:** secciones 14-15, 18-28, páginas 10-18 y comienzo de la 19.

## 7. Implicaciones para futuras tareas

Estas son conclusiones de lectura para orientar futuras conversaciones, no cambios realizados en la aplicación:

- Diseñar tres experiencias principales: adulto mayor, familiar y cuidador. Los dos tipos de cuidador comparten UI.
- Separar el perfil general del acceso limitado de emergencia y diferenciar consulta de edición.
- Mostrar la vigencia de la información, especialmente la medicación y los datos de emergencia.
- Tratar la invalidación tras uso del código como parte del flujo descrito, además de su vencimiento a los 30 minutos.
- Comprobar cualquier diferencia entre las pantallas existentes y el alcance del PDF antes de implementar una función. Por ejemplo, un texto de interfaz sobre notificaciones obligatorias no coincide automáticamente con la configuración desactivable descrita aquí.
- Mantener explícitos los puntos pendientes, sin convertir ejemplos de IA, ubicación, sensores, voz o monitoreo en requisitos ya aprobados.
- Combinar este contexto funcional con la guía de estilo para conservar el lenguaje visual del frontend.
