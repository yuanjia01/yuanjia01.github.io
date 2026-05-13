# 🎬 YouTube API - Guía Rápida (10 minutos)

## ✅ Checklist

- [ ] Crear proyecto en Google Cloud
- [ ] Habilitar YouTube Data API v3
- [ ] Crear API Key
- [ ] Obtener Channel ID
- [ ] Agregar secrets a GitHub
- [ ] Probar que funcione

---

## 📋 Paso 1: Google Cloud Console (5 min)

### 1.1 Crear Proyecto

1. Ve a: **https://console.cloud.google.com/**
2. Click en el selector de proyecto (arriba, al lado del logo de Google Cloud)
3. Click en **"NEW PROJECT"**
4. Nombre del proyecto: `Portfolio Content`
5. Click **"CREATE"**
6. Espera 10-20 segundos a que se cree

### 1.2 Habilitar YouTube Data API v3

1. En el menú hamburguesa ☰ (arriba izquierda)
2. Ve a: **"APIs & Services"** → **"Library"**
3. En el buscador, escribe: `YouTube Data API v3`
4. Click en el primer resultado
5. Click en el botón azul **"ENABLE"**
6. Espera a que se habilite (~5 segundos)

### 1.3 Crear API Key

1. En el menú lateral, click en **"Credentials"**
2. Click en **"+ CREATE CREDENTIALS"** (arriba)
3. Selecciona **"API key"**
4. Se creará la key y verás un popup
5. **COPIA LA API KEY** (la necesitarás pronto)
6. (Opcional) Click en "RESTRICT KEY" para más seguridad:
   - Name: `YouTube Portfolio Key`
   - API restrictions → Selecciona **"YouTube Data API v3"**
   - Click **"SAVE"**

---

## 🆔 Paso 2: Obtener tu Channel ID (2 min)

### Opción A: Usando el script helper

```bash
# En tu terminal (en la carpeta del proyecto)
node scripts/get-youtube-channel-id.js TU_API_KEY
```

Reemplaza `TU_API_KEY` con la key que copiaste.

El script te dirá tu Channel ID. ¡Cópialo!

### Opción B: Manualmente

1. Ve a tu canal: **https://youtube.com/@devpicon**
2. Haz clic derecho en cualquier parte → **"View Page Source"** (Ver código fuente)
3. Presiona `Ctrl+F` (o `Cmd+F` en Mac)
4. Busca: `"channelId"`
5. Encontrarás algo como: `"channelId":"UCxxxxxxxxxxxxxxxxxxxxxx"`
6. Copia el ID (la parte `UCxxxxxxxxxxxxxxxxxxxxxx`)

---

## 🔐 Paso 3: Agregar a GitHub Secrets (2 min)

### 3.1 Acceder a Secrets

1. Ve a tu repositorio: **https://github.com/devpicon/devpicon.github.io**
2. Click en **"⚙️ Settings"** (arriba derecha)
3. En el menú lateral izquierdo:
   - **"Secrets and variables"** → **"Actions"**

### 3.2 Agregar YOUTUBE_API_KEY

1. Click en **"New repository secret"** (botón verde)
2. Name: `YOUTUBE_API_KEY` (exactamente así, mayúsculas)
3. Secret: Pega tu API key
4. Click **"Add secret"**

### 3.3 Agregar YOUTUBE_CHANNEL_ID

1. Click en **"New repository secret"** otra vez
2. Name: `YOUTUBE_CHANNEL_ID` (exactamente así, mayúsculas)
3. Secret: Pega tu Channel ID (el que empieza con UC...)
4. Click **"Add secret"**

---

## ✅ Paso 4: Verificar que Funciona (1 min)

### 4.1 Ejecutar el workflow manualmente

1. En tu repositorio, ve a la pestaña **"Actions"** (arriba)
2. En el menú lateral izquierdo, click en **"Update Latest Content"**
3. Click en **"Run workflow"** (botón gris/azul a la derecha)
4. Click en **"Run workflow"** en el dropdown verde
5. Espera 30-60 segundos
6. Verás la ejecución aparecer abajo
7. Click en ella para ver los detalles

### 4.2 Verificar el resultado

Si todo está bien, verás:
- ✅ Todos los pasos en verde
- 📺 "Obteniendo último video de YouTube..." → Éxito
- 📝 Un commit nuevo en tu repo con el contenido actualizado

Si algo falla:
- Click en el paso que falló
- Lee el error
- Verifica que los secrets estén bien nombrados (mayúsculas importan)
- Verifica que la API key sea válida

---

## 🎉 ¡Listo!

Tu sitio ahora se actualizará automáticamente cada día a las 8:00 AM UTC.

### 📊 Para ver tus actualizaciones:

1. Ve a **Actions** → **"Update Latest Content"**
2. Verás el historial de todas las ejecuciones

### 🔄 Para actualizar manualmente:

Puedes ejecutar el workflow cuando quieras desde la pestaña Actions.

---

## 🐛 Problemas Comunes

### "API key invalid"
- Verifica que la copiaste completa
- Asegúrate de que YouTube Data API v3 esté habilitada
- Espera 5 minutos (a veces tarda en propagarse)

### "Quota exceeded"
- La API gratuita tiene límite de 10,000 requests/día
- El script usa solo 1 request por ejecución
- No deberías llegar al límite con 1 ejecución diaria

### "Channel not found"
- Verifica tu Channel ID
- Prueba el script helper local primero
- Asegúrate de que sea el Channel ID, no el username

---

## 💰 Costos

**YouTube Data API v3 es GRATIS** siempre y cuando:
- No excedas 10,000 requests/día
- Con 1 ejecución diaria = 1 request/día
- Estás usando solo 0.01% de tu cuota 😊

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa los logs en Actions
2. Consulta `GITHUB_SECRETS_SETUP.md` para más detalles
3. Prueba el script localmente: `npm run update:content`

---

**Tiempo estimado total**: 10-15 minutos

¡Adelante! 🚀
