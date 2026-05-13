# Configuración de GitHub Secrets para Actualización Automática

Esta guía te muestra cómo configurar de forma segura las API keys en GitHub para que el workflow automático pueda actualizar tu contenido sin exponer información sensible.

## 🔐 ¿Por qué usar GitHub Secrets?

- ✅ **Seguro**: Las claves nunca se exponen en el código
- ✅ **Privado**: Solo tú y GitHub Actions pueden acceder
- ✅ **Versionado**: No se guardan en Git
- ✅ **Fácil**: Configuración una sola vez

## 📋 Secrets Necesarios

| Secret Name | Descripción | Requerido | Obtener en |
|-------------|-------------|-----------|------------|
| `YOUTUBE_API_KEY` | API Key de YouTube Data v3 | Opcional | [Google Cloud Console](https://console.cloud.google.com) |
| `YOUTUBE_CHANNEL_ID` | ID de tu canal de YouTube | Opcional | Tu canal de YouTube |
| `SPOTIFY_CLIENT_ID` | Client ID de Spotify | Opcional | [Spotify Dashboard](https://developer.spotify.com/dashboard) |
| `SPOTIFY_CLIENT_SECRET` | Client Secret de Spotify | Opcional | [Spotify Dashboard](https://developer.spotify.com/dashboard) |

**Nota**: Si no configuras algunos secrets, esas fuentes se actualizarán manualmente o usarán valores por defecto.

## 🚀 Paso a Paso: Configurar Secrets en GitHub

### 1. Acceder a la Configuración del Repositorio

1. Ve a tu repositorio en GitHub: `https://github.com/devpicon/devpicon.github.io`
2. Haz clic en **⚙️ Settings** (arriba a la derecha)
3. En el menú lateral izquierdo, busca **"Secrets and variables"**
4. Haz clic en **"Actions"**

### 2. Agregar un Nuevo Secret

Para cada secret que quieras configurar:

1. Haz clic en el botón verde **"New repository secret"**
2. En **Name**, ingresa el nombre exacto (ej: `YOUTUBE_API_KEY`)
3. En **Secret**, pega el valor de tu API key
4. Haz clic en **"Add secret"**

### 3. Verificar los Secrets

Los secrets aparecerán listados pero **no podrás ver sus valores** (esto es bueno, es por seguridad).

Deberías ver algo como:
```
🔒 YOUTUBE_API_KEY          Updated X minutes ago
🔒 YOUTUBE_CHANNEL_ID       Updated X minutes ago
🔒 SPOTIFY_CLIENT_ID        Updated X minutes ago
🔒 SPOTIFY_CLIENT_SECRET    Updated X minutes ago
```

## 🎬 Obtener YouTube API Key

### Paso 1: Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto:
   - Haz clic en el selector de proyectos (arriba)
   - Click en **"New Project"**
   - Nombre: "Portfolio Content Fetcher"
   - Haz clic en **"Create"**

### Paso 2: Habilitar YouTube Data API v3

1. En el menú hamburguesa ☰, ve a **"APIs & Services" → "Library"**
2. Busca: **"YouTube Data API v3"**
3. Haz clic en el resultado
4. Haz clic en **"Enable"**

### Paso 3: Crear API Key

1. Ve a **"APIs & Services" → "Credentials"**
2. Haz clic en **"Create Credentials"**
3. Selecciona **"API key"**
4. Copia la API key generada
5. (Opcional) Haz clic en "Edit API key" y restringe a YouTube Data API v3

### Paso 4: Obtener tu Channel ID

**Opción A: Desde la URL de tu canal**

1. Ve a tu canal: `https://youtube.com/@devpicon`
2. Haz clic derecho → **"View Page Source"**
3. Busca (Ctrl+F): `"channelId"`
4. Copia el ID que aparece (ej: `UCxxxxxxxxxxxxxxxxxx`)

**Opción B: Usando la API**

```bash
curl "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=devpicon&key=TU_API_KEY"
```

### Paso 5: Agregar a GitHub Secrets

```
Name: YOUTUBE_API_KEY
Value: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX

Name: YOUTUBE_CHANNEL_ID
Value: UCxxxxxxxxxxxxxxxxxxxxxxx
```

## 🎙️ Obtener Spotify API Credentials

### Paso 1: Crear App en Spotify

1. Ve a [Spotify for Developers Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en **"Create app"**

### Paso 2: Configurar la App

- **App name**: Portfolio Content Fetcher
- **App description**: Fetch latest podcast episodes for portfolio
- **Redirect URI**: `http://localhost:3000` (no se usará, pero es requerido)
- **APIs used**: Marcar **Web API**
- Acepta términos y haz clic en **"Save"**

### Paso 3: Obtener Credenciales

1. En tu nueva app, verás:
   - **Client ID**
   - Haz clic en **"View client secret"** para ver el **Client Secret**
2. Copia ambos valores

### Paso 4: Agregar a GitHub Secrets

```
Name: SPOTIFY_CLIENT_ID
Value: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Name: SPOTIFY_CLIENT_SECRET
Value: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ✅ Verificar que Funciona

### Opción 1: Ejecutar Manualmente

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Actions"** (arriba)
3. Selecciona el workflow **"Update Latest Content"**
4. Haz clic en **"Run workflow"** → **"Run workflow"**
5. Espera 1-2 minutos
6. Verás si fue exitoso o falló

### Opción 2: Esperar la Ejecución Automática

El workflow se ejecuta:
- ⏰ Automáticamente cada día a las 8:00 AM UTC (3:00 AM hora de Perú/Lima)
- 🔄 Puedes cambiar el horario editando el `cron` en `.github/workflows/update-content.yml`

## 🔍 Monitorear Ejecuciones

1. Ve a **"Actions"** en tu repositorio
2. Verás el historial de ejecuciones
3. Haz clic en cualquiera para ver:
   - ✅ Qué contenido se actualizó
   - 📊 Resumen de las fuentes chequeadas
   - ❌ Errores si algo falló

## 🛠️ Cambiar el Horario de Actualización

Edita `.github/workflows/update-content.yml`:

```yaml
schedule:
  - cron: '0 8 * * *'  # 8:00 AM UTC
```

Ejemplos de cron:
```
'0 12 * * *'    # 12:00 PM UTC (mediodía)
'0 0 * * *'     # Medianoche UTC
'0 */6 * * *'   # Cada 6 horas
'0 8 * * 1'     # Lunes a las 8 AM
```

Usa [crontab.guru](https://crontab.guru/) para generar expresiones cron.

## 🔒 Seguridad

### ✅ Buenas Prácticas

- ✅ Los secrets están encriptados en GitHub
- ✅ No se muestran en los logs
- ✅ Solo accesibles en el contexto del workflow
- ✅ Puedes rotarlas en cualquier momento

### ⚠️ Importante

- ❌ **NUNCA** hagas commit de archivos `.env` o `.env.local`
- ❌ **NUNCA** pegues las API keys en issues o comments públicos
- ✅ Si expones una key accidentalmente, regénrala inmediatamente

### 🔄 Rotar una Key

Si necesitas cambiar una API key:

1. Genera una nueva key en el servicio (YouTube, Spotify, etc.)
2. Ve a GitHub Settings → Secrets → Actions
3. Haz clic en el secret
4. Haz clic en **"Update"**
5. Pega el nuevo valor
6. Revoca la key antigua en el servicio

## 🐛 Troubleshooting

### El workflow falla con "API key invalid"

1. Verifica que el secret esté correctamente nombrado (mayúsculas/minúsculas importan)
2. Asegúrate de que la API key sea válida
3. Para YouTube, verifica que la API esté habilitada en Google Cloud

### El workflow no se ejecuta automáticamente

1. Verifica que el archivo esté en `.github/workflows/update-content.yml`
2. Asegúrate de que el workflow esté en la rama `main`
3. Revisa que los permisos de Actions estén habilitados en Settings

### El contenido no se actualiza

1. Ve a Actions y revisa los logs
2. Verifica que haya cambios detectados
3. Si todo está igual, es normal que no haga commit

## 📊 Monitoreo

GitHub Actions te enviará emails si:
- ❌ El workflow falla
- ⚠️ Hay errores en la ejecución

Puedes desactivar esto en:
**Settings → Notifications → GitHub Actions**

## 💡 Tips

1. **Empieza con YouTube**: Es la más fácil de configurar
2. **Deja Spotify para después**: Es más complejo y opcional
3. **Prueba manualmente primero**: Usa "Run workflow" antes de confiar en el cron
4. **Monitorea la primera semana**: Asegúrate de que todo funcione bien

## 🆘 Ayuda

Si tienes problemas:
1. Revisa los logs en Actions
2. Verifica que los secrets estén configurados
3. Ejecuta `npm run update:content` localmente para debuggear
4. Revisa `API_SETUP.md` para más detalles de cada API

---

**¿Listo para configurar?** Comienza con YouTube, es lo más fácil y útil. Los blogs (Dev.to y Medium) ya funcionan sin configuración adicional.
