# Guía para Actualizar Contenido

Este documento explica cómo actualizar el contenido que se muestra en tu sitio web.

## 📝 Actualizar el Contenido de las Tarjetas

El contenido de las tres tarjetas principales (Video, Podcast, Blog) se gestiona desde un único archivo JSON:

**Ubicación:** `src/data/content.json`

### Estructura del archivo

```json
{
  "latestContent": {
    "video": {
      "title": "Título de tu video",
      "description": "Descripción breve del contenido",
      "url": "https://youtube.com/@devpicon/video-id",
      "date": "2024-10-29",
      "image": ""
    },
    "podcast": {
      "title": "Título del episodio",
      "description": "Descripción del episodio",
      "url": "https://open.spotify.com/episode/id",
      "date": "2024-10-24",
      "image": ""
    },
    "blog": {
      "title": "Título del artículo",
      "description": "Resumen del artículo",
      "url": "https://dev.to/devpicon/articulo",
      "date": "2024-10-28",
      "image": ""
    }
  }
}
```

### Campos explicados

- **title**: El título que aparecerá en la tarjeta
- **description**: Una breve descripción (se mostrará máximo 3 líneas)
- **url**: El enlace al contenido completo
- **date**: Fecha en formato `YYYY-MM-DD` (el sitio la convertirá automáticamente a "Hace X días")
- **image**: (Opcional) URL de una imagen de miniatura

### Cómo actualizar

1. Abre el archivo `src/data/content.json`
2. Modifica los campos que necesites actualizar
3. Guarda el archivo
4. Los cambios se verán reflejados automáticamente al recargar la página

### Ejemplo de actualización

Si subes un nuevo video:

```json
"video": {
  "title": "Kotlin Coroutines explicadas",
  "description": "Tutorial completo sobre cómo usar Kotlin Coroutines en Android",
  "url": "https://youtube.com/@devpicon/watch?v=nuevo-video",
  "date": "2024-10-31",
  "image": ""
}
```

## 🎨 Personalizar Otras Partes

### Descripción Personal

Para cambiar tu descripción personal en la sección Hero:

**Archivo:** `src/components/HeroSection.tsx`

Busca la línea con el texto:
```tsx
Apasionado por la tecnología móvil y la creación de contenido...
```

### Roles Animados

Para modificar los roles que se muestran en la animación de tipeo:

**Archivo:** `src/components/HeroSection.tsx`

Busca el array `roles`:
```tsx
const roles = [
  'Mobile Developer',
  'Android Engineer',
  'Technical Leader',
  'Speaker',
  'Designer',
  'Content Creator',
];
```

### Enlaces de Redes Sociales

Para actualizar los enlaces del footer:

**Archivo:** `src/components/Footer.tsx`

Busca el array `socialLinks` y actualiza las URLs.

## 🔄 Automatización Futura

En el futuro, podrías automatizar la actualización del contenido usando:

1. **API de YouTube**: Para obtener tu último video automáticamente
2. **RSS de Spotify**: Para tu último episodio de podcast
3. **API de Dev.to**: Para tu último artículo de blog

Esto requeriría crear un script que actualice el `content.json` periódicamente o usar Server-Side Rendering para obtener los datos en tiempo real.

## 📦 Desplegar Cambios

Después de actualizar el contenido:

1. Haz commit de los cambios:
   ```bash
   git add src/data/content.json
   git commit -m "Actualizar contenido: [descripción del cambio]"
   ```

2. Push a main (se desplegará automáticamente):
   ```bash
   git push origin main
   ```

Los cambios estarán disponibles en tu sitio en 2-3 minutos.

## ❓ Problemas Comunes

**El contenido no se actualiza:**
- Verifica que el formato JSON sea correcto (usa un validador JSON online)
- Asegúrate de que las fechas estén en formato `YYYY-MM-DD`
- Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)

**Error de compilación:**
- Revisa que no hayas dejado comas al final del JSON
- Verifica que todos los strings estén entre comillas dobles
- Asegúrate de que todas las llaves `{}` estén correctamente cerradas
