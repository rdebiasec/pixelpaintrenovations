# DBX - Logo + Paleta de color (Colombia y USA/Florida)

Este archivo usa la paleta extraida tecnicamente y presenta un lockup visual tipo logo para uso interno, mockups, y guias de implementacion.

> Nota: no se detecto un archivo de logo publico descargable en el frontend; por eso se incluye un lockup vectorial editable (texto + color) para referencia visual.

---

## 1) Logo referencial (editable)

```svg
<svg width="980" height="220" viewBox="0 0 980 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="980" height="220" fill="#05060A"/>
  <rect x="28" y="28" width="924" height="164" rx="20" fill="#171B27" stroke="rgba(255,255,255,0.10)"/>

  <!-- Mark -->
  <rect x="70" y="58" width="92" height="92" rx="18" fill="#4FD1C5"/>
  <text x="116" y="118" text-anchor="middle" font-size="44" font-weight="800" font-family="Montserrat, Arial, sans-serif" fill="#05060A">D</text>

  <!-- Wordmark -->
  <text x="190" y="108" font-size="64" font-weight="800" font-family="Montserrat, Arial, sans-serif" fill="#EEF1FF">DBX</text>
  <text x="380" y="108" font-size="64" font-weight="400" font-family="Montserrat, Arial, sans-serif" fill="#E9EDEF">Solutions</text>

  <!-- Accent line -->
  <rect x="190" y="126" width="520" height="6" rx="3" fill="#4FD1C5"/>
  <rect x="718" y="126" width="64" height="6" rx="3" fill="#D66A2A"/>
</svg>
```

---

## 2) Paleta principal (oficial de trabajo)

| Rol | HEX | RGB | CMYK aprox |
|---|---|---|---|
| Fondo principal | `#05060A` | `rgb(5,6,10)` | `50,40,0,96` |
| Card/superficie | `#171B27` | `rgb(23,27,39)` | `41,31,0,85` |
| Acento principal | `#4FD1C5` | `rgb(79,209,197)` | `62,0,6,18` |
| Texto claro | `#EEF1FF` | `rgb(238,241,255)` | `7,5,0,0` |
| Texto secundario | `#E9EDEF` | `rgb(233,237,239)` | `3,1,0,6` |
| Acento secundario | `#D66A2A` | `rgb(214,106,42)` | `0,50,80,16` |
| Naranja oscuro | `#2A1200` | `rgb(42,18,0)` | `0,57,100,84` |

---

## 3) Vista rapida de colores

<div style="display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:12px;">
  <div style="background:#05060A;color:#EEF1FF;padding:12px;border-radius:10px;">#05060A</div>
  <div style="background:#171B27;color:#EEF1FF;padding:12px;border-radius:10px;">#171B27</div>
  <div style="background:#4FD1C5;color:#05060A;padding:12px;border-radius:10px;">#4FD1C5</div>
  <div style="background:#EEF1FF;color:#05060A;padding:12px;border-radius:10px;">#EEF1FF</div>
  <div style="background:#E9EDEF;color:#05060A;padding:12px;border-radius:10px;">#E9EDEF</div>
  <div style="background:#D66A2A;color:#FFFFFF;padding:12px;border-radius:10px;">#D66A2A</div>
  <div style="background:#2A1200;color:#FFE4CF;padding:12px;border-radius:10px;">#2A1200</div>
  <div style="background:#000000;color:#FFFFFF;padding:12px;border-radius:10px;">#000000</div>
</div>

---

## 4) Tokens CSS listos para implementacion

```css
:root {
  --dbx-bg: #05060A;
  --dbx-surface: #171B27;
  --dbx-accent: #4FD1C5;
  --dbx-text: #EEF1FF;
  --dbx-muted: #E9EDEF;
  --dbx-orange: #D66A2A;
  --dbx-orange-dark: #2A1200;
  --dbx-line: rgba(255,255,255,0.10);
  --dbx-panel: rgba(255,255,255,0.045);
  --dbx-panel-strong: rgba(255,255,255,0.075);
}
```

---

## 5) Reglas de uso (Colombia + Florida)

- Mantener el mismo set de codigos HEX para consistencia de marca regional.
- Digital: contraste minimo WCAG AA (`4.5:1` texto normal).
- Impresion: convertir a CMYK y validar con proof local.
- No usar mas de 2 acentos fuertes por pieza (teal + naranja maximo recomendado).

---

## 6) Entregables recomendados

- `SVG` del lockup (editable)
- `PNG` 1x y 2x (fondo oscuro y transparente)
- mini manual PDF con:
  - logo
  - paleta
  - tipografia
  - usos permitidos/no permitidos

