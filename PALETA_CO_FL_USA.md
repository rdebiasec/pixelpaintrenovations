# Documento de color - uso comercial (Colombia y Florida, USA)

## 1) Proposito
Este documento resume la paleta de colores extraida tecnicamente de `www.dbx-solutions.com` para uso interno de diseno, branding, piezas digitales e impresas.

Incluye:
- Codigos HEX
- Equivalentes RGB
- CMYK aproximado para impresion
- Reglas de uso recomendadas para Colombia y Florida (USA)

> Nota: este documento es tecnico. No reemplaza asesoria legal de propiedad intelectual o marca.

---

## 2) Paleta principal (brand-ready)

### Core
| Rol | HEX | RGB | CMYK aprox |
|---|---|---|---|
| Fondo principal | `#05060A` | `rgb(5, 6, 10)` | `50, 40, 0, 96` |
| Superficie / card | `#171B27` | `rgb(23, 27, 39)` | `41, 31, 0, 85` |
| Acento principal (teal) | `#4FD1C5` | `rgb(79, 209, 197)` | `62, 0, 6, 18` |
| Texto principal claro | `#EEF1FF` | `rgb(238, 241, 255)` | `7, 5, 0, 0` |
| Texto secundario (gris claro) | `#E9EDEF` | `rgb(233, 237, 239)` | `3, 1, 0, 6` |
| Acento secundario (naranja) | `#D66A2A` | `rgb(214, 106, 42)` | `0, 50, 80, 16` |
| Naranja profundo | `#2A1200` | `rgb(42, 18, 0)` | `0, 57, 100, 84` |

### Support neutrals
| Uso | HEX |
|---|---|
| Negro puro | `#000000` |
| Blanco puro | `#FFFFFF` |
| Gris medio 1 | `#5C636A` |
| Gris medio 2 | `#8E9399` |
| Gris medio 3 | `#AEBAC1` |

### Estados visuales de apoyo
| Estado | HEX |
|---|---|
| Warning / amarillo | `#FFC857` |
| Error / rojo | `#E5484D` |
| Error alterno | `#F04438` |
| Verde de apoyo (no principal) | `#00A884` |

---

## 3) Colores con transparencia (UI overlays)

Estos valores se usan para lineas, paneles y sombras:

| Token recomendado | Valor |
|---|---|
| Linea suave | `rgba(255,255,255,0.10)` |
| Panel suave | `rgba(255,255,255,0.045)` |
| Panel fuerte | `rgba(255,255,255,0.075)` |
| Teal soft | `rgba(79,209,197,0.15)` |
| Sombra principal | `rgba(0,0,0,0.32)` |

---

## 4) Reglas de uso (Colombia y Florida, USA)

## 4.1 Digital (web, redes, ads)
- Usar contraste minimo WCAG AA:
  - Texto normal: ratio >= `4.5:1`
  - Texto grande: ratio >= `3:1`
- Priorizar combinaciones:
  - Fondo oscuro `#05060A` + texto `#EEF1FF`
  - Acento CTA `#4FD1C5` con texto oscuro cuando aplique
- Limitar acentos simultaneos a 2 por vista para evitar ruido visual.

## 4.2 Impresion (material comercial)
- Trabajar en CMYK con pruebas fisicas (proof) antes de tirajes grandes.
- Convertir desde los HEX de este documento y ajustar segun imprenta local.
- Mantener versiones:
  - Colombia: formato final en `A4` y `Carta` segun proveedor.
  - USA/Florida: formato final en `US Letter` y `Tabloid` segun proveedor.

## 4.3 Branding y consistencia regional
- Mantener los mismos codigos maestros en ambos mercados (CO + FL) para coherencia de marca.
- Permitir ajustes minimos de salida solo por condiciones de impresion o pantalla.
- Guardar una libreria unica de estilos para:
  - Web
  - Presentaciones
  - Piezas impresas
  - Redes sociales

---

## 5) CSS listo para usar

```css
:root {
  --brand-bg: #05060A;
  --brand-surface: #171B27;
  --brand-accent: #4FD1C5;
  --brand-text: #EEF1FF;
  --brand-muted: #E9EDEF;
  --brand-orange: #D66A2A;
  --brand-orange-deep: #2A1200;

  --line-soft: rgba(255,255,255,0.10);
  --panel-soft: rgba(255,255,255,0.045);
  --panel-strong: rgba(255,255,255,0.075);
  --accent-soft: rgba(79,209,197,0.15);
  --shadow-soft: rgba(0,0,0,0.32);
}
```

---

## 6) Checklist rapido antes de publicar
- [ ] Verificar contraste de textos y botones.
- [ ] Verificar color en mobile y desktop.
- [ ] Verificar consistencia entre web, social y print.
- [ ] Si hay impresion: hacer prueba de color (proof).
- [ ] Revision legal de uso de identidad visual si se usa como referencia competitiva.

