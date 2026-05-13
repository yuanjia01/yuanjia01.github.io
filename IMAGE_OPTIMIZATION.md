# Guía de Optimización de Imágenes

## 📐 Dimensiones Actuales

### Logos
- **Dimensiones originales**: 2362x1637 px (ratio 1.44:1)
- **Peso actual**: ~112-119 KB cada uno
- **Formato**: PNG

### Avatar
- **Archivo**: `avatar_con_fondoblanco.png`
- **Nota**: Necesita remoción de fondo blanco

## 🎯 Optimizaciones Recomendadas

### 1. Logos para Navbar

**Tamaños recomendados:**
- Versión para navbar: **200x138 px** (ratio 1.44:1)
  - Mobile: altura 24px
  - Desktop: altura 32px
  - Peso objetivo: 5-10 KB

**Cómo optimizar:**

#### Opción A: Usando herramientas online (Más fácil)
1. Ve a [TinyPNG](https://tinypng.com) o [Squoosh](https://squoosh.app)
2. Sube tus logos originales
3. Redimensiona a 200x138 px
4. Exporta como PNG optimizado
5. Reemplaza los archivos en `/public/`

#### Opción B: Usando ImageMagick (Línea de comandos)
```bash
# Instalar ImageMagick (si no lo tienes)
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Optimizar logo blanco
convert tmp_init/development/devpicon-logo-blanco.png \
  -resize 200x138 \
  -quality 85 \
  public/logo-white-optimized.png

# Optimizar logo negro
convert tmp_init/development/devpicon-logo-negro.png \
  -resize 200x138 \
  -quality 85 \
  public/logo-dark-optimized.png
```

#### Opción C: Usando Node.js con Sharp (Automático)
Crea un script `scripts/optimize-images.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');

async function optimizeLogos() {
  // Logo blanco
  await sharp('tmp_init/development/devpicon-logo-blanco.png')
    .resize(200, 138, { fit: 'contain' })
    .png({ quality: 85, compressionLevel: 9 })
    .toFile('public/logo-white-optimized.png');

  // Logo negro
  await sharp('tmp_init/development/devpicon-logo-negro.png')
    .resize(200, 138, { fit: 'contain' })
    .png({ quality: 85, compressionLevel: 9 })
    .toFile('public/logo-dark-optimized.png');

  console.log('✅ Logos optimizados');
}

optimizeLogos().catch(console.error);
```

Ejecutar:
```bash
node scripts/optimize-images.js
```

### 2. Avatar

**Recomendaciones:**
- **Dimensión**: 800x800 px (círculo)
- **Formato**: PNG con transparencia o WebP
- **Peso objetivo**: 50-80 KB

**Remover fondo blanco:**

#### Opción A: Online (Recomendado)
1. [Remove.bg](https://remove.bg) - Automático y gratis
2. [Photopea](https://photopea.com) - Editor tipo Photoshop gratis

#### Opción B: Photoshop/GIMP
1. Abrir imagen
2. Usar herramienta "Varita mágica" en fondo blanco
3. Eliminar selección
4. Exportar como PNG con transparencia

### 3. Miniaturas de Contenido

Si agregas imágenes a las tarjetas de contenido:

**Dimensiones recomendadas:**
- **Ancho**: 400px
- **Alto**: 225px (ratio 16:9)
- **Formato**: WebP (mejor compresión) o JPG
- **Peso objetivo**: 30-50 KB

## 🔧 Configuración de Next.js

Next.js optimiza automáticamente las imágenes cuando usas el componente `<Image>`:

```tsx
import Image from 'next/image';

<Image
  src="/logo-white.png"
  alt="Logo"
  width={200}    // Dimensión real
  height={138}   // Dimensión real
  quality={85}   // 1-100, default 75
  priority       // Cargar inmediatamente (para logos)
/>
```

### Formatos soportados
- **Entrada**: PNG, JPG, WebP, AVIF, GIF, SVG
- **Salida optimizada**: WebP (automático si el navegador lo soporta)

## 📊 Resultados Esperados

### Antes de optimizar:
- Logo: ~115 KB
- Avatar: ? KB
- **Total**: ~115+ KB

### Después de optimizar:
- Logo navbar: ~8 KB (reducción ~93%)
- Avatar: ~60 KB (si se optimiza bien)
- **Total**: ~68 KB (reducción ~40-50%)

## 🚀 Pasos Recomendados

1. **Inmediato**:
   - Usa [TinyPNG](https://tinypng.com) para comprimir logos actuales
   - Reemplaza archivos en `/public/`

2. **Corto plazo**:
   - Procesa avatar para quitar fondo blanco
   - Redimensiona a 800x800px
   - Optimiza con TinyPNG

3. **Opcional**:
   - Convierte logos a SVG (escalable infinitamente, ~5-10 KB)
   - Usa WebP para avatar (mejor compresión)

## 🔗 Herramientas Útiles

- [TinyPNG](https://tinypng.com) - Compresión PNG/JPG
- [Squoosh](https://squoosh.app) - Comparar formatos
- [Remove.bg](https://remove.bg) - Quitar fondos
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Optimizar SVG
- [Photopea](https://photopea.com) - Editor gratuito

## 📝 Actualizar después de optimizar

Después de crear las versiones optimizadas, actualiza el código:

```tsx
// En Navbar.tsx
<Image
  src={isDarkMode ? "/logo-white-optimized.png" : "/logo-dark-optimized.png"}
  alt="devpicon logo"
  width={200}
  height={138}
  className="h-6 w-auto md:h-8"
  priority
/>
```

## ⚡ Build Production

Al hacer `npm run build`, Next.js optimizará automáticamente todas las imágenes en `/public/` que uses con el componente `<Image>`.
