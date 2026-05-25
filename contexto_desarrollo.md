# Documentación del Proyecto: "Nadie Vio Nada"

**Descripción del Proyecto:** 
Un juego de tablero web interactivo diseñado para visibilizar, concientizar y reflexionar sobre las dinámicas del bullying escolar (acoso). Los jugadores pueden asumir el rol de **Víctima** o **Agresor** y navegan por un tablero de 20 casillas tomando decisiones que afectan su desarrollo emocional y moral.

---

## 🛠 Arquitectura y Tecnologías
- **Framework:** React + Vite
- **Estilos:** CSS Vanilla (App.css, Board3D.css) + Iconos de Lucide React
- **Estado:** React Hooks (`useState`, `useEffect`) y persistencia con `sessionStorage`.
- **Estructura de Datos:** Centralizada en `data.js` (Cartas, Casillas, Personajes, Fases).

---

## 🧩 Mecánicas Principales Definidas

### 1. Roles y Estadísticas
- **Víctima:** 
  - **Stats:** Valentía (⭐) y Aliados (🤝).
  - **Objetivo de Victoria:** Llegar a la casilla 20 con al menos **5 de Valentía**.
- **Agresor:** 
  - **Stats:** Empatía (❤️), Poder (⚡) y Consecuencias (⚠️).
  - **Objetivo de Victoria:** Llegar a la casilla 20 con al menos **5 de Empatía**.
- **Modo Reflexión:** Si se juega en solitario (1 solo jugador, Víctima), se desactiva la mecánica de agresión y el juego se centra puramente en la narrativa de superación.

### 2. El Tablero y Movimiento
- **Casillas:** 20 casillas con un diseño en formato "serpiente" o S-curve isométrica 3D.
- **Tipos de Casillas:**
  - `inicio` / `final`: Casillas narrativas de entrada y salida.
  - `avance`: Casillas de transición con narrativas pasivas.
  - `interaccion`: Casillas de evento azaroso (roban cartas de evento del array `EVENT_CARDS`).
  - `decision`: **Paradas obligatorias**. Momentos narrativos críticos donde los jugadores deben tomar una postura (Opciones A, B, C).
- **Movimiento:** El dado es de 1 a 3 casillas. Cuenta con **"Paradas Obligatorias"** matemáticas: si la tirada del dado sobrepasa una casilla de decisión, la ficha se detiene forzosamente en dicha casilla para evitar que los jugadores se salten la narrativa principal.

### 3. Psicología de las Decisiones (Diseño de UX/Narrativo)
En las casillas de decisión, el orden de las opciones está manipulado psicológicamente:
- **Opción A (La ruta fácil/negativa):** Es la primera que lee el jugador. Representa la inacción en la víctima (quedarse callado) o el impulso agresivo en el bully (burlarse). Resta Valentía o suma Poder.
- **Opción B (La ruta difícil/correcta):** Requiere un esfuerzo consciente por parte del jugador para seleccionarla en lugar de la primera opción. Suma Valentía o suma Empatía.

### 4. Sistema de Poderes del Agresor (Karma Oculto)
El Agresor puede usar sus puntos de Poder (⚡) para perjudicar a la Víctima a voluntad durante el juego (siempre que no esté en Modal).
- **Poderes disponibles:**
  - `Costo 1`: Retroceder a la víctima 1 casilla.
  - `Costo 2`: Bloquear el próximo evento azaroso de la víctima.
  - `Costo 3`: Restar 1 de Valentía a la víctima.
- **Consecuencias Acumulativas (El Castigo Silencioso):** 
  - La interfaz **no** le advierte al agresor que usar poderes tiene consecuencias (el texto solo dice "Usar Poder").
  - Internamente, se lleva un registro de `poderGastado`. Por cada **3 puntos de poder gastados en total** (ya sea usando 3 veces el poder de costo 1, o 1 vez el de costo 3), el sistema detiene el juego y le aplica de sorpresa una **Carta de Consecuencia** al agresor.
  - Además, si el agresor acumula pasivamente **5 puntos de Poder en su inventario**, recibe automáticamente una penalización de 1 Consecuencia.

### 5. Finales y Segundas Oportunidades
- Si un jugador llega a la casilla 20 sin los stats necesarios (5 Valentía / 5 Empatía), es devuelto a la **Casilla 11** para una "Segunda Oportunidad" (`secondChanceUsed`).
- Si vuelve a llegar a la 20 sin los stats, recibe un **Desenlace Neutro**, donde se cierra su arco narrativo con un mensaje de reflexión crudo y su ficha queda deshabilitada (`finished`).

---

## 📅 Bitácora de Sesiones y Cambios

### Sesión: Mayo 24, 2026 - Pulido de Mecánicas, Castigos y UX
**Desarrollo y Correcciones:**
1. **Paradas Obligatorias:** Se reescribió la lógica de `movePlayer` para truncar el movimiento de la ficha si existe una casilla de tipo `decision` en el trayecto.
2. **Consecuencias Acumulativas:** Se introdujo la variable invisible `poderGastado` en el estado inicial de los agresores. Se ajustó la función `executeBullyPower` para evaluar el módulo 3 del poder gastado y disparar las consecuencias aleatorias en base a ello.
3. **Sorpresa al Agresor:** Se eliminó la advertencia de "roba consecuencia" del HUD para generar un efecto psicológico de "falsa seguridad" en el agresor.
4. **Claridad de Interfaz (Botones):** Se reemplazaron los textos confusos de los poderes del agresor por descripciones directas ("Retroceder 1", "Bloquear Evento", "Restar 1 Valentía") y se implementó `flexWrap` para evitar roturas de UI.
5. **Reemplazo de Emojis por Assets:** Se creó el helper `renderTextWithIcons` para escanear todos los textos de efectos (Opciones de decisión, Eventos y Consecuencias) y renderizar dinámicamente las imágenes `.png` (`/Valentía.png`, `/Poder.png`, etc.) reemplazando los emojis del SO para mantener el estilo gráfico corporativo del juego.
6. **Inversión Psicológica (A/B):** Se modificó la matriz de opciones en `data.js` para que la Opción A siempre sea la vía "negativa" y la Opción B la "positiva".
7. **Restauración de Efectos Aleatorios:** Se devolvió el efecto de "Roba 1 Consecuencia" a ciertas cartas de evento (Azar) para el agresor, dándole importancia al factor suerte y al karma.

### Sesiones Previas (Resumen)
- **Implementación del Board 3D:** Creación del componente SVG de curvas isométricas que calcula matemáticamente la trayectoria de las fichas en el espacio basado en coordenadas X/Y.
- **Animaciones y Tiempos:** Ajuste del pacing del juego (pausa tras lanzar dado, delay por salto de casilla, pausa antes de abrir modal) acorde a la filosofía de "Todo debe tener un tiempo de espera prudente".
- **Resolución de Bugs Modales:** Se arregló el renderizado en bucle y estados fantasmas limpiando la sesión y reestructurando la función `handleReturnToHome`.
- **Endgame Screen:** Se ajustó la ventana final eliminando barras de scroll no deseadas e incorporando una tabla de posiciones gráfica basada en el orden de llegada de los jugadores.

---

*Esta documentación deberá utilizarse como contexto base para futuras iteraciones, correcciones o adiciones de contenido al proyecto.*

### Sesión: Mayo 25, 2026 - Audio Global, Responsive Design y GitHub Pages
**Desarrollo y Correcciones:**
1. **Audio Global:** Se centralizó el manejo del audio en `audioSynth.js`, permitiendo silenciar tanto efectos especiales (dado, movimiento) como el sonido ambiental (estática/viento) mediante un único estado global persistente.
2. **Botón Flotante (MuteButton):** Se extrajo el control de volumen del `Navbar` para colocarlo como un botón flotante circular e independiente en la esquina inferior derecha, garantizando visibilidad en todo momento (Inicio, Selección, Juego).
3. **Optimización de Despliegue (Vite + GitHub Pages):** Se configuró `base: './'` en Vite y se creó un utilitario `asset()` (`utils.js`) para resolver de manera dinámica todas las rutas absolutas (`/imagen.png`) evitando errores de 404 Not Found en el despliegue a subrutas de GitHub Pages.
4. **Diseño Responsivo (Móvil y Tablets):** Se reestructuró CSS en todos los componentes (`App.css`, `Navbar.css`, `LandingScreen.css`, `CharacterSelectionScreen.css`).
   - El tablero principal pasó de un layout horizontal (`row`) a uno vertical (`column`).
   - El Tablero 3D ocupa la parte superior en móviles, mientras que el HUD de estadísticas y el dado se reubicaron en una barra inferior deslizable horizontalmente (`overflow-x: auto`).
   - El menú de navegación ocultó sus textos dejando solo iconos, y los personajes se apilan en 1 sola columna para facilitar la lectura y selección táctil.
   - Ajuste de modales de historia al 95% del viewport para lectura óptima en celulares.
5. **Ajuste Visual Menor:** Se actualizó el archivo `index.html` para utilizar el logo del juego (`logo.png`) como Favicon de la pestaña del navegador, reemplazando el genérico de Vite.
