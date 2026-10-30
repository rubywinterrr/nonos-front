# NONOS: guía del estilo de estructura y diseño

Referencia para crear pantallas en Figma y llevar diseños de Figma a React con el mismo lenguaje visual y la misma forma de estructurar este proyecto.

Para el propósito, los usuarios y el alcance funcional descriptos en el PDF del proyecto, consultar [CONTEXTO_PROYECTO_NONOS.md](CONTEXTO_PROYECTO_NONOS.md).

**Fecha del análisis:** 25 de octubre de 2026. **Base:** código local actual, incluidos los cambios en curso. Los “fragmentos de HTML” son JSX dentro de archivos `.tsx`.

Esta guía describe lo observado. Las equivalencias y los nombres propuestos para Figma se identifican como propuestas; todavía no son una biblioteca ni variables creadas en Figma. El análisis se hizo sobre el código y el CSS generado, sin verificar las pantallas en un navegador.

## 1. La identidad que hay que conservar

NONOS usa pantallas verticales, bloques amplios, tarjetas de esquinas redondeadas, tipografía legible e íconos grandes. El contenido se presenta en grupos breves: un título, una explicación y una acción explícita. La mayoría de las superficies son celestes, blancas o grises suaves; el negro da énfasis y el rojo identifica urgencias y advertencias.

Hay tres tratamientos principales:

| Tratamiento | Dónde aparece | Rasgos |
| --- | --- | --- |
| Pantalla cotidiana | Inicio, salud, contactos, ajustes y cuenta | Fondo celeste, tarjetas blancas, texto oscuro y apoyos grises |
| Ayuda y acompañamiento | Ayuda, tutoriales y cuidados | Fondo blanco; ayuda y tutoriales usan azul intenso, fotos y paneles celestes; cuidados usa azul apagado y confirmación negra |
| Emergencia | Pedido de ayuda, estado de alerta y código | Rojo para actuar, negro para destacar información y estados escritos con claridad |

**Receta más representativa:** fondo `#B9D2FF`, contenedor vertical con 20 px de padding, separación de 28 px entre bloques, tarjeta blanca con radio de 16 px y padding de 20 px, título semibold y descripción gris.

## 2. Alcance y fuentes

Se revisaron los **16 archivos de `src/Pages`**, sus subcarpetas y los **20 componentes de `src/components`**, además de [los estilos globales](src/index.css), [las rutas](src/App.tsx), [la carga de fuentes](index.html), [las dependencias](package.json) y [la integración con Vite](vite.config.ts).

| Página | Qué aporta al análisis |
| --- | --- |
| [Adulto/Home.tsx](src/Pages/Adulto/Home.tsx) | Tarjetas de acceso con ícono, texto y flecha; acción SOS destacada |
| [Adulto/Salud.tsx](src/Pages/Adulto/Salud.tsx) | Secciones de consulta, datos personales, medicación y aviso médico |
| [Adulto/Contactos.tsx](src/Pages/Adulto/Contactos.tsx) | Contactos con foto, llamada y bloque de ayuda |
| [Adulto/PantallaSOS.tsx](src/Pages/Adulto/PantallaSOS.tsx) | Confirmación de emergencia, contactos notificados y acciones |
| [Adulto/CodigoDeEmergencia.tsx](src/Pages/Adulto/CodigoDeEmergencia.tsx) | Panel negro, código grande, temporizador y pantalla completa |
| [Adulto/Cuidados.tsx](src/Pages/Adulto/Cuidados.tsx) | Fondo blanco, preferencias editables y aviso de privacidad |
| [Adulto/Ayuda.tsx](src/Pages/Adulto/Ayuda.tsx) | Degradado suave, tutorial con foto y asistencia humana |
| [Adulto/Tutorial1.tsx](src/Pages/Adulto/Tutorial1.tsx) | Paso guiado, progreso, foto, consejo y comprobaciones |
| [Adulto/Tutorial1.2.tsx](src/Pages/Adulto/Tutorial1.2.tsx) | Continuidad del tutorial y tratamiento de una acción urgente |
| [Configuration.tsx](src/Pages/Configuration.tsx) | Ajustes, interruptores, personas vinculadas y guardado |
| [Cuenta.tsx](src/Pages/Cuenta.tsx) | Perfil, dispositivos, estados vacíos e invitaciones |
| [LogIn.tsx](src/Pages/LogIn.tsx) | Composición centrada y alternancia entre ingreso y registro |
| [SinRuta.tsx](src/Pages/SinRuta.tsx) | Mensaje de error y acción para volver |
| [Familia/Home.tsx](src/Pages/Familia/Home.tsx) | Solo estructura inicial con `mainBody` y `Header` |
| [Cuidador/Home.tsx](src/Pages/Cuidador/Home.tsx) | Solo estructura inicial con encabezado y vuelta atrás |
| [Adulto/administrarVinculo.tsx](src/Pages/Adulto/administrarVinculo.tsx) | Archivo vacío al analizarlo; no aporta una pantalla de referencia |

La referencia visual más desarrollada está en Adulto y ajustes. Las páginas de Familia y Cuidador todavía no permiten deducir un sistema propio para esos roles.

Para comprobar la recurrencia, se extrajeron clases de los atributos `className`, incluidas cadenas en expresiones: en páginas aparecen `flex` 182 veces, `w-full` 115, `flex-col` 83, `font-semibold` 59, `rounded-2xl` 55 y `p-5` 34. Estos conteos describen el código, no la cantidad de elementos visibles al mismo tiempo.

## 3. Cómo está escrita la estructura JSX

### Composición de una página

El patrón dominante es un componente de función exportado por defecto, con lógica antes del `return` y un fragmento `<>...</>` alrededor de `<main>`. Dentro de `main` se ordenan los elementos según se leen en pantalla:

```text
Página
└── main.mainBody
    ├── Header
    ├── VueltaAtras con el título de la pantalla
    ├── Introducción o estado, cuando corresponde
    ├── Bloques de contenido
    │   └── Tarjetas, filas o componentes repetibles
    └── Aviso final o acción principal

LayoutConFooter en App.tsx
├── Outlet que renderiza la página
└── NavBar2
```

La barra inferior se monta desde `LayoutConFooter`; una página de ese grupo no necesita volver a incluirla. Inicio usa saludo y fecha en lugar de `VueltaAtras`. Ingreso tiene un contenedor propio centrado y no usa `mainBody`.

### Organización del contenido

**Preferencia confirmada para las maquetas estáticas de esta etapa:** escribir cada texto y valor directamente dentro de su etiqueta JSX, con las clases de Tailwind en `className`. No crear objetos de datos de Figma, props de datos, interfaces, capas de respaldo ni `.map()` para estas pantallas fijas. Conservar únicamente la lógica y la navegación existentes que se haya pedido mantener; usar elementos semánticos como `progress` aunque sus valores sean literales.

**Excepción confirmada:** la fecha y hora de los home, incluido el día de «Rutina de hoy», se obtienen de la fecha actual mediante `src/utils/obtenerFechaActual.ts` al renderizar la pantalla. No deben quedar como textos fijos del diseño.

**Datos existentes:** en el home del adulto, conservar los datos del usuario autenticado mediante `useAuth`: el primer nombre en el saludo, el nombre completo en la tarjeta y la edad calculada con `calcularEdad` cuando haya fecha de nacimiento. Si falta información, usar los mensajes neutros del proyecto; no reemplazar los datos disponibles por nombres o edades de muestra de Figma.

- Predominan `div` anidados, con algunos `section` para agrupar bloques grandes.
- El layout se expresa directamente en cada `className`: filas, columnas, alineación, medidas y apariencia quedan junto al elemento.
- Un bloque habitual combina un ícono a la izquierda con otro `div` vertical de título y descripción.
- Las filas de acceso agregan una flecha a la derecha; las de ajustes agregan un interruptor o botón.
- Los textos principales se alinean a la izquierda. Se centran confirmaciones, códigos, acciones y algunos mensajes de inicio.
- Las repeticiones con datos se renderizan con `.map()` y `key`: contactos, medicamentos, condiciones y personas vinculadas.
- La visibilidad de errores, carga, formularios y estados se expresa mediante `&&` y ternarios dentro del JSX.

Los componentes reutilizables reciben props concretas en interfaces de TypeScript: `titulo`, `nombre`, `dosis`, `horarios`, `editable`, `checked` y `onChange`. La reutilización se organiza alrededor de bloques de la aplicación; todavía no hay una capa general de componentes `Card`, `Button` o variantes mediante una biblioteca de estilos.

### Convenciones de escritura observadas

Se usan imports de componentes, hooks, servicios e íconos al comienzo; JSX con sangría generalmente de dos espacios; atributos largos repartidos en varias líneas; y clases mayormente en una sola cadena. Los nombres mezclan español e inglés, y los archivos combinan mayúsculas iniciales con nombres como `cajaMedicacion.tsx` o `vueltaAtras.tsx`.

**No hay un orden único de clases:** algunas cadenas empiezan por color y radio; otras por tamaño o Flexbox. Lo estable es usar utilidades locales y explícitas. Para continuar el proyecto conviene seguir la forma del archivo vecino y reutilizar sus componentes.

## 4. El contenedor base: `mainBody`

**Regla confirmada por la usuaria el 29 de octubre de 2026:** aplicar `mainBody` directamente a la etiqueta `<main>` de cada pantalla. En su `className` solo se permite agregar o cambiar una clase `gap-*`: `<main className="mainBody">` o `<main className="mainBody gap-5">`. No agregar otras clases a `<main>` (por ejemplo, `bg-*`, `p-*`, `px-*`, `pt-*`, `pb-*`, `w-*` o `text-*`). Colocar el encabezado y el contenido dentro de ese contenedor; aplicar los demás estilos a `div`, `section` u otros elementos internos, sin trasladar `mainBody` ni anidar etiquetas `main`.

La utilidad está declarada con `@utility` en [src/index.css](src/index.css). Tailwind se integra mediante `@tailwindcss/vite` y se configura principalmente en CSS con `@theme`.

| Propiedad | Valor real | Traducción a Figma |
| --- | --- | --- |
| Alto mínimo | `89vh` | Frame que ocupa al menos ese porcentaje del alto de la ventana |
| Ancho | `100vw` | Ancho de la ventana |
| Fondo | `#B9D2FF` | Relleno celeste principal |
| Dirección | `flex-direction: column` | Auto Layout vertical |
| Alineación transversal | `align-items: baseline` | Conservar alineación de contenido; muchos hijos usan ancho completo |
| Padding general | `1.25rem` | 20 px con raíz de 16 px |
| Padding inferior | `15vh` | Reserva para la barra inferior flotante |
| Separación entre hijos | `1.75rem` | 28 px con raíz de 16 px |

En código anterior aparecen `mainBody gap-7`, `mainBody gap-5` y `mainBody bg-white`. Son ejemplos históricos: para pantallas nuevas se aplica la regla anterior y la única clase adicional permitida en `<main>` es `gap-*`.

En un frame móvil de **390 × 844 px propuesto para trabajar en Figma**, el padding lateral base deja 350 px de contenido y la reserva inferior de `15vh` equivale a 126,6 px. Ese tamaño de frame es una propuesta de trabajo, no una medida fija definida por la aplicación.

## 5. Cómo se usa Tailwind

Para aplicar la documentación oficial al proyecto, consultar también las [notas de lectura de Tailwind CSS 4.3](#17-referencia-práctica-de-tailwind-css).

### Preferencia confirmada para futuros diseños

Indicación de la usuaria del 26 de octubre de 2026: usar las medidas de la escala predeterminada de Tailwind para padding, separación, tamaños, tipografía, interlineado, espaciado entre letras y sombras. Elegir clases como `p-5`, `p-12`, `gap-3`, `size-10`, `text-lg`, `leading-7`, `tracking-tight`, `shadow-xs` y `max-w-lg`, en lugar de medidas arbitrarias como `p-[20px]`, `text-[17px]` o `max-w-[480px]`. No trasladar esos mismos valores rígidos a estilos en línea ni crear utilidades propias para conservarlos. Los ejemplos antiguos entre corchetes que aparecen más abajo describen el código observado al analizarlo; no son la preferencia para pantallas nuevas.

Usar anchos y altos proporcionales cuando ayuden al layout, por ejemplo `w-full`, `w-95/100` o `max-w-75/100`, y adaptar la composición con los breakpoints estándar (`sm:`, `md:`, `lg:`) o consultas de contenedor si corresponde. Las utilidades de la escala se basan en `rem` y acompañan el ajuste del tamaño raíz del proyecto; el ajuste a distintos anchos también depende de la distribución, el wrap y los límites del contenido.

La sintaxis de fracciones depende de cada utilidad: en el compilador instalado, `w-95/100` genera un ancho del 95%, pero `p-5/100` y `px-5/100` no generan CSS. Para padding, usar clases admitidas de la escala como `p-5`; verificar la generación antes de usar otra combinación proporcional.

### Utilidades directas y medidas relativas

Las combinaciones más características son:

```tsx
// Tarjeta de contenido
className="bg-white rounded-2xl w-full p-5 flex flex-col gap-5"

// Fila de ícono y texto
className="flex items-center gap-3"

// Grupo de textos
className="flex flex-col items-start justify-start gap-1"

// Contenido que pasa de columna a fila
className="w-full flex flex-col lg:flex-row gap-5"
```

Son síntesis de patrones existentes, no nuevos componentes ya implementados.

Se usan mucho fracciones con denominador 100: `w-80/100`, `max-w-75/100`, `lg:w-32/100`, `h-85/100`. Expresan porcentajes del contenedor; **`w-32/100` significa 32%, no 32 px**. La generación de estas clases se comprobó con el compilador instalado.

Las medidas numéricas sin fracción usan la escala de Tailwind: `w-15` son 60 px y `min-h-30` son 120 px con raíz de 16 px. Los valores entre corchetes aparecen cuando hace falta una medida concreta: `h-[9vh]`, `bg-[#EFF4FC]`, `active:scale-[0.99]` o `gap-[2.70px]`.

### CSS y estilos en línea

El CSS global se reserva para la base de la aplicación, fuentes, transiciones, scroll, tokens y pantalla completa. Los estilos en línea aparecen para valores dinámicos o imágenes: porcentaje del progreso, `backgroundImage`, recorte de la foto y desplazamiento de la contraseña. La apariencia estática se escribe principalmente con Tailwind.

## 6. Tipografía

La fuente principal declarada en `html` es **Atkinson Hyperlegible Next**, con peso base 400. Se carga desde Google Fonts en [index.html](index.html). También se descarga Playwrite NO, pero no se encontró aplicada en las páginas o componentes revisados. La contraseña usa `font-mono` como excepción localizada.

| Uso observado | Clases | Tamaño / interlineado con raíz de 16 px |
| --- | --- | --- |
| Ayudas pequeñas, metadatos y algunas etiquetas de cuenta | `text-xs` | 12 / 16 px |
| Texto secundario compacto | `text-sm` | 14 / 20 px |
| Texto con `text-base` | `text-base` | 16 / 24 px |
| Explicaciones y títulos de tarjeta | `text-lg` | 18 / 28 px |
| Títulos de tarjeta y acciones | `text-xl` | 20 / 28 px |
| Títulos principales y de sección | `text-2xl` | 24 / 32 px |
| Títulos grandes y pasos del tutorial | `text-3xl` | 30 / 36 px |
| Mensaje de ruta no encontrada; también íconos | `text-4xl` | 36 / 40 px |
| Código de emergencia; también íconos | `text-5xl` | 48 / 48 px |

Los pesos más representativos son `font-semibold` (600) y `font-bold` (700). También hay `font-medium` (500), peso normal y usos puntuales de `font-black` (900). La fuente cargada declara pesos 200–800; 900 queda fuera de ese rango declarado y no conviene tomarlo como estilo tipográfico base.

El componente [AjusteTamanios.tsx](src/components/AjusteTamanios.tsx) cambia el tamaño raíz a **15 px, 16 px o 17 px**. Por eso también escalan paddings, gaps y otras medidas en `rem`, además de las letras. Por ejemplo, `text-2xl` mide 22,5 / 24 / 25,5 px y `p-5` mide 18,75 / 20 / 21,25 px. No se encontró persistencia de esa preferencia en el componente.

Para Figma, usar 16 px como base de la referencia y probar los otros dos tamaños sin recortar textos. Los títulos suelen ser breves; las descripciones grises pueden ocupar varias líneas. Cuenta contiene texto de 12–14 px, una variante más compacta que las pantallas principales de Adulto.

**Cuidado:** `text-md` y `text-1xl` aparecen en el código, pero no generan utilidades en la configuración actual. Su tamaño resulta de la cascada y la herencia; no definen estilos tipográficos adicionales.

## 7. Colores aprendidos

### Colores explícitos del proyecto

Los nombres de la primera columna son **propuestas para variables de Figma**. Los valores y usos se extrajeron del código; la mayoría se escribe directamente en las clases y todavía no tiene un token semántico compartido.

| Nombre propuesto | Valor | Uso observado |
| --- | --- | --- |
| `background/app` | `#B9D2FF` | Fondo de `body` y de `mainBody`; disponible como `bg-main-blue` |
| `background/login` | `#F7F9FF` | Token `bg-main`, usado en ingreso |
| `surface/default` | `#FFFFFF` | Tarjetas, campos y páginas blancas |
| `surface/dark` | `#000000` | Código, bloque de emergencia y algunas acciones |
| `surface/info` | `#EFF4FC` | Avisos y contactos notificados |
| `surface/support` | `#DAEAF9` | Asistencia humana y consejos |
| `surface/tutorial` | `#EBF5FF` | Checklist y progreso del tutorial |
| `surface/tutorial-label` | `#DBE1FF` | Etiqueta inicial y fondos de ícono |
| `surface/icon` | `#E4E8F1` | Íconos de las tarjetas de inicio |
| `surface/status` | `#D6E0F1` | Estado de emergencia e ícono informativo |
| `surface/secondary-action` | `#E9EEF6` | Cancelación y edición de indicaciones |
| `surface/fullscreen-action` | `#DEE3EB` | Botón para ampliar el código |
| `surface/selected` | `#EEF4FF` | Selección del tamaño de texto |
| `surface/role-selected` | `#E4EBFE` | Rol seleccionado en invitaciones |
| `surface/photo-caption` | `#F9F9F8` | Texto superpuesto a fotos del tutorial |
| `accent/care` | `#4A7FBF` | Íconos y borde de preferencias de cuidados |
| `accent/action-custom` | `#1A62FF` | Guardar e invitar |
| `accent/role-selected` | `#1D5EFF` | Borde y texto de rol seleccionado |
| `accent/deep` | `#002B2F` | Texto de marca en ingreso y selección de navegación con opacidad |
| `emergency/action` | `#FF0000` | Pedido urgente de inicio |
| `emergency/action-hover` | `#DE0000` | Hover del pedido urgente |
| `emergency/icon` | `#FF2626` | Círculo del ícono de SOS |
| `emergency/notice` | `#FFDAD6` | Advertencia sobre condiciones médicas |
| `emergency/timer` | `#E8491D` | Tiempo restante e ícono de reloj |
| `surface/dark-inset` | `#1A1A1A` | Ícono y cierre del panel de código |
| `surface/timer` | `#101A21` | Panel interno del temporizador |
| `status/device-light` | `#84F6E6` / `#006A61` | Indicador de luz de la pulsera en el tutorial |

Otros colores puntuales son `#1A202C` en ajustes de texto, `#2C3E50` en íconos de roles y `#F5F5F5` en hover de ingreso. No son el centro de la paleta.

### Familias de Tailwind

Se usan `gray-100/200/300` para superficies y bordes, `gray-500/600` para texto secundario y `blue-600/700/800` para acciones, ayudas y progresos. Verde con fondos claros, borde e ícono indica activación o comprobación. Rojo y naranja acompañan errores, atención médica y emergencia. Cuenta e invitaciones también usan `slate`.

La versión instalada usa valores **OKLCH** para esos colores. Algunos valores exactos verificados en su tema local:

| Token | Valor |
| --- | --- |
| `blue-600` | `oklch(54.6% 0.245 262.881)` |
| `blue-700` | `oklch(48.8% 0.243 264.376)` |
| `blue-800` | `oklch(42.4% 0.199 265.638)` |
| `gray-100` | `oklch(96.7% 0.003 264.542)` |
| `gray-200` | `oklch(92.8% 0.006 264.531)` |
| `gray-500` | `oklch(55.1% 0.027 264.364)` |
| `gray-600` | `oklch(44.6% 0.03 256.802)` |

Al crear variables en Figma, convertir estos valores con una herramienta compatible y comprobar la conversión; no reemplazarlos automáticamente por los hex de otra versión de Tailwind ni equiparar `blue-600` con `#1A62FF`.

El degradado de Ayuda es suave, de `indigo-100` a `sky-100`, con `bg-linear-65`. El del temporizador va de `red-500` a `green-500`. Son recursos localizados, no el fondo general de las tarjetas.

## 8. Espaciados, dimensiones, bordes y sombras

### Diálogos y popups móviles

Los popups móviles que aparecen como una hoja inferior deben abrirse con una animación de entrada desde abajo y cerrarse con una animación de salida hacia abajo, como si se guardaran nuevamente fuera de la pantalla. El cierre debe estar disponible mediante todos estos mecanismos:

- Botón `X` visible dentro del diálogo.
- Toque o clic sobre el fondo exterior (`backdrop`).
- Toque o clic sobre la barra horizontal ubicada en el centro del borde superior.
- Tecla Escape o cancelación nativa del diálogo, cuando corresponda.

Para que la animación de cierre pueda completarse antes de desmontar el elemento, mantener el diálogo abierto durante la animación y ejecutar `close()` al finalizarla. La barra superior debe ser un botón accesible, con `aria-label`, `cursor-pointer` y estados `hover` y `active`. Las animaciones pueden implementarse con `@keyframes` en `src/index.css` y aplicarse únicamente al diálogo correspondiente.

Todos los valores en px de esta sección suponen raíz de 16 px.

| Utilidad | Valor | Uso típico |
| --- | --- | --- |
| `gap-1` | 4 px | Título y subtítulo cercanos |
| `gap-2` | 8 px | Ícono y etiqueta |
| `gap-3` | 12 px | Fila, pequeños grupos y contenido de tarjeta |
| `gap-4` | 16 px | Grupos intermedios |
| `gap-5` | 20 px | Interior de tarjetas y grupos de campos |
| `gap-7` | 28 px | Separación base entre bloques de página |
| `gap-8` / `gap-10` | 32 / 40 px | Separaciones grandes localizadas |
| `p-3` / `p-4` / `p-5` / `p-6` / `p-7` | 12 / 16 / 20 / 24 / 28 px | Padding de bloques |
| `h-12` / `h-14` / `h-16` / `h-18` | 48 / 56 / 64 / 72 px | Campos y acciones |
| `size-12` / `size-13` / `size-14` | 48 / 52 / 56 px | Cajas de íconos |
| `min-h-20` / `min-h-30` / `min-h-40` | 80 / 120 / 160 px | Filas y tarjetas amplias |
| `rounded-lg` / `rounded-xl` | 8 / 12 px | Campos, botones y cajas internas |
| `rounded-2xl` | 16 px | Radio principal de tarjetas y acciones |
| `rounded-3xl` | 24 px | Tutoriales y algunas tarjetas destacadas |
| `rounded-full` | Cápsula o círculo | Avatares, estados y navegación |

Los bordes suelen ser de 1 px en gris claro. Las zonas para agregar elementos usan borde discontinuo más fuerte: `border-dashed border-3` en cuidados y `border-4` en personas vinculadas. Las preferencias usan un borde izquierdo azul de 5 px en el área de texto.

No todas las tarjetas tienen sombra. Inicio usa `shadow-md`; las tarjetas de tutorial y la barra inferior usan `shadow-lg`; otros bloques se distinguen por contraste de fondo o borde.

Para reproducir las sombras en Figma, cada fila siguiente contiene **dos efectos Drop Shadow**, con negro al 10%:

| Clase | Efecto 1: X / Y / blur / spread | Efecto 2: X / Y / blur / spread |
| --- | --- | --- |
| `shadow-md` | 0 / 4 / 6 / −1 px | 0 / 2 / 4 / −2 px |
| `shadow-lg` | 0 / 10 / 15 / −3 px | 0 / 4 / 6 / −4 px |

## 9. Componentes que conviene reutilizar

| Componente existente | Anatomía y medidas representativas |
| --- | --- |
| [Header](src/components/Header.tsx) | Fila de ancho completo, marca con ícono a la izquierda y acceso a cuenta a la derecha; texto 24 px, 30 px en `lg` |
| [VueltaAtras](src/components/vueltaAtras.tsx) | Flecha en caja gris de 60 × 60 px, 72 × 72 en `lg`; etiqueta “FICHA DE CONSULTA” y título 24/30 px; gap 12 px |
| [NavBar2](src/components/NavBar2.tsx) | Cápsula flotante, blanco al 65%, blur de fondo, sombra e ícono con etiqueta en cada destino |
| [TarjetaContacto](src/components/TarjetaContacto.tsx) | Tarjeta blanca de 160 px de alto, foto circular, nombre grande y llamada al 90% del ancho |
| [CajaMed](src/components/cajaMedicacion.tsx) | Fila blanca con radio 16 px, padding 20 px, caja de ícono 52 px, nombre, dosis y horario |
| [CajaPreferencias](src/components/CajaPreferencias.tsx) | Tarjeta blanca con borde, título con ícono, área de texto y botón de edición ancho |
| [InputCuidados](src/components/InputCuidados.tsx) | Área gris de alto mínimo 100 px, borde izquierdo azul, lectura o edición |
| [PersonaVinculada](src/components/tarjetaPersonaVinculada.tsx) | Fondo azul muy claro, avatar de inicial de 56 px, nombre, rol y botón “Administrar” |
| [Switch](src/components/switch.tsx) | Pista de 52 × 28 px y círculo de 24 px; azul encendido y gris apagado |
| [AjustesTexto](src/components/AjusteTamanios.tsx) | Tarjeta con ícono “Aa”, tres opciones en grid y selección mediante borde y fondo azul |
| [Desplegable](src/components/menuDesplegable.tsx) | Resumen expandible de invitación, email, roles seleccionables y acción de envío; ancho máximo `max-w-md` |
| [BotonSiguiente](src/components/botonSiguiente.tsx) | Acción azul de 64 px de alto, texto de 18 px, ícono de flecha y radio 16 px |
| [CuadroAsesor](src/components/CuadroContactarAsesor.tsx) | Panel celeste con ícono circular, explicación breve y acción azul de ancho completo |
| [LogInForm](src/components/LogInForm.tsx) y [RegisterForm](src/components/RegisterForm.tsx) | Campos verticales, labels con ícono, ayudas pequeñas, selección de rol y envío negro |
| [PasswordInput](src/components/PasswordInput.tsx) | Campo de 48 px con control de visibilidad a la derecha y tipografía monoespaciada |

Los íconos vienen de `react-icons`, principalmente Material Design (`md`), con otras familias como `fa`, `io`, `lu`, `go` y `hi2`. Para fidelidad, reutilizar el ícono existente en la función equivalente. Un ícono suele tener entre 24 y 48 px, a veces dentro de una caja con padding y fondo suave; el tamaño de la caja y el del dibujo son medidas distintas.

**Preferencia confirmada por la usuaria para nuevos diseños:** revisar la biblioteca instalada `react-icons` y su uso en los componentes del proyecto, y elegir un ícono de suficiente semejanza, en lugar de descargar SVG u otras imágenes para la iconografía. No hace falta reproducir exactamente el dibujo de Figma. Si una implementación usa imágenes como íconos, reemplazarlas por componentes de esta biblioteca. Estilizar directamente el componente con `size-*`, `p-*` cuando corresponda y clases de color `text-*`; agregar `bg-*` y `rounded-*` según los componentes existentes. Usar la escala predeterminada para esas medidas, sin tamaños arbitrarios en píxeles.

```tsx
<MdOutlineMedication className="size-10 rounded-xl bg-[#D4E4F3] p-2.5 text-[#0B5FFF]" />
```

Las fotos de tutorial están en [src/assets](src/assets); las imágenes de perfil están en [public](public). Los tutoriales usan recorte `cover`, posición superior y un panel explicativo superpuesto cerca del borde inferior.

### Navegación vigente

[App.tsx](src/App.tsx) monta `NavBar2`. `NavBar.tsx` es otra variante presente en el repositorio y no es la referencia principal del layout actual.

`NavBar2` usa `fixed bottom-4 left-1/2 -translate-x-1/2`, ancho mínimo del 90% y alto de `9vh`, que pasa a `11vh` en `lg`. A 844 px de alto, `9vh` son unos 76 px. El estado activo usa `#002B2F` al 25% y pasa de proporción cuadrada a `aspect-video`. Para Figma, representarlo como una variante seleccionada más ancha.

## 10. Adaptación a distintos anchos

El proyecto parte de una columna móvil y añade cambios mediante `md:`, `lg:` y algunos `xl:`. No se observó una estrategia desarrollada de modo oscuro.

| Prefijo usado | Punto de corte del tema instalado | Comportamiento observado |
| --- | --- | --- |
| Sin prefijo | Base | Columna, tarjetas de ancho completo |
| `md:` | 48 rem, normalmente 768 px | Inicio puede pasar a filas con wrap y tarjetas al 60%; formularios se estrechan |
| `lg:` | 64 rem, normalmente 1024 px | Filas, contactos al 32%, paneles SOS al 50% y 40%, código al 60% |
| `xl:` | 80 rem, normalmente 1280 px | Ajustes localizados de formulario y estado de emergencia |

No hay una grilla global de 12 columnas ni un ancho máximo compartido para todas las páginas. Predominan porcentajes elegidos por bloque. Grid aparece de forma localizada en las tres opciones de tamaño de texto.

En Figma, crear variantes móvil y escritorio conservando las proporciones de la pantalla que se toma como modelo. Usar Auto Layout con wrap donde el código usa `flex-wrap`. Las sumas de porcentajes más gaps pueden producir saltos de línea: tres tarjetas de 32% y dos gaps de 20 px no caben en todos los contenedores. `lg:w-49/100` con gap también requiere comprobar el espacio disponible.

## 11. Estados e interacción

### Preferencia confirmada para nuevos diseños

Indicación de la usuaria del 26 de octubre de 2026: los botones llevan `cursor-pointer`. En general, el fondo se oscurece ligeramente en `hover` y todavía más en `active`, conservando la misma familia de color. Aplicar este criterio a futuros diseños y mantener un foco visible para la navegación por teclado. Estos estados visuales también corresponden a los botones de maquetas sin funcionalidad.

Por ejemplo, para un botón celeste: `cursor-pointer bg-[#EBF5FF] hover:bg-[#DCEBFA] active:bg-[#CBDEF2]`, junto con sus clases de `focus-visible`.

### Estados observados en el proyecto

- **Hover:** fondos más oscuros en botones azules, grises más marcados en acciones neutras y algunas escalas de 102%.
- **Presionado:** escala de 99% o 97%, o cambio adicional de fondo según el componente.
- **Seleccionado:** borde azul, fondo azul claro y en algunos casos tilde o indicador circular.
- **Focus:** los formularios de autenticación y de invitación usan anillos azules. Otros controles no tienen un estado equivalente definido.
- **Envío:** etiquetas como “Entrando...”, “Guardando...” y botones deshabilitados; ajustes reduce opacidad con `disabled:opacity-50`.
- **Carga y error:** mensajes de texto en el bloque al que corresponden, con rojo para errores. No se observó un sistema de skeletons o toasts compartido.
- **Vacío:** medicación no registrada y dispositivos sin vincular muestran explicación; dispositivos agrega un borde discontinuo.
- **Edición:** la preferencia pasa de `readOnly` a editable y el botón cambia a “Finalizar edición”.
- **Progreso:** tutorial al 25% y 50%; código con contador y barra de tiempo. Diseñar esos estados con valores coherentes.
- **Pantalla completa:** el código ocupa la ventana, pierde el radio y muestra salida; existe fallback con posición fija y `z-index: 1000`.

En [index.css](src/index.css) existe una transición global de `all 0.5s ease`, con excepciones para color, fondo, borde, fill y stroke. Algunos componentes fijan duraciones de 150, 200 o 1000 ms. Para prototipos de Figma, representar la intención de la interacción; no asumir que hay una duración uniforme de todo el sistema.

## 12. Tono del contenido

El tono predominante habla directamente a la persona y usa voseo: “Podés”, “Elegí”, “Presioná”, “Mantené”, “Registrá”. Los títulos suelen comenzar con “Mi”, “Mis” o “Tu”, y las acciones nombran lo que va a ocurrir: “Guardar cambios”, “Llamar a…”, “Editar indicación”, “Generar código nuevo”.

Se explica para qué sirve un bloque antes de pedir una acción. Se repiten acompañamiento, tranquilidad, familia, seguridad y asistencia humana. Las mayúsculas quedan para estados o énfasis como “EMERGENCIA ENVIADA”. Hay frases de usted o tuteo en ingreso y algunas pantallas; para contenido nuevo, el voseo es la referencia más recurrente.

Las fotografías acompañan instrucciones concretas. Las alertas combinan texto e ícono además del color. Los datos variables —nombres, medicamentos, contactos y tiempo restante— deben poder cambiar sin romper la composición.

## 13. Traducción práctica a Figma

Esta tabla es una propuesta para construir frames editables que reflejen el código:

| JSX / Tailwind | Construcción en Figma |
| --- | --- |
| `flex flex-col gap-5 p-5` | Auto Layout vertical, gap 20 px, padding 20 px |
| `flex items-center gap-3` | Auto Layout horizontal, alineación central, gap 12 px |
| `justify-between` | Distribución Space between en el eje principal |
| `w-full` | Fill container cuando el padre lo permita |
| `w-fit` | Hug contents, comprobando el contenido real |
| `w-80/100` | Proporción del 80% respecto al padre; calcular para cada variante si hace falta |
| `max-w-80/100` | Límite de ancho del texto o bloque; no equivale siempre a un ancho fijo del 80% |
| `min-h-20` | Alto mínimo 80 px, con crecimiento por contenido |
| `aspect-square rounded-full` | Caja cuadrada con proporción 1:1 y radio circular |
| `bg-white/65 backdrop-blur-xs` | Fill blanco al 65% y blur de fondo |
| `relative` y un hijo `absolute` | Frame de referencia y elemento con posición absoluta dentro del Auto Layout |
| `fixed` | Elemento fijado respecto al viewport en el prototipo |
| `lg:flex-row` | Variante de escritorio con dirección horizontal |
| `hover:`, `active:` y condiciones JSX | Variantes de componente y estados de prototipo |

### Organización sugerida del archivo

Propuesta de páginas: `Fundamentos`, `Componentes`, `Pantallas móvil` y `Pantallas escritorio`. Crear estilos de texto con los tamaños de la sección 6 y variables con los colores, espacios y radios documentados. Para componentes, usar nombres funcionales como `Navegación/Inferior`, `Tarjeta/Contacto`, `Tarjeta/Medicación` y `Acción/Siguiente`; esos nombres todavía no existen como biblioteca.

Antes de dibujar una pantalla nueva:

1. Elegir la página existente más parecida por función y tratamiento visual.
2. Reutilizar encabezado, vuelta atrás, tarjetas y navegación que correspondan.
3. Armar primero la columna móvil con el padding y la separación base.
4. Usar Auto Layout y alturas adaptables para títulos, explicaciones y listas.
5. Incorporar datos realistas y los estados relevantes de carga, vacío, error y selección.
6. Crear la adaptación de escritorio según los porcentajes y breakpoints de referencia.
7. Revisar que la barra inferior deje visible la última acción y que el texto pueda crecer.

Al implementar un diseño de Figma, reconocer esos bloques y reutilizar sus componentes. Un frame visual no necesita traducirse a un `div` por cada capa: la referencia de este proyecto es agrupar por fila, columna y función.

## 14. Detalles que no conviene convertir en reglas

Estos hallazgos describen el estado del código y ayudan a interpretar el diseño. No se modificaron los archivos de la aplicación como parte de esta guía.

| Hallazgo | Cómo usarlo en trabajos futuros |
| --- | --- |
| `text-md`, `text-1xl`, `bder`, `justiy-start` y `size-` no generan utilidades | Elegir una clase válida según la intención; no agregarlos al sistema de diseño |
| Hay varios `h1` por pantalla, algunos usados como acciones | Conservar el aspecto visual con una jerarquía semántica adecuada y controles `button` o enlaces |
| Hay íconos y `div` clicables, además de controles sin focus visible equivalente | Diseñar y luego implementar acceso por teclado, nombre y foco visibles |
| `NavBar2` enlaza Medicamentos a `/adulto/medicamentos`, mientras las rutas actuales declaran `/adulto/salud` | Verificar el destino antes de reproducir el flujo en un prototipo o código |
| El tutorial propone cuatro pasos, pero solo hay pantallas de los dos primeros y un enlace a `tutorial1.3` | Distinguir el recorrido previsto del recorrido implementado |
| Inicio contiene una lista provisional 0–4; Cuenta usa varios datos de ejemplo; ajustes tiene personas fijas | Usar esos bloques como referencia de composición, sin tratarlos como datos reales ni requisitos definitivos |
| Varias acciones solo tienen apariencia o lógica parcial | Un estado dibujado no demuestra que el guardado, la invitación o la cancelación estén conectados |
| Cuenta usa `self-stretch`, `inline-flex` y `gap-[2.70px]` en un bloque puntual | Es una variante localizada, no una nueva escala de espaciados del proyecto |
| Las fracciones de alto dependen del alto del padre | No traducirlas automáticamente a un alto fijo sin revisar el contenedor |
| El tamaño raíz cambia desde ajustes y el fondo blanco se cambia con un efecto | Considerar el estado global al comparar capturas o medidas |

La tipografía legible y los controles amplios muestran una intención de accesibilidad. Esta revisión del código no certifica contraste, tamaño táctil, navegación por teclado ni comportamiento con zoom.

## 15. Base de JSX para continuar el estilo

Este ejemplo es una **plantilla propuesta para una página nueva dentro de `src/Pages/Adulto`**. Usa componentes y clases existentes; no agrega rutas ni componentes al proyecto por sí mismo. El título de sección usa `h2` para conservar una jerarquía más clara.

```tsx
import Header from "../../components/Header";
import VueltaAtras from "../../components/vueltaAtras";
import { MdOutlineInfo } from "react-icons/md";

export default function NuevaPantalla() {
  return (
    <>
      <main className="mainBody">
        <Header />
        <VueltaAtras titulo="Título de la pantalla" />
        <section className="w-full flex flex-col gap-5">
          <div className="bg-white rounded-2xl w-full p-5 flex items-start gap-3">
            <MdOutlineInfo
              aria-hidden="true"
              className="size-13 bg-gray-200 rounded-xl p-3 text-gray-600 shrink-0"
            />
            <div className="flex flex-col items-start gap-1">
              <h2 className="font-semibold text-xl">Título del bloque</h2>
              <p className="text-gray-600 text-lg">
                Explicación breve que acompaña a la persona.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
```

Si la pantalla pertenece a ayuda, tutoriales o cuidados, resolver su apariencia en elementos internos sin agregar `bg-white` ni otras clases a `<main>`. Si forma parte de `LayoutConFooter`, la navegación ya la aporta el layout.

## 16. Brief reutilizable para una próxima tarea

> Usá `GUIA_ESTILO_NONOS.md` como referencia y contrastala con los archivos actuales antes de trabajar. Creá la pantalla solicitada conservando el estilo de NONOS: Atkinson Hyperlegible Next, composición vertical móvil, padding base de 20 px, gap de página de 28 px, tarjetas blancas con radio de 16 px, títulos semibold de 20–24 px, explicaciones grises e íconos claros. En `<main>` usá siempre `mainBody` y, si hace falta, únicamente una clase `gap-*`; aplicá los demás estilos a elementos internos. Reutilizá encabezado, vuelta atrás, tarjetas y navegación existentes. Usá Auto Layout en Figma y Flexbox con utilidades Tailwind al implementar. Conservá los anchos porcentuales y las adaptaciones md/lg/xl que correspondan, agregá los estados necesarios y escribí acciones explícitas con voseo. Verificá el crecimiento del texto y el espacio de la navegación inferior. Tomá como referencia los patrones repetidos y corregí de forma consciente las clases inválidas, los datos provisionales y los problemas semánticos identificados.

### Lista de revisión

- [ ] La pantalla se parece a una referencia concreta del proyecto y usa el tratamiento de fondo adecuado.
- [ ] Las agrupaciones principales se pueden expresar con filas y columnas claras.
- [ ] Espaciados, radios, tipografía, íconos y colores corresponden a los documentados.
- [ ] El contenido real puede ocupar más de una línea y las listas pueden crecer.
- [ ] Se contemplan móvil, escritorio y los estados que necesita la función.
- [ ] La navegación lleva a destinos existentes y deja visible el final del contenido.
- [ ] Los controles tienen acciones claras y estados de selección y foco distinguibles.
- [ ] Las propuestas nuevas se distinguen de lo que ya existe en el proyecto.

## 17. Referencia práctica de Tailwind CSS

**Lectura:** 26 de octubre de 2026. **Fuente principal:** [documentación oficial](https://tailwindcss.com/docs). La web consultada corresponde a Tailwind 4.3; el paquete instalado es **4.3.3**, comprobado en `node_modules/tailwindcss/package.json`. Estas notas sintetizan los conceptos base y las referencias de utilidades consultadas, con ejemplos propios para NONOS; no son una copia completa del sitio. Volver a consultar la fuente y la versión local cuando cambien dependencias o se necesite una utilidad nueva.

### 17.1. Convenciones de NONOS que se aplican al usar la documentación

Estas son instrucciones de la usuaria, distintas de las posibilidades generales de Tailwind:

- La etiqueta principal de cada pantalla usa `mainBody`. Su `className` solo puede contener `mainBody` y, opcionalmente, una clase `gap-*`; cualquier otra clase corresponde a un elemento interno.
- Usar la escala de Tailwind para medidas, tipografía y sombras. Preferir `p-5`, `gap-3`, `size-10`, `text-lg`, `leading-7`, `tracking-tight`, `rounded-2xl` y `shadow-xs` a valores de medida entre corchetes, CSS en línea o equivalentes rígidos inventados.
- Usar porcentajes mediante utilidades admitidas cuando convenga. Una fracción válida para ancho no demuestra que también funcione para padding.
- Revisar `react-icons` y los usos existentes; elegir un ícono parecido al diseño. Aplicarle directamente `size-*`, padding opcional y `text-*`, además de fondo y radio si corresponde. Reemplazar imágenes usadas como iconos; no descargar SVG para esa función.
- Los botones llevan `cursor-pointer`, fondo algo más oscuro en `hover`, todavía más oscuro en `active` y foco visible. Las maquetas pueden tener estos estados visuales sin acciones.

### 17.2. Integración y forma de escribir estilos

La integración documentada para Vite usa `@tailwindcss/vite` y `@import "tailwindcss"`; ambas ya están presentes en NONOS. No hace falta instalar otra integración para una pantalla. [Instalación con Vite](https://tailwindcss.com/docs/installation/using-vite).

Combinar utilidades en `className` y reutilizar componentes React cuando se repitan estructura y estilos. Si dos clases asignan valores incompatibles a la misma propiedad bajo la misma condición, resolver la condición en React: el orden de los nombres dentro de `className` no decide cuál gana; interviene el orden del CSS generado. Evitar acumular clases contradictorias. [Utilidades y conflictos de estilos](https://tailwindcss.com/docs/styling-with-utility-classes).

### 17.3. Medidas y proporciones

La escala instalada usa `--spacing: 0.25rem`: el número multiplica esa unidad. `p-5` equivale a `1.25rem` y `p-12` a `3rem`; cambian junto con el tamaño raíz. `px-*` actúa sobre el eje inline, `py-*` sobre el eje block, y `ps-*`/`pe-*` sobre inicio/final inline. [Padding](https://tailwindcss.com/docs/padding).

| Necesidad | Clases para consultar y usar |
| --- | --- |
| Separar hijos de Flexbox o Grid | `gap-3`, `gap-x-4`, `gap-y-2` |
| Ancho disponible o proporcional | `w-full`, `w-1/2`, `w-95/100` |
| Limitar un contenido que puede encogerse | `w-full max-w-lg` |
| Mismo ancho y alto | `size-10` |
| Radio y sombra de tarjeta | `rounded-2xl shadow-xs` |

`gap-*` separa elementos del layout, sin necesitar márgenes individuales. [Gap](https://tailwindcss.com/docs/gap). `w-95/100` expresa el 95% del contenedor; `w-full` y `w-screen` se refieren a cosas diferentes: contenedor y viewport. [Anchos](https://tailwindcss.com/docs/width). `max-w-lg` establece un límite de `32rem`, no un ancho obligatorio. [Ancho máximo](https://tailwindcss.com/docs/max-width). Elegir sombras del tema, sin reconstruirlas con números fijos. [Sombras](https://tailwindcss.com/docs/box-shadow).

### 17.4. Responsive: empezar por mobile

Las clases sin prefijo se aplican desde el tamaño más pequeño. `sm:` no significa «solo celular»: empieza en su umbral y continúa hacia arriba. Las variantes `max-*` permiten limitar un rango, por ejemplo `md:max-lg:`. [Responsive y consultas de contenedor](https://tailwindcss.com/docs/responsive-design).

| Variante de viewport | Umbral predeterminado |
| --- | --- |
| `sm:` | `40rem` |
| `md:` | `48rem` |
| `lg:` | `64rem` |
| `xl:` | `80rem` |
| `2xl:` | `96rem` |

Para adaptar un componente al espacio que recibe, marcar un padre con `@container` y usar variantes como `@md:` en sus hijos. Estas variantes miden el contenedor, no el viewport, y tienen una escala diferente; no intercambiar `md:` y `@md:` por el nombre.

La escala en `rem` acompaña el tamaño raíz, pero no garantiza por sí sola una composición adaptable. Aplicación en NONOS: combinar límites de ancho, texto que pueda crecer y distribución que admita saltos, y verificar celular y escritorio.

### 17.5. Flexbox, Grid y tipografía

Usar `flex-wrap` cuando una fila pueda necesitar otra línea. Forzar `flex-nowrap` puede producir desbordes con hijos que no se encogen. [Flex wrap](https://tailwindcss.com/docs/flex-wrap). Para columnas iguales, `grid-cols-2` distribuye el espacio en dos pistas; una grilla como `grid grid-cols-1 gap-4 md:grid-cols-2` evita calcular porcentajes que, sumados al gap, excedan el ancho. [Columnas de Grid](https://tailwindcss.com/docs/grid-template-columns).

La escala tipográfica incluye `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl` y `text-2xl`, con interlineados predeterminados. Se pueden ajustar con `leading-*` o con una combinación como `text-sm/6`. En NONOS, conservar Atkinson Hyperlegible Next y permitir el crecimiento del texto. [Tamaño de fuente](https://tailwindcss.com/docs/font-size).

### 17.6. Estados, foco y movimiento

Las variantes se agregan a la utilidad: `hover:`, `active:`, `focus-visible:`, `disabled:`. `group-*` permite responder al estado de un padre y `peer-*` al de un hermano anterior cuando el diseño lo requiera. `motion-reduce:` permite adaptar la presentación a la preferencia de movimiento reducido. [Estados y variantes](https://tailwindcss.com/docs/hover-focus-and-other-states).

Ejemplo propio para un botón visual de NONOS:

```tsx
<button
  type="button"
  className="cursor-pointer rounded-xl bg-blue-100 px-5 py-3 font-semibold text-blue-800 transition-colors duration-150 hover:bg-blue-200 active:bg-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 motion-reduce:transition-none"
>
  Consultar información
</button>
```

Elegir la transición según la propiedad: `transition-colors`, `transition-opacity` o `transition-transform`. Considerar también el CSS global existente, que puede afectar el resultado. [Propiedades de transición](https://tailwindcss.com/docs/transition-property).

### 17.7. Detección de clases en React

Tailwind detecta texto, no evalúa las expresiones de JavaScript. Escribir clases completas en constantes, mapas o ramas; no construirlas por fragmentos como `bg-${color}-600`. Usar, por ejemplo, `activo ? "bg-blue-700" : "bg-blue-100"`. Los archivos ignorados por Git y `node_modules` no se escanean automáticamente; `@source` sirve para declarar fuentes adicionales cuando realmente se necesitan. [Detección de clases](https://tailwindcss.com/docs/detecting-classes-in-source-files).

### 17.8. Tema, colores y utilidades propias

`@theme` registra tokens que generan utilidades. Los namespaces distinguen su función: `--color-*` para colores, `--font-*` para familias tipográficas, `--text-*` para tamaños, `--breakpoint-*` para variantes responsive y `--container-*` para límites/consultas de contenedor. Las variables ordinarias de `:root` no cumplen ese mismo papel. Revisar primero los tokens existentes de NONOS. [Variables del tema](https://tailwindcss.com/docs/theme).

Los colores se usan con `bg-*`, `text-*`, `border-*`, entre otras utilidades; la paleta ofrece tonos claros y oscuros. Conservar los colores del proyecto al seleccionar estados. [Colores](https://tailwindcss.com/docs/colors).

`@utility` registra una utilidad propia compatible con variantes: es el mecanismo usado por `mainBody`. `@apply` incorpora utilidades existentes en CSS; `@reference` da acceso al tema/utilidades desde CSS aislado sin duplicar el CSS importado. Conservar el layout en JSX y reservar estas herramientas para necesidades concretas. [Funciones y directivas](https://tailwindcss.com/docs/functions-and-directives).

### 17.9. Estilos base y compatibilidad

Preflight se incluye al importar Tailwind. Elimina márgenes predeterminados y neutraliza el tamaño/peso de encabezados y los marcadores de listas; por eso la semántica de `h1`/`h2` no reemplaza sus clases visuales. Los bordes también parten de una base normalizada. [Preflight](https://tailwindcss.com/docs/preflight).

La documentación de v4 indica como base Chrome 111, Safari 16.4 y Firefox 128. Algunas utilidades exponen funciones CSS más recientes con requisitos adicionales: consultar su compatibilidad al usarlas. [Compatibilidad](https://tailwindcss.com/docs/compatibility). Si una futura tarea incluye modo oscuro, consultar la variante `dark:` y su configuración. [Modo oscuro](https://tailwindcss.com/docs/dark-mode).

### 17.10. Verificación local de clases y aplicación futura

Se comprobó la generación con `compile` de `@tailwindcss/node` 4.3.3 y `@import "tailwindcss"`, el 26 de octubre de 2026:

| Resultado | Ejemplos comprobados |
| --- | --- |
| Generan CSS | `p-5`, `p-12`, `gap-3`, `size-10`, `max-w-lg`, `leading-7`, `tracking-tight`, `shadow-xs` |
| Generan porcentajes | `w-95/100`, `max-w-75/100`, `h-85/100` |
| Generan variantes | `md:grid-cols-2`, `@container`, `@md:flex-row`, `hover:bg-blue-700`, `active:bg-blue-800`, `focus-visible:outline-2`, `motion-reduce:transition-none` |
| No generan CSS en el tema predeterminado instalado | `p-5/100`, `px-5/100`, `text-md`, `text-1xl` |

Esta comprobación verifica existencia, no la apariencia en pantalla. Para futuras implementaciones: leer la guía y el código actual, elegir utilidades válidas, comprobar el layout y el crecimiento de texto en navegador y ejecutar los checks pertinentes (`npm run build` y `npm run lint` cuando se modifique código). Las anotaciones de esta lectura no modifican la configuración ni las pantallas.
