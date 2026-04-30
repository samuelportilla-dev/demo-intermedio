# 🇮🇹 Manual Técnico: La Nonna Rústica (Sistema Ultra Premium)

> [!IMPORTANT]
> **GUÍA COMPLEMENTARIA AL PROTOCOLO DE REBRANDING:** Este repositorio utiliza una arquitectura avanzada basada en el `SKILL_REBRANDING_PROTOCOL.md`. Este README sirve como el "Manual de Implementación Específico" para los componentes **Ultra Premium** que no están en la plantilla estándar.

---

## 🛠️ Implementación del Protocolo en este Repo

Al ejecutar el `SKILL_REBRANDING_PROTOCOL.md` en este repositorio, el agente debe prestar especial atención a los siguientes componentes extendidos:

### 1. El Motor de Urgencia (Urgency Engine)
En este sistema, las promociones son **dinámicas**. 
- **Directiva:** Al actualizar `RESTAURANT_CONFIG.promociones` en `data/menu.js`, si el título incluye la palabra **"Hoy"**, el script `menu-ultra.js` inyectará automáticamente el día de la semana actual (ej: "¡Especial de Viernes!"). 
- **Beneficio:** Esto genera urgencia psicológica sin intervención manual. **NO BORRAR** la palabra "Hoy" si se desea mantener este efecto.

### 2. Lógica 2x1 Automatizada
A diferencia de otros repos, aquí el descuento **SÍ es funcional** en el carrito.
- **Ubicación:** La lógica reside en `actualizarUiCarrito` dentro de `js/app.js`.
- **Cómo Rebrandear:** Si el nuevo restaurante no tiene una categoría llamada "Pizzas Clásicas", debes actualizar el filtro `.includes("Pizzas Clásicas")` en `app.js` para que coincida con la nueva categoría que tendrá la promoción 2x1.

### 3. Presentación "Cinema Slider"
Las promociones se renderizan mediante `renderPromoSlider()` en `menu-ultra.js`.
- **Ajuste Visual:** Las imágenes de las promociones en `menu.js` deben ser de alta resolución (preferiblemente 1200px+ con Unsplash) ya que ocupan el ancho total del "Hero" en el menú.

### 4. Sistema de Modales (Bottom Sheet)
Este repo NO utiliza el modal de producto estándar de la plantilla.
- **Diferencia:** Utiliza un sistema de "Bottom Sheet" inyectado dinámicamente llamado `openProductSheet`.
- **Integración:** El botón de la "Recomendación del Chef" (en `app.js`) está conectado a este modal mediante `window.openProductSheet`. **NO intentar** reconectarlo al modal viejo.

---

## 📂 Mapeo de Archivos Específicos (Ultra)

| Archivo | Función en el Rebranding |
| :--- | :--- |
| `data/menu.js` | **Único Punto de Verdad.** Controla textos, precios, fotos y banners. |
| `js/app.js` | Controla la lógica del carrito 2x1 y el banner de ahorro (`#drawer-savings-badge`). |
| `pages/menu/menu-ultra.js` | Controla el renderizado de los días dinámicos y el slider cinemático. |
| `pages/menu/index.html` | Contiene estilos `<style>` inyectados con `!important` para el modal de orden. |

---

## ⚠️ Advertencias para Agentes (Directiva Antigravity)

1.  **Caché de Estilos**: Hay CSS crítico inyectado en el `<style>` del `index.html` (dentro de `pages/menu/`). Si cambias los colores en los archivos `.css` y no se ven reflejados en el modal de finalizar pedido, **DEBES** actualizar esos estilos inyectados manualmente.
2.  **Etiquetas 2x1**: Las etiquetas de los productos también son dinámicas. Si un producto tiene una etiqueta que diga "2x1 [Día]", el sistema la actualizará automáticamente al día de hoy.
3.  **Visual Feedback**: Siempre verifica que el banner de ahorro (`#drawer-savings-badge`) se muestre correctamente en el carrito al añadir dos ítems de la categoría en promoción.

---
*Este sistema ha sido optimizado por Antigravity AI para ofrecer una experiencia de hospitalidad de nivel editorial.*
