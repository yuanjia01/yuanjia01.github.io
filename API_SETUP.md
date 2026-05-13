# Guía de Configuración de APIs para Actualización Automática de Contenido

Esta guía te ayudará a configurar las APIs necesarias para que el script `update-content.js` pueda obtener automáticamente tu último contenido de YouTube y Spotify.

## 📊 Estado Actual

| Fuente | Estado | Requiere API Key | Funciona |
|--------|--------|------------------|----------|
| **Dev.to** | ✅ Funcionando | No | Sí |
| **Medium** | ✅ Funcionando | No | Sí |
| **YouTube** | ⚠️ Requiere config | Sí | Parcial |
| **Spotify** | ⚠️ Requiere config | Sí | No |

## 🎬 YouTube Data API v3

### Paso 1: Obtener API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **YouTube Data API v3**:
   - En el menú lateral: "APIs & Services" → "Library"
   - Busca "YouTube Data API v3"
   - Haz clic en "Enable"

4. Crea credenciales:
   - Ve a "APIs & Services" → "Credentials"
   - Haz clic en "Create Credentials" → "API Key"
   - Copia la API key generada

### Paso 2: Obtener tu Channel ID

Opción A: Desde la URL de tu canal
```
https://www.youtube.com/@devpicon
```
- Ve a tu canal → Ver código fuente
- Busca "channelId" o "externalId"

Opción B: Usando la API (necesitas la API key primero)
```bash
curl "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=devpicon&key=TU_API_KEY"
```

### Paso 3: Configurar en el proyecto

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# YouTube
YOUTUBE_API_KEY=tu_api_key_aqui
YOUTUBE_CHANNEL_ID=tu_channel_id_aqui
```

### Código actualizado para YouTube

Actualiza `scripts/update-content.js` para usar la API:

```javascript
async function getLatestYouTubeVideo() {
  try {
    console.log('📺 Obteniendo último video de YouTube...');

    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      console.log('⚠️  YOUTUBE_API_KEY o YOUTUBE_CHANNEL_ID no configurados');
      return null;
    }

    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=1&type=video`;

    const response = await fetchUrl(url);
    const data = JSON.parse(response);

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return {
        title: video.snippet.title,
        description: video.snippet.description.substring(0, 200),
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        date: video.snippet.publishedAt.split('T')[0],
        image: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Error obteniendo video de YouTube:', error.message);
    return null;
  }
}
```

## 🎙️ Spotify Podcasts API

### Opción 1: Spotify API (Recomendada pero compleja)

1. Ve a [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Crea una nueva aplicación:
   - Click en "Create app"
   - Nombre: "Portfolio Content Fetcher"
   - Description: "Fetch latest podcast episodes"
   - Redirect URI: `http://localhost:3000` (no se usará)

4. Copia el **Client ID** y **Client Secret**

5. Agregar al `.env.local`:
```env
# Spotify
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
SPOTIFY_SHOW_ID=1iyrRtXu0hrOQJyA7vdGiX
```

### Opción 2: RSS Feed (Más simple, si está disponible)

Algunos podcasts tienen feeds RSS públicos. Verifica si tu podcast tiene uno disponible en:
- Anchor
- Apple Podcasts
- Otras plataformas de hosting

### Código para Spotify con OAuth

Nota: Spotify requiere autenticación OAuth que es más compleja. Considera usar un servicio intermedio o actualización manual.

```javascript
async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

async function getLatestPodcastEpisode() {
  try {
    console.log('🎙️  Obteniendo último episodio de podcast...');

    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
      console.log('⚠️  Credenciales de Spotify no configuradas');
      return null;
    }

    const showId = process.env.SPOTIFY_SHOW_ID || CONFIG.spotify.showId;
    const url = `https://api.spotify.com/v1/shows/${showId}/episodes?limit=1`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const episode = data.items[0];
      return {
        title: episode.name,
        description: episode.description.substring(0, 200),
        url: episode.external_urls.spotify,
        date: episode.release_date,
        image: episode.images[0]?.url || ''
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Error obteniendo episodio de podcast:', error.message);
    return null;
  }
}
```

## 🔐 Archivo .env.local (Ejemplo completo)

Crea este archivo en la raíz del proyecto (NO lo subas a Git):

```env
# YouTube Data API v3
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxxx

# Spotify API
SPOTIFY_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SPOTIFY_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SPOTIFY_SHOW_ID=1iyrRtXu0hrOQJyA7vdGiX
```

## 🚀 Uso del Script

Una vez configurado:

```bash
# Actualizar contenido manualmente
npm run update:content

# O editar content.json directamente
# (Más rápido si solo quieres cambiar algo)
```

## 📅 Automatización (Opcional)

### Opción 1: GitHub Actions (Recomendado)

Crea `.github/workflows/update-content.yml`:

```yaml
name: Update Content

on:
  schedule:
    # Ejecutar todos los días a las 8:00 AM UTC
    - cron: '0 8 * * *'
  workflow_dispatch: # Permitir ejecución manual

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Update content
        env:
          YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}
          YOUTUBE_CHANNEL_ID: ${{ secrets.YOUTUBE_CHANNEL_ID }}
          SPOTIFY_CLIENT_ID: ${{ secrets.SPOTIFY_CLIENT_ID }}
          SPOTIFY_CLIENT_SECRET: ${{ secrets.SPOTIFY_CLIENT_SECRET }}
        run: npm run update:content

      - name: Commit changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add src/data/content.json
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: update latest content [skip ci]"
          git push
```

Luego agrega los secrets en GitHub:
1. Ve a tu repositorio → Settings → Secrets and variables → Actions
2. Agrega cada secret (YOUTUBE_API_KEY, etc.)

### Opción 2: Cron local (Más simple)

Si estás en Mac/Linux, edita tu crontab:

```bash
crontab -e
```

Agrega:
```bash
# Actualizar contenido diariamente a las 9 AM
0 9 * * * cd /ruta/a/tu/proyecto && npm run update:content && git add . && git commit -m "chore: update content" && git push
```

## 💡 Recomendación

**Para empezar (Más simple):**
1. Usa Dev.to y Medium (ya funcionan automáticamente)
2. Actualiza YouTube y Spotify manualmente editando `content.json` cuando publiques

**Para automatizar todo:**
1. Configura YouTube API (relativamente fácil)
2. Deja Spotify para más adelante (más complejo)
3. Usa GitHub Actions para ejecutar el script diariamente

## 🆘 Solución de Problemas

**Error: "quota exceeded"** (YouTube)
- La API gratuita de YouTube tiene límites
- Considera cachear los resultados
- O usar el RSS feed como alternativa

**Spotify no funciona**
- OAuth es complejo para scripts
- Considera actualizar manualmente
- O buscar si tu podcast tiene RSS en otra plataforma

**"Cannot find module 'dotenv'"**
```bash
npm install dotenv
```

Luego en el script:
```javascript
require('dotenv').config({ path: '.env.local' });
```
