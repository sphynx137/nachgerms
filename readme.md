# NachGerms — UI Panel

> Extensión de navegador para personalizar la interfaz de [Germs.io](https://germs.io/).  
> Cambia colores de bordes, textos y fondo con un solo clic. **Compatible con Germsfox.**

![Version](https://img.shields.io/badge/version-2.0.9-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-brightgreen)
![Germs.io](https://img.shields.io/badge/Germs.io-compatible-cyan)
![Germsfox](https://img.shields.io/badge/Germsfox-compatible-purple)

---

## Características

- **Color UI personalizable** — cambia el color de todos los bordes, inputs, botones y textos de la interfaz en tiempo real.
- **Fondo personalizable** — establece el color de fondo de paneles, menús y tarjetas.
- **Cell background** — elige entre Default, Transparent, White o Black para el fondo de tu celda.
- **XP bar mejorada** — el label de EXP se mueve fuera de la barra para mejor legibilidad.
- **Etiqueta de versión** — muestra "Nch☆" junto al tag de Germsfox en el juego.
- Todos los ajustes se guardan automáticamente y persisten entre sesiones.

## Instalación

### Chromium / Chrome / Edge / Brave

1. Descarga o clona este repositorio:
   ```
   git clone https://github.com/sphynx137/nachgerms.git
   ```
   O descarga el `.zip` desde el botón verde **<> Code** y extráelo.

2. Abre `chrome://extensions` en tu navegador.
3. Activa el **Modo de desarrollador** (esquina superior derecha).
4. Haz clic en **Cargar descomprimida** y selecciona la carpeta del repositorio.

### Firefox

1. Descarga o clona el repositorio.
2. Abre `about:debugging` en Firefox.
3. Haz clic en **Este Firefox**.
4. Haz clic en **Cargar complemento temporal…** y selecciona el archivo `manifest.json`.

> **Nota:** Para Firefox la instalación temporal se borra al cerrar el navegador.

## Uso

Una vez instalada, entra a [germs.io](https://germs.io/) y haz clic en el ícono de la extensión en la barra del navegador para abrir el panel:

| Control | Función |
|---|---|
| **UI / Bordes** | Color principal de bordes, inputs y texto |
| **Fondo** | Color de fondo de todos los paneles |
| **Cell background** | Fondo visible detrás de tu celda |
| **Restaurar** | Vuelve a los valores por defecto |

También puedes cambiar el **Cell BG directamente en el juego** — busca el pequeño botón cuadrado en la esquina inferior izquierda de tu celda.

## Estructura del proyecto

```
nachgerms-uipanel/
├── manifest.json          # Configuración de la extensión (MV3)
├── readme.md
├── .gitignore
├── images/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── src/
    ├── storage.js         # Capa de abstracción de chrome.storage.local
    ├── dom.js             # Helpers DOM: XP bar, version tag, cell bg selector
    ├── content.js         # Script principal inyectado en germs.io
    ├── background.js      # Service worker (MV3)
    ├── popup.html         # Interfaz del popup de la extensión
    └── popup.js           # Lógica del popup
```

## Compatibilidad

| Software | Estado |
|---|---|
| Germsfox | ✅ Compatible — no pisará sus colores |
| Chrome 88+ | ✅ |
| Edge 88+ | ✅ |
| Firefox 58+ | ✅ |
| Brave | ✅ |

## Desarrollo local

Después de editar cualquier archivo:
1. Ve a `chrome://extensions`.
2. Haz clic en el ícono de recarga (↺) de la extensión.
3. Recarga la pestaña de Germs.io.

No se necesita ningún build step — el código se carga directamente.

## Créditos

Hecho por **Nach** para la comunidad de [Germs.io](https://germs.io/).

---

<sub>Este proyecto no está afiliado con Germs.io ni con los desarrolladores de Germsfox.</sub>
